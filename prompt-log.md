# GoodNeighbor builder prompt log

## Build brief — October 9, 2026

> Read `README.md`, `AGENTS.md`, and every file in `docs/` before writing code. Build GoodNeighbor exactly to the documented v1 scope: a Chicago-only volunteer opportunity discovery app with exactly eight verified seeded listings, public search/filter/detail pages, and a single-admin dashboard. Use Next.js App Router, React, TypeScript, Tailwind, Neon PostgreSQL, Prisma migrations, Auth.js GitHub OAuth, custom fetch-based REST CRUD, and Vercel-ready configuration. First verify current official documentation for version-specific Auth.js, Prisma/Neon, Next.js, and Vercel integrations; record any necessary compatibility decision before implementation. Do not add user accounts, volunteer registration, a CMS, maps, or scope beyond the specs. Implement in phases, run the checks in `docs/TEST_PLAN.md`, and report the files changed, verification performed, and any blockers. I want to verify the build in steps as well. Explain what was done to be at each phase and record all of the prompts to highlight my abilities as a builder during this build in a file called "prompt-log.md" in this project. You can create that now as well.

## Builder capabilities demonstrated

- Converts an editorial product brief into an accessible, server-rendered application architecture.
- Checks primary documentation before choosing version-sensitive integrations.
- Designs a safe single-admin boundary and a validated REST CRUD surface.
- Uses authoritative organizer sources and transparent verification dates instead of fabricated availability.
- Builds in inspectable phases with tests and release checks.

## Phase 4 — visual system and motion — October 10, 2026

> Approved to continue and complete phase 4

### Builder capabilities demonstrated

- Establishes a coherent, reusable React component system rather than styling one-off pages.
- Uses intentionally generated, non-organizer imagery with descriptive alt text and an image-failure fallback.
- Builds an accessible, pausable slideshow with keyboard-reachable controls and a reduced-motion path.
- Carries accessible visual conventions through navigation, cards, filters, forms, loading states, focus states, and responsive layouts.
- Verifies the application through linting, type checks, automated tests, and a production build before handoff.

## Design refinement — October 10, 2026

> clean up the style and ui with this.

### Builder capabilities demonstrated

- Translates a detailed visual identity specification into a consistent production UI without expanding the v1 product scope.
- Applies a token-based forest, cream, sage, terracotta, and ochre system across public discovery and editorial administration.
- Improves the information hierarchy of search, details, dashboards, and authoring forms while preserving established React and REST behavior.
- Uses optimized local imagery and accessible, motion-aware interaction patterns.

## Logo, hero, and interface polish — October 10, 2026

> I need you to polish the ui. I want the logo here that I sent to be the logo and I also want the image to be a hero section near the top of the homepage. I want you to add more to the design and really polish the ui. The buttons and spacing needs to be adjusted. Review everything after you update with these changes. and then I will review before we move on. Fix this.

### Builder capabilities demonstrated

- Gives concrete visual feedback with references for brand, color, motion, homepage, and admin layouts.
- Directs an iterative review loop and retains final design approval.
- Balances presentation work with accessibility, responsive behavior, and functional verification.

## Admin authentication flow repair — October 10, 2026

> The admin login and logout, keeps sending me straight back into the dashboard, why am I not being redirected back to the github oauth sign in page? this need to be checked and fixed

### Builder capabilities demonstrated

- Identifies a real authentication-flow usability problem through hands-on testing.
- Asks for both root-cause investigation and a verified correction, including the difference between app logout and GitHub's browser session.

## Phase 5 approval — October 10, 2026

> Approved. Move on to Phase 5

### Builder capabilities demonstrated

- Uses explicit phase approval to move from feature work into a release-quality gate.
- Prioritizes tests, source verification, accessibility, safe database migration, and production configuration before launch.

## Phase 5 review and schema expansion — October 10, 2026

> for phase 5 status update: the vercel project link is: goodneighbor-psi.vercel.app. I verified all of the browser automation and I approve. I want you to correct that the hero image on the landing page needs to be a little smaller to fit the screen. The header text on the top of all the pages can be slightly smaller. I am verifying and reviewing the offical sources for the data seed. Add to the schema: Address, Phone, and Volunteer Positions to be a part of the CRUD. Volunteer categories also needs to include: Animal Welfare, Skills-Based & Virtual Volunteering, Public Safety. I will continue to review official sources and update data at a later testing time

### Builder capabilities demonstrated

- Supplies a live deployment URL and explicitly signs off on browser testing while keeping release judgment separate from the latest requested changes.
- Gives precise visual feedback on hero scale and page-heading hierarchy.
- Expands the editorial content model intentionally while preserving the eight existing records for later official-source review.

## Private listing suggestions and photo workflow — October 12, 2026

> Implement these changes now and then we will continue with phase 5 checks: Read `AGENTS.md` and all project documentation before making changes. Preserve the existing stack, Chicago-only scope, single GitHub allowlisted admin, REST route-handler CRUD, security, and accessibility requirements. Keep the home hero headline exactly “A little good goes a long way.” on one line at desktop widths; make the UI more concise and professional, especially the admin dashboard and centered sign-in; add optional listing photo uploads with safe Vercel-compatible storage and deliberate no-photo layouts; show newest published listings first; create a public listing suggestion form with name, contact, email, details, optional photo, server validation, private database storage, and accessible success dialog; add an admin-only request inbox; rewrite About using the supplied “Building a Stronger Chicago, One Neighbor at a Time” and “Small Acts. Big Impact” copy with accessible supporting photos; update documentation, migrations, tests, build, and manual verification.

### Builder capabilities demonstrated

- Specifies exact responsive and accessibility behavior, including focus management and screen reader support.
- Defines a scoped data and storage architecture with explicit admin privacy boundaries.
- Connects editorial content, design quality, database migration safety, and release verification in one change request.

## People-first volunteer photography — October 12, 2026

> create and adjust and add photos more like these to the app instead. One of the last 2 images would be best for the landinpage hero image. Generate images like these and implement into the project.

### Builder capabilities demonstrated

- Art-directs the product through concrete references: real human connection, cooperative volunteer work, and a more authentic photographic feel.
- Specifies where the strongest image belongs in the experience while leaving room for original, properly disclosed generated assets.

## Phase 5 database compatibility catch — October 12, 2026

> error: Runtime PrismaClientKnownRequestError ... The column `(not available)` does not exist in the current database. `src/app/page.tsx` queries `publishedAt`.

### Builder capabilities demonstrated

- Tests the real local app after a schema change and reports the exact failing query, enabling a targeted migration check.
- Keeps production database changes separate from isolated-branch verification.

## Photo-upload troubleshooting — October 12, 2026

> When I try to upload a photo i get this error: Photo (optional) JPEG, PNG, or WebP; up to 3 MB. Share only a photo you may submit. We could not receive your request. Please try again later.

### Builder capabilities demonstrated

- Tests the optional media path separately from text-only submission and reports the precise visible error.
- Drives a clearer failure state and an explicit storage-configuration check before release.

## Text-only public suggestions — October 12, 2026

> Let's just removed the photo upload option there in the user form

### Builder capabilities demonstrated

- Simplifies the visitor experience after testing revealed an unnecessary dependency on upload storage.
- Keeps the admin listing-photo workflow separate from public suggestions.

## Repeatable localhost browser testing — October 12, 2026

> I want to be able to run my browser testing on localhost:3000. I still cannot. What is happening and what needs to be fixed

### Builder capabilities demonstrated

- Identifies a release-testing workflow gap rather than treating a successful build as enough.
- Requires a repeatable local command that preserves production data and makes browser verification possible.

## Targeted discovery and review refinements — October 12, 2026

> Make these changes: 1. Change this opportunity filter: "Skills-based & virtual volunteering" to just say "Skills-based" 2. center the form submission received popup model after user submits form 3. add a button in the listing requests in admin to the listing view click that says, "verified and approved". It doesnt have to work but I want it to be there

### Builder capabilities demonstrated

- Refines public-facing terminology and submission feedback through hands-on testing.
- Shapes the editorial review interface while separating a visual placeholder from a working approval action.

## Ongoing trust and small-screen quality — October 12, 2026

> We need a way to establish an operational review cadence of the verified data after launch, like to reverify every 6 months. ** Also check the web for responsiveness on small screens and fix

### Builder capabilities demonstrated

- Treats data trust as an ongoing operational responsibility, with an explicit owner and repeatable six-month review rule.
- Tests the actual browser experience at narrow widths and turns observed overflow into a focused responsive fix.

## Inbox lifecycle and simpler listing creation — October 13, 2026

> Add an archive button and a delete option for the Listing Requests in /admin inbox. Completely Remove the photo option from the /admin "new opportunity" form.

### Builder capabilities demonstrated

- Defines a reversible editorial archive separately from irreversible, confirmed deletion.
- Simplifies the first-time listing workflow while preserving existing-listing photo management.

## Public-form abuse protection and privacy notice — October 15, 2026

> Ok i added the rate limit on Vercel. Can you help me integrate the honeypot. And add this next to the user listing request form: Your contact information is used only to review and follow up on this listing suggestion. It is not published or shared with volunteer organizations.

### Builder capabilities demonstrated

- Layers application-level bot filtering on top of an infrastructure-level rate limit.
- Makes the handling of visitor contact information explicit at the point of collection.
- Requires spam submissions to be discarded before any personal data reaches the database.

## Shared page texture — October 15, 2026

> I want to add a textured background on all of the apps pages. like something subtle but not just flat. like find a background pattern and replace

### Builder capabilities demonstrated

- Gives precise art direction for a site-wide visual change while keeping the existing palette and readable content surfaces.
- Reviews the texture in the running app before accepting it.

> Maybe a little stronger, polka dots

- Refines the visual direction after reviewing the first texture and requests a clearer repeating motif.
