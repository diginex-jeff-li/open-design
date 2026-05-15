---
name: product-one-pager-pdf
description: Generate a reusable one-page A4 product brief in HTML for PDF export. This is the generic base template for Product 1-pagers: structure lives here, design system selection happens in-project, and product content comes from the brief.
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
    - name: design_system
      type: string
      required: true
    - name: brief_text
      type: string
      required: true
    - name: hero_image
      type: string
      required: false
    - name: constraints
      type: string
      required: false
  outputs:
    primary: index.html
  example_prompt: "Create a one-page A4 product brief for Product 1 using the Product 1 design system. Include the challenge, proof points, 4-step workflow, solution, benefits, and feature snapshot."
---

# Product 1-Pager PDF Base Template

Generate a reusable one-page A4 product brief in HTML, intended for PDF export. This is the generic base template for Product 1-pagers.

Core model:
- Template = structure
- Design system = appearance
- Brief = content

The output artifact is HTML because it is easy to preview and edit in Open Design. The intended final surface is PDF.

## OD Core Integration

This skill is the canonical base template for Product 1-pagers. Follow these rules:

- **Rule 1 (Discovery form):** YES — the first response in a newly created project must use the provided `od.inputs` as the required startup form. Do not skip it.
- **Rule 2 (Direction form):** REPLACED — do not use generic direction cards. The `design_system` field is the appearance selector for this template.
- **Rule 3 (Todo + checklist + critique):** YES — plan with TodoWrite. Before emitting, run the checklist in `references/checklist.md` and perform a concise 5-dimension critique.

## Startup behavior

When the user clicks “Use this prompt” and Open Design creates a project:

1. Treat the `design_system`, `brief_text`, `hero_image`, and `constraints` inputs as the required first-step discovery payload.
2. If `design_system` is missing or ambiguous, ask exactly one follow-up question:
   - "Which design system should I use? Examples: Product 1, Product 2, Diginex."
3. If `brief_text` is empty, ask exactly one follow-up question:
   - "I need product content to build the 1-pager. Can you paste a brief, bullets, or draft copy?"
4. Do not ask the user to confirm each extracted field one by one.

## Design-system selection contract

The design system controls appearance only:
- colors
- typography
- logo / wordmark treatment
- visual tone
- component feel

The design system must NOT silently overwrite the product facts from the brief.

If the chosen design system is known, apply it. If it is unknown but clearly named, proceed using that name as the requested brand context. If the name is too vague, ask one follow-up only.

## Content slot contract

Read `references/slot-contract.md` and map the brief into these slots:
- product_name
- tagline
- audience
- challenge_title
- challenge_lead
- challenge_bullets
- proof_title
- proof_summary
- stats
- workflow_steps
- solution_summary
- solution_bullets
- why_it_matters
- feature_list
- contact_links
- hero_image

Rules:
1. Extract aggressively from the user's brief.
2. Infer headings and labels conservatively when helpful.
3. Never invent statistics or factual proof points.
4. If proof data is missing, use a labelled placeholder like `—` or omit according to the slot contract.
5. If the brief is sparse, preserve a clean structure rather than filling the page with generic marketing fluff.

## Rendering contract

### Base asset

Use `assets/template.html` as the structural blueprint.

It owns:
- overall A4 anatomy
- section order
- major layout regions
- print-safe CSS foundation
- reusable class names and DOM structure

Do not rebuild the page from scratch when the asset already provides the structure.

### Allowed edits

You may:
- replace text content
- replace or remove the hero image region according to input
- change workflow labels, descriptions, and icons
- add or remove repeated list items / feature items where the layout supports it
- apply design-system-specific tokens or visual substitutions that preserve the base structure

You may not:
- change the page into a different artifact type
- expand it beyond one A4 page
- fabricate proof points
- split the artifact into multiple partial outputs

## PDF export contract

This template is explicitly for the `pdf` surface, but the generated artifact should be HTML optimized for PDF export.

After the artifact, provide a short export note:
- Browser print-to-PDF is not the preferred path when backgrounds, icons, and images matter.
- Preferred export command:
  `/tmp/pdfenv/bin/python ~/.hermes/scripts/html2pdf.py <filename>.html`

Do not over-explain the export flow. Keep it brief.

## Output format

Output the complete HTML artifact as a single code block or artifact block suitable for Open Design preview.

After the artifact, include a short note stating:
- the selected design system
- that the artifact is optimized for one-page A4 PDF export
- the WeasyPrint export command

## Iteration behavior

If the user asks for changes:
1. Identify the affected section(s)
2. Modify only what is necessary
3. Re-emit the full updated HTML artifact
4. Keep the structure stable unless the user explicitly asks for a structural change

## Anti-patterns

DON'T:
- Skip the first-step form
- Ask the user to approve each extracted field one by one
- Invent metrics, customer counts, certification claims, or compliance claims
- Treat the design system as a replacement for product content
- Turn the 1-pager into a multi-page layout
- Use markdown tables in the chat response
- Emit multiple partial HTML fragments
- Add generic filler copy just to occupy space

DO:
- Keep the template reusable across different brands
- Let the design system control appearance while the brief controls content
- Keep the page concise and readable in print
- Prefer omission or labelled placeholders over fabricated facts
- Use print-safe CSS practices
- Run the checklist before emitting
