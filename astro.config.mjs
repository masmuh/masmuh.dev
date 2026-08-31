// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://masmuh.web.id';

export default defineConfig({
    site: SITE_URL,
    integrations: [sitemap()],
    vite: {
        plugins: [tailwindcss()],
    },
});