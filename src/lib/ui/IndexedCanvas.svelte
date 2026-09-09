<!--
  A canvas showing one of the games' pictures.

  All three games keep a picture as colour indexes and turn it into pixels themselves, so what
  reaches here is a finished RGBA buffer at the size the game drew it, put on a canvas of exactly
  that size and scaled up by the page with the pixels left square.
-->
<script lang="ts">
  interface Props {
    /** The pixels to show, or null for a picture the game has not got. */
    image: { width: number; height: number; data: Uint8ClampedArray<ArrayBuffer> } | null;
    /** The canvas's own size, which stays the size the game drew at whatever the page shows. */
    width: number;
    height: number;
    /** How wide to show it on the page, as a CSS length. */
    shown: string;
    label: string;
  }

  let { image, width, height, shown, label }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const context = canvas.getContext('2d');
    if (!image || !context) return;
    context.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
  });
</script>

<canvas bind:this={canvas} {width} {height} style:--shown-width={shown} aria-label={label}></canvas>

<style>
  canvas {
    display: block;
    width: var(--shown-width);
    max-width: 100%;
    height: auto;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    image-rendering: pixelated;
  }
</style>
