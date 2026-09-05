<script lang="ts">
  import type { Snippet } from 'svelte';
  import PixelText from './PixelText.svelte';

  let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<h2>
  <PixelText text={title} />
  {@render children?.()}
</h2>

<style>
  h2 {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 0 0 8px;
    color: var(--accent);
  }
</style>
