<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import type { NotableSquares } from './notes';
  import type { Point } from './viewport';

  let { notable, onpick }: { notable: NotableSquares; onpick: (square: Point) => void } = $props();
</script>

{#if notable.oneWayUp.length === 0 && notable.intoChute.length === 0}
  <p class="hint">Nothing odd on this floor.</p>
{/if}
{#if notable.oneWayUp.length}
  <section>
    <SectionHeading title="One-way up ladders" />
    <ul>
      {#each notable.oneWayUp as square}
        <li>
          <button type="button" onclick={() => onpick(square)}>{square.x}, {square.y}</button>
        </li>
      {/each}
    </ul>
  </section>
{/if}
{#if notable.intoChute.length}
  <section>
    <SectionHeading title="Up ladders into a chute" />
    <ul>
      {#each notable.intoChute as square}
        <li>
          <button type="button" onclick={() => onpick({ x: square.x, y: square.y })}>
            {square.x}, {square.y}
            <span class="destination">to floor {square.chuteFloor}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 6px;
  }
  button {
    padding: 2px 4px;
    border: none;
    border-radius: 4px;
    background: none;
    color: var(--ink);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }
  button:hover {
    background: var(--panel-2);
  }
  .destination {
    color: var(--muted);
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
