<script lang="ts">
  let { text, changed = false }: { text: string; changed?: boolean } = $props();
</script>

<span>{text}{#if changed}<span class="changed">(changed)</span>{/if}</span>

<style>
  .changed {
    margin-left: 5px;
    font-style: italic;
    opacity: 0.7;
  }
</style>
