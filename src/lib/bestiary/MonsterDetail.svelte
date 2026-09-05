<script lang="ts">
  import { untrack } from 'svelte';
  import {
    expValue,
    monsterAttackInterval,
    monsterHpRange,
    monsterLevelBase,
    monsterLevelDistribution,
  } from '../game/dotu-mech.js';
  import { sectionInfo } from '../game/sections';
  import { MODULE_NUMERALS } from '../map/labels';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import LevelControl from './LevelControl.svelte';
  import MonsterPicture from './MonsterPicture.svelte';
  import { describeEffects, homeFloor, isPuffball, stockingOdds, whereItAppears, type MonsterEntry } from './monsters';
  import type { Look } from './pictures';
  import { rollMonster, type Roll } from './roll';

  interface Props {
    entry: MonsterEntry;
    groupLabel: string;
  }

  let { entry, groupLabel }: Props = $props();

  /** The resistance spell that halves each kind of breath; acid has none. */
  const BREATH_RESISTS = ['Anti-Fire', 'Anti-Cold', '', 'Resist Disease', 'Resist Poison'];
  const ROLLS_KEPT = 10;
  /** Levels rarer than this are left out of the table; the nudge has a very long tail. */
  const RARE_LEVEL = 0.005;

  // The parent keys this component on the monster, so the controls start fresh each time.
  const home = untrack(() => homeFloor(entry));
  let module = $state(home.module);
  let floor = $state(home.floor);
  let baseLevel = $state(monsterLevelBase(home.floor, home.module));
  let look = $state<Look>('shop');
  let rolls = $state<Roll[]>([]);

  const section = $derived(sectionInfo(module, floor));
  const sectionNumber = $derived(entry.origin.kind === 'section' ? entry.origin.section : section.section);
  const effects = $derived(describeEffects(entry));
  const appearance = $derived(whereItAppears(entry));
  const odds = $derived(stockingOdds(entry));

  const hpRange = $derived(monsterHpRange(entry.type.hpPerLevel, baseLevel, entry.isBoss, sectionNumber));
  const experience = $derived(Math.round(expValue(baseLevel, entry.expMult)));
  // The distribution only depends on the base level, which the level control has already worked out.
  const levels = $derived(monsterLevelDistribution(baseLevel, 0).filter(([, chance]) => chance >= RARE_LEVEL));

  const stats = $derived([
    ['Defense', String(entry.type.defense)],
    ['Damage die', String(entry.type.damageDie)],
    ['HP per level', String(entry.type.hpPerLevel)],
    ['Speed', String(entry.type.speed)],
    ['Experience', `×${entry.expMult}`],
  ]);

  const floorLines = $derived(
    appearance.ranges.map((range) => {
      const floors = range.from === range.to ? `floor ${range.from}` : `floors ${range.from}–${range.to}`;
      return `Module ${MODULE_NUMERALS[range.module]}, ${floors}`;
    }),
  );

  function roll() {
    rolls = [rollMonster(entry, baseLevel, Math.random), ...rolls].slice(0, ROLLS_KEPT);
  }

  function switchLook(event: Event) {
    look = (event.currentTarget as HTMLInputElement).checked ? 'shop' : 'fresh';
  }

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;
</script>

<article>
  <div class="top">
    <div class="art">
      <MonsterPicture {entry} module={module + 1} part={section.part} {look} />
      {#if entry.isBoss}
        <label class="toggle">
          <input type="checkbox" checked={look === 'shop'} onchange={switchLook} />
          After visiting a shop
        </label>
      {/if}
    </div>
    <div class="facts">
      <h2><PixelText text={entry.name} scale={2} /></h2>
      <p class="group">{groupLabel}</p>

      <section>
        <SectionHeading title="Type" />
        <p class="quote">{entry.type.text}</p>
        <p class="note">Type {entry.type.type}</p>
      </section>

      <section>
        <SectionHeading title="Stats" />
        <dl>
          {#each stats as [label, value]}
            <dt>{label}</dt>
            <dd>{value}</dd>
          {/each}
        </dl>
        {#if effects.length > 0}
          <ul class="effects">
            {#each effects as effect}
              <li>{effect}</li>
            {/each}
          </ul>
        {/if}
      </section>
    </div>
  </div>

  {#if entry.description}
    <section>
      <SectionHeading title="Description" />
      <p>{entry.description}</p>
    </section>
  {/if}

  <section>
    <SectionHeading title="Where it appears" />
    <ul class="floors">
      {#each floorLines as line}
        <li>{line}</li>
      {/each}
    </ul>
    {#if odds === null}
      <p class="note">One per boss floor, until you collect the section's reward.</p>
    {:else}
      <p class="note">{percent(odds)} of the monsters stocked on a floor.</p>
    {/if}
  </section>

  <section>
    <SectionHeading title="At level {baseLevel}" />
    <LevelControl {entry} bind:module bind:floor bind:baseLevel />
    <dl>
      <dt>Hit points</dt>
      <dd>{hpRange[0].toLocaleString()}–{hpRange[1].toLocaleString()}</dd>
      <dt>Experience</dt>
      <dd>{isPuffball(entry) ? 'None' : experience.toLocaleString()}</dd>
      <dt>Seconds between attacks</dt>
      <dd>{monsterAttackInterval(entry.type.speed)}</dd>
      {#if entry.breath > 0}
        <dt>Breath damage</dt>
        <dd>
          {baseLevel}–{2 * baseLevel - 1}{BREATH_RESISTS[entry.breath - 1]
            ? `, halved by ${BREATH_RESISTS[entry.breath - 1]}`
            : ''}
        </dd>
      {/if}
    </dl>

    <table>
      <caption>Level it is stocked at</caption>
      <tbody>
        {#each levels as [level, chance]}
          <tr>
            <th scope="row">{level}</th>
            <td>{percent(chance)}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <button type="button" class="ghost" onclick={roll}>Roll a monster</button>
    {#if rolls.length > 0}
      <ul class="rolls">
        {#each rolls as result}
          <li>Level {result.level} · {result.hp.toLocaleString()} HP</li>
        {/each}
      </ul>
    {/if}
  </section>
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px 24px;
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  .art {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .facts {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  h2 {
    margin: 0;
    line-height: 0;
    color: var(--ink);
  }
  .group {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .quote {
    margin: 0;
    color: var(--mw-cyan);
    font-size: 13px;
  }
  .note {
    margin: 6px 0 0;
    font-size: 12px;
    color: var(--muted);
  }
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    margin: 12px 0 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  p {
    margin: 0;
    font-size: 14px;
    max-width: 62ch;
  }
  ul {
    margin: 8px 0 0;
    padding-left: 18px;
    font-size: 13px;
  }
  .effects li {
    color: var(--warn);
  }
  table {
    margin-top: 12px;
    border-collapse: collapse;
    font-size: 13px;
  }
  caption {
    padding-bottom: 4px;
    font-size: 12px;
    text-align: left;
    color: var(--muted);
  }
  th,
  td {
    padding: 1px 12px 1px 0;
    text-align: left;
    font-weight: normal;
  }
  td {
    color: var(--muted);
  }
  button.ghost {
    align-self: flex-start;
    margin-top: 16px;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  button.ghost:hover {
    color: var(--ink);
    border-color: var(--accent);
  }
  .rolls {
    list-style: none;
    padding: 0;
    color: var(--good);
  }
</style>
