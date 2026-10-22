# Compatibility decisions — October 9, 2026

## Confirmed integration choices

- **Next.js:** use the current App Router convention: `app/**/route.ts` route handlers built on Web `Request`/`Response` APIs. Public pages remain server components; browser interaction is isolated to client components.
- **Auth.js:** use the current v5-style `auth.ts` export (`NextAuth({ providers: [GitHub] })`) and re-export `handlers` from `app/api/auth/[...nextauth]/route.ts`. Configure `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, and required production `AUTH_SECRET`. Authorization is separately enforced by the server-side GitHub ID/login allowlist.
- **Prisma + Neon:** this repository uses Prisma 6.19, a pooled Neon URL as `DATABASE_URL` for runtime through `@prisma/adapter-neon`, and a non-pooled `DIRECT_URL` in `prisma/schema.prisma` for CLI migrations. There is no `prisma.config.ts`; the Prisma 7 deprecation warning does not change the v6 migration behavior. Migrations are committed and production uses `prisma migrate deploy`, never `db push`.
- **Vercel:** deploy the standard Next.js application and configure secret environment variables in Vercel. Do not run seed scripts automatically on previews; run the deterministic seed intentionally against the intended database.

## Phase 5 release decisions — October 10, 2026

- Generate Prisma Client in `postinstall` as Prisma's Vercel guide recommends, so cached dependencies cannot leave the client stale after a schema change. Keep `npm run build` as `next build`; on Windows, generating while a development server holds Prisma's DLL can fail with `EPERM`.
- Do **not** run `prisma migrate deploy` in the default Vercel build. A preview build must never migrate the production database. Test migrations on an isolated Neon branch, then run `npm run db:deploy` deliberately with a direct production URL before the production deployment.
- Use a separate GitHub OAuth app for the production hostname; its callback is `https://<production-host>/api/auth/callback/github`. The local app keeps `http://localhost:3000/api/auth/callback/github`.
- Keep Preview `DATABASE_URL` and `DIRECT_URL` pointed at an isolated Neon branch, not production. Do not automatically seed previews.

## Additive listing fields — October 10, 2026

- Reuse the existing nullable `addressText` column for the requested Address field. Add nullable `phoneNumber` and `volunteerPositions` columns so the eight existing records do not receive fabricated contact details or positions.
- Add `ANIMAL_WELFARE`, `SKILLS_BASED_VIRTUAL`, and `PUBLIC_SAFETY` to the PostgreSQL category enum in a committed Prisma migration. The new values are available for future verified admin records; do not change the current seed while official-source review is ongoing.
- Prepare but do not apply this migration to an unconfirmed database target. Validate it on an isolated Neon branch using the direct URL before production deployment.

## Sources checked

- https://authjs.dev/reference/nextjs
- https://www.prisma.io/docs/orm/v6/overview/databases/neon
- https://nextjs.org/docs/app/getting-started/route-handlers
- https://vercel.com/marketplace/prisma/prisma-postgres
- https://www.prisma.io/docs/orm/v6/prisma-client/deployment/serverless/deploy-to-vercel
- https://authjs.dev/guides/configuring-github
- https://vercel.com/docs/environment-variables

## Environment variables

`DATABASE_URL`, `DIRECT_URL`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, and either `ADMIN_GITHUB_ID` (preferred) or `ADMIN_GITHUB_LOGIN`.

## October 12 request and photo integration

- Keep the existing Next.js 16 App Router route handlers and Auth.js v5-style allowlist. Current official docs still support `auth.ts` exports and `AUTH_GITHUB_*`/`AUTH_SECRET`; every new private handler checks the allowlist independently.
- Use `@vercel/blob` 2.8.1 with one **private** Blob store. Vercel's current private storage docs require SDK 2.3 or later. Server uploads capped at 3 MB fit below the documented 4.5 MB Vercel Function request limit. The SDK can use a connected store's OIDC credentials on Vercel or `BLOB_READ_WRITE_TOKEN` locally. Browser code receives neither credential. Database rows hold private Blob URLs; route handlers enforce published/admin visibility when streaming images.
- The October 12 owner follow-up removes public suggestion photo uploads. Blob is needed only for admin listing photos now. Preserve the nullable request photo column and protected historical read path without accepting new public attachments.
- Use the installed Next.js `Image` component for public photo sizing and local image route optimization; preserve no-photo text layouts. The Next.js 16 bundled docs deprecate `priority` in favor of `preload`, to address separately for the existing slideshow.
- The migration adds `publishedAt` and `ListingRequest`; historical published rows use `createdAt` as the only available publication approximation. New publish transitions record the actual time. Server queries sort by `publishedAt DESC, id DESC`.
- Official sources checked: https://vercel.com/docs/vercel-blob/private-storage , https://vercel.com/docs/vercel-blob/server-upload , https://nextjs.org/docs/app/api-reference/components/image , https://authjs.dev/reference/nextjs , and https://www.prisma.io/docs/orm/v6/prisma-client/deployment/serverless/deploy-to-vercel .

## October 15 admin photo control

- The owner requested the optional photo upload control be restored to the admin new-opportunity form before connecting Vercel Blob. This supersedes the earlier create-form omission. The public visitor suggestion form remains text-only. A listing may still be saved without a photo; a selected photo requires the private Blob store and meaningful alt text. No schema change is needed.
