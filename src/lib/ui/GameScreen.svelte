<script lang="ts">
  import type { ScreenLine } from '../game/port/state';
  import { screenSpans } from '../roller/screen';

  /** A part of the game's screen, in the game's own units. */
  export interface ScreenWindow {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /** The whole screen: 1600 units across and 1200 down, plus room under the lowest line. */
  const WHOLE_SCREEN: ScreenWindow = { x: 0, y: 0, width: 1600, height: 1224 };

  interface Props {
    /** What the game has drawn, in the order it drew it. */
    lines: ScreenLine[];
    /** The part of the screen to show, for a panel that holds one corner of it. */
    window?: ScreenWindow;
  }

  let { lines, window: shown = WHOLE_SCREEN }: Props = $props();

  let width = $state(0);
  const spans = $derived(screenSpans(lines));
</script>

<!-- The game's own screen: every line at the coordinates the game drew it at. -->
<div
  class="screen"
  bind:clientWidth={width}
  style:--u="{width / shown.width}px"
  style:aspect-ratio="{shown.width} / {shown.height}">
  {#each spans as span}
    <span
      style:left="calc({span.x - shown.x} * var(--u))"
      style:top="calc({span.y - shown.y} * var(--u))"
      style:font-size="calc({span.size} * var(--u))"
      style:letter-spacing="calc({span.spacing} * var(--u))"
      style:color={span.colour}>{span.text}</span>
  {/each}
</div>

<style>
  .screen {
    position: relative;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }
  .screen span {
    position: absolute;
    font-family: var(--font-dos);
    line-height: 1;
    white-space: pre;
  }
</style>
