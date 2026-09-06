<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { MODULE_NUMERALS } from './labels';
  import type { Route } from './path';
  import type { Point } from './viewport';

  interface Props {
    selected: Point | null;
    route: Route | null | undefined;
    /** Whether the floor has a teleporter at all: without one there is nothing to walk to. */
    floorHasTeleporter: boolean;
    /** Modules the teleporter on the selected square leads to; empty when there is no teleporter. */
    teleporterModules: number[];
    onroute: () => void;
    onclear: () => void;
    ontake: (module: number) => void;
  }

  let { selected, route, floorHasTeleporter, teleporterModules, onroute, onclear, ontake }: Props = $props();

  function describeRoute(route: Route): string {
    const parts = [`${route.steps} steps`];
    if (route.doors) parts.push(`${route.doors} ${route.doors === 1 ? 'door' : 'doors'}`);
    if (route.secretDoors) parts.push(`${route.secretDoors} secret ${route.secretDoors === 1 ? 'door' : 'doors'}`);
    return parts.join(' · ');
  }
</script>

{#if selected}
  <section>
    <SectionHeading title="Selected {selected.x}, {selected.y}" />
    <div class="buttons">
      <button class="ghost" onclick={onroute} disabled={!floorHasTeleporter} title={floorHasTeleporter ? undefined : 'No teleporter on this floor.'}>
        Path to nearest teleporter
      </button>
      <button class="ghost" onclick={onclear}>Clear</button>
      {#each teleporterModules as module}
        <button class="ghost" onclick={() => ontake(module)}>Take teleporter to Module {MODULE_NUMERALS[module]}</button>
      {/each}
    </div>
    {#if route}
      <p>{describeRoute(route)}</p>
    {:else if route === null}
      <p>No teleporter reachable from here.</p>
    {/if}
  </section>
{/if}

<style>
  .buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  button.ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }
  button.ghost:hover:not(:disabled) {
    color: var(--ink);
    border-color: var(--accent);
  }
  button.ghost:disabled {
    opacity: 0.4;
    cursor: default;
  }
  p {
    margin: 8px 0 0;
    font-size: 13px;
  }
</style>
