<script lang="ts">
  import IndexedCanvas from '../ui/IndexedCanvas.svelte';
  import type { RevPicture } from './monsters';
  import { renderPicture } from './pictures';

  interface Props {
    picture: RevPicture;
    /** Which of the two SCREEN 1 palettes to draw it in. */
    palette: number;
    label: string;
    /** How wide to show it; the pixels are square, so the height follows. */
    scale: number;
  }

  let { picture, palette, label, scale }: Props = $props();

  const image = $derived(renderPicture(picture, palette));
</script>

<IndexedCanvas
  {image}
  width={picture.width}
  height={picture.height}
  shown="{picture.width * scale}px"
  {label} />
