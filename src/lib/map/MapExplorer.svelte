<script lang="ts">
  import { bundledDungeon } from '../game/dungeon';
  import { floorsOfModule, summarizeFloor } from '../game/floor-summary';
  import { sectionInfo } from '../game/sections';
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import FloorCanvas from './FloorCanvas.svelte';
  import { jumpTarget, squareFeature } from './floor-info';
  import FloorStats from './FloorStats.svelte';
  import { MODULE_NUMERALS } from './labels';
  import Legend from './Legend.svelte';
  import SquareInfo from './SquareInfo.svelte';
  import type { Point } from './viewport';

  let moduleIndex = $state(0);
  let floor = $state(0);
  let cursor = $state<Point | null>(null);
  let highlight = $state<Point | null>(null);
  let floorCanvas: FloorCanvas;

  const floors = $derived(floorsOfModule(moduleIndex));
  const rows = $derived(bundledDungeon.floor(floor, moduleIndex));
  const summary = $derived(summarizeFloor(bundledDungeon, floor, moduleIndex));
  const section = $derived(sectionInfo(moduleIndex, floor));
  const cursorSquare = $derived(cursor ? rows[cursor.y][cursor.x] : null);
  const cursorFeature = $derived(cursor && cursorSquare ? squareFeature(bundledDungeon, moduleIndex, floor, cursorSquare, cursor.x, cursor.y) : null);

  function changeModule(event: Event) {
    moduleIndex = Number((event.currentTarget as HTMLSelectElement).value);
    showFloor(Math.min(floor, BOTTOM_LEVEL[moduleIndex]));
  }

  function changeFloor(event: Event) {
    showFloor(Number((event.currentTarget as HTMLSelectElement).value));
  }

  function showFloor(level: number) {
    floor = level;
    highlight = null;
  }

  /** Clicking a ladder, chute or trap door goes to the floor it leads to and marks the landing square. */
  function follow(square: Point) {
    const target = jumpTarget(bundledDungeon, moduleIndex, floor, rows[square.y][square.x], square.x, square.y);
    if (!target) return;
    floor = target.floor;
    highlight = { x: target.x, y: target.y };
    cursor = { x: target.x, y: target.y };
  }
</script>

<div class="explorer">
  <div class="map">
    <div class="floor-header">
      <span class="where">Module {MODULE_NUMERALS[moduleIndex]} · {floor === 0 ? 'Town' : `Floor ${floor}`}</span>
      <span class="section">Section {section.section} · {section.bossName} on floor {section.bossFloor}</span>
    </div>
    <div class="viewport">
      <FloorCanvas bind:this={floorCanvas} {rows} {floor} bind:cursor {highlight} onselect={follow} />
    </div>
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
    <Legend />
    <FloorStats {summary} />
  </aside>
</div>

<style>
  .explorer {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .map {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .floor-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 16px;
    font-size: 13px;
    border-bottom: 1px solid var(--line);
    background: var(--panel);
  }
  .where {
    color: var(--ink);
    font-weight: 600;
  }
  .section {
    color: var(--muted);
  }
  .viewport {
    flex: 1;
    min-height: 0;
  }
  .panel {
    width: 280px;
    flex-shrink: 0;
    border-left: 1px solid var(--line);
    background: var(--panel);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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
