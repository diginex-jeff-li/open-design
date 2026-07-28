# State coverage specification

A designer cannot translate ambiguity into Figma. Every screen, every component,
and every interaction must explicitly show ALL of its possible states.

## Required state coverage per interactive element

| State | Applies to | Must show |
|-------|-----------|-----------|
| **Loading** | Lists, tables, charts, data cards | Skeleton placeholder (pulsing grey blocks matching the layout shape) |
| **Empty** | Lists, tables, search results | "No items yet" message with an illustration or CTA to create first item |
| **Error** | Forms, data fetches, actions | Error message with retry button. Form fields show inline validation errors |
| **Success** | Form submissions, actions | Confirmation toast or success state. Clear what happened and what's next |
| **Disabled** | Buttons, inputs, actions | Greyed-out visual, cursor not-allowed, tooltip explaining why |
| **Hover** | All clickable elements | Visual change (background shift, underline, scale) |
| **Active/Pressed** | Buttons, tabs, nav links | Pressed state (darker background, scale(0.98)) |
| **Focused** | Inputs, buttons, links | Focus ring (brand blue, 2px) |

## How to implement state coverage

Use a state toggle bar at the top of each screen (only visible in the spec, not in production):

```html
<div class="state-toggles" v-if="showSpecControls">
  <span class="toggle-label">SPEC STATES:</span>
  <button @click="screenState = 'default'" :class="{ active: screenState === 'default' }">Default</button>
  <button @click="screenState = 'loading'" :class="{ active: screenState === 'loading' }">Loading</button>
  <button @click="screenState = 'empty'" :class="{ active: screenState === 'empty' }">Empty</button>
  <button @click="screenState = 'error'" :class="{ active: screenState === 'error' }">Error</button>
  <button @click="screenState = 'success'" :class="{ active: screenState === 'success' }">Success</button>
</div>
```

The designer clicks "Loading" → sees skeleton placeholders. Clicks "Error" → sees
error messages. This is the single most valuable thing in the spec — it eliminates
"what happens when..." questions.

## Interactivity requirements

| Element | Interaction |
|---------|-------------|
| Buttons | Show toast/alert on click, navigate to another route, or trigger state change |
| Forms | Real `v-model`, inline validation errors, submit handler with loading→success/error states |
| Tables | Sortable columns (click header to sort), search filter, row hover highlight |
| Tabs (within screen) | Toggle content sections via reactive state |
| Modals | Open/close with `v-if`, backdrop click to dismiss, escape key to close |
| Toggle switches | `v-model` on checkbox, immediate visual feedback |
| Charts (placeholder) | Styled card with labeled chart area — no real chart library needed |

Every interactive element must provide visual feedback for all applicable states.
No dead UI. No unhandled states.
