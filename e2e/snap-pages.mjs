// Take screenshots of a list of paths on a given base URL.
// Usage: node snap-pages.mjs <baseUrl> <outDir>
import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const [, , baseUrl, outDir] = process.argv;
if (!baseUrl || !outDir) {
  console.error('usage: snap-pages.mjs <baseUrl> <outDir>');
  process.exit(2);
}

fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: '01-home', path: '/' },
  { name: '02-projects', path: '/projects' },
  { name: '03-integrations', path: '/integrations' },
  { name: '04-automations', path: '/automations' },
  { name: '05-design-systems', path: '/design-systems' },
  { name: '06-plugins', path: '/plugins' },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

// Mark privacy + onboarding done so the modal/welcome doesn't blank-cover
// the screenshot. The web reads these from localStorage on boot.
await ctx.addInitScript(() => {
  try {
    window.localStorage.setItem(
      'open-design:config',
      JSON.stringify({
        mode: 'daemon',
        apiKey: '',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-sonnet-4-5',
        agentId: 'mock',
        skillId: null,
        designSystemId: null,
        onboardingCompleted: true,
        privacyDecisionAt: Date.now(),
        agentModels: {},
      }),
    );
  } catch {
    /* ignore */
  }
});

const page = await ctx.newPage();

for (const spec of pages) {
  const url = `${baseUrl.replace(/\/$/, '')}${spec.path}`;
  try {
    console.log(`-> ${url}`);
    // Use domcontentloaded — Next.js dev keeps HMR sockets open so
    // 'networkidle' never resolves.
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Settle for skeletons / late effects.
    await page.waitForTimeout(3500);
    const out = path.join(outDir, `${spec.name}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`   ok -> ${out}`);
  } catch (err) {
    console.log(`   FAIL ${spec.name}: ${err?.message ?? err}`);
  }
}

// Settings dialog — open via cmd+, then screenshot.
try {
  console.log('-> settings dialog');
  await page.goto(`${baseUrl.replace(/\/$/, '')}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.keyboard.press(
    process.platform === 'darwin' ? 'Meta+Comma' : 'Control+Comma',
  );
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(outDir, '07-settings-dialog.png'),
    fullPage: false,
  });
  console.log('   ok -> 07-settings-dialog.png');
} catch (err) {
  console.log(`   FAIL settings dialog: ${err?.message ?? err}`);
}

await browser.close();
