// Plan §3.A7 / §3.A8 — pipeline-runner integration test.
//
// Exercises the wiring that joins the pure pipeline scheduler
// (`pipeline.ts`) onto the run service via:
//   - emitted `pipeline_stage_started` / `pipeline_stage_completed`
//     events on each stage entry / exit
//   - `run_devloop_iterations` rows persisted per iteration (audit log)
//   - GenUI surface raising via `requestOrReuseSurface`, including the
//     F8 cross-conversation cache (e2e-5 anchor): a second conversation
//     in the same project that re-applies the same `persist='project'`
//     surface emits a `genui_surface_response { respondedBy: 'cache' }`
//     event without broadcasting a new request.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import type {
  AppliedPluginSnapshot,
  GenUISurfaceEvent,
  GenUISurfaceSpec,
  PluginPipelineStageEvent,
} from '@open-design/contracts';
import { migratePlugins } from '../src/plugins/persistence.js';
import { createSnapshot } from '../src/plugins/snapshots.js';
import { runPipelineForRun } from '../src/plugins/pipeline-runner.js';
import { listIterationsForRun } from '../src/plugins/pipeline.js';
import { respondSurface } from '../src/genui/registry.js';
import { findPendingByRunAndSurfaceId } from '../src/genui/store.js';

let db: Database.Database;
let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(path.join(os.tmpdir(), 'od-runner-'));
  db = new Database(path.join(tmpDir, 'test.sqlite'));
  db.exec(`
    CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT);
    CREATE TABLE conversations (id TEXT PRIMARY KEY, project_id TEXT, title TEXT);
  `);
  migratePlugins(db);
  db.prepare('INSERT INTO projects (id, name) VALUES (?, ?)').run('project-1', 'Project 1');
  db.prepare('INSERT INTO conversations (id, project_id, title) VALUES (?, ?, ?)')
    .run('conv-A', 'project-1', 'A');
  db.prepare('INSERT INTO conversations (id, project_id, title) VALUES (?, ?, ?)')
    .run('conv-B', 'project-1', 'B');
});

afterEach(async () => {
  db.close();
  await rm(tmpDir, { recursive: true, force: true });
});

function snapshotWith(extra: Partial<AppliedPluginSnapshot>): AppliedPluginSnapshot {
  return createSnapshot(db, {
    projectId: 'project-1',
    conversationId: 'conv-A',
    runId: null,
    pluginId: 'sample-plugin',
    pluginVersion: '1.0.0',
    pluginTitle: 'Sample',
    pluginDescription: '',
    manifestSourceDigest: 'digest-1',
    taskKind: 'new-generation' as const,
    inputs: {},
    resolvedContext: { items: [] },
    pipeline: extra.pipeline,
    genuiSurfaces: extra.genuiSurfaces,
    capabilitiesGranted: ['prompt:inject'],
    capabilitiesRequired: ['prompt:inject'],
    assetsStaged: [],
    connectorsRequired: [],
    connectorsResolved: [],
    mcpServers: [],
    query: '',
  });
}

describe('pipeline-runner: stage events + devloop persistence', () => {
  it('emits started + completed events for every stage and persists iterations', async () => {
    const snap = snapshotWith({
      pipeline: {
        stages: [
          { id: 'discovery', atoms: ['discovery-question-form'] },
          { id: 'plan', atoms: ['todo-write'] },
        ],
      },
    });

    const pipelineEvents: PluginPipelineStageEvent[] = [];
    const outcomes = await runPipelineForRun({
      db,
      runId: 'run-1',
      projectId: 'project-1',
      conversationId: 'conv-A',
      snapshot: snap,
      pipeline: snap.pipeline!,
      env: { maxIterations: 3 },
      runStage: () => ({ signals: {} }),
      emitPipeline: (e) => pipelineEvents.push(e),
    });
    expect(outcomes).toHaveLength(2);
    expect(pipelineEvents.map((e) => `${e.kind}:${e.stageId}`)).toEqual([
      'pipeline_stage_started:discovery',
      'pipeline_stage_completed:discovery',
      'pipeline_stage_started:plan',
      'pipeline_stage_completed:plan',
    ]);
    const iterations = listIterationsForRun(db, 'run-1');
    expect(iterations.map((i) => i.stageId)).toEqual(['discovery', 'plan']);
  });

  it('runs the devloop until a critique signal converges or hits the iteration cap', async () => {
    const snap = snapshotWith({
      pipeline: {
        stages: [
          {
            id: 'critique',
            atoms: ['critique-theater'],
            repeat: true,
            until: 'critique.score >= 4 || iterations >= 3',
          },
        ],
      },
    });

    let iter = 0;
    const outcomes = await runPipelineForRun({
      db,
      runId: 'run-2',
      projectId: 'project-1',
      conversationId: 'conv-A',
      snapshot: snap,
      pipeline: snap.pipeline!,
      env: { maxIterations: 5 },
      runStage: () => {
        iter += 1;
        // Make the third iteration converge by returning a critique
        // score >= 4. The first two iterations come back with a
        // score that fails the until predicate.
        return {
          signals: { 'critique.score': iter >= 3 ? 4 : 1 },
        };
      },
    });
    expect(outcomes[0]?.iterations).toBe(3);
    expect(outcomes[0]?.converged).toBe(true);
    expect(outcomes[0]?.termination).toBe('until-satisfied');
    expect(listIterationsForRun(db, 'run-2')).toHaveLength(3);
  });
});

describe('pipeline-runner: GenUI cross-conversation cache (e2e-5)', () => {
  it('reuses a project-tier surface answer across conversations without re-broadcasting', async () => {
    const surface: GenUISurfaceSpec = {
      id: '__auto_connector_slack',
      kind: 'oauth-prompt',
      persist: 'project',
      capabilitiesRequired: ['connector:slack'],
      oauth: { route: 'connector', connectorId: 'slack' },
    };
    const snap = snapshotWith({
      genuiSurfaces: [surface],
      pipeline: { stages: [{ id: 'connect', atoms: ['todo-write'] }] },
    });

    // Conversation A runs and answers the surface.
    const eventsA: GenUISurfaceEvent[] = [];
    await runPipelineForRun({
      db,
      runId: 'run-A',
      projectId: 'project-1',
      conversationId: 'conv-A',
      snapshot: snap,
      pipeline: snap.pipeline!,
      env: { maxIterations: 1 },
      runStage: () => ({ signals: {} }),
      emitGenui: (e) => {
        if (e.kind.startsWith('genui_')) eventsA.push(e as GenUISurfaceEvent);
      },
    });
    const requestA = eventsA.find((e) => e.kind === 'genui_surface_request');
    expect(requestA).toBeDefined();
    const pending = findPendingByRunAndSurfaceId(db, {
      runId: 'run-A',
      surfaceId: surface.id,
    });
    expect(pending).not.toBeNull();
    respondSurface(db, {
      rowId: pending!.id,
      value: { connectorId: 'slack', accountLabel: 'Acme' },
      respondedBy: 'user',
      runId: 'run-A',
    });

    // Conversation B re-applies the same plugin in the same project.
    // The runner asks the registry first; on cache hit it emits a
    // `genui_surface_response { respondedBy: 'cache' }` event WITHOUT
    // a fresh `genui_surface_request`. This is the e2e-5 anchor.
    const eventsB: GenUISurfaceEvent[] = [];
    await runPipelineForRun({
      db,
      runId: 'run-B',
      projectId: 'project-1',
      conversationId: 'conv-B',
      snapshot: snap,
      pipeline: snap.pipeline!,
      env: { maxIterations: 1 },
      runStage: () => ({ signals: {} }),
      emitGenui: (e) => {
        if (e.kind.startsWith('genui_')) eventsB.push(e as GenUISurfaceEvent);
      },
    });
    const surfaceEventsB = eventsB.filter((e) => e.surfaceId === surface.id);
    const requestB = surfaceEventsB.find((e) => e.kind === 'genui_surface_request');
    const responseB = surfaceEventsB.find((e) => e.kind === 'genui_surface_response');
    expect(requestB).toBeUndefined();
    expect(responseB).toBeDefined();
    if (responseB && responseB.kind === 'genui_surface_response') {
      expect(responseB.respondedBy).toBe('cache');
    }
  });

  it('raises a stage-bound surface only when the matching stage starts', async () => {
    const surface: GenUISurfaceSpec = {
      id: 'audience-clarify',
      kind: 'form',
      persist: 'conversation',
      trigger: { stageId: 'discovery' },
      schema: { type: 'object' },
    };
    const snap = snapshotWith({
      genuiSurfaces: [surface],
      pipeline: {
        stages: [
          { id: 'discovery', atoms: ['discovery-question-form'] },
          { id: 'plan', atoms: ['todo-write'] },
        ],
      },
    });
    const events: GenUISurfaceEvent[] = [];
    await runPipelineForRun({
      db,
      runId: 'run-stage',
      projectId: 'project-1',
      conversationId: 'conv-A',
      snapshot: snap,
      pipeline: snap.pipeline!,
      env: { maxIterations: 1 },
      runStage: () => ({ signals: {} }),
      emitGenui: (e) => {
        if (e.kind.startsWith('genui_')) events.push(e as GenUISurfaceEvent);
      },
    });
    const requests = events.filter((e) => e.kind === 'genui_surface_request');
    expect(requests).toHaveLength(1);
    expect(requests[0]?.surfaceId).toBe('audience-clarify');
  });
});
