<script lang="ts">
  import { untrack } from 'svelte';
  import { renderMonster } from '../bestiary/pictures';
  import { sectionInfo } from '../game/sections';
  import type { Square } from '../game/unfmap.js';
  import { drawFloor, drawMarks, drawOutline, drawRoute, squareRect } from './draw-floor';
  import { drawMonsters, type MonsterSprites } from './draw-monsters';
  import type { Mark } from './marks';
  import { palette } from './palette';
  import { monsterById, type StockedMonster } from './stocking';
  import { drawTeleporters, teleporterHue, teleporterSegments } from './teleporters';
  import { ensureVisible, fitFloor, pan, squareAt, wheelZoomFactor, zoomBy, zoomStep, type Bounds, type Point, type Viewport } from './viewport';

  export interface Tooltip {
    title: string;
    feature: string | null;
    /** The monster standing on the square, if the floor has been stocked. */
    monster?: string | null;
    notes: string[];
  }

  interface Props {
    rows: Square[][];
    floor: number;
    moduleIndex: number;
    /** Monsters stocked on this floor, drawn over the squares they stand on. */
    monsters?: StockedMonster[];
    /** Area "Fit" frames: the open squares of the floor. */
    bounds: Bounds;
    /** The square the info panel describes: follows the pointer, moved by the keyboard. */
    cursor?: Point | null;
    /** Landing square after a jump. */
    highlight?: Point | null;
    /** Squares emphasised while a legend entry is hovered. */
    marks?: Mark[];
    /** Square picked by clicking, and a walking route drawn from it. */
    selected?: Point | null;
    route?: Point[] | null;
    /** Details shown in a box beside the cursor square. */
    tooltip?: Tooltip | null;
    onselect?: (square: Point) => void;
  }

  let { rows, floor, moduleIndex, monsters = [], bounds, cursor = $bindable(null), highlight = null, marks = [], selected = null, route = null, tooltip = null, onselect }: Props = $props();

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let size = $state({ width: 0, height: 0 });
  let view = $state<Viewport>({ cell: 10, originX: 0, originY: 0 });
  let fitted = false;
  let dragging = $state(false);

  const DRAG_THRESHOLD_PX = 3;
  const TOOLTIP_WIDTH = 230;
  const TOOLTIP_GAP = 8;
  let drag: { startX: number; startY: number; origin: Viewport; moved: boolean } | null = null;

  const tooltipPosition = $derived.by(() => {
    if (!tooltip || !cursor || dragging) return null;
    const { x0, y0, w } = squareRect(view, cursor.x, cursor.y);
    const fitsRight = x0 + w + TOOLTIP_GAP + TOOLTIP_WIDTH <= size.width;
    return {
      left: fitsRight ? x0 + w + TOOLTIP_GAP : Math.max(0, x0 - TOOLTIP_GAP - TOOLTIP_WIDTH),
      top: Math.max(0, Math.min(size.height - 80, y0)),
    };
  });

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => {
      size = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (!fitted && size.width > 0) {
        view = fitFloor(size.width, size.height, bounds);
        fitted = true;
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  });

  $effect(() => {
    const listener = (event: WheelEvent) => {
      event.preventDefault();
      const point = canvasPoint(event);
      view = zoomBy(view, wheelZoomFactor(event.deltaY, event.deltaMode), point.x, point.y);
    };
    canvas.addEventListener('wheel', listener, { passive: false });
    return () => canvas.removeEventListener('wheel', listener);
  });

  $effect(() => {
    if (!highlight || !size.width) return;
    const target = highlight;
    const { width, height } = size;
    view = ensureVisible(untrack(() => view), target, width, height);
  });

  const teleporters = $derived(teleporterSegments(rows));
  const part = $derived(sectionInfo(moduleIndex, floor).part);

  // Monster pictures are drawn once each into an offscreen canvas and kept, since the same
  // few monsters stand all over a floor. A monster looks different in each section, so the
  // section's palette is part of the key.
  const pictures = new Map<string, HTMLCanvasElement>();

  const sprites: MonsterSprites = {
    isBoss: (id) => monsterById(id).isBoss,
    picture: (id) => {
      const key = `${id}:${moduleIndex}:${part}`;
      const cached = pictures.get(key);
      if (cached) return cached;
      const image = renderMonster(monsterById(id), moduleIndex + 1, part, 'shop');
      const sprite = document.createElement('canvas');
      sprite.width = image.width;
      sprite.height = image.height;
      sprite.getContext('2d')!.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
      pictures.set(key, sprite);
      return sprite;
    },
  };

  // The floor itself is drawn once into a static layer whenever rows, view or size change;
  // every frame then blits it and draws the overlays (teleporters, marks, route, cursor) on
  // top. Dependencies are read here, synchronously, so the effect re-runs when they change.
  const staticLayer = document.createElement('canvas');
  let staticStale = true;
  let scene: Scene | null = null;
  let pendingFrame = 0;

  function overlays() {
    return { cursor, highlight, marks, monsters, selected, route, teleporters };
  }

  $effect(() => {
    const next: Scene = { rows, floor, view, width: size.width, height: size.height };
    staticStale = true;
    scene = { ...untrack(overlays), ...next };
    scheduleRender();
  });

  $effect(() => {
    const current = overlays();
    if (!scene) return;
    scene = { ...scene, ...current };
    scheduleRender();
  });

  $effect(() => {
    if (!teleporters.length) return;
    let frame = requestAnimationFrame(function tick() {
      render();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  });

  interface Scene {
    rows: Square[][];
    floor: number;
    view: Viewport;
    width: number;
    height: number;
    cursor?: Point | null;
    highlight?: Point | null;
    marks?: Mark[];
    monsters?: StockedMonster[];
    selected?: Point | null;
    route?: Point[] | null;
    teleporters?: ReturnType<typeof teleporterSegments>;
  }

  function scheduleRender() {
    if (pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = 0;
      render();
    });
  }

  function render() {
    if (!scene || !scene.width || !scene.height) return;
    const { rows, floor, view, width, height, cursor, highlight, marks, monsters, selected, route, teleporters } = scene;
    const dpr = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    if (staticStale || staticLayer.width !== pixelWidth || staticLayer.height !== pixelHeight) {
      staticLayer.width = pixelWidth;
      staticLayer.height = pixelHeight;
      const staticCtx = staticLayer.getContext('2d')!;
      staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFloor(staticCtx, rows, { ...view, width, height, floor, teleporterHue: null });
      staticStale = false;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(staticLayer, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawTeleporters(ctx, teleporters ?? [], view, teleporterHue(performance.now()));
    if (monsters?.length) drawMonsters(ctx, monsters, view, sprites);
    drawMarks(ctx, marks ?? [], view);
    if (route) drawRoute(ctx, route, view);
    if (selected) drawOutline(ctx, selected.x, selected.y, view, 2, palette.selection);
    if (highlight) drawOutline(ctx, highlight.x, highlight.y, view, 2, '#ffffff');
    if (cursor) drawOutline(ctx, cursor.x, cursor.y, view, 1, 'rgba(255, 255, 255, 0.75)');
  }

  function canvasPoint(event: MouseEvent): Point {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onpointerdown(event: PointerEvent) {
    canvas.setPointerCapture(event.pointerId);
    drag = { startX: event.clientX, startY: event.clientY, origin: view, moved: false };
  }

  function onpointermove(event: PointerEvent) {
    if (drag && event.buttons) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD_PX) drag.moved = true;
      if (drag.moved) {
        dragging = true;
        view = pan(drag.origin, dx, dy);
      }
      return;
    }
    const point = canvasPoint(event);
    const square = squareAt(view, point.x, point.y);
    if (square?.x !== cursor?.x || square?.y !== cursor?.y) cursor = square;
  }

  function onpointerup(event: PointerEvent) {
    if (drag && !drag.moved) {
      const point = canvasPoint(event);
      const square = squareAt(view, point.x, point.y);
      if (square) onselect?.(square);
    }
    drag = null;
    dragging = false;
  }

  export function zoomIn() {
    view = zoomStep(view, 1, size.width / 2, size.height / 2);
  }

  export function zoomOut() {
    view = zoomStep(view, -1, size.width / 2, size.height / 2);
  }

  export function fit() {
    view = fitFloor(size.width, size.height, bounds);
  }

  export function reveal(square: Point) {
    view = ensureVisible(view, square, size.width, size.height);
  }
</script>

<div class="container" bind:this={container}>
  <canvas bind:this={canvas} {onpointerdown} {onpointermove} {onpointerup} style:width="{size.width}px" style:height="{size.height}px"></canvas>
  {#if tooltip && tooltipPosition}
    <div class="tooltip" style:left="{tooltipPosition.left}px" style:top="{tooltipPosition.top}px" style:width="{TOOLTIP_WIDTH}px">
      <div class="title">{tooltip.title}</div>
      {#if tooltip.feature}
        <div class="feature">{tooltip.feature}</div>
      {/if}
      {#if tooltip.monster}
        <div class="monster">{tooltip.monster}</div>
      {/if}
      {#each tooltip.notes as note}
        <div class="note">{note}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #710000;
  }
  canvas {
    display: block;
    touch-action: none;
    cursor: crosshair;
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(12, 12, 24, 0.92);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 6px 9px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--ink);
  }
  .title {
    color: var(--accent);
    font-weight: 600;
  }
  .feature {
    color: var(--accent);
  }
  .monster {
    color: var(--ink);
  }
  .note {
    color: var(--ink);
  }
</style>
