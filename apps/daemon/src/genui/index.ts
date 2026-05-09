// Barrel for the GenUI module — see ./registry.ts for the high-level
// orchestration entry points and ./store.ts for the SQLite writer. Tests
// import from the barrel; production code may import directly when only
// the store or events helpers are needed.

export * from './events.js';
export * from './registry.js';
export * from './store.js';
