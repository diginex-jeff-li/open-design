# Vue ESM — Single-HTML Prototype Patterns

This skill covers Vue 3 patterns for prototypes that run from a single HTML file
using ESM imports from CDN (import maps). No Vite. No `.vue` SFC files. No build step.

## Architecture

```
index.html
├── <head>
│   ├── <script type="importmap">  ← Vue + Vue Router pinned versions
│   ├── <link>                     ← Google Fonts (Inter)
│   └── <style>                    ← All CSS (tokens + components + screen-specific)
├── <body>
│   └── <div id="app"></div>       ← EMPTY. Vue replaces this entirely.
└── <script type="module">
    ├── import { createApp, ... } from 'vue'
    ├── import { createRouter, createWebHashHistory } from 'vue-router'
    ├── Component definitions      ← { template: `...`, setup() { ... } }
    ├── const routes = [...]
    ├── const router = createRouter({ history: createWebHashHistory(), routes })
    └── const app = createApp(RootComponent)
         app.use(router)
         app.mount('#app')
```

## P0 — Critical Rules (violating these breaks the page)

### 1. `#app` must be EMPTY in HTML

```html
<!-- ✅ CORRECT -->
<div id="app"></div>

<!-- ❌ WRONG — Vue replaces innerHTML, this content is destroyed -->
<div id="app">
  <nav>...</nav>
  <router-view></router-view>
</div>
```

When `createApp(RootComponent).mount('#app')` runs, Vue replaces the entire
innerHTML of `#app` with the root component's render output. If the root
component has no `template`, Vue renders `<!---->` (an empty comment node)
and the page appears blank with **no console error**.

**If you see `<div id="app" data-v-app=""><!----></div>` in DevTools →**
the root component is missing its `template` property.

### 2. Root component MUST have a `template` property

```javascript
// ✅ CORRECT — root component has a template
const App = {
  template: `
    <nav class="app-nav-top">
      <div class="nav-brand">AppName</div>
      <div class="nav-links">
        <router-link to="/overview">Overview</router-link>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  `
};

const app = createApp(App);
app.use(router);
app.mount('#app');
```

```javascript
// ❌ WRONG — no template, page renders <!---->
const app = createApp({
  setup() { return {}; }
});
app.mount('#app'); // blank page, no error
```

### 3. Use `createWebHashHistory`, not `createWebHistory`

Single-HTML prototypes are served from file:// or simple HTTP servers.
HTML5 history mode requires server-side routing support that doesn't exist.

```javascript
// ✅ CORRECT
import { createRouter, createWebHashHistory } from 'vue-router';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...]
});

// ❌ WRONG — requires server-side routing
import { createRouter, createWebHistory } from 'vue-router';
```

### 4. Import from bare specifiers matching the import map

The import map in skeleton.html maps bare specifiers to CDN URLs:

```javascript
// ✅ CORRECT — matches the import map
import { createApp, reactive, ref } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

// ❌ WRONG — full URL imports bypass the import map
import { createApp } from 'https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.prod.js';
```

## P1 — Composition API Patterns (single-HTML style)

### Reactivity

```javascript
import { reactive, ref, computed, watch, nextTick, onMounted } from 'vue';

// reactive() for objects/arrays — the data model
const sections = reactive([
  { id: 'about', title: 'About This Report', status: 'ready' },
  { id: 'governance', title: 'Sustainability Governance', status: 'ready' }
]);

// ref() for primitives — booleans, strings, numbers
const screenState = ref('default');
const editModalOpen = ref(false);

// computed() for derived values
const readyCount = computed(() => sections.filter(s => s.status === 'ready').length);

// watch() for side effects
watch(screenState, (newState) => {
  console.log('State changed to:', newState);
});
```

### Component definition

Every component is a plain JS object with `template` (string) and `setup()`:

```javascript
const MyScreen = {
  template: `
    <div class="screen-my">
      <header class="screen-header">
        <h1>{{ title }}</h1>
      </header>
      <div class="card">
        <p>{{ description }}</p>
        <button class="btn btn-primary" @click="handleClick">Action</button>
      </div>
    </div>
  `,
  setup() {
    const title = ref('My Screen');
    const description = ref('Hello world');

    function handleClick() {
      // do something visible
    }

    return { title, description, handleClick };
  }
};
```

**Key differences from SFC style:**
- No `<script setup>`, no `defineProps`, no `defineEmits`
- Props are declared in `props: { ... }` and accessed via `this.propName` (Options API) or `props.propName` (Composition API setup receives `props`)
- Emits are declared in `emits: [...]`
- No `<style scoped>` — all styles go in the single `<style>` block in `<head>`

### Props and events

```javascript
const ChildComponent = {
  props: {
    items: { type: Array, required: true },
    selectedId: { type: String, default: null }
  },
  emits: ['select', 'delete'],
  template: `
    <div>
      <div v-for="item in items" :key="item.id"
           :class="{ selected: item.id === selectedId }"
           @click="$emit('select', item.id)">
        {{ item.name }}
        <button @click.stop="$emit('delete', item.id)">×</button>
      </div>
    </div>
  `,
  setup(props) {
    // props.items, props.selectedId are reactive
    return {};
  }
};
```

Parent usage:

```html
<child-component :items="myItems" :selected-id="selectedId"
  @select="handleSelect" @delete="handleDelete" />
```

### Two-way binding

```javascript
// Custom v-model on component
const SearchInput = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
};

// Parent usage
// <search-input v-model="searchQuery" />
```

For simple form inputs, `v-model` works directly:

```html
<input v-model="formData.name" class="form-input" />
<textarea v-model="formData.description" class="form-input" rows="4"></textarea>
<select v-model="formData.category" class="form-input">...</select>
```

### Conditional rendering and lists

```html
<!-- Conditional -->
<div v-if="screenState === 'loading'" class="skeleton-block" style="height: 200px"></div>
<div v-else-if="screenState === 'error'" class="card">
  <p>Something went wrong.</p>
  <button class="btn btn-default" @click="retry">Retry</button>
</div>
<div v-else class="card"><!-- normal content --></div>

<!-- List rendering -->
<div v-for="item in items" :key="item.id" class="card">
  <span>{{ item.name }}</span>
</div>

<!-- Show/hide (keeps in DOM) -->
<div v-show="editModalOpen" class="modal-backdrop">...</div>
```

## P2 — Common Pitfalls

### Blank page / `<!---->` in DOM

**Cause:** Root component has no `template` property. Vue 3 replaces `#app`
innerHTML with the component's render output. An empty component renders nothing.

**Fix:** Ensure `createApp()` receives a component with a `template`:
```javascript
const App = { template: `<nav>...</nav><router-view />` };
const app = createApp(App);
```

### Reactive array mutations

```javascript
// ✅ CORRECT — reactive() arrays support push/splice/filter
const items = reactive([]);
items.push(newItem);       // works
items.splice(idx, 1);       // works
items.sort((a, b) => ...);  // works

// ✅ ref() with .value
const items = ref([]);
items.value.push(newItem); // works
items.value = newArray;     // works — replaces entire ref

// ❌ WRONG — loses reactivity
const [first, ...rest] = items; // destructuring reactive array items
```

### Template string gotchas

Backtick template strings in component `template:` properties:
- HTML attributes with `v-bind` or `:` use single quotes inside the backtick
- Event handlers use `@click="methodRef"` (no `this.` needed in Composition API)
- Empty components must still have `template: '<div></div>'` (not empty string)

```javascript
// ✅ CORRECT
const MyComponent = {
  template: `
    <div class="card">
      <span :class="{ active: isSelected }">{{ label }}</span>
      <button @click="handleClick">{{ btnText }}</button>
    </div>
  `,
  setup() { ... }
};

// ❌ WRONG — empty template
const Empty = { template: '' }; // Vue error: Component is missing template
const AlsoBad = { };            // Renders <!---->
```

### Multiple `<script type="module">` blocks

Each `<script type="module">` has its own scope. Variables defined in one block
are NOT accessible in another. For a single-HTML prototype, put ALL JavaScript
in ONE `<script type="module">` block.

```html
<!-- ❌ WRONG — two separate module blocks can't share scope -->
<script type="module">
  const routes = [{ path: '/', component: HomeScreen }];
</script>
<script type="module">
  // routes is NOT defined here
  const router = createRouter({ history: createWebHashHistory(), routes });
</script>

<!-- ✅ CORRECT — everything in one module block -->
<script type="module">
  // ... all imports, components, routes, app creation ...
</script>
```

### `v-html` for rich text display

When displaying HTML content (e.g., AI-generated narrative text):

```javascript
const narrative = ref('<p>This is <strong>bold</strong> text.</p>');
```

```html
<!-- ✅ CORRECT — renders HTML -->
<div v-html="narrative"></div>

<!-- ❌ WRONG — renders the HTML tags as visible text -->
<div>{{ narrative }}</div>
```

**Security note:** Only use `v-html` with trusted content. Never use it for
user-submitted data without sanitization.

### Transition animations

```html
<!-- ✅ Wrap router-view -->
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>

<!-- ✅ Wrap conditional elements -->
<transition name="slide">
  <div v-if="modalOpen" class="modal-backdrop">...</div>
</transition>
```

```css
/* Fade (already in skeleton) */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Slide / scale for modals */
.slide-enter-active { transition: all 200ms ease-out; }
.slide-leave-active { transition: all 150ms ease-in; }
.slide-enter-from { opacity: 0; transform: translateY(16px); }
.slide-leave-to { opacity: 0; transform: translateY(-8px); }
```

### Escape key handlers

```javascript
import { onMounted, onUnmounted } from 'vue';

function useEscapeKey(callback) {
  function handler(e) { if (e.key === 'Escape') callback(); }
  onMounted(() => document.addEventListener('keydown', handler));
  onUnmounted(() => document.removeEventListener('keydown', handler));
}

// Usage in a component:
setup() {
  const modalOpen = ref(false);
  useEscapeKey(() => { modalOpen.value = false; });
  return { modalOpen };
}
```

### Global shared state (no Pinia needed)

For prototypes, use a module-level `reactive()` object shared across components:

```javascript
// Module-level shared state (accessible by all components)
const sharedState = reactive({
  screenState: 'default',
  selectedSection: null,
  editModalOpen: false,
  toast: { visible: false, message: '', type: 'info' }
});

// Component A reads
const ScreenA = {
  template: `<div>{{ sharedState.selectedSection }}</div>`,
  setup() { return { sharedState }; }
};

// Component B writes
const ScreenB = {
  template: `<button @click="sharedState.selectedSection = 'abc'">Select</button>`,
  setup() { return { sharedState }; }
};
```

## Anti-patterns

- ❌ **Putting HTML inside `<div id="app">`** — Vue replaces it. All UI goes in component templates.
- ❌ **Root component without `template`** — renders `<!---->`, blank page, no error.
- ❌ **`createWebHistory()`** — needs server-side routing. Use `createWebHashHistory()`.
- ❌ **Full URL imports** (`import ... from 'https://...'`) — use bare specifiers from the import map.
- ❌ **Two `<script type="module">` blocks** — separate scopes can't share variables.
- ❌ **TypeScript or `<script setup>`** — not available without Vite/compiler.
- ❌ **`.vue` SFC files** — not available without build tooling.
- ❌ **Pinia/Vuex** — overkill for single-HTML prototypes. Use module-level `reactive()`.
- ❌ **`defineProps` / `defineEmits` / `defineModel`** — SFC macros, not available in ESM.
- ❌ **`this.` in Composition API `setup()`** — use refs/computed directly, not `this.count`.
- ❌ **Destructuring `reactive()` objects** — `const { name } = reactive(...)` loses reactivity. Use `toRefs()` or access the whole object.