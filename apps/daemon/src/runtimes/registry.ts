import { hermesAgentDef } from './defs/hermes.js';
import { copilotAgentDef } from './defs/copilot.js';
import { piAgentDef } from './defs/pi.js';
import { readLocalAgentProfileDefs as readLocalAgentProfileDefsFromFile } from './local-profiles.js';
import type { RuntimeAgentDef } from './types.js';

// Local deployment policy: only expose Hermes, GitHub Copilot, and Pi adapters.
// Upstream ships many more (claude, codex, gemini, grok-build, cursor, qwen, etc.),
// but this VPS should not detect or offer them. Other CLIs may be installed on the
// host for unrelated reasons — keep OD's agent picker restricted to the supported set.
// Maintained as a local patch across upstream pulls. See .local/bin/README.md.
const BASE_AGENT_DEFS: RuntimeAgentDef[] = [
  hermesAgentDef,
  copilotAgentDef,
  piAgentDef,
];

export function readLocalAgentProfileDefs(
  baseDefs: RuntimeAgentDef[] = BASE_AGENT_DEFS,
): RuntimeAgentDef[] {
  return readLocalAgentProfileDefsFromFile(baseDefs);
}

export const AGENT_DEFS: RuntimeAgentDef[] = [
  ...BASE_AGENT_DEFS,
  ...readLocalAgentProfileDefs(BASE_AGENT_DEFS),
];

const ids = new Set();
for (const def of AGENT_DEFS) {
  if (ids.has(def.id)) {
    throw new Error(`Duplicate agent definition id: ${def.id}`);
  }
  ids.add(def.id);
}

export function getAgentDef(id: string): RuntimeAgentDef | null {
  return AGENT_DEFS.find((a) => a.id === id) || null;
}
