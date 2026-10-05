import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contactMiddleware } from './express-contact.mjs';
const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'client');
app.disable('x-powered-by');
// Set only when your deployment has exactly this many trusted reverse proxies.
if (process.env.TRUST_PROXY_HOPS) app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
app.all('/api/contact', contactMiddleware(process.env));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
app.use(express.static(root));
app.get('/{*path}', (_req, res) => res.sendFile(path.join(root, 'index.html')));
app.listen(Number(process.env.PORT || 8080), process.env.HOST || '127.0.0.1', () => console.log('MNK Labs server is running.'));
