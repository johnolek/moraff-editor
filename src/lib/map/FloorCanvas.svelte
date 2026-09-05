<script lang="ts">
  import { untrack } from 'svelte';
  import type { Square } from '../game/unfmap.js';
  import { drawFloor, drawOutline } from './draw-floor';
  import { ensureVisible, fitFloor, pan, squareAt, zoomStep, type Point, type Viewport } from './viewport';

  interface Props {
    rows: Square[][];
    floor: number;
    /** The square the info panel describes: follows the pointer, moved by the keyboard. */
    cursor?: Point | null;
    /** Landing square after a jump. */
    highlight?: Point | null;
    onselect?: (square: Point) => void;
  }

  let { rows, floor, cursor = $bindable(null), highlight = null, onselect }: Props = $props();

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let size = $state({ width: 0, height: 0 });
  let view = $state<Viewport>({ cell: 10, originX: 0, originY: 0 });
  let fitted = false;

  const DRAG_THRESHOLD_PX = 3;
  let drag: { startX: number; startY: number; origin: Viewport; moved: boolean } | null = null;

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => {
      size = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (!fitted && size.width > 0) {
        view = fitFloor(size.width, size.height);
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
      view = zoomStep(view, event.deltaY < 0 ? 1 : -1, point.x, point.y);
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

  // Dependencies are read here, synchronously, so the effect re-runs when they change;
  // the frame callback only sees the snapshot.
  $effect(() => {
    const scene: Scene = { rows, floor, view, cursor, highlight, width: size.width, height: size.height };
    const frame = requestAnimationFrame(() => draw(scene));
    return () => cancelAnimationFrame(frame);
  });

  interface Scene {
    rows: Square[][];
    floor: number;
    view: Viewport;
    cursor: Point | null;
    highlight: Point | null;
    width: number;
    height: number;
  }

  function draw({ rows, floor, view, cursor, highlight, width, height }: Scene) {
    if (!width || !height) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFloor(ctx, rows, { ...view, width, height, floor });
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
      if (drag.moved) view = pan(drag.origin, dx, dy);
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
  }

  export function zoomIn() {
    view = zoomStep(view, 1, size.width / 2, size.height / 2);
  }

  export function zoomOut() {
    view = zoomStep(view, -1, size.width / 2, size.height / 2);
  }

  export function fit() {
    view = fitFloor(size.width, size.height);
  }

  export function reveal(square: Point) {
    view = ensureVisible(view, square, size.width, size.height);
  }
</script>

<div class="container" bind:this={container}>
  <canvas bind:this={canvas} {onpointerdown} {onpointermove} {onpointerup} style:width="{size.width}px" style:height="{size.height}px"></canvas>
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
</style>
