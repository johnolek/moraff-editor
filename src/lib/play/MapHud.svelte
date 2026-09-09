<!--
  The heads-up display over the top-down map: the monster being fought at the top, and along the
  bottom a bar of dark stone with the health and spell orbs standing in its ends and the
  experience bar between them.

  The map is the site's own view of a game rather than anything the game ever drew, so this is the
  site's own look (John, 2026-09-09). It takes no clicks and changes nothing: the game, the run
  log and a replay run exactly as they do without it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { HUD_ORB_PX } from './hud';
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

<div class="hud" style:--orb-cap="{HUD_ORB_PX}px">
  {#if closeUp}
    <div class="close-up">{@render closeUp()}</div>
  {/if}
  <div class="foot">
    <div class="stone"></div>
    <div class="row">
      <HudOrb kind="health" value={hp} max={maxHp} />
      <div class="middle"><HudExpBar {level} {exp} {needed} /></div>
      <HudOrb kind="spell" value={sp} max={maxSp} />
    </div>
  </div>
</div>

<style>
  .hud {
    position: absolute;
    inset: 0;
    /* Every click, drag and hover belongs to the map underneath, whatever of the display is
       standing over it. */
    pointer-events: none;
    /* Everything on the bar is a fraction of the orb, so the whole display scales together. The
       map is only as tall as the page gives it, and full-sized orbs on a short one would leave
       more bar than floor, so the height of the stage caps them. */
    --orb-size: min(var(--orb-cap), 26cqh);
    --bar-height: calc(var(--orb-size) * 0.5);
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
    left: 0;
    right: 0;
    bottom: 0;
  }
  /*
    The bar itself: a band of dark stone across the foot of the map, lit along its top edge and
    falling away into the dark at the bottom, with the grain cut across it. It is drawn out of
    gradients rather than a picture, so it costs the page nothing to load.

    It is half the height of an orb, which is what leaves the top half of each orb standing proud
    of it and the bottom half sunk into the stone.
  */
  .stone {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--bar-height);
    background:
      repeating-linear-gradient(114deg, rgba(255, 255, 255, 0.035) 0 2px, rgba(0, 0, 0, 0) 2px 9px),
      linear-gradient(180deg, #2c2c3e 0%, #1a1a28 46%, #09090f 100%);
    border-top: 2px solid var(--line);
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.08),
      0 -10px 24px rgba(0, 0, 0, 0.55);
  }
  .row {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: calc(var(--orb-size) * 0.12);
    padding: 0 calc(var(--orb-size) * 0.1);
  }
  .middle {
    flex: 1;
    display: flex;
    justify-content: center;
    /* Centred up the stone between the orbs rather than sitting on the bottom edge of the map. */
    padding-bottom: calc(var(--bar-height) * 0.16);
  }
</style>
