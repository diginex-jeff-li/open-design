# Vue 3 Best Practices — Global Build Adapted

Condensed from vue-best-practices skill. Adapted for single-HTML prototypes using
Vue 3 global builds: no Vite, no `.vue` SFC files, no build step. Components are
JS objects with `template:` string literals. Uses Composition API `setup()`.

## Core Principles

- **Keep state predictable:** one source of truth, derive everything else with `computed`.
- **Make data flow explicit:** Props down, Events up for most cases.
- **Favor small, focused components:** easier to test, reuse, and maintain.
- **Avoid unnecessary re-renders:** use `computed` properties and watchers wisely.
- **Readability counts:** write clear, self-documenting code.

## Component Boundaries

Create a brief component map before implementation for non-trivial features:
- Define each component's single responsibility in one sentence.
- Keep root/route-level view components as composition surfaces.
- Move feature UI and feature logic out of root/view components.
- Define props/emits contracts for each child component.
- Split when a component has 3+ distinct UI sections or repeated template blocks.
- For CRUD/list features: split into container, form, list/item, and footer/actions.

## Reactivity Rules

### Choose the right primitive

```javascript
const { ref, shallowRef, reactive, computed, watch } = Vue;

// ref() for primitives (or use shallowRef for better perf)
const count = ref(0);
const screenState = ref('default');

// reactive() for objects/arrays you mutate in place
const state = reactive({ count: 0, user: { name: 'Alice' } });
state.count++;            // ✅ reactive
state.user.name = 'Bob';  // ✅ reactive

// shallowRef() for opaque/large data replaced by whole reference
const bigData = shallowRef({});
bigData.value = { ...newData }; // ✅ triggers update

// computed() for derived values — ALWAYS prefer over watcher-assigned refs
const items = ref([{ price: 10 }, { price: 20 }]);
const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));
```

### Never do these with reactive()

```javascript
// ❌ Destructuring reactive() loses reactivity
const { count } = reactive({ count: 0 });

// ❌ Watching a non-getter value
const state = reactive({ count: 0 });
watch(state.count, () => {}); // wrong — use getter

// ✅ Correct: toRefs() or getter
const { count } = toRefs(state);
watch(count, () => {});
watch(() => state.count, () => {});
```

### Computed best practices

- Prefer `computed` over watcher-assigned derived refs.
- Keep filtered/sorted derivations in `computed`, not inline in templates.
- Keep computed getters **pure** — no side effects, no mutations, no API calls.
- Put side effects in `watch()`.

```javascript
// ✅ Computed for filtering/sorting
const visibleItems = computed(() =>
  items.value.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name))
);
```

### Watcher best practices

- Use `{ immediate: true }` instead of duplicate initial calls in `onMounted`.
- Clean up async effects with `onCleanup` to cancel stale requests.

```javascript
watch(query, async (q, _prev, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort());
  const res = await fetch(`/api/search?q=${q}`, { signal: controller.signal });
  results.value = await res.json();
});
```

## Component Data Flow

### Props: one-way data down

Props are read-only inputs. Never mutate props in the child.

```javascript
const Child = {
  props: { count: { type: Number, required: true } },
  setup(props) {
    // props.count is reactive but READ-ONLY
    // To change: emit an event or use v-model
  }
};
```

### Events: explicit events up

Component events do NOT bubble. Re-emit explicitly if a parent needs to know.

```javascript
const Child = {
  emits: ['select'],
  template: `<button @click="$emit('select', itemId)">Select</button>`,
  setup() { return { itemId: ref(1) }; }
};

// Parent
// <child-component @select="handleSelect" />
```

### v-model: two-way bindings

In global builds (no `defineModel` macro), use `modelValue` + `update:modelValue`:

```javascript
const SearchInput = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
};

// Parent: <search-input v-model="searchQuery" />
```

### Provide/Inject: shared context without prop drilling

Use for cross-tree state (over ~3 layers). Keep mutations centralized.

```javascript
const { provide, inject, reactive, readonly } = Vue;

// Provider
const theme = reactive({ dark: false });
const toggleTheme = () => { theme.dark = !theme.dark };
provide('theme', readonly(theme));
provide('themeActions', { toggleTheme });

// Consumer
const theme = inject('theme');
const { toggleTheme } = inject('themeActions');
```

## Slots

### Named slots with shorthand `#`

```javascript
const Card = {
  template: `
    <article class="card">
      <header v-if="$slots.header" class="card-header">
        <slot name="header" />
      </header>
      <section v-if="$slots.default" class="card-body">
        <slot />
      </section>
      <footer v-if="$slots.footer" class="card-footer">
        <slot name="footer" />
      </footer>
    </article>
  `
};

// Parent usage:
// <my-card>
//   <template #header>Title</template>
//   Body content
//   <template #footer>Footer</template>
// </my-card>
```

### Fallback content

```javascript
const SubmitButton = {
  template: `<button type="submit" class="btn-primary"><slot>Submit</slot></button>`
};
```

## Fallthrough Attributes

Access hyphenated attrs with bracket notation; listeners use camelCase `onX`.

```javascript
const { useAttrs } = Vue;

const attrs = useAttrs();
// attrs['data-testid']     ← hyphenated → bracket notation
// attrs['aria-label']      ← same
// attrs.onClick            ← @click listener → camelCase onX
// attrs.onCustomEvent      ← @custom-event → onCustomEvent

// ⚠️ useAttrs() is NOT reactive — don't watch() it
// Use onUpdated() for attr-driven side effects, or promote attr to prop
```

## Composables

### Extract reusable logic into functions

```javascript
const { ref, onMounted, onUnmounted } = Vue;

// Small, focused composable
function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}

// Compose from smaller primitives
function useMouse() {
  const x = ref(0);
  const y = ref(0);
  useEventListener(window, 'mousemove', (e) => {
    x.value = e.pageX;
    y.value = e.pageY;
  });
  return { x, y };
}
```

### Options object pattern for parameters

```javascript
function useFetch(url, options = {}) {
  const { method = 'GET', timeout = 30000, immediate = true } = options;
  // ...
}
```

### Return readonly state with explicit actions

```javascript
const { ref, computed, readonly } = Vue;

function useCart() {
  const _items = ref([]);
  const total = computed(() => _items.value.reduce((s, i) => s + i.price, 0));
  function addItem(product) { _items.value.push(product); }
  return { items: readonly(_items), total, addItem };
}
```

### Keep pure utilities as plain functions

Don't wrap pure functions in composable form. Use them directly.

## SFC Patterns Adapted for Global Builds

In global build prototypes, there are no `.vue` files. Instead of SFCs, define
components as JS objects with `template:` string literals.

### Structure: template string → setup function

```javascript
const UserCard = {
  // Template as backtick string (NOT a .vue file)
  template: `
    <div class="user-card">
      <h3 class="name">{{ displayName }}</h3>
    </div>
  `,
  // Composition API setup (NOT <script setup>)
  setup(props) {
    const displayName = computed(() => `${props.user.firstName} ${props.user.lastName}`);
    return { displayName };
  },
  // Props declared here (NOT defineProps)
  props: {
    user: { type: Object, required: true }
  }
};
```

### Template safety rules (same as SFC, adapted)

- Always provide stable `:key` in `v-for` — prefer primitive keys.
- Never put `v-if` and `v-for` on the same element — use `computed` to filter.
- Never use `v-html` with untrusted content.
- Choose `v-if` vs `v-show`: `v-if` for rare conditions, `v-show` for frequent toggles.

### Styling in global builds

No `<style scoped>` — all CSS goes in the single `<style>` block in `<head>`.
Use class selectors, not element selectors. Reference `var(--token)` for values.

## State Management

### Lightest store approach for prototypes

For single-HTML global build prototypes, use a **module-level `reactive()` object**
shared across components. No Pinia/Vuex needed.

```javascript
const { reactive, readonly } = Vue;

const _store = reactive({
  screenState: 'default',
  selectedSection: null,
  toast: { visible: false, message: '', type: 'info' }
});

// Expose readonly state + explicit actions
export function useStore() {
  function setScreenState(state) { _store.screenState = state; }
  function showToast(message, type = 'info') {
    _store.toast = { visible: true, message, type };
  }
  return { state: readonly(_store), setScreenState, showToast };
}
```

### Key rules

- Keep state local first, promote to shared only when needed.
- Expose shared state as readonly; mutate through explicit actions.
- Never export mutable module-level reactive state directly.

## Performance — Key Rules

### Virtualize large lists

If a list could exceed 50-100 items, consider virtualization. In global builds
prototypes without build tools, keep lists small or paginate. For prototypes,
50 items rendered as DOM nodes is fine.

### Use v-once for static content

```html
<!-- Content rendered once, never re-evaluated -->
<footer v-once>
  <p>Copyright {{ year }}</p>
</footer>
```

### Use v-memo for conditionally-static list items

```html
<!-- Only re-render items when their selection state changes -->
<div
  v-for="item in list"
  :key="item.id"
  v-memo="[item.id === selectedId]"
>
  <div :class="{ selected: item.id === selectedId }">
    {{ item.name }}
  </div>
</div>
```

### Avoid excessive component abstraction in lists

Component instances are more expensive than plain DOM nodes. In list items,
prefer native elements over wrapper components. Flatten component hierarchies
in hot paths.

### Avoid expensive operations in updated hook

- Never do API calls in `onUpdated` — it fires on every re-render.
- Never mutate reactive state in `onUpdated` — causes infinite loops.
- Prefer `watch`/`watchEffect` for reacting to specific data changes.
- Reserve `onUpdated` for low-level DOM synchronization only.

## Animation — Transition Basics

### `<Transition>` wraps a single element

```html
<!-- Single root element or component -->
<transition name="fade" mode="out-in">
  <component :is="Component" :key="Component" />
</transition>

<!-- For conditional elements -->
<transition name="slide">
  <div v-if="modalOpen" class="modal">...</div>
</transition>
```

### Use `mode="out-in"` for sequential swaps

Prevents both old and new elements from being visible simultaneously.

### Add `key` when switching same element types

```html
<transition name="fade" mode="out-in">
  <p v-if="isActive" key="active">Active</p>
  <p v-else key="inactive">Inactive</p>
</transition>
```

### Animate `transform` and `opacity` for performance

```css
/* ✅ Good — GPU-friendly */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from { transform: translateX(-12px); opacity: 0; }
.slide-leave-to { transform: translateX(12px); opacity: 0; }

/* ❌ Bad — triggers layout */
.slide-enter-active { transition: height 0.3s ease; }
```

## Anti-Patterns (global build specific)

- ❌ **`defineProps` / `defineEmits` / `defineModel`** — SFC macros, not available in ESM. Use `props: {}`, `emits: []`.
- ❌ **`<script setup>`** — not available without compiler. Use `setup() { ... }`.
- ❌ **`<style scoped>`** — not available. All CSS goes in the `<head>` `<style>` block.
- ❌ **TypeScript** — not available without build tooling. Use plain JavaScript.
- ❌ **Destructuring `reactive()`** — loses reactivity. Use `toRefs()` or access the whole object.
- ❌ **Mutating props directly** — emit events instead.
- ❌ **Side effects in `computed`** — keep getters pure, use `watch` for side effects.
- ❌ **`v-if` + `v-for` on same element** — use `computed` to filter first.
- ❌ **Missing `:key` in `v-for`** — always provide stable primitive keys.