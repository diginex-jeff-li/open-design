# Prototype self-review checklist

Run this before emitting `<artifact>`. P0 = must pass (don't emit if failing).
P1 = should pass. P2 = nice to have.

---

## P0 — Must pass

### Foundation integrity
- [ ] **Tokens.css `:root` block pasted into skeleton.** Merged with skeleton-layout tokens (`--nav-height`, `--sidebar-width`, `--page-margin`). If no tokens.css, mapped from DESIGN.md per Step 1 table.
- [ ] **Skeleton locked sections untouched.** Import map, font link, reset, shared classes, router boilerplate are as-shipped.
- [ ] **No hard-coded hex/px values outside `:root`.** Every color uses `var(--accent)`, `var(--fg)`, `var(--bg)`, etc. Spacing uses `var(--space-*)`.
- [ ] **Vue mount rule: `<div id="app">` is EMPTY in HTML.** All UI must be in Vue component templates. The root component MUST have a `template` property — without it, Vue 3 replaces `#app` content with `<!---->`, producing a blank page with no console error.

### Screens & navigation
- [ ] **Minimum 2 routes, maximum 6 routes.** Each route has a working component using skeleton classes.
- [ ] **Navigation pattern selected** (top bar or sidebar) using skeleton's pre-built classes.
- [ ] **Logo embedded as inline SVG** in `.nav-brand` — no `<img src>`.
- [ ] **Route transitions working** via `<Transition name="fade">`.

### State coverage (per screen)
- [ ] **State toggle bar present on every screen** — Default / Loading / Empty / Error / Success buttons visible.
- [ ] **Loading state**: Skeleton placeholders (`.skeleton-block`) visible when toggled, matching layout shape.
- [ ] **Empty state**: "No items" message + CTA/illustration visible when toggled.
- [ ] **Error state**: Error message + retry button visible when toggled.
- [ ] **Success state**: Confirmation toast/message visible when toggled (after form submit).

### Interactivity
- [ ] **At least 3 interactive elements per screen** — buttons, forms, toggles, modals, inputs.
- [ ] **No dead UI** — every button, link, form does something visible (show alert, navigate, toggle state).
- [ ] **Buttons work** — show toast/alert on click, navigate, or trigger state change.
- [ ] **Forms work** — real `v-model`, submit handler with loading→success/error states.

---

## P1 — Should pass

### State coverage (per element)
- [ ] **Disabled state** shown for at least one button/input — greyed-out, cursor not-allowed, tooltip.
- [ ] **Hover states** visible on all clickable elements — background shift, underline, or scale.
- [ ] **Focused state** visible on inputs/buttons — focus ring using `var(--focus-ring)`. No raw box-shadow.
- [ ] **Active/Pressed state** for buttons — darker background, `scale(0.98)`.

### Design system fidelity
- [ ] **Skeleton classes used exclusively** — `.card`, `.btn`, `.badge`, `.data-table`, `.modal`, `.tabs`, `.toast` etc. Never redefined.
- [ ] **`var(--token)` for custom styles** — any inline style or screen-specific CSS uses tokens.
- [ ] **Screen-specific CSS at correct marker** — added at `/* AGENT: add screen styles */`, not scattered.

### Spec discipline
- [ ] **Designer is the intended audience** — clarity over cleverness, completeness over conciseness.
- [ ] **No "wireframe" or "demo" language** — artifact calls itself a "design spec."
- [ ] **Hash history used** — `createWebHashHistory` per skeleton.
- [ ] **`data-od-id` on critical elements** — state toggle bar, screen header, and each card/section has it for critique mode compatibility.

---

## P2 — Nice to have

- [ ] **Responsive verified** — skeleton's `@media (max-width: 768px)` handles mobile layout. Sidebar collapses correctly.
- [ ] **Modals work** — open/close with `v-if`, backdrop click to dismiss, escape key to close.
- [ ] **Toggle switches** use `v-model` on checkbox with immediate visual feedback.
- [ ] **Tables sortable** — click column header to sort. Search filter. Row hover highlight.
- [ ] **Charts (placeholder)** — styled card with labeled chart area, not a live chart library.
- [ ] **Confirmation toast animates in** — slide-down or fade-in, auto-dismiss after 3s.

---

## Anti-patterns to catch

- ❌ **Dead buttons** — `<button>Click Me</button>` with no `@click` handler
- ❌ **Missing state toggle** — screen has no `.state-toggles` bar
- ❌ **Loading without skeleton** — "Loading..." text instead of `.skeleton-block` placeholders
- ❌ **Empty without CTA** — "No data" text with no action for the user to take
- ❌ **Error without retry** — error message with no retry/fallback path
- ❌ **Success without context** — "Success!" toast with no explanation of what happened
- ❌ **Hard-coded colors** — raw hex values (#efefef, #333333) outside `:root`
- ❌ **HTML inside `<div id="app">`** — Vue 3 replaces `#app` innerHTML with the root component's render output. Put all UI in component templates, not in the static HTML.
- ❌ **Root component without `template`** — `createApp({ setup() { return {}; } })` renders `<!---->`, a blank page with zero console errors. Always include `template`.
