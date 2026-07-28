---
name: diginex-prototype
description: |
  Polished, state-complete Vue 3 design spec for Figma handoff. Covers every flow,
  state, and edge case (loading/empty/error/success) so the designer translates
  directly without ambiguity. One HTML file via CDN ESM — no build step. NOT a
  user-testing demo or engineering handoff; this is a designer specification artifact.
triggers:
  - "pm prototype"
  - "design spec"
  - "designer spec"
  - "interactive spec"
  - "spec for designer"
  - "detailed prototype"
  - "vue prototype"
  - "clickable spec"
  - "handoff prototype"
od:
  mode: prototype
  platform: desktop
  scenario: product
  fidelity: polished
  preview:
    type: html
    entry: index.html
  craft:
    requires: [typography, color, anti-ai-slop]
  example_prompt: "Build a detailed design spec for the compliance dashboard — 4 screens with every state covered (loading skeletons, empty states, error states, edge cases, confirmation flows). Designer will translate this into Figma."
---

# PM Prototype — Design Spec Skill

Produce a comprehensive, interactive Vue 3 design specification for a product
designer. This is NOT a demo or a prototype for stakeholders — it's a precise,
state-complete specification that a designer reads to understand exactly what to
build in Figma. Every flow, every edge case, every UI state must be represented.

## OD Core Integration

This skill operates within the OD Core directive arc. Follow these overrides:

- **Rule 1 (Discovery form):** CONDITIONAL — If this skill is invoked as a continuation of `pm-ideate` (wireframe already exists in the project), SKIP the discovery form — the wireframe IS the brief. If invoked fresh (no prior wireframe), emit a tailored discovery form with:
  - `screens` (text, required): "Which screens to spec?" (e.g. "overview, suppliers, audits, reports")
  - `source_wireframe` (text): "Path to existing wireframe?" (placeholder: "e.g. index.html from pm-ideate")
  - `state_coverage` (radio): "State coverage level?" — Full (loading/empty/error/success per screen) / Minimal (default + error only)
  - `constraints` (textarea): "Anything else?" (specific interactions, edge cases, designer preferences)

  LOCKED fields (state as context, not questions):
  - `output`: Always "Vue 3 interactive design spec"
  - `platform`: Always "Desktop web"
  - `fidelity`: Always "High-fidelity, state-complete"

- **Rule 2 (Direction form):** SKIP — styling comes from the active DESIGN.md tokens bound into `assets/skeleton.html`. Do not present direction-cards.

- **Rule 3 (TodoWrite + checklist + critique):** YES — plan the work with TodoWrite. Run `references/checklist.md` and 5-dim critique before emitting.

## Mockup Precedence Rule

If the user uploads a mockup image, first determine which type:

### Type 1 — Inspiration mockup (screenshot of a DIFFERENT product/site)
Extract layout patterns, spacing rhythm, density, and interaction patterns — but NOT colors, fonts, or component styles. The skeleton's CSS tokens (`:root` variables) and design system remain locked. The mockup informs screen layout and information architecture only.

### Type 2 — Exact mockup (Figma export or screenshot of the user's OWN product)
Replicate its layout, spacing, hierarchy, and visual weight faithfully in Vue components. The user either wants:
- (a) A spec variant of that exact screen, or
- (b) To build additional screens continuing the user journey

The skeleton's CSS tokens, shared component classes, and Vue Router boilerplate remain locked — only override screen-specific layout to match the mockup.

### Conflict resolution
If ANY mockup contradicts the OD Core anti-AI-slop checklist (warm beige backgrounds, emoji icons, gradient cards, Inter as display font, etc.), **flag the conflict and ask before proceeding:**

> "Your mockup uses [specific pattern] which our design system avoids — reproduce faithfully, or shall I adapt?"

Do not silently override the mockup. Do not silently violate the checklist. Wait for confirmation.

### Fallback
If the mockup is missing state coverage (loading/empty/error), add those states per `references/state-coverage.md`. The mockup provides direction; the skill provides completeness.

## Resource map

```
diginex-prototype/
├── SKILL.md                    ← you're reading this
├── example.html                ← what the output looks like
├── assets/
│   └── skeleton.html           ← locked CSS foundation: tokens + class system (READ FIRST)
└── references/
    ├── state-coverage.md       ← state toggle bar implementation + interactivity table
    ├── checklist.md            ← P0/P1/P2 self-review (state coverage, Vue patterns)
    ├── vue-esm.md              ← CRITICAL. Vue 3 CDN ESM patterns. Read FIRST.
    ├── vue-best-practices.md   ← Vue 3 Composition API rules. Read before component logic.
    ├── vue-router.md           ← Vue Router 4 patterns for hash-history SPAs.
    └── web-design-guidelines.md ← Web interface guidelines. Read during self-check (Step 9).
```

## Pre-flight reading

Before writing any code, read these references:
- `references/vue-esm.md` — CRITICAL. Vue 3 CDN ESM patterns. Read FIRST.
- `references/vue-best-practices.md` — Vue 3 Composition API rules. Read before writing component logic.
- `references/vue-router.md` — Vue Router 4 patterns for hash-history SPAs. Read when setting up routes.
- `references/web-design-guidelines.md` — Web interface guidelines. Read during self-check (Step 9).

Load lazily: read `vue-router.md` only when implementing routes. Read
`web-design-guidelines.md` during the self-check pass.

## When to use vs. when NOT to use

**Use pm-prototype when:**
- The wireframe direction is locked (after pm-ideate + your modifications)
- You need to hand off to a designer with ZERO ambiguity about flows and states
- The feature has multiple states (loading, empty, error, success, edge cases)
- The designer needs to see exact interactions, transitions, and conditional UI
- You want the designer to spend time designing, not deciphering

**Do NOT use pm-prototype when:**
- You're still exploring form factors → use pm-ideate (or pm-ideate-deep) instead
- The idea might be discarded → don't invest spec-level detail
- The feature is simple with no state variations → wireframe + annotation is enough
- You have fewer than 2 screens → Vue Router is overkill for single-screen

## Architecture (non-negotiable)

Every pm-prototype output starts from `assets/skeleton.html`. The skeleton contains:
- A minimal `:root` block with skeleton-layout tokens (`--nav-height`, `--sidebar-width`,
  `--page-margin`, `--info`). The full design-system token block is pasted in step 1.
- Pinned Vue 3.5.13 + Vue Router 4.5.0 CDN import map (DO NOT modify)
- Google Fonts link for Inter at 400/500/600 (DO NOT modify)
- CSS reset + shared component classes (card, btn, badge, table, modal, tabs, toast)
- Router + app mount boilerplate (DO NOT modify)
- `/* AGENT: */` markers where you inject content

All component classes reference open-design schema token names
(`--accent`, `--fg`, `--bg`, `--surface`, `--border`, etc.) — not
brand-specific names. Every design system's `tokens.css` uses these
same names, so the `:root` paste works without mapping.

### What the skeleton provides (do NOT regenerate)

```
assets/skeleton.html
├── <head>
│   ├── import map (Vue + Vue Router, pinned versions)
│   ├── Google Fonts (Inter 400/500/600)
│   └── <style>
│       ├── :root { --nav-height, --sidebar-width, --page-margin }   ← LOCKED (skeleton layout)
│       ├── /* PASTE tokens.css :root HERE */                        ← AGENT PASTES HERE
│       ├── CSS reset                                                ← LOCKED
│       ├── Route transitions (.fade-*)                              ← LOCKED
│       ├── Navigation (.app-nav-top, .app-nav-sidebar)              ← LOCKED
│       ├── Shared components (.card, .btn, .badge, .table, ...)     ← LOCKED
│       ├── /* AGENT: add screen styles */ marker                    ← YOU INJECT HERE
│       └── Responsive (@media)                                      ← LOCKED
├── <body>
│   └── <div id="app">
│       └── /* AGENT: replace placeholder with nav + router-view */  ← YOU INJECT HERE
└── <script type="module">
    ├── Vue + Router imports                                         ← LOCKED
    ├── /* AGENT: define route components */                         ← YOU INJECT HERE
    ├── /* AGENT: define routes array */                             ← YOU INJECT HERE
    └── Router + app mount                                           ← LOCKED
```

## Workflow

### Step 0 — Read the skeleton FIRST (mandatory)

Before writing a single line, open `assets/skeleton.html` and note:
- The `:root` block contains skeleton-layout tokens (`--nav-height`, `--sidebar-width`,
  `--page-margin`, `--info`). These are NOT from the design system.
- Every shared component class uses open-design schema token names:
  `--accent` (primary/CTA), `--fg` (text), `--bg` (page background), `--surface` (cards),
  `--border`, `--success`, `--warn`, `--danger`, `--font-display`, `--font-body`,
  `--font-mono`, `--text-xs` through `--text-4xl`, `--space-1` through `--space-12`,
  `--radius-sm/md/lg/pill`, `--elev-raised`, `--focus-ring`, etc.
- The navigation patterns (.app-nav-top, .app-nav-sidebar)
- The injection markers (`/* AGENT: */` comments)

You do NOT write CSS foundation code. You ONLY write:
1. The tokens.css `:root` paste (step 1)
2. Screen-specific CSS (positioning unique to each screen)
3. Route component definitions (template + setup)
4. Routes array
5. The nav + router-view markup in `#app`

### Step 1 — Paste design-system tokens into the skeleton

The skeleton's `:root` block contains only skeleton-specific tokens. Before generating,
you must paste the active design system's token values.

**Find the design system's tokens.css.** The active design system lives at:
`<project-root>/../design-systems/<active-slug>/tokens.css`

Read that file. Copy its entire `:root { ... }` block and paste it into the
skeleton's `:root`, merging with the existing skeleton-layout tokens
(`--nav-height`, `--sidebar-width`, `--page-margin`, `--info`).

Example merge:
```css
:root {
  /* Skeleton-layout (keep these) */
  --nav-height: 56px;
  --sidebar-width: 240px;
  --page-margin: var(--space-10, 40px);
  --info: var(--accent);

  /* === Pasted from design-systems/Apprise/tokens.css === */
  --bg: #F7F7FA;
  --surface: #FFFFFF;
  --fg: #28293D;
  --accent: #275E86;
  /* ... all remaining tokens from tokens.css ... */
}
```

**If the design system has no tokens.css** (older brands with only DESIGN.md):
Fall back to reading DESIGN.md and mapping its values into the skeleton's
`:root` block manually. Map semantic roles, not label names:

| skeleton token | DESIGN.md concept to find | If missing |
|---|---|---|
| `--accent` | Brand primary / accent / CTA color | ← MUST exist, error if missing |
| `--fg` | Text primary / body text | fallback: #1a1a2e |
| `--fg-2` | Text secondary / description | alias: --fg |
| `--muted` | Caption / metadata text | alias: --fg-2 |
| `--meta` | Placeholder / disabled text | alias: --muted |
| `--bg` | Page background | ← MUST exist |
| `--surface` | Card / elevated background | alias: --bg |
| `--border` | Default border / divider | alias: --bg darkened 10% |
| `--success / --warn / --danger` | Semantic state colors | ← MUST exist |
| `--font-display` | Heading / display font stack | ← MUST exist |
| `--font-body` | Body font stack | alias: --font-display |
| `--text-xs` through `--text-4xl` | Type scale from DESIGN.md hierarchy table | ← MUST exist |
| `--space-1` through `--space-12` | Base spacing scale | use DESIGN.md spacing values |
| `--radius-sm/md/lg/pill` | Border-radius values | use schema defaults |
| `--elev-raised` | Card / default shadow | use first elevation level |
| `--focus-ring` | Focus indicator | derive from --accent at 20-30% opacity |

**Validation:** After pasting/mapping, scan the skeleton's rendered output
visually against the DESIGN.md color reference. The accent color, text color,
and background should match.

### Step 2 — Read the source wireframe

Open the user's existing pm-ideate wireframe from the project. Note:
- Which screens exist
- What data/UI elements are on each screen
- The navigation pattern used (tabs / steps / sidebar)
- Any sticky-note annotations (customer quote, design decisions)

The polished prototype should REPLICATE the screen structure but REPLACE
the hand-drawn aesthetic with pixel-perfect brand styling.

### Step 3 — Define routes

Create one Vue Router route per screen, using hash history (`createWebHashHistory`):

```javascript
const routes = [
  { path: '/', redirect: '/overview' },
  { path: '/overview', component: OverviewScreen },
  { path: '/suppliers', component: SuppliersScreen },
  { path: '/audits', component: AuditsScreen },
  { path: '/reports', component: ReportsScreen },
];
```

Route paths MUST be kebab-case. Minimum 2 routes, maximum 6 routes.

### Step 4 — Define components (using skeleton classes)

Use Vue 3 Composition API with inline template strings. Every template MUST use
the CSS classes from `assets/skeleton.html` — do NOT redefine them.

**Available skeleton classes (use these, don't recreate):**
- Layout: `.screen-header`, `.card`, `.kpi-grid`, `.kpi-card`, `.kpi-value`, `.kpi-label`, `.kpi-change`
- Buttons: `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-default`, `.btn-small`, `.btn-danger`
- Forms: `.form-group`, `.form-label`, `.form-input`
- Badges: `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`, `.badge-neutral`
- Data: `.data-table`, `.status-dot`
- Navigation: `.tabs`, `.tab`, `.tab.active`
- Feedback: `.modal-backdrop`, `.modal`, `.toast`, `.toast-success`, `.toast-error`, `.toast-info`

**Component template example:**

```javascript
const OverviewScreen = {
  template: `
    <div class="screen-overview">
      <header class="screen-header">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </header>
      <div class="kpi-grid">
        <div class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-change" :class="kpi.trend">{{ kpi.change }}</span>
        </div>
      </div>
      <div class="card">
        <!-- More content using skeleton classes -->
      </div>
    </div>
  `,
  setup() {
    const kpis = reactive([
      { label: 'Compliance', value: '94%', change: '+3.2%', trend: 'up' },
      // ...
    ]);
    return { kpis };
  }
};
```

**Add screen-specific CSS** at the `/* AGENT: add screen styles */` marker:
```css
.screen-overview {
  padding: var(--space-8) var(--page-margin);
  max-width: var(--content-max);
  margin: 0 auto;
}
```

Key Vue patterns:
- `reactive()` for screen-level data objects
- `ref()` for simple values (form inputs, toggles)
- `computed()` for derived data (filtered lists, totals, statuses)
- `v-if` / `v-for` for conditional rendering and lists
- `v-model` for form inputs
- `@click` for button interactions
- `@submit.prevent` for form submissions

Do NOT:
- Redefine skeleton classes (`.card`, `.btn`, etc.)
- Write raw hex values or px values — use `var(--token)`
- Use TypeScript, Pinia, Vuex, or `.vue` files
- Add external CSS libraries

### Step 5 — Choose navigation pattern

The skeleton provides two pre-built nav patterns. Pick ONE based on screen count.
**The navigation markup goes in the root component's `template` property, NOT in the HTML `<div id="app">` tag.** The `#app` div must remain empty — Vue 3 replaces its innerHTML entirely.

**Top nav** (best for 2-4 screens): Put this in the `App` component template:
```javascript
const App = {
  template: `
    <nav class="app-nav-top">
      <div class="nav-brand">
        <!-- AGENT: embed logo SVG inline here -->
        <span class="nav-title"><!-- AGENT: app name --></span>
      </div>
      <div class="nav-links">
        <router-link to="/overview" class="nav-link">Overview</router-link>
        <router-link to="/suppliers" class="nav-link">Suppliers</router-link>
        <!-- AGENT: add more links -->
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  `,
  setup() { return {}; }
};
```

**Sidebar nav** (best for 5-6 screens, dashboards, admin panels): Put this in the `App` component template:
```javascript
const App = {
  template: `
    <div class="app-layout-sidebar">
      <nav class="app-nav-sidebar">
        <div class="nav-brand">
          <!-- AGENT: embed logo SVG inline here -->
          <span class="nav-title"><!-- AGENT: app name --></span>
        </div>
        <div class="nav-links">
          <router-link to="/overview" class="nav-link">Overview</router-link>
          <!-- AGENT: add more links -->
        </div>
      </nav>
      <main class="app-content-sidebar">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  `,
  setup() { return {}; }
};
```

All CSS for both patterns is already in the skeleton (`.app-nav-top`, `.app-nav-sidebar`,
`.router-link-active` highlighting, responsive collapse). Do not rewrite it.

### Step 6 — Add route transitions

Wrap `<router-view>` with Vue's `<Transition>` component:

```html
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Step 7 — Cover every state (MANDATORY — this is the spec)

Read `references/state-coverage.md`. Implement the state toggle bar on every
screen with all 5 states (Default / Loading / Empty / Error / Success). Every
interactive element must show visual feedback for all applicable states.
No dead UI. No unhandled states.

### Step 8 — Apply DESIGN.md styling

If you pasted `tokens.css` in Step 1, the `:root` block already contains every
design decision — colors, fonts, spacing, radii, shadows. Nothing to add here.
All component classes reference `var(--*)` and resolve automatically.

If you mapped from DESIGN.md manually, review the mapping against the DESIGN.md
§Agent Prompt Guide color reference to confirm the accent, text, and background
values match.

### Step 9 — Self-check before emitting

Run `references/checklist.md` top to bottom. Fix all P0 failures before emitting.
P1 items should pass. P2 items are bonus.

After running `references/checklist.md`, also run `references/web-design-guidelines.md`
to verify accessibility and UX compliance.

## Output contract

```
<artifact identifier="pm-prototype-<slug>" type="text/html" title="Prototype — <App Name>">
<!doctype html>
<html lang="en">
...Vue 3 SPA with working router navigation, brand-perfect styling...
</html>
</artifact>
```

After `</artifact>`, output exactly:

> "Design spec ready: [N] screens with state coverage (loading, empty, error, success per screen). Toggle states via the SPEC STATES bar. Designer can translate directly into Figma — every flow and edge case is represented."

## Hard rules

- **Start from skeleton** — open `assets/skeleton.html`, inject ONLY into `/* AGENT: */` markers
- **Do NOT modify locked sections** — `:root`, import map, font link, reset, shared classes, router boilerplate
- **Hash history only** — skeleton already uses `createWebHashHistory`
- **Pinned CDN versions** — skeleton already has correct pinned URLs
- **One HTML file** — no external CSS/JS/fonts beyond what's in the skeleton
- **Skeleton classes only** — use `.card`, `.btn`, `.badge`, `.data-table`, `.modal`, `.tabs`, `.toast` etc. Do not redefine them
- **`var(--token)` for custom styles** — any inline style or screen-specific CSS uses custom properties
- **Real interactivity** — buttons do things. Forms accept input. Toggles toggle. No dead UI.
- **Screen-specific CSS** — add only at the `/* AGENT: add screen styles */` marker
- **Responsive** — skeleton's `@media (max-width: 768px)` handles it. Verify, don't rebuild.
- **State toggle bar on every screen** — the designer must be able to toggle Default / Loading / Empty / Error / Success states on every screen. No screen ships without state coverage.
- **Designer is the audience** — every decision prioritizes the designer's ability to translate into Figma. Clarity over cleverness. Completeness over conciseness.
- **No "wireframe" or "demo" language** — this artifact calls itself a "design spec." The words "wireframe", "prototype", and "demo" are banned from the output.
- **Embed logo as inline SVG** — copy the SVG markup into `.nav-brand`, do not use `<img src>`

## Vue ESM dependency

This skill uses Vue 3 via CDN ESM imports. Read `references/vue-esm.md` FIRST —
it covers critical mount rules, import maps, and pitfalls. Key P0: `<div id='app'>`
must be EMPTY. Root component MUST have a template property.

## Troubleshooting

### Blank page / `<!---->` in DOM

**Symptom:** The page loads but shows nothing. DevTools shows `<div id="app" data-v-app=""><!----></div>`. No console errors.

**Cause:** The root component passed to `createApp()` has no `template` property. Vue 3 replaces `#app`'s innerHTML with the component's render output. An empty setup function renders `<!---->`.

**Fix:**
```javascript
// WRONG — blank page
const app = createApp({ setup() { return {}; } });

// CORRECT — root component has a template
const App = {
  template: `
    <nav class="app-nav-top">...</nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  `
};
const app = createApp(App);
app.use(router);
app.mount('#app');
```

### HTML inside `<div id="app">` disappears

**Symptom:** Nav, content, or other HTML placed inside `<div id="app">` in the static HTML disappears when the page loads.

**Cause:** Same root cause as above. Vue 3 replaces `#app`'s innerHTML entirely. All UI must be in component templates.

**Fix:** Move all HTML from the static `<div id="app">` into the root component's `template` property. Keep `<div id="app"></div>` empty in the HTML file.