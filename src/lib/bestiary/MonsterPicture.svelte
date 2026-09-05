<script lang="ts">
  import type { MonsterEntry } from './monsters';
  import { PICTURE_HEIGHT, PICTURE_WIDTH, renderMonster, type Look } from './pictures';

  interface Props {
    entry: MonsterEntry;
    /** 1-based, the way the palette table is keyed. */
    module: number;
    /** Section within the module, 1..4. */
    part: number;
    look: Look;
  }

  let { entry, module, part, look }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    const image = renderMonster(entry, module, part, look);
    const context = canvas.getContext('2d');
    if (!context) return;
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
