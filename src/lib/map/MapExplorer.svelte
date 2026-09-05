<script lang="ts">
  import { bundledDungeon } from '../game/dungeon';
  import { floorBounds, floorsOfModule, summarizeFloor } from '../game/floor-summary';
  import { sectionInfo } from '../game/sections';
  import { BOTTOM_LEVEL, HEIGHT, WIDTH } from '../game/unfmap.js';
  import { downloadFloorPng } from './export-png';
  import { compactSides, describeSquare } from './describe';
  import FloorCanvas, { type Tooltip } from './FloorCanvas.svelte';
  import { jumpTarget, squareFeature } from './floor-info';
  import FloorStats from './FloorStats.svelte';
  import { keyAction } from './keyboard';
  import { MODULE_NUMERALS } from './labels';
  import Legend from './Legend.svelte';
  import { squaresOfKind, type LegendKind } from './marks';
  import SquareInfo from './SquareInfo.svelte';
  import type { Point } from './viewport';

  let moduleIndex = $state(0);
  let floor = $state(0);
  let cursor = $state<Point | null>(null);
  let highlight = $state<Point | null>(null);
  let legendHover = $state<LegendKind | null>(null);
  let floorCanvas: FloorCanvas;

  const floors = $derived(floorsOfModule(moduleIndex));
  const rows = $derived(bundledDungeon.floor(floor, moduleIndex));
  const summary = $derived(summarizeFloor(bundledDungeon, floor, moduleIndex));
  const bounds = $derived(floorBounds(rows));
  const section = $derived(sectionInfo(moduleIndex, floor));
  const cursorSquare = $derived(cursor ? rows[cursor.y][cursor.x] : null);
  const cursorFeature = $derived(cursor && cursorSquare ? squareFeature(bundledDungeon, moduleIndex, floor, cursorSquare, cursor.x, cursor.y) : null);
  const cursorDescription = $derived(cursor && cursorSquare ? describeSquare(cursorSquare, cursorFeature, cursor.x, cursor.y, moduleIndex) : null);
  const tooltip = $derived<Tooltip | null>(
    cursorDescription
      ? { title: `${cursor!.x}, ${cursor!.y}`, feature: cursorDescription.rock ? 'Rock' : cursorDescription.feature, sides: compactSides(cursorDescription) }
      : null,
  );
  const marks = $derived(legendHover ? squaresOfKind(rows, floor, legendHover) : []);

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

  function stepFloor(delta: number) {
    showFloor(Math.max(0, Math.min(BOTTOM_LEVEL[moduleIndex], floor + delta)));
  }

  function moveCursor(dx: number, dy: number) {
    const from = cursor ?? { x: WIDTH >> 1, y: HEIGHT >> 1 };
    cursor = {
      x: Math.max(0, Math.min(WIDTH - 1, from.x + dx)),
      y: Math.max(0, Math.min(HEIGHT - 1, from.y + dy)),
    };
    floorCanvas.reveal(cursor);
  }

  function onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
    const action = keyAction(event.key);
    if (!action) return;
    event.preventDefault();
    switch (action.kind) {
      case 'move':
        moveCursor(action.dx, action.dy);
        break;
      case 'floor':
        stepFloor(action.delta);
        break;
      case 'follow':
        if (cursor) follow(cursor);
        break;
      case 'zoom':
        action.direction > 0 ? floorCanvas.zoomIn() : floorCanvas.zoomOut();
        break;
    }
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

<svelte:window onkeydown={onKeydown} />

<div class="explorer">
  <div class="map">
    <div class="floor-header">
      <span class="where">Module {MODULE_NUMERALS[moduleIndex]} · {floor === 0 ? 'Town' : `Floor ${floor}`}</span>
      <span class="section">Section {section.section} · {section.bossName} on floor {section.bossFloor}</span>
    </div>
    <div class="viewport">
      <FloorCanvas bind:this={floorCanvas} {rows} {floor} {bounds} bind:cursor {highlight} {marks} {tooltip} onselect={follow} />
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
      <button class="ghost" onclick={() => stepFloor(-1)} disabled={floor === 0}>▲ Floor up</button>
      <button class="ghost" onclick={() => stepFloor(1)} disabled={floor === BOTTOM_LEVEL[moduleIndex]}>▼ Floor down</button>
    </div>
    <div class="zoom">
      <button class="ghost" onclick={() => floorCanvas.zoomOut()} title="Zoom out">−</button>
      <button class="ghost" onclick={() => floorCanvas.zoomIn()} title="Zoom in">+</button>
      <button class="ghost" onclick={() => floorCanvas.fit()}>Fit</button>
      <button class="ghost" onclick={() => downloadFloorPng(rows, floor, moduleIndex)}>Export PNG</button>
    </div>
    <p class="hint">
      Drag to pan, scroll to zoom. Arrow keys move the cursor, PgUp/PgDn change floor, Enter follows a ladder,
      chute or trap door.
    </p>
    <SquareInfo description={cursorDescription} />
    <Legend onhover={(kind) => (legendHover = kind)} />
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
  .hint {
    margin: -8px 0 0;
    font-size: 11px;
    line-height: 1.4;
    color: var(--muted);
  }
  button.ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }
  button.ghost:hover:not(:disabled) {
    color: var(--ink);
    border-color: var(--accent);
  }
  button.ghost:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
