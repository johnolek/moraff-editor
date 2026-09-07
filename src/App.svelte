<script lang="ts">
  import { onMount } from 'svelte';
  import { app, type Tab } from './lib/app-state.svelte';
  import { restoreRoster } from './lib/character/current';
  import { isAppHistoryState, tabState, type AppHistoryState } from './lib/history';
  import MonsterDatabase from './lib/bestiary/MonsterDatabase.svelte';
  import CharacterPanel from './lib/character/CharacterPanel.svelte';
  import Calculators from './lib/calculators/Calculators.svelte';
  import SaveEditor from './lib/editor/SaveEditor.svelte';
  import Formulas from './lib/formulas/Formulas.svelte';
  import MapExplorer from './lib/map/MapExplorer.svelte';
  import NewCharacter from './lib/roller/NewCharacter.svelte';
  import SourceViewer from './lib/source/SourceViewer.svelte';
  import SpellReference from './lib/spells/SpellReference.svelte';
  import Tidbits from './lib/tidbits/Tidbits.svelte';
  import PixelText from './lib/ui/PixelText.svelte';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'map', label: 'DotU Map' },
    { id: 'editor', label: 'Save Editor' },
    { id: 'monsters', label: 'Monsters' },
    { id: 'spells', label: 'Spells' },
    { id: 'calculators', label: 'Calculators' },
    { id: 'formulas', label: 'Formulas' },
    { id: 'tidbits', label: 'Tidbits' },
    { id: 'roller', label: 'New Character' },
    { id: 'source', label: 'Source' },
  ];

  onMount(() => {
    restoreRoster();
    const state = history.state;
    if (isAppHistoryState(state)) {
      restore(state);
      return;
    }
    history.replaceState(tabState(null, app.tab), '');
  });

  /** Switching tabs is a step of its own in the browser's history, so Back and Forward move
   *  between the tabs visited rather than only through the map. */
  function show(tab: Tab) {
    if (tab === app.tab) return;
    app.tab = tab;
    history.pushState(tabState(history.state, tab), '');
    app.mapHistory = app.mapHistory.forwardDropped();
  }

  function onPopState(event: PopStateEvent) {
    if (isAppHistoryState(event.state)) restore(event.state);
  }

  function restore(state: AppHistoryState) {
    // An entry left by an older build of the site can name a tab this one no longer has.
    if (tabs.some((entry) => entry.id === state.tab)) app.tab = state.tab;
    app.mapHistory = app.mapHistory.movedTo(state.index);
  }
</script>

<svelte:window onpopstate={onPopState} />

<div class="app">
  <header>
    <h1><PixelText text="Moraff Tools" scale={2} /></h1>
    <nav>
      {#each tabs as entry}
        <button type="button" class="tab" class:active={app.tab === entry.id} onclick={() => show(entry.id)}>{entry.label}</button>
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
  <main class:hidden={app.tab !== 'formulas'}>
    <Formulas />
  </main>
  <main class:hidden={app.tab !== 'tidbits'}>
    <Tidbits />
  </main>
  <main class:hidden={app.tab !== 'roller'}>
    <NewCharacter />
  </main>
  <main class:hidden={app.tab !== 'source'}>
    <SourceViewer />
  </main>
  <!-- The game keeps its status block along the bottom of the screen, so the character does too. -->
  <CharacterPanel />
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
