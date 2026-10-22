# GoodNeighbor test plan

## Test approach

Use a layered approach: unit tests for pure validation/formatting, route/API integration tests for authorization and data boundaries, end-to-end tests for primary flows, and manual visual/accessibility checks. Select exact tools during implementation; this document defines behavior, not a mandated test library.

## Release gate matrix

| Area | Must verify |
|---|---|
| Seed/content | Exactly eight initial published, verified Chicago records; each has source, organizer URL, verification date, and valid public presentation |
| Public discovery | Home loads; index lists published records; search/filtering updates results; empty/reset state works |
| Detail | Valid published slug resolves; unknown/unpublished slug is not public; organizer link is correct and safely external |
| Date handling | Ongoing listings render without a fake date; dated listings show Chicago-local date/time accurately; invalid date combinations are rejected |
| Admin auth | Signed-out visitor is redirected/denied; allowlisted GitHub identity can enter; other GitHub identity cannot |
| CRUD | Admin can create draft, edit, publish, unpublish, and delete after confirmation; public visibility changes only for published state |
| API security | GET never leaks drafts publicly; every mutation requires allowlisted admin; invalid payloads return structured 400 errors; IDs not found return 404 |
| Database | Fresh migration applies; repeatable seed is idempotent; constraints prevent duplicate slugs |
| UX | Clear loading, error, empty, and success feedback; controls work on narrow screens |
| Accessibility | Keyboard pass, focus visibility, labels/errors, contrast, screen-reader names, reduced-motion slideshow/loader |
| Deployment | Production build succeeds; environment variables configured; OAuth production callback verified; migration strategy exercised safely |
| Photos | Admin create and edit forms show optional photo and alt-text controls. Without Blob configuration, saving without a photo works and selecting one shows a setup error. Once connected, admin upload accepts valid JPEG/PNG/WebP under 3 MB and rejects invalid type/content/size and unauthorized uploads; photo and no-photo cards/details render without broken boxes |
| Requests | Text-only public submission validates fields and rejects photo attachments, persists privately, shows keyboard accessible modal; anonymous inbox/historical photo reads and mutations are denied; admin active/archived views, restore, confirmed delete, and newest-first order work |
| Publication order | Home, index, and public API sort by `publishedAt DESC, id DESC`; status transitions update timestamp; no client re-sort |
| Responsive layout | Desktop hero headline stays on one line without overflow; mobile wraps naturally; admin sign-in stays centered; focus, zoom, and reduced motion remain usable |
| Content review | Admin dashboard calculates six-month review dates in Chicago calendar time, shows due-soon/overdue cues, and supports the monthly editorial review process without changing public verification claims automatically |

## Core end-to-end scenarios

1. Anonymous visitor opens home, navigates to all opportunities, filters a category, opens a detail, and reaches the organizer action.
2. Anonymous visitor attempts `/admin` and a mutation endpoint; both are denied appropriately.
3. Allowlisted admin signs in, creates a draft with optional date fields omitted, confirms it is absent publicly, publishes it, and then confirms it appears publicly.
4. Admin provides an invalid URL, missing verification date, duplicate slug, or invalid date type; form/API returns useful validation feedback without creating invalid data.
5. Non-allowlisted GitHub user completes provider sign-in but cannot access dashboard or write endpoints.
6. Keyboard-only visitor pauses/navigates the slideshow, uses filters, and activates a listing action; reduced-motion visitor sees no autoplay or nonessential motion.

## Manual browser/device checklist

- Current Chromium, Firefox, and Safari where available.
- Mobile narrow viewport, tablet, and desktop; 200% browser zoom.
- Check admin request cards with long email/contact/description text for horizontal overflow at narrow widths.
- Slow network and image-load failure states.
- Light/default visual experience; no dark-mode requirement unless deliberately designed and tested.
- Inspect external target URLs and visual labeling before launch.

## Definition of done

All release-gate checks pass, launch listing data is manually verified from official sources, no high-severity accessibility/security finding remains, and the current official docs have been checked for version-sensitive integrations.
