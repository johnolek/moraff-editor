<script lang="ts">
  import MapExplorer from './lib/map/MapExplorer.svelte';
  import PixelText from './lib/ui/PixelText.svelte';
</script>

<div class="app">
  <header>
    <h1><PixelText text="Moraff Tools" scale={2} /></h1>
    <nav>
      <span class="tab active">DotU Map</span>
      <a class="tab" href="editor.html">Save Editor</a>
    </nav>
  </header>
  <main>
    <MapExplorer />
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
    align-items: baseline;
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
    border-radius: 6px;
    font-size: 14px;
    color: var(--muted);
    text-decoration: none;
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
</style>
