// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { InstalledPluginRecord, PluginSourceKind, TrustTier } from '@open-design/contracts';
import { PluginsView } from '../../src/components/PluginsView';
import {
  applyPlugin,
  installPluginSource,
  listPluginMarketplaces,
  listPlugins,
} from '../../src/state/projects';

vi.mock('../../src/router', () => ({
  navigate: vi.fn(),
}));

vi.mock('../../src/state/projects', () => ({
  applyPlugin: vi.fn(),
  installPluginSource: vi.fn(),
  listPluginMarketplaces: vi.fn(),
  listPlugins: vi.fn(),
  uninstallPlugin: vi.fn(),
  upgradePlugin: vi.fn(),
}));

function makePlugin(
  id: string,
  sourceKind: PluginSourceKind,
  trust: TrustTier,
): InstalledPluginRecord {
  return {
    id,
    title: id === 'official-plugin' ? 'Official Plugin' : 'User Plugin',
    version: '1.0.0',
    sourceKind,
    source: '/tmp',
    trust,
    capabilitiesGranted: ['prompt:inject'],
    manifest: {
      name: id,
      version: '1.0.0',
      title: id,
      description: `${id} description`,
      od: {
        kind: 'scenario',
        mode: 'prototype',
      },
    },
    fsPath: '/tmp',
    installedAt: 0,
    updatedAt: 0,
  };
}

const mockedListPlugins = vi.mocked(listPlugins);
const mockedListMarketplaces = vi.mocked(listPluginMarketplaces);
const mockedInstallPluginSource = vi.mocked(installPluginSource);
const mockedApplyPlugin = vi.mocked(applyPlugin);

beforeEach(() => {
  mockedListPlugins.mockResolvedValue([
    makePlugin('official-plugin', 'bundled', 'bundled'),
    makePlugin('user-plugin', 'github', 'restricted'),
  ]);
  mockedListMarketplaces.mockResolvedValue([
    {
      id: 'catalog-1',
      url: 'https://example.com/open-design-marketplace.json',
      trust: 'official',
      manifest: {
        name: 'Example Catalog',
        plugins: [{ name: 'remote-plugin', source: 'github:owner/repo' }],
      },
    },
  ]);
  mockedInstallPluginSource.mockResolvedValue({
    ok: true,
    plugin: makePlugin('new-plugin', 'github', 'restricted'),
    warnings: [],
    message: 'Installed New Plugin.',
    log: ['Parsing manifest'],
  });
  mockedApplyPlugin.mockResolvedValue({
    query: 'Make something.',
    contextItems: [],
    inputs: [],
    assets: [],
    mcpServers: [],
    trust: 'restricted',
    capabilitiesGranted: ['prompt:inject'],
    capabilitiesRequired: ['prompt:inject'],
    appliedPlugin: {
      snapshotId: 'snap-1',
      pluginId: 'official-plugin',
      pluginVersion: '1.0.0',
      manifestSourceDigest: 'a'.repeat(64),
      inputs: {},
      resolvedContext: { items: [] },
      capabilitiesGranted: ['prompt:inject'],
      capabilitiesRequired: ['prompt:inject'],
      assetsStaged: [],
      taskKind: 'new-generation',
      appliedAt: 0,
      connectorsRequired: [],
      connectorsResolved: [],
      mcpServers: [],
      status: 'fresh',
    },
    projectMetadata: {},
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PluginsView', () => {
  it('groups official and user-installed plugins', async () => {
    render(<PluginsView />);

    await waitFor(() => expect(screen.getAllByText('Official Plugin').length).toBeGreaterThan(0));
    expect(screen.queryByText('User Plugin')).toBeNull();

    fireEvent.click(screen.getByTestId('plugins-tab-mine'));
    expect(screen.getAllByText('User Plugin').length).toBeGreaterThan(0);
    expect(screen.queryByText('Official Plugin')).toBeNull();
  });

  it('installs from a supported source string', async () => {
    render(<PluginsView />);

    expect(screen.queryByTestId('plugins-tab-import')).toBeNull();
    fireEvent.click(await screen.findByTestId('plugins-import-button'));
    fireEvent.change(screen.getByLabelText('Plugin source'), {
      target: { value: 'github:owner/repo/plugins/my-plugin' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Install' }));

    await waitFor(() =>
      expect(mockedInstallPluginSource).toHaveBeenCalledWith(
        'github:owner/repo/plugins/my-plugin',
      ),
    );
    expect(await screen.findByText('Installed New Plugin.')).toBeTruthy();
  });
});
