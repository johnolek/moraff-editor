<script lang="ts">
  import type { GameId } from '../app-state.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { renderWallTexture, wallTexture } from './wall-texture';

  interface Props {
    game: GameId;
    /** The module of Dungeons of the Unforgiven or the numbered dungeon of Moraff's World. */
    dungeon: number;
    floor: number;
  }

  let { game, dungeon, floor }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  const texture = $derived(wallTexture(game, dungeon, floor));
  const image = $derived(texture ? renderWallTexture(texture) : null);

  $effect(() => {
    const context = canvas?.getContext('2d');
    if (!context || !image) return;
    context.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
  });
</script>

{#if texture && image}
  <section>
    <SectionHeading title="Wall texture" />
    <canvas bind:this={canvas} width={image.width} height={image.height} aria-label={texture.caption}></canvas>
    <p class="caption">{texture.caption}</p>
  </section>
{/if}

<style>
  canvas {
    display: block;
    width: 100%;
    /* The picture is 256 pixels across, and past about a third again it is only bigger. */
    max-width: 340px;
    height: auto;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    image-rendering: pixelated;
  }
  .caption {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--muted);
  }
</style>
