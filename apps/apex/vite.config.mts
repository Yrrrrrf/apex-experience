import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineGWA, type PluginOption } from '../../config/app.config.ts';

export default defineGWA({
 plugins: [sveltekit({ prerender: { crawl: false }, adapter: adapter({ pages: 'build', assets: 'build', fallback: '200.html', strict: true }), compilerOptions: { runes: true } }) as PluginOption],
 overrides: { server: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: ['terminal.local'] } },
});
