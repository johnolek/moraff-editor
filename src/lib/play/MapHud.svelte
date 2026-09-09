<!--
  The heads-up display over the top-down map: the monster being fought at the top, the health and
  spell orbs in the bottom corners and the experience bar between them.

  The map is the site's own view of a game rather than anything the game ever drew, so this is the
  site's own look (John, 2026-09-09). It takes no clicks and changes nothing: the game, the run
  log and a replay run exactly as they do without it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import HudExpBar from './HudExpBar.svelte';
  import HudOrb from './HudOrb.svelte';

  interface Props {
    /**
     * The engaged monster's picture, centred at the top. The caller passes it only while a fight
     * is on, and leaves it out altogether for a game whose map draws that picture already.
     */
    closeUp?: Snippet;
    /** The character's hit points and what they can hold. */
    hp: number;
    maxHp: number;
    /** Their spell points and what they can hold; a fighter's maximum is nothing. */
    sp: number;
    maxSp: number;
    /** Their own level and the experience they have earned. */
    level: number;
    exp: number;
    /** The game's own curve: the experience it takes to reach level `level + 1`. */
    needed: (level: number) => number;
  }

  let { closeUp, hp, maxHp, sp, maxSp, level, exp, needed }: Props = $props();
</script>

<div class="hud">
  {#if closeUp}
    <div class="close-up">{@render closeUp()}</div>
  {/if}
  <div class="foot">
    <HudOrb kind="health" value={hp} max={maxHp} />
    <div class="middle"><HudExpBar {level} {exp} {needed} /></div>
    <HudOrb kind="spell" value={sp} max={maxSp} />
  </div>
</div>

<style>
  .hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --orb-size: 96px;
  }
  /* The picture is drawn at the width `PortraitFrame` caps itself at, so the frame fills the
     box the border is on however wide the map is. */
  .close-up {
    position: absolute;
    left: 50%;
    top: var(--inset);
    transform: translateX(-50%);
    width: min(40%, 340px);
    border: 1px solid var(--line);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  }
  .foot {
    position: absolute;
    left: var(--inset);
    right: var(--inset);
    bottom: var(--inset);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .middle {
    flex: 1;
    display: flex;
    justify-content: center;
    padding-bottom: 8px;
  }
</style>
