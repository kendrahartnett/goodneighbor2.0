# GoodNeighbor technical specification

## 1. Architecture

Use a single Next.js App Router application deployed on Vercel. React server components load public data near the route. Client components own browser-only interaction. Prisma connects the app to Neon PostgreSQL. Auth.js provides GitHub OAuth sessions. Route handlers under `/api` provide the application’s CRUD HTTP interface, called with standard `fetch` from browser-side admin interactions.

## 2. Route map

| Route | Access | Responsibility |
|---|---|---|
| `/` | Public | Hero/slideshow, featured opportunities, trust copy |
| `/opportunities` | Public | Search/filter and published listing index |
| `/opportunities/[slug]` | Public | Published listing detail and organizer link |
| `/about` | Public | Mission and verification explanation |
| `/admin` | Allowlisted admin | Listing management dashboard |
| `/admin/listings/new` | Allowlisted admin | Create form |
| `/admin/listings/[id]` | Allowlisted admin | Edit form |
| `/admin/requests` and `/admin/requests/[id]` | Allowlisted admin | Private request inbox and detail |
| `/api/auth/[...auth]` | OAuth protocol | Auth.js handler; exact path must match current integration guidance |
| `/api/opportunities` | Public GET; admin POST | List public records / create |
| `/api/opportunities/[id]` | Public GET only for published; admin PATCH/DELETE | Read/mutate one record |
| `/api/admin/photos` | Allowlisted admin POST | Validate and upload a listing photo |
| `/api/opportunities/[id]/photo` | Public for published, admin for drafts | Stream a private Blob image |
| `/api/listing-requests` | Public POST; admin GET | Create a private request / read inbox |
| `/api/listing-requests/[id]` and `/photo` | Allowlisted admin GET; request `PATCH`/`DELETE` | Read private request/photo; archive, restore, or delete a request |

The exact Auth.js route location and configuration syntax are version-sensitive. Verify the currently supported Next.js App Router integration before coding.

## 3. Rendering and state boundaries

- Server: route shells, SEO metadata, public initial listing reads, authorization gate at admin routes, detail-page not-found handling.
- Client: slideshow controls/timer, filters and query-state UI, subtle animation state, admin form interaction, optimistic UI only when safely reversible.
- Database access remains server-only. Browser requests use same-origin `/api` endpoints with `fetch` and credentials handled by the session cookie.

## 4. Data schema

Implement the following conceptual models using Prisma. Names may be idiomatic but intent must not change.

### Opportunity

| Field | Type / rule |
|---|---|
| `id` | stable primary key |
| `slug` | unique URL-safe string |
| `title` | required |
| `organizationName` | required |
| `summary` | required, short public copy |
| `description` | required, longer public copy |
| `category` | required controlled enum; includes food security, environment, youth/community, housing/health, animal welfare, skills-based/virtual volunteering, and public safety |
| `neighborhood` | required Chicago neighborhood or service-area text |
| `addressText` | optional; do not require precise address |
| `phoneNumber` | optional organizer contact number; publish only when supported by the official source |
| `volunteerPositions` | optional free-text summary of verified volunteer roles; do not imply unverified openings |
| `dateType` | `ONGOING`, `DATE_SPECIFIC`, or `NEXT_OCCURRENCE` |
| `startsAt` / `endsAt` | optional timestamp; required only when applicable |
| `timeZone` | default `America/Chicago` |
| `commitmentText` | optional |
| `accessibilityText` | optional |
| `eligibilityText` | optional |
| `imageUrl` | optional, validated URL |
| `imageAlt` | required if image conveys content |
| `organizerUrl` | required validated https URL (allow http only if a real source requires it and document exception) |
| `sourceUrl` | required validated URL used for verification |
| `verifiedAt` | required timestamp |
| `status` | `DRAFT` or `PUBLISHED` |
| `createdAt`, `updatedAt` | timestamps |
| `publishedAt` | nullable publication timestamp; set on transition to published, cleared on draft |

### ListingRequest

Private record with `id`, required `name`, `contactInformation`, `email`, and `description`, nullable historical `photoUrl`, `createdAt`, and nullable `archivedAt`. Active inbox queries require `archivedAt = null`; archived inbox queries require a non-null value. No public request read route or public tracking identifier is exposed.

Use appropriate indexes for public query patterns: `status`, `slug`, category, and optionally verified date. `slug` is unique. Do not make a date mandatory.

### Auth data

Use the current Auth.js-required Prisma adapter models only if the selected current integration requires database-backed account/session data. Otherwise keep the database schema limited to product data. This is intentionally version-dependent and must be verified. Authorization still relies on a server-side allowlisted GitHub identity such as a stable user ID or login, not an arbitrary client-provided value.

## 5. Migrations and seed strategy

1. Create an initial Prisma migration for the durable schema.
2. Add a deterministic, idempotent seed process for exactly eight verified Chicago listings.
3. Seed must preserve or upsert via a stable unique key/slug and include source URL and verification date.
4. Use migration commands suitable for local development and production deployment; do not rely on `db push` for production.
5. Store `DATABASE_URL` only in environment configuration. Confirm Neon pooled/direct URL requirements for the installed Prisma version.

## 6. API contract

All responses are JSON. Writes validate content on the server and return a clear machine-readable error shape, for example `{ error: { code, message, fields? } }`. Do not leak implementation details.

| Method / endpoint | Auth | Behavior |
|---|---|---|
| `GET /api/opportunities` | Public | Return only published records; support optional query, category, and date-type filters with bounded pagination |
| `POST /api/opportunities` | Admin | Validate and create a listing; defaults to draft unless an explicit valid publish state is supplied |
| `GET /api/opportunities/:id` | Public/admin | Public gets only published; admin can retrieve drafts |
| `PATCH /api/opportunities/:id` | Admin | Partial validated update, including publish state |
| `DELETE /api/opportunities/:id` | Admin | Delete after an explicit admin confirmation in UI |

Use 400 for malformed input, 401 for absent session, 403 for non-admin session, 404 for unavailable records, 409 for unique collisions, and 500 only for unexpected server faults. Public routes must never expose drafts.

## 7. Authentication and authorization

- Configure GitHub OAuth credentials and Auth.js secret in server environment variables.
- After OAuth identity resolution, compare the identity to `ADMIN_GITHUB_ID` (preferred stable numeric ID) or a carefully normalized `ADMIN_GITHUB_LOGIN` fallback.
- Treat an authenticated but non-allowlisted user as unauthorized. Do not create a public user experience for them.
- Gate admin pages on the server and independently guard every POST/PATCH/DELETE route handler.
- Use current Auth.js documentation to determine callbacks, session strategy, adapter needs, trusted-host/proxy configuration, and environment variable names. These are version-specific.

## 8. Deployment

- Deploy the Next.js repository to Vercel.
- Configure production/preview environment variables in Vercel; never bake secrets into source.
- Create a production Neon database and use a migration deployment step appropriate to the confirmed Vercel workflow.
- Set GitHub OAuth callback URLs for local and production hosts after verifying current Auth.js conventions.
- Validate preview deployments against a safe database strategy; do not let previews mutate production seed data unintentionally.

## 9. Reliability, privacy, and security

- Validate URLs, lengths, enums, and date logic on the server.
- Escape/render user-managed text safely through React; never render raw HTML from listings in v1.
- Use `noopener noreferrer` for external new-tab links.
- Keep API error messages safe and generic around auth/database faults.
- Provide an error boundary and useful empty/loading states. Do not claim live availability.
- Vercel Blob stores uploaded JPEG/PNG/WebP files in a private store; PostgreSQL stores only URLs. Server uploads are capped at 3 MB with MIME and file-signature checks. Private photos are streamed through access-checked route handlers. Set `BLOB_READ_WRITE_TOKEN` locally and in Vercel, or use Vercel's connected-store OIDC runtime credentials (`BLOB_STORE_ID` with managed `VERCEL_OIDC_TOKEN`). No token reaches browser code. The 3 MB cap stays below Vercel's 4.5 MB function body limit.
- Public suggestion writes validate names, contact details, email, and description; attached photos are rejected. Admin authorization is checked for every request read and any historical request-photo read. The success dialog uses native modal focus/Escape behavior.
