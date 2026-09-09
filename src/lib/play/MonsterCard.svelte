<!--
  The panel debug mode reads a monster's details in, over the game's own screen.

  Clicking a monster's picture on the map in the corner of the screen opens this. The details
  themselves are the Monsters tab's own card for that monster, handed in as a snippet, so the two
  places never describe one monster two ways; what this adds is the way through to the tab.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { app } from '../app-state.svelte';
  import { goToTab } from '../history';
  import Overlay from '../ui/Overlay.svelte';

  interface Props {
    /** The id the Monsters tab keys this monster by. */
    monsterId: string;
    /** What the game calls it, which is what the panel is announced as. */
    name: string;
    onclose: () => void;
    detail: Snippet;
  }

  let { monsterId, name, onclose, detail }: Props = $props();

  const OPEN_LABEL = 'Open in Monsters';

  let closeButton = $state<HTMLButtonElement | undefined>();

  // The panel is read straight away, and the keyboard has to come off the game while it is up.
  $effect(() => {
    closeButton?.focus();
  });

  function openInMonsters() {
    app.requestedMonsterId = monsterId;
    goToTab(app, 'monsters');
    onclose();
  }
</script>

<Overlay label={name} {onclose} bind:closeButton>
  <p class="link">
    <button type="button" onclick={openInMonsters}>{OPEN_LABEL}</button>
  </p>
  {@render detail()}
</Overlay>

<style>
  .link {
    margin: 0 0 8px;
  }
  /* The panel's own close button is the DOS X at the corner; this one is a plain control, so it
     is drawn the way the rest of the tab's buttons are. */
  .link button {
    padding: 4px 10px;
    border: 1px solid var(--line);
    border-radius: 4px;
    background: var(--panel);
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
  }
  .link button:hover {
    border-color: var(--accent);
  }
</style>
