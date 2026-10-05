# Portfolio source notes

Reviewed 2026-10-05. These notes support the public case-study copy in `src/projects.js`; they are not shipped as portfolio content.

## GetPrio

- Public product and ownership: https://getprio.online/ (verified in browser).
- Public customer/vendor discovery: https://getprio.online/vendors.
- Web stack and core behavior: `/Users/carloabella/Projects/getprio/web-app/worktrees/production/README.md`, `frontend/package.json`, `backend/package.json`.
- Mobile stack: `/Users/carloabella/Projects/getprio/mobile-app/worktrees/production/pubspec.yaml`.
- API surface: production backend `src/routes/`, including vendor operations, booking availability, platform administration, developer APIs, and mobile ticket/push routes.
- Screenshots: `getprio-home.png` is the public landing page; `getprio-connected.png` is its public marketing illustration, clearly labeled in the gallery; `getprio-discovery.png` is the public vendor directory. No authenticated customer/staff records were captured.
- Public landing page lists mobile downloads as coming soon. The case study describes the mobile codebase without claiming App Store or Play Store availability.

## PrintCollective

- Public product: https://printcollective.net/.
- Portfolio: https://printcollective.net/munky/gallery.
- Public artwork viewer: https://printcollective.net/munky/gallery/101195 (Swagger Interface).
- Dependency evidence: `/Users/carloabella/Projects/printcollective/dev/client/package.json`, `server/package.json`.
- Data architecture: project `docs/lean-architecture.md`.
- Media, deployment, commerce and email stack: `docs/digitalocean-deployment-plan.md`; media separation is described in that guide and `docs/metadata-only-media-cutover.md`.
- Fulfillment and authoritative pricing scope: `docs/printer-supplier-fulfillment-checklist.md`, plus server routes `print-job.routes.ts`, `supplier.routes.ts`, and `stripe-webhook.routes.ts`.
- Public viewer DOM exposes print types, dimensions, materials, and regional availability. All three screenshots show actual publicly accessible screens; the gallery and artwork viewer use the user's public MunkyBoi portfolio.

## Editorial boundaries

Case studies describe product behavior and repository-supported engineering decisions. They do not introduce revenue, conversion, usage, performance, or business-impact statistics. Deployment providers are presented as the documented infrastructure foundation, not a fresh infrastructure audit. No credentials, internal URLs, account details, or administrative screenshots are published.
