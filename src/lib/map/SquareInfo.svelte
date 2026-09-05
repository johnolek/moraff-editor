<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import type { SquareDescription } from './describe';

  let { description, notes = [] }: { description: SquareDescription | null; notes?: string[] } = $props();
</script>

<section>
  {#if description}
    <SectionHeading title={description.title} />
    {#if description.rock}
      <p class="feature">Rock</p>
    {:else}
      <dl>
        {#each description.sides as [direction, text]}
          <dt>{direction}</dt>
          <dd>{text}</dd>
        {/each}
      </dl>
      {#if description.feature}
        <p class="feature">{description.feature}</p>
      {/if}
      {#each notes as note}
        <p class="note">{note}</p>
      {/each}
    {/if}
  {:else}
    <p class="hint">Point at a square to inspect it.</p>
  {/if}
</section>

<style>
  section {
    min-height: 150px;
  }
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  .feature {
    margin: 10px 0 0;
    font-size: 13px;
    color: var(--accent);
  }
  .note {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--muted);
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
