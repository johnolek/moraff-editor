<script lang="ts">
  import SaveEditor from './lib/editor/SaveEditor.svelte';
  import MapExplorer from './lib/map/MapExplorer.svelte';
  import PixelText from './lib/ui/PixelText.svelte';

  type Tab = 'map' | 'editor';
  let tab = $state<Tab>('map');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'map', label: 'DotU Map' },
    { id: 'editor', label: 'Save Editor' },
  ];
</script>

<div class="app">
  <header>
    <h1><PixelText text="Moraff Tools" scale={2} /></h1>
    <nav>
      {#each tabs as entry}
        <button type="button" class="tab" class:active={tab === entry.id} onclick={() => (tab = entry.id)}>{entry.label}</button>
      {/each}
    </nav>
  </header>
  <!-- Both tabs stay mounted so the map view and the loaded save survive switching. -->
  <main class:hidden={tab !== 'map'}>
    <MapExplorer />
  </main>
  <main class:hidden={tab !== 'editor'}>
    <SaveEditor />
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
