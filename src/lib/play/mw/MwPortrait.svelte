<script lang="ts">
  import MwMonsterPicture from '../../mw-bestiary/MwMonsterPicture.svelte';
  import { MONSTERS } from '../../mw-bestiary/monsters';
  import { PICTURE_HEIGHT, PICTURE_WIDTH } from '../../mw-bestiary/pictures';
  import type { StockedMonster } from '../../map/stocking';

  interface Props {
    /** The monster the character is fighting, or null when they face none. */
    monster: StockedMonster | null;
    /** The floor whose colours to draw it in; set_palette picks them by floor % 11. */
    floor: number;
  }

  let { monster, floor }: Props = $props();

  const entry = $derived(monster ? MONSTERS[Number(monster.monsterId)] : null);
</script>

<div class="portrait" style:aspect-ratio="{PICTURE_WIDTH} / {PICTURE_HEIGHT}">
  {#if entry}
    <MwMonsterPicture {entry} {floor} />
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
