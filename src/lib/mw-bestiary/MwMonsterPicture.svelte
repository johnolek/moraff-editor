<script lang="ts">
  import type { MwMonster } from './monsters';
  import { PICTURE_HEIGHT, PICTURE_WIDTH, renderMonster } from './pictures';

  interface Props {
    entry: MwMonster;
    /** The floor whose colours to draw it in; set_palette picks the wall colours by floor % 11. */
    floor: number;
  }

  let { entry, floor }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const image = renderMonster(entry, floor);
    const context = canvas.getContext('2d');
    if (!image || !context) return;
    context.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
  });
</script>

<canvas bind:this={canvas} width={PICTURE_WIDTH} height={PICTURE_HEIGHT} aria-label={entry.name}></canvas>

<style>
  canvas {
    display: block;
    width: 512px;
    max-width: 100%;
    height: auto;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    image-rendering: pixelated;
  }
</style>
