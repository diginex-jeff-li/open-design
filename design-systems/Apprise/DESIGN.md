# APPRISE

> Category: Design & Creative
> Clean enterprise SaaS for ESG data management — deep ocean blue meets bright yellow accent, precise and data-dense.

## 1. Visual Theme & Atmosphere
APPRISE is a professional enterprise ESG platform with a clean, precise visual personality. The design pairs deep ocean blue (`#275E86`) with a vivid yellow accent (`#EDCD55`) for an authoritative yet approachable feel. Layouts are structured and data-dense, with generous white space in cards and sidebars. The overall tone is trustworthy, technical, and institutional — built for compliance-driven users.

**Key Characteristics:**
- 8px-base spacing grid; nav padding is `12px 16px`, button padding is `8px 16px`, content padding is `20px`
- Inter for display/body copy; Roboto for UI chrome, nav labels, and button text
- 4px radius on buttons, 8px on inputs/cards/nav items — escalating rounding by elevation
- Brand primary `#275E86` (blue) and `#EDCD55` (yellow) appear in tandem throughout the product

## 2. Color Palette & Roles
### Primary
- **Brand Primary** (`#275E86`): APPRISE Blue — primary buttons, active nav state, brand marks, headings, border accents
- **Brand Accent** (`#EDCD55`): APPRISE Yellow — logo accent, secondary highlights, gradient start
- **Interactive / Link** (`#3E7BFA`): Main interactive color — hyperlinks, focus indicators, divider lines, call-to-action accents
- **Text Primary** (`#28293D`): Body text, headings, high-emphasis labels
- **Text Secondary** (`#555770`): Descriptions, supporting copy, captions

### Surface & Background
- **Page Background** (`#F7F7FA`): Main page background — used on all full-page containers
- **Sidebar / Secondary Surface** (`#F3F4FA`): Left nav, secondary panels, inactive nav tiles
- **Card Background** (`#FFFFFF`): Elevated card surfaces, white panels, top nav bar
- **Nav Active Background** (`#E6EEF5`): Blue Shade/01 — selected nav item fill
- **Border** (`#E1E1E1`): Default border, dividers, input borders (Gray Shade/02)

### Functional Colors
- **Success** (`#06C270`): Positive actions, confirmations, status badges — Green 1
- **Warning** (`#FFCC00`): Cautions, alerts, pending states — Yellow 1
- **Error** (`#FF3B3B`): Destructive actions, error states, validation — Red 1
- **Info** (`#0063F7`): Informational states, tooltips — Blue 1

### Additional Brand Colors
- **Lumen Blue / Product Variant** (`#150A84`): Dark indigo for Lumen product line, used in logo variant
- **Lumen Accent** (`#6D5FFF`): Purple-blue secondary for Lumen — component accents
- **Secondary Blue** (`#8FD0ED`): Light blue tint — data visualisation, highlight backgrounds
- **Secondary Yellow** (`#EEF08E`): Light yellow tint — data visualisation, gradient end
- **Nav Dark** (`#2E3061`): Page title text, dark nav headings
- **Text Muted** (`#8F90A6`): Category labels, overlines, placeholder text
- **Text Inactive** (`#9C9DB4`): Disabled or inactive nav items, ghost text

### Gradients
- Brand gradient: `linear-gradient(90deg, #275E86 41.8%, #8FD0ED 18.6%, #EEF08E 66.7%, #E8CA41 106.8%)` — used decoratively in logo surround and feature headers

## 3. Typography Rules
### Font Family
- **Primary (Display / Body)**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **UI / Navigation**: `'Roboto', 'Inter', -apple-system, sans-serif`
- **Monospace**: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`

### Hierarchy
| Role                 | Font    | Size | Weight | Line Height | Letter Spacing | Notes              |
| -------------------- | ------- | ---- | ------ | ----------- | -------------- | ------------------ |
| H1 / Display         | Inter   | 48px | 700    | 1.2         | -0.02em        | Hero headlines     |
| H2 / Section Title   | Inter   | 32px | 700    | 44px        | 0              | Section headers    |
| H3 / Page Title      | Roboto  | 24px | 500    | 32px        | 0              | Page-level headings |
| H4 / Card Title      | Inter   | 20px | 600    | 1.4         | 0              | Card titles        |
| Body Large           | Inter   | 18px | 400    | 1.6         | 0              | Intro text, ledes  |
| Body / Nav           | Roboto  | 16px | 400    | 24px        | 0              | Standard body, nav labels |
| Nav Active / Medium  | Roboto  | 16px | 500    | 24px        | 0              | Active nav, button labels |
| Label / Overline     | Inter   | 14px | 700    | 1.4         | 0.125em        | Uppercase labels   |
| Caption / Small      | Inter   | 12px | 400    | 1.0         | 0              | Captions, metadata |

### Principles
- Use Inter for all display, body, and caption content; use Roboto for navigation chrome and interactive button labels
- Overline labels are always uppercase with `letter-spacing: 2px` (0.125em), Inter Bold 14px
- Nav item text uses `font-variation-settings: 'wdth' 100` for consistent Roboto variable width
- Body text never goes below 12px; minimum interactive text size is 14px

## 4. Component Stylings
### Buttons
**Primary Button**
- Background: Brand Primary (`#275E86`)
- Text: White (`#FFFFFF`), Roboto Regular 16px, lh 24px
- Padding (Medium): `8px 16px`; (Large): `10px 20px`
- Border-radius: `4px`
- Border: `1px solid #275E86`
- Shadow: `0px 2px 0px rgba(0,0,0,0.04)` (drop-shadow/button-primary)
- Sizes: Small 22–24px height, Medium 32px height, Large 40px height
- Hover: darken background toward `#244B68` (Blue Shade/11)

**Secondary Button**
- Background: transparent
- Border: `1px solid #275E86`
- Text: `#275E86`
- Padding: same as Primary per size
- Border-radius: `4px`

**Dashed Button**
- Background: transparent
- Border: `1px dashed #275E86`
- Text: `#275E86`
- Border-radius: `4px`

**Text / Link Button**
- Background: transparent
- Border: none
- Text: `#3E7BFA` (Interactive/Link color)
- Hover: underline or slight background tint

### Inputs & Form Fields
- Background: `#FFFFFF` (or `#F7F7FA` on secondary surfaces)
- Border: `1px solid #E1E1E1`
- Border-radius: `8px`
- Padding: `12px 16px`
- Focus: `1px solid #275E86` border, `0px 0px 0px 2px rgba(39,94,134,0.2)` box-shadow
- Error: `1px solid #FF3B3B` border
- Placeholder: `#9C9DB4` (Text Inactive)

### Cards
- Background: `#FFFFFF`
- Border: none (elevation replaces explicit border on raised cards)
- Border-radius: `8px`
- Padding: `24px`
- Shadow (default): `0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)` — Elevation 01
- Shadow (raised): `0px 2px 4px rgba(40,41,61,0.04), 0px 8px 16px rgba(96,97,112,0.16)` — Elevation 04

### Navigation
- **Left Sidebar**: Width `266px`, background `#F3F4FA`, padding `20px` horizontal, `20px` top, `60px` bottom
- **Nav Items**: Width `226px`, border-radius `8px`, padding `12px 16px`, gap between icon and label `14px`
- **Active State**: Background `#E6EEF5`, text color `#275E86`, icon color `#275E86`
- **Inactive State**: Background `#F3F4FA`, text color `#9C9DB4`
- **Top Nav Bar**: Height `136px`, background `#FFFFFF`, page title Roboto Medium 24px `#2E3061`, tabs Inter Medium 16px
- **Active Tab**: `#494B7A` with `3px` underline in `#275E86`; inactive tabs `#7F7F9E`

### Distinctive Components
- **Badges/Tags**: Status chips use functional colors (Green/Red/Yellow/Blue) with light tinted backgrounds
- **Tooltips/Popovers**: Elevation 05 shadow, `8px` radius, `#FFFFFF` bg
- **Modals/Dialogs**: Elevation 06 shadow, `8px` radius, `50%` dim overlay `rgba(9,17,47,0.5)` with `1.5px` backdrop-blur
- **Breadcrumbs**: Roboto Regular 16px, separator `/`, active item `#275E86`

## 5. Layout Principles
### Spacing System
- Base unit: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 60, 64, 96`

### Grid
- Desktop: `1440px` total width — `266px` fixed left sidebar + `1174px` content area
- Content padding: `48px` left within content area
- Card content max-width follows content area (no explicit column grid; flex/block layout)

### Whitespace Philosophy
- Comfortable padding in nav tiles (`12px 16px`) keeps dense lists scannable
- Cards use `24px` internal padding — breathable but efficient
- Section headers maintain `40–120px` vertical space above content areas

## 6. Depth & Elevation
| Level        | Treatment                                                                                              | Use                               |
| ------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| Flat (0)     | No shadow                                                                                              | Page background, body text        |
| Raised (01)  | `0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)`                                | Cards, pressed buttons            |
| Button (02)  | `0px 0px 1px rgba(40,41,61,0.04), 0px 2px 4px rgba(96,97,112,0.16)`                                  | Buttons, notification badges      |
| NavBar (03)  | `0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)`                                  | Navigation menu bar               |
| Card (04)    | `0px 2px 4px rgba(40,41,61,0.04), 0px 8px 16px rgba(96,97,112,0.16)`                                  | Raised cards, button raised state |
| Popover (05) | `0px 2px 8px rgba(40,41,61,0.04), 0px 16px 24px rgba(96,97,112,0.16)`                                 | Pickers, popovers, dropdowns      |
| Modal (06)   | `0px 2px 8px rgba(40,41,61,0.08), 0px 20px 32px rgba(96,97,112,0.24)`                                 | Modals, dialogs                   |

## 7. Do's and Don'ts
### Do
- ✅ Use `#275E86` (APPRISE Blue) as the single brand-primary anchor — all interactive elements, active states, and primary buttons
- ✅ Pair blue with `#EDCD55` (APPRISE Yellow) for logo treatments and gradient decorative elements only — not for UI state
- ✅ Use `#3E7BFA` for links, interactive dividers, and focus rings — it is the "action" color distinct from the brand primary
- ✅ Keep nav item text in Roboto Medium/Regular; keep display and body in Inter
- ✅ Apply elevation shadows in the correct semantic level (cards=01, popovers=05, modals=06)

### Don't
- ❌ Never use pure black (`#000000`) for text — use `#28293D` (Text Primary) or `#2E3061` (Nav Dark)
- ❌ Do not use `#EDCD55` yellow as a primary action color — it is a brand accent, not a UI interactive color
- ❌ Don't use more than two font families on one screen (Inter + Roboto is the maximum)
- ❌ Don't apply the brand gradient (`#275E86 → #EDCD55`) to UI chrome — reserve it for decorative hero/header elements
- ❌ Don't mix border-radius values arbitrarily — buttons are always `4px`, cards/inputs/nav items are `8px`

## 8. Responsive Behavior
### Breakpoints
| Name    | Width      | Key Changes                                                         |
| ------- | ---------- | ------------------------------------------------------------------- |
| Mobile  | <640px     | Single column, stacked sections, sidebar collapsed to icon-only     |
| Tablet  | 640–1024px | Condensed sidebar (icon-only or overlay), reduced top nav           |
| Desktop | ≥1024px    | Full 1440px layout — 266px sidebar + 1174px content area           |

## 9. Agent Prompt Guide
### Quick Color Reference
- Brand Primary (buttons, active state): `"#275E86"`
- Brand Accent (logo, decorative): `"#EDCD55"`
- Interactive / Link: `"#3E7BFA"`
- Page Background: `"#F7F7FA"`
- Sidebar Surface: `"#F3F4FA"`
- Card / White: `"#FFFFFF"`
- Text Primary: `"#28293D"`
- Text Secondary: `"#555770"`
- Text Muted / Placeholder: `"#9C9DB4"`
- Nav Dark (page titles): `"#2E3061"`
- Success: `"#06C270"` | Warning: `"#FFCC00"` | Error: `"#FF3B3B"` | Info: `"#0063F7"`

### Example Component Prompts
- "Create a primary CTA button: `#275E86` background, white Roboto text 16px, `4px` radius, `8px 16px` padding, `0px 2px 0px rgba(0,0,0,0.04)` shadow."
- "Design a card with `#FFFFFF` background, `8px` radius, `24px` padding, Elevation 01 shadow."
- "Build a section with H2 Inter Bold 32px `#28293D`, body Roboto Regular 16px `#555770`, line-height 24px, max-width 1174px."
- "Create a left nav tile: `226px` wide, `8px` radius, `12px 16px` padding, active state bg `#E6EEF5` / text `#275E86`, inactive bg `#F3F4FA` / text `#9C9DB4`."

### Rules
1. Colors are non-negotiable — never invent hex values. Only use the color palette above.
2. `#275E86` is the primary CTA color; `#3E7BFA` is the link/interactive accent — do not swap them.
3. Font families are strictly Inter (display/body) and Roboto (nav/UI) — no other typefaces.
4. When in doubt, `--accent` is `#275E86`. The `#3E7BFA` blue is `--link`, not `--accent`.
