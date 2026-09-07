<script lang="ts">
  import { app } from '../app-state.svelte';
  import { portedSpell } from '../game/port/spell-index';
  import SourceLink from '../source/SourceLink.svelte';
  import { portCode, portFunction } from '../source/ports';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { LIST_NOTES, spellCorrection, spellKey } from './mechanics';
  import { allSpells, gridKey, spellGroups, type Spell } from './spells';

  /** The game's own wording, from the type menu and the spell menu of its spell screen. */
  const TYPE_HEADING = 'SELECT THE TYPE OF SPELL:';
  const GRID_HEADING = 'SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:';
  const GRID_FOOTER = 'SPELLS ON LINE 1 USE 1 SPELL POINT, ON LINE 3 THEY USE 3, LINE 7 USE 7, ETC.';

  const CODE_NOTE =
    "The game's own code for this spell, ported line for line; the address it came from is in the comment.";

  /** Every spell the port runs is a function of this one file. */
  const MAGIC = 'src/lib/game/port/magic.ts' as const;

  /** The decompiled function a ported one cites, for the link beside its name. */
  const citedC = (name: string) => portFunction(MAGIC, name)?.c?.name;

  const lists = spellGroups(allSpells());
  const byKey = new Map(allSpells().map((spell) => [spellKey(spell), spell]));

  let listIndex = $state(0);
  /** The spell being shown, by its key. A key rather than the spell itself because $state hands
   *  back a proxy of whatever object is put in it, which never compares equal to the one the grid
   *  is drawn from. */
  let selectedKey = $state<string | null>(null);
  let grid: HTMLDivElement;

  const list = $derived(lists[listIndex]);
  const selected = $derived(selectedKey === null ? null : (byKey.get(selectedKey) ?? null));
  const correction = $derived(selected ? spellCorrection(selected) : null);

  const code = $derived(selected ? portedSpell(selected.type, selected.level - 1, selected.slot - 1) : null);

  function typeLabel(label: string, index: number): string {
    return `${index + 1}) ${label.toUpperCase()} SPELLS`;
  }

  function cellLabel(spell: Spell, row: number, column: number): string {
    return `${gridKey(row, column)})${spell.name.toUpperCase()}`;
  }

  function pickList(index: number) {
    listIndex = index;
    selectedKey = null;
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
    selectedKey = spellKey(spell);
    event.preventDefault();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="reference">
  <div class="scroll">
    <div class="types">
      <p class="type-heading">{TYPE_HEADING}</p>
      <div class="type-items">
        {#each lists as entry, index}
          <button
            type="button"
            class="type-item"
            class:current={index === listIndex}
            aria-pressed={index === listIndex}
            onclick={() => pickList(index)}
          >
            {typeLabel(entry.label, index)}
          </button>
        {/each}
      </div>
    </div>

    {#if LIST_NOTES[list.label]}
      <p class="list-note">{LIST_NOTES[list.label]}</p>
    {/if}

    <div class="book">
      <div class="sheet">
        <p class="book-heading">{GRID_HEADING}</p>
        <div class="grid" bind:this={grid}>
          {#each list.levels as level, row}
            {#each level.spells as spell, column}
              <button
                type="button"
                class="cell"
                class:current={selectedKey === spellKey(spell)}
                aria-pressed={selectedKey === spellKey(spell)}
                onclick={() => (selectedKey = spellKey(spell))}
              >
                {cellLabel(spell, row, column)}
              </button>
            {/each}
          {/each}
        </div>
        <p class="book-footer">{GRID_FOOTER}</p>
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
          <p class="code-note">{CODE_NOTE}</p>
          {#if code.args}
            <p class="code-note">Called as {code.fn}(game, {code.args}).</p>
          {/if}
          <p class="fn">{code.fn}<SourceLink ts={{ file: MAGIC, name: code.fn }} c={citedC(code.fn)} /></p>
          <pre>{portCode(MAGIC, code.fn)}</pre>
          {#each code.helpers as helper}
            <p class="helper">{helper}<SourceLink ts={{ file: MAGIC, name: helper }} c={citedC(helper)} /></p>
            <pre>{portCode(MAGIC, helper)}</pre>
          {/each}
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
  .code-note {
    margin: 0 0 6px;
    font-size: 13px;
    color: var(--muted);
  }
  .fn,
  .helper {
    font-size: 12px;
    color: var(--muted);
  }
  .fn {
    margin: 6px 0 0;
  }
  .helper {
    margin: 20px 0 0;
  }
  pre {
    margin: 12px 0 0;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 5px;
    background: var(--panel);
    overflow-x: auto;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.5;
    color: var(--mw-cyan);
  }
</style>
