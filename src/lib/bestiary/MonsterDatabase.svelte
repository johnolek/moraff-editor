<!--
  The two panes both games' monster tabs are built from: a searchable list on the left, and
  whatever card the game draws for the monster picked, on the right.
-->
<script lang="ts">
  import { tick, untrack, type Snippet } from 'svelte';
  import { app } from '../app-state.svelte';
  import type { ListGroup } from './list';
  import MonsterList from './MonsterList.svelte';

  interface Props {
    groups: ListGroup[];
    /** The card for the monster picked: its id, and the heading of the group it is under. */
    detail: Snippet<[string, string]>;
    placeholder?: string;
    /** A line under the search box, for whatever the game's list needs said about it. */
    note?: string;
  }

  let { groups, detail, placeholder = 'Search monsters', note }: Props = $props();

  let search = $state('');
  // The list holds the monster's id rather than the record itself, so that the record the
  // detail panel gets is the one in the catalogue and not a reactive copy of it.
  let selectedId = $state(untrack(() => groups[0].monsters[0].id));

  const matches = $derived.by(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({ ...group, monsters: group.monsters.filter((m) => m.name.toLowerCase().includes(query)) }))
      .filter((group) => group.monsters.length > 0);
  });

  const selectedGroup = $derived(groups.find((group) => group.monsters.some((m) => m.id === selectedId))!);

  let scroll: HTMLDivElement;

  // Another tab can ask for a monster by id; the search box is cleared so the list is sure to
  // show it. Only the game being shown has a database mounted, so only it answers.
  $effect(() => {
    const id = app.requestedMonsterId;
    if (!id || !groups.some((group) => group.monsters.some((m) => m.id === id))) return;
    app.requestedMonsterId = null;
    search = '';
    selectedId = id;
    tick().then(() => scroll.querySelector('button.selected')?.scrollIntoView({ block: 'center' }));
  });
</script>

<div class="database">
  <div class="list">
    <input type="search" {placeholder} bind:value={search} />
    {#if note}
      <p class="note">{note}</p>
    {/if}
    <div class="scroll" bind:this={scroll}>
      <MonsterList groups={matches} {selectedId} onselect={(entry) => (selectedId = entry.id)} />
    </div>
  </div>
  <div class="detail">
    {#key selectedId}
      {@render detail(selectedId, selectedGroup.label)}
    {/key}
  </div>
</div>

<style>
  .database {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .list {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-right: 1px solid var(--line);
    background: var(--panel);
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  input {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
    font-size: 13px;
  }
  .note {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--muted);
  }
  .detail {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }
</style>
