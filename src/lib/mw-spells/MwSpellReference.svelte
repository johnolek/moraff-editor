<script lang="ts">
  import { app } from '../app-state.svelte';
  import SourceLink from '../source/SourceLink.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import { mwSpellBook, type MwSpell } from './book';

  /** The game's own wording, out of the data segment of WORLD.EXE. */
  const TYPE_HEADING = 'SELECT THE TYPE OF SPELL:';
  const GRID_HEADING = 'SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:';
  const GRID_FOOTER = 'PRESS A LETTER OR A NUMBER TO GET A DESCRIPTION:';

  const INTRO =
    "Every word under In the game is the game's own, out of SPELLS.HLP, which the site ships with " +
    'only its DOS line endings changed. What a spell really does was read out of the code that ' +
    'runs it rather than out of that text, and the two do not always agree.';

  /** What holds for a whole category rather than for one spell. */
  const LIST_NOTES: string[] = [
    'The game refuses these anywhere but the town: "THESE SPELLS TAKE ONE MONTH TO CAST AND CAN NOT BE USED IN THE DUNGEON." Cast out of the spellbook they take their level off the maximum spell points as well as out of the pool, so a character who casts them is worse at magic for good.',
    'Refused during a battle: "THESE SPELLS TAKE 3 MINUTES TO CAST. THIS CAN NOT BE DONE DURING BATTLE." Every class but the fighter may cast them.',
    'The monk, the wizard, the sage and the mage may cast these out of the spellbook. Most of them want a monster engaged and answer "YOU ARE NOT CURRENTLY ENGAGING ANY MONSTER" — and cost nothing — when there is none.',
    'The worshipper, the monk, the priest and the sage may cast these out of the spellbook. The list overlaps the wizard\'s heavily, but the levels the spells sit on are not the same.',
  ];

  const FIGHTER_NOTE =
    'A fighter is turned away from the spell screen altogether: "FIGHTERS CAN ONLY CAST SPELLS BY USING MAGIC PAPER. KEEP LOOKING." A scroll, a wand or a piece of magic paper is never checked against the class, so any other class can cast any spell from one.';

  /** The file the Source tab shows this page's reading of the game out of. */
  const PORT = 'src/lib/game/mw-port/spells.ts' as const;

  const lists = mwSpellBook();

  let listIndex = $state(0);
  /** The spell being shown, by its SPELLS.HLP record. A number rather than the spell itself
   *  because $state hands back a proxy of whatever object is put in it, which never compares
   *  equal to the one the grid is drawn from. */
  let selectedRecord = $state<number | null>(null);
  let grid: HTMLDivElement;

  const list = $derived(lists[listIndex]);
  const selected = $derived(
    selectedRecord === null
      ? null
      : (list.levels.flatMap((level) => level.spells).find((spell) => spell.record === selectedRecord) ?? null),
  );

  function pickList(index: number) {
    listIndex = index;
    selectedRecord = null;
  }

  function spellForKey(key: string): MwSpell | null {
    for (const level of list.levels) {
      for (const spell of level.spells) if (spell.key === key) return spell;
    }
    return null;
  }

  /**
   * The keyboard the game gives the screen: 1 to 4 pick a category, and a letter or a digit picks
   * a spell. The game keys the bottom line of the grid 1 to 4 as well, so a digit means a spell
   * while the keyboard is on the grid and a category anywhere else.
   */
  function onKeydown(event: KeyboardEvent) {
    if (app.tab !== 'spells' || app.game !== 'moraffsWorld') return;
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
    selectedRecord = spell.record;
    event.preventDefault();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="reference">
  <div class="scroll">
    <p class="intro">{INTRO}</p>

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
            {entry.label}
          </button>
        {/each}
      </div>
    </div>

    <p class="list-note">{LIST_NOTES[listIndex]}</p>
    <p class="list-note">{FIGHTER_NOTE}</p>

    <div class="book">
      <div class="sheet">
        <p class="book-heading">{GRID_HEADING}</p>
        <div class="grid" bind:this={grid}>
          {#each list.levels as level}
            {#each level.spells as spell}
              <button
                type="button"
                class="cell"
                class:current={selectedRecord === spell.record}
                aria-pressed={selectedRecord === spell.record}
                onclick={() => (selectedRecord = spell.record)}
              >
                {spell.key}){spell.name}
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
        <p class="cost">
          Level {selected.level}, so {selected.cost}
          {selected.cost === 1 ? 'spell point' : 'spell points'}{selected.maximumCost
            ? ` out of the pool and ${selected.maximumCost} off the maximum for good`
            : ''}<SourceLink ts={{ file: PORT, name: 'mwSpellPointCost' }} />
        </p>
        <dl>
          <dt>In the game<SourceLink ts={{ file: PORT, name: 'mwSpellHelp' }} /></dt>
          <dd class="quote">
            {#each selected.help as line}<span class="line">{line}</span>{/each}
          </dd>
          <dt>What it really does</dt>
          <dd>
            {selected.effect.effect}
            <span class="from">Read from {selected.effect.from}.</span>
          </dd>
          {#if selected.effect.notRead}
            <dt>Not read</dt>
            <dd class="open">{selected.effect.notRead}</dd>
          {/if}
          <dt>Where it sits<SourceLink ts={{ file: PORT, name: 'mwSpellRecord' }} /></dt>
          <dd>
            Record {selected.record} of SPELLS.HLP, and byte {selected.bookSlot} of the spellbook, the scrolls, the
            wands and the magic paper.
          </dd>
        </dl>
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
    grid-template-columns: 150px 1fr;
    gap: 10px 12px;
    margin: 0;
    font-size: 14px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  /* The help text is shown line for line the way the game breaks it. */
  .quote {
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.15;
    white-space: pre;
    color: var(--mw-cyan);
  }
  .line {
    display: block;
  }
  .from {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
  }
  .open {
    color: var(--mw-red);
  }
</style>
