<script lang="ts">
  import { tick } from 'svelte';
  import { app } from '../app-state.svelte';
  import MonsterDetail from './MonsterDetail.svelte';
  import MonsterList from './MonsterList.svelte';
  import { monsterGroups } from './monsters';

  const groups = monsterGroups();

  let search = $state('');
  // The list holds the monster's id rather than the record itself, so that the record the
  // detail panel gets is the one in the catalogue and not a reactive copy of it.
  let selectedId = $state(groups[0].monsters[0].id);

  const matches = $derived.by(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({ ...group, monsters: group.monsters.filter((m) => m.name.toLowerCase().includes(query)) }))
      .filter((group) => group.monsters.length > 0);
  });

  const selectedGroup = $derived(groups.find((group) => group.monsters.some((m) => m.id === selectedId))!);
  const selected = $derived(selectedGroup.monsters.find((m) => m.id === selectedId)!);

  let scroll: HTMLDivElement;

  // Another tab can ask for a monster by id; the search box is cleared so the list is sure to
  // show it.
  $effect(() => {
    const id = app.requestedMonsterId;
    if (!id) return;
    app.requestedMonsterId = null;
    search = '';
    selectedId = id;
    tick().then(() => scroll.querySelector('button.selected')?.scrollIntoView({ block: 'center' }));
  });
</script>

<div class="database">
  <div class="list">
    <input type="search" placeholder="Search monsters" bind:value={search} />
    <div class="scroll" bind:this={scroll}>
      <MonsterList groups={matches} {selectedId} onselect={(entry) => (selectedId = entry.id)} />
    </div>
  </div>
  <div class="detail">
    {#key selectedId}
      <MonsterDetail entry={selected} groupLabel={selectedGroup.label} />
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
  .detail {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }
</style>
