# MNK Labs

React + Vite company website adapted from [Carlo Abella’s Kwekwek template](https://github.com/munkyboi/kwekwek), with MNK Labs branding, portfolio case studies, and a server-side Resend enquiry form.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

The Vite development server includes `/api/contact` middleware. Copy `.env.example` to `.env.local` and configure the server-only values to enable email delivery. Restart the development server after changing those values.

## Production

```sh
npm run build
npm test
HOST=0.0.0.0 PORT=8080 npm start
```

The Node/Express server serves `dist/client`, handles React route fallbacks, and accepts contact requests at `/api/contact`. Deploy both the static output and server sources/dependencies. `npm run preview` is a static visual preview and does not provide the contact API. The bundled Sites worker remains a static-only adapter and does not run the Node contact endpoint.

## Contact delivery

Set these environment variables on the running server:

- `RESEND_API_KEY`: Resend sending key.
- `RESEND_FROM_EMAIL`: sender email on a domain verified in Resend, without a display name.
- `CONTACT_TO_EMAIL`: inbox that should receive project enquiries.
- `SITE_URL`: canonical website origin, such as `https://your-company-domain.example`.
- `TRUST_PROXY_HOPS`: optional exact count of trusted reverse proxies. Leave unset for direct server access.

Never prefix these variables with `VITE_` or embed them in the client build. The form sends only to the server-configured inbox and sets the visitor’s email as Reply-To. It sends a plain-text enquiry and does not subscribe the visitor to marketing or send an automatic reply.

A GitHub Actions environment secret is available only to workflows that reference that environment. It is not automatically available on the hosting server. The existing `production` environment’s `RESEND_API_KEY` therefore needs a deployment integration or an equivalent secret on the chosen runtime host. The example CI workflow at `docs/setup/github-ci.yml.example` runs the build and tests without sending email or reading the production key. To enable it, copy it to `.github/workflows/ci.yml` using a GitHub connection with workflow permission.

Validation, maximum request size, an invisible honeypot, same-origin checks, per-process rate limiting, and Resend idempotency keys protect the endpoint. The rate limiter is in-memory and resets on restart; multi-instance hosting should provide a shared or edge rate limit. The server reports success only after Resend accepts an email ID; that is not a guarantee of inbox delivery. Tests mock Resend and send no email.

## Content and portfolio

Edit `src/content.js` for services and `src/projects.js` for portfolio descriptions, technology explanations, and screenshot captions. `/portfolio` lists the projects; `/portfolio/getprio` and `/portfolio/printcollective` are the case-study routes. Local screenshots are in `public/assets/projects/` and can be enlarged in the browser. Product-source notes are in `docs/portfolio-sources.md`.

The original HTML, CSS, and JavaScript are preserved in `archive/original-html/`. Photos, marks, and Raleway files are served locally. See `THIRD_PARTY_NOTICES.md` for attribution and `design-qa.md` for browser checks.
