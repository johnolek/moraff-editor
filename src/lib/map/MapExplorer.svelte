<script lang="ts">
  import { bundledDungeon } from '../game/dungeon';
  import { floorsOfModule } from '../game/floor-summary';
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import FloorCanvas from './FloorCanvas.svelte';

  const MODULE_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

  let moduleIndex = $state(0);
  let floor = $state(0);

  const floors = $derived(floorsOfModule(moduleIndex));
  const rows = $derived(bundledDungeon.floor(floor, moduleIndex));

  function changeModule(event: Event) {
    moduleIndex = Number((event.currentTarget as HTMLSelectElement).value);
    floor = Math.min(floor, BOTTOM_LEVEL[moduleIndex]);
  }

  function changeFloor(event: Event) {
    floor = Number((event.currentTarget as HTMLSelectElement).value);
  }
</script>

<div class="explorer">
  <div class="viewport">
    <FloorCanvas {rows} {floor} />
  </div>
  <aside class="panel">
    <label>
      <span>Module</span>
      <select value={moduleIndex} onchange={changeModule}>
        {#each MODULE_NUMERALS as numeral, index}
          <option value={index}>{numeral}</option>
        {/each}
      </select>
    </label>
    <label>
      <span>Floor</span>
      <select value={floor} onchange={changeFloor}>
        {#each floors as level}
          <option value={level}>{level === 0 ? '0 · Town' : level}</option>
        {/each}
      </select>
    </label>
  </aside>
</div>

<style>
  .explorer {
    display: flex;
    flex: 1;
    min-height: 0;
  }
  .viewport {
    flex: 1;
    overflow: auto;
    background: #710000;
  }
  .panel {
    width: 280px;
    flex-shrink: 0;
    border-left: 1px solid var(--line);
    background: var(--panel);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--muted);
  }
  select {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
  }
</style>
