1. Search Engine Optimization (SEO)

    Metadata API: Next.js generateMetadata is used to dynamically inject title tags, descriptions, and OpenGraph images for individual notices (e.g., generating a preview card when a notice is shared on WhatsApp).

    Sitemap & Robots: Automated generation of sitemap.xml and robots.txt to ensure public pages are easily indexed by Google, while strictly blocking the /adminrwa namespace.

2. Performance Targets

    Core Web Vitals: The architecture targets sub-second First Contentful Paint (FCP) and zero Cumulative Layout Shift (CLS).

    Caching Strategy: Public feeds heavily leverage Next.js caching. When an admin publishes a notice, the Server Action triggers revalidatePath, instantly updating the static cache without requiring subsequent visitors to hit the database.