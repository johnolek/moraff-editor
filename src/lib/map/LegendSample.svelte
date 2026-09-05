<script lang="ts">
  import type { Square } from '../game/unfmap.js';
  import { drawSquare } from './draw-floor';
  import { palette } from './palette';

  const SIZE = 18;

  let { square }: { square: Square } = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const sample = square;
    const dpr = window.devicePixelRatio || 1;
    const edge = SIZE + 6;
    canvas.width = edge * dpr;
    canvas.height = edge * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, edge, edge);
    drawSquare(ctx, sample, 2, 2, SIZE, 0);
  });
</script>

<canvas bind:this={canvas} style:width="{SIZE + 6}px" style:height="{SIZE + 6}px"></canvas>

<style>
  canvas {
    display: block;
    border-radius: 3px;
  }
</style>
