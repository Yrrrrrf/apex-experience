# APEX Experience · GWA application

A source implementation of the public APEX Experience website in the supplied GWA client workspace. The original example apps and workspace versions are retained. The new application lives at `apps/apex`; reusable UI, inquiry rules, account transport and state live in the existing SDK layers.

## Start

From `src/client/apps/apex`:

```sh
deno task dev
```

The existing workspace selector also discovers `apps/apex` automatically:

```sh
just run
just types
just test
just build
```

Run the full original workflow from `src/client` with `just cycle` on the normal Deno/Nushell/Just environment. It prepares, checks, tests and builds every template app. The APEX-only tasks are:

```sh
deno task sync
deno task check
deno task test
deno task build
```

`build/` is a static site containing real HTML route entrypoints plus a `200.html` fallback. There is no application server requirement for catalog or guest inquiry functionality. New application runtime requirements are Svelte 5.57.2 and SvelteKit 3.1.0. The supplied shared SDK's existing version declaration has not been rewritten. SvelteKit's Svelte plugin deduplicates runtime imports for the built application; the optional root npm bridge locks the compatible app compiler/runtime versions.

An optional root npm validation/preview bridge is included by the integration workflow for this environment; it uses the same Svelte source and shared `defineGWA` configuration. The canonical app remains a Deno workspace member, not an independent npm application.

## Your logo

Put your existing SVG at:

```text
apps/apex/static/logo.svg
```

It is referenced as `/logo.svg` by the header and favicon. The original brand artwork is intentionally not invented or replaced. Photography and exact source assets are in `static/assets`; see `ASSETS.md` for provenance.

## Source ownership

| Concern | Owner |
| --- | --- |
| Brand, destinations, experiences, prices and business copy | `apps/apex/src/lib/apex.config.ts` |
| App shell, persistent navigation context and static route entrypoints | `apps/apex/src/routes/` |
| UI views and visual interactions | `sdk/ui/src/apex/` |
| Calendar, validation, prices, inquiry text and WhatsApp URL encoding | `sdk/core/src/apex/` |
| Supabase Auth and inquiry record requests | `sdk/api/src/apex.ts` |
| Reactive session, language, motion, account history and browser drafts | `sdk/state/src/stores/apex.svelte.ts` |

The app uses the supplied `defineGWA` helper. SvelteKit 3 configuration is passed to `sveltekit({ adapter, compilerOptions })` in `vite.config.mts`, as documented by the template. No `svelte.config.js` is required.

## Functional behavior

- All six public destination routes are available. Five upcoming destinations expose inquiries for updates; they do not pretend to accept reservations.
- La Marquesa inquiries accept two to six participants, Thursday–Sunday, with at least two **calendar days in America/Mexico_City** before the outing. Published totals are USD 697.05 / 1,176.98 / 1,542.64 / 1,908.30 / 2,279.67 for groups of two through six.
- Helicopter inquiries request a date and passenger count, with no invented fixed aircraft capacity, duration, price or route. The operator must confirm those details.
- Reviewing a request produces a message and an encoded WhatsApp link. Opening the link does not send the message. No request is automatically sent by the app, and no inquiry confirms availability or a reservation.
- Optional pickup/return and celebration details are included only when supplied. A blank return defaults to the requested pickup **in the message**, without promising transport coverage.
- Local guest drafts are explicitly browser-only, capped at 30 records, and validated before restoration. They are separate from authenticated account history.
- Language and motion preference survive app navigation through the layout-owned store and reset on a fresh reload, matching the public site's stated behavior.
- No live charge is implemented. The original public site described its commercial payment flow as unavailable; this clone never fabricates a payment, a paid receipt, or confirmed availability.

## Try the example account

The account page includes a clearly labeled browser-only demonstration:

- Email: `demo@apex.example`
- Password: `ApexDemo2026!`
- Fictional persona: Alex Rivera.

Use the example-login shortcut or enter those public credentials. The dashboard includes two sample inquiries, a sample future reservation and a sample completed trip. Every sample is marked as demonstration data; no actual booking, payment or travel is implied. New valid inquiries can be saved to the example account. Sample dates are generated relative to Mexico City today and refreshed on restoration so the future/past examples remain useful.

Example registration and recovery create an on-page **local email preview**. No email is sent. The confirmation/recovery action buttons advance only the local walkthrough. Registration/recovery accept only the published synthetic email, and supplied passwords are never serialized. The password-update demonstration does not alter the public demo password. Use only example data for this walkthrough.

The example session, local inquiries and preview metadata use the dedicated `apex.demo.account.v1.apex-experience` local-storage namespace. They survive reloads; example logout clears the active session and transient previews while preserving local example history. “Reset example” restores the initial samples. Guest drafts and real Supabase tokens use independent namespaces. Choosing real-service mode is explicit and never triggers an automatic fallback to demo if authentication fails. Enabling Supabase does not import, overwrite or convert demo records.

## Connect your account backend

Guest exploration, inquiry preparation, copy and WhatsApp work without backend credentials. Live account actions require service configuration. The separate, explicitly labeled local example account below remains available without that configuration. Demo records and identity are never migrated to the live account.

1. Create or select your **own** Supabase project.
2. Apply `backend/schema.sql` in its SQL editor.
3. Enable email/password authentication and configure outgoing transactional email for production delivery.
4. Add your site origin and these paths to Auth's allowed redirect URLs:
   - `/cuenta/callback/`
   - `/cuenta/recuperar/`
5. Copy `.env.example` to `.env.local`, set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, then rebuild. Use the project's public anon/publishable key. **Never place a service-role secret in public environment variables.**
6. Verify signup/confirmation, password login, recovery/email delivery, password update, sign-out and per-user saved inquiry isolation against that project.

The transport calls the official Supabase Auth REST API and PostgREST endpoints. Email confirmation and recovery fragments are consumed on the account routes, removed from the URL, and verified by fetching the authenticated user. Authentication tokens are kept in per-tab session storage with refresh handling. Closing the tab or signing out clears this tab's persisted session; language and motion are not persisted there.

The SQL enables row-level security: authenticated users may read only their own records and insert only unconfirmed drafts. Clients receive no status-update permission and cannot confirm themselves or supply an operator quote/reference. An operator must update status through trusted administrative/server tooling. No operator admin interface was visible on the source site or reconstructed here.

## Verification scope

The core/API tests cover demo credential validation, confirmation/recovery walkthroughs, corrupted-state restoration, local namespace isolation, password non-persistence, demo record markers and date-relative samples, plus Mexico City versus UTC midnight, month/year boundaries, impossible dates, leap day, minimum notice, operating weekdays, group bounds, quote-only flight behavior, exact prices, WhatsApp encoding, and malformed stored records. Run it without the workspace import map when validating in a network-limited environment:

```sh
deno test --no-config ../../sdk/core/src/apex ../../sdk/api/src/apex.test.ts
```

Production Supabase and transactional email checks require your configured service and are not represented by passing local tests. Build success also does not prove a real tour is available: APEX must confirm the commercial proposal separately.
