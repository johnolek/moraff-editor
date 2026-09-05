<script lang="ts">
  import MonsterDetail from './MonsterDetail.svelte';
  import MonsterList from './MonsterList.svelte';
  import { monsterGroups, type MonsterEntry } from './monsters';

  const groups = monsterGroups();

  let search = $state('');
  let selected = $state<MonsterEntry>(groups[0].monsters[0]);

  const matches = $derived.by(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({ ...group, monsters: group.monsters.filter((m) => m.name.toLowerCase().includes(query)) }))
      .filter((group) => group.monsters.length > 0);
  });

  const groupLabel = $derived(groups.find((group) => group.monsters.includes(selected))!.label);
</script>

<div class="database">
  <div class="list">
    <input type="search" placeholder="Search monsters" bind:value={search} />
    <div class="scroll">
      <MonsterList groups={matches} selectedId={selected.id} onselect={(entry) => (selected = entry)} />
    </div>
  </div>
  <div class="detail">
    {#key selected.id}
      <MonsterDetail entry={selected} {groupLabel} />
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
