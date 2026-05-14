import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.OD_LANDING_SITE ?? 'https://open-design.ai';

export default defineConfig({
  output: 'static',
  site,
  srcDir: './app',
  outDir: './out',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
