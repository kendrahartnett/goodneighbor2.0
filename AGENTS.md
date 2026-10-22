# GoodNeighbor implementation guide

## Mission

Build a small, trustworthy Chicago volunteer-opportunity discovery app. Optimize for a calm, highly usable public experience and safe, uncomplicated editorial administration.

## Non-negotiable decisions

- Scope is Chicago only for v1.
- Seed and present exactly eight verified listings at launch; more may be added later via admin.
- Use Next.js App Router, React, TypeScript, Tailwind CSS, Neon PostgreSQL, Prisma migrations, Auth.js GitHub OAuth, custom fetch-based REST CRUD, and Vercel.
- There is one admin, identified by an allowlisted GitHub account identifier configured in environment variables. Do not build public accounts or role management.
- Visitors are sent to each organizer’s official external URL to act; GoodNeighbor does not collect sign-ups.
- Volunteer date/time is optional. A listing may be ongoing, date-specific, or have a next occurrence.
- All displayed opportunities must be marked verified. Do not imply organizer partnership unless substantiated.

## Source of truth and conflict resolution

When documents disagree, follow this order: PRODUCT_SPEC, TECHNICAL_SPEC, DESIGN_SPEC, TEST_PLAN, BUILD_PLAN. Preserve user decisions above. Record a decision in the docs if a material ambiguity appears; do not silently broaden scope.

## Engineering expectations

- Prefer server-rendered data for public listing pages. Use client components only for interactive behavior such as filters, slideshow controls, and admin forms.
- Use custom same-origin REST route handlers and `fetch`; do not introduce tRPC, GraphQL, server actions as the CRUD transport, Redux, or a CMS without approval.
- Validate all write payloads server-side. Return predictable JSON errors. Check authorization on every admin mutation.
- Never expose database credentials, OAuth secrets, or admin identifiers to browser code. Do not commit `.env` files.
- Apply Prisma migrations rather than using schema push for durable environments.
- Build accessible semantic HTML first; preserve keyboard, focus, reduced-motion, contrast, and screen-reader behavior as features—not polish.
- Ensure organizer links are external, clearly labeled, and safely opened.

## Content rules

- Seed data must consist of eight genuinely verified Chicago listings. Capture source URL and verification date in the record.
- Avoid fabricating organizations, opportunities, availability, addresses, or imagery claims.
- Use licensed, creator-owned, or appropriately generated imagery. Provide meaningful alt text; decorative imagery gets empty alt text.
- Dates and time zones should be clear. Chicago-local dates use `America/Chicago` in the interface.

## Required checks before handoff

- Run lint, type checking, production build, Prisma migration/deployment check, and the relevant automated tests.
- Manually test the public and admin flows at desktop and narrow mobile widths.
- Test keyboard-only behavior, visible focus, reduced motion, and an authenticated/unauthenticated admin boundary.
- Recheck current official documentation for version-sensitive Auth.js, Prisma/Neon, Next.js, and Vercel setup.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
