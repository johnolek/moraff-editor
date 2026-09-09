<!--
  The bar standing down the left of the close-up of the monster being fought: the hit points it
  has left against the hit points it was stocked with, in the same glass the character's orbs in
  the corners are made of, draining rather than jumping.

  Nothing here is a port of anything the games draw. It is the site's own look, over the site's
  own map (John, 2026-09-09).
-->
<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';
  import { HUD_TWEEN_MS, orbFill } from './hud';

  interface Props {
    /** The hit points the monster has left. */
    value: number;
    /** The hit points it was stocked with; a bar with no maximum at all is drawn empty. */
    max: number;
  }

  let { value, max }: Props = $props();

  const fill = Tween.of(() => orbFill(value, max), { duration: HUD_TWEEN_MS, easing: cubicOut });
</script>

<div class="vial">
  <div class="liquid" style:height="{fill.current * 100}%"></div>
  <div class="glass"></div>
</div>

<style>
  /* The rim and the width are fractions of an orb, so the bar shrinks with the display the orbs
     shrink with. Its height is the picture's, which the frame beside it stretches it to. */
  .vial {
    position: relative;
    width: calc(var(--orb-size) * 0.19);
    border-radius: calc(var(--orb-size) * 0.095);
    overflow: hidden;
    background: #05040a;
    border: calc(var(--orb-size) * 0.02) solid var(--line);
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.75),
      0 6px 16px rgba(0, 0, 0, 0.6);
    --liquid-top: #ff4a4a;
    --liquid-bottom: #6d0b0b;
    --meniscus: #ffb0b0;
  }
  .liquid {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, var(--liquid-bottom), var(--liquid-top));
    /* The lighter line where the liquid meets the air. */
    box-shadow: inset 0 calc(var(--orb-size) * 0.02) 0 var(--meniscus);
  }
  /* The curve of the glass over the liquid: a highlight down the left of the cylinder and the
     dark its edges fall away into. */
  .glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 4%,
      rgba(255, 255, 255, 0.3) 24%,
      rgba(255, 255, 255, 0) 48%
    );
    box-shadow: inset 0 0 calc(var(--orb-size) * 0.08) rgba(0, 0, 0, 0.8);
  }
</style>
