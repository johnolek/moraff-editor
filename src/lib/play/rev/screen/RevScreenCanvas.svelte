<script lang="ts">
  import { toRgba } from '../../view3d/frame';
  import { revRgb } from './colours';
  import { SCREEN_HEIGHT, SCREEN_WIDTH } from './paint';
  import { drawRevScreen, type RevScreenState } from './screen';

  interface Props {
    /** Everything the drawing cannot work out for itself. */
    screen: RevScreenState;
    /** Which of `SCREEN 1`'s two colour sets the screen is in, the way the `@` key sets it. */
    palette?: number;
  }

  let { screen, palette = 0 }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    const frame = drawRevScreen(screen);
    context.putImageData(new ImageData(toRgba(frame, revRgb(palette)), SCREEN_WIDTH, SCREEN_HEIGHT), 0, 0);
  });
</script>

<canvas class="screen" bind:this={canvas} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}></canvas>

<style>
  .screen {
    display: block;
    width: 100%;
    height: auto;
    /* CGA's 320 by 200 filled a 4:3 screen, so its pixels were taller than they were wide. */
    aspect-ratio: 4 / 3;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
  }
</style>
