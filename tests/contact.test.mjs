import assert from 'node:assert/strict';
import test from 'node:test';
import { createContactHandler, createRateLimiter } from '../server/contact-handler.mjs';
const valid = { name: 'Example Client', email: 'client@example.test', company: 'Example Studio', message: 'We would like to discuss a new web application.', website: '', submissionId: 'd8b1cc73-d81a-43a9-960f-3696d19964ef' };
const env = { RESEND_API_KEY: 'test-key-not-real', RESEND_FROM_EMAIL: 'website@example.test', CONTACT_TO_EMAIL: 'studio@example.test', SITE_URL: 'https://mnklabs.example.test' };
const request = (body = valid, options = {}) => new Request('https://mnklabs.example.test/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: env.SITE_URL }, body: JSON.stringify(body), ...options });
const noLimit = () => 0;

test('uses configured sender/recipient and reply-to; preserves idempotency on retry', async () => {
  const calls = [];
  const handler = createContactHandler({ rateLimit: noLimit, fetchImpl: async (url, options) => { calls.push({ url, options }); return Response.json({ id: 'email-id' }); } });
  assert.equal((await handler(request({ ...valid, to: 'attacker@example.test', from: 'attacker@example.test' }), env)).status, 200);
  assert.equal((await handler(request(), env)).status, 200);
  for (const call of calls) {
    const mail = JSON.parse(call.options.body);
    assert.deepEqual(mail.to, [env.CONTACT_TO_EMAIL]);
    assert.equal(mail.from, `MNK Labs Website <${env.RESEND_FROM_EMAIL}>`);
    assert.equal(mail.reply_to, valid.email);
    assert.equal(mail.text.includes(valid.message), true);
    assert.equal('html' in mail, false);
    assert.equal(call.options.headers['Idempotency-Key'], `mnklabs-contact/${valid.submissionId}`);
  }
});

test('invalid input and cross-origin submissions never reach the email provider', async () => {
  const handler = createContactHandler({ rateLimit: noLimit, fetchImpl: () => { throw new Error('must not send'); } });
  for (const body of [{ ...valid, email: 'invalid' }, { ...valid, name: 'Name\r\nInjected header' }, { ...valid, message: 'short' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, submissionId: 'bad-id' }, null]) {
    assert.equal((await handler(request(body), env)).status, 400);
  }
  assert.equal((await handler(request(valid, { headers: { 'content-type': 'application/json', origin: 'https://foreign.example.test' } }), env)).status, 403);
  assert.equal((await handler(request(valid, { headers: { 'content-type': 'text/plain' } }), env)).status, 415);
});

test('rejects oversized streamed payloads even without Content-Length', async () => {
  const handler = createContactHandler({ rateLimit: noLimit });
  assert.equal((await handler(request({ ...valid, message: 'x'.repeat(20000) }), env)).status, 413);
});

test('honeypot submissions do not send mail', async () => {
  let sent = false;
  const handler = createContactHandler({ rateLimit: noLimit, fetchImpl: async () => { sent = true; return Response.json({ id: 'x' }); } });
  assert.equal((await handler(request({ ...valid, website: 'spam' }), env)).status, 200);
  assert.equal(sent, false);
});

test('provider failure and missing configuration never return success or provider details', async () => {
  const handler = createContactHandler({ rateLimit: noLimit, fetchImpl: async () => Response.json({ message: 'secret internal data' }, { status: 403 }) });
  const failure = await handler(request(), env);
  assert.equal(failure.status, 502);
  assert.equal((await failure.text()).includes('secret internal'), false);
  assert.equal((await handler(request(), {})).status, 503);
  const timeout = createContactHandler({ rateLimit: noLimit, fetchImpl: async () => { throw new Error('provider token'); } });
  assert.equal((await timeout(request(), env)).status, 502);
});

test('request rate limit expires and is isolated by visitor', async () => {
  let now = 1000;
  const limit = createRateLimiter({ limit: 2, now: () => now });
  assert.equal(limit('one'), 0); assert.equal(limit('one'), 0);
  assert.ok(limit('one') > 0); assert.equal(limit('two'), 0);
  now += 600001; assert.equal(limit('one'), 0);
  const handler = createContactHandler({ rateLimit: () => 60 });
  const response = await handler(request(), env);
  assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60');
});

test('only POST requests are accepted', async () => {
  const handler = createContactHandler();
  assert.equal((await handler(new Request('https://mnklabs.example.test/api/contact'), env)).status, 405);
});

test('diagnostics identify configuration and provider failures without logging secrets or enquiry contents', async () => {
  const logs = [];
  const handler = createContactHandler({ rateLimit: noLimit, log: (event) => logs.push(event), fetchImpl: async () => Response.json({ message: 'private provider response' }, { status: 403 }) });
  await handler(request(), { ...env, CONTACT_TO_EMAIL: '' });
  await handler(request(), env);
  assert.deepEqual(logs, [
    { event: 'contact_configuration_error', invalidSettings: ['CONTACT_TO_EMAIL'] },
    { event: 'contact_provider_rejected', status: 403 },
  ]);
  const logged = JSON.stringify(logs);
  for (const value of [env.RESEND_API_KEY, valid.email, valid.message, 'private provider response']) assert.equal(logged.includes(value), false);
});
