<script lang="ts">
  import { describeNote } from './describe';
  import { GLYPH_LABELS } from './labels';
  import type { NotableSquare } from './notes';
  import type { Point } from './viewport';

  let { entries, onpick }: { entries: NotableSquare[]; onpick: (square: Point) => void } = $props();
</script>

<section>
  <h2>Notable</h2>
  {#if entries.length === 0}
    <p class="hint">Nothing odd on this floor.</p>
  {:else}
    <ul>
      {#each entries as entry}
        <li>
          <button type="button" onclick={() => onpick({ x: entry.x, y: entry.y })}>
            <span class="where">{GLYPH_LABELS[entry.glyph]} at {entry.x}, {entry.y}</span>
            {#each entry.notes as note}
              <span class="note">{describeNote(note)}</span>
            {/each}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  h2 {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  button {
    display: flex;
    flex-direction: column;
    width: calc(100% + 8px);
    margin: 0 -4px;
    padding: 3px 4px;
    border: none;
    border-radius: 4px;
    background: none;
    color: var(--ink);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }
  button:hover {
    background: var(--panel-2);
  }
  .where {
    color: var(--ink);
  }
  .note {
    color: var(--muted);
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
