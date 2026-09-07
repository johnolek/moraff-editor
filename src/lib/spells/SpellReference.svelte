<!-- The Spells tab under Dungeons of the Unforgiven. -->
<script lang="ts">
  import { portedSpell } from '../game/port/spell-index';
  import SourceLink from '../source/SourceLink.svelte';
  import { portCode, portFunction } from '../source/ports';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { spellBook } from './book';
  import { spellCorrection, spellKey } from './mechanics';
  import SpellBook from './SpellBook.svelte';
  import { allSpells } from './spells';

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

  const categories = spellBook();
  const byKey = new Map(allSpells().map((spell) => [spellKey(spell), spell]));
</script>

<SpellBook
  {categories}
  typeHeading={TYPE_HEADING}
  gridHeading={GRID_HEADING}
  gridFooter={GRID_FOOTER}
  {detail}
/>

{#snippet detail(id: string)}
  {@const spell = byKey.get(id)!}
  {@const correction = spellCorrection(spell)}
  {@const code = portedSpell(spell.type, spell.level - 1, spell.slot - 1)}
  <h2><PixelText text={spell.name} scale={2} /></h2>
  <p class="cost">SP cost: {spell.spCost}</p>
  <dl>
    <dt>In the game</dt>
    <dd class="quote">{spell.description}</dd>
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
