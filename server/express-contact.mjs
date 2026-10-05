import { Readable } from 'node:stream';
import { createContactHandler } from './contact-handler.mjs';
const contact = createContactHandler();
export function contactMiddleware(env) {
  return async (req, res) => {
    try {
      const request = new Request(`${req.protocol || 'http'}://${req.get?.('host') || req.headers.host}${req.originalUrl || req.url}`, {
      method: req.method,
      headers: req.headers,
      ...(req.method === 'POST' ? { body: Readable.toWeb(req), duplex: 'half' } : {}),
      });
      const response = await contact(request, env, req.ip || req.socket.remoteAddress);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: 'The enquiry service is temporarily unavailable.' }));
    }
  };
}
