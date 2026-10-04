# Bilal Ahmad — Architecture, Interiors & BIM

Next.js App Router + Sanity, implementing the approved **Material & Light v2** designs in designs/complete-portfolio-v2/.

## Run

Node.js 22.12+ is required.

    npm install
    cp .env.example .env.local
    npm run dev

Portfolio: http://localhost:3000  
Studio: http://localhost:3000/studio

The embedded Studio uses project **h80ypbl3**, dataset **production**. There is no separate Studio server.

## Design and interactions

Home, All Work, Architecture, Interiors, BIM, Project Detail, About, Expertise, and Contact follow the approved editorial layout. Responsive layouts use readable type and native scrolling. Motion uses CSS and a small viewport observer, with reduced-motion support. Mobile navigation and image lightboxes use native dialogs for focus containment and Escape handling.

Bilal's portraits are served directly from **public/images/bilal-charcoal.png** on Home and About, as requested. Replace this public asset to change the portrait. The optional Studio portrait field is retained for imported profile data but does not override these placements.

Technical drawings preserve their aspect ratio. Lightboxes have keyboard previous/next controls, captions, image counts, and focus return. Download links open original PDFs. Video playback is visitor initiated. Interactive 3D and its runtime dependencies have been removed.

## Sanity

In the Sanity project dashboard, add http://localhost:3000 under API → CORS origins with credentials allowed. Then open /studio and sign in. Add the deployed website's exact origin when hosting.

The Studio has separate Architecture, Interiors, and BIM collections. A new project created inside a collection receives that discipline automatically.

For each project:

1. Set title, slug, discipline, summary, cover image, and accessible image description.
2. Optionally set project type, location, year, contribution, studio credit, tools, and overview heading.
3. Upload gallery images. Choose **Selected views**, **Drawings & documentation**, or **Material & detail** for each image's display section.
4. Add captions, project story, downloadable files, and an optional video/poster.
5. Choose homepage feature/display order and publish.

Published content automatically populates cards, the matching collection, and its project detail page. Empty optional sections and their navigation links are omitted. A one-project collection gets an intentional editorial feature; later entries extend the grid without UI changes.

The site reads published content on each server request. Open pages refresh every 60 seconds when visible. Profile & website controls headline, introduction, biography, CV, contact/social links, experience and education. Private datasets need a server-only SANITY_API_READ_TOKEN.

### Import the supplied starter projects

The dataset was empty when checked. The local starter collection displays supplied renders/drawings until CMS content is published.

Set a private Editor token locally in .env.local as SANITY_API_WRITE_TOKEN, then run:

    npm run seed

This uploads the source portrait, CV, project images and PDFs, and imports the initial four projects plus profile. Existing documents are preserved. Tokens must never use NEXT_PUBLIC_ and must not be committed. Import before publishing new projects if you want the whole supplied collection retained.

Published projects replace starter projects. Publishing the profile initializes the CMS, allowing intentional empty collections after deleting all projects. A temporary Sanity failure serves the local collection.

No draft preview or cloud import is claimed until authenticated Studio setup/import has been completed.

## Enquiry delivery

The enquiry form validates on client and server, rejects foreign origins, bounds request size, and preserves text after delivery failures. It never shows success without confirmation from a configured delivery endpoint.

Set these server-only values to enable delivery:

    CONTACT_WEBHOOK_URL=https://your-existing-delivery-endpoint
    CONTACT_WEBHOOK_TOKEN=optional-bearer-token

The endpoint receives JSON with name, email, interest, and message, and must return 2xx only after accepting the enquiry. Keep its token private. Without this configuration, the form offers **Email directly** with a prefilled subject/message. This opens the visitor's email application; it does not claim to send email automatically.

The included rate limiter is per process (5 attempts per 15 minutes); use shared rate limiting for multi-instance production hosting. No real enquiry was sent during verification.

## Validation

    npm run typecheck
    npm run lint
    npm test
    npm run build
    npm run check:site

The route check requires the server running on localhost:3000 (or SITE_TEST_URL). Next.js may stream a not-found page with HTTP 200 after sending the layout; the route check requires not-found content plus noindex in that case.

## Hosting

Deploy to a server-capable Next.js host. Set:

    NEXT_PUBLIC_SANITY_PROJECT_ID=h80ypbl3
    NEXT_PUBLIC_SANITY_DATASET=production
    NEXT_PUBLIC_SITE_URL=https://your-domain

Use the exact site origin for Studio CORS. The live site never needs a write token. No new video is required for this design.

## Sources

Profile facts follow the supplied CV. Project images and PDFs are from the supplied Drive assets and retain their source credits. Source-grounded projects: Saleem Residence, Coffee Bean, BIM Portfolio, and Rising the Tech. Unverified project locations, awards, and statistics are omitted.
