<script lang="ts">
  import { app, currentEntry, type GameId } from '../app-state.svelte';
  import CharacterList from '../character/CharacterList.svelte';

  interface Props {
    /** The game this Play tab is for, which is the only game whose characters can walk in it. */
    game: GameId;
  }

  let { game }: Props = $props();

  const ours = $derived(app.roster.filter((entry) => entry.game === game));
  const current = $derived(currentEntry());
</script>

{#if ours.length > 0}
  <section class="roster">
    <h3>Characters on the roster</h3>
    <p class="note">Click a name to pick who plays.</p>
    <CharacterList entries={ours} currentId={current?.id ?? null} />
  </section>
{/if}

<style>
  .roster {
    margin-top: 24px;
  }
  h3 {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--accent);
  }
  .note {
    margin: 0 0 10px;
    color: var(--muted);
    font-size: 13px;
  }
</style>
