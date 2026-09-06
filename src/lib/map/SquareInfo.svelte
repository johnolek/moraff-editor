<script lang="ts">
  import { app } from '../app-state.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { describeMonster, type SquareDescription } from './describe';
  import type { StockedMonster } from './stocking';

  interface Props {
    description: SquareDescription | null;
    notes?: string[];
    /** The stocked monster standing on the square, if there is one. */
    monster?: StockedMonster | null;
  }

  let { description, notes = [], monster = null }: Props = $props();

  function openInMonsters() {
    if (!monster) return;
    app.requestedMonsterId = monster.monsterId;
    app.tab = 'monsters';
  }
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
      {#if monster}
        <p class="monster">{describeMonster(monster)}</p>
        <button class="ghost" onclick={openInMonsters}>Open in Monsters</button>
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
  /* Keeps the sections below from jumping as the pointer moves over squares that have more
     or fewer lines to show. */
  section {
    min-height: 90px;
  }
  .feature {
    margin: 0;
    font-size: 13px;
    color: var(--accent);
  }
  .monster {
    margin: 10px 0 6px;
    font-size: 13px;
  }
  button.ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }
  button.ghost:hover {
    color: var(--ink);
    border-color: var(--accent);
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
