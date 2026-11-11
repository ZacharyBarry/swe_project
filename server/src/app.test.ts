import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, createApp } from './app.js';
import { TEST_PROJECT_ID, type DrawingStore, type Sheet } from './drawings.js';

async function withStore(store: DrawingStore, run: (base: string) => Promise<void>) {
  const server = createApp(store).listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try { await run(`http://127.0.0.1:${address.port}`); }
  finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
}

test('uploaded PDF is listed and can be reopened through a separate request', async () => {
  const records = new Map<string, { sheet: Sheet; bytes: Buffer }>();
  const id = '00000000-0000-4000-8000-000000000002';
  const store: DrawingStore = {
    async list() { return [...records.values()].map((r) => r.sheet); },
    async save(filename, bytes) {
      const sheet = { id, project_id: TEST_PROJECT_ID, filename, storage_path: `${id}.pdf`, created_at: new Date().toISOString() };
      records.set(id, { sheet, bytes }); return sheet;
    },
    async open(key) {
      const record = records.get(key);
      return record ? { filename: record.sheet.filename, bytes: Uint8Array.from(record.bytes).buffer } : null;
    },
  };
  await withStore(store, async (base) => {
    const pdf = '%PDF-1.7\nsample test bytes';
    const upload = await fetch(`${base}/api/sheets?filename=Floor%20plan.pdf`, {
      method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: pdf,
    });
    assert.equal(upload.status, 201);
    assert.equal((await upload.json()).filename, 'Floor plan.pdf');
    const list = await (await fetch(`${base}/api/sheets`)).json();
    assert.equal(list.length, 1);
    const file = await fetch(`${base}/api/sheets/${list[0].id}/file`);
    assert.equal(file.status, 200);
    assert.match(file.headers.get('content-type') ?? '', /application\/pdf/);
    assert.equal(await file.text(), pdf);
    assert.equal((await fetch(`${base}/api/sheets/00000000-0000-4000-8000-000000000003/file`)).status, 404);
  });
});

test('invalid, oversized, and cross-site uploads never reach storage', async () => {
  let saves = 0;
  const store: DrawingStore = {
    async list() { return []; }, async open() { return null; },
    async save() { saves++; throw new Error('Should not save'); },
  };
  await withStore(store, async (base) => {
    for (const [name, body] of [['bad.txt', '%PDF-1.7'], ['bad.pdf', 'not a pdf'], ['empty.pdf', '']]) {
      const r = await fetch(`${base}/api/sheets?filename=${name}`, { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body });
      assert.equal(r.status, 400);
    }
    const large = await fetch(`${base}/api/sheets?filename=large.pdf`, {
      method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: Buffer.alloc(10 * 1024 * 1024 + 1),
    });
    assert.equal(large.status, 413);
    const crossSite = await fetch(`${base}/api/sheets`, { headers: { Origin: 'https://untrusted.example' } });
    assert.equal(crossSite.status, 403);
    assert.equal((await fetch(`${base}/api/sheets/not-a-uuid/file`)).status, 400);
    assert.equal(saves, 0);
  });
});

test('storage failures return an error rather than a saved result', async () => {
  const store: DrawingStore = {
    async list() { throw new Error('Test storage unavailable'); },
    async open() { throw new Error('Test storage unavailable'); },
    async save() { throw new Error('Test database unavailable'); },
  };
  await withStore(store, async (base) => {
    assert.equal((await fetch(`${base}/api/sheets`)).status, 502);
    const upload = await fetch(`${base}/api/sheets?filename=test.pdf`, {
      method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: '%PDF-1.7',
    });
    assert.equal(upload.status, 502);
    assert.ok((await upload.json()).error);
  });
});

test('API reports health and rejects unfinished routes', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));

  try {
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const base = `http://127.0.0.1:${address.port}`;
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), {
      status: 'ok',
      service: 'punch-list-api',
    });
    const missing = await fetch(`${base}/api/projects`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), {
      error: 'API route not implemented',
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
