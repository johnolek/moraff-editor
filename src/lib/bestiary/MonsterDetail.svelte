<script lang="ts">
  import { untrack } from 'svelte';
  import { loadedCharacter } from '../calculators/character';
  import { weaponById } from '../calculators/combat';
  import {
    expValue,
    monsterAttackInterval,
    monsterHpRange,
    monsterLevelBase,
    sleepChance,
  } from '../game/dotu-mech.js';
  import { sectionInfo } from '../game/sections';
  import { MODULE_NUMERALS } from '../map/labels';
  import BarChart from '../ui/BarChart.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { binHp, hpDistribution, levelDistribution } from './distribution';
  import LevelControl from './LevelControl.svelte';
  import MonsterPicture from './MonsterPicture.svelte';
  import { describeEffects, homeFloor, isPuffball, stockingOdds, whereItAppears, type Monster } from './monsters';
  import { hitChance, toHitTotal, totalNeededToBeatDefense, type ToHitFighter } from './to-hit';

  interface Props {
    entry: Monster;
    groupLabel: string;
  }

  let { entry, groupLabel }: Props = $props();

  /** The resistance spell that halves each kind of breath; acid has none. */
  const BREATH_RESISTS = ['Anti-Fire', 'Anti-Cold', '', 'Resist Disease', 'Resist Poison'];
  /** Levels rarer than this are left out of the chart; the nudge has a very long tail. */
  const RARE_LEVEL = 0.0005;
  /** The game's weapon table starts with the fist, which every character can swing. */
  const FIST = weaponById(0);
  /** The character the worked line falls back to when the save editor holds no character. */
  const EXAMPLE_FIGHTER: ToHitFighter = { lev: 30, str: 40, luck: 20, weaponHit: FIST.hit, hard: false };

  // The parent keys this component on the monster, so the controls start fresh each time.
  const home = untrack(() => homeFloor(entry));
  let module = $state(home.module);
  let floor = $state(home.floor);
  let baseLevel = $state(monsterLevelBase(home.floor, home.module));

  // The floor control only offers floors of the module the monster appears in, and every one of
  // those belongs to a section.
  const section = $derived(sectionInfo(module, floor)!);
  const sectionNumber = $derived(entry.origin.kind === 'section' ? entry.origin.section : section.section);
  const effects = $derived(describeEffects(entry));
  const appearance = $derived(whereItAppears(entry));
  const odds = $derived(stockingOdds(entry));

  const hpRange = $derived(monsterHpRange(entry.type.hpPerLevel, baseLevel, entry.isBoss, sectionNumber));
  const experience = $derived(Math.round(expValue(baseLevel, entry.expMult)));
  // The distributions only depend on the base level, which the level control has already worked out.
  const levels = $derived(levelDistribution(baseLevel).filter(({ p }) => p >= RARE_LEVEL));
  const hpBars = $derived(binHp(hpDistribution(entry, baseLevel)));
  const hpLabels = $derived(hpBars.map(({ from, to }) => (from === to ? String(from) : `${from}\u2013${to}`)));

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

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;

  const halfTheTime = $derived(totalNeededToBeatDefense(0.5, baseLevel, entry.type.defense, entry.type.speed));
  const nineSwingsInTen = $derived(totalNeededToBeatDefense(0.9, baseLevel, entry.type.defense, entry.type.speed));

  /** The character open in the save editor, as the pieces of a swing and its die, or null for none. */
  const yours = $derived.by(() => {
    const record = loadedCharacter();
    if (!record) return null;
    const fighter: ToHitFighter = {
      lev: record.lev,
      str: record.str,
      luck: record.luck,
      luckyCharms: record.luckyCharms,
      weaponHit: weaponById(record.weapon).hit,
      gauntlet: record.gauntlet,
      weaponPlus: record.weaponPlus[record.weapon] ?? 0,
      tempWeaponPlus: record.tempWeaponPlus,
      hard: record.hard !== 0,
    };
    return { name: record.name.trim(), fighter, damageDie: weaponById(record.weapon).damageDie };
  });

  const workedLine = $derived.by(() => {
    const fighter = yours?.fighter ?? EXAMPLE_FIGHTER;
    const damageDie = yours?.damageDie ?? FIST.damageDie;
    const chance = percent(hitChance(toHitTotal(fighter), baseLevel, entry.type.defense, entry.type.speed, damageDie));
    if (yours) {
      return (
        `${yours.name}, level ${fighter.lev.toLocaleString()} with Strength ${fighter.str.toLocaleString()} ` +
        `and Luck ${fighter.luck.toLocaleString()}, hits it ${chance} of the time.`
      );
    }
    return (
      `A level ${fighter.lev.toLocaleString()} fighter with Strength ${fighter.str.toLocaleString()} ` +
      `and Luck ${fighter.luck.toLocaleString()}, on normal difficulty with a fist, hits it ${chance} of the time.`
    );
  });
</script>

<article>
  <div class="top">
    <div class="art">
      <MonsterPicture {entry} module={module + 1} part={section.part} />
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
      <dt>Sleep</dt>
      <dd>Works on it {percent(sleepChance(baseLevel))} of the time.</dd>
      {#if entry.breath > 0}
        <dt>Breath damage</dt>
        <dd>
          {baseLevel}–{2 * baseLevel - 1}{BREATH_RESISTS[entry.breath - 1]
            ? `, halved by ${BREATH_RESISTS[entry.breath - 1]}`
            : ''}
        </dd>
      {/if}
    </dl>

    <div class="to-hit">
      <p class="note">Hitting it</p>
      <p>
        A to-hit total of {halfTheTime.toLocaleString()} hits it half the time; {nineSwingsInTen.toLocaleString()} hits
        it 9 swings in 10.
      </p>
      <p>
        Your total is 2 × level + Strength (counted twice, plus 25 over 25, on normal difficulty) + Luck + weapon and
        gauntlet bonuses.
      </p>
      <p>{workedLine}</p>
    </div>

    <div class="charts">
      <BarChart
        labels={hpLabels}
        values={hpBars.map(({ p }) => p * 100)}
        tooltip={(index) => `${hpLabels[index]} HP: ${percent(hpBars[index].p)}`}
        xLabel="Hit points"
      />
      <BarChart
        labels={levels.map(({ level }) => String(level))}
        values={levels.map(({ p }) => p * 100)}
        tooltip={(index) => `Level ${levels[index].level}: ${percent(levels[index].p)}`}
        xLabel="Level it is stocked at"
      />
    </div>
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
  .to-hit {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 16px;
  }
  .charts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }
</style>
