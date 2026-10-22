# Phase 5 verification status — October 10, 2026

## October 13 inbox and creation-form update

- Listing Requests now have admin-only Active/Archived views, reversible Archive/Restore controls, and a confirmed permanent Delete control. Historical private request photos are deleted before their request record; a storage failure leaves the request intact. The new-opportunity form no longer presents photo upload or photo-description controls; existing-listing photo editing remains available.
- Migration `20261013000000_listing_request_archive` was applied and checked on the isolated `phase5-request-photo-check` Neon branch only. Production and `.env.local` were not changed. Browser testing archived and restored the isolated QA request, returning the inbox to three active and zero archived requests.
- Production still needs this migration before the updated inbox can be deployed. No request was deleted during browser testing.

Phase 5 is in progress, **not release-approved**. No Vercel or production database changes were made in this pass.

## October 12 implementation and isolated-branch verification

- Local browser testing now has `npm run dev:test`, which starts `localhost:3000` against the already-migrated isolated branch through process-only database overrides. The server was started and the home and authenticated admin dashboard rendered successfully. Plain `npm run dev` still reads the production URLs in `.env.local`, where the new migration is pending; do not mistake that startup for a ready Phase 5 test environment.

- Latest owner decision: visitor listing suggestions are text-only. The public form no longer shows a photo field and the POST route rejects nonempty photo attachments. Admin listing uploads remain optional. The nullable `ListingRequest.photoUrl` column and admin read route remain for historical attachments; no destructive migration is needed.

- The owner approved a new private visitor suggestion workflow, photo uploads, newest-first ordering, About copy, and responsive design refinements. The new migration applied cleanly on the isolated `phase5-request-photo-check` Neon branch; the original `.env.local` and production branch were not changed. Branch verification found eight published rows with publication timestamps and an empty request inbox before form testing.
- Final local lint, typecheck, 34 automated tests, and production build pass. Browser checks on the isolated branch confirmed desktop/mobile rendering, public suggestion submission with focus on its success dialog, Escape/focus restoration, and unauthenticated inbox redirection to admin sign-in. A test-only request was created on this expiring branch.
- Vercel private Blob storage still needs a project store and production OIDC setup (or `BLOB_READ_WRITE_TOKEN` locally). Upload behavior against a configured Blob store, allowlisted admin inbox access, and deployed production regression are pending owner/environment setup.
- A visitor confirmed text-only suggestion submission locally, but photo submission returned a generic 503 while Blob credentials were absent from `.env.local`. The API now returns a specific storage-setup message and leaves the request unsaved, so the visitor can retry without the photo. No store was created and no credential was added in this pass.
- The isolated branch inherited a published record titled `test` from its parent. The total count is eight, but this record must be reviewed or replaced with an officially verified opportunity before release; this pass did not edit or reseed it.
- Three original generated, people-first volunteer photos now lead the homepage slideshow and support the About page. They are labeled illustrative, stored as optimized WebP files, and do not claim to depict a real organizer or event. Desktop and 390-pixel mobile hero crops and the About layout were visually checked; lint, typecheck, 34 tests, and production build still pass after this imagery change.
- The owner reported successfully testing the earlier contact/positions/category migration on a temporary Neon branch and restoring the original local database URLs afterward.
- Official source review of the eight launch records continues separately; do not re-seed Production automatically.

## Owner update — October 10, 2026

- The owner provided the production URL [goodneighbor-psi.vercel.app](https://goodneighbor-psi.vercel.app/) and approved their browser-automation review of the prior build. A read-only HEAD request returned HTTP 200. This does not verify the deployed commit, production environment variables, or OAuth callback.
- The owner is reviewing the eight official seed sources and will update content at a later testing time. Seed records have therefore not been changed or re-seeded.
- The owner requested a smaller landing hero, slightly smaller page headings, optional Address/Phone/Volunteer Positions in admin CRUD and public details, and three additional categories. A new additive migration has been prepared but **not applied to any database**. The existing `addressText` field is the Address field; only `phoneNumber` and `volunteerPositions` require new columns.
- For this change, Prisma schema validation and Client generation passed; lint, typecheck, 20 automated tests, and production build passed. A read-only migration-status check found the new migration pending on the currently configured branch, as intended.
- The latest read-only seed check on the currently configured branch reports `{ total: 7, published: 7, valid: true }`, down from eight in the earlier check. No seed data was changed during this work. The reason for the missing record and whether this branch is production are unconfirmed; do not reseed while the owner is reviewing official sources.
- The previous browser approval does not cover these latest UI/CRUD changes; a focused regression pass is still required.

## Completed locally

- `npm run lint`, `npm run typecheck`, `npm test` (9 tests), and `npm run build` passed.
- The ignored `.env.local` was loaded into the two read-only database checks without printing credentials. `prisma migrate status` reported one applied migration and an up-to-date schema. `scripts/verify-seed.ts` reported `{ total: 8, published: 8, valid: true }` on the currently configured branch. These checks do not establish which Vercel environment uses that branch.
- A local production-server HTTP smoke pass returned the home and opportunities index, all eight seeded detail routes, eight published API records, a filtered environment result, and a 401 response for an anonymous POST. The anonymous admin response targeted `/admin/sign-in`; an unknown detail produced Next.js's not-found stream marker.
- Reviewed current official Auth.js, Prisma v6, Next.js 16, Neon, and Vercel integration guidance; decisions are in `COMPATIBILITY_DECISIONS.md` and the release procedure is in `RELEASE_CHECKLIST.md`.

## Not completed / release blockers

- The earlier browser automation could not initialize here. The owner reports completing and approving their browser review for the previous build. The new hero, headings, and CRUD fields still need review after deployment.
- The production URL is known and responds, but this workspace has no confirmed local Vercel CLI link. Production/Preview environment separation, OAuth callback, and deployed revision have not been independently verified.
- The eight-record seed check validates presence and shape, not current availability or link accuracy. Official-source review found the Nourishing Hope rebrand, a Chicago HOPES for Kids recruitment-closed notice, and an unresponsive Chicago Cares URL. Resolve those content issues and recheck all eight official links before production seeding or release.
- A fresh install (`npm ci`) and migration deployment on a confirmed isolated Neon branch remain to be exercised. Do not run migrations on an unconfirmed target.
