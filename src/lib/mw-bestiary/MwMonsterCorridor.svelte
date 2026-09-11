<!--
  The picture on the Moraff's World monster card: the monster standing in a corridor of the floor
  the card is showing it on. The Play tab's own portrait of a monster stays the flat picture
  (`MwMonsterPicture.svelte`), since the corridor is already on the screen beside it.
-->
<script lang="ts">
  import IndexedCanvas from '../ui/IndexedCanvas.svelte';
  import { CORRIDOR_HEIGHT, CORRIDOR_WIDTH, renderMonsterInCorridor } from './corridor';
  import type { MwMonster } from './monsters';

  interface Props {
    entry: MwMonster;
    /** The floor whose colours to draw it in; set_palette picks the wall colours by floor % 11. */
    floor: number;
  }

  let { entry, floor }: Props = $props();

  const image = $derived(renderMonsterInCorridor(entry, floor));
</script>

<IndexedCanvas {image} width={CORRIDOR_WIDTH} height={CORRIDOR_HEIGHT} shown="512px" label={entry.name} />
