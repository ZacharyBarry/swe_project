import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from './app.js';

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
