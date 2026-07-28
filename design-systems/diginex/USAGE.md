# Diginex Library — Usage

> Auto-structured for the Open Design design-system project shape. Review and edit before treating it as a canonical brand guide.

## Read Order

1. Read `DESIGN.md` for product context, visual principles, and the 9-section brand spec.
2. Paste `tokens.css` into the first `<style>` block of any generated artifact — it is the single source of truth for color, radius, spacing, type, motion, and layout.
3. Use `components.html` as a compact fixture for proportions and state styling (buttons, cards, inputs, badges).
4. Use `design-tokens.json` for machine-readable token values, the full 50–950 ramps, and the Nuxt UI `ui-*` semantic layer (light + dark) — these are kept out of `tokens.css` to stay on the canonical OD schema.
5. Use `tailwind-v4.css` when the target is a Tailwind v4 project (Nuxt UI v4); it exposes the ramps as `--color-primary-*` … `--color-neutral-*` utilities.

## Token Layers

- **A1-identity**: `--bg`, `--surface`, `--fg`, `--accent`, `--font-display`, `--font-body` — brand-decided, required.
- **A2**: `--motion-fast`, `--success`, `--warn`, `--danger`, `--space-*`, `--font-mono`, `--radius-md` — required, sensible fallbacks overridden by brand. (`--info` is brand-specific — see `design-tokens.json`.)
- **B-slot**: `--surface-warm`, `--fg-2`, `--muted`, `--meta`, `--border-soft`, `--accent-on` — optional semantic aliases.
- **C-extension**: the Nuxt UI `ui-*` family, plus `info`, `secondary`, and the extended 48–128px type scale. These are NOT in `tokens.css` (kept off the canonical OD schema so the manifest guard passes); find them in `design-tokens.json` under `semantic`, `ramps`, and `typography`. Regenerate a `ui-*` CSS block from that JSON when targeting a Nuxt UI project.

## Nuxt UI Notes

- `tokens.css` ships only the canonical OD token set. The Nuxt UI `ui-*` semantic aliases (light + dark), `info`, `secondary`, and the full 50–950 ramps live in `design-tokens.json` — regenerate a `ui-*` CSS variable block from that JSON when building a Nuxt UI target.
- Dark mode uses the `.dark` class strategy (set `darkMode: 'class'`); `tokens.css` re-points the core A1/A2 tokens in `.dark`.
- Component radii use the 4px base, `*1.5` (≈6px, dominant), or `*2` (≈8px).
- `ui-primary` is `primary-500` in light, `primary-400` in dark; the same 400-anchor flip applies to all status colours.

## Provenance

- Source: Figma file "Diginex Library" (HH9sjkn5fnkdMy6FIkIXsI), Nuxt UI v4 / Tailwind v4 token system.
- `primary` and `secondary` are custom Diginex colours exposed only at the 500 anchor in the source file; their 50–950 steps are interpolated in OKLCH from the real 500 (anchor kept exact). All other ramps are exact Tailwind values.
- The Figma Variables REST API was unavailable (`file_variables:read` scope not granted); values come from file content readable via `file_content:read` (Presets boards + resolved component fills).

## Agent Guidance

- Use `tokens.css` as the first source of truth for color, radius, spacing, and type.
- Treat `components.html` as a compact fixture for proportions and state styling.
- When a token is a direct extraction from the source, preserve its semantic role before inventing new values.
- Do not introduce warm neutrals, heavy shadows, or decorative semantic colour — see `DESIGN.md` §9 Anti-patterns.
