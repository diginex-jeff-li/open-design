# Product 1-Pager Slot Contract

This document defines the reusable content contract for the `product-one-pager-pdf` base template.

## Principles

- Structure is stable across brands.
- Brand/design-system choice affects appearance, not product facts.
- Extract from the user brief first.
- Infer labels conservatively.
- Never invent factual proof points or statistics.

## Slot definitions

### 1. `product_name`
- Required: yes
- Type: short text
- Source: brief text
- Fallback: ask only if the brief is too ambiguous to identify the product

### 2. `tagline`
- Required: yes
- Type: 1-3 short lines
- Source: brief text or synthesized from positioning
- Fallback: concise summary of product purpose
- Constraint: do not turn this into paragraph copy

### 3. `audience`
- Required: optional
- Type: short text
- Source: startup form or brief text
- Fallback: omit if not useful in the artifact

### 4. `challenge_title`
- Required: yes
- Type: short heading
- Source: extracted or inferred
- Fallback: `The business challenge`

### 5. `challenge_lead`
- Required: yes
- Type: 1-2 sentences
- Source: brief text
- Fallback: concise problem summary inferred from the brief

### 6. `challenge_bullets`
- Required: yes
- Type: list
- Cardinality: 3-7 items
- Source: brief text
- Fallback: infer from explicit pain points only; avoid generic filler

### 7. `proof_title`
- Required: yes
- Type: short heading
- Source: extracted or inferred
- Fallback: `Proof points` or `Impact`

### 8. `proof_summary`
- Required: optional
- Type: 1-2 sentences
- Source: brief text
- Fallback: omit or keep very short

### 9. `stats`
- Required: optional but preferred
- Type: structured list of metrics
- Cardinality: ideally 3 items for fixed 3-stat layouts
- Source: brief text only
- Fallback: use labelled placeholders like `—` when the layout requires a slot
- Hard rule: never invent statistics, counts, or percentages

### 10. `workflow_steps`
- Required: yes
- Type: list of steps
- Cardinality: exactly 4 when used with fixed 4-step layouts
- Source: brief text
- Fallback: infer a sensible 4-step flow from the product narrative
- Allowed inference: step labels and ordering
- Constraint: icon choice must match the semantic meaning of each step

### 11. `solution_summary`
- Required: yes
- Type: 1-2 sentences
- Source: brief text
- Fallback: concise explanation of how the product addresses the challenge

### 12. `solution_bullets`
- Required: yes
- Type: list
- Cardinality: 3-5 items
- Source: brief text
- Fallback: use explicit capabilities, not empty marketing phrases

### 13. `why_it_matters`
- Required: yes
- Type: list
- Cardinality: 3-7 items
- Source: brief text
- Fallback: infer practical benefits from the solution/challenge relationship

### 14. `feature_list`
- Required: yes
- Type: list of feature objects
- Cardinality: 3-6 items
- Each item:
  - `name`
  - `description`
- Source: brief text
- Fallback: derive from named capabilities in the brief

### 15. `contact_links`
- Required: optional
- Type: list
- Cardinality: 1-2 items
- Source: brief text or approved defaults from the selected variant/design system
- Constraint: do not fabricate URLs or email addresses beyond approved defaults

### 16. `hero_image`
- Required: optional
- Type: image path/URL or sentinel value
- Source: startup form
- Allowed values:
  - provided image path/URL
  - empty = use layout default behavior
  - `skip` = remove image region if the layout supports it

## Allowed inference vs forbidden fabrication

### Allowed inference
- Headings like `The business challenge`
- Workflow wording when the process is obvious from the brief
- Benefit phrasing derived from explicit product capabilities
- Concise tagline synthesis from explicit positioning

### Forbidden fabrication
- Statistics, percentages, counts, volumes, customer numbers
- Compliance claims not present in the source material
- Awards, certifications, or proof claims not present in the source material
- Contact information without source or approved variant default

## Sparse-brief rule

If the brief is sparse:
- keep the structure clean
- shorten rather than pad
- prefer omission or placeholders where allowed
- ask at most one follow-up if a required core concept is truly missing
