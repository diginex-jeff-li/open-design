---
name: diginex-brief
description: Thin brand variant of `product-one-pager-pdf` for diginex-styled product briefs. Use when you want the generic Product 1-pager structure with diginex defaults, diginex assets, and diginex terminology.
od:
  mode: template
  scenario: product
  preview:
    type: html
    entry: index.html
  design_system:
    requires: true
    sections: [color, typography, layout, components]
  craft:
    requires: [typography, color, anti-ai-slop]
  inputs:
    - name: brief_text
      type: string
      required: true
    - name: laptop_image
      type: string
      required: false
    - name: constraints
      type: string
      required: false
  outputs:
    primary: index.html
  example_prompt: "Create a diginex-styled one-page A4 product brief for a grievance-management product. Use the diginex visual defaults, a 4-step workflow, proof points, solution summary, benefits, and feature snapshot."
---

# ⚠️ DISCOVERY OVERRIDE — applies to the <question-form id="discovery"> you emit on turn 1

This template is a **fixed-surface document**. The output is exactly one A4 page intended for PDF export. It is not a responsive web page, desktop app, tablet app, or mobile app.

**When you emit your turn-1 `<question-form id="discovery">`, apply these template-level constraints. They override the generic discovery form template and any "(unknown — ask)" hints in the project metadata block.**

## Questions to DROP (do not include in the form)

- **"Target platform"** — irrelevant. This is a fixed one-page A4 PDF, not a web/app prototype. The platform concept does not apply.
- **"Roughly how much?"** — the answer is always "one A4 page."
- **"Visual tone"** — the diginex palette is fixed (navy #1b1464, gold #d4a820, blue #64B7DD, font Nunito Sans). No tone variation is possible.

## Questions to KEEP (template-specific inputs from od.inputs)

Use these instead of or in addition to the remaining generic questions:

| id | label | type | required | notes |
|----|-------|------|----------|-------|
| `brief_text` | Product brief | `textarea` | ✓ | Paste draft brief, feature description, or bullet points |
| `laptop_image` | Laptop screenshot | `text` | | Upload or paste a product screenshot, or type "skip" |
| `constraints` | Constraints | `textarea` | | Anything to emphasize, avoid, or enforce |

**Form authoring:** Include `brief_text` as the first question (a large textarea). Include `laptop_image` and `constraints` as optional follow-ups. You may keep the generic "Who is this for?" and "Brand context" questions if the user hasn't provided them, but drop "What are we making?" — the answer is always a one-page A4 product brief.

**Project metadata override:** The metadata block may say `platform: (unknown — ask)` or list platform fields. Treat ALL platform-related metadata as noise for this template. Do not echo, confirm, or re-ask about any platform field.

If `brief_text` is empty after the user submits the form, ask exactly ONE follow-up: "I need product content to build the diginex brief. Can you paste a brief, bullets, or draft copy?" Do not ask the user to confirm every extracted field one by one.

---

# diginex Brief Variant

This skill is a thin brand variant of `product-one-pager-pdf`.

Use it when you want:
- the generic Product 1-pager PDF structure
- diginex-flavored defaults
- diginex assets and visual language
- diginex terminology where appropriate

Use the base `product-one-pager-pdf` skill when you need a reusable multi-brand starting point.

## Inheritance model

Inherited from the base template:
- one-page A4 Product brief structure
- HTML-as-artifact, PDF-as-final-surface contract
- slot-based content extraction model
- startup discovery behavior
- checklist / critique expectation
- reusable section anatomy and iteration behavior

Overridden or narrowed in this variant:
- default design system is diginex
- default asset paths point to this skill's `assets/`
- approved visual defaults follow the diginex look and feel
- fallback terminology may use diginex-oriented wording where appropriate

## Variant operating rules

1. Treat this skill as using the `product-one-pager-pdf` base structure.
2. Use this skill's `assets/template.html` as the concrete diginex-flavored rendering blueprint.
3. Use this skill's `references/checklist.md` before emitting.
4. Prefer diginex defaults only when the user brief does not supply a stronger instruction.
5. Never let diginex defaults overwrite user-provided product facts.
6. The diginexAPPRISE logo is hardcoded. Keep `./assets/logo.svg` in the header logo slot at all times; do not replace, remove, or inline a different logo.

## Fixed output surface

Covered by the DISCOVERY OVERRIDE block at the top of this file. The output is always one A4 page. All platform metadata from upstream is noise; ignore it.

## Startup behavior

Covered by the DISCOVERY OVERRIDE block at the top of this file. Discovery is limited to `brief_text`, `laptop_image`, and `constraints`.

If `brief_text` is empty, ask exactly one follow-up.
If `laptop_image` is missing, ask exactly one follow-up.
Do not ask the user to confirm every extracted field one by one.

## diginex-specific defaults

### Visual defaults
- primary navy: `#1b1464`
- accent gold: `#d4a820`
- feature panel blue: `#64B7DD`
- font family: Nunito Sans

### Asset defaults
- logo: `./assets/logo.svg` — hardcoded, mandatory, do not replace or remove
- default laptop image: `./assets/laptop_mockup.png`
- layout blueprint: `./assets/template.html`

### Content defaults
Use only as fallback when the brief does not provide stronger content:
- challenge title: `The business challenge`
- proof title: `Award winning impact`
- workflow style: concise 4-step flow with semantically matched icons
- solution title: `The solution`
- benefits title: `Why it matters`
- contact defaults may use approved diginex links if the brief contains none

## Content rules

Extract from the user's brief aggressively, but do not fabricate facts.

Allowed:
- infer headings
- tighten phrasing
- infer a 4-step workflow from the described product flow
- use diginex-style fallback wording when the source is sparse

Forbidden:
- invent statistics or proof claims
- invent awards or certifications
- override user facts because they do not sound like diginex copy

## Laptop image behavior

- value provided -> use it as the laptop image source
- empty -> use `./assets/laptop_mockup.png`
- value is `skip` -> remove the entire laptop region from section 1

Do not re-ask about the laptop image if the input already specifies it.

## Output behavior

Emit one complete HTML artifact using this variant's template asset.

Output invariants:
- emit a single A4-oriented HTML brief, not a responsive product UI
- do not output platform-specific variants or multiple screen files
- do not add user-facing controls, viewport selectors, platform labels, or product-demo configuration panels

After the artifact, provide a short export note:
- optimized for one-page A4 PDF export
- preferred export command:
  `/tmp/pdfenv/bin/python ~/.hermes/scripts/html2pdf.py <filename>.html`

## Migration note

`diginex-brief` is no longer the canonical generic Product 1-pager template.

- For reusable multi-brand Product 1-pagers, use `product-one-pager-pdf`.
- For a diginex-branded default variant, use `diginex-brief`.
