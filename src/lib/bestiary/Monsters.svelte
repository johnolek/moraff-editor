<!-- The Monsters tab under Dungeons of the Unforgiven. -->
<script lang="ts">
  import MonsterDatabase from './MonsterDatabase.svelte';
  import MonsterDetail from './MonsterDetail.svelte';
  import { monsterGroups } from './monsters';

  const groups = monsterGroups();
  const byId = new Map(groups.flatMap((group) => group.monsters).map((monster) => [monster.id, monster]));
</script>

<MonsterDatabase {groups} {detail} />

{#snippet detail(id: string, groupLabel: string)}
  <MonsterDetail entry={byId.get(id)!} {groupLabel} />
{/snippet}
