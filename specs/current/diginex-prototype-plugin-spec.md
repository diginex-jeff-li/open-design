# Spec — diginex-prototype plugin

## Goal

Create an OD scenario plugin (`plugins/_official/examples/diginex-prototype/`)
that bundles the pm-prototype skill with the diginex design system and curated
Vue ESM + web-design-guidelines references, so the user gets a one-click
"Diginex Prototype" card on the OD Home page.

## Directory structure

```
plugins/_official/examples/diginex-prototype/
├── open-design.json              # OD plugin manifest
├── SKILL.md                      # pm-prototype body (adapted)
├── example.html                  # pm-prototype's example.html (copied)
├── assets/
│   └── skeleton.html             # pm-prototype's skeleton (copied)
└── references/
    ├── checklist.md              # from pm-prototype (copied)
    ├── state-coverage.md         # from pm-prototype (copied)
    ├── vue-esm.md                # curated from vue-esm SKILL.md (446 lines)
    ├── vue-best-practices.md     # condensed from vue-best-practices (20 ref files)
    ├── vue-router.md             # condensed from vue-router-best-practices (8 ref files)
    └── web-design-guidelines.md  # from web-design-guidelines SKILL.md (39 lines)
```

## What NOT included

- **antfu-design** — removed per user request. The diginex design system's
  DESIGN.md already covers color, typography, spacing, and component rules.
  antfu-design is UnoCSS-first which doesn't apply to CDN ESM prototypes.

- **grill-me** — stays as a user-invoked skill via `@grill-me` in the chat
  composer. Not bundled — it's a conversational planning tool, not a
  reference the agent needs during generation.

- **llm-wiki / deep-wiki** — stays as a user-invoked skill. Not relevant
  during prototype generation.

## open-design.json manifest

```json
{
  "$schema": "https://open-design.ai/schemas/plugin.v1.json",
  "specVersion": "1.0.0",
  "name": "diginex-prototype",
  "title": "Diginex Prototype",
  "version": "0.1.0",
  "description": "State-complete Vue 3 design spec with Diginex Library tokens. Lilac-3 primary, orange-3 secondary, Nuxt UI v4 semantics on Tailwind v4 slate neutrals.",
  "license": "MIT",
  "tags": ["prototype", "design-system", "first-party", "vue"],
  "od": {
    "kind": "scenario",
    "taskKind": "new-generation",
    "mode": "prototype",
    "platform": "desktop",
    "scenario": "product",
    "surface": "web",
    "fidelity": "polished",
    "useCase": {
      "query": {
        "en": "Build a detailed design spec using the Diginex Library design system — {{screens}} with every state covered (loading, empty, error, success per screen). Designer will translate this into Figma."
      }
    },
    "inputs": [
      {
        "name": "screens",
        "label": "Which screens to spec?",
        "type": "text",
        "placeholder": "e.g. overview, suppliers, audits, reports",
        "required": true
      },
      {
        "name": "stateCoverage",
        "label": "State coverage level",
        "type": "select",
        "options": ["Full (loading/empty/error/success per screen)", "Minimal (default + error only)"],
        "default": "Full (loading/empty/error/success per screen)"
      },
      {
        "name": "constraints",
        "label": "Constraints (optional)",
        "type": "text",
        "placeholder": "Specific interactions, edge cases, designer preferences"
      }
    ],
    "context": {
      "skills": [
        { "path": "./SKILL.md" }
      ],
      "designSystem": {
        "ref": "diginex",
        "primary": true
      },
      "craft": ["typography", "color", "anti-ai-slop"],
      "assets": [
        "./example.html",
        "./assets/skeleton.html"
      ]
    },
    "preview": {
      "type": "html",
      "entry": "example.html"
    },
    "capabilities": ["prompt:inject", "fs:write"]
  }
}
```

Key manifest decisions:
- `kind: "scenario"` — this is an end-to-end workflow, not just a design system
- `taskKind: "new-generation"` — from-scratch design creation
- `mode: "prototype"` — matches pm-prototype's mode
- `context.skills: [{ path: "./SKILL.md" }]` — bundles pm-prototype as plugin-local skill
- `context.designSystem: { ref: "diginex" }` — binds the diginex design system
- `context.craft` — same craft rules as pm-prototype
- `context.assets` — includes skeleton.html (the locked CSS foundation) and example.html

## SKILL.md (adapted from pm-prototype)

The SKILL.md is copied from `~/.od/skills/pm-prototype/SKILL.md` with these
modifications:

1. **Frontmatter**: Remove `load_also: vue-esm` (vue-esm content is now in
   `references/vue-esm.md`). Remove `od.design_system.requires` (the plugin
   manifest handles design system binding). Keep `od.mode`, `od.platform`,
   `od.scenario`, `od.fidelity`, `od.craft.requires`.

2. **Resource map**: Update to include the new reference files:
   ```
   references/
   ├── state-coverage.md       ← state toggle bar + interactivity table
   ├── checklist.md            ← P0/P1/P2 self-review
   ├── vue-esm.md              ← Vue 3 CDN ESM patterns (mount, reactivity, router)
   ├── vue-best-practices.md   ← Vue 3 Composition API rules (condensed)
   ├── vue-router.md           ← Vue Router 4 patterns and gotchas (condensed)
   └── web-design-guidelines.md ← web interface guidelines checklist
   ```

3. **Pre-flight reading section** (new, after "Resource map"):
   ```
   ## Pre-flight reading

   Before writing any code, read these references:
   - `references/vue-esm.md` — CRITICAL. Vue 3 CDN ESM patterns. Read FIRST.
     Covers mount rules, import maps, component definitions, and common pitfalls.
   - `references/vue-best-practices.md` — Vue 3 Composition API best practices.
     Read before writing component logic.
   - `references/vue-router.md` — Vue Router 4 patterns for hash-history SPAs.
     Read when setting up routes or navigation guards.
   - `references/web-design-guidelines.md` — Web interface guidelines. Read
     during self-check (Step 9) to verify accessibility and UX compliance.

   Load lazily: read vue-router.md only when implementing routes. Read
   web-design-guidelines.md during the self-check pass, not during generation.
   ```

4. **Vue ESM dependency section**: Replace the `load_also` reference with:
   ```
   ## Vue ESM patterns

   This skill uses Vue 3 via CDN ESM imports (no Vite, no SFC, no build step).
   Read `references/vue-esm.md` FIRST — it covers the critical mount rules,
   import map setup, and pitfalls specific to single-HTML Vue prototypes.

   Key P0 rule: `<div id="app">` must be EMPTY. All UI goes in Vue component
   templates. The root component passed to createApp() MUST have a template
   property.
   ```

5. **Self-check step**: Add web-design-guidelines to the Step 9 checklist:
   ```
   After running references/checklist.md, also run references/web-design-guidelines.md
   to verify accessibility, interactivity, and UX compliance.
   ```

## Reference files

### references/vue-esm.md
Source: `~/.hermes/skills/software-development/vue-esm/SKILL.md` (446 lines)
Copy the full body (strip frontmatter). This is the most important reference —
it covers CDN ESM patterns specific to single-HTML prototypes. No condensation
needed — it's already focused and 446 lines is manageable.

### references/vue-best-practices.md
Source: `~/.agents/skills/vue-best-practices/` (SKILL.md + 20 reference files, 150K)
Condense into a single file. Keep:
- Core Principles section (from SKILL.md)
- Reactivity rules (from references/reactivity.md)
- Component patterns (from references/component-data-flow.md, component-slots.md)
- Composables (from references/composables.md)
- SFC patterns adapted for CDN ESM (from references/sfc.md — note: no .vue files,
  use template strings instead)
- Performance (from references/perf-virtualize-large-lists.md — just the key rules)
Target: ~200-300 lines. Focus on rules that apply to CDN ESM prototypes, not
Vite/SFC-specific patterns.

### references/vue-router.md
Source: `~/.agents/skills/vue-router-best-practices/` (SKILL.md + 8 reference files, 70K)
Condense into a single file. Keep:
- Navigation guard patterns (beforeRouteEnter, async/await)
- Route param change handling
- Cleanup patterns
- "Use vue-router for production" rule
Target: ~100-150 lines. Focus on hash-history SPA patterns relevant to
single-HTML prototypes.

### references/web-design-guidelines.md
Source: `~/.agents/skills/web-design-guidelines/SKILL.md` (39 lines)
Copy the full body (strip frontmatter). Small enough to include as-is.
Note: the original skill fetches guidelines from a URL at runtime. For the
plugin, we include the instructions to fetch + the methodology, since the
guidelines content is fetched live.

## example.html and assets/skeleton.html

Copy directly from `~/.od/skills/pm-prototype/`:
- `example.html` → `plugins/_official/examples/diginex-prototype/example.html`
- `assets/skeleton.html` → `plugins/_official/examples/diginex-prototype/assets/skeleton.html`

These are the pm-prototype's output example and locked CSS foundation.
The skeleton already has `/* AGENT: */` markers for injection points.

## UI flow (how the user selects this)

1. User opens OD Home page
2. Sees "Diginex Prototype" card in the examples/prototype gallery
3. Clicks "Use"
4. OD creates a new project with:
   - diginex as the active design system (DESIGN.md + tokens.css injected)
   - pm-prototype as the active skill (SKILL.md body loaded from plugin)
   - skeleton.html available as a seed asset
   - Vue ESM + best practices + router + web-design-guidelines references available
5. User fills the input form (screens, state coverage, constraints)
6. OD runs the pm-prototype workflow with diginex tokens

## What stays as user-imported skills (not bundled)

- `~/.od/skills/grill-me` — user invokes via `@grill-me` in chat composer
- `~/.od/skills/llm-wiki` — user invokes via `@llm-wiki` in chat composer
- `~/.od/skills/antfu-design` — available but not auto-loaded (UnoCSS-first, not
  relevant to CDN ESM prototypes)
- `~/.od/skills/vue` — available as a standalone skill (full Vue docs, for
  reference outside of the diginex-prototype workflow)

## Validation

After creating the plugin:
1. `pnpm guard` — ensure no JS files in plugin directory
2. `pnpm --filter @open-design/plugin-runtime typecheck` — ensure manifest types are valid
3. Restart daemon and verify the plugin appears in `/api/plugins`
4. Verify the diginex design system is resolvable from the plugin context