const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

// Each running server has its own bounded rate-limit window.
export function createRateLimiter({ limit = 5, maxEntries = 10000, now = Date.now } = {}) {
  const visitors = new Map();
  return (ip) => {
    const timestamp = now();
    for (const [key, value] of visitors) if (value.reset <= timestamp) visitors.delete(key);
    const current = visitors.get(ip);
    if (current?.count >= limit) return Math.max(1, Math.ceil((current.reset - timestamp) / 1000));
    if (!current && visitors.size >= maxEntries) return 60;
    visitors.set(ip, { count: (current?.count || 0) + 1, reset: current?.reset || timestamp + WINDOW_MS });
    return 0;
  };
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('too-large');
  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('too-large'); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(buffer));
}

export function createContactHandler({ fetchImpl = fetch, rateLimit = createRateLimiter() } = {}) {
  return async function contact(request, env, ip = 'unknown') {
    if (request.method !== 'POST') return json({ error: 'Use POST to send an enquiry.' }, 405, { Allow: 'POST' });
    const expectedOrigin = env.SITE_URL ? new URL(env.SITE_URL).origin : new URL(request.url).origin;
    const origin = request.headers.get('origin');
    if (origin && origin !== expectedOrigin) return json({ error: 'Please send your enquiry from this website.' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Unsupported request format.' }, 415);
    const retryAfter = rateLimit(ip);
    if (retryAfter) return json({ error: 'Too many enquiries. Please wait a few minutes and try again.' }, 429, { 'Retry-After': String(retryAfter) });
    let body;
    try { body = await readBody(request); }
    catch (error) { return json({ error: error.message === 'too-large' ? 'Your enquiry is too long.' : 'Please check your enquiry and try again.' }, error.message === 'too-large' ? 413 : 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Please check your enquiry and try again.' }, 400);
    if (typeof body.website === 'string' && body.website.trim()) return json({ ok: true });
    const limits = { name: [2, 100], email: [3, 254], company: [0, 150], message: [20, 5000] };
    const values = {};
    for (const [field, [min, max]] of Object.entries(limits)) {
      const value = typeof body[field] === 'string' ? body[field].trim() : '';
      if (value.length < min || value.length > max || (field !== 'message' && /[\r\n\x00-\x1f]/.test(value))) return json({ error: `Please check the ${field} field.` }, 400);
      values[field] = value;
    }
    if (!emailPattern.test(values.email)) return json({ error: 'Please enter a valid email address.' }, 400);
    if (!uuidPattern.test(body.submissionId || '')) return json({ error: 'Please refresh the page and try again.' }, 400);
    if (!env.RESEND_API_KEY || !emailPattern.test(env.RESEND_FROM_EMAIL || '') || !emailPattern.test(env.CONTACT_TO_EMAIL || '')) return json({ error: 'The enquiry service is not available yet. Please try again later.' }, 503);
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `mnklabs-contact/${body.submissionId}` },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          from: `MNK Labs Website <${env.RESEND_FROM_EMAIL}>`,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: values.email,
          subject: `MNK Labs project enquiry — ${values.name}`,
          text: `New project enquiry\n\nName: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || 'Not provided'}\n\nProject details:\n${values.message}`,
        }),
      });
      if (!response.ok) return json({ error: 'We couldn’t send your enquiry. Please try again shortly.' }, 502);
      const data = await response.json();
      if (!data.id) return json({ error: 'We couldn’t confirm your enquiry. Please try again shortly.' }, 502);
      return json({ ok: true });
    } catch { return json({ error: 'We couldn’t confirm your enquiry. Please try again shortly.' }, 502); }
  };
}
