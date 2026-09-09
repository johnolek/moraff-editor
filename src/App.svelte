<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from './lib/app-state.svelte';
  import { rememberNow, restoreGame, restoreRoster, switchGame } from './lib/character/current';
  import { GAME_CHOICES } from './lib/game-choice';
  import { goToTab, isAppHistoryState, recordTab, type AppHistoryState } from './lib/history';
  import { tabsFor } from './lib/tabs';
  import Monsters from './lib/bestiary/Monsters.svelte';
  import CharacterPanel from './lib/character/CharacterPanel.svelte';
  import Calculators from './lib/calculators/Calculators.svelte';
  import SaveEditor from './lib/editor/SaveEditor.svelte';
  import Formulas from './lib/formulas/Formulas.svelte';
  import MapExplorer from './lib/map/MapExplorer.svelte';
  import FightTab from './lib/play/FightTab.svelte';
  import Play from './lib/play/Play.svelte';
  import MwPlay from './lib/play/mw/MwPlay.svelte';
  import RevPlay from './lib/play/rev/RevPlay.svelte';
  import MwMonsters from './lib/mw-bestiary/MwMonsters.svelte';
  import RevMonsters from './lib/rev-bestiary/RevMonsters.svelte';
  import NewCharacter from './lib/roller/NewCharacter.svelte';
  import Snake from './lib/snake/Snake.svelte';
  import SourceViewer from './lib/source/SourceViewer.svelte';
  import MwSpellReference from './lib/mw-spells/MwSpellReference.svelte';
  import SpellReference from './lib/spells/SpellReference.svelte';
  import Tidbits from './lib/tidbits/Tidbits.svelte';
  import PixelText from './lib/ui/PixelText.svelte';

  const tabs = $derived(tabsFor(app.game));

  onMount(() => {
    // Read the entry first: restoring the game rewrites it to say which tab that game is showing.
    const state = history.state;
    // The roster is read out of the database, which answers a moment later, so the site puts up
    // its default game and tab and settles on the remembered ones as soon as the answer is in.
    void restoreRoster().then(() => {
      restoreGame();
      if (isAppHistoryState(state)) restore(state);
      recordTab(app);
    });
  });

  function onPopState(event: PopStateEvent) {
    if (isAppHistoryState(event.state)) restore(event.state);
  }

  function restore(state: AppHistoryState) {
    // The entry can name a tab that is not there to go to: one an older build of the site had,
    // or one of the other game's, since the game is not part of what history remembers.
    if (tabs.some((entry) => entry.id === state.tab)) app.tab = state.tab;
    app.mapHistory = app.mapHistory.movedTo(state.index);
  }
</script>

<!-- An edit waits a moment before the roster is written, and a page on its way out would take
     that write with it. -->
<svelte:window onpopstate={onPopState} onpagehide={rememberNow} />

<div class="app">
  <header>
    <h1><PixelText text="Moraff Tools" scale={2} /></h1>
    <nav>
      {#each tabs as entry}
        <button type="button" class="tab" class:active={app.tab === entry.id} onclick={() => goToTab(app, entry.id)}>{entry.label}</button>
      {/each}
    </nav>
    <div class="games" role="group" aria-label="Game">
      {#each GAME_CHOICES as choice}
        <button
          type="button"
          class="game"
          class:active={app.game === choice.id}
          aria-pressed={app.game === choice.id}
          onclick={() => switchGame(choice.id)}>{choice.label}</button>
      {/each}
    </div>
  </header>
  {#if app.game === 'moraffsWorld'}
    <p class="game-note">
      Moraff's World has the Map, Play, the Save Editor, the Monsters, Spells, New Character and Source so far. The
      rest is on the way.
    </p>
  {:else if app.game === 'revenge'}
    <p class="game-note">
      Moraff's Revenge has the Map, Play, the Save Editor, the Monsters, Tidbits, New Character and Source so far.
      The rest is on the way.
    </p>
  {/if}
  {#if !app.rosterKept}
    <p class="storage-note">
      Could not save your characters: the browser's storage is full or turned off. Anything edited now will be gone
      when this page is closed.
    </p>
  {/if}
  <!-- Every tab stays mounted so the map view and the loaded save survive switching. -->
  <main class:hidden={app.tab !== 'map'}>
    <MapExplorer />
  </main>
  <main class:hidden={app.tab !== 'play'}>
    <!-- The three games are three executables with three loops, so each brings its own. -->
    {#if app.game === 'moraffsWorld'}<MwPlay />{:else if app.game === 'revenge'}<RevPlay />{:else}<Play />{/if}
  </main>
  <!-- Dungeons of the Unforgiven's alone, so nothing here asks which game is showing. -->
  <main class:hidden={app.tab !== 'fight'}>
    <FightTab />
  </main>
  <main class:hidden={app.tab !== 'editor'}>
    <SaveEditor />
  </main>
  <main class:hidden={app.tab !== 'monsters'}>
    <!-- The two games share the list and the search but not a single fact about a monster, so
         each brings its own database rather than one being taught both. -->
    {#if app.game === 'moraffsWorld'}
      <MwMonsters />
    {:else if app.game === 'revenge'}
      <RevMonsters />
    {:else}
      <Monsters />
    {/if}
  </main>
  <main class:hidden={app.tab !== 'spells'}>
    {#if app.game === 'moraffsWorld'}<MwSpellReference />{:else}<SpellReference />{/if}
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
  <main class:hidden={app.tab !== 'snake'}>
    <Snake />
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
  /* The title, the tabs and the game switch are too wide for a laptop screen together, so the
     switch drops to a line of its own rather than the labels being squeezed. */
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 28px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--line);
  }
  h1 {
    margin: 0;
    flex-shrink: 0;
    line-height: 0;
    color: var(--accent);
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tab {
    padding: 6px 12px;
    white-space: nowrap;
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
  .games {
    display: flex;
    flex-shrink: 0;
    margin-left: auto;
    border: 1px solid var(--line);
    border-radius: 6px;
    overflow: hidden;
  }
  .game {
    padding: 6px 14px;
    white-space: nowrap;
    border: none;
    background: none;
    font: inherit;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
  }
  .game:hover {
    color: var(--ink);
  }
  .game.active {
    background: var(--accent-dim);
    color: #1a1822;
    font-weight: 600;
  }
  .game-note {
    margin: 0;
    padding: 8px 24px;
    border-bottom: 1px solid var(--line);
    color: var(--muted);
    font-size: 13px;
  }
  .storage-note {
    margin: 0;
    padding: 8px 24px;
    border-bottom: 1px solid var(--line);
    color: var(--warn);
    font-size: 13px;
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
