import { hermesAgentDef } from './defs/hermes.js';
import { copilotAgentDef } from './defs/copilot.js';
import { piAgentDef } from './defs/pi.js';
import { readLocalAgentProfileDefs as readLocalAgentProfileDefsFromFile } from './local-profiles.js';
import type { RuntimeAgentDef } from './types.js';

// Local deployment policy: only expose Hermes, Copilot, and Pi adapters.
// Other installed CLIs may exist on the VPS, but OD should not detect them.
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
