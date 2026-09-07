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
    'The game rolls a floor’s 145 monsters from the clock the first time you arrive and keeps the three ' +
    'floors you were on last, so going up a ladder and back finds them where they were, while a floor left ' +
    'two floors behind is rolled afresh. What can be shown is how often each monster turns up, not which ' +
    'are down there.';
</script>

<MonsterDatabase {groups} {detail} note={REROLL_NOTE} />

{#snippet detail(id: string, groupLabel: string)}
  <MwMonsterDetail entry={MONSTERS[Number(id)]} {groupLabel} />
{/snippet}
