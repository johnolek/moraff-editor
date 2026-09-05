<script lang="ts">
  import { HEIGHT, WIDTH, type Square } from '../game/unfmap.js';
  import { drawFloor } from './draw-floor';

  let { rows, floor, cell = 10 }: { rows: Square[][]; floor: number; cell?: number } = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const width = WIDTH * cell + 2;
    const height = HEIGHT * cell + 2;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFloor(ctx, rows, { cell, originX: 0, originY: 0, width, height, floor });
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    image-rendering: pixelated;
  }
</style>
