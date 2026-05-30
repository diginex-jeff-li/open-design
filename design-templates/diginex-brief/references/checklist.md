# diginex-brief Checklist

Run this after writing the HTML artifact. All P0 must pass before emitting.

## P0 — Must pass (blocks emit)

- [ ] Page fits on one A4 sheet — no content overflow beyond 297mm height
- [ ] Logo loads from `./assets/logo.svg` via `<img>` tag — not inlined, not missing, not changed
- [ ] All CSS rules are verbatim from `assets/template.html` — no rewritten selectors, no invented fonts, no reflowed properties
- [ ] No placeholder text: no "Lorem ipsum", no "Feature One", no generic filler bullets
- [ ] No invented statistics — every number comes from user-provided content (or uses `—` placeholder)
- [ ] Exactly 4 workflow steps in SVG with appropriate Iconify icons
- [ ] Exactly 3 stat blocks: 1 solo `.award-big` + 2 in `.award-pair`
- [ ] Iconify script tag present: `<script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>`
- [ ] Print CSS includes `-webkit-print-color-adjust: exact` and `print-color-adjust: exact`
- [ ] `brand-spec.md` is NOT referenced for styling — `template.html` is the sole source of truth
- [ ] DOM structure matches template: header-bar → header-content → section1 → section2 → section3 → footer
- [ ] Google Fonts @import for Nunito Sans is present

## P1 — Should pass

- [ ] Challenge bullets extracted from user-provided content, not paraphrased generically
- [ ] Workflow icons semantically match step labels (e.g. `mdi:send` for Submit, not random)
- [ ] Feature descriptions are product-specific, not generic marketing copy
- [ ] Tagline is concise (≤3 lines, no wrapping beyond `.header-tagline` width)
- [ ] Footer links contain real URLs and email from user content or diginex defaults
- [ ] SVG flow diagram: circle positions, path `d` attribute, and marker defs unchanged from template
- [ ] `.header-logo img` remains `{ width: 545px; height: 50px; display: block; }`

## P2 — Nice to have

- [ ] Laptop mockup is a product-specific screenshot (not the default when user provided one)
- [ ] Solution bullets have parallel grammatical structure
- [ ] Section spacing is balanced — no single section dominates visually
- [ ] Challenge lead paragraph is ≤2 sentences
- [ ] "Why it matters" check-list items start with an action verb or benefit noun
