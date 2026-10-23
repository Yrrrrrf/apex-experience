import { defineEnvVars } from '@sveltejs/kit/env';

/** Optional public service configuration, statically embedded in the SPA build. */
export const variables = defineEnvVars({
 PUBLIC_SUPABASE_URL: {
  public: true, static: true,
  description: 'Your own Supabase project URL; leave empty to keep guest mode only.',
  schema: (value) => {
   if (!value) return '';
   const url = new URL(value);
   if (!['https:', 'http:'].includes(url.protocol)) throw new Error('PUBLIC_SUPABASE_URL must be an HTTP(S) URL.');
   return url.href.replace(/\/+$/, '');
  },
 },
 PUBLIC_SUPABASE_ANON_KEY: {
  public: true, static: true,
  description: 'Public anon/publishable key only. Never a service-role secret.',
  schema: (value) => value ?? '',
 },
});
