<script lang="ts">
  import IndexedCanvas from '../ui/IndexedCanvas.svelte';
  import type { MwMonster } from './monsters';
  import { PICTURE_HEIGHT, PICTURE_WIDTH, renderMonster } from './pictures';

  interface Props {
    entry: MwMonster;
    /** The floor whose colours to draw it in; set_palette picks the wall colours by floor % 11. */
    floor: number;
  }

  let { entry, floor }: Props = $props();

  const image = $derived(renderMonster(entry, floor));
</script>

<IndexedCanvas {image} width={PICTURE_WIDTH} height={PICTURE_HEIGHT} shown="512px" label={entry.name} />
