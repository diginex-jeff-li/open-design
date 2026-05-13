// Composed Home view — the top-down layout the entry view renders
// when the left nav rail's "Home" tab is active.
//
// Owns the prompt state + active plugin lifecycle and stitches
// together the smaller pieces (HomeHero, RecentProjectsStrip,
// PluginsHomeSection). Replaces the older left-side `PluginLoopHome`
// surface by lifting its plugin orchestration up here so the prompt
// textarea can live centered in the hero.

import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ApplyResult,
  McpServerConfig,
  InstalledPluginRecord,
  ProjectKind,
} from '@open-design/contracts';
import { DEFAULT_UNSELECTED_SCENARIO_PLUGIN_ID } from '@open-design/contracts';
import {
  applyPlugin,
  listPlugins,
  renderPluginBriefTemplate,
  resolvePluginQueryFallback,
} from '../state/projects';
import { fetchMcpServers } from '../state/mcp';
import { useI18n } from '../i18n';
import type { Project, SkillSummary } from '../types';
import { HomeHero } from './HomeHero';
import { findChip, type HomeHeroChip } from './home-hero/chips';
import {
  buildPluginAuthoringPrompt,
  PLUGIN_AUTHORING_PROMPT,
  type HomePromptHandoff,
} from './home-hero/plugin-authoring';
import { PluginDetailsModal } from './PluginDetailsModal';
import { PluginsHomeSection } from './PluginsHomeSection';
import type { PluginLoopSubmit } from './PluginLoopHome';
import { RecentProjectsStrip } from './RecentProjectsStrip';

interface ActivePlugin {
  record: InstalledPluginRecord;
  // `result` is `null` during the optimistic window — set on chip
  // click before applyPlugin's roundtrip finishes — and is filled in
  // once the daemon returns the snapshot + resolved context. submit()
  // and contextItemCount both null-coalesce, so an in-flight active
  // is safe to render without a result.
  result: ApplyResult | null;
  inputs: Record<string, unknown>;
  // Stage B of plugin-driven-flow-plan: when the user applied this
  // plugin through the Home chip rail, the chip carries the project
  // kind we should stamp on the resulting create payload. `null` =
  // applied through the search picker / PluginsHomeSection, where the
  // kind defaults to the historical 'prototype' value.
  projectKind: ProjectKind | null;
  chipId: string | null;
}

const AUTHORING_DEFAULT_SCENARIO_INPUTS = {
  artifactKind: 'Open Design plugin',
  audience: 'Open Design plugin authors',
  topic: 'packaging a reusable workflow as an Open Design plugin',
};

interface Props {
  projects: Project[];
  projectsLoading?: boolean;
  onSubmit: (payload: PluginLoopSubmit) => void;
  onOpenProject: (id: string) => void;
  onViewAllProjects: () => void;
  // Stage B: optional callbacks the rail's migration chips need.
  // HomeView itself never imports them; EntryShell threads them
  // through so the dispatcher can stay declarative.
  onImportFolder?: () => Promise<void> | void;
  onOpenNewProject?: (tab: 'template') => void;
  promptHandoff?: HomePromptHandoff | null;
  skills?: SkillSummary[];
  skillsLoading?: boolean;
}

export function HomeView({
  projects,
  projectsLoading,
  onSubmit,
  onOpenProject,
  onViewAllProjects,
  onImportFolder,
  onOpenNewProject,
  promptHandoff,
  skills = [],
  skillsLoading = false,
}: Props) {
  const { locale } = useI18n();
  const [plugins, setPlugins] = useState<InstalledPluginRecord[]>([]);
  const [pluginsLoading, setPluginsLoading] = useState(true);
  const [pendingApplyId, setPendingApplyId] = useState<string | null>(null);
  const [pendingChipId, setPendingChipId] = useState<string | null>(null);
  const [pendingAuthoringChipId, setPendingAuthoringChipId] = useState<string | null>(null);
  const [pendingAuthoringPrompt, setPendingAuthoringPrompt] = useState(PLUGIN_AUTHORING_PROMPT);
  const [fallbackProjectKind, setFallbackProjectKind] = useState<ProjectKind | null>(null);
  const [active, setActive] = useState<ActivePlugin | null>(null);
  const [activeSkill, setActiveSkill] = useState<SkillSummary | null>(null);
  const [mcpServers, setMcpServers] = useState<McpServerConfig[]>([]);
  const [mcpLoading, setMcpLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [detailsRecord, setDetailsRecord] = useState<InstalledPluginRecord | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const consumedHandoffIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void listPlugins().then((rows) => {
        if (cancelled) return;
        setPlugins(rows);
        setPluginsLoading(false);
      });
    };
    load();
    window.addEventListener('open-design:plugins-changed', load);
    return () => {
      cancelled = true;
      window.removeEventListener('open-design:plugins-changed', load);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchMcpServers().then((result) => {
      if (cancelled) return;
      setMcpServers(result?.servers ?? []);
      setMcpLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!promptHandoff || consumedHandoffIdRef.current === promptHandoff.id) return;
    consumedHandoffIdRef.current = promptHandoff.id;
    setActive(null);
    setActiveSkill(null);
    setError(null);
    setFallbackProjectKind(promptHandoff.source === 'plugin-authoring' ? 'other' : null);
    setPrompt(promptHandoff.prompt);
    if (promptHandoff.focus) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (promptHandoff.source === 'plugin-authoring') {
      setPendingAuthoringChipId('plugin-authoring');
    }
  }, [promptHandoff]);

  const contextItemCount = useMemo(
    () => active?.result?.contextItems?.length ?? 0,
    [active],
  );

  // When the active plugin was bound through a chip, the badge shows
  // the chip label (e.g. "Prototype") instead of the underlying plugin
  // record title (e.g. "New generation (default scenario)"). Several
  // chips share od-new-generation, so surfacing the raw plugin title
  // would mislabel what the user actually picked.
  const activeBadgeTitle = useMemo(() => {
    if (!active) return null;
    if (active.chipId) {
      const chip = findChip(active.chipId);
      if (chip) return chip.label;
    }
    return active.record.title;
  }, [active]);

  const selectableSkills = useMemo(
    () => skills.filter((skill) => !skill.aggregatesExamples),
    [skills],
  );

  const enabledMcpServers = useMemo(
    () => mcpServers.filter((server) => server.enabled),
    [mcpServers],
  );

  async function usePlugin(
    record: InstalledPluginRecord,
    nextPrompt?: string | null,
    options?: { projectKind?: ProjectKind; chipId?: string; inputs?: Record<string, unknown> },
  ) {
    setPendingApplyId(record.id);
    if (options?.chipId) setPendingChipId(options.chipId);
    setError(null);
    // Optimistic update: the chip already carries the inputs and the
    // plugin record's manifest already carries the query template, so
    // we can render the brief locally without waiting for the apply
    // roundtrip. The active badge + prompt appear on the same frame as
    // the click; applyPlugin then resolves the snapshot id and context
    // items in the background and we reconcile in place. Without this
    // the user sees a ~100-500ms freeze before the input back-fills,
    // which feels like the UI is jammed.
    const optimisticInputs: Record<string, unknown> = { ...(options?.inputs ?? {}) };
    const manifestQuery = resolvePluginQueryFallback(
      record.manifest?.od?.useCase?.query,
      locale,
    );
    const optimisticPrompt =
      nextPrompt !== undefined && nextPrompt !== null
        ? nextPrompt
        : manifestQuery
          ? renderPluginBriefTemplate(manifestQuery, optimisticInputs)
          : null;
    setActive({
      record,
      result: null,
      inputs: optimisticInputs,
      projectKind: options?.projectKind ?? null,
      chipId: options?.chipId ?? null,
    });
    setFallbackProjectKind(null);
    setDetailsRecord(null);
    if (optimisticPrompt !== null) setPrompt(optimisticPrompt);
    requestAnimationFrame(() => inputRef.current?.focus());

    const result = await applyPlugin(record.id, { locale, inputs: options?.inputs });
    setPendingApplyId(null);
    setPendingChipId(null);
    if (!result) {
      // Roll back the optimistic active so submit can't fire against a
      // plugin that never bound. Only clear when the in-flight apply
      // still matches the visible active state — concurrent clicks
      // would otherwise stomp a successful later apply.
      setActive((prev) => (prev?.record.id === record.id ? null : prev));
      setError(`Failed to apply ${record.title}. Make sure the daemon is reachable.`);
      return;
    }
    const reconciledInputs: Record<string, unknown> = { ...optimisticInputs };
    for (const field of result.inputs ?? []) {
      if (field.default !== undefined && reconciledInputs[field.name] === undefined) {
        reconciledInputs[field.name] = field.default;
      }
    }
    setActive((prev) =>
      prev && prev.record.id === record.id
        ? { ...prev, result, inputs: reconciledInputs }
        : prev,
    );
    // The daemon may have filled in `topic`/`audience` defaults the
    // optimistic render didn't know about (the manifest is inspected
    // client-side but field.default lives on the apply result). Re-
    // render the brief using the reconciled inputs, but only if the
    // user hasn't edited the prompt in the meantime — if they have,
    // current !== optimisticPrompt and the functional setter is a
    // no-op so their edits survive.
    if (nextPrompt === undefined || nextPrompt === null) {
      const reconciledQuery =
        result.query ||
        resolvePluginQueryFallback(record.manifest?.od?.useCase?.query, locale);
      if (reconciledQuery) {
        const reconciledPrompt = renderPluginBriefTemplate(reconciledQuery, reconciledInputs);
        if (reconciledPrompt !== optimisticPrompt) {
          setPrompt((current) => (current === optimisticPrompt ? reconciledPrompt : current));
        }
      }
    }
  }

  function clearActivePlugin() {
    setActive(null);
    setFallbackProjectKind(null);
    setPrompt('');
  }

  function useSkill(skill: SkillSummary, nextPrompt: string | null) {
    setActiveSkill(skill);
    setError(null);
    const replacement = nextPrompt ?? skill.examplePrompt ?? '';
    if (replacement.trim().length > 0) setPrompt(replacement);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function useMcpServer(_server: McpServerConfig, nextPrompt: string) {
    setPrompt(nextPrompt);
    setError(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function queuePluginAuthoring(chipId: string | null, goal?: string) {
    const nextPrompt = goal ? buildPluginAuthoringPrompt(goal) : PLUGIN_AUTHORING_PROMPT;
    setActive(null);
    setActiveSkill(null);
    setFallbackProjectKind('other');
    setError(null);
    setPrompt(nextPrompt);
    setPendingAuthoringPrompt(nextPrompt);
    setPendingAuthoringChipId(chipId ?? 'plugin-authoring');
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    if (!pendingAuthoringChipId || pluginsLoading) return;
    const authoringRecord = plugins.find((plugin) => plugin.id === 'od-plugin-authoring');
    const record = authoringRecord ?? plugins.find((plugin) => plugin.id === 'od-new-generation');
    setPendingAuthoringChipId(null);
    if (!record) {
      // The authoring scenario can be absent in a long-running dev
      // daemon that started before the bundled plugin was added. If
      // even the default scenario is missing, do not block the user:
      // keep the prompt in place and submit as a naked `other`
      // project so the server-side fallback can still attempt to bind.
      return;
    }
    void usePlugin(record, pendingAuthoringPrompt, {
      projectKind: 'other',
      chipId: pendingAuthoringChipId === 'plugin-authoring' ? undefined : pendingAuthoringChipId,
      ...(authoringRecord ? {} : { inputs: AUTHORING_DEFAULT_SCENARIO_INPUTS }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAuthoringChipId, pendingAuthoringPrompt, pluginsLoading, plugins]);

  // Stage B of plugin-driven-flow-plan: the chip rail dispatcher.
  // Pure UI-state mapping — the heavy lifting (apply / import) is
  // delegated back to existing handlers. Migration chips that don't
  // have a bound plugin (`import-folder`, `open-template-picker`)
  // forward to callbacks threaded in from EntryShell.
  function pickChip(chip: HomeHeroChip) {
    setError(null);
    switch (chip.action.kind) {
      case 'apply-scenario':
      case 'apply-figma-migration': {
        const targetId = chip.action.pluginId;
        const record = plugins.find((p) => p.id === targetId);
        if (!record) {
          setError(
            `Bundled scenario "${targetId}" is not installed. Reinstall the daemon to restore the default plugin set.`,
          );
          return;
        }
        void usePlugin(record, undefined, {
          projectKind: chip.action.projectKind,
          chipId: chip.id,
          inputs: chip.action.inputs,
        });
        return;
      }
      case 'create-plugin': {
        queuePluginAuthoring(chip.id);
        return;
      }
      case 'import-folder': {
        if (!onImportFolder) {
          setError('Folder import is not available in this shell.');
          return;
        }
        void onImportFolder();
        return;
      }
      case 'open-template-picker': {
        if (!onOpenNewProject) {
          setError('Template picker is not available in this shell.');
          return;
        }
        onOpenNewProject('template');
        return;
      }
    }
  }

  function submit() {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const defaultInputs = { prompt: trimmed };
    onSubmit({
      prompt: trimmed,
      pluginId: active?.record.id ?? DEFAULT_UNSELECTED_SCENARIO_PLUGIN_ID,
      skillId: activeSkill?.id ?? null,
      appliedPluginSnapshotId: active?.result?.appliedPlugin?.snapshotId ?? null,
      pluginTitle: active?.record.title ?? null,
      taskKind: active?.result?.appliedPlugin?.taskKind ?? null,
      pluginInputs: active ? active.inputs : defaultInputs,
      projectKind: active?.projectKind ?? fallbackProjectKind ?? projectKindForSkill(activeSkill) ?? 'other',
    });
  }

  return (
    <div className="home-view" data-testid="home-view">
      <HomeHero
        ref={inputRef}
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={submit}
        activePluginTitle={activeBadgeTitle}
        activeSkillId={activeSkill?.id ?? null}
        activeSkillTitle={activeSkill?.name ?? null}
        activeChipId={active?.chipId ?? null}
        onClearActivePlugin={clearActivePlugin}
        onClearActiveSkill={() => setActiveSkill(null)}
        pluginOptions={plugins}
        pluginsLoading={pluginsLoading}
        skillOptions={selectableSkills}
        skillsLoading={skillsLoading}
        mcpOptions={enabledMcpServers}
        mcpLoading={mcpLoading}
        pendingPluginId={pendingApplyId}
        pendingChipId={pendingChipId}
        submitDisabled={Boolean(pendingApplyId) || Boolean(pendingAuthoringChipId)}
        onPickPlugin={(record, nextPrompt) => void usePlugin(record, nextPrompt)}
        onPickSkill={useSkill}
        onPickMcp={useMcpServer}
        onPickChip={pickChip}
        contextItemCount={contextItemCount}
        error={error}
      />

      <RecentProjectsStrip
        projects={projects}
        {...(projectsLoading !== undefined ? { loading: projectsLoading } : {})}
        onOpen={onOpenProject}
        onViewAll={onViewAllProjects}
      />

      <PluginsHomeSection
        plugins={plugins}
        loading={pluginsLoading}
        activePluginId={active?.record.id ?? null}
        pendingApplyId={pendingApplyId}
        onUse={(record) => void usePlugin(record)}
        onOpenDetails={setDetailsRecord}
        onCreatePlugin={(goal) => queuePluginAuthoring(null, goal)}
      />

      {detailsRecord ? (
        <PluginDetailsModal
          record={detailsRecord}
          onClose={() => setDetailsRecord(null)}
          onUse={(record) => void usePlugin(record)}
          isApplying={pendingApplyId === detailsRecord.id}
        />
      ) : null}
    </div>
  );
}

function projectKindForSkill(skill: SkillSummary | null): ProjectKind | null {
  if (!skill) return null;
  if (skill.mode === 'deck') return 'deck';
  if (skill.mode === 'prototype') return 'prototype';
  if (skill.mode === 'template') return 'template';
  if (skill.mode === 'image' || skill.surface === 'image') return 'image';
  if (skill.mode === 'video' || skill.surface === 'video') return 'video';
  if (skill.mode === 'audio' || skill.surface === 'audio') return 'audio';
  return 'other';
}
