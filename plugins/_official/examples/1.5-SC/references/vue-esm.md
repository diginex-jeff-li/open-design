# Vue Global Build — Single-HTML Prototype Patterns

Vue 3 patterns for single-HTML prototypes using the **global build** from CDN.
No Vite, no `.vue` SFCs, no build step, no ESM import maps — just `<script src>`
tags and global `Vue` / `VueRouter` objects.

## Architecture

```
index.html
├── <head>
│   ├── <script src="...vue.global.prod.js">         ← Vue 3.5.13
│   ├── <script src="...vue-router.global.prod.js">  ← Vue Router 4.5.0
│   ├── <link> + <style>                             ← Fonts + all CSS
├── <body>
│   └── <div id="app"></div>         ← EMPTY. Vue replaces this entirely.
└── <script>
    ├── const { createApp, reactive, ref, computed, watch, nextTick } = Vue;
    ├── const { createRouter, createWebHashHistory } = VueRouter;
    ├── Component definitions        ← { template: `...`, setup() { ... } }
    ├── const router = createRouter({ history: createWebHashHistory(), routes })
    └── const app = createApp(RootComponent); app.use(router); app.mount('#app')
```

## P0 — Critical Rules (violating these breaks the page)

### 1. `#app` must be EMPTY in HTML

```html
<!-- ✅ CORRECT -->
<div id="app"></div>

<!-- ❌ WRONG — Vue replaces innerHTML, this content is destroyed -->
<div id="app"><nav>...</nav><router-view></router-view></div>
```

`createApp(RootComponent).mount('#app')` replaces the entire innerHTML of `#app`.
If the root component has no `template`, Vue renders `<!---->` (empty comment)
and the page appears blank with **no console error**. DevTools shows
`<div id="app" data-v-app=""><!----></div>` → root component is missing `template`.

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

// ❌ WRONG — no template, page renders <!---->
const app2 = createApp({ setup() { return {}; } });
app2.mount('#app'); // blank page, no error
```

### 3. Use `createWebHashHistory`, not `createWebHistory`

Prototypes run in sandboxed iframes, file:// URLs, or simple HTTP servers.
HTML5 history mode requires server-side routing that doesn't exist.

```javascript
const { createRouter, createWebHashHistory } = VueRouter;
const router = createRouter({ history: createWebHashHistory(), routes: [...] });
// ❌ WRONG: const { createWebHistory } = VueRouter;
```

### 4. Destructure from the global `Vue` and `VueRouter` objects

The global builds expose everything on `window.Vue` and `window.VueRouter`.
No `import` statements — there is no ESM module system:

```javascript
const { createApp, reactive, ref, computed, watch, nextTick, onMounted } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
// ❌ WRONG: import { createApp } from 'vue';
```

## P1 — Component Shape (global build style)

Components are plain JS objects with `template` (string) and `setup()`:

```javascript
const MyScreen = {
  template: `<div class="screen-my">
    <h1>{{ title }}</h1>
    <button class="btn btn-primary" @click="handleClick">Action</button>
  </div>`,
  props: { itemId: { type: String, default: null } },
  emits: ['select'],
  setup(props) {
    const title = ref('My Screen');
    function handleClick() { /* do something visible */ }
    return { title, handleClick };
  }
};
```

**Key differences from SFC:** No `<script setup>`, no `defineProps`/`defineEmits`,
no `<style scoped>`. Props in `props: {}`, emits in `emits: []`, all CSS in
the single `<head>` `<style>` block. See `references/vue-best-practices.md`
for detailed reactivity, composables, and component patterns.

## P2 — Common Pitfalls

### Blank page / `<!---->` in DOM

Root component has no `template` property. **Fix:**
```javascript
const App = { template: `<nav>...</nav><router-view />` };
const app = createApp(App);
```

### `import` statements instead of destructuring

The global build does NOT support ESM `import` syntax — syntax error or silent
failure. Use `const { ... } = Vue` / `const { ... } = VueRouter`.

### Template string gotchas

- HTML attributes with `v-bind`/`:` use single quotes inside the backtick
- Event handlers: `@click="methodRef"` (no `this.` needed in Composition API)
- Empty components must have `template: '<div></div>'` (not empty string):
```javascript
const Empty = { template: '' }; // Vue error: Component is missing template
const AlsoBad = { };            // Renders <!---->
```

### Global shared state (no Pinia needed)

Use a script-level `reactive()` object shared across components, exposed as
`readonly()` + explicit actions. No Pinia/Vuex — overkill for prototypes.

## Anti-patterns

- ❌ **HTML inside `<div id="app">`** — Vue replaces it. All UI goes in component templates.
- ❌ **Root component without `template`** — renders `<!---->`, blank page, no error.
- ❌ **`createWebHistory()`** — needs server routing. Use `createWebHashHistory()`.
- ❌ **`import` statements / ESM import maps** — use `const { ... } = Vue` / `const { ... } = VueRouter`.
- ❌ **TypeScript, `<script setup>`, `.vue` SFCs, `<style scoped>`** — need build tooling.
- ❌ **Pinia/Vuex, `defineProps`/`defineEmits`/`defineModel`** — not available. Use `reactive()`, `props: {}`, `emits: []`.
- ❌ **`this.` in Composition API `setup()`** — use refs/computed directly.
- ❌ **Destructuring `reactive()` objects** — loses reactivity. Use `toRefs()`.