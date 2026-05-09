// Plan §3.F4 / spec §8 e2e-3 anchor.
//
// Verifies the headless `od plugin install → project create → run start`
// loop end-to-end at the HTTP layer (the same paths the CLI subcommands
// from §3.F1 / §3.F2 hit). Without an actual agent backend we can't
// assert "first ND-JSON event has kind='pipeline_stage_started'" — that
// requires the run-time pipeline runner being wired into the live agent
// loop. What we can lock today:
//
//   1. POST /api/plugins/install (local fixture) succeeds.
//   2. POST /api/projects { pluginId, pluginInputs } → 200 +
//      appliedPluginSnapshotId pinned to the new project.
//   3. POST /api/runs { projectId, pluginId, pluginInputs } → 202 +
//      runId.
//   4. GET /api/runs/:id surfaces appliedPluginSnapshotId on the run
//      status body so a code agent that polled status (rather than
//      streaming events) can still reach the snapshot id.
//   5. POST /api/applied-plugins/:id is fetchable and returns the same
//      snapshot a replay would re-launch against.
//
// Once the pipeline runner is wired into startChatRun (deferred to the
// Phase 1 follow-up that lands a fully-driven agent loop), this test
// gets extended to assert the first SSE event is `pipeline_stage_started`.

import type http from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import path from 'node:path';
import url from 'node:url';
import { startServer } from '../src/server.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'plugin-fixtures', 'sample-plugin');

let server: http.Server;
let baseUrl: string;
let shutdown: (() => Promise<void> | void) | undefined;

beforeAll(async () => {
  const started = (await startServer({ port: 0, returnServer: true })) as {
    url: string;
    server: http.Server;
    shutdown?: () => Promise<void> | void;
  };
  baseUrl = started.url;
  server = started.server;
  shutdown = started.shutdown;
});

afterAll(async () => {
  await Promise.resolve(shutdown?.());
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function readSseUntilSuccess(resp: Response) {
  if (!resp.body) throw new Error('install: no body');
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const eventLine = block.split('\n').find((l) => l.startsWith('event: '));
      const dataLine  = block.split('\n').find((l) => l.startsWith('data: '));
      const event = eventLine ? eventLine.slice('event: '.length) : '';
      const data  = dataLine  ? JSON.parse(dataLine.slice('data: '.length)) : null;
      if (event === 'success') return data;
      if (event === 'error') throw new Error(data?.message ?? 'install failed');
    }
  }
  throw new Error('install stream ended without success');
}

describe('Plan §8 e2e-3 (entry slice) — headless install → project → run', () => {
  it('walks install → project create → run start → status with snapshot pinned', async () => {
    // 1. Install a local fixture plugin via the SSE install endpoint.
    const installResp = await fetch(`${baseUrl}/api/plugins/install`, {
      method:  'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      body:    JSON.stringify({ source: FIXTURE_DIR }),
    });
    expect(installResp.status).toBe(200);
    const installSuccess = await readSseUntilSuccess(installResp);
    expect(installSuccess?.plugin?.id).toBe('sample-plugin');

    // 2. Create a project bound to the plugin.
    const projectId = `headless-${Date.now()}`;
    const createResp = await fetch(`${baseUrl}/api/projects`, {
      method:  'POST',
      headers: { 'content-type': 'application/json' },
      body:    JSON.stringify({
        id:           projectId,
        name:         'Headless e2e-3',
        pluginId:     'sample-plugin',
        pluginInputs: { topic: 'agentic design' },
      }),
    });
    expect(createResp.status).toBe(200);
    const createBody = (await createResp.json()) as {
      project: { id: string };
      conversationId: string;
      appliedPluginSnapshotId?: string;
    };
    expect(createBody.project.id).toBe(projectId);
    expect(createBody.appliedPluginSnapshotId).toBeTruthy();

    // 3. Start a run that re-uses the same applied snapshot id.
    const runResp = await fetch(`${baseUrl}/api/runs`, {
      method:  'POST',
      headers: { 'content-type': 'application/json' },
      body:    JSON.stringify({
        projectId,
        pluginId:                 'sample-plugin',
        appliedPluginSnapshotId:  createBody.appliedPluginSnapshotId,
        pluginInputs:             { topic: 'agentic design' },
      }),
    });
    expect(runResp.status).toBe(202);
    const runBody = (await runResp.json()) as { runId: string };
    expect(runBody.runId).toBeTruthy();

    // 4. The run status surfaces the snapshot id so a polling client
    // can reach replay without parsing the SSE stream.
    const statusResp = await fetch(`${baseUrl}/api/runs/${encodeURIComponent(runBody.runId)}`);
    expect(statusResp.status).toBe(200);
    const statusBody = (await statusResp.json()) as {
      id: string;
      projectId: string;
      pluginId: string | null;
      appliedPluginSnapshotId: string | null;
    };
    expect(statusBody.pluginId).toBe('sample-plugin');
    expect(statusBody.appliedPluginSnapshotId).toBe(createBody.appliedPluginSnapshotId);

    // 5. Replay reads the same snapshot row.
    const snapResp = await fetch(`${baseUrl}/api/applied-plugins/${encodeURIComponent(createBody.appliedPluginSnapshotId!)}`);
    expect(snapResp.status).toBe(200);
    const snap = (await snapResp.json()) as { snapshotId: string; pluginId: string };
    expect(snap.snapshotId).toBe(createBody.appliedPluginSnapshotId);
    expect(snap.pluginId).toBe('sample-plugin');

    // Cancel the run so the test cleans up the in-memory child path.
    await fetch(`${baseUrl}/api/runs/${encodeURIComponent(runBody.runId)}/cancel`, { method: 'POST' });
  });
});
