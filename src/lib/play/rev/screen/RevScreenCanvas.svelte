<script lang="ts">
  import { onScreen } from '../../../ui/on-screen.svelte';
  import { framePainter, type FramePainter } from '../../view3d/canvas';
  import type { Frame } from '../../view3d/frame';
  import { revFrameRgb } from './colours';

  interface Props {
    /** The buffer of colour indexes to paint: the screen as the game has it now, one the game
     *  asked to be held (`../held.ts`), or the help's eighty-column text page, which is 640 by
     *  200 rather than 320 by 200 (`./text-screen.ts`). */
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
  /** A painter per screen mode, so every repaint writes over the same RGBA buffer. The wide one
   *  is only ever made because the help asked for it. */
  const painters = new Map<string, FramePainter>();
  function painterFor(frame: Frame): FramePainter {
    const key = `${frame.width}x${frame.height}`;
    const made = painters.get(key) ?? framePainter(frame.width, frame.height);
    painters.set(key, made);
    return made;
  }
  /** How long this screen takes to appear: the player's choice while the tab is showing. */
  const revealed = $derived(visible.showing ? redraw : 0);

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    painterFor(screen).reveal(context, screen, revFrameRgb(screen, palette, background), revealed);
  });

  /** A screen going off the page part-drawn is shown whole at once, rather than leaving the
   *  player a half-drawn screen to come back to. */
  $effect(() => {
    if (!visible.showing) for (const painter of painters.values()) painter.finish();
  });
</script>

<canvas class="screen" bind:this={canvas} width={screen.width} height={screen.height}></canvas>

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
