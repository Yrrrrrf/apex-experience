# Single Page Applications (SPA) on GitHub Pages

A comprehensive guide and reference for deploying modern client-side and hybrid Single Page Applications (specifically with **SvelteKit**, **Vite**, and static adapters) to **GitHub Pages**.

---

## 📌 1. The Core Architecture: Project Pages vs. Domain Root

When deploying to GitHub Pages, there are two distinct hosting modes:

| Mode | URL Structure | Example | Behavior |
| :--- | :--- | :--- | :--- |
| **User / Org Site** | `https://<user>.github.io/` | `https://yrrrrrf.github.io/` | Hosted at domain root |
| **Project Repository** | `https://<user>.github.io/<repo>/` | `https://yrrrrrf.github.io/apex-experience/` | Hosted at a **subpath** |

### The "Leading Slash" Trap
In standard web browsers, any URL or attribute starting with a single forward slash `/` is resolved relative to the **domain host**, not the repository subpath:

```html
<!-- ❌ WRONG on Project Pages -->
<!-- The browser navigates to https://yrrrrrf.github.io/reservar/ (404 Not Found) -->
<a href="/reservar/">Book Now</a>

<!-- ❌ WRONG for Assets -->
<!-- The browser requests https://yrrrrrf.github.io/assets/hero.webp (404 Not Found) -->
<img src="/assets/hero.webp" alt="Hero" />
```

To work correctly under a project subpath, every internal link and asset must either:
1. Be prefixed with the application's base path: `/apex-experience/reservar/`
2. Or use relative paths carefully calculated against the current URL depth: `../reservar/`

---

## ⚙️ 2. SvelteKit & Vite Configuration

In SvelteKit 3, configuration is passed directly into the `sveltekit()` plugin in `vite.config.mts`:

```typescript
// apps/apex/vite.config.mts
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Automatically support both local development ('') and GitHub Pages ('/apex-experience')
const base = process.env.BASE_PATH ?? '/apex-experience';

export default defineConfig({
  plugins: [
    sveltekit({
      paths: {
        base,
      },
      prerender: {
        crawl: false,
      },
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html', // Required for GitHub Pages SPA routing
        strict: true,
      }),
      compilerOptions: {
        runes: true,
      },
    }),
  ],
});
```

### Why `fallback: '404.html'` is Critical
1. On a standard web server with SPA support (e.g. Nginx, Netlify, Vercel), rewrites redirect all unmatched requests to `index.html` or `200.html`.
2. **GitHub Pages does not support custom rewrite rules.** Instead, when a visitor accesses a non-existent static route (like refreshing `https://yrrrrrf.github.io/apex-experience/destinos/cdmx/`), GitHub Pages natively looks for a **`404.html`** file in the root of the published branch.
3. Setting `fallback: '404.html'` causes `@sveltejs/adapter-static` to generate a `404.html` that contains the complete SPA bootstrapper.
4. When GitHub Pages serves this `404.html`, the browser runs SvelteKit's client-side runtime, reads `window.location.pathname`, and instantly rehydrates the correct page for the user!

---

## 🚫 3. The Jekyll Gotcha (`.nojekyll`)

By default, GitHub Pages runs all published branches through **Jekyll**, a static site generator.

### The Problem
Jekyll automatically ignores any directory that starts with an underscore (`_`). SvelteKit outputs its entire client bundle and assets into:
```text
build/_app/immutable/...
```
If Jekyll runs, it will **silently delete or skip `_app/`**, resulting in fatal 404 errors for all CSS and JavaScript bundles.

### The Fix
Place an empty `.nojekyll` file at the root of the published branch. You can ensure it is always copied into `build/` on every build by putting it in your static folder:
```bash
touch apps/apex/static/.nojekyll
```
When `adapter-static` builds the project, it automatically mirrors `static/.nojekyll` into `build/.nojekyll`.

---

## 🖼️ 4. Handling Assets & Media

### A. In HTML Entrypoints (`app.html`)
Use SvelteKit's `%sveltekit.assets%` template tag for head links, icons, and fonts:
```html
<!-- src/app.html -->
<head>
  <!-- Expands to /apex-experience/logo.svg on GH Pages, or /logo.svg locally -->
  <link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/logo.svg" />
  %sveltekit.head%
</head>
```

### B. In Configuration / State / Code
In SvelteKit 3, import the built-in `asset` helper from `$app/paths`:
```typescript
import { asset } from '$app/paths';

export const config = {
  brand: {
    logo: asset('/logo.svg'),                  // -> '/apex-experience/logo.svg'
    background: asset('/assets/forest.webp'), // -> '/apex-experience/assets/forest.webp'
  },
};
```

---

## 🧭 5. The Universal Resolver Pattern for Shared SDKs

When components live in a reusable shared SDK (e.g., `sdk/ui/src/apex/`), they should **not** import directly from `$app/paths` because:
- The SDK may be used by different applications (CLI, desktop, tests, non-SvelteKit harnesses).
- Unit tests run under raw `deno test` or `vitest` without a mock SvelteKit environment.

### The Solution: Context + Fallback Resolver Hook

Create a resolver utility (`sdk/ui/src/apex/url.ts`):

```typescript
// sdk/ui/src/apex/url.ts
import { getContext } from 'svelte';

export function useResolver(explicitBase?: string) {
  let contextResolve: ((target: string) => string) | undefined;
  let contextBase: string | (() => string) | undefined;

  try {
    contextResolve = getContext<(target: string) => string>('apex.resolve');
    contextBase = getContext<string | (() => string) | undefined>('apex.base');
  } catch {
    // Graceful fallback if called outside Svelte context
  }

  return function resolve(target: string): string {
    // 1. If parent provided a resolve function, prefer it
    if (contextResolve && !explicitBase) {
      return contextResolve(target);
    }

    // 2. Leave external protocols untouched
    if (
      !target ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('//')
    ) {
      return target;
    }

    // 3. Determine active base (prop -> context -> browser detection)
    const resolvedContextBase = typeof contextBase === 'function' ? contextBase() : contextBase;
    let base = (explicitBase ?? resolvedContextBase ?? '').replace(/\/+$/, '');

    // 4. In browser, auto-detect GitHub Pages subpath if not set
    if (!base && typeof location !== 'undefined' && location.pathname.startsWith('/apex-experience')) {
      base = '/apex-experience';
    }

    // 5. Handle hash anchors
    if (target.startsWith('#')) {
      return `${base}/${target}`;
    }

    const cleanTarget = target.startsWith('/') ? target : `/${target}`;
    return `${base}${cleanTarget}`;
  };
}
```

### Usage in Components
```svelte
<script lang="ts">
  import { useResolver } from './url.ts';
  const resolve = useResolver();
</script>

<!-- All these links automatically adapt to GitHub Pages subpath or local dev! -->
<a href={resolve('/')}>Inicio</a>
<a href={resolve('/#experiencias')}>Ver Colección</a>
<a href={resolve('/destinos/cdmx/')}>CDMX</a>
<a href={resolve('/reservar/')}>Reservar</a>
<a href={resolve('/cuenta/')}>Mi Cuenta</a>
```

---

## 🚀 6. Deployment Workflow (gh-pages Branch)

To keep the `main` branch dedicated to pure source code, deploy static build artifacts (`apps/apex/build`) to an isolated `gh-pages` branch.

### Automated Script Example
```bash
#!/usr/bin/env bash
set -e

# 1. Build the production app
cd apps/apex
deno task build
cd ../..

# 2. Deploy only the build output to gh-pages branch
TEMP_DIR=$(mktemp -d)
cp -r apps/apex/build/. "$TEMP_DIR/"

cd "$TEMP_DIR"
git init
git checkout -b gh-pages
git add -A
git commit -m "deploy: static build to GitHub Pages"
git remote add origin git@github.com:Yrrrrrf/apex-experience.git
git push -f origin gh-pages

# Clean up
rm -rf "$TEMP_DIR"
```

---

## 📋 7. Production Verification Checklist

Before publishing, verify these items:

- [x] **Base Path**: `paths: { base: '/<repo-name>' }` is passed to SvelteKit / Vite.
- [x] **SPA Fallback**: Static adapter generates `404.html`.
- [x] **Jekyll Disabled**: `.nojekyll` exists in root of published branch.
- [x] **No Leading-Slash Hrefs**: All `<a>` tags use `resolve('/path')`.
- [x] **Asset Paths**: All images and fonts use `asset('/assets/...')` or `%sveltekit.assets%`.
- [x] **Direct Link Test**: Refreshing a sub-route (`/destinos/cdmx/`) returns `HTTP 200` without redirect loops.
- [x] **Asset Header Test**: `curl -sI https://<user>.github.io/<repo>/_app/...` returns `HTTP/2 200`.
