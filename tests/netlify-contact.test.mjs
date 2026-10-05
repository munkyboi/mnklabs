import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

test('Netlify adapter bundles, uses runtime env and trusted client IP, and fails safely without credentials', async () => {
  const result = await build({
    entryPoints: ['netlify/functions/contact.mts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  });
  const envReads = [];
  const previous = globalThis.Netlify;
  globalThis.Netlify = { env: { get(key) { envReads.push(key); return undefined; } } };
  try {
    const adapter = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
    assert.equal(adapter.config.path, '/api/contact');
    const request = () => new Request('https://mnklabs.example/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://mnklabs.example', 'X-Forwarded-For': crypto.randomUUID() },
      body: JSON.stringify({ name: 'Example Client', email: 'client@example.test', message: 'A sample project enquiry for adapter verification.', company: '', website: '', submissionId: crypto.randomUUID() }),
    });
    for (let count = 0; count < 5; count++) {
      const response = await adapter.default(request(), { ip: '192.0.2.1' });
      assert.equal(response.status, 503);
      assert.match((await response.json()).error, /not available/);
    }
    assert.equal((await adapter.default(request(), { ip: '192.0.2.1' })).status, 429);
    assert.equal((await adapter.default(request(), { ip: '192.0.2.2' })).status, 503);
    assert.equal((await adapter.default(new Request('https://mnklabs.example/api/contact'), { ip: '192.0.2.2' })).status, 405);
    assert.ok(envReads.includes('RESEND_API_KEY'));
    assert.ok(envReads.includes('RESEND_FROM_EMAIL'));
    assert.ok(envReads.includes('CONTACT_TO_EMAIL'));
  } finally {
    if (previous === undefined) delete globalThis.Netlify;
    else globalThis.Netlify = previous;
  }
});
