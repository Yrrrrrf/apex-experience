<script lang="ts">
 import './layout.css';
 import { onMount, setContext, type Snippet } from 'svelte';
 import { createApexStore } from '../../../../sdk/state/src/stores/apex.svelte.ts';
 import { apexConfig } from '../lib/apex.config.ts';
 let { children }: { children: Snippet } = $props();
 const store = createApexStore(apexConfig);
 setContext('apex.store', store);
 onMount(() => { void store.initialize(); });
</script>
{@render children()}
