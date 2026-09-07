<script lang="ts">
  import { app } from '../app-state.svelte';
  import data from '../game/dotu-data.json';
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import BarChart from '../ui/BarChart.svelte';
  import SourceLink from '../source/SourceLink.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { currentCharacter } from './character';
  import DropTable from './DropTable.svelte';
  import { dropTables, WEAPON_NAMES } from './drops';
  import FloorPicker from './FloorPicker.svelte';

  const FIGHTER = 0;
  const MONK = 2;
  /** Levels rarer than this are left off the chart; the level nudge has a very long tail. */
  const RARE_LEVEL = 0.0005;

  let module = $state(0);
  let floor = $state(1);
  let cls = $state(FIGHTER);
  let killsPerMinute = $state(2);
  let ownedWeapons = $state<number[]>([]);

  const tables = $derived(dropTables({ module, floor, cls, ownedWeapons }));
  const levels = $derived(tables.levels.filter(([, chance]) => chance >= RARE_LEVEL));
  const canUseLoaded = $derived(Boolean(currentCharacter()));

  // Start from whatever character is current, and follow it when another one is picked.
  $effect(() => {
    void app.characterVersion;
    useLoadedCharacter();
  });

  function useLoadedCharacter() {
    const record = currentCharacter();
    if (!record) return;
    cls = Math.min(6, Math.max(0, record.cls));
    module = record.module;
    floor = Math.min(Math.max(1, record.level), BOTTOM_LEVEL[record.module]);
    ownedWeapons = WEAPON_NAMES.map((_, index) => index + 1).filter((id) => record.weaponsOwned[id] > 0);
  }

  function toggleWeapon(id: number, owned: boolean) {
    ownedWeapons = owned ? [...ownedWeapons, id] : ownedWeapons.filter((other) => other !== id);
  }

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;
</script>

<div class="page">
  <section>
    <SectionHeading title="Where" />
    <div class="fields">
      <FloorPicker bind:module bind:floor />
    </div>
    <BarChart
      labels={levels.map(([level]) => String(level))}
      values={levels.map(([, chance]) => chance * 100)}
      tooltip={(index) => `Level ${levels[index][0]}: ${percent(levels[index][1])}`}
      xLabel="Level the floor stocks monsters at"
    />
    <p class="note">Only the weapon and armor rolls read the monster's level; everything else reads the floor.</p>
  </section>

  <section>
    <SectionHeading title="Character" />
    <div class="fields">
      <label>
        <span>Class</span>
        <select bind:value={cls}>
          {#each data.classes as entry}
            <option value={entry.id}>{entry.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span>Kills per minute</span>
        <input type="number" min="0" step="0.5" bind:value={killsPerMinute} />
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
    <SectionHeading title="Weapons">
      <SourceLink ts={{ file: 'src/lib/game/dotu-mech.js', name: 'dropOdds' }} c="drop_weapon" />
    </SectionHeading>
    <div class="owned">
      <span class="owned-label">Already owned</span>
      {#each WEAPON_NAMES as name, index}
        <label>
          <input
            type="checkbox"
            checked={ownedWeapons.includes(index + 1)}
            onchange={(event) => toggleWeapon(index + 1, event.currentTarget.checked)}
          />
          {name}
        </label>
      {/each}
    </div>
    <DropTable rows={tables.weapons} {killsPerMinute} />
    {#if cls === MONK}
      <p class="note">Monks never find gear.</p>
    {/if}
  </section>

  <section>
    <SectionHeading title="Armor">
      <SourceLink ts={{ file: 'src/lib/game/dotu-mech.js', name: 'dropOdds' }} c="drop_armor" />
    </SectionHeading>
    <DropTable rows={tables.armors} {killsPerMinute} />
    {#if cls === MONK}
      <p class="note">Monks never find gear.</p>
    {:else}
      <p class="note">Armor drops even when you already own one.</p>
    {/if}
  </section>

  <section>
    <SectionHeading title="Items">
      <SourceLink ts={{ file: 'src/lib/game/dotu-mech.js', name: 'dropOdds' }} c="find_item" />
    </SectionHeading>
    <DropTable rows={tables.items} {killsPerMinute} />
    <p class="note">
      YOU FIND check passes {percent(tables.findGate)} of the time on this floor. One check in three finds nothing, and the rest is shared
      equally between the twelve items.
    </p>
    {#if cls === MONK}
      <p class="note">Monks never find gear.</p>
    {/if}
  </section>

  <section>
    <SectionHeading title="Level drainer kills">
      <SourceLink ts={{ file: 'src/lib/calculators/drops.ts', name: 'drainerShare' }} c="kill_monster" />
    </SectionHeading>
    <DropTable rows={tables.drainer} {killsPerMinute} />
    {#if tables.drainerShare > 0}
      <p class="note">
        Only the section's level drainer leaves these, and about one monster in {Math.round(1 / tables.drainerShare)} is one. The key is
        this floor's own, and only drops while you are without it.
      </p>
    {:else}
      <p class="note">This section's drainer takes experience instead of a level, so its kills leave nothing.</p>
    {/if}
  </section>

  <section>
    <SectionHeading title="Spells">
      <SourceLink ts={{ file: 'src/lib/game/dotu-mech.js', name: 'dropOdds' }} c="drop_spellbook" />
    </SectionHeading>
    <DropTable rows={tables.spells} {killsPerMinute} />
    <p class="note">A spell book only teaches you a spell you do not know yet, and scrolls, wands and papers are only rolled when no book was learned.</p>
    {#if cls === FIGHTER}
      <p class="note">Fighters can only read papers.</p>
    {/if}
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
  .owned-label {
    font-size: 12px;
    color: var(--muted);
  }
</style>
