<script lang="ts">
  import IndexedCanvas from '../ui/IndexedCanvas.svelte';
  import type { Monster } from './monsters';
  import { PICTURE_HEIGHT, PICTURE_WIDTH, renderMonster } from './pictures';

  interface Props {
    entry: Monster;
    /** 1-based, the way the palette table is keyed. */
    module: number;
    /** Section within the module, 1..4. */
    part: number;
  }

  let { entry, module, part }: Props = $props();

  const image = $derived(renderMonster(entry, module, part));
</script>

<IndexedCanvas {image} width={PICTURE_WIDTH} height={PICTURE_HEIGHT} shown="512px" label={entry.name} />
