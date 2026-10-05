# MNK Labs React adaptation — design QA

final result: passed

## Target and evidence

Source: https://kwekwek.netlify.app/ and https://github.com/munkyboi/kwekwek.
Source visual truth: `docs/qa/source-desktop.png`, `docs/qa/source-mobile.png`, `docs/qa/source-mobile-menu.png`.
Implementation: `docs/qa/implementation-desktop.png`, `docs/qa/implementation-mobile.png`.
Desktop viewport and captures: 1280 × 720 CSS/pixels. Mobile: 390 × 844 CSS/pixels. Density 1; no resampling required. State: settled home page, top of scroll, drawer closed. Source and implementation images were emitted together in the same comparison input for both sizes.

## Findings

No actionable P0/P1/P2 visual findings against the intended MNK Labs adaptation.

- Typography: local Raleway 400/700 matches the reference. Display sizes and outlined CTA weight retained. Intentional longer company headline wraps onto two desktop lines and three mobile lines.
- Layout rhythm: desktop 64px section padding and 640px hero panel retained. Native scrollbar reserves 15px, shifting the centered panel by approximately 7px. Mobile uses 24px outer padding and a wider readable panel rather than the reference’s narrow 64px gutters. These are intentional usability adaptations.
- Colors: source #1a1423 overlay at .85, magenta panel at .5, yellow active navigation, and dark background retained. Body and button text brightened for readability. White sticky header observed after scrolling.
- Assets: actual repository photographs and MNK raster logo/icon files retained locally; no generated or drawn substitutes. Raleway bundled locally.
- Copy: source lorem ipsum, grid demonstrations, and button variant demonstrations replaced with existing MNK Labs studio/capability copy. Portfolio renamed Capabilities to avoid invented client work. Original MNK mark supplemented with LABS text.

Focused hero, navigation, and CTA details are readable in the full-resolution paired screenshots; separate crops were unnecessary. Additional rendered About, Contact, capability filter, mobile drawer, and scrolled service views were inspected in browser.

## Verification

- Home CTA navigates to About; About and Capabilities navigation routes work.
- All/Web/Mobile filters show 4/3/2 services respectively, with aria-pressed selection.
- Mobile drawer opens, focuses the first link, routes and closes, and Escape closes and restores focus to the menu button.
- Home services stack on mobile; scrolled header switches to white with dark logo and controls.
- Direct Capabilities reload and browser Back return correct pages.
- Mobile document width is 390px at a 390px viewport; main scroll width is 375px. No horizontal overflow.
- Browser captured warning/error logs: none.
- Production build passed. Four existing hosting/static route tests passed.
- Reduced-motion styles remove transition/reveal animations; preference behavior verified by source inspection, not browser emulation.

## Comparison history

Initial paired desktop/mobile comparisons found only the intentional branding, content, and mobile layout changes above. No visual repair iteration required. Stable React navigation/card components were moved outside App during interaction verification to preserve component identity across state changes; subsequent browser checks passed.

## Remaining configuration

Contact form now uses a server-side Resend endpoint. Hosting runtime, verified RESEND_FROM_EMAIL, and CONTACT_TO_EMAIL must be configured before launch; live delivery remains unverified.

## Checklist

- [x] Desktop and mobile reference comparison
- [x] Route, CTA, filter, and drawer checks
- [x] Local images and fonts
- [x] Production build and hosting route tests
- [ ] Supply business contact email before launch

## Follow-up polish

Optional: supply MNK Labs-specific photos and a dedicated combined wordmark in a later design iteration.

## Portfolio extension — 2026-10-05

final result: passed

New routes `/portfolio`, `/portfolio/getprio`, and `/portfolio/printcollective` are authorized additions. Existing design remains the reference for typography, dark surfaces, yellow details, outlined CTAs, spacing, and transitions. Project-specific additions use real public screenshots and product descriptions grounded in local owning repositories. Evidence: `docs/qa/portfolio-desktop.png` (1280 × 720), `docs/qa/portfolio-printcollective-mobile.png` (390 × 844), and six local product screenshots in `public/assets/projects/`. Screenshots captured at CSS density 1 with no resampling.

Visual checks: desktop portfolio columns align; screenshot aspect ratios are retained; mobile case-study headings, text, facts, and grids fit the viewport. Required typography, spacing, palette, screenshot quality, and copy surfaces reviewed. No actionable P0/P1/P2 findings. Product marketing artwork is explicitly captioned as such. The new pages are extensions rather than exact copies of a source screen.

Interaction checks: portfolio card to GetPrio; next-project navigation to PrintCollective; direct PrintCollective reload; mobile portfolio menu entry; all GetPrio screenshot selectors; PrintCollective gallery screenshot selection; native modal opening, close button, Escape, and mobile image loading. At 390px, document scroll width is 390px and main content width is 375px; no horizontal overflow on either case study. Browser warning/error log is empty. Final production build passes and the four existing static hosting/route checks pass.

Source detail and editorial boundaries: `docs/portfolio-sources.md`. No deployment performed.

## Contact form — 2026-10-06

Production build and all 11 tests pass (seven contact handler checks and four static hosting checks). Browser submission with synthetic details correctly displays an unavailable-service error when runtime configuration is missing, retains fields, restores the send button, and focuses the status. Production Node server serves a direct case-study route with HTTP 200 and returns HTTP 503 for an unconfigured contact submission. No email was sent. Screenshot: `docs/qa/contact-desktop.png`.

## Netlify hosting — 2026-10-06

Committed Netlify build configuration publishes `dist/client` with a modern function at `/api/contact` and a React route fallback. Function adapter is bundled in its test and verifies runtime environment lookups, trusted context IP rather than caller-supplied forwarding headers, safe unconfigured responses, method handling, and rate limiting. Production build and all 12 checks pass; no live email sent. Vite updated to the compatible 6.4.3 patch; dependency audit reports zero vulnerabilities.

Resend account check found only `getprio.online` verified for sending. Sender corrected to `enquiries@mnklabs.net` per user instruction; `mnklabs.net` must be verified in Resend before delivery; the receiving mailbox remains unconfigured. Netlify connector requires reauthentication, so no deployment or remote environment changes were performed.

## Sender correction — 2026-10-06

User requested `mnklabs.net`; selected sender updated to `enquiries@mnklabs.net` in setup configuration and documentation. Resend reports that domain belongs to another team, so it was not added or claimed in the currently connected account. Runtime API key must belong to its owning Resend team. No email or deployment performed.
