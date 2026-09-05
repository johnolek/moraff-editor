<script lang="ts">
  import type { Square } from '../game/unfmap.js';
  import { GLYPH_LABELS, TOWN_BUILDINGS } from './labels';
  import LegendSample from './LegendSample.svelte';
  import type { LegendKind } from './marks';

  interface Props {
    /** Label of the entry whose squares stay marked until it is clicked again or cleared. */
    pinned: string | null;
    onhover: (kind: LegendKind | null) => void;
    onpin: (label: string | null, kind: LegendKind | null) => void;
  }

  let { pinned, onhover, onpin }: Props = $props();

  function toggle(label: string, kind: LegendKind) {
    if (pinned === label) onpin(null, null);
    else onpin(label, kind);
  }

  function sample(overrides: Partial<Square>): Square {
    return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
  }

  const entries: { label: string; square: Square; kind: LegendKind }[] = [
    { label: 'Open square', square: sample({ n: 0, s: 0 }), kind: { kind: 'open' } },
    { label: 'Door', square: sample({ n: 1, s: 0 }), kind: { kind: 'side', side: 1 } },
    { label: 'Secret door', square: sample({ n: 2, s: 0 }), kind: { kind: 'side', side: 2 } },
    { label: 'Teleporter', square: sample({ n: 4, s: 0 }), kind: { kind: 'side', side: 4 } },
    { label: GLYPH_LABELS.down, square: sample({ n: 0, s: 0, ladder: 1 }), kind: { kind: 'glyph', glyph: 'down' } },
    { label: GLYPH_LABELS.up, square: sample({ n: 0, s: 0, ladder: -1 }), kind: { kind: 'glyph', glyph: 'up' } },
    { label: GLYPH_LABELS.trapdoor, square: sample({ n: 0, s: 0, trapdoor: 5 }), kind: { kind: 'glyph', glyph: 'trapdoor' } },
    { label: GLYPH_LABELS.chute, square: sample({ n: 0, s: 0, chute: 1 }), kind: { kind: 'glyph', glyph: 'chute' } },
    ...TOWN_BUILDINGS.map((label, index) => ({
      label,
      square: sample({ n: 0, s: 0, town: index + 1 }),
      kind: { kind: 'town', building: index + 1 } as LegendKind,
    })),
  ];
</script>

<section>
  <h2>
    Legend
    {#if pinned}
      <button class="clear" onclick={() => onpin(null, null)}>Clear</button>
    {/if}
  </h2>
  <ul>
    {#each entries as { label, square, kind }}
      <li>
        <button
          type="button"
          class="entry"
          class:pinned={pinned === label}
          onpointerenter={() => onhover(kind)}
          onpointerleave={() => onhover(null)}
          onclick={() => toggle(label, kind)}
        >
          <LegendSample {square} />
          <span>{label}</span>
        </button>
      </li>
    {/each}
  </ul>
</section>

<style>
  h2 {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .clear {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: 11px;
    color: var(--muted);
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
  }
  .clear:hover {
    color: var(--ink);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
  }
  .entry {
    display: flex;
    align-items: center;
    gap: 8px;
    width: calc(100% + 8px);
    padding: 2px 4px;
    margin: 0 -4px;
    white-space: nowrap;
    border: none;
    border-radius: 4px;
    background: none;
    color: var(--ink);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }
  .entry:hover {
    background: var(--panel-2);
  }
  .entry.pinned {
    background: var(--panel-2);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
</style>
