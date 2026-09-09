<script lang="ts">
  import MwMonsterPicture from '../../mw-bestiary/MwMonsterPicture.svelte';
  import { MONSTERS } from '../../mw-bestiary/monsters';
  import type { StockedMonster } from '../../map/stocking';
  import PortraitFrame from '../PortraitFrame.svelte';

  interface Props {
    /** The monster the character is fighting, or null when they face none. */
    monster: StockedMonster | null;
    /** The floor whose colours to draw it in; set_palette picks them by floor % 11. */
    floor: number;
  }

  let { monster, floor }: Props = $props();

  const entry = $derived(monster ? MONSTERS[Number(monster.monsterId)] : null);
</script>

<PortraitFrame {entry}>
  {#snippet picture(entry)}
    <MwMonsterPicture {entry} {floor} />
  {/snippet}
</PortraitFrame>
