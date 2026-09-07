<script lang="ts">
  import { drawPixelText, pixelFont, textWidth, type FontName } from './pixel-font';

  interface Props {
    text: string;
    font?: FontName;
    /** Canvas pixels per font pixel. */
    scale?: number;
  }

  let { text, font = 'bold', scale = 1 }: Props = $props();

  let canvas: HTMLCanvasElement;

  const face = $derived(pixelFont(font));
  const width = $derived(textWidth(face, text) * scale);
  const height = $derived(face.height * scale);

  // The glyphs take the element's CSS `color`, so the caller styles it like text.
  $effect(() => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawPixelText(ctx, face, text, 0, 0, scale, getComputedStyle(canvas).color);
  });
</script>

<span role="img" aria-label={text}>
  <canvas bind:this={canvas} aria-hidden="true" style:width="{width}px" style:height="{height}px"></canvas>
</span>

<style>
  span {
    display: inline-block;
    line-height: 0;
    color: inherit;
  }
  canvas {
    display: block;
    color: inherit;
  }
</style>
