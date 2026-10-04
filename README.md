# Bilal Ahmad — Architecture, Interiors & BIM

A Next.js App Router portfolio based on the Spatial Atelier concept, with a real Three.js architectural study and an embedded Sanity Studio.

## Start locally

Use Node.js **22.12+** (Node 24 LTS is recommended).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [the portfolio](http://localhost:3000) and [Sanity Studio](http://localhost:3000/studio).

Studio is embedded in the same app, so there is no second server or separate Studio installation. The existing Sanity project is **h80ypbl3**, dataset **production**.

## Connect your Sanity account

1. Open [Sanity project settings](https://www.sanity.io/manage/project/h80ypbl3).
2. Under **API → CORS origins**, add `http://localhost:3000` and allow credentials. The embedded Studio currently shows an **Add CORS origin** link that opens the correct project settings.
3. Return to `/studio`, reload, and sign in with the Sanity account that owns the project.
4. Add the production website origin with credentials when you deploy. Use exact origins rather than a wildcard.

The website reads only published content. A public dataset works without a read token. For a private dataset, set a server-only Viewer token as `SANITY_API_READ_TOKEN`; never prefix tokens with `NEXT_PUBLIC_`.

## Editing and publishing work

The Studio sidebar has separate **Architecture**, **Interiors**, and **BIM** collections. Creating a project from one of these collections preselects its discipline.

For each project:

- Add a title, generate a URL slug, choose its discipline, and write a short introduction.
- Upload a cover image and a meaningful image description.
- Add gallery images, captions, a project story, year/location, your contribution, and tools.
- Optionally upload an MP4/WebM walkthrough, a self-contained GLB model, and downloadable files such as drawings or presentation PDFs.
- Turn on **Feature on homepage** and set **Display order** if needed.
- Click **Publish**.

Published projects automatically receive a detail page and appear in the matching discipline archive. The homepage chooses one featured project per discipline, falling back to the first project in that discipline. Content is read on each server request; visible open pages refresh their content every 60 seconds. No UI editing, rebuild, or webhook is needed to publish a project.

**Profile & website** controls the name, homepage headline/introduction, biography, portrait, CV, contact/social links, experience, and optional homepage GLB/poster.

## Import the initial portfolio into Sanity

The website currently includes source-grounded local starter content from the supplied CV and Drive archive: Rising the Tech, Coffee Bean, Modeling & coordination, and Saleem Residence. This keeps the site usable before Sanity is populated.

To make that initial collection editable in Studio:

1. Create an **Editor** API token in your Sanity project's API settings.
2. Add it locally to `.env.local` as `SANITY_API_WRITE_TOKEN=...`. Keep this token private; don't paste it into chat or commit it.
3. Run:

```bash
npm run seed
```

The script uploads the original portrait/CV, optimized project images, and project PDFs, and creates four published projects plus the singleton profile document. It preserves documents that already exist and skips previously imported projects. Remove the write token afterward if you no longer need imports.

Once published Sanity projects exist, they replace the local starter collection. Import first if you want to keep every starter project when adding new work. Publishing the profile document also marks the CMS as initialized; clearing all projects after that intentionally leaves an empty archive.

If Sanity is temporarily unreachable, the site serves the local portfolio and logs the failure on the server.

## 3D

The homepage pavilion is a procedural **design study**, not one of Bilal's claimed projects. It supports orbiting, exterior/interior/BIM views, an exploded roof, hotspots, reset, and an expanded view. It uses a lightweight local scene without third-party model or environment downloads. Rotation is disabled on small screens and for reduced-motion preferences.

Upload a **GLB** in Profile & website to replace the study with your own model. Uploaded models get normalized framing and orbit controls. The example's layer switches and discipline hotspots are specific to the procedural study; arbitrary uploaded models do not expose those switches.

Use a self-contained GLB with embedded textures, Y-up orientation, sensible geometry, and preferably a file size under 10 MB. Project GLBs automatically appear on their project detail pages. A poster image provides a fallback when a GLB cannot load.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

The content tests verify discipline separation, replacement/removal of starter content, and nullable CMS settings. Desktop and mobile views should also be reviewed visually when changing layout or 3D behavior.

## Deploy

This is a server-rendered Next.js application. Deploy to hosting that supports the Next.js server, not a static export.

Set `NEXT_PUBLIC_SANITY_PROJECT_ID=h80ypbl3`, `NEXT_PUBLIC_SANITY_DATASET=production`, and `NEXT_PUBLIC_SITE_URL=https://your-domain`. Add that exact origin to Sanity CORS with credentials for Studio access. Run the normal Next.js build/start commands. No write token is required by the running website.

## Sources

The CV supplies professional roles, education, experience, and contact information. Project media comes from [the supplied Drive archive](https://drive.google.com/drive/folders/1wVwuAuVUCMSvEsyOWWFPy9o7dTNmU5kN). Project years and locations are included only where confirmed by the supplied material. The original PDFs retain their source branding and attribution.

Reference designs are retained in `designs/`. Integration follows [Sanity's embedded Studio guide](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs).
