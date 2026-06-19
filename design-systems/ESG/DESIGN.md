# ESG

> Category: ESG / Sustainability Platform
> Professional, data-driven, sustainability-focused — clean corporate blue with climate-aware gradients.

## 1. Visual Theme & Atmosphere
The ESG Design System (by Diginex) is clean, precise, and trustworthy. It pairs a vivid corporate blue (`#2b61f5`) with Inter's geometric neutrality to signal credibility and data clarity. Surfaces are layered with a semantic elevation system (ground → surface → elevated → high) giving dense dashboards clear visual hierarchy. Climate gradients (green, teal, deep purple) bring ESG category colour without overriding the neutral chrome.

**Key Characteristics:**
- Radius system: 8px on small/default interactive elements, 12px on large ones
- Inter font family — Regular 400, Medium 500, Semibold 600 only
- Semantic colour tokens: every value references semantic color collections, no raw hex in components
- Elevation via surface tiers: `bg-surface-ground` → `bg-surface-default` → `bg-surface-elevated` → `bg-surface-high`
- ESG-category gradients (Climate 1/2, Gradient Special) reserved for data visualisation and hero moments

## 2. Color Palette & Roles
### Primary
- **Brand Primary** (`#2b61f5`): Main brand blue — primary buttons, active links, focus rings, selected states
- **Brand Primary Low** (`#eff5ff`): Ghost/plain button backgrounds, subtle highlights
- **Brand Primary Med** (`#d6e4ff`): Mid-opacity primary tint — hover backgrounds, chips
- **Brand Primary High** (`#1a4fd4`): Pressed/active states — dark blue
- **Text Primary** (`#2b61f5`): Active/interactive text, links
- **Text Color** (`#1a1d26`): Main body & heading text — dark neutral
- **Text Primary Disabled** (`#9C9DB4`): Muted interactive text
- **Text Primary Overlay** (`#FFFFFF`): Reversed text on dark/primary fills

### Surface & Background
- **Page Background** (`#F7F8FA`): Main app background
- **Default Surface** (`#FFFFFF`): Standard content area
- **Card Background** (`#FFFFFF`): Elevated card surfaces
- **Nav Background** (`#F3F4FA`): Side/top navigation surface
- **Surface Low** (`#FAFBFC`): Subtle lift — hover states, secondary panels
- **Surface Med** (`#F3F4FA`): Moderate lift — dropdowns, popovers
- **Surface High** (`#FFFFFF`): Highest light surface — modals, dialogs
- **Surface Black** (`#1a1d26`): Highest contrast overlay surface — dark mode sections, mega-menus
- **Surface Secondary** (`#F3F4FA`): Secondary panel backgrounds

### Border
- **Border Default** (`#E1E5EB`): Standard element borders
- **Border Low** (`#EDF1F5`): Subtle inner separators
- **Border Med** (`#D1D5DC`): Prominent section dividers
- **Border High** (`#9CA3AF`): Strong visual boundaries
- **Border Focus** (`#2b61f5`): Focus ring — brand blue
- **Border Disabled** (`#E5E7EB`): Dimmed border for disabled elements
- **Border Black** (`#1a1d26`): High-contrast borders
- **Border White** (`#FFFFFF`): Borders on dark surfaces
- **Primary Border** (`#2b61f5`): Brand-coloured border
- **Primary Border Low** (`#d6e4ff`): Subtle brand-coloured border

### Functional Colors
- **Success** (`#06C270`): Positive confirmation — Green
- **Warning** (`#FFCC00`): Caution alerts — Yellow
- **Error** (`#FF3B3B`): Destructive actions, danger state — Red
- **Info** (`#0063F7`): Informational — Blue
- **Neutral** (`#8F90A6`): Grey tones — metadata, captions

### Gradients
- **Climate** (`linear-gradient(135deg, #06C270, #0EA5E9)`): ESG environment category gradient
- **Climate 1** (`linear-gradient(135deg, #06C270, #10B981)`): Climate sub-category — green spectrum
- **Climate 2** (`linear-gradient(135deg, #0EA5E9, #6366F1)`): Climate sub-category — blue-teal spectrum
- **Gradient Special** (`linear-gradient(135deg, #2b61f5, #8B5CF6)`): Hero/marketing gradient
- **Gradient Special BG 40%** (`linear-gradient(135deg, rgba(43,97,245,0.4), rgba(139,92,246,0.4))`): Blended at 40% over `#FFFFFF` for section backgrounds
- **Dark Blue** (`#111827`): Deep navy fill — data-heavy sections
- **Dark Purple** (`#4C1D95`): Governance/social category accent
- **Dark Blue BG 10%** (`rgba(17,24,39,0.1)`): 10% opacity dark blue — subtle tinted areas
- **Special 2** (`linear-gradient(135deg, #F59E0B, #EF4444)`): Secondary special gradient — risk/alert emphasis

## 3. Typography Rules
### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Monospace**: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`

### Hierarchy
| Role                 | Font  | Size  | Weight | Line Height | Letter Spacing | Notes                          |
| -------------------- | ----- | ----- | ------ | ----------- | -------------- | ------------------------------ |
| H1 / Large Heading 1 | Inter | 38px  | 600    | 1.2         | 0              | Page titles                    |
| H2 / Large Heading 2 | Inter | 30px  | 600    | 1.2         | 0              | Section headings               |
| Body Semibold        | Inter | 14px  | 600    | 20px        | 0              | Emphasized body, card titles   |
| Body Medium          | Inter | 14px  | 500    | 20px        | 0              | Default body, nav labels       |
| Body Regular         | Inter | 14px  | 400    | 20px        | 0              | Descriptions, supporting copy  |
| Body Underline       | Inter | 14px  | 400    | 20px        | 0              | Links in prose                 |
| Body Strikethrough   | Inter | 14px  | 400    | 20px        | 0              | Deprecated values              |
| Tag / Caption        | Inter | 12px  | 400    | 16px        | 0              | Chips, badges, metadata        |

### Principles
- Sentence case everywhere; no ALL-CAPS except badge/tag labels defined by the token
- Body text minimum 14px — never go below `Body/14px - Regular`
- Headings use Semibold (600) only; avoid Bold (700)
- Pairs: H1 38px for page titles, H2 30px for section headings, 14px for all body/data
- Inter is the only typeface — do not introduce system fonts, Google Fonts, or alternate weights

## 4. Component Stylings
### Buttons
**Primary Button — Large**
- Background: `#2b61f5` (`--accent`)
- Text: White (`--accent-on`)
- Padding: 10px 20px
- Border-radius: 12px (`--radius-lg`)
- Font: Inter Medium, 14px / 20px line-height
- Shadow: `0px 2px 0px rgba(0,0,0,0.04)` (button-primary drop shadow)

**Primary Button — Default**
- Background: `#2b61f5` (`--accent`)
- Text: White (`--accent-on`)
- Padding: 6px 16px
- Border-radius: 8px (`--radius-sm`)
- Font: Inter Medium, 14px / 20px

**Primary Button — Small**
- Background: `#2b61f5` (`--accent`)
- Text: White (`--accent-on`)
- Padding: 4px 12px
- Border-radius: 8px (`--radius-sm`)
- Font: Inter Regular, 12px / 16px

**Ghost / Plain Button — Large**
- Background: `#eff5ff` (`--primary-low`)
- Text: `#2b61f5` (`--accent`)
- Padding: 10px 20px
- Border-radius: 12px (`--radius-lg`)
- Font: Inter Medium, 14px / 20px

**Danger Button** — mirrors primary sizing; uses `--danger` fill with white text

**Disabled State** — all variants use `--border-disabled` border and `--meta` text color

### Inputs & Form Fields
- Background: `--surface`
- Border: 1px `--border`
- Border-radius: 8px (`--radius-sm`)
- Padding: 10px 14px
- Focus: `--border-focus` (brand blue ring at 2px spread, 25% opacity)
- Error: `--danger` border
- Placeholder: `--meta` text color
- Choicebox (checkbox & radio): 20×20px, states — default / hover / pressed / focus / disabled

### Cards
- Background: `--surface`
- Border: Elevation shadow replaces explicit border
- Border-radius: 8px (`--radius-sm`)
- Padding: 24px (`--space-6`)
- Shadow (default): `--elev-raised`
- Shadow (raised): `--elev-card` (see §6 Depth & Elevation)

### Navigation
- **Top Nav**: Height 64px, background `--surface`, bottom border `--border`
- **Side Nav**: Width 240px, background `--surface-warm` (`--nav-bg`)
- **Nav Items**: Border-radius 8px, padding 10px 16px
- **Active State**: Background `--primary-low`, text `--accent`
- **Inactive State**: Background transparent, text `--meta`
- **Icons**: SVG icons at 16×16px with currentColor

### Distinctive Components
- **Choicebox** — combined checkbox + radio component with 5 states (default, hover, pressed, focus, disabled) × 2 types × 2 active states
- **Icon Buttons** — `size=large/default/small, type=icon` variants in both primary and secondary intent
- **Badges/Tags** — 12px Regular (`--text-xs`), use `--primary-low` or functional colors for status
- **Dividers** — 1px solid borders using `--border-soft` for row separators, `--border` for section separators
- **ESG Category Chips** — use Climate / Climate 1 / Climate 2 gradients to colour-code E, S, G pillars

## 5. Layout Principles
### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48

### Grid
- Desktop: 12-column grid, 1200px max content width
- Content padding: 32px within content area
- Card layouts use CSS Grid with auto-fit columns

### Whitespace Philosophy
- Generous card internal padding (24px) keeps dense data readable
- Section separation: 48–80px vertical space between major sections
- Card internal padding: 24px
- Nav item padding (10px 16px) balances scannability with density

## 6. Depth & Elevation
| Level        | Surface Token         | Use                                     |
| ------------ | --------------------- | --------------------------------------- |
| Ground (0)   | `--bg`                | Main page background                    |
| Default (1)  | `--surface`           | Standard content areas, input fields    |
| Surface (2)  | `--surface`           | Panel backgrounds, table rows           |
| Low (3)      | `--surface-low`       | Hover states, secondary panels          |
| Med (4)      | `--surface-med`       | Dropdowns, popovers                     |
| Elevated (5) | `--surface`           | Cards (with --elev-raised shadow)       |
| High (6)     | `--surface`           | Modals, dialogs (with --elev-modal shadow) |
| Nav          | `--nav-bg`            | Sidebar, navigation panels              |
| Black        | `--surface-black`     | Dark overlays, mega-menus               |

Shadow effects:
- **Flat**: `--elev-flat` — page background, body text
- **Ring**: `--elev-ring` — hairline border ring
- **Raised (01)**: `--elev-raised` — default cards, pressed buttons
- **Button (02)**: `--elev-button` — default buttons
- **NavBar (03)**: `--elev-navbar` — navigation bars
- **Card (04)**: `--elev-card` — raised cards, active buttons
- **Popover (05)**: `--elev-popover` — dropdowns, tooltips, pickers
- **Modal (06)**: `--elev-modal` — modals, dialogs

## 7. Do's and Don'ts
### Do
- ✅ Use `#2b61f5` (`--accent`) as the single primary action colour — one blue CTA per screen
- ✅ Reference semantic tokens (`--surface`, `--border`, `--accent`) — never hard-code raw hex except `#2b61f5` and `#eff5ff`
- ✅ Use Inter at 400 / 500 / 600 weight only
- ✅ Apply elevation shadows in the correct semantic level (cards=raised, popovers=05, modals=06)
- ✅ Use ESG climate/gradient colours exclusively for data visualisation and category indicators (E/S/G pillars)

### Don't
- ❌ Never use pure black (`#000000`) for text — use `--fg` token (`#1a1d26`)
- ❌ Don't use the Climate or Gradient Special fills for UI chrome (buttons, headers, nav)
- ❌ Don't mix button sizes within the same action group — pick one size tier (large / default / small) per context
- ❌ Don't go below 12px for any visible text (`--text-xs` is the floor)
- ❌ Don't use Bold (700) — Semibold (600) is the maximum weight in the ESG DS

## 8. Responsive Behavior
### Breakpoints
| Name    | Width      | Key Changes                                                       |
| ------- | ---------- | ----------------------------------------------------------------- |
| Mobile  | <640px     | Single column, stacked sections, sidebar collapsed to bottom nav  |
| Tablet  | 640–1024px | Condensed sidebar (collapsible overlay), reduced content padding  |
| Desktop | ≥1024px    | Full layout — 240px sidebar + content area, 1200px max-width      |

## 9. Agent Prompt Guide
### Quick Color Reference
- Primary: `#2b61f5`
- Primary Low (ghost bg): `#eff5ff`
- Text on Primary bg: `white`
- Text Primary (interactive): `#2b61f5`
- Text Color (body): `#1a1d26`
- Text Secondary: `#555770`
- Text Muted / Placeholder: `#9C9DB4`
- Page Background: `#F7F8FA`
- Surface (cards/inputs): `#FFFFFF`
- Nav Background: `#F3F4FA`
- Border: `#E1E5EB`
- Success: `#06C270` | Warning: `#FFCC00` | Error: `#FF3B3B` | Info: `#0063F7`

### Example Component Prompts
- "Create a primary CTA button: `#2b61f5` background, white Inter Medium 14px text, 12px radius, 10px 20px padding."
- "Create a ghost button: `#eff5ff` background, `#2b61f5` Inter Medium 14px text, 12px radius, 10px 20px padding."
- "Design a card with `#FFFFFF` background, 8px radius, 24px padding, raised shadow."
- "Build a heading at 38px Semibold Inter, body at 14px Regular Inter, line-height 20px."
- "Tag/badge: `#eff5ff` background, `#2b61f5` text, Inter Regular 12px/16px, 8px radius, 4px 12px padding."

### Iteration Guide
1. Brand blue (`#2b61f5`) is non-negotiable — never substitute another blue or invent variants
2. Always use semantic surface tokens for backgrounds — elevation is expressed via token tier, not raw colours
3. Gradients (Climate, Gradient Special, Dark Purple) are data/category accents only — never on interactive chrome
4. Inter is the only typeface — do not introduce system fonts, Google Fonts, or alternate weights
