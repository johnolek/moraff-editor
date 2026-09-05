<script lang="ts">
  import { app, type Tab } from './lib/app-state.svelte';
  import MonsterDatabase from './lib/bestiary/MonsterDatabase.svelte';
  import Calculators from './lib/calculators/Calculators.svelte';
  import SaveEditor from './lib/editor/SaveEditor.svelte';
  import MapExplorer from './lib/map/MapExplorer.svelte';
  import SpellReference from './lib/spells/SpellReference.svelte';
  import PixelText from './lib/ui/PixelText.svelte';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'map', label: 'DotU Map' },
    { id: 'editor', label: 'Save Editor' },
    { id: 'monsters', label: 'Monsters' },
    { id: 'spells', label: 'Spells' },
    { id: 'calculators', label: 'Calculators' },
  ];
</script>

<div class="app">
  <header>
    <h1><PixelText text="Moraff Tools" scale={2} /></h1>
    <nav>
      {#each tabs as entry}
        <button type="button" class="tab" class:active={app.tab === entry.id} onclick={() => (app.tab = entry.id)}>{entry.label}</button>
      {/each}
    </nav>
  </header>
  <!-- Every tab stays mounted so the map view and the loaded save survive switching. -->
  <main class:hidden={app.tab !== 'map'}>
    <MapExplorer />
  </main>
  <main class:hidden={app.tab !== 'editor'}>
    <SaveEditor />
  </main>
  <main class:hidden={app.tab !== 'monsters'}>
    <MonsterDatabase />
  </main>
  <main class:hidden={app.tab !== 'spells'}>
    <SpellReference />
  </main>
  <main class:hidden={app.tab !== 'calculators'}>
    <Calculators />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  header {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--line);
  }
  h1 {
    margin: 0;
    line-height: 0;
    color: var(--accent);
  }
  nav {
    display: flex;
    gap: 4px;
  }
  .tab {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: none;
    font: inherit;
    font-size: 14px;
    color: var(--muted);
    cursor: pointer;
  }
  .tab:hover {
    color: var(--ink);
  }
  .tab.active {
    color: var(--ink);
    background: var(--panel-2);
  }
  main {
    display: flex;
    flex: 1;
    min-height: 0;
  }
  main.hidden {
    display: none;
  }
</style>
