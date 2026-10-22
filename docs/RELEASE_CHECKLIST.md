# Phase 5 release checklist

Record the date, environment, and result for every item. Do not mark the release ready from a successful build alone.

Production URL supplied by the owner: [goodneighbor-psi.vercel.app](https://goodneighbor-psi.vercel.app/). The October 10 browser pass was owner-approved for the previous build; repeat the affected layout and CRUD checks after this change is deployed.

## Automated gate

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build` (Prisma Client generation runs in `postinstall` during `npm ci`)
- [ ] On an isolated Neon branch using its direct `DIRECT_URL`, `npm run db:deploy` and `npm run db:verify-seed`. Run `npm run db:seed` only when intentionally populating that branch; do not seed production automatically.
- [ ] Confirm the database has exactly eight launch records, all published, Chicago-scoped, with official source/organizer URLs and genuine verification dates. Additional admin records must be accounted for separately.
- [ ] Test the additive address/phone/positions/category migration on an isolated Neon branch before applying it to Production. Existing records should retain null contact/position fields until sourced.
- [ ] Test the new publication/request migration on an isolated Neon branch. Confirm historical published rows received `createdAt` as the publication fallback and new publish transitions sort first.
- [ ] Connect one private Vercel Blob store to Development, Preview, and Production; confirm `BLOB_READ_WRITE_TOKEN` locally or connected-store OIDC credentials on Vercel without printing values.

## Manual browser gate

- [ ] Anonymous home → search/filter/reset → each of eight details → each official external organizer action.
- [ ] Unknown and draft slugs are unavailable publicly; anonymous API reads contain no drafts.
- [ ] Signed-out `/admin` redirects to `/admin/sign-in`; anonymous writes return 401. Allowlisted GitHub account can enter and manage a draft. A different GitHub account sees the access message and writes return 403. Sign-out returns to the sign-in page.
- [ ] Create, edit, publish, unpublish, and delete a temporary draft on the isolated branch; check public visibility before and after publication. Verify useful field errors and deletion confirmation.
- [ ] Test keyboard navigation, focus, labels/errors, slideshow controls, and reduced motion at desktop and narrow mobile widths. Check 200% zoom, image failure, and slow network states; test Chromium, Firefox, and Safari where available.
- [ ] Verify Chicago-local date formatting and ongoing listings without fabricated dates.
- [ ] Recheck the resized homepage hero and slightly smaller page headings at desktop/mobile, then create/edit a temporary listing with Address, Phone, Volunteer Positions, and each new category.
- [ ] Check one-line desktop hero, natural mobile wrap, centered admin sign-in, compact dashboard, About page images and captions, photo/no-photo listing layouts, and image-load failure behavior.
- [ ] Submit a text-only visitor listing request; verify field errors, attached-photo rejection, success dialog focus/Escape/close, admin-only inbox/detail, and newest-first order. Verify the on-screen promise has an operational follow-up for confirmation if published.

## Production setup and release

1. Link the existing Vercel project. Keep `.vercel` local/ignored. Vercel should use the repository's `npm run build`, with no build-command override that runs migrations.
2. Configure Production `DATABASE_URL` (pooled), `DIRECT_URL` (direct), `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, and `ADMIN_GITHUB_ID` (or `ADMIN_GITHUB_LOGIN`) in Vercel. Set Preview database URLs to an isolated Neon branch. Never paste values into this file, logs, or source control.
3. Create/configure a production GitHub OAuth app with callback `https://<production-host>/api/auth/callback/github`. Keep the local OAuth app/callback separate. Set the production credentials only in Vercel Production.
4. Test the committed migration on a Neon branch of production. After review, deliberately run `npm run db:deploy` against the intended production direct URL. Never use `db push` or a Vercel preview build to migrate production.
5. Intentionally seed the production database once, only after reviewing the eight current official source links and the target branch. Do not seed through an automatic deployment hook; subsequent admin edits must not be overwritten by a repeat seed.
6. Deploy a Vercel preview using its isolated database and exercise the manual gate. Then deploy to Production and repeat the anonymous, admin OAuth, external-link, and database-count checks on the live hostname.
7. Apply the new committed migration to the intended production direct URL before deploying code that queries `ListingRequest` or `publishedAt`. Configure Blob storage before enabling photo upload in Production.
8. Apply `20261013000000_listing_request_archive` to the intended production direct URL before deploying inbox archive code. Check Active/Archived, Restore, confirmed Delete, and the new-opportunity form with its optional photo field on Preview first. A photo upload requires the private Blob connection; saving without a photo does not.

## Current open release blockers

- Assign the single admin the monthly [content-review routine](CONTENT_REVIEW.md), reverify all eight official sources at launch, and unpublish any listing that cannot be substantiated. The six-month dashboard cue does not replace launch verification.

- The repository is not linked to Vercel in this workspace, so production environment values, callbacks, preview behavior, and the live deployment cannot yet be verified here.
- Source re-verification found that the seed calls Nourishing Hope by its former name, Lakeview Pantry. The Chicago HOPES for Kids official page currently says Spring 2026 volunteer recruitment is closed. Chicago Cares' listed URL did not respond to this check. Resolve all three before marking the eight listings verified and seeding production.
- The owner supplied a responding Vercel URL and approved the previous browser pass, but this new UI/CRUD change needs focused browser regression testing. The currently configured local database branch has seven published records in the latest read-only check; its identity and the missing record need review before the eight-listing launch gate can pass.
