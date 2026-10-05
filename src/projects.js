export const projects = [
  {
    slug: 'getprio', name: 'GetPrio', category: 'QUEUE MANAGEMENT / WEB + MOBILE',
    headline: 'A clearer wait. A calmer way to serve.',
    summary: 'A connected queue and booking platform that brings customers, service teams, and public displays into the same rhythm.',
    url: 'https://getprio.online/', cover: '/assets/projects/getprio-home.png',
    scope: 'Customer experience, vendor operations, platform tools, and mobile application',
    audience: 'Service businesses, their teams, and the people they serve',
    overview: [
      'GetPrio turns the queue into a connected digital experience. Customers can discover a business, join its queue from a phone or QR code, and follow their place without staying beside the counter. Staff manage the service flow from a vendor workspace, while a public board keeps the waiting area informed.',
      'The product combines customer-facing simplicity with the operational detail a service business needs: locations, counters, staff access, services, bookings, and queue history. The web experience and Flutter mobile application connect to the same backend so the product can evolve across several screens without maintaining separate queue rules.'
    ],
    challenge: 'A queue is shared state with real consequences. When a customer joins, a staff member calls the next ticket, or a business starts a new service day, everyone needs a consistent view. The engineering challenge is to make these moments dependable while keeping onboarding and daily use approachable for businesses of different sizes.',
    features: [
      ['Discover and join', 'A public vendor directory leads into business and location-specific entry points. QR-based joins and customer registration connect the first interaction to an identifiable ticket.'],
      ['Keep the queue moving', 'Vendor controls support calling, serving, and skipping tickets, with queue history and location management alongside the live operation.'],
      ['One queue, several screens', 'Public boards and customer-facing views receive live queue updates. Staff and customers can follow the same service sequence through interfaces designed for their different needs.'],
      ['Bookings alongside walk-ins', 'Service configuration and booking availability extend the platform beyond same-day queue entry. The data model supports the details needed to coordinate services and customer arrivals.'],
      ['A mobile customer experience', 'The Flutter application includes QR scanning, ticket views, account access, and notification integrations. It carries the customer journey onto iOS and Android; public store downloads remain listed as coming soon.'],
      ['Tools for the wider platform', 'Separate platform operations and developer experiences support tenant management, billing oversight, API documentation, and integration-oriented workflows.']
    ],
    engineering: [
      ['Tenant-aware by design', 'Business context is carried through vendor endpoints, queue records, and operations. This lets multiple vendors use the platform while maintaining business-specific settings and service flows.'],
      ['Consistent ticket numbering', 'PostgreSQL atomic counters generate daily ticket sequences per tenant. The database owns this operation so simultaneous joins do not rely on a browser-generated number.'],
      ['Live updates over SSE', 'Server-Sent Events carry queue changes from the API to public browser views. This fits the one-way update stream from service operations to customers and boards.'],
      ['Shared API, distinct experiences', 'React web applications and the Flutter customer app use backend services for account and queue behavior. Separate interfaces can serve customers, vendors, and operators while reusing core product rules.']
    ],
    stack: [
      ['Web experience', 'React, Vite, Mantine', 'Component-based interfaces for customer and vendor journeys, with a reusable UI foundation.'],
      ['API and application logic', 'Node.js, Express, TypeScript', 'HTTP endpoints for identity, queue operations, bookings, and platform administration.'],
      ['Data and live delivery', 'PostgreSQL, Server-Sent Events', 'Relational product data, atomic queue counters, and live public queue updates.'],
      ['Mobile', 'Flutter, Dart', 'A shared mobile codebase with QR scanning, secure local storage, and native authentication integrations.'],
      ['Messaging and assets', 'Resend, Firebase Cloud Messaging, Backblaze B2', 'Email and mobile notification integrations plus object storage for uploaded assets. Delivery depends on the relevant environment configuration.'],
      ['Local infrastructure', 'Docker Compose', 'A reproducible development stack for application services and PostgreSQL.']
    ],
    result: 'The result is a coherent product foundation for the full service journey: discovery, entry, waiting, and staff-led service. Its most valuable engineering work sits behind the simple customer experience—consistent queue state, tenant-specific operations, and shared behavior across web and mobile.',
    screenshots: [
      {src:'/assets/projects/getprio-home.png',title:'The customer entry point',caption:'Live public homepage, introducing QR entry and the mobile ticket experience.'},
      {src:'/assets/projects/getprio-connected.png',title:'The connected service experience',caption:'Public marketing illustration of the connected queue experience: board, customer phone, and vendor workspace.'},
      {src:'/assets/projects/getprio-discovery.png',title:'Vendor discovery',caption:'Live public vendor directory with search and business cards.'}
    ]
  },
  {
    slug: 'printcollective', name: 'PrintCollective', category: 'CREATOR COMMERCE / WEB PLATFORM',
    headline: 'From a digital portfolio to a physical print.',
    summary: 'A portfolio and print-commerce platform connecting artists and photographers with collectors, configurable products, and production workflows.',
    url: 'https://printcollective.net/', cover:'/assets/projects/printcollective-home.png',
    scope:'Public marketplace, creator portfolios, print commerce, and operational workspaces',
    audience:'Photographers, artists, collectors, and print suppliers',
    overview: [
      'PrintCollective gives visual creators a place to present their work and sell it as physical prints. A public discovery experience introduces artists, artworks, and collections. Creator galleries preserve the visual character of the work, while an artwork viewer connects browsing to the print-selection journey.',
      'The platform goes beyond a storefront. It brings together creator accounts, publication review, print materials and dimensions, pricing, shipping, checkout, and supplier-facing production flows. This connects the creative side of a portfolio with the operational requirements of producing and delivering a physical object.'
    ],
    challenge:'Selling artwork as a print requires more than adding a price to an image. The selected medium, dimensions, material, frame, delivery destination, and edition rules all affect what can be bought and fulfilled. At the same time, the original image file must remain distinct from the public preview used to discover the work.',
    features: [
      ['Discover the work', 'The public marketplace presents featured artworks, creators, and collections. Search and discovery give collectors several ways into the catalog.'],
      ['A portfolio with personality', 'Creator profiles and image-led galleries organize individual works and collections. The public viewer gives the artwork room to be seen before the purchase decision.'],
      ['Configure a physical print', 'The purchase journey includes print types, standard dimensions, materials, and framing choices. Destination availability determines which products are offered for a particular order.'],
      ['Commerce with product rules', 'Pricing and shipping are calculated by backend services before checkout. Stripe supports checkout and subscriptions, while order records connect the purchase to fulfillment.'],
      ['Review and publication', 'Creator applications and artwork review workflows provide an operational boundary between preparing content and exposing it in the public catalog.'],
      ['A path to production', 'Supplier and platform workspaces support print jobs, fulfillment actions, and commerce administration, extending the product beyond the collector-facing store.']
    ],
    engineering: [
      ['Public previews, protected originals', 'Backblaze B2 stores media while the application distinguishes display variants from print-quality originals. Access to sensitive source media can be authorized independently from public discovery.'],
      ['Backend-owned price calculations', 'Print geometry and configuration influence the quote. Server-side pricing and shipping calculations provide a consistent basis for checkout rather than accepting a total calculated only in the browser.'],
      ['A product-focused data model', 'PostgreSQL models users, artworks, collections, orders, payouts, media, and settings. The replacement API retains compatibility where useful while moving domain logic away from legacy WordPress storage concepts.'],
      ['Several workspaces, one platform', 'A React public client, platform portal, and supplier experience serve different roles. Express services provide the shared account, catalog, media, and commerce operations underneath them.']
    ],
    stack: [
      ['Web applications', 'React, Vite, React Router', 'The public discovery, creator portfolio, and purchase experiences, with separate operational interfaces.'],
      ['Interface and state', 'Redux Toolkit, TanStack Query, styled-components', 'Client state, server-data access, and reusable styling. The codebase also contains Semantic UI and newer Tailwind-based UI work.'],
      ['API and data', 'Node.js, Express, TypeScript, PostgreSQL', 'Typed backend services and relational records for catalog, accounts, commerce, and operations.'],
      ['Media processing', 'Backblaze B2, S3-compatible SDK, Sharp', 'Object storage and image-processing services for source media and display variants.'],
      ['Commerce and communications', 'Stripe, Resend', 'Checkout and subscription integrations plus transactional email services.'],
      ['Deployment foundation', 'Docker, Nginx, DigitalOcean, Cloudflare', 'Containerized applications and database, an origin reverse proxy, and the documented hosting and edge infrastructure.']
    ],
    result:'PrintCollective brings presentation and production into one product. Creators can organize their visual work, collectors can discover and configure prints, and operational teams have the services needed to move an order toward fulfillment. The engineering emphasis is on preserving image quality, making commerce rules consistent, and connecting each role to the right part of the workflow.',
    screenshots:[
      {src:'/assets/projects/printcollective-home.png',title:'Creator-led discovery',caption:'Live public homepage with a featured artwork and entry points for creating and discovering.'},
      {src:'/assets/projects/printcollective-gallery.png',title:'An image-led creator portfolio',caption:'MunkyBoi’s live public gallery, showing the masonry layout and creator-specific navigation.'},
      {src:'/assets/projects/printcollective-viewer.png',title:'Room for the artwork',caption:'Live public artwork viewer for “Swagger Interface,” with its entry point into buying a print.'}
    ]
  }
];
export const projectForPage = page => projects.find(project => page === `portfolio/${project.slug}`);
