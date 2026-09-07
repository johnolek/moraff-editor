<script lang="ts">
  import { app } from '../app-state.svelte';
  import { goToTab } from '../history';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { MODULE_NUMERALS } from './labels';
  import type { Route } from './path';
  import type { StockedMonster } from './stocking';
  import type { Point } from './viewport';

  interface Props {
    selected: Point | null;
    route: Route | null | undefined;
    /** The stocked monster standing on the selected square, if there is one. */
    monster: StockedMonster | null;
    /** The line the game's own stocking has the panel print about it. */
    monsterLine: string | null;
    /** What routing walks to, as the buttons and the answers name it. */
    routeNoun: string;
    /** Whether the floor holds one at all: without one there is nothing to walk to. */
    floorHasTarget: boolean;
    /** Modules the teleporter on the selected square leads to; empty when there is no teleporter. */
    teleporterModules: number[];
    onroute: (passWall: boolean) => void;
    onhere: () => void;
    onclear: () => void;
    ontake: (module: number) => void;
  }

  let { selected, route, monster, monsterLine, routeNoun, floorHasTarget, teleporterModules, onroute, onhere, onclear, ontake }: Props = $props();

  let allowPassWall = $state(false);

  function openInMonsters() {
    if (!monster) return;
    app.requestedMonsterId = monster.monsterId;
    goToTab(app, 'monsters');
  }

  function describeRoute(route: Route): string {
    const parts = [`${route.steps} ${route.steps === 1 ? 'step' : 'steps'}`];
    if (route.doors) parts.push(`${route.doors} ${route.doors === 1 ? 'door' : 'doors'}`);
    if (route.secretDoors) parts.push(`${route.secretDoors} secret ${route.secretDoors === 1 ? 'door' : 'doors'}`);
    if (route.passWalls) parts.push(`${route.passWalls} pass ${route.passWalls === 1 ? 'wall' : 'walls'}`);
    return parts.join(' · ');
  }

  /** Ticking the box after a route has been worked out asks for it again with the spell allowed. */
  function togglePassWall(event: Event) {
    allowPassWall = (event.currentTarget as HTMLInputElement).checked;
    if (route !== undefined) onroute(allowPassWall);
  }
</script>

{#if selected}
  <section>
    <SectionHeading title="Selected {selected.x}, {selected.y}" />
    {#if monsterLine}
      <p class="monster">{monsterLine}</p>
    {/if}
    <div class="buttons">
      {#if monster}
        <button class="ghost" onclick={openInMonsters}>Open in Monsters</button>
      {/if}
      <button class="ghost" onclick={() => onroute(allowPassWall)} disabled={!floorHasTarget} title={floorHasTarget ? undefined : `No ${routeNoun} on this floor.`}>
        Path to nearest {routeNoun}
      </button>
      <label class="toggle">
        <input type="checkbox" checked={allowPassWall} onchange={togglePassWall} />
        <span>Allow Pass Wall</span>
      </label>
      <button class="ghost" onclick={onhere}>I'm here</button>
      <button class="ghost" onclick={onclear}>Clear</button>
      {#each teleporterModules as module}
        <button class="ghost" onclick={() => ontake(module)}>Take teleporter to Module {MODULE_NUMERALS[module]}</button>
      {/each}
    </div>
    {#if route}
      <p>{describeRoute(route)}</p>
    {:else if route === null}
      <p>No {routeNoun} reachable from here.</p>
    {/if}
  </section>
{/if}

<style>
  .buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
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
  .monster {
    margin: 0 0 8px;
  }
</style>
