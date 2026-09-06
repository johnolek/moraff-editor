<script lang="ts">
  import { onMount } from 'svelte';
  import { bundledDungeon } from '../game/dungeon';
  import { floorBounds, floorsOfModule, summarizeFloor } from '../game/floor-summary';
  import { sectionInfo } from '../game/sections';
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import { MAP_COLUMNS, MAP_ROWS } from './area';
  import { downloadFloorPng } from './export-png';
  import { describeMonster, describeNote, describeSquare } from './describe';
  import FloorCanvas, { type Tooltip } from './FloorCanvas.svelte';
  import FloorMonsters from './FloorMonsters.svelte';
  import { jumpTarget, squareFeature, teleporterTargets } from './floor-info';
  import { FLOOR_MAX, FLOOR_MIN, HistoryCursor, isMapHistoryState, type MapHistoryState, type MapPlace } from './history';
  import { keyAction } from './keyboard';
  import { MODULE_NUMERALS } from './labels';
  import Legend from './Legend.svelte';
  import Notable from './Notable.svelte';
  import { dungeonLookup, notableSquares, squareNotes } from './notes';
  import { hasTeleporterSide, pathToNearestTeleporter, type Route } from './path';
  import { randomOpenSquare } from './relocate';
  import Selection from './Selection.svelte';
  import { squaresOfKind, type LegendKind, type Mark } from './marks';
  import SquareInfo from './SquareInfo.svelte';
  import { teleporterSegments } from './teleporters';
  import { monsterAt, stockFloor, stockingSection, type StockedMonster } from './stocking';
  import type { Point } from './viewport';
  import { nearestOpenSquare } from './you';

  let moduleIndex = $state(0);
  let floor = $state(0);
  /** Lets the map be pointed at floors the module does not have, the way the game's own
   *  16-bit floor variable can be. */
  let anyFloor = $state(false);
  let cursor = $state<Point | null>(null);
  /** Where the party stands. Every way of changing floor moves it, so it is always on the
   *  floor being looked at, or nowhere at all. */
  let you = $state<Point | null>(null);
  let highlight = $state<Point | null>(null);
  let legendHover = $state<LegendKind | null>(null);
  let legendPinned = $state<{ label: string; kind: LegendKind } | null>(null);
  let monsterHover = $state<string | null>(null);
  let monsterPinned = $state<string | null>(null);
  let selected = $state<Point | null>(null);
  /** undefined: not asked yet; null: asked, nothing reachable. */
  let route = $state<Route | null | undefined>(undefined);
  let historyCursor = $state(new HistoryCursor());
  /** Stocked floors by "module:floor", kept while other floors are browsed. */
  let stocked = $state(new Map<string, StockedMonster[]>());
  let floorCanvas: FloorCanvas;

  const floors = $derived(floorsOfModule(moduleIndex));
  const floorRange = $derived(anyFloor ? { lowest: FLOOR_MIN, highest: FLOOR_MAX } : { lowest: 0, highest: BOTTOM_LEVEL[moduleIndex] });
  const rows = $derived(bundledDungeon.floor(floor, moduleIndex));
  const summary = $derived(summarizeFloor(bundledDungeon, floor, moduleIndex, MAP_ROWS));
  const bounds = $derived(floorBounds(rows, MAP_ROWS));
  const lookup = $derived(dungeonLookup(bundledDungeon, moduleIndex));
  const notable = $derived(notableSquares(lookup, floor, rows));
  const section = $derived(sectionInfo(moduleIndex, floor));
  const stockKey = $derived(`${moduleIndex}:${floor}`);
  const canStock = $derived(stockingSection(moduleIndex, floor) !== null);
  const monsters = $derived(stocked.get(stockKey) ?? []);
  const cursorSquare = $derived(cursor ? rows[cursor.y][cursor.x] : null);
  const cursorFeature = $derived(cursor && cursorSquare ? squareFeature(bundledDungeon, moduleIndex, floor, cursorSquare, cursor.x, cursor.y) : null);
  const cursorDescription = $derived(cursor && cursorSquare ? describeSquare(cursorSquare, cursorFeature, cursor.x, cursor.y, moduleIndex) : null);
  const cursorNotes = $derived(cursor && cursorSquare ? squareNotes(lookup, floor, cursorSquare, cursor.x, cursor.y).map(describeNote) : []);
  const cursorMonster = $derived(cursor ? monsterAt(monsters, cursor.x, cursor.y) : null);
  const selectedMonster = $derived(selected ? monsterAt(monsters, selected.x, selected.y) : null);
  const tooltip = $derived<Tooltip | null>(
    cursorDescription
      ? {
          title: `${cursor!.x}, ${cursor!.y}`,
          feature: cursorDescription.rock ? 'Rock' : cursorDescription.feature,
          monster: cursorMonster && describeMonster(cursorMonster),
          notes: cursorNotes,
        }
      : null,
  );
  const teleporterModules = $derived(selected && hasTeleporterSide(rows[selected.y][selected.x]) ? teleporterTargets(moduleIndex) : []);
  const floorHasTeleporter = $derived(teleporterSegments(rows).length > 0);
  /** What the map marks: whichever of the legend and the monster list the pointer is over,
   *  and otherwise the one entry a click pinned. */
  const marked = $derived<{ from: 'legend'; kind: LegendKind } | { from: 'monsters'; monsterId: string } | null>(
    legendHover
      ? { from: 'legend', kind: legendHover }
      : monsterHover
        ? { from: 'monsters', monsterId: monsterHover }
        : legendPinned
          ? { from: 'legend', kind: legendPinned.kind }
          : monsterPinned
            ? { from: 'monsters', monsterId: monsterPinned }
            : null,
  );
  const marks = $derived(!marked ? [] : marked.from === 'legend' ? squaresOfKind(rows, floor, marked.kind) : squaresOfMonster(marked.monsterId));

  onMount(() => {
    const state = history.state;
    if (isMapHistoryState(state)) {
      historyCursor = historyCursor.movedTo(state.index);
      applyPlace(state.place);
      return;
    }
    history.replaceState(entry(0, { module: moduleIndex, floor, square: null, you }), '');
  });

  /** The browser structured-clones what it stores, and Svelte's state proxies cannot be cloned, so
   *  the place is snapshotted into plain objects first. */
  function entry(index: number, place: MapPlace): MapHistoryState {
    return $state.snapshot({ kind: 'map-place', index, place });
  }

  /** Go to another floor and leave a history entry behind, so the browser's Back button returns to
   *  `fromSquare` on the floor being left. */
  function travel(place: MapPlace, fromSquare: Point | null) {
    history.replaceState(entry(historyCursor.current, { module: moduleIndex, floor, square: fromSquare, you }), '');
    history.pushState(entry(historyCursor.current + 1, place), '');
    historyCursor = historyCursor.pushed();
    applyPlace(place);
  }

  function applyPlace(place: MapPlace) {
    // A history entry can name a floor the module does not have, and only the override shows one.
    if (place.floor < 0 || place.floor > BOTTOM_LEVEL[place.module]) anyFloor = true;
    moduleIndex = place.module;
    floor = place.floor;
    you = place.you ?? null;
    highlight = place.square;
    clearSelection();
    if (place.square) {
      cursor = place.square;
      floorCanvas.reveal(place.square);
    }
  }

  function onPopState(event: PopStateEvent) {
    if (!isMapHistoryState(event.state)) return;
    historyCursor = historyCursor.movedTo(event.state.index);
    applyPlace(event.state.place);
  }

  function changeModule(event: Event) {
    const module = Number((event.currentTarget as HTMLSelectElement).value);
    const level = anyFloor ? floor : Math.min(floor, BOTTOM_LEVEL[module]);
    travel({ module, floor: level, square: null, you: youOn(module, level) }, cursor);
  }

  function changeFloor(event: Event) {
    showFloor(Number((event.currentTarget as HTMLSelectElement).value));
  }

  /** Enter is how a typed floor is expected to be taken; on its own the box waits to lose focus. */
  function takeFloorOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') typeFloor(event);
  }

  function typeFloor(event: Event) {
    const typed = Math.trunc(Number((event.currentTarget as HTMLInputElement).value));
    if (!Number.isFinite(typed)) return;
    const level = Math.max(FLOOR_MIN, Math.min(FLOOR_MAX, typed));
    if (level !== floor) showFloor(level);
  }

  /** Turning the override off brings the map back to a floor the module has. */
  function toggleAnyFloor(event: Event) {
    anyFloor = (event.currentTarget as HTMLInputElement).checked;
    if (anyFloor) return;
    const level = Math.max(0, Math.min(BOTTOM_LEVEL[moduleIndex], floor));
    if (level !== floor) showFloor(level);
  }

  function showFloor(level: number) {
    travel({ module: moduleIndex, floor: level, square: null, you: youOn(moduleIndex, level) }, cursor);
  }

  /** Changing floor walks the party to the nearest square it can stand on. It stays nowhere
   *  if it was nowhere. */
  function youOn(module: number, level: number): Point | null {
    return you && nearestOpenSquare(bundledDungeon.floor(level, module), you);
  }

  /** Moving yourself by hand also rewrites the current history entry, so Back and Forward
   *  bring you back to this spot rather than to wherever the last travel left you. */
  function imHere() {
    if (!selected) return;
    you = selected;
    history.replaceState(entry(historyCursor.current, { module: moduleIndex, floor, square: highlight, you }), '');
  }

  function pick(square: Point) {
    cursor = square;
    floorCanvas.reveal(square);
  }

  function stockThisFloor() {
    stocked = new Map(stocked).set(stockKey, stockFloor(rows, moduleIndex, floor, Math.random));
  }

  function clearMonsters() {
    const rest = new Map(stocked);
    rest.delete(stockKey);
    stocked = rest;
  }

  function squaresOfMonster(monsterId: string): Mark[] {
    return monsters.filter((monster) => monster.monsterId === monsterId).map(({ x, y }) => ({ x, y, label: null }));
  }

  /** The map marks one thing at a time, so pinning from the legend drops a pinned monster
   *  type and the other way round. */
  function pinLegendEntry(label: string | null, kind: LegendKind | null) {
    legendPinned = label && kind ? { label, kind } : null;
    if (legendPinned) monsterPinned = null;
  }

  function pinMonster(monsterId: string | null) {
    monsterPinned = monsterId;
    if (monsterPinned) legendPinned = null;
  }

  function clearSelection() {
    selected = null;
    route = undefined;
  }

  /** Taking a teleporter lands the party somewhere random in the destination town. */
  function takeTeleporter(module: number) {
    const landing = randomOpenSquare(bundledDungeon.floor(0, module), Math.random);
    travel({ module, floor: 0, square: landing, you: landing }, selected);
  }

  function routeToTeleporter(passWall: boolean) {
    if (selected) route = pathToNearestTeleporter(rows, selected, passWall);
  }

  function stepFloor(delta: number) {
    const level = Math.max(floorRange.lowest, Math.min(floorRange.highest, floor + delta));
    if (level !== floor) showFloor(level);
  }

  function moveCursor(dx: number, dy: number) {
    const from = cursor ?? { x: MAP_COLUMNS >> 1, y: MAP_ROWS >> 1 };
    cursor = {
      x: Math.max(0, Math.min(MAP_COLUMNS - 1, from.x + dx)),
      y: Math.max(0, Math.min(MAP_ROWS - 1, from.y + dy)),
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

  /** Clicking a ladder, chute or trap door goes to the floor it leads to and marks the landing
   *  square; clicking any other open square selects it. A monster standing on the square comes
   *  first either way: a click on a monster is aimed at the monster, not at the floor below it. */
  function follow(square: Point) {
    const monster = monsterAt(monsters, square.x, square.y);
    const target = monster ? null : jumpTarget(bundledDungeon, moduleIndex, floor, rows[square.y][square.x], square.x, square.y);
    if (!target) {
      if (!rows[square.y][square.x].solid) {
        selected = square;
        route = undefined;
      }
      return;
    }
    const landing = { x: target.x, y: target.y };
    travel({ module: moduleIndex, floor: target.floor, square: landing, you: landing }, square);
  }
</script>

<svelte:window onkeydown={onKeydown} onpopstate={onPopState} />

<div class="explorer">
  <div class="map">
    <div class="floor-header">
      <span class="where">Module {MODULE_NUMERALS[moduleIndex]} · {floor === 0 ? 'Town' : `Floor ${floor}`}</span>
      <span class="section">
        {#if section}
          Section {section.section} · {section.bossName} on floor {section.bossFloor}
        {:else}
          Section ?
        {/if}
      </span>
    </div>
    <div class="viewport">
      <FloorCanvas bind:this={floorCanvas} {rows} {floor} {moduleIndex} {monsters} {bounds} bind:cursor {highlight} {you} {marks} {selected} route={route ?? null} {tooltip} onselect={follow} />
    </div>
  </div>
  <aside class="panel">
    <div class="controls">
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
          {#if anyFloor}
            <input type="number" min={FLOOR_MIN} max={FLOOR_MAX} step="1" value={floor} onchange={typeFloor} onkeydown={takeFloorOnEnter} />
          {:else}
            <select value={floor} onchange={changeFloor}>
              {#each floors as level}
                <option value={level}>{level === 0 ? '0 · Town' : level}</option>
              {/each}
            </select>
          {/if}
        </label>
        <label class="toggle">
          <input type="checkbox" checked={anyFloor} onchange={toggleAnyFloor} />
          <span>Any floor</span>
        </label>
        <button class="ghost" onclick={() => stepFloor(-1)} disabled={floor === floorRange.lowest}>▲ Floor up</button>
        <button class="ghost" onclick={() => stepFloor(1)} disabled={floor === floorRange.highest}>▼ Floor down</button>
        <button class="ghost" onclick={() => history.back()} disabled={!historyCursor.canGoBack}>◀ Back</button>
        <button class="ghost" onclick={() => history.forward()} disabled={!historyCursor.canGoForward}>Forward ▶</button>
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
    </div>
    <SquareInfo description={cursorDescription} notes={cursorNotes} />
    <Selection
      {selected}
      {route}
      monster={selectedMonster}
      {floorHasTeleporter}
      {teleporterModules}
      onroute={routeToTeleporter}
      onhere={imHere}
      onclear={clearSelection}
      ontake={takeTeleporter}
    />
    <FloorMonsters
      {monsters}
      town={floor === 0}
      {canStock}
      pinned={monsterPinned}
      onstock={stockThisFloor}
      onclear={clearMonsters}
      onhover={(monsterId) => (monsterHover = monsterId)}
      onpin={pinMonster}
    />
    <Legend
      {summary}
      pinned={legendPinned?.label ?? null}
      onhover={(kind) => (legendHover = kind)}
      onpin={pinLegendEntry}
    />
    <Notable {notable} onpick={pick} />
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
  .controls {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: -16px -16px 0;
    padding: 16px 16px 12px;
    background: var(--panel);
    border-bottom: 1px solid var(--line);
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
  select,
  input[type='number'] {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
    min-width: 0;
  }
  .toggle {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    gap: 6px;
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
