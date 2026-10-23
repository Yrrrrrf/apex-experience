<script lang="ts">
import { getContext, onMount } from 'svelte';
import type { ApexConfig, ApexLocale } from '../../../core/src/apex/mod.ts';
import { whatsappUrl } from '../../../core/src/apex/mod.ts';
import { createApexStore } from '../../../state/src/stores/apex.svelte.ts';
import Home from './Home.svelte';
import Destination from './Destination.svelte';
import Experience from './Experience.svelte';
import Booking from './Booking.svelte';
import Account from './Account.svelte';
import Privacy from './Privacy.svelte';

let { config, path = '/' }: { config: ApexConfig; path?: string } = $props();
const store = getContext<ReturnType<typeof createApexStore>>('apex.store');
let menuOpen = $state(false);
let experiencesOpen = $state(false);
let logoFailed = $state(false);
let locale = $derived(store.locale);
let route = $derived(path.replace(/\/+$/, '') || '/');
let destination = $derived(config.destinations.find(item => route === `/destinos/${item.id}`));
let experience = $derived(config.experiences.find(item => item.status !== 'coming-soon' && route === `/experiencias/${item.id}`));
let genericMessage = $derived(locale === 'es' ? 'Hola APEX, quisiera consultar una experiencia.' : 'Hi APEX, I would like to inquire about an experience.');
let contactUrl = $derived(whatsappUrl(config, genericMessage));
let title = $derived(destination ? `${destination.name} · Destinos · ${config.brand.name}` : experience ? `${experience.title[locale]} · ${config.brand.name}` : route.startsWith('/cuenta') ? `${locale === 'es' ? 'Mi cuenta' : 'My account'} · ${config.brand.name}` : route === '/reservar' ? `La Marquesa · ${config.brand.name}` : route === '/privacidad' ? `${locale === 'es' ? 'Aviso de privacidad' : 'Privacy notice'} · ${config.brand.name}` : `${config.brand.name} · ${config.brand.tagline[locale]}`);
const ui = (es: string, en: string) => locale === 'es' ? es : en;
function closeMenus() { menuOpen = false; experiencesOpen = false; }
onMount(() => { void store.initialize(); });
$effect(() => { if (typeof document !== 'undefined') { document.documentElement.lang = locale; document.documentElement.dataset.motion = store.reducedMotion ? 'reduce' : 'full'; } });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={config.brand.tagline[locale]} />
  <meta name="theme-color" content="#0b0d0d" />
  <link rel="icon" href={config.brand.logo} type="image/svg+xml" />
</svelte:head>
<svelte:window onkeydown={(event) => { if (event.key === 'Escape') closeMenus(); }} />

<div class="app-root apex-site" class:reduced-motion={store.reducedMotion}>
  <div class="forest-background svelte-1xe4ed3 ambient paused" class:destination-landscape={!!destination} aria-hidden="true">
    <img class="svelte-1xe4ed3" src={destination?.image ?? config.brand.background} alt="" />
    <div class="forest-light svelte-1xe4ed3"></div>
  </div>
  <a class="skip" href="#principal">{ui('Saltar al contenido', 'Skip to content')}</a>
  <header class="svelte-cxitux">
    <div class="wrap header-inner svelte-cxitux">
      <a href="/" class="brand" aria-label={config.brand.name} onclick={closeMenus}>
        {#if !logoFailed}<img class="brand-logo" src={config.brand.logo} alt={config.brand.name} width="2048" height="683" onerror={() => logoFailed = true} />
        {:else}<span class="apex-logo-fallback"><span>APEX</span><small>EXPERIENCE</small></span>{/if}
      </a>
      <nav id="main-nav" class="svelte-cxitux" class:open={menuOpen} aria-label={ui('Navegación principal', 'Main navigation')}>
        <a class="svelte-cxitux" href="/#inicio" onclick={closeMenus}>{ui('Inicio', 'Home')}</a>
        <a class="svelte-cxitux" href="/#nosotros" onclick={closeMenus}>{ui('Nosotros', 'About Us')}</a>
        <div class="experiences-nav svelte-cxitux">
          <button class="experiences-toggle svelte-cxitux" aria-expanded={experiencesOpen} aria-controls="experience-links" onclick={() => experiencesOpen = !experiencesOpen}>{ui('Experiencias', 'Experiences')} <span>⌄</span></button>
          {#if experiencesOpen}<div id="experience-links" class="experience-links svelte-cxitux">
            <a href="/destinos/cdmx/" onclick={closeMenus}>{ui('CDMX y alrededores', 'CDMX & surroundings')}</a>
            <a href="/#rutas-privadas" onclick={closeMenus}>{ui('Rutas Privadas', 'Private Routes')}</a>
            <a href="/#experiencias" onclick={closeMenus}>{ui('Ver colección', 'View collection')}</a>
          </div>{/if}
        </div>
        <a class="svelte-cxitux" href="/#corporativo" onclick={closeMenus}>{ui('Corporativo & Grupos', 'Corporate & Groups')}</a>
        <a class="svelte-cxitux" href="/#contacto" onclick={closeMenus}>{ui('Contacto', 'Contact')}</a>
      </nav>
      <div class="tools svelte-cxitux">
        <a class="account-action svelte-cxitux" href="/cuenta/">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
          <span class="account-copy svelte-cxitux"><span class="account-label svelte-cxitux">{store.user ? ui('Mi cuenta', 'My account') : ui('Iniciar sesión', 'Sign in')}</span>{#if store.user&&store.isDemo}<span class="account-nav-example">{ui('Ejemplo','Example')}</span>{/if}</span>
        </a>
        <button class="language svelte-cxitux" aria-label={ui('Change language to English', 'Cambiar idioma a español')} onclick={() => store.setLocale(locale === 'es' ? 'en' : 'es')}><span class="flag svelte-cxitux" aria-hidden="true">{locale === 'es' ? '🇲🇽' : '🇺🇸'}</span> {locale.toUpperCase()} <span>⌄</span></button>
        <button class="menu-toggle svelte-cxitux" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={ui('Abrir o cerrar menú', 'Open or close menu')} onclick={() => menuOpen = !menuOpen}><span></span><span></span></button>
      </div>
    </div>
  </header>

  <main id="principal">
    {#if route === '/'}
      <Home {config} {locale} reducedMotion={store.reducedMotion} />
    {:else if destination}
      <Destination {config} {destination} {locale} reducedMotion={store.reducedMotion} />
    {:else if experience}
      <Experience {config} {experience} {locale} {store} />
    {:else if route === '/reservar'}
      <div class="wrap inquiry-heading svelte-ju4fvf">
        <a class="back-link" href="/experiencias/la-marquesa/">← {ui('Ver experiencia: La Marquesa', 'View experience: La Marquesa')}</a>
        <p class="eyebrow">APEX / LA MARQUESA</p>
        <h1 class="svelte-ju4fvf">{ui('Consulta tu próxima salida.', 'Inquire about your next outing.')}</h1>
        <p class="muted">{ui('Prepara tu consulta y envíala por WhatsApp. APEX revisará disponibilidad, logística y condiciones antes de confirmar. No hay cobros en esta página.', 'Prepare your inquiry and send it through WhatsApp. APEX will review availability, logistics and terms before confirming. This page does not process payments.')}</p>
      </div>
      <Booking {config} {locale} {store} experienceId="la-marquesa" compact />
    {:else if route.startsWith('/cuenta')}
      <Account {config} {locale} {store} {route} />
    {:else if route === '/privacidad'}
      <Privacy {config} {locale} />
    {:else}
      <section class="section wrap not-found"><p class="eyebrow">APEX / 404</p><h1>{ui('El camino empieza aquí.', 'The journey starts here.')}</h1><p>{ui('Esta página no forma parte de la colección.', 'This page is not part of the collection.')}</p><a class="button" href="/">{ui('Explorar destinos', 'Explore destinations')} ↗</a></section>
    {/if}
  </main>

  <footer id="contacto" class="svelte-1gj46xj">
    <div class="wrap">
      {#if route !== '/reservar'}<div class="footer-top brand-panel ambient-card svelte-1gj46xj"><div><p class="eyebrow">{ui('NOS VEMOS AFUERA', 'SEE YOU OUTSIDE')}</p><h2 class="svelte-1gj46xj">{ui('Haz espacio para la aventura.', 'Make room for adventure.')}</h2></div><a class="button svelte-1gj46xj" href={contactUrl} target="_blank" rel="noopener noreferrer">{ui('Hablemos por WhatsApp', 'Let’s chat on WhatsApp')} ↗</a></div>{/if}
      <div class="footer-grid svelte-1gj46xj">
        <div class="svelte-1gj46xj"><a href="/" class="brand" aria-label={config.brand.name}>{#if !logoFailed}<img class="brand-logo" src={config.brand.logo} alt={config.brand.name} width="2048" height="683" onerror={() => logoFailed = true} />{:else}<span class="apex-logo-fallback"><span>APEX</span><small>EXPERIENCE</small></span>{/if}</a><p class="svelte-1gj46xj">{config.copy.footer?.[locale] ?? config.brand.tagline[locale]}</p></div>
        <div class="svelte-1gj46xj"><h3 class="svelte-1gj46xj">{ui('EXPLORA', 'EXPLORE')}</h3><a class="svelte-1gj46xj" href="/#nosotros">{ui('Nosotros', 'About us')}</a><a class="svelte-1gj46xj" href="/#experiencias">{ui('Experiencias', 'Experiences')}</a><a class="svelte-1gj46xj" href="/#corporativo">{ui('Corporativo & Grupos', 'Corporate & Groups')}</a><a class="svelte-1gj46xj" href="/reservar/">{ui('Consultar disponibilidad', 'Check availability')}</a><a class="svelte-1gj46xj" href="/privacidad/">{ui('Política de privacidad', 'Privacy policy')}</a></div>
        <div class="svelte-1gj46xj"><h3 class="svelte-1gj46xj">{ui('CONECTA', 'CONNECT')}</h3><a class="svelte-1gj46xj" href={contactUrl} target="_blank" rel="noopener noreferrer">{config.contact.phone}</a><a class="svelte-1gj46xj" href={config.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a class="svelte-1gj46xj" href={config.contact.mapUrl} target="_blank" rel="noopener noreferrer">{ui('Ubicación de contacto', 'Contact location')} ↗</a></div>
        <div class="svelte-1gj46xj"><h3 class="svelte-1gj46xj">{ui('ENCUÉNTRANOS', 'FIND US')}</h3><p class="svelte-1gj46xj">{config.contact.address}</p><small class="svelte-1gj46xj">{ui('El punto de encuentro del tour se confirma al reservar.', 'The tour meeting point is confirmed when booking.')}</small></div>
      </div>
      {#if route !== '/reservar'}<section id="ubicacion" class="business-map svelte-j1luzk" aria-labelledby="map-title"><div class="map-information brand-panel ambient-card svelte-j1luzk"><p class="eyebrow svelte-j1luzk">{ui('ENCUÉNTRANOS', 'FIND US')}</p><h2 id="map-title" class="svelte-j1luzk">{ui('Aquí está APEX.', 'Find APEX here.')}</h2><address class="svelte-j1luzk">{config.contact.address}</address><p class="map-note svelte-j1luzk">{ui('Mapa de referencia de la calle Bernardo Vara. El punto de encuentro de tu tour se confirma al reservar.', 'Reference map of Bernardo Vara street. Your tour meeting point is confirmed when booking.')}</p><a class="button svelte-j1luzk" href={config.contact.mapUrl} target="_blank" rel="noopener noreferrer">{ui('Abrir en Google Maps', 'Open in Google Maps')} ↗</a><small class="svelte-j1luzk">{ui('Mapa proporcionado por Google.', 'Map provided by Google.')} <a class="svelte-j1luzk" href="/privacidad/">{ui('Privacidad', 'Privacy')}</a></small></div><iframe class="map-frame svelte-j1luzk" src={config.contact.mapEmbed} title={ui('Mapa de la ubicación de APEX en Bernardo Vara, Pilares', 'Map of the APEX contact location in Bernardo Vara, Pilares')} loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></section>{/if}
      <div class="footer-bottom svelte-1gj46xj"><span class="svelte-1gj46xj">© {new Date().getFullYear()} {config.brand.name}</span><span class="svelte-1gj46xj">{ui('Hecho para vivirlo.', 'Made to be experienced.')}</span><button class="svelte-1gj46xj" aria-pressed={store.reducedMotion} onclick={() => store.toggleMotion()}>{ui('Reducir movimiento', 'Reduce motion')}: {store.reducedMotion ? '✓' : '—'}</button></div>
    </div>
  </footer>
  {#if route !== '/reservar'}<aside class="contact-sidebar svelte-dapr64" aria-label={ui('Contacto rápido', 'Quick contact')}><a class="whatsapp-float svelte-dapr64" href={contactUrl} target="_blank" rel="noopener noreferrer" aria-label={ui('Hablar con APEX por WhatsApp (abre una pestaña nueva)', 'Chat with APEX on WhatsApp (opens a new tab)')}><svg viewBox="0 0 32 32" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M27 15.3a11 11 0 0 1-16.8 9.4L4 27l2.2-6.5A11 11 0 1 1 27 15.3Z"/><path d="M12 9c-2 1-2.4 3.4-.5 6.1 2.1 3 4.4 4.8 7 5.2 1.7.3 3-1.2 3.3-2.1l-3.5-1.8-1.3 1c-2-.9-3.3-2.2-4.1-4l.9-1.5L12 9Z"/></svg><span class="svelte-dapr64">WhatsApp</span></a></aside>{/if}
</div>
