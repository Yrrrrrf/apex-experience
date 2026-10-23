<script lang="ts">
 import { resolve } from '$app/paths';
 import { page } from '$app/state';
 import ApexSite from '../../../../../sdk/ui/src/apex/ApexSite.svelte';
 import { apexConfig } from '../../lib/apex.config.ts';
 const base = resolve('/').replace(/\/+$/, '');
 const path = $derived(`/${page.params.path ?? ''}/`);
</script>
<ApexSite config={apexConfig} {path} {base} />
