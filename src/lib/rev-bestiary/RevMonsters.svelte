<!-- The Monsters tab under Moraff's Revenge. -->
<script lang="ts">
  import MonsterDatabase from '../bestiary/MonsterDatabase.svelte';
  import { monsterById, monsterGroups, monsterId } from './monsters';
  import RevMonsterDetail from './RevMonsterDetail.svelte';

  const groups = monsterGroups().map((group) => ({
    label: group.label,
    monsters: group.monsters.map((monster) => ({
      id: monsterId(group.dungeon, monster),
      name: monster.name,
    })),
  }));

  const FIXED_NOTE =
    'The dungeon is stocked once and for all: 1.NUM holds forty monsters for each of the seventy levels and 2.NUM ' +
    'what each has left, both shared by every character on the disk. Which name a slot is comes out of the slot ' +
    'number, so the first thirty-four levels draw on one set of twenty-two names and the rest on another.';
</script>

<MonsterDatabase {groups} {detail} note={FIXED_NOTE} />

{#snippet detail(id: string, groupLabel: string)}
  {@const found = monsterById(id)}
  <RevMonsterDetail entry={found.monster} dungeon={found.dungeon} {groupLabel} />
{/snippet}
