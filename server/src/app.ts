import express from 'express';
import { createDrawingStore, MAX_PDF_BYTES, type DrawingStore } from './drawings.js';

export function createApp(providedStore?: DrawingStore) {
  const app = express();
  app.disable('x-powered-by');
  let store = providedStore;
  const drawings = () => store ??= createDrawingStore();
  // Local development only until login/project permissions are implemented.
  app.use('/api', (req, res, next) => {
    const origin = req.headers.origin;
    if (req.headers['sec-fetch-site'] === 'cross-site' ||
      (origin && !['http://127.0.0.1:5173', 'http://localhost:5173'].includes(origin))) {
      res.status(403).json({ error: 'Only the local app can use this development API.' });
      return;
    }
    next();
  });
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'punch-list-api' }));
  app.get('/api/sheets', async (_req, res, next) => {
    try { res.json(await drawings().list()); } catch (error) { next(error); }
  });
  app.post('/api/sheets', express.raw({ type: 'application/pdf', limit: MAX_PDF_BYTES }), async (req, res, next) => {
    const filename = typeof req.query.filename === 'string' ? req.query.filename.trim() : '';
    if (!filename || filename.length > 255 || !filename.toLowerCase().endsWith('.pdf')) {
      res.status(400).json({ error: 'Choose a PDF filename of at most 255 characters.' }); return;
    }
    // A basic signature check; the viewer still handles corrupt/locked PDFs.
    if (!Buffer.isBuffer(req.body) || req.body.length < 5 || req.body.subarray(0, 5).toString() !== '%PDF-') {
      res.status(400).json({ error: 'The file must be a nonempty PDF.' }); return;
    }
    try { res.status(201).json(await drawings().save(filename, req.body)); } catch (error) { next(error); }
  });
  app.get('/api/sheets/:id/file', async (req, res, next) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) {
      res.status(400).json({ error: 'Invalid drawing ID.' }); return;
    }
    try {
      const file = await drawings().open(req.params.id);
      if (!file) { res.status(404).json({ error: 'Drawing not found.' }); return; }
      res.setHeader('Cache-Control', 'no-store');
      res.type('application/pdf').send(Buffer.from(file.bytes));
    } catch (error) { next(error); }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not implemented' }));
  const errorHandler: express.ErrorRequestHandler = (error, _req, res, _next) => {
    if (error.type === 'entity.too.large') {
      res.status(413).json({ error: 'PDFs must be 10 MB or smaller.' }); return;
    }
    if (!providedStore && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY)) {
      res.status(503).json({ error: 'Supabase is not configured. Follow README.md and restart the backend.' }); return;
    }
    console.error('Drawing request failed:', error.message ?? 'Unknown service error');
    res.status(502).json({ error: 'Could not access saved drawings. Check the Supabase setup and backend terminal, then try again.' });
  };
  app.use(errorHandler);
  return app;
}
export const app = createApp();
