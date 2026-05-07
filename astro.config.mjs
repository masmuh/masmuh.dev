// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://masmuh.web.id';

export default defineConfig({
    site: SITE_URL,
    integrations: [sitemap()],
});