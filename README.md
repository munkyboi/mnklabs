# MNK Labs

React + Vite company website adapted from [Carlo Abella’s Kwekwek template](https://github.com/munkyboi/kwekwek), with MNK Labs branding, portfolio case studies, and a server-side Resend enquiry form.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

The Vite development server includes `/api/contact` middleware. Copy `.env.example` to `.env.local` and configure the server-only values to enable email delivery. Restart the development server after changing those values.

## Netlify deployment

Import `munkyboi/mnklabs` into Netlify and use the `main` branch. The committed `netlify.toml` sets:

- Build command: `npm run build`
- Publish directory: `dist/client`
- Functions directory: `netlify/functions`
- Node.js: 22

Netlify serves the React site from its CDN and bundles the contact endpoint as a serverless function at `/api/contact`. No persistent Node server is required. React routes reload through the SPA fallback. Use Git-based deployment so the function is deployed along with the static site; uploading only `dist/client` will not include the function.

In Netlify project configuration, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL` as environment variables available to **Functions** (or all scopes). Optionally set `SITE_URL` to restrict submissions to the canonical origin; if omitted, the request's own origin is used, which also supports Netlify preview URLs. Redeploy after changing runtime variables. Keep sending credentials scoped to production if deploy previews should not send mail.

The GitHub `production` secret does not transfer automatically to Netlify's Git builds. Copy the key securely through Netlify's environment-variable UI; do not commit it or put it in a build command. See [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

## Optional Node hosting

```sh
npm run build
npm test
HOST=0.0.0.0 PORT=8080 npm start
```

The optional Express server serves `dist/client` and the same contact handler. `npm run preview` and the bundled Sites worker provide static visual previews without a contact API.

## Contact delivery

Set these server-only environment variables on Netlify (or the optional Node server):

- `RESEND_API_KEY`: Resend sending key.
- `RESEND_FROM_EMAIL`: sender email on a domain verified in Resend, without a display name. Selected sender: `enquiries@mnklabs.net`. Use a Resend API key from the team that owns `mnklabs.net` and confirm its sending verification before enabling delivery. This sender does not create a receiving mailbox; visitor replies go to their supplied Reply-To address.
- `CONTACT_TO_EMAIL`: inbox that should receive project enquiries.
- `SITE_URL`: optional canonical website origin, such as `https://your-company-domain.example`.
- `TRUST_PROXY_HOPS`: Node/Express only; optional exact count of trusted reverse proxies. Netlify uses its trusted function context IP.

Never prefix these variables with `VITE_` or embed them in the client build. The form sends only to the server-configured inbox and sets the visitor’s email as Reply-To. It sends a plain-text enquiry and does not subscribe the visitor to marketing or send an automatic reply.

A GitHub Actions environment secret is available only to workflows that reference that environment. It is not automatically available on the hosting server. The existing `production` environment’s `RESEND_API_KEY` therefore needs a deployment integration or an equivalent secret on the chosen runtime host. The example CI workflow at `docs/setup/github-ci.yml.example` runs the build and tests without sending email or reading the production key. To enable it, copy it to `.github/workflows/ci.yml` using a GitHub connection with workflow permission.

Validation, maximum request size, an invisible honeypot, same-origin checks, per-process rate limiting, and Resend idempotency keys protect the endpoint. The handler rate limiter is per instance and resets on restart. Netlify also applies the function’s configured edge rate limit of five requests per IP/domain per ten minutes across instances. The server reports success only after Resend accepts an email ID; that is not a guarantee of inbox delivery. Tests mock Resend and send no email.

## Content and portfolio

Edit `src/content.js` for services and `src/projects.js` for portfolio descriptions, technology explanations, and screenshot captions. `/portfolio` lists the projects; `/portfolio/getprio` and `/portfolio/printcollective` are the case-study routes. Local screenshots are in `public/assets/projects/` and can be enlarged in the browser. Product-source notes are in `docs/portfolio-sources.md`.

The original HTML, CSS, and JavaScript are preserved in `archive/original-html/`. Photos, marks, and Raleway files are served locally. See `THIRD_PARTY_NOTICES.md` for attribution and `design-qa.md` for browser checks.
