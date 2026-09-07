<!-- The Spells tab under Moraff's World. -->
<script lang="ts">
  import SourceLink from '../source/SourceLink.svelte';
  import type { SpellCategory } from '../spells/grid';
  import SpellBook from '../spells/SpellBook.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import { mwSpellBook } from './book';

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
  const byId = new Map(
    lists.flatMap((list) => list.levels.flatMap((level) => level.spells)).map((spell) => [String(spell.record), spell]),
  );

  const categories: SpellCategory[] = lists.map((list, index) => ({
    label: list.label,
    notes: [LIST_NOTES[index], FIGHTER_NOTE],
    cells: list.levels.flatMap((level) =>
      level.spells.map((spell) => ({ id: String(spell.record), key: spell.key, name: spell.name })),
    ),
  }));
</script>

<SpellBook
  {categories}
  typeHeading={TYPE_HEADING}
  gridHeading={GRID_HEADING}
  gridFooter={GRID_FOOTER}
  intro={INTRO}
  {detail}
/>

{#snippet detail(id: string)}
  {@const spell = byId.get(id)!}
  <h2><PixelText text={spell.name} scale={2} /></h2>
  <p class="cost">
    Level {spell.level}, so {spell.cost}
    {spell.cost === 1 ? 'spell point' : 'spell points'}{spell.maximumCost
      ? ` out of the pool and ${spell.maximumCost} off the maximum for good`
      : ''}<SourceLink ts={{ file: PORT, name: 'mwSpellPointCost' }} />
  </p>
  <dl>
    <dt>In the game<SourceLink ts={{ file: PORT, name: 'mwSpellHelp' }} /></dt>
    <dd class="quote">
      {#each spell.help as line}<span class="line">{line}</span>{/each}
    </dd>
    <dt>What it really does</dt>
    <dd>
      {spell.effect.effect}
      <span class="from">Read from {spell.effect.from}.</span>
    </dd>
    <dt>Where it sits<SourceLink ts={{ file: PORT, name: 'mwSpellRecord' }} /></dt>
    <dd>
      Record {spell.record} of SPELLS.HLP, and byte {spell.bookSlot} of the spellbook, the scrolls, the wands and the
      magic paper.
    </dd>
  </dl>
{/snippet}

<style>
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
</style>
