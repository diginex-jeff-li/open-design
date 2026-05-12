import { useEffect, useMemo, useState } from 'react';
import type { ApplyResult, InstalledPluginRecord, PluginSourceKind } from '@open-design/contracts';
import {
  applyPlugin,
  installPluginSource,
  listPluginMarketplaces,
  listPlugins,
  type PluginInstallOutcome,
  type PluginMarketplace,
} from '../state/projects';
import { Icon } from './Icon';
import { PluginDetailsModal } from './PluginDetailsModal';
import { PluginsHomeSection } from './PluginsHomeSection';
import { useI18n } from '../i18n';

type PluginsTab = 'community' | 'mine' | 'marketplaces' | 'team';

const USER_SOURCE_KINDS = new Set<PluginSourceKind>([
  'user',
  'project',
  'marketplace',
  'github',
  'url',
  'local',
]);

const PLUGINS_TABS: ReadonlyArray<{
  id: PluginsTab;
  label: string;
  hint: string;
}> = [
  { id: 'community', label: 'Community', hint: 'Official catalog' },
  { id: 'mine', label: 'My plugins', hint: 'User-installed' },
  { id: 'marketplaces', label: 'Marketplaces', hint: 'Catalog sources' },
  { id: 'team', label: 'Team / Enterprise', hint: 'Coming soon' },
];

export function PluginsView() {
  const { locale } = useI18n();
  const [plugins, setPlugins] = useState<InstalledPluginRecord[]>([]);
  const [marketplaces, setMarketplaces] = useState<PluginMarketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PluginsTab>('community');
  const [source, setSource] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [pendingApplyId, setPendingApplyId] = useState<string | null>(null);
  const [activePlugin, setActivePlugin] = useState<{
    record: InstalledPluginRecord;
    result: ApplyResult;
  } | null>(null);
  const [detailsRecord, setDetailsRecord] = useState<InstalledPluginRecord | null>(null);
  const [notice, setNotice] = useState<PluginInstallOutcome | { ok: boolean; message: string } | null>(null);

  async function refresh() {
    setLoading(true);
    const [rows, catalogs] = await Promise.all([listPlugins(), listPluginMarketplaces()]);
    setPlugins(rows);
    setMarketplaces(catalogs);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const officialPlugins = useMemo(
    () => plugins.filter((plugin) => plugin.sourceKind === 'bundled'),
    [plugins],
  );
  const userPlugins = useMemo(
    () => plugins.filter((plugin) => USER_SOURCE_KINDS.has(plugin.sourceKind)),
    [plugins],
  );

  async function handleInstall() {
    const trimmed = source.trim();
    if (!trimmed) return;
    setInstalling(true);
    setNotice(null);
    const outcome = await installPluginSource(trimmed);
    setInstalling(false);
    setNotice(outcome);
    if (outcome.ok) {
      setSource('');
      setImportOpen(false);
      await refresh();
      setActiveTab('mine');
    }
  }

  async function handleUsePlugin(record: InstalledPluginRecord) {
    setPendingApplyId(record.id);
    setNotice(null);
    const result = await applyPlugin(record.id, { locale });
    setPendingApplyId(null);
    if (!result) {
      setNotice({
        ok: false,
        message: `Failed to apply ${record.title}. Make sure the daemon is reachable.`,
      });
      return;
    }
    setActivePlugin({ record, result });
    setDetailsRecord(null);
    setNotice({
      ok: true,
      message: `${record.title} is ready. Use it from Home with @ search or pick it from the gallery.`,
    });
  }

  return (
    <section className="plugins-view" aria-labelledby="plugins-title">
      <header className="plugins-view__hero">
        <div>
          <p className="plugins-view__kicker">Plugins</p>
          <h1 id="plugins-title" className="entry-section__title">
            Plugins
          </h1>
          <p className="plugins-view__lede">
            Browse the same visual plugin catalog from Home, then manage your
            user plugins, marketplace sources, and future team catalogs here.
          </p>
        </div>
        <div className="plugins-view__hero-actions">
          <button
            type="button"
            className="plugins-view__primary"
            onClick={() => setImportOpen((open) => !open)}
            aria-expanded={importOpen}
            data-testid="plugins-import-button"
          >
            <Icon name="plus" size={13} />
            <span>Create / Import</span>
          </button>
          <div className="plugins-view__badge" aria-hidden="true">
            <Icon name="grid" size={15} />
            <span>Agent context</span>
          </div>
        </div>
      </header>

      <div className="plugins-view__stats" aria-label="Plugin summary">
        <StatCard label="Official" value={officialPlugins.length} />
        <StatCard label="My plugins" value={userPlugins.length} />
        <StatCard label="Marketplaces" value={marketplaces.length} />
      </div>

      {importOpen ? (
        <ImportPanel
          source={source}
          installing={installing}
          onSourceChange={setSource}
          onInstall={handleInstall}
        />
      ) : null}

      <nav className="plugins-view__tabs" role="tablist" aria-label="Plugin areas">
        {PLUGINS_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`plugins-view__tab${active ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`plugins-tab-${tab.id}`}
            >
              <span className="plugins-view__tab-label">{tab.label}</span>
              <span className="plugins-view__tab-hint">{tab.hint}</span>
            </button>
          );
        })}
      </nav>

      {notice ? <Notice outcome={notice} /> : null}

      <div className="plugins-view__gallery">
        {loading ? <div className="plugins-view__empty">Loading plugins…</div> : null}

        {!loading && activeTab === 'community' ? (
          <PluginsHomeSection
            plugins={officialPlugins}
            loading={false}
            activePluginId={activePlugin?.record.id ?? null}
            pendingApplyId={pendingApplyId}
            onUse={(record) => void handleUsePlugin(record)}
            onOpenDetails={setDetailsRecord}
            title="Community"
            subtitle="Things you can do and tasks to complete — packaged as plugins. Pick one to load a starter prompt, or use @ search from Home."
            emptyMessage="No official plugins are registered yet. Restart the daemon if this looks wrong."
          />
        ) : null}

        {!loading && activeTab === 'mine' ? (
          <PluginsHomeSection
            plugins={userPlugins}
            loading={false}
            activePluginId={activePlugin?.record.id ?? null}
            pendingApplyId={pendingApplyId}
            onUse={(record) => void handleUsePlugin(record)}
            onOpenDetails={setDetailsRecord}
            title="My plugins"
            subtitle="Plugins installed into your user registry. They appear in @ search and can be consumed by the agent like official plugins."
            emptyMessage="No user plugins yet. Use Create / Import to install from GitHub, a daemon-local path, an HTTPS archive, or a marketplace name."
          />
        ) : null}

        {!loading && activeTab === 'marketplaces' ? (
          <MarketplacesPanel marketplaces={marketplaces} />
        ) : null}

        {activeTab === 'team' ? <TeamPanel /> : null}
      </div>

      {detailsRecord ? (
        <PluginDetailsModal
          record={detailsRecord}
          onClose={() => setDetailsRecord(null)}
          onUse={(record) => void handleUsePlugin(record)}
          isApplying={pendingApplyId === detailsRecord.id}
        />
      ) : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="plugins-view__stat">
      <span className="plugins-view__stat-value">{value}</span>
      <span className="plugins-view__stat-label">{label}</span>
    </div>
  );
}

function Notice({
  outcome,
}: {
  outcome: PluginInstallOutcome | { ok: boolean; message: string };
}) {
  const warnings = 'warnings' in outcome ? outcome.warnings : [];
  const log = 'log' in outcome ? outcome.log : [];
  return (
    <div className={`plugins-view__notice${outcome.ok ? ' is-success' : ' is-error'}`} role="status">
      <div>{outcome.message}</div>
      {warnings.length > 0 ? (
        <div className="plugins-view__notice-sub">
          {warnings.length} warning{warnings.length === 1 ? '' : 's'}
        </div>
      ) : null}
      {log.length > 0 ? (
        <details className="plugins-view__notice-log">
          <summary>Install log</summary>
          <ul>
            {log.map((line, idx) => (
              <li key={`${line}-${idx}`}>{line}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function MarketplacesPanel({ marketplaces }: { marketplaces: PluginMarketplace[] }) {
  return (
    <section className="plugins-view__section" aria-labelledby="plugins-marketplaces-title">
      <div className="plugins-view__section-head">
        <div>
          <h2 id="plugins-marketplaces-title">Configured marketplaces</h2>
          <p>Marketplace manifests can resolve bare plugin names during install.</p>
        </div>
        <span className="plugins-view__section-count">{marketplaces.length}</span>
      </div>
      {marketplaces.length === 0 ? (
        <div className="plugins-view__empty">
          No marketplaces registered yet. Add one with <code>od marketplace add &lt;url&gt;</code>.
        </div>
      ) : (
        <div className="plugins-view__marketplaces">
          {marketplaces.map((marketplace) => (
            <article key={marketplace.id} className="plugins-view__marketplace">
              <div>
                <h3>{marketplace.manifest.name ?? marketplace.url}</h3>
                <a href={marketplace.url} target="_blank" rel="noreferrer">
                  {marketplace.url}
                </a>
              </div>
              <div className="plugins-view__meta">
                <span>{marketplace.trust}</span>
                <span>{marketplace.manifest.plugins?.length ?? 0} plugins</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ImportPanel({
  source,
  installing,
  onSourceChange,
  onInstall,
}: {
  source: string;
  installing: boolean;
  onSourceChange: (value: string) => void;
  onInstall: () => void;
}) {
  return (
    <section className="plugins-view__section plugins-view__import" aria-labelledby="plugins-import-title">
      <div className="plugins-view__section-head">
        <div>
          <h2 id="plugins-import-title">Create or import a plugin</h2>
          <p>
            Install into the user plugin registry from the sources the daemon
            already understands.
          </p>
        </div>
      </div>
      <div className="plugins-view__install-card">
        <label htmlFor="plugin-source">Plugin source</label>
        <div className="plugins-view__source-row">
          <input
            id="plugin-source"
            value={source}
            onChange={(event) => onSourceChange(event.target.value)}
            placeholder="github:owner/repo@main/plugins/my-plugin"
            disabled={installing}
          />
          <button
            type="button"
            className="plugins-view__primary"
            onClick={onInstall}
            disabled={installing || source.trim().length === 0}
          >
            {installing ? 'Installing…' : 'Install'}
          </button>
        </div>
        <div className="plugins-view__source-help">
          Supports <code>github:owner/repo[@ref][/subpath]</code>, daemon-local paths,
          HTTPS <code>.tar.gz</code>/<code>.tgz</code> archives, or marketplace plugin names.
        </div>
      </div>
      <div className="plugins-view__future-grid">
        <FutureCard
          icon="upload"
          title="Upload zip"
          body="Needs a browser upload endpoint that safely stages and scans archives before install."
        />
        <FutureCard
          icon="folder"
          title="Upload folder"
          body="Browsers cannot hand the daemon a folder path directly; this needs an explicit upload flow."
        />
        <FutureCard
          icon="edit"
          title="Create from template"
          body="Future plugin authoring can scaffold open-design.json, examples, and preview assets."
        />
      </div>
    </section>
  );
}

function FutureCard({
  icon,
  title,
  body,
}: {
  icon: 'upload' | 'folder' | 'edit';
  title: string;
  body: string;
}) {
  return (
    <article className="plugins-view__future-card" aria-disabled="true">
      <span className="plugins-view__future-icon" aria-hidden>
        <Icon name={icon} size={16} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function TeamPanel() {
  return (
    <section className="plugins-view__team" aria-labelledby="plugins-team-title">
      <span className="plugins-view__future-icon" aria-hidden>
        <Icon name="sparkles" size={18} />
      </span>
      <div>
        <p className="plugins-view__kicker">Coming soon</p>
        <h2 id="plugins-team-title">Private team marketplaces</h2>
        <p>
          This area is reserved for enterprise and team catalogs, private trust
          policies, and shared plugin lifecycle controls.
        </p>
      </div>
    </section>
  );
}
