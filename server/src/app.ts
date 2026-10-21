import express from 'express';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'punch-list-api' });
});

// Add project and punch-item routes here as those features are implemented.
app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not implemented' });
});
