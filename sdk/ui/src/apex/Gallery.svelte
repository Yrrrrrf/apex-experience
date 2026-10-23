<script lang="ts">
import { onMount } from 'svelte';
import type { ApexLocale } from '../../../core/src/apex/mod.ts';
let { images, title, locale, conceptual = false, reducedMotion = false }: { images: string[]; title: string; locale: ApexLocale; conceptual?: boolean; reducedMotion?: boolean } = $props();
let current = $state(0);
let paused = $state(false);
let viewer: HTMLDialogElement;
const ui=(es:string,en:string)=>locale==='es'?es:en;
const position=(i:number)=>{let p=(i-current+images.length)%images.length;if(p>images.length/2)p-=images.length;return p;};
function step(delta:number) { current=(current+delta+images.length)%images.length; paused=true; }
function openImage() { viewer.showModal(); }
onMount(()=>{const timer=setInterval(()=>{if(!paused&&!reducedMotion&&images.length>1)current=(current+1)%images.length;},7000);return()=>clearInterval(timer);});
</script>
<section class="tour-carousel svelte-ma31y4 compact" aria-label={`${ui('Fotografías de','Photographs of')} ${title}`}>
  <div class="carousel-heading svelte-ma31y4"><span>{title.toUpperCase()} / APEX</span></div>
  <div class="card-stage svelte-ma31y4 apex-gallery-stage">
    {#each images as image,i}
    <button class="photo-card svelte-ma31y4" data-position={position(i)} tabindex={Math.abs(position(i))>1?-1:0} onclick={()=>{if(i===current)openImage();else{current=i;paused=true;}}} aria-label={`${ui('Ampliar fotografía','Enlarge photograph')} ${i+1}: ${title}`}>
      <img class="svelte-ma31y4" src={image} alt={`${title} · ${i+1}${conceptual?ui(' · Imagen conceptual generada con IA',' · AI-generated conceptual image'):''}`} loading="lazy"/>
      {#if conceptual}<span class="soon-badge svelte-ma31y4">{ui('PRÓXIMAMENTE','COMING SOON')}</span>{/if}<span class="photo-count svelte-ma31y4">{String(i+1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}</span><span class="card-caption svelte-ma31y4"><small class="svelte-ma31y4">{title.toUpperCase()}</small><strong class="svelte-ma31y4">{title}</strong></span>
    </button>{/each}
  </div>
  <div class="carousel-controls svelte-ma31y4"><button class="arrow svelte-ma31y4" aria-label={ui(`Fotografía anterior de ${title}`,`Previous photograph of ${title}`)} onclick={()=>step(-1)}>←</button><div class="dots svelte-ma31y4">{#each images as _,i}<button class="svelte-ma31y4" class:active={i===current} aria-label={ui(`Ver fotografía ${i+1}`,`View photograph ${i+1}`)} aria-pressed={i===current} onclick={()=>{current=i;paused=true;}}><span></span></button>{/each}</div><button class="arrow svelte-ma31y4" aria-label={ui(`Siguiente fotografía de ${title}`,`Next photograph of ${title}`)} onclick={()=>step(1)}>→</button></div>
  <div class="carousel-bottom svelte-ma31y4"><span>{String(current+1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}</span><button class="svelte-10atlgt" aria-pressed={paused||reducedMotion} onclick={()=>paused=!paused}>{paused||reducedMotion?ui('▷ Reanudar','▷ Resume'):ui('Ⅱ Pausar','Ⅱ Pause')}</button></div>
</section>
<dialog bind:this={viewer} class="apex-lightbox" onkeydown={(event)=>{if(event.key==='ArrowLeft')step(-1);if(event.key==='ArrowRight')step(1);}} aria-label={ui(`Galería de ${title}`,`${title} gallery`)}>
  <button class="apex-lightbox-close" onclick={()=>viewer.close()} aria-label={ui('Cerrar galería','Close gallery')}>×</button><img src={images[current]} alt={`${title} · ${current+1}`}/><div class="apex-lightbox-controls"><button onclick={()=>step(-1)} aria-label={ui('Fotografía anterior','Previous photograph')}>←</button><p>{title} · {current+1} / {images.length}</p><button onclick={()=>step(1)} aria-label={ui('Siguiente fotografía','Next photograph')}>→</button></div>
</dialog>
