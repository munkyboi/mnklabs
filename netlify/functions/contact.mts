import type { Config, Context } from '@netlify/functions';
import { createContactHandler } from '../../server/contact-handler.mjs';

const contact = createContactHandler();

export default async (request: Request, context: Context) => {
  try {
    const env = {
      RESEND_API_KEY: Netlify.env.get('RESEND_API_KEY'),
      RESEND_FROM_EMAIL: Netlify.env.get('RESEND_FROM_EMAIL'),
      CONTACT_TO_EMAIL: Netlify.env.get('CONTACT_TO_EMAIL'),
      SITE_URL: Netlify.env.get('SITE_URL'),
    };
    return await contact(request, env, context.ip);
  } catch {
    return Response.json({ error: 'The enquiry service is temporarily unavailable.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};

export const config: Config = {
  path: '/api/contact',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['ip', 'domain'],
    windowLimit: 5,
    windowSize: 600,
  },
};
