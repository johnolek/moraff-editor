<!-- The Monsters tab under Moraff's World. -->
<script lang="ts">
  import MonsterDatabase from '../bestiary/MonsterDatabase.svelte';
  import { MONSTERS, monsterGroups } from './monsters';
  import MwMonsterDetail from './MwMonsterDetail.svelte';

  const groups = monsterGroups().map((group) => ({
    label: group.label,
    monsters: group.monsters.map((monster) => ({ id: String(monster.index), name: monster.name })),
  }));

  const REROLL_NOTE =
    'The game rolls a floor’s 145 monsters from the clock every time you arrive, so no two visits ' +
    'hold the same ones. What can be shown is how often each monster turns up, not which are down there.';
</script>

<MonsterDatabase {groups} {detail} note={REROLL_NOTE} />

{#snippet detail(id: string, groupLabel: string)}
  <MwMonsterDetail entry={MONSTERS[Number(id)]} {groupLabel} />
{/snippet}
