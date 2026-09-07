<script lang="ts">
  import MonsterPicture from '../bestiary/MonsterPicture.svelte';
  import { PICTURE_HEIGHT, PICTURE_WIDTH } from '../bestiary/pictures';
  import { sectionInfo } from '../game/sections';
  import { monsterById, type StockedMonster } from '../map/stocking';

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

<div class="portrait" style:aspect-ratio="{PICTURE_WIDTH} / {PICTURE_HEIGHT}">
  {#if entry}
    <MonsterPicture {entry} module={module + 1} {part} />
  {:else}
    <p class="empty">NOTHING IN FRONT OF YOU</p>
  {/if}
</div>

<style>
  .portrait {
    position: relative;
    width: 100%;
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
