<script lang="ts">
  import type { RevScreenLine } from '../game/rev-port/state';
  import { REV_SCREEN_COLOURS } from './screen';

  interface Props {
    /** What CHCHAR.EXE has printed, in the order it printed it. */
    lines: RevScreenLine[];
    /** How many columns wide the screen is: 80 for the instructions, 40 after them. */
    width?: number;
  }

  let { lines, width = 80 }: Props = $props();

  /** How many rows a text-mode screen has. */
  const ROWS = 25;

  /** How wide a character of VT323 is as a fraction of its font size, measured in a browser. */
  const CHARACTER_WIDTH = 0.4;

  /** How much room the padding takes on each side. */
  const PADDING = 12;

  let box = $state(0);
  /** The size that puts the columns showing right across the screen, and never bigger than the
   *  size the 80-column screens are set at. */
  const size = $derived(Math.min(20, (box - 2 * PADDING) / width / CHARACTER_WIDTH));

  interface Cell {
    character: string;
    colour: number;
    background: number;
  }

  interface Run extends Cell {
    text: string;
  }

  /**
   * The screen as characters.
   *
   * A later PRINT covers an earlier one, which is how the program rubs a line out by printing
   * spaces over it, and a line longer than the screen carries on to the next row the way the
   * console wraps it.
   */
  const grid = $derived.by(() => {
    const cells: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: width }, () => ({ character: ' ', colour: 7, background: 0 })),
    );
    for (const line of lines) {
      let row = line.row - 1;
      let column = line.column - 1;
      for (const character of line.text) {
        if (column >= width) {
          column = 0;
          row += 1;
        }
        if (row < 0 || row >= ROWS) break;
        // Bit 4 of the foreground is the blink bit, which this shows as the colour underneath.
        cells[row][column] = { character, colour: line.colour & 15, background: line.background & 15 };
        column += 1;
      }
    }
    return cells;
  });

  /** Neighbouring characters drawn the same way, so a row is a few spans rather than eighty. */
  const rows = $derived(
    grid.map((cells) => {
      const runs: Run[] = [];
      for (const cell of cells) {
        const last = runs[runs.length - 1];
        if (last && last.colour === cell.colour && last.background === cell.background) last.text += cell.character;
        else runs.push({ ...cell, text: cell.character });
      }
      return runs;
    }),
  );
</script>

<!-- The program's own screen, in the game's own colours, one character to a cell. -->
<div class="screen" bind:clientWidth={box} style:font-size="{size}px">
  {#each rows as runs}
    <div class="row">
      {#each runs as run}
        <span style:color={REV_SCREEN_COLOURS[run.colour]} style:background={REV_SCREEN_COLOURS[run.background]}>{run.text}</span>
      {/each}
    </div>
  {/each}
</div>

<style>
  .screen {
    background: #000;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 10px 12px;
    overflow: hidden;
    font-family: var(--font-dos);
    line-height: 1.15;
  }
  .row {
    white-space: pre;
    min-height: 1.15em;
  }
  span {
    white-space: pre;
  }
</style>
