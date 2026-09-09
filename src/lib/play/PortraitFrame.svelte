<!--
  The box beside the game's screen that holds a picture of whatever the character is facing.

  The three games draw a monster from their own tables and their own palettes, so each hands its
  picture in as a snippet; the box, its shape and the line it shows when there is nothing to draw
  are the same for all of them.
-->
<script lang="ts" generics="Entry">
  import type { Snippet } from 'svelte';
  import { PICTURE_HEIGHT, PICTURE_WIDTH } from '../bestiary/pictures';

  interface Props {
    /** The monster to draw, or null when the character faces none. */
    entry: Entry | null;
    picture: Snippet<[Entry]>;
  }

  let { entry, picture }: Props = $props();
</script>

<div class="portrait" style:aspect-ratio="{PICTURE_WIDTH} / {PICTURE_HEIGHT}">
  {#if entry !== null}
    {@render picture(entry)}
  {:else}
    <p class="empty">NOTHING IN FRONT OF YOU</p>
  {/if}
</div>

<style>
  .portrait {
    position: relative;
    width: 100%;
    /* The picture is 256 pixels across, and past about a third again it is only bigger. */
    max-width: 340px;
  }
  .portrait :global(canvas) {
    width: 100%;
    height: 100%;
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: #000;
    font-family: var(--font-dos);
    font-size: 20px;
    text-align: center;
    color: var(--muted);
  }
</style>
