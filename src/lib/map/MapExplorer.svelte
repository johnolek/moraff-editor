<script lang="ts">
  import { bundledDungeon } from '../game/dungeon';
  import { floorsOfModule } from '../game/floor-summary';
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import FloorCanvas from './FloorCanvas.svelte';
  import { squareFeature } from './floor-info';
  import { MODULE_NUMERALS } from './labels';
  import SquareInfo from './SquareInfo.svelte';
  import type { Point } from './viewport';

  let moduleIndex = $state(0);
  let floor = $state(0);
  let cursor = $state<Point | null>(null);
  let floorCanvas: FloorCanvas;

  const floors = $derived(floorsOfModule(moduleIndex));
  const rows = $derived(bundledDungeon.floor(floor, moduleIndex));
  const cursorSquare = $derived(cursor ? rows[cursor.y][cursor.x] : null);
  const cursorFeature = $derived(cursor && cursorSquare ? squareFeature(bundledDungeon, moduleIndex, floor, cursorSquare, cursor.x, cursor.y) : null);

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
    <FloorCanvas bind:this={floorCanvas} {rows} {floor} bind:cursor />
  </div>
  <aside class="panel">
    <div class="pickers">
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
    </div>
    <div class="zoom">
      <button class="ghost" onclick={() => floorCanvas.zoomOut()} title="Zoom out">−</button>
      <button class="ghost" onclick={() => floorCanvas.zoomIn()} title="Zoom in">+</button>
      <button class="ghost" onclick={() => floorCanvas.fit()}>Fit</button>
    </div>
    <SquareInfo {cursor} square={cursorSquare} feature={cursorFeature} {moduleIndex} />
  </aside>
</div>

<style>
  .explorer {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .viewport {
    flex: 1;
    min-width: 0;
  }
  .panel {
    width: 280px;
    flex-shrink: 0;
    border-left: 1px solid var(--line);
    background: var(--panel);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }
  .pickers {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
  .zoom {
    display: flex;
    gap: 6px;
  }
  button.ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 12px;
    font: inherit;
    cursor: pointer;
  }
  button.ghost:hover {
    color: var(--ink);
    border-color: var(--accent);
  }
</style>
