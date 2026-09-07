<script lang="ts">
  import type { ScreenLine } from '../game/port/state';
  import { screenSpans } from '../roller/screen';

  interface Props {
    /** What the game has drawn, in the order it drew it. */
    lines: ScreenLine[];
    /** Whether to keep the game's own 1600 by 1200 shape, or fill whatever room there is. */
    fill?: boolean;
  }

  let { lines, fill = false }: Props = $props();

  let width = $state(0);
  const spans = $derived(screenSpans(lines));
</script>

<!-- The game's own screen: 1600 units across and 1200 down, every line where the game drew it. -->
<div class="screen" class:fill bind:clientWidth={width} style:--u="{width / 1600}px">
  {#each spans as span}
    <span
      style:left="calc({span.x} * var(--u))"
      style:top="calc({span.y} * var(--u))"
      style:font-size="calc({span.size} * var(--u))"
      style:letter-spacing="calc({span.spacing} * var(--u))"
      style:color={span.colour}>{span.text}</span>
  {/each}
</div>

<style>
  .screen {
    position: relative;
    /* The screen is 1600 by 1200; the extra height is room under the lowest line the game draws,
       and leaves a unit as tall as it is wide either way. */
    aspect-ratio: 1600 / 1224;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }
  .screen.fill {
    aspect-ratio: auto;
    height: 100%;
    border: none;
    border-radius: 0;
  }
  .screen span {
    position: absolute;
    font-family: var(--font-dos);
    line-height: 1;
    white-space: pre;
  }
</style>
