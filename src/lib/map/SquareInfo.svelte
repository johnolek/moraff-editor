<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import type { SquareDescription } from './describe';

  interface Props {
    description: SquareDescription | null;
    notes?: string[];
  }

  let { description, notes = [] }: Props = $props();
</script>

<section>
  {#if description}
    <SectionHeading title={description.title} />
    {#if description.rock}
      <p class="feature">Rock</p>
    {:else}
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
  /* The min-height keeps the sections below from jumping as the pointer moves over squares
     that have more or fewer lines to show. It also overrides the automatic minimum size a
     flex item gets, which is what stops the panel from squeezing this section shorter than
     its own text and drawing it over the section below. */
  section {
    min-height: 90px;
    flex-shrink: 0;
  }
  .feature {
    margin: 0;
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
