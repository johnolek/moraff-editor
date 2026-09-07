<!--
  The spell screen both games draw: the type menu, the grid of thirty spells the list picked
  holds, and the description of the spell picked out of it. Each game brings its own wording,
  its own lists and its own description.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { app } from '../app-state.svelte';
  import { cellForKey, type SpellCategory } from './grid';

  interface Props {
    /** The four lists of the game's type menu. */
    categories: SpellCategory[];
    /** The game's own heading over the type menu. */
    typeHeading: string;
    /** The game's own heading over the grid. */
    gridHeading: string;
    /** The line the game prints under the grid. */
    gridFooter: string;
    /** What the page has to say about the book as a whole, above the type menu. */
    intro?: string;
    /** The description of the spell picked, by the id of its cell. */
    detail: Snippet<[string]>;
  }

  let { categories, typeHeading, gridHeading, gridFooter, intro, detail }: Props = $props();

  let categoryIndex = $state(0);
  /** The spell being shown, by the id of its cell. An id rather than the spell itself because
   *  $state hands back a proxy of whatever object is put in it, which never compares equal to
   *  the record the grid is drawn from. */
  let selectedId = $state<string | null>(null);
  let grid: HTMLDivElement;

  const category = $derived(categories[categoryIndex]);

  function pickCategory(index: number) {
    categoryIndex = index;
    selectedId = null;
  }

  /**
   * Both menus are keyed the way the game keys them, and both claim 1 to 4. A digit picks a
   * spell while the keyboard is on the grid, where the game keys the last four spells 1 to 4,
   * and picks a spell list anywhere else. Only the game being shown has a book mounted, so only
   * it answers.
   */
  function onKeydown(event: KeyboardEvent) {
    if (app.tab !== 'spells') return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
    const key = event.key.toUpperCase();
    const onGrid = target !== null && grid.contains(target);
    const type = ['1', '2', '3', '4'].indexOf(key);
    if (type >= 0 && !onGrid) {
      pickCategory(type);
      event.preventDefault();
      return;
    }
    const cell = cellForKey(category, key);
    if (!cell) return;
    selectedId = cell.id;
    event.preventDefault();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="reference">
  <div class="scroll">
    {#if intro}
      <p class="intro">{intro}</p>
    {/if}

    <div class="types">
      <p class="type-heading">{typeHeading}</p>
      <div class="type-items">
        {#each categories as entry, index}
          <button
            type="button"
            class="type-item"
            class:current={index === categoryIndex}
            aria-pressed={index === categoryIndex}
            onclick={() => pickCategory(index)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
    </div>

    {#each category.notes as note}
      <p class="list-note">{note}</p>
    {/each}

    <div class="book">
      <div class="sheet">
        <p class="book-heading">{gridHeading}</p>
        <div class="grid" bind:this={grid}>
          {#each category.cells as cell}
            <button
              type="button"
              class="cell"
              class:current={selectedId === cell.id}
              aria-pressed={selectedId === cell.id}
              onclick={() => (selectedId = cell.id)}
            >
              {cell.key}){cell.name}
            </button>
          {/each}
        </div>
        <p class="book-footer">{gridFooter}</p>
      </div>
    </div>

    {#if selectedId}
      <section class="detail">
        {@render detail(selectedId)}
      </section>
    {/if}
  </div>
</div>

<style>
  .reference {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px 40px;
  }
  .intro {
    margin: 0 0 18px;
    max-width: 88ch;
    font-size: 14px;
    color: var(--muted);
  }
  /* The game draws its type menu on a grey panel; #404040 is the grey it uses. */
  .types {
    padding: 14px 16px 16px;
    border-radius: 6px;
    background: #404040;
  }
  /* The game's own screen is text mode, so its wording is set in a DOS terminal face. */
  .type-heading,
  .type-item,
  .book-heading,
  .cell,
  .book-footer {
    font-family: var(--font-dos);
    line-height: 1.1;
    white-space: nowrap;
  }
  .type-heading {
    margin: 0 0 12px;
    font-size: 24px;
    color: var(--mw-green);
  }
  .type-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
  }
  .type-item {
    padding: 4px 6px;
    border: none;
    border-radius: 3px;
    background: none;
    font-size: 22px;
    color: var(--mw-red);
    cursor: pointer;
  }
  /* A DOS menu marks the item you are on by swapping its colours over. */
  .type-item.current {
    background: var(--mw-red);
    color: #000;
  }
  .type-item:focus-visible,
  .cell:focus-visible {
    outline: 2px solid var(--accent);
  }
  .list-note {
    margin: 18px 0;
    max-width: 88ch;
    font-size: 13px;
    color: var(--muted);
  }
  /* The spell menu itself is drawn on the game's black screen. */
  .book {
    margin-top: 18px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: #000;
    overflow-x: auto;
  }
  .sheet {
    width: max-content;
    min-width: 100%;
    padding: 18px 20px 20px;
  }
  .book-heading {
    margin: 0 0 16px;
    font-size: 24px;
    color: var(--accent);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 4px 24px;
    margin-bottom: 18px;
  }
  .cell {
    padding: 3px 5px;
    border: none;
    border-radius: 3px;
    background: none;
    font-size: 22px;
    text-align: left;
    color: var(--mw-green);
    cursor: pointer;
  }
  .cell.current {
    background: var(--mw-green);
    color: #000;
  }
  .book-footer {
    margin: 0;
    font-size: 22px;
    color: var(--mw-red);
  }
  .detail {
    margin-top: 18px;
    max-width: 88ch;
    padding: 14px 16px 16px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel);
  }
</style>
