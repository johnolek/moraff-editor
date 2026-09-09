<script lang="ts">
  import type { PortedGameId } from '../app-state.svelte';
  import {
    COLOURBLIND_FILTER_ID,
    PLAY_DISPLAYS,
    REDRAW_STEP_MS,
    redrawWords,
    SLOWEST_REDRAW_MS,
    writePlayColourblind,
    writePlayDisplay,
    writePlayRedraw,
    type PlayDisplay,
  } from './mode';

  interface Props {
    /** Which game's choice this is: the browser remembers one per game. */
    game: PortedGameId;
    display: PlayDisplay;
    /** Whether the stage is drawn through the simulation this component defines. */
    colourblind: boolean;
    /** How long the game's screen takes to appear, revealed from the top down. */
    redraw: number;
  }

  let { game, display = $bindable(), colourblind = $bindable(), redraw = $bindable() }: Props = $props();

  function choose(which: PlayDisplay) {
    display = which;
    writePlayDisplay(game, which);
  }

  function toggleSimulation(input: HTMLInputElement) {
    writePlayColourblind(game, input.checked);
  }

  function chooseRedraw(input: HTMLInputElement) {
    writePlayRedraw(game, Number(input.value));
  }
</script>

<div class="note">Show:</div>
<div class="row">
  {#each PLAY_DISPLAYS as choice}
    <button type="button" class:chosen={display === choice.id} onclick={() => choose(choice.id)}>{choice.label}</button>
  {/each}
</div>
<label class="simulate">
  <input type="checkbox" bind:checked={colourblind} onchange={(event) => toggleSimulation(event.currentTarget)} />
  <span>Simulate red-green colourblindness</span>
</label>

<label class="redraw">
  <span>Redraw speed</span>
  <input
    type="range"
    min="0"
    max={SLOWEST_REDRAW_MS}
    step={REDRAW_STEP_MS}
    bind:value={redraw}
    oninput={(event) => chooseRedraw(event.currentTarget)} />
  <span class="pace">{redrawWords(redraw)}</span>
</label>

<!-- Deuteranopia, the common form of red-green colourblindness, as the matrix Viénot, Brettel and
     Mollon published for simulating it. The matrix is written for ordinary sRGB colours, so the
     filter is told to work in sRGB rather than the linear light SVG filters use by default. -->
<svg class="filters" aria-hidden="true" focusable="false">
  <filter id={COLOURBLIND_FILTER_ID} color-interpolation-filters="sRGB">
    <feColorMatrix
      type="matrix"
      values="0.625 0.375 0     0 0
              0.700 0.300 0     0 0
              0     0.300 0.700 0 0
              0     0     0     1 0" />
  </filter>
</svg>

<style>
  .note {
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 12px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  button {
    padding: 6px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel-2);
    color: var(--ink);
    font: inherit;
    font-family: var(--font-dos);
    font-size: 16px;
    cursor: pointer;
  }
  button:hover {
    color: var(--accent);
  }
  button.chosen {
    border-color: var(--accent);
    color: var(--accent);
  }
  .simulate {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--muted);
    font-size: 12px;
    cursor: pointer;
  }
  /* The slider and what it is set to, on one line under the simulation's checkbox. */
  .redraw {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--muted);
    font-size: 12px;
    cursor: pointer;
  }
  .redraw input {
    flex: 1;
    min-width: 80px;
    max-width: 140px;
    accent-color: var(--accent);
  }
  .redraw .pace {
    min-width: 48px;
    font-family: var(--font-dos);
  }
  .filters {
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
