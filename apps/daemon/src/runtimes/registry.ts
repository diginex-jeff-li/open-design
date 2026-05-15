import { hermesAgentDef } from './defs/hermes.js';
import { copilotAgentDef } from './defs/copilot.js';
import { piAgentDef } from './defs/pi.js';
import type { RuntimeAgentDef } from './types.js';

// Local deployment policy: only expose Hermes and GitHub Copilot adapters.
// Other installed CLIs may exist on the VPS, but OD should not detect them.
export const AGENT_DEFS: RuntimeAgentDef[] = [
  hermesAgentDef,
  copilotAgentDef,
  piAgentDef,
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
