# APEX Experience

> Private adventures, destinations, and luxury experiences on GWA.

🌐 **Live Demo (GitHub Pages)**: [https://yrrrrrf.github.io/apex-experience/](https://yrrrrrf.github.io/apex-experience/)

---

## 🧭 About

APEX Experience is a full-stack client application built with Svelte 5 and SvelteKit static adapter, featuring:
- Destination showcases (CDMX, Quintana Roo, Oaxaca, Jalisco, Hidalgo, Baja California)
- Curated luxury adventure experiences (e.g., helicopter flights, hiking & horse trails)
- Booking inquiry & reservation flows
- Responsive design tailored for web and mobile

## 🚀 Quick Start

### Prerequisites
- [Deno](https://deno.com/) 2.x+
- [Just](https://github.com/casey/just) command runner (optional)

### Development

```bash
# Enter the apex app directory
cd apps/apex

# Start dev server
deno task dev
```

### Build

```bash
# Build static site export
cd apps/apex
deno task build
```

The output will be generated in `apps/apex/build/`.

## 📁 Project Structure

```text
├── apps/
│   ├── apex/          # APEX Experience SvelteKit application
│   └── minimal/       # Minimal starter template
├── config/            # Shared app, linting, and build configs
├── sdk/               # Shared SDK (UI components, state, core, api)
├── scripts/           # Automation scripts (Just / Nushell)
└── native/            # CLI utilities
```

## 📄 License

MIT
