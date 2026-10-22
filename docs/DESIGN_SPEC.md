# GoodNeighbor design specification

## 1. Design idea: “City soil, shared hands”

GoodNeighbor should feel like a beautifully edited local journal that happens to be exceptionally usable. It combines generous photography, textured earth tones, crisp typographic hierarchy, and small moments of life. The result is creative and contemporary, never rustic-costume or overly precious.

## 2. Visual identity

- Wordmark: `GoodNeighbor` paired with a compact, original mark that suggests a meeting point—two abstract seed/hand shapes forming a location pin or doorway. Keep it simple enough to work at 24px.
- Voice: neighborly, direct, hopeful, specific. Prefer “Find a way to pitch in” over generic inspirational language.
- Image direction: a mixed photo system—credible Chicago/community imagery plus deliberately art-directed generated supporting imagery where appropriately licensed and clearly not documentary evidence. People should appear active, dignified, and varied.

## 3. Tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#26352B` | primary text / dark surface |
| `moss` | `#526B4E` | primary action / active states |
| `clay` | `#B85F45` | warm accent / emphasis |
| `marigold` | `#D7A53B` | sparing highlight |
| `sand` | `#E9E0CF` | soft backgrounds |
| `paper` | `#FAF7F0` | primary background |
| `mist` | `#D8E0D2` | quiet supporting surface |
| `danger` | `#A33E35` | destructive/admin error only |

Use semantic aliases (surface, text, muted, border, action, focus) rather than scattering palette values. Confirm all text/background combinations meet WCAG 2.2 AA contrast; do not use clay or marigold for small body text on light surfaces without testing.

Typography: expressive editorial display face for headings (for example, a licensed serif such as Fraunces) plus a highly legible neutral sans for body/UI (for example, Inter or Geist). Verify font licensing and loading behavior. Body copy defaults to 16px minimum with relaxed line height. Use tabular figures where dates and admin tables benefit.

Spacing uses a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Radius is restrained: 8px controls, 16px cards, 24px feature imagery. Use a subtle paper-grain texture only if it remains performant and does not impair contrast.

## 4. Layout

Editorial does not mean unpredictable. Desktop content has a clear max width and asymmetric but readable grids: wide image column plus narrow annotation/metadata column where appropriate. Mobile collapses to a single ordered column with full-width actions. Preserve consistent alignment and avoid horizontal scrolling.

## 5. Components

- Header: sticky only if it remains unobtrusive; logo, primary navigation, and a compact “Explore opportunities” action.
- Hero slideshow: 3–5 images max, with readable static overlay content. No auto-advance unless it can be paused; provide labeled previous/next controls and slide status. Respect reduced motion by showing a single static image.
- Listing card: image, category chip, organization, title, short summary, neighborhood/time line, verified microcopy. Entire card may link, but nested links/buttons must remain valid and clear.
- Filters: tactile pill/button controls plus accessible labels and result count; never rely on color alone.
- Primary button: moss fill, paper text, 8px radius, a small contained hover lift/color shift. Focus ring is clearly visible.
- Secondary button: ink outline or quiet surface; same dimensions and focus quality.
- Loading state: a small looping “neighbor loop” made from two offset rounded shapes. It must have accessible loading text, avoid seizure-risk flashing, and reduce to a static indicator under reduced motion.
- Admin forms: calm utility styling; labels always visible, help/error text near fields, destructive actions visually distinct.

## 6. Movement

Motion should make the interface feel attentive, not busy: 150–250ms transitions for hover/focus, one-time restrained entrance motion for visible sections, and low-amplitude slideshow crossfades. Use CSS/transitions where possible. Honor `prefers-reduced-motion` by stopping autoplay/ambient motion and removing transforms, without removing information or controls.

## 7. Screen requirements

### Home

Hero slideshow with the exact headline “A little good goes a long way.” on one line at normal desktop width, Chicago-specific introduction, primary discovery action, newest listings, an editorial “how it works” strip, verification statement, and an accessible listing suggestion form with a focus-managed confirmation dialog. Narrow screens may wrap the headline naturally.

The slideshow and About page use original generated, candid-style volunteer imagery inspired by community gardening, food-pantry teamwork, and neighborhood cleanup. The garden scene leads the slideshow. Label the images as illustrative and do not associate them with any specific listing or organizer.

### Opportunities index

Title/count, search, category and time/date filters, responsive card collection, clear/empty states, and no results message with reset option. URL query parameters should preserve shareable filter state where practical.

### Detail

Feature image; category/organization; title and concise statement; place/date/commitment metadata; description; verification/source note; and a prominent external organizer action. Warn gently that logistics are confirmed with the organizer.

### About

Mission, Chicago scope, what “verified” means, and the limitation that GoodNeighbor is not the organizer.

### Admin

Functional over decorative: a compact table, listing status, verification freshness, request inbox, edit/create forms with optional photo upload and alt text, submit feedback, and explicit delete confirmation. The sign-in card is centered in the available page area. It shares the visual system but keeps interactions sober and fast.

General headings, card padding, metadata, buttons, and spacing use a more concise scale while maintaining readable body text, focus visibility, touch targets, and the earthy editorial palette. A listing without a photo has a complete text-first card and detail page; no placeholder box is shown.

## 8. Accessibility baseline

Meet WCAG 2.2 AA as the working baseline: semantic landmarks/headings, keyboard operation, target sizes, visible focus, sufficient contrast, error identification, descriptive imagery text, labels, skip link, no keyboard traps, and reduced-motion support. Test at 200% zoom and narrow mobile widths. Never make a slideshow the only way to access content.
