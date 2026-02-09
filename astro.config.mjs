import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/site.config';
export default defineConfig({
  site: siteConfig.url,
  integrations: [tailwind(), react(), sitemap()],
});
