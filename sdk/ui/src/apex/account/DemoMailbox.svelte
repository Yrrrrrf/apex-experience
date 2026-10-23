<script lang="ts">
import type { ApexLocale } from '../../../../core/src/apex/mod.ts';
import type { ApexStore } from '../../../../state/src/stores/apex.svelte.ts';
let { store, locale }: { store: ApexStore; locale: ApexLocale } = $props();
const ui = (es: string, en: string) => locale === 'es' ? es : en;
</script>
{#if store.demoOutbox.length}
<section class="account-mailbox" aria-labelledby="demo-mailbox-title">
 <div class="account-mailbox-heading"><span class="account-mail-icon" aria-hidden="true">↗</span><div><p class="account-kicker">{ui('BUZÓN DE EJEMPLO', 'EXAMPLE INBOX')}</p><h3 id="demo-mailbox-title">{ui('Tu correo, aquí mismo.', 'Your email, right here.')}</h3></div><span class="account-demo-chip">{ui('Vista local', 'Local preview')}</span></div>
 <p class="account-mailbox-note">{ui('Esta es una vista previa dentro de la demostración. No se envió ningún correo.', 'This is an in-demo preview. No email was sent.')}</p>
 {#each [...store.demoOutbox].reverse() as mail}
  <article class="account-email" class:consumed={mail.consumed}>
   <div class="account-email-meta"><span>{ui('Para', 'To')}: <strong>{mail.to}</strong></span><span>{ui('Ejemplo', 'Example')}</span></div>
   <h4>{mail.subject[locale]}</h4><p>{mail.body[locale]}</p>
   {#if mail.consumed}<span class="account-email-done">✓ {ui('Recorrido completado', 'Step completed')}</span>
   {:else if mail.kind === 'confirmation'}<button class="button" type="button" disabled={store.busy} onclick={() => store.confirmDemoAccount(mail.id)}>{ui('Confirmar cuenta de ejemplo', 'Confirm example account')} ↗</button>
   {:else}<button class="button" type="button" disabled={store.busy} onclick={() => store.openDemoRecovery(mail.id)}>{ui('Abrir recuperación de ejemplo', 'Open example recovery')} ↗</button>{/if}
  </article>
 {/each}
</section>
{/if}
