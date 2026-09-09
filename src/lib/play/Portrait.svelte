<script lang="ts">
  import MonsterPicture from '../bestiary/MonsterPicture.svelte';
  import { sectionInfo } from '../game/sections';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import PortraitFrame from './PortraitFrame.svelte';

  interface Props {
    /** The monster standing straight ahead, or null when the character faces none. */
    monster: StockedMonster | null;
    /** 0-based, the way the record counts modules. */
    module: number;
    floor: number;
  }

  let { monster, module, floor }: Props = $props();

  const entry = $derived(monster ? monsterById(monster.monsterId) : null);
  /** A monster is drawn in the palette of the section it stands in; the town belongs to none,
   *  and has no monsters to draw either. */
  const part = $derived(sectionInfo(module, floor)?.part ?? 1);
</script>

<PortraitFrame {entry}>
  {#snippet picture(entry)}
    <MonsterPicture {entry} module={module + 1} {part} />
  {/snippet}
</PortraitFrame>
