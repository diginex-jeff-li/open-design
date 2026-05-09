// Plan §3.C2 / spec §8.1 — context chip strip.
//
// Renders the typed `ContextItem` list above the brief input. Each chip
// describes one piece of context the active plugin contributed: an
// active skill, a design-system, a craft rule, an asset, an MCP server,
// a connector, etc. Clicking the X button calls `onRemove(item)` so
// the parent can decide whether removing the chip should clear the
// applied plugin (typical) or just hide it.

import type { ContextItem } from '@open-design/contracts';

interface Props {
  items: ContextItem[];
  onRemove?: (item: ContextItem) => void;
  // When true (default), an empty list renders nothing; when false the
  // empty state shows a placeholder hint useful for tests / docs.
  hideWhenEmpty?: boolean;
}

export function ContextChipStrip(props: Props) {
  const items = props.items ?? [];
  if (items.length === 0 && (props.hideWhenEmpty ?? true)) return null;
  return (
    <div className="context-chip-strip" role="list" data-testid="context-chip-strip">
      {items.length === 0 ? (
        <div className="context-chip-strip__empty">No active plugin context.</div>
      ) : null}
      {items.map((item, idx) => (
        <span
          key={`${item.kind}-${chipKey(item)}-${idx}`}
          role="listitem"
          className="context-chip-strip__chip"
          data-kind={item.kind}
        >
          <span className="context-chip-strip__kind">{item.kind}</span>
          <span className="context-chip-strip__label">{chipLabel(item)}</span>
          {props.onRemove ? (
            <button
              type="button"
              className="context-chip-strip__remove"
              aria-label={`Remove ${item.kind} ${chipLabel(item)}`}
              onClick={() => props.onRemove?.(item)}
            >
              ×
            </button>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function chipLabel(item: ContextItem): string {
  if ('label' in item && item.label) return item.label;
  if ('id' in item && item.id) return item.id;
  if ('name' in item && item.name) return item.name;
  if ('path' in item && item.path) return item.path;
  return item.kind;
}

function chipKey(item: ContextItem): string {
  if ('id' in item && item.id) return item.id;
  if ('name' in item && item.name) return item.name;
  if ('path' in item && item.path) return item.path;
  return '';
}
