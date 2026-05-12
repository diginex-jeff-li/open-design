// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { InstalledPluginRecord } from '@open-design/contracts';
import { HomeHero } from '../../src/components/HomeHero';

function makePlugin(id: string, title: string): InstalledPluginRecord {
  return {
    id,
    title,
    version: '1.0.0',
    sourceKind: 'bundled',
    source: '/tmp',
    trust: 'bundled',
    capabilitiesGranted: ['prompt:inject'],
    manifest: {
      name: id,
      version: '1.0.0',
      title,
      description: 'A plugin fixture',
      tags: ['fixture'],
    },
    fsPath: '/tmp',
    installedAt: 0,
    updatedAt: 0,
  };
}

afterEach(() => {
  cleanup();
});

describe('HomeHero plugin picker', () => {
  it('opens plugin search from an @ token and returns the prompt without that token', () => {
    const onPromptChange = vi.fn();
    const onPickPlugin = vi.fn();
    render(
      <HomeHero
        prompt="Make @sam"
        onPromptChange={onPromptChange}
        onSubmit={() => undefined}
        activePluginTitle={null}
        onClearActivePlugin={() => undefined}
        pluginOptions={[makePlugin('sample-plugin', 'Sample Plugin')]}
        pluginsLoading={false}
        pendingPluginId={null}
        onPickPlugin={onPickPlugin}
        contextItemCount={0}
        error={null}
      />,
    );

    expect(screen.getByTestId('home-hero-plugin-picker')).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('option', { name: /sample plugin/i }));

    expect(onPickPlugin).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'sample-plugin' }),
      'Make',
    );
  });
});
