# GoodNeighbor build plan

## Phase 0 — Confirm foundations

1. Initialize the chosen current stable versions of Next.js App Router, React, TypeScript, and Tailwind.
2. Verify current official guidance for Auth.js GitHub OAuth, Prisma plus Neon connection URLs/adapter needs, migrations on Vercel, and deployment environment variables.
3. Record exact package versions and any integration decisions in project documentation.

**Acceptance:** local application boots; deployment path and environment-variable list are known; no version-sensitive behavior is guessed.

## Phase 1 — Data and admin boundary

1. Implement Prisma schema and first migration.
2. Build idempotent seed data for eight verified Chicago listings from official source URLs.
3. Configure Auth.js GitHub OAuth and strict server-side single-admin allowlist.
4. Implement server-side authorization helpers and protected admin route boundary.

**Acceptance:** migration/seed works in a clean database; only the intended GitHub identity can access admin; public data never includes drafts.

## Phase 2 — CRUD API and administration

1. Define validation schema and REST route handlers.
2. Build admin listing view and create/edit/publish/delete workflows using fetch-based CRUD.
3. Add structured errors, confirmation for deletion, and verification-date cues.
4. Add a visible admin sign-out control so the allowlisted and non-allowlisted GitHub journeys can be tested separately on a shared browser.

**Acceptance:** admin can safely manage listings end to end; authorization and validation test cases pass.

## Phase 3 — Public discovery

1. Implement home, opportunities index, listing detail, and about pages.
2. Load public records server-side and implement accessible client search/filter controls.
3. Add metadata, not-found/error states, clear external organizer actions, and Chicago-local date formatting.

**Acceptance:** anonymous journey from discovery through organizer link works for all seeded listings.

## Phase 4 — Visual system and motion

1. Apply design tokens, typography, grid, logo/mark, cards, buttons, and form styling.
2. Add the accessible photo slideshow and restrained interface movement.
3. Add loader, responsive refinements, image failure behavior, and reduced-motion paths.

**Acceptance:** UI matches the earthy editorial direction and passes baseline accessibility checks at desktop/mobile.

## Phase 5 — Quality and release

1. Complete automated tests from TEST_PLAN.
2. Run manual visual, keyboard, reduced-motion, auth, and content verification passes.
3. Configure Vercel, production Neon, GitHub OAuth callbacks, and migration deployment workflow.
4. Verify production deployment and re-check all organizer/source links.
5. Verify private Blob storage for admin listing photos, the text-only public suggestion form and private inbox, newest-first publication ordering, and responsive editorial refinements.

**Acceptance:** release gate is met; exactly eight verified Chicago listings are live; no application code behavior extends beyond v1 scope.

## Risks to manage

- OAuth/Auth.js setup varies by version: validate against current primary docs before coding.
- Serverless database connections may require a specific Neon/Prisma connection configuration: confirm current recommendations.
- “Verified” data gets stale: display the verification date and establish an operational review cadence after launch.
- Rich imagery and motion can undermine speed/accessibility: optimize images and make motion optional.
