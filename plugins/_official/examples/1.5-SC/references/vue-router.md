# Vue Router 4 — Hash-History Patterns for CDN ESM Prototypes

Condensed from vue-router-best-practices skill. Adapted for single-HTML CDN ESM
prototypes using `createWebHashHistory` (the skeleton's default).

## Setup

```javascript
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/overview' },
  { path: '/overview', component: OverviewScreen },
  { path: '/suppliers', component: SuppliersScreen },
  { path: '/:pathMatch(.*)*', component: NotFoundScreen }
];

const router = createRouter({
  history: createWebHashHistory(),  // ✅ hash history for file:// / static serving
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
```

**Why hash history?** Single-HTML prototypes are served from `file://` or simple
HTTP servers. HTML5 history mode (`createWebHistory`) requires server-side
routing support that doesn't exist. Hash history works everywhere.

## Navigation Guards

### Deprecated `next()` — use return-based syntax

The `next()` callback is deprecated in Vue Router 4. Use return values instead:

```javascript
// ✅ CORRECT — return-based (modern Vue Router 4+)
router.beforeEach((to, from) => {
  if (!isAuthenticated) {
    return '/login';  // redirect
  }
  // return nothing (undefined) to proceed
});

// ✅ Return false to cancel navigation
router.beforeEach((to, from) => {
  if (hasUnsavedChanges) return false;
});

// ✅ Async with return-based syntax
router.beforeEach(async (to, from) => {
  const user = await fetchUser();
  if (!user) return { name: 'Login', query: { redirect: to.fullPath } };
});
```

```javascript
// ❌ WRONG — deprecated next() pattern
router.beforeEach((to, from, next) => {
  if (!isAuthenticated) {
    next('/login');     // easy to forget
  }
  next();               // bug: called even after redirect
});
```

**Return values:**
| Return | Effect |
|--------|--------|
| `undefined` / `true` | Proceed with navigation |
| `false` | Cancel, stay on current route |
| `'/path'` | Redirect to path |
| `{ name: 'Route' }` | Redirect with full control |
| `Error` | Cancel and trigger `router.onError()` |

### Async guards require proper Promise handling

```javascript
// ✅ CORRECT — async/await with explicit returns
router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    try {
      const isValid = await checkAuth();
      if (!isValid) return { name: 'Login' };
    } catch (error) {
      console.error('Auth check failed:', error);
      return '/error';
    }
  }
  return true;  // explicit proceed
});
```

```javascript
// ❌ WRONG — not awaiting, navigation proceeds immediately
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    checkAuth();  // returns Promise but we don't wait!
  }
});
```

### beforeRouteEnter cannot access component instance

`beforeRouteEnter` runs BEFORE the component is created — `this` is undefined.
This is the ONLY guard that supports a `next(vm => ...)` callback.

```javascript
// Options API — use next() callback (only valid use of next())
const OrderDetail = {
  data() { return { user: null }; },
  async beforeRouteEnter(to, from, next) {
    const user = await fetchUser(to.params.id);
    next(vm => { vm.user = user; });
  }
};
```

In Composition API with CDN ESM, use `onMounted` + `watch` instead:

```javascript
const OrderDetail = {
  template: `...`,
  setup() {
    const route = useRoute();
    const user = ref(null);

    // Initial load
    onMounted(async () => {
      user.value = await fetchUser(route.params.id);
    });

    // Handle subsequent param changes
    onBeforeRouteUpdate(async (to, from) => {
      if (to.params.id !== from.params.id) {
        user.value = await fetchUser(to.params.id);
      }
    });

    return { user };
  }
};
```

| Guard | Has `this`/component? | Can delay? | Use case |
|-------|---------------------|------------|----------|
| beforeRouteEnter | NO (use next callback) | YES | Pre-fetch, redirect |
| beforeRouteUpdate | YES | YES | React to param changes |
| beforeRouteLeave | YES | YES | Unsaved changes warning |
| Global beforeEach | NO | YES | Auth checks |
| Route beforeEnter | NO | YES | Route-specific validation |

## Route Param Changes Do NOT Trigger Lifecycle Hooks

When navigating between routes with the same component (e.g. `/users/1` → `/users/2`),
Vue Router **reuses** the component instance. `onMounted`, `onCreated`, etc. do NOT fire.

```javascript
// ❌ WRONG — only runs once on first mount
setup() {
  const route = useRoute();
  const user = ref(null);
  onMounted(async () => {
    user.value = await fetchUser(route.params.id);
  });
  return { user };
}
```

### Solution 1: Watch route params (recommended)

```javascript
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

setup() {
  const route = useRoute();
  const user = ref(null);
  const loading = ref(false);

  watch(
    () => route.params.id,
    async (newId) => {
      loading.value = true;
      user.value = await fetchUser(newId);
      loading.value = false;
    },
    { immediate: true }  // covers both initial load AND navigation
  );

  return { user, loading };
}
```

### Solution 2: onBeforeRouteUpdate guard

```javascript
import { onBeforeRouteUpdate } from 'vue-router';

setup() {
  const route = useRoute();
  const user = ref(null);

  onMounted(() => loadUser(route.params.id));

  onBeforeRouteUpdate(async (to, from) => {
    if (to.params.id !== from.params.id) {
      await loadUser(to.params.id);
    }
  });

  async function loadUser(id) { user.value = await fetchUser(id); }
  return { user };
}
```

### Solution 3: Force re-creation with key (sledgehammer)

```html
<router-view :key="$route.fullPath" />
```
Use only when component state should reset completely. Less performant.

## Per-Route beforeEnter Guards Ignore Param/Query Changes

`beforeEnter` only fires when entering a route from a DIFFERENT route.
Param/query/hash changes within the same route do NOT trigger it.

| Navigation | beforeEnter fires? |
|------------|-------------------|
| `/products` → `/orders/1` | YES |
| `/orders/1` → `/orders/2` | NO |
| `/orders/1` → `/orders/1?tab=details` | NO |

**Solution:** Use `onBeforeRouteUpdate` in the component for param changes,
or use global `beforeEach` which always runs.

## Infinite Redirect Loop Avoidance

Always exclude the target route from redirect conditions.

```javascript
// ❌ WRONG — infinite loop: always redirects to login
router.beforeEach((to, from) => {
  if (!isAuthenticated()) {
    return '/login';  // /login triggers guard again → loop!
  }
});

// ✅ CORRECT — exclude target route
router.beforeEach((to, from) => {
  if (!isAuthenticated() && to.path !== '/login') {
    return '/login';
  }
});

// ✅ BETTER — use route meta fields
const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }
});
```

**Common loop patterns and fixes:**
| Pattern | Problem | Fix |
|---------|---------|-----|
| Auth check without exclusion | Login → login → ... | Exclude `/login` from check |
| Circular role redirects | Admin → User → Admin | Single source of truth for roles |
| Redirect query handling | Reading redirect creates new redirect | Process redirect only once |

## Event Listener Cleanup

When adding event listeners (e.g., for manual hash routing outside Vue Router),
always clean up in `onUnmounted`:

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

function useHashListener() {
  const currentHash = ref(window.location.hash);

  function handler() {
    currentHash.value = window.location.hash;
  }

  onMounted(() => window.addEventListener('hashchange', handler));
  onUnmounted(() => window.removeEventListener('hashchange', handler));

  return { currentHash };
}
```

When using Vue Router (the recommended approach), the router manages cleanup
internally. But any custom listeners you add must be removed manually.

## Use Vue Router for Production SPAs

For any app beyond a tiny prototype, use the Vue Router library — not manual
hash routing. Vue Router provides:
- Navigation guards (beforeEach, beforeEnter, in-component)
- Nested routes and route params
- Lazy loading (though in CDN ESM, components are already defined inline)
- Active link styling (`router-link-active` class)
- Programmatic navigation (`router.push()`, `router.replace()`)
- Route meta fields
- Integrated transitions with `<Transition>`

**For single-HTML CDN ESM prototypes:** Vue Router with `createWebHashHistory`
is the correct choice. The skeleton already imports and configures it.