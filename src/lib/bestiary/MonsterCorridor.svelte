<!--
  The picture on the Dungeons of the Unforgiven monster card: the monster standing in a corridor
  of the section the card is showing it in. The Play tab's own portrait of a monster stays the
  flat picture (`MonsterPicture.svelte`), since the corridor is already on the screen beside it.
-->
<script lang="ts">
  import IndexedCanvas from '../ui/IndexedCanvas.svelte';
  import { CORRIDOR_HEIGHT, CORRIDOR_WIDTH, renderMonsterInCorridor } from './corridor';
  import type { Monster } from './monsters';

  interface Props {
    entry: Monster;
    /** 0-based, the way the game counts modules. */
    module: number;
    floor: number;
    /** The section that floor belongs to, 1..20. */
    section: number;
    /** Which quarter of the module that section is, 1..4. */
    part: number;
  }

  let { entry, module, floor, section, part }: Props = $props();

  // The four are taken apart rather than passed as one object so that the drawing is redone only
  // when one of them actually changes.
  const image = $derived(renderMonsterInCorridor(entry, { module, floor, section, part }));
</script>

<IndexedCanvas {image} width={CORRIDOR_WIDTH} height={CORRIDOR_HEIGHT} shown="512px" label={entry.name} />
