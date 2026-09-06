<script lang="ts">
  import { app } from '../app-state.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { LIST_NOTES, spellCorrection } from './mechanics';
  import { allSpells, gridKey, spellGroups, type Spell } from './spells';

  /** The game's own wording, from the type menu and the spell menu of its spell screen. */
  const TYPE_HEADING = 'SELECT THE TYPE OF SPELL:';
  const GRID_HEADING = 'SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:';
  const GRID_FOOTER = 'SPELLS ON LINE 1 USE 1 SPELL POINT, ON LINE 3 THEY USE 3, LINE 7 USE 7, ETC.';

  const lists = spellGroups(allSpells());

  let listIndex = $state(0);
  let selected = $state<Spell | null>(null);
  let grid: HTMLDivElement;

  const list = $derived(lists[listIndex]);
  const correction = $derived(selected ? spellCorrection(selected) : null);

  // MORF-61: the selected spell's ported code goes here once the port supplies it.
  const code: string | null = null;

  function typeLabel(label: string, index: number): string {
    return `${index + 1}) ${label.toUpperCase()} SPELLS`;
  }

  function cellLabel(spell: Spell, row: number, column: number): string {
    return `${gridKey(row, column)})${spell.name.toUpperCase()}`;
  }

  function pickList(index: number) {
    listIndex = index;
    selected = null;
  }

  function spellForKey(key: string): Spell | null {
    for (const [row, level] of list.levels.entries()) {
      for (const [column, spell] of level.spells.entries()) {
        if (gridKey(row, column) === key) return spell;
      }
    }
    return null;
  }

  /**
   * Both menus are keyed the way the game keys them, and both claim 1 to 4. A digit picks a
   * spell while the keyboard is on the grid, where the game keys the last four spells 1 to 4,
   * and picks a spell list anywhere else.
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
      pickList(type);
      event.preventDefault();
      return;
    }
    const spell = spellForKey(key);
    if (!spell) return;
    selected = spell;
    event.preventDefault();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="reference">
  <div class="scroll">
    <div class="types">
      <p class="type-heading"><PixelText font="small" scale={3} text={TYPE_HEADING} /></p>
      <div class="type-items">
        {#each lists as entry, index}
          <button
            type="button"
            class="type-item"
            class:current={index === listIndex}
            aria-pressed={index === listIndex}
            onclick={() => pickList(index)}
          >
            <PixelText font="small" scale={3} text={typeLabel(entry.label, index)} colour={index === listIndex ? '#000' : undefined} />
          </button>
        {/each}
      </div>
    </div>

    {#if LIST_NOTES[list.label]}
      <p class="list-note">{LIST_NOTES[list.label]}</p>
    {/if}

    <div class="book">
      <div class="sheet">
        <p class="book-heading"><PixelText font="small" scale={3} text={GRID_HEADING} /></p>
        <div class="grid" bind:this={grid}>
          {#each list.levels as level, row}
            {#each level.spells as spell, column}
              <button
                type="button"
                class="cell"
                class:current={selected === spell}
                aria-pressed={selected === spell}
                onclick={() => (selected = spell)}
              >
                <PixelText font="small" scale={3} text={cellLabel(spell, row, column)} colour={selected === spell ? '#000' : undefined} />
              </button>
            {/each}
          {/each}
        </div>
        <p class="book-footer"><PixelText font="small" scale={3} text={GRID_FOOTER} /></p>
      </div>
    </div>

    {#if selected}
      <section class="detail">
        <h2><PixelText text={selected.name} scale={2} /></h2>
        <p class="cost">SP cost: {selected.spCost}</p>
        <dl>
          <dt>In the game</dt>
          <dd class="quote">{selected.description}</dd>
          {#if correction}
            <dt>What it really does</dt>
            <dd>{correction}</dd>
          {/if}
        </dl>
        {#if code}
          <SectionHeading title="Code" />
          <pre>{code}</pre>
        {/if}
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
  /* The game draws its type menu on a grey panel; #404040 is the grey it uses. */
  .types {
    padding: 14px 16px 16px;
    border-radius: 6px;
    background: #404040;
  }
  .type-heading {
    margin: 0 0 12px;
    line-height: 0;
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
    line-height: 0;
    color: var(--mw-red);
    cursor: pointer;
  }
  /* A DOS menu marks the item you are on by swapping its colours over. */
  .type-item.current {
    background: var(--mw-red);
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
    line-height: 0;
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
    line-height: 0;
    text-align: left;
    color: var(--mw-green);
    cursor: pointer;
  }
  .cell.current {
    background: var(--mw-green);
  }
  .book-footer {
    margin: 0;
    line-height: 0;
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
  h2 {
    margin: 0;
    line-height: 0;
    color: var(--accent);
  }
  .cost {
    margin: 10px 0 12px;
    font-size: 13px;
    color: var(--muted);
  }
  dl {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 4px 12px;
    margin: 0;
    font-size: 14px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  .quote {
    color: var(--mw-cyan);
  }
  pre {
    margin: 0;
    overflow-x: auto;
    font-size: 13px;
  }
</style>
