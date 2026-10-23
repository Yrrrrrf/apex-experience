<script lang="ts">
import type { ApexConfig, ApexLocale } from '../../../core/src/apex/mod.ts';
import { whatsappUrl } from '../../../core/src/apex/mod.ts';
let { config, locale, items }: { config: ApexConfig; locale: ApexLocale; items: { q: string; a: string }[] } = $props();
const ui = (es:string,en:string) => locale === 'es' ? es : en;
</script>
<section id="preguntas" class="section wrap faq-section svelte-1h7e2i5">
  <div class="svelte-1h7e2i5"><p class="eyebrow">{ui('ANTES DE SALIR','BEFORE YOU GO')}</p><h2>{ui('Resolvamos tus dudas.','Let’s answer your questions.')}</h2><p class="muted svelte-1h7e2i5">{ui('Lo que necesitas saber para dar el siguiente paso.','What you need to know to take the next step.')}</p><a class="text-link" href={whatsappUrl(config,ui('Hola APEX, quisiera consultar una experiencia.','Hi APEX, I would like to inquire about an experience.'))} target="_blank" rel="noopener noreferrer">{ui('Habla con APEX','Talk to APEX')} ↗</a><div class="collaborate svelte-1h7e2i5"><p class="svelte-1h7e2i5">{ui('¿Quieres colaborar con nosotros?','Want to work with us?')}</p><span class="svelte-1h7e2i5">{ui('Guías, proveedores, marcas y creadores: cuéntanos tu propuesta.','Guides, suppliers, brands and creators: tell us about your proposal.')}</span><a class="text-link" href="#contacto">{ui('Ver contacto','See contact details')} ↓</a></div></div>
  <div class="questions svelte-1h7e2i5">{#each items as item,i}<details name="apex-faq" class="brand-panel ambient-card svelte-1h7e2i5"><summary class="svelte-1h7e2i5"><span class="number svelte-1h7e2i5">{String(i+1).padStart(2,'0')}</span><span>{item.q}</span><span class="plus svelte-1h7e2i5">+</span></summary><p class="svelte-1h7e2i5">{item.a}</p></details>{/each}</div>
</section>
