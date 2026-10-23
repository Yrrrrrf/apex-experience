<script lang="ts">
 import { resolve } from '$app/paths';
 import ApexSite from '../../../../sdk/ui/src/apex/ApexSite.svelte';
 import { apexConfig } from '../lib/apex.config.ts';
 const base = resolve('/').replace(/\/+$/, '');
</script>
<ApexSite config={apexConfig} path="/" {base} />
