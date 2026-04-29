// @ts-check
import { defineConfig } from 'astro/config';

// Define site URL only in production to avoid issues during local development
const SITE_URL = 'https://masmuh.web.id';
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
    site: isDev ? undefined : SITE_URL,
    integrations: [],
});
