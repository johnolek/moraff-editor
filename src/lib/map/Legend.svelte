<script lang="ts">
  import type { FloorSummary } from '../game/floor-summary';
  import type { Square } from '../game/unfmap.js';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { GLYPH_LABELS, TOWN_BUILDINGS } from './labels';
  import LegendSample from './LegendSample.svelte';
  import type { LegendKind } from './marks';

  interface Props {
    /** Counts shown under each entry. */
    summary: FloorSummary;
    /** Label of the entry whose squares stay marked until it is clicked again or cleared. */
    pinned: string | null;
    onhover: (kind: LegendKind | null) => void;
    onpin: (label: string | null, kind: LegendKind | null) => void;
  }

  let { summary, pinned, onhover, onpin }: Props = $props();

  function toggle(label: string, kind: LegendKind) {
    if (pinned === label) onpin(null, null);
    else onpin(label, kind);
  }

  function sample(overrides: Partial<Square>): Square {
    return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
  }

  function isTrapdoor(kind: LegendKind): boolean {
    return kind.kind === 'glyph' && kind.glyph === 'trapdoor';
  }

  const entries = $derived<{ label: string; square: Square; kind: LegendKind; count: number }[]>([
    { label: 'Open square', square: sample({ n: 0, s: 0 }), kind: { kind: 'open' }, count: summary.open },
    { label: 'Door', square: sample({ n: 1, s: 0 }), kind: { kind: 'side', side: 1 }, count: summary.doors },
    { label: 'Secret door', square: sample({ n: 2, s: 0 }), kind: { kind: 'side', side: 2 }, count: summary.secretDoors },
    { label: 'Teleporter', square: sample({ n: 4, s: 0 }), kind: { kind: 'side', side: 4 }, count: summary.teleporterSquares },
    { label: GLYPH_LABELS.down, square: sample({ n: 0, s: 0, ladder: 1 }), kind: { kind: 'glyph', glyph: 'down' }, count: summary.down },
    { label: GLYPH_LABELS.up, square: sample({ n: 0, s: 0, ladder: -1 }), kind: { kind: 'glyph', glyph: 'up' }, count: summary.up },
    { label: GLYPH_LABELS.trapdoor, square: sample({ n: 0, s: 0, trapdoor: 5 }), kind: { kind: 'glyph', glyph: 'trapdoor' }, count: summary.trapdoors },
    { label: GLYPH_LABELS.chute, square: sample({ n: 0, s: 0, chute: 1 }), kind: { kind: 'glyph', glyph: 'chute' }, count: summary.chutes },
    ...TOWN_BUILDINGS.map((label, index) => ({
      label,
      square: sample({ n: 0, s: 0, town: index + 1 }),
      kind: { kind: 'town', building: index + 1 } as LegendKind,
      count: summary.town[index],
    })),
  ]);

  const trapdoorDestinations = $derived(
    Object.entries(summary.trapdoorDests)
      .map(([floor, count]) => ({ floor: Number(floor), count, label: `to ${floor} (${count})` }))
      .sort((a, b) => a.floor - b.floor),
  );
</script>

<section>
  <SectionHeading title="Legend">
    {#if pinned}
      <button class="clear" onclick={() => onpin(null, null)}>Clear</button>
    {/if}
  </SectionHeading>
  <ul class="entries">
    {#each entries as { label, square, kind, count }}
      <li class:wide={isTrapdoor(kind) && summary.floor > 0}>
        <button
          type="button"
          class="entry"
          class:pinned={pinned === label}
          onpointerenter={() => onhover(kind)}
          onpointerleave={() => onhover(null)}
          onclick={() => toggle(label, kind)}
        >
          <LegendSample {square} />
          <span class="text">
            <span>{label}</span>
            <span class="count">{count}</span>
          </span>
        </button>
        {#if isTrapdoor(kind) && summary.floor > 0}
          <ul class="destinations">
            {#each trapdoorDestinations as { floor, label }}
              <li>
                <button
                  type="button"
                  class="destination"
                  class:pinned={pinned === label}
                  onpointerenter={() => onhover({ kind: 'trapdoorTo', floor })}
                  onpointerleave={() => onhover(null)}
                  onclick={() => toggle(label, { kind: 'trapdoorTo', floor })}
                >
                  {label}
                </button>
              </li>
            {/each}
          </ul>
          {#if summary.trapdoorLanding}
            <p class="landing">Trap doors to this floor land at {summary.trapdoorLanding[0]}, {summary.trapdoorLanding[1]}.</p>
          {/if}
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style>
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
  }
  .entries {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 12px;
  }
  .wide {
    grid-column: 1 / -1;
  }
  .destinations {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 6px;
    margin: 2px 0 0 26px;
  }
  .destination {
    padding: 2px 4px;
    border: none;
    border-radius: 4px;
    background: none;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
  .destination:hover {
    background: var(--panel-2);
    color: var(--ink);
  }
  .destination.pinned {
    background: var(--panel-2);
    color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
  .landing {
    margin: 4px 0 0 30px;
    font-size: 12px;
    color: var(--muted);
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
  .text {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }
  .count {
    color: var(--muted);
  }
  .entry:hover {
    background: var(--panel-2);
  }
  .entry.pinned {
    background: var(--panel-2);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
</style>
