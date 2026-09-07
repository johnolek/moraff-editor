<script lang="ts">
  import { drawSquare } from './draw-floor';
  import type { MapGame, MapSquare } from './game';
  import { palette } from './palette';
  import { TELEPORTER_STILL_HUE, teleporterHue } from './teleporters';

  const SIZE = 18;

  let { square, game }: { square: MapSquare; game: MapGame } = $props();

  let canvas: HTMLCanvasElement;

  const animated = $derived([square.n, square.s, square.w, square.e].includes(4));

  $effect(() => {
    const sample = square;
    const dpr = window.devicePixelRatio || 1;
    const edge = SIZE + 6;
    canvas.width = edge * dpr;
    canvas.height = edge * dpr;
    const ctx = canvas.getContext('2d')!;
    const paint = (hue: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, edge, edge);
      drawSquare(ctx, sample, 2, 2, SIZE, SIZE, 0, hue, game);
    };
    if (!animated) {
      paint(TELEPORTER_STILL_HUE);
      return;
    }
    let frame = requestAnimationFrame(function tick(time) {
      paint(teleporterHue(time));
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  });
</script>

<canvas bind:this={canvas} style:width="{SIZE + 6}px" style:height="{SIZE + 6}px"></canvas>

<style>
  canvas {
    display: block;
    border-radius: 3px;
  }
</style>
