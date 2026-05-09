// Plan §3.C3 / spec §10.3 — Generative UI surface renderer.
//
// Renders a single pending GenUI surface. v1 ships first-class
// renderers for `confirmation` and `oauth-prompt`; `form` and `choice`
// fall back to a JSON-Schema preview + a generic "value-json" textarea
// (the proper schema-driven renderer lands in Phase 2A.5).

import { useState } from 'react';
import type { GenUISurfaceSpec } from '@open-design/contracts';

export interface PendingSurface {
  // The surface descriptor as declared in `od.genui.surfaces[]`.
  surface: GenUISurfaceSpec;
  // The runId the surface was raised on. The respond endpoint is
  // POST /api/runs/:runId/genui/:surfaceId/respond.
  runId: string;
  // Optional pre-filled value used for `form`/`choice` re-asks.
  defaultValue?: unknown;
}

interface Props {
  pending: PendingSurface;
  onAnswered: (value: unknown) => Promise<void> | void;
  onSkip?: () => void;
}

export function GenUISurfaceRenderer(props: Props) {
  const { surface } = props.pending;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (value: unknown) => {
    setSubmitting(true);
    setError(null);
    try {
      await props.onAnswered(value);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (surface.kind === 'confirmation') {
    return (
      <div className="genui-surface genui-surface--confirmation" role="dialog" aria-label={surface.id}>
        <div className="genui-surface__prompt">
          {surface.prompt ?? 'The plugin needs your confirmation to continue.'}
        </div>
        <div className="genui-surface__actions">
          <button
            type="button"
            className="genui-surface__primary"
            disabled={submitting}
            onClick={() => submit(true)}
            data-testid="genui-confirm"
          >
            Continue
          </button>
          <button
            type="button"
            className="genui-surface__secondary"
            disabled={submitting}
            onClick={() => submit(false)}
            data-testid="genui-cancel"
          >
            Cancel
          </button>
        </div>
        {error ? <div className="genui-surface__error">{error}</div> : null}
      </div>
    );
  }

  if (surface.kind === 'oauth-prompt') {
    return (
      <div className="genui-surface genui-surface--oauth" role="dialog" aria-label={surface.id}>
        <div className="genui-surface__prompt">
          {surface.prompt ?? `Authorize ${surface.oauth?.connectorId ?? surface.oauth?.mcpServerId ?? 'the connector'}`}
        </div>
        <div className="genui-surface__hint">
          {surface.oauth?.route === 'connector'
            ? `connector: ${surface.oauth.connectorId}`
            : surface.oauth?.route === 'mcp'
              ? `mcp server: ${surface.oauth.mcpServerId}`
              : null}
        </div>
        <div className="genui-surface__actions">
          <button
            type="button"
            className="genui-surface__primary"
            disabled={submitting}
            onClick={() => submit({
              authorized: true,
              ...(surface.oauth?.route === 'connector' && surface.oauth.connectorId
                ? { connectorId: surface.oauth.connectorId }
                : {}),
              ...(surface.oauth?.route === 'mcp' && surface.oauth.mcpServerId
                ? { mcpServerId: surface.oauth.mcpServerId }
                : {}),
            })}
            data-testid="genui-authorize"
          >
            Authorize
          </button>
          {props.onSkip ? (
            <button
              type="button"
              className="genui-surface__secondary"
              disabled={submitting}
              onClick={props.onSkip}
            >
              Skip
            </button>
          ) : null}
        </div>
        {error ? <div className="genui-surface__error">{error}</div> : null}
      </div>
    );
  }

  // form / choice fallback — Phase 2A.5 lands the JSON-Schema-driven
  // renderer; until then a value-json textarea is the headless-equivalent
  // surface a power user can edit by hand.
  return (
    <div className="genui-surface genui-surface--fallback" role="dialog" aria-label={surface.id}>
      <div className="genui-surface__prompt">
        {surface.prompt ?? `Plugin needs ${surface.kind} input.`}
      </div>
      {surface.schema ? (
        <details className="genui-surface__schema">
          <summary>JSON Schema</summary>
          <pre>{JSON.stringify(surface.schema, null, 2)}</pre>
        </details>
      ) : null}
      <FreeFormJsonForm onSubmit={submit} disabled={submitting} />
      {error ? <div className="genui-surface__error">{error}</div> : null}
    </div>
  );
}

function FreeFormJsonForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (value: unknown) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState('{}');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          onSubmit(JSON.parse(text));
        } catch (err) {
          // Invalid JSON; surface the parse error inline.
          // eslint-disable-next-line no-console
          console.warn('GenUI form: invalid JSON', err);
        }
      }}
    >
      <textarea
        className="genui-surface__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        data-testid="genui-form-textarea"
      />
      <button type="submit" disabled={disabled} className="genui-surface__primary">
        Submit
      </button>
    </form>
  );
}
