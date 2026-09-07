<script lang="ts">
  import type { RevPicture } from './monsters';
  import { renderPicture } from './pictures';

  interface Props {
    picture: RevPicture;
    /** Which of the two SCREEN 1 palettes to draw it in. */
    palette: number;
    label: string;
    /** How wide to show it; the pixels are square, so the height follows. */
    scale: number;
  }

  let { picture, palette, label, scale }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const image = renderPicture(picture, palette);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
  });
</script>

<canvas
  bind:this={canvas}
  width={picture.width}
  height={picture.height}
  style:width="{picture.width * scale}px"
  aria-label={label}></canvas>

<style>
  canvas {
    display: block;
    max-width: 100%;
    height: auto;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    image-rendering: pixelated;
  }
</style>
