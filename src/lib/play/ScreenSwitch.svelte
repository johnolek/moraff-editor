<script lang="ts">
  import type { PortedGameId } from '../app-state.svelte';
  import { PLAY_DISPLAYS, writePlayDisplay, type PlayDisplay } from './mode';

  interface Props {
    /** Which game's choice this is: the browser remembers one per game. */
    game: PortedGameId;
    display: PlayDisplay;
  }

  let { game, display = $bindable() }: Props = $props();

  function choose(which: PlayDisplay) {
    display = which;
    writePlayDisplay(game, which);
  }
</script>

<div class="note">Show:</div>
<div class="row">
  {#each PLAY_DISPLAYS as choice}
    <button type="button" class:chosen={display === choice.id} onclick={() => choose(choice.id)}>{choice.label}</button>
  {/each}
</div>

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
    margin-bottom: 10px;
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
</style>
