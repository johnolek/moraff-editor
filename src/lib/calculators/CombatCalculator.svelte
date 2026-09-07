<script lang="ts">
  import { app } from '../app-state.svelte';
  import LevelControl from '../bestiary/LevelControl.svelte';
  import { allMonsters, homeFloor, monsterGroups, type Monster } from '../bestiary/monsters';
  import data from '../game/dotu-data.json';
  import { monsterLevelBase } from '../game/dotu-mech.js';
  import BarChart from '../ui/BarChart.svelte';
  import SourceLink from '../source/SourceLink.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { loadedCharacter } from './character';
  import { ARMORS, combatReport, WEAPONS, type Fighter } from './combat';

  const PROTECTIONS = ['None', 'Minor Protection', 'Protection', 'Major Protection', 'Ultra Protection'];
  const POWER_WEAPONS = [1, 2, 3];

  const first = allMonsters()[0];
  const groups = monsterGroups();

  let character = $state<Fighter>({
    lev: 1,
    cls: 0,
    str: 10,
    iq: 10,
    wis: 10,
    con: 10,
    dex: 10,
    luck: 10,
    luckyCharms: 0,
    weapon: 0,
    weaponPlus: 0,
    tempWeaponPlus: 0,
    gauntlet: 0,
    armor: 0,
    armorPlus: 0,
    tempArmorPlus: 0,
    bodyArmor: 0,
    protRing: 0,
    protection: 0,
    powerWeapon: 0,
    hard: false,
  });

  let monsterId = $state(first.id);
  let module = $state(homeFloor(first).module);
  let floor = $state(homeFloor(first).floor);
  let level = $state(monsterLevelBase(homeFloor(first).floor, homeFloor(first).module));

  const monster = $derived(allMonsters().find((entry) => entry.id === monsterId) ?? first);
  const fighter = $derived<Fighter>({
    ...character,
    lev: whole(character.lev, 0),
    str: whole(character.str, 0),
    iq: whole(character.iq, 0),
    wis: whole(character.wis, 0),
    con: whole(character.con, 0),
    dex: whole(character.dex, 0),
    luck: whole(character.luck, 0),
    luckyCharms: whole(character.luckyCharms, 0),
    weaponPlus: whole(character.weaponPlus, 0),
    tempWeaponPlus: whole(character.tempWeaponPlus, 0),
    gauntlet: whole(character.gauntlet, 0),
    armorPlus: whole(character.armorPlus, 0),
    tempArmorPlus: whole(character.tempArmorPlus, 0),
    bodyArmor: whole(character.bodyArmor, 0),
    protRing: whole(character.protRing, 0),
  });
  const report = $derived(combatReport(fighter, { monster, level, module, floor }));
  const canUseLoaded = $derived(Boolean(loadedCharacter()));

  // The editor bumps saveVersion when it loads or discards a file; start from that character.
  $effect(() => {
    void app.saveVersion;
    useLoadedCharacter();
  });

  function useLoadedCharacter() {
    const record = loadedCharacter();
    if (!record) return;
    character = {
      lev: record.lev,
      cls: Math.min(6, Math.max(0, record.cls)),
      str: record.str,
      iq: record.iq,
      wis: record.wis,
      con: record.con,
      dex: record.dex,
      luck: record.luck,
      luckyCharms: record.luckyCharms,
      weapon: record.weapon,
      weaponPlus: record.weaponPlus[record.weapon] ?? 0,
      tempWeaponPlus: record.tempWeaponPlus,
      gauntlet: record.gauntlet,
      armor: record.armor,
      armorPlus: record.armorPlus[record.armor] ?? 0,
      tempArmorPlus: record.tempArmorPlus,
      bodyArmor: record.bodyArmor,
      protRing: record.protRing,
      protection: Math.min(4, Math.max(0, record.protection)),
      powerWeapon: Math.min(3, Math.max(0, record.powerWeapon)),
      hard: record.hard !== 0,
    };
  }

  function pickMonster(event: Event) {
    monsterId = (event.currentTarget as HTMLSelectElement).value;
    const picked = allMonsters().find((entry) => entry.id === monsterId) ?? first;
    const home = homeFloor(picked);
    module = home.module;
    floor = home.floor;
    level = monsterLevelBase(home.floor, home.module);
  }

  /** An empty number input reads as NaN, which would spread through every result. */
  function whole(value: number, least: number): number {
    return Number.isFinite(value) ? Math.max(least, Math.round(value)) : least;
  }

  const number = (value: number) => Math.round(value).toLocaleString();
  const percent = (share: number) => `${(100 * share).toFixed(1)}%`;
  const damage = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  /** A fraction of a hit point still tells you something when a kill costs you almost none. */
  const hpLost = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: value < 10 ? 1 : 0 });
  const swings = (count: number | null) => (count === null ? 'never' : count.toLocaleString());

  const barLabel = (index: number) => {
    const bar = report.yours.bars[index];
    return bar.from === bar.to ? String(bar.from) : `${bar.from}–${bar.to}`;
  };

  const barTooltip = (index: number) => {
    const bar = report.yours.bars[index];
    const span = bar.from === bar.to ? `${bar.from} damage` : `${bar.from}–${bar.to} damage`;
    return `${span}: ${(100 * bar.p).toFixed(1)}% of hits`;
  };
</script>

<div class="page">
  <section>
    <SectionHeading title="Character" />
    <div class="fields">
      <label>
        <span>Level</span>
        <input type="number" min="0" bind:value={character.lev} />
      </label>
      <label>
        <span>Class</span>
        <select bind:value={character.cls}>
          {#each data.classes as entry}
            <option value={entry.id}>{entry.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span>Strength</span>
        <input type="number" bind:value={character.str} />
      </label>
      <label>
        <span>Intelligence</span>
        <input type="number" bind:value={character.iq} />
      </label>
      <label>
        <span>Wisdom</span>
        <input type="number" bind:value={character.wis} />
      </label>
      <label>
        <span>Constitution</span>
        <input type="number" bind:value={character.con} />
      </label>
      <label>
        <span>Agility</span>
        <input type="number" bind:value={character.dex} />
      </label>
      <label>
        <span>Luck</span>
        <input type="number" bind:value={character.luck} />
      </label>
      <label>
        <span>Lucky charms</span>
        <input type="number" min="0" bind:value={character.luckyCharms} />
      </label>
      <label>
        <span>Difficulty</span>
        <select bind:value={character.hard}>
          <option value={false}>Normal</option>
          <option value={true}>I can handle anything!</option>
        </select>
      </label>
    </div>
    <div class="load">
      <button type="button" class="ghost" disabled={!canUseLoaded} onclick={useLoadedCharacter}>Use loaded character</button>
      {#if !canUseLoaded}
        <span class="note">Load a Dungeons of the Unforgiven save in the Save Editor to fill these in.</span>
      {/if}
    </div>
  </section>

  <section>
    <SectionHeading title="Weapon and armor" />
    <div class="fields">
      <label>
        <span>Weapon</span>
        <select bind:value={character.weapon}>
          {#each WEAPONS as weapon}
            <option value={weapon.id}>{weapon.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span>Plus</span>
        <input type="number" min="0" bind:value={character.weaponPlus} />
      </label>
      <label>
        <span>Temporary plus</span>
        <input type="number" min="0" bind:value={character.tempWeaponPlus} />
      </label>
      <label>
        <span>Gauntlet</span>
        <input type="number" min="0" bind:value={character.gauntlet} />
      </label>
      <label>
        <span>Armor</span>
        <select bind:value={character.armor}>
          {#each ARMORS as armor}
            <option value={armor.id}>{armor.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span>Plus</span>
        <input type="number" min="0" bind:value={character.armorPlus} />
      </label>
      <label>
        <span>Temporary plus</span>
        <input type="number" min="0" bind:value={character.tempArmorPlus} />
      </label>
      <label>
        <span>Body armor</span>
        <input type="number" min="0" bind:value={character.bodyArmor} />
      </label>
      <label>
        <span>Ring of protection</span>
        <input type="number" min="0" bind:value={character.protRing} />
      </label>
    </div>
    <p class="note">
      A weapon's plus only helps you hit; the damage die is the weapon's own. Armor's permanent plus is only ever
      printed — the game's defence roll never reads it — so it changes none of the numbers below.
    </p>
  </section>

  <section>
    <SectionHeading title="Spells" />
    <div class="fields">
      <label>
        <span>Protection spell</span>
        <select bind:value={character.protection}>
          {#each PROTECTIONS as name, index}
            <option value={index}>{name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span>Power weapon</span>
        <select bind:value={character.powerWeapon}>
          <option value={0}>None</option>
          {#each POWER_WEAPONS as spell}
            <option value={spell}>Power Weapon {spell}</option>
          {/each}
        </select>
      </label>
    </div>
    <p class="note">A power weapon rolls its own damage die and leaves the weapon in your hand its to-hit, its plus and its speed.</p>
  </section>

  <section>
    <SectionHeading title="Monster" />
    <div class="fields">
      <label class="wide">
        <span>Monster</span>
        <select value={monsterId} onchange={pickMonster}>
          {#each groups as group}
            <optgroup label={group.label}>
              {#each group.monsters as entry}
                <option value={entry.id}>{entry.name}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </label>
    </div>
    <div class="where">
      {#key monsterId}
        <LevelControl entry={monster} bind:module bind:floor bind:baseLevel={level} freeLevel />
      {/key}
    </div>
    <p class="note">The level starts where the floor stocks it, but the stocking roll can nudge it a few either way.</p>
  </section>

  <section>
    <SectionHeading title="Your attacks">
      <SourceLink ts={{ file: 'src/lib/game/port/combat.ts', name: 'strike' }} c="strike" />
    </SectionHeading>
    <table>
      <tbody>
        <tr><td>Hit chance</td><td>{percent(report.yours.hitChance)}</td></tr>
        <tr><td>Damage per swing</td><td>{damage(report.yours.meanDamage)}</td></tr>
        <tr><td>Damage per hit</td><td>{damage(report.yours.meanDamageOnHit)}</td></tr>
        <tr>
          <td>Swings to kill</td>
          <td>{swings(report.swingsToKill.middle)} ({swings(report.swingsToKill.least)}–{swings(report.swingsToKill.most)})</td>
        </tr>
        <tr><td>Seconds per swing</td><td>{number(report.secondsPerSwing)}</td></tr>
      </tbody>
    </table>
    <BarChart
      labels={report.yours.bars.map((_, index) => barLabel(index))}
      values={report.yours.bars.map((bar) => 100 * bar.p)}
      tooltip={barTooltip}
      xLabel="Damage when you hit"
    />
    <p class="note">
      Both sides are 20,000 rolls of the game's own combat code. Swings to kill counts a monster with the middle of the
      {number(report.swingsToKill.hp[0])}–{number(report.swingsToKill.hp[1])} hit points this floor can stock it with; the brackets are the
      fewest and the most.
    </p>
  </section>

  <section>
    <SectionHeading title="Its attacks">
      <SourceLink ts={{ file: 'src/lib/game/port/combat.ts', name: 'defend' }} c="defend" />
    </SectionHeading>
    <table>
      <tbody>
        <tr><td>Its hit chance</td><td>{percent(report.its.hitChance)}</td></tr>
        <tr><td>Its damage per attack</td><td>{damage(report.its.meanDamage)}</td></tr>
        <tr>
          <td>Breath damage</td>
          <td>
            {#if report.breath}
              {report.breath.least}–{report.breath.most} ({report.breath.resistedLeast}–{report.breath.resistedMost} resisted)
            {:else}
              —
            {/if}
          </td>
        </tr>
        <tr><td>Seconds between its attacks</td><td>{number(report.secondsBetweenItsAttacks)}</td></tr>
        <tr><td>Its attacks per swing of yours</td><td>{report.itsAttacksPerSwing.toFixed(2)}</td></tr>
        <tr><td>HP lost per kill</td><td>{report.hpLostPerKill === null ? 'never' : hpLost(report.hpLostPerKill)}</td></tr>
      </tbody>
    </table>
    {#if report.breath}
      <p class="note">A breather breathes instead of striking half the time, which ignores your armor and every protection you have up.</p>
    {/if}
    <p class="note">HP lost per kill takes every attack it gets while you swing, with no resist up and nothing to heal you.</p>
  </section>

  <section>
    <SectionHeading title="Spells against it" />
    <table>
      <tbody>
        <tr><td>Sleep</td><td>{percent(report.spells.sleep)}</td></tr>
        <tr>
          <td>Drain Monster</td>
          <td>
            {#if report.spells.drainMonster === null}
              —
            {:else}
              {report.spells.drainMonster ? 'Kills it' : 'Only weakens it'}
            {/if}
          </td>
        </tr>
        <tr><td>Autokill</td><td>{report.spells.autokill === null ? '—' : percent(report.spells.autokill)}</td></tr>
      </tbody>
    </table>
    <p class="note">Shadow bosses shrug off Go Away, Autokill and Drain Monster. Sleep never checks for one, so it works.</p>
  </section>
</div>

<style>
  .load {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
  }
  .load .note {
    margin: 0;
  }
  .fields {
    margin-bottom: 14px;
  }
  .where {
    max-width: 560px;
  }
  .page .fields label.wide {
    width: 360px;
  }
</style>
