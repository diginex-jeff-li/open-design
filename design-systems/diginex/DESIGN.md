# Diginex Library — Design System

> Category: Custom
> Software-native, quiet UI on Nuxt UI v4 / Tailwind CSS v4. Lilac-3 accent on a slate neutral ramp. WCAG 2.1 AA compliant semantic tokens.

## 1. Visual Theme & Atmosphere

Diginex is a quiet, software-native interface. The canvas is pure white with slate-50 elevated surfaces, hairline 1px borders, and almost no shadow on flat surfaces. Where many design systems lean decorative, Diginex recedes: the chrome stays out of the way so content and data carry the page.

The signature move is a single brand accent — lilac-3 (`#8171D7`) — used sparingly for primary actions and the highest-signal brand moments. A secondary orange-3 anchor (`#E66B1A`) exists for occasional secondary brand emphasis. Semantic colour (green/blue/yellow/red) is reserved strictly for status; it never decorates. Neutrals are Tailwind slate — cool, software-default, with no warm undertone.

Typography is split: DM Sans for display/headings, Open Sans for body and UI (the face actually rendered on components in the source file), with Public Sans as the documented token fallback. Body text defaults to medium (500) weight, which gives the UI a calm, considered tone rather than a bold marketing one. The dominant component corner radius is 3px for buttons (reduced from 6px in v4.0.0); the base `--ui-radius` is 4px and Nuxt UI derives component radii as `calc(var(--ui-radius)*1.5)` ≈ 6px and `*2` ≈ 8px. Pills and avatars use `rounded-full`.

**Key Characteristics:**

- White canvas with slate-50 elevated surfaces — cool, software-native
- Lilac-3 (`#8171D7`) as the single brand accent, used sparingly
- Orange-3 (`#E66B1A`) as a secondary brand anchor
- Tailwind slate neutral ramp — no warm undertone
- Hairline 1px borders (`#e2e8f0`), ring-based depth, almost no drop shadow
- Button radius 3px; base `--ui-radius` 4px (component radii derived via calc); pills/avatars `rounded-full`
- DM Sans display + Open Sans body, medium (500) default weight
- Semantic colour reserved for status (success/info/warning/error) only
- WCAG 2.1 AA fixes applied to all semantic tokens

## 2. Color Palette & Roles

### Brand

- **Lilac-3** (`#8171D7`, primary-500/400): The core brand colour — primary CTAs, focused inputs, highest-signal brand moments. Deliberately restrained. The 400 and 500 steps share the same anchor per the v4.0.0 Figma changelog.
- **Orange-3** (`#E66B1A`, secondary-500): Secondary brand anchor — used sparingly for secondary emphasis. The 400 (`#E66A1A`) and 500 (`#E66B1A`) steps are near-identical per the changelog.

### Status (semantic, exact Tailwind 500 anchors — WCAG 2.1 AA fixed)

- **Success** (`#00c16a`, success-500): positive states — Tailwind green-500. Dark: `#00dc82` (green-400).
- **Info** (`#2b7fff`, info-500): informational states — Tailwind blue-500. Dark: `#51a2ff` (blue-400).
- **Warning** (`#efb100`, warning-500): cautionary states — Tailwind yellow-500. Dark: `#fcc800` (yellow-400).
- **Error** (`#fb2c36`, error-500): destructive/error states — Tailwind red-500. Dark: `#ff6467` (red-400).

### Surface & Background

- **White** (`#ffffff`): primary page background.
- **Slate-50** (`#f8fafc`): elevated card surfaces (`--surface`).
- **Slate-100** (`#f1f5f9`): accented / secondary surfaces (`--surface-warm`).
- **Slate-900** (`#0f172b`): dark-theme page background and inverted surfaces.

### Neutrals & Text (Tailwind slate ramp)

- **slate-700** (`#314158`): primary text (`--fg`); also the neutral solid button colour.
- **slate-600** (`#45556c`): emphasised secondary text (`--fg-2`).
- **slate-500** (`#64748e`): secondary body text (`--muted`).
- **slate-400** (`#90a1b9`): tertiary text, metadata (`--meta`).
- **slate-900** (`#0f172b`): highlighted text (`--ui-text-highlighted`); neutral solid button (button variant).

### Borders

- **slate-200** (`#e2e8f0`): standard hairline border (`--border`).
- **slate-300** (`#cad5e2`): emphasised border, section dividers (`--border-soft`); also the neutral outline button colour.

### Full ramps

Brand ramps (`primary`, `secondary`) expose the 400–700 steps extracted from the v4.0.0 Figma file. `success`/`info`/`warning`/`error`/`neutral` are exact Tailwind ramps (50–950).

| Ramp      | 400        | 500 anchor | 600        | 700        | Source                                 |
| --------- | ---------- | ---------- | ---------- | ---------- | -------------------------------------- |
| primary   | `#8171D7`  | `#8171D7`  | `#755DCB`  | `#634AB8`  | lilac-3 palette (v4.0.0 extraction)    |
| secondary | `#E66A1A`  | `#E66B1A`  | `#CB4B14`  | `#A83214`  | orange-3 palette (v4.0.0 extraction)   |
| success   | `#00DC82`  | `#00C16A`  | `#00A155`  | `#007F45`  | Tailwind green                         |
| info      | `#51A2FF`  | `#2B7FFF`  | `#155DFC`  | —          | Tailwind blue                          |
| warning   | `#FCC800`  | `#EFB100`  | `#D08700`  | `#A65F00`  | Tailwind yellow                        |
| error     | `#FF6467`  | `#FB2C36`  | `#E7000B`  | `#C10007`  | Tailwind red                           |
| neutral   | `#90A1B9`  | `#64748E`  | `#45556C`  | `#314158`  | Tailwind slate (= neutral solid button)|

### Nuxt UI semantic aliases (`--ui-*` family)

The `--ui-*` family maps the ramp onto Nuxt UI v4 component roles with light/dark assignments (see `tokens.css`). In light mode `--ui-primary` = primary-500 (`#8171D7`); in dark mode it flips to primary-400 (`#8171D7`, shared anchor). The same 400-anchor flip applies to all status colours; neutral text/bg roles invert.

| Token                  | Light          | Dark           |
| ---------------------- | -------------- | -------------- |
| `--ui-primary`         | primary-500    | primary-400    |
| `--ui-secondary`       | secondary-500  | secondary-400  |
| `--ui-success`         | success-500    | success-400    |
| `--ui-info`            | info-500       | info-400       |
| `--ui-warning`         | warning-500    | warning-400    |
| `--ui-error`           | error-500      | error-400      |
| `--ui-text`            | neutral-700    | neutral-200    |
| `--ui-text-dimmed`     | neutral-400    | neutral-500    |
| `--ui-text-muted`      | neutral-500    | neutral-400    |
| `--ui-text-toned`      | neutral-600    | neutral-300    |
| `--ui-text-highlighted`| neutral-900    | White          |
| `--ui-bg`              | White          | neutral-900    |
| `--ui-bg-elevated`     | neutral-100    | neutral-800    |
| `--ui-bg-accented`     | neutral-200    | neutral-700    |
| `--ui-bg-inverted`     | neutral-900    | White          |
| `--ui-border`          | neutral-200    | neutral-800    |
| `--ui-border-accented` | neutral-300    | neutral-700    |
| `--ui-border-inverted` | neutral-900    | White          |

### WCAG 2.1 AA audit notes (v4.0.0)

The v4.0.0 extraction applied WCAG 2.1 AA contrast fixes to all semantic tokens:

- **Status colours** use the standard Tailwind 400 step for dark mode (higher luminance for dark backgrounds) and 500 for light mode — both pairs meet AA contrast against their respective backgrounds.
- **Text tokens** invert correctly: `--ui-text` (slate-700 on white, slate-200 on slate-900) both exceed 4.5:1.
- **Brand accent** `#8171D7` (lilac-3) meets AA for large text and UI components on white; pair with white text (`--accent-on`) for solid fills.
- **Button variants** use 600/700 solid anchors for sufficient contrast of white-on-colour text (see §4).

## 3. Typography Rules

### Font Family

- **Display / headings**: `DM Sans` (fallback: Open Sans, system-ui)
- **Body / UI**: `Open Sans` (fallback: Public Sans, system-ui) — the rendered face on components in the source file
- **Code**: `JetBrains Mono` (fallback: ui-monospace, Menlo)

### Hierarchy (Tailwind v4 default scale)

| Role            | Font           | Size     | Weight  | Line Height |
| --------------- | -------------- | -------- | ------- | ----------- |
| Display / Hero  | DM Sans        | 48–128px | 600     | 1.2         |
| Section heading | DM Sans        | 36px     | 600     | 1.2         |
| Sub-heading     | DM Sans        | 24–30px  | 600     | 1.3         |
| Card title      | DM Sans        | 20px     | 600     | 1.3         |
| Body large      | Open Sans      | 18px     | 400     | 1.5         |
| Body standard   | Open Sans      | 16px     | 400–500 | 1.5         |
| Body small      | Open Sans      | 14px     | 400–500 | 1.5         |
| Caption / meta  | Open Sans      | 12px     | 400     | 1.5         |
| Code            | JetBrains Mono | 14px     | 400     | 1.5         |

The Figma file defines **66 text styles**: each scale step (xs through 9xl) in regular, medium, semibold, bold, and italic variants. The type scale: xs=12px, sm=14px, base=16px, lg=18px, xl=20px, 2xl=24px, 3xl=30px, 4xl=36px, 5xl=48px, 6xl=60px, 7xl=72px, 8xl=96px, 9xl=128px.

### Principles

- **DM Sans for headings, Open Sans for UI**: display type carries headings with weight 600; body and all functional UI use Open Sans at 400–500.
- **Medium (500) is the UI default**: buttons, labels, nav use 500 — calm and considered, not bold.
- **Comfortable body line-height (1.5)**: a relaxed software-default reading rhythm.
- **Slight display tracking (-0.01em)**: large display type tightened marginally for tighter headlines.

## 4. Component Stylings

### Buttons

Buttons in v4.0.0 have a **3px radius** (reduced from 6px), padding `10px 6px`, gap `6px`, and a default size of 92×32px. Each colour family exposes a **solid** (filled) and **outline** variant.

| Variant   | Solid (step)            | Outline (step)          |
| --------- | ----------------------- | ----------------------- |
| primary   | `#755DCB` (600)         | `#8171D7` (500)         |
| secondary | `#CB4B14` (600)         | `#E66B1A` (500)         |
| warning   | `#A65F00` (700)         | `#EFB100` (500)         |
| success   | `#007F45` (700)         | `#00C16A` (500)         |
| info      | `#155DFC` (600)         | `#2B7FFF` (500)         |
| error     | `#E7000B` (600)         | `#FB2C36` (500)         |
| neutral   | `#0F172B` (900)         | `#CAD5E2` (300)         |

**Primary (brand)**

- Background: lilac-3 600 (`#755DCB`), text white
- Radius: 3px, padding `10px 6px`, gap 6px
- Outline variant: border `#8171D7` (500)
- Hover: `--accent-hover` (8% darker); Active: `--accent-active` (14% darker)

**Secondary / Default**

- Background: orange-3 600 (`#CB4B14`), text white (solid); outline border `#E66B1A` (500)
- Radius: 3px

**Neutral**

- Solid: `#0F172B` (slate-900); Outline: `#CAD5E2` (slate-300)
- Radius: 3px

**Destructive**

- Background `--danger` / error 600 (`#E7000B`), text white

**Ghost / Link**

- Transparent background, text `--accent`; hover background `--surface`

### Component sets (27)

The Figma file defines 27 component sets: Alert, Avatar, Badge, ButtonPrimary, ButtonSecondary, ButtonWarning, ButtonSuccess, ButtonInfo, ButtonError, ButtonNeutral, Calendar, Carousel/Dot, Checkbox, Chip, Logo, PricingPlan, Progress, Radio, Slider, Switch, _ChatMessage, _Kbd, _Separator, _SliderIndicator, _Stepper_Item, _Tab, _calendar-item.

### Cards & Containers

- Background: `--surface` (slate-50) or white on the page canvas
- Border: hairline `1px solid var(--border)` (slate-200)
- Radius: 6px standard (`calc(var(--ui-radius)*1.5)`), 8px for featured containers (`calc(var(--ui-radius)*2)`)
- Shadow: ring (`0 0 0 1px var(--border)`) for interactive states; whisper lift (`--elev-raised`) only for elevated content

### Inputs & Forms

- Text: `--fg`, background white, border `1px solid var(--border)`
- Radius: 6px (`calc(var(--ui-radius)*1.5)`), padding ~8px 12px
- Focus: `--focus-ring` (3px lilac-3 ring at 30% opacity)
- Nuxt UI components apply `rounded-[var(--ui-radius)]`, `*1.5` (≈6px), or `*2` (≈8px)

### Navigation

- Sticky top nav on white with hairline bottom border
- Links in `--fg` / `--muted`; active link in `--accent`
- CTA: primary lilac-3 button

### Badges / Chips

- `rounded-full` (`--radius-pill`), small padding, status colours for semantic badges

## 5. Layout Principles

### Spacing System

- Base unit: 4px (`--space-1`)
- Full Tailwind v4 scale (33 steps): 0.5=2px, 1=4px, 1.5=6px, 2=8px, 2.5=10px, 3=12px, 3.5=14px, 4=16px, 5=20px, 6=24px, 7=28px, 8=32px, 9=36px, 10=40px, 11=44px, 12=48px, 14=56px, 16=64px, 20=80px, 24=80px, 28=112px, 32=128px, 36=144px, 40=160px, 44=176px, 48=192px, 52=208px, 56=224px, 60=240px, 64=256px, 72=288px, 80=320px, 96=384px
- Card internal padding: ~16–24px
- Section vertical spacing: 80px desktop / 64px tablet / 48px phone

### Grid & Container

- Max container width: 1200px (`--container-max`), centred
- Gutters: 24px desktop / 16px tablet / 12px phone
- Feature sections: 2–3 column card grids; data surfaces favour dense tables

### Whitespace Philosophy

- **Quiet rhythm**: consistent 16–24px gutters; the layout breathes without being airy.
- **Content-first**: chrome recedes; data and text dominate each surface.

### Border Radius Scale

- 2px (`rounded-xs`): tightest control
- 4px (`--ui-radius`, `rounded-sm`): base — small controls
- 6px (`rounded-md`, `calc(var(--ui-radius)*1.5)`): standard component radius — cards, inputs
- 8px (`rounded-lg`, `calc(var(--ui-radius)*2)`): featured containers
- 12px (`rounded-xl`), 16px (`rounded-2xl`), 24px (`rounded-3xl`), 32px (`rounded-4xl`): larger surfaces
- 999px (`rounded-full`): chips, avatars

> **Note:** Button radius is **3px** — the single exception below the base `--ui-radius` (4px), set explicitly in the v4.0.0 extraction.

### Shadow / Effect Styles

Six drop-shadow levels from the Figma file: `shadows/drop-shadow-sm`, `shadows/drop-shadow`, `shadows/drop-shadow-md`, `shadows/drop-shadow-lg`, `shadows/drop-shadow-xl`, `shadows/drop-shadow-2xl`. Diginex uses these sparingly — see §6.

## 6. Depth & Elevation

| Level     | Treatment                          | Use                             |
| --------- | ---------------------------------- | ------------------------------- |
| Flat      | No shadow, no border               | Page canvas, inline text        |
| Contained | `1px solid var(--border)`          | Standard cards, sections        |
| Ring      | `0 0 0 1px var(--border)`          | Interactive cards, hover states |
| Whisper   | `rgba(15,23,43,0.05) 0px 4px 24px` | Elevated feature cards only     |

**Shadow Philosophy:** Diginex communicates depth through hairline borders and ring shadows, not drop shadows. Flat surfaces carry no shadow. When elevation is genuinely needed, a whisper-soft lift (5% opacity, 24px blur) suggests floating without casting. The system avoids heavy, layered shadows entirely.

## 7. Motion & Interaction

- **Durations**: fast 150ms (`--motion-fast`), base 200ms (`--motion-base`)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (`--ease-standard`) — smooth, slightly decelerating
- **Hover**: background shade shift (e.g. `--accent-hover`); dark-mode colour transition only
- **Focus**: 3px lilac-3 ring (`--focus-ring`)
- **Principle**: motion is restrained and purposeful. A token reference surface does not animate beyond hover labels and a colour-mode transition. No bounce, no stagger, no decorative motion.

## 8. Voice & Brand

Diginex speaks in a calm, competent, software-native voice. Copy is concise and factual — labels over prose, verbs over nouns. Tone is professional without being corporate; helpful without being chatty. Errors state what happened and what to do next, in plain language. The product feels like a tool made by people who respect the user's attention.

## 9. Anti-patterns

- **No warm undertones** — neutrals are cool slate. Do not introduce warm grays, cream, or parchment tones.
- **No saturated decoration** — the accent is lilac-3 and used sparingly; do not paint large areas with brand colour or introduce extra hues.
- **No heavy shadows** — depth comes from hairline borders and rings. Do not stack drop shadows.
- **No semantic colour for decoration** — green/blue/yellow/red are status only, never branding or ornament.
- **No sharp corners on controls** — buttons use 3px; cards/inputs use 6px minimum. Do not go below the button radius (3px) or `--ui-radius` (4px) on interactive elements.
- **No bold (700+) body text** — 500 is the UI ceiling for body; reserve 600 for headings.
- **No invented colours** — every value traces to the v4.0.0 Figma extraction or the documented Tailwind ramp. Do not guess ramps.
- **No shadow-less borders AND no border-less shadows** — pick the ring or the hairline, do not double up.