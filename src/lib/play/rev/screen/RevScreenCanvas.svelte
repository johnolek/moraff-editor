<script lang="ts">
  import { onScreen } from '../../../ui/on-screen.svelte';
  import { framePainter } from '../../view3d/canvas';
  import type { Frame } from '../../view3d/frame';
  import { revRgb } from './colours';
  import { SCREEN_HEIGHT, SCREEN_WIDTH } from './paint';

  interface Props {
    /** The 320 by 200 buffer of colour indexes to paint, which is either the screen as the game
     *  has it now or one the game asked to be held (`../held.ts`). */
    screen: Frame;
    /** Which of `SCREEN 1`'s two colour sets the screen is in, the way the `@` key sets it. */
    palette?: number;
    /** Which of CGA's sixteen colours stands behind everything, the way the `#` key sets it. */
    background?: number;
    /** How long a new screen takes to appear, in milliseconds, revealed from the top down the
     *  way a slow machine drew one (`../../mode.ts`). Nothing at all draws it in one go. */
    redraw?: number;
  }

  let { screen, palette = 0, background = 0, redraw = 0 }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);
  /** Whether the tab the screen is on is the one showing, since every tab of the site stays
   *  mounted and a wipe behind one would be drawing for nobody. */
  const visible = onScreen(() => canvas);
  /** The screen's own painter, so every repaint writes over the same RGBA buffer. */
  const painter = framePainter(SCREEN_WIDTH, SCREEN_HEIGHT);
  /** How long this screen takes to appear: the player's choice while the tab is showing. */
  const revealed = $derived(visible.showing ? redraw : 0);

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    painter.reveal(context, screen, revRgb(palette, background), revealed);
  });

  /** A screen going off the page part-drawn is shown whole at once, rather than leaving the
   *  player a half-drawn screen to come back to. */
  $effect(() => {
    if (!visible.showing) painter.finish();
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
