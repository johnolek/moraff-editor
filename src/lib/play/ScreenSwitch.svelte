<script lang="ts">
  import type { PortedGameId } from '../app-state.svelte';
  import {
    COLOURBLIND_FILTER_ID,
    PLAY_DISPLAYS,
    writePlayColourblind,
    writePlayDisplay,
    type PlayDisplay,
  } from './mode';

  interface Props {
    /** Which game's choice this is: the browser remembers one per game. */
    game: PortedGameId;
    display: PlayDisplay;
    /** Whether the stage is drawn through the simulation this component defines. */
    colourblind: boolean;
  }

  let { game, display = $bindable(), colourblind = $bindable() }: Props = $props();

  function choose(which: PlayDisplay) {
    display = which;
    writePlayDisplay(game, which);
  }

  function toggleSimulation(input: HTMLInputElement) {
    writePlayColourblind(game, input.checked);
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
  .filters {
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
