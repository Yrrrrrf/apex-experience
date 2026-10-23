import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineGWA, type PluginOption } from '../../config/app.config.ts';

const base = process.env.BASE_PATH ?? '/apex-experience';

export default defineGWA({
 plugins: [sveltekit({
  paths: { base },
  prerender: { crawl: false },
  adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', strict: true }),
  compilerOptions: { runes: true }
 }) as PluginOption],
 overrides: { server: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: ['terminal.local'] } },
});
