<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { featureLine, type SquareDescription } from './describe';

  interface Props {
    description: SquareDescription | null;
    notes?: string[];
  }

  let { description, notes = [] }: Props = $props();

  const line = $derived(description && featureLine(description));
</script>

<section>
  {#if description}
    <SectionHeading title={description.title} />
    {#if line}
      <p class="feature">{line}</p>
    {/if}
    {#if !description.rock && !description.beyondMap}
      {#each notes as note}
        <p class="note">{note}</p>
      {/each}
    {/if}
  {:else}
    <p class="hint">Point at a square to inspect it.</p>
  {/if}
</section>

<style>
  /* The min-height reserves room for the common case, a heading and one line about the square,
     so the sections below hold still as the pointer moves from square to square. A square that
     also has notes is taller than that and does push them down a little. The min-height also
     overrides the automatic minimum size a flex item gets, which is what stops the panel from
     squeezing this section shorter than its own text and drawing it over the section below. */
  section {
    min-height: 40px;
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
