<script lang="ts">
  import type { Square } from '../game/unfmap.js';
  import type { Feature } from './floor-info';
  import { teleporterTargets } from './floor-info';
  import { GLYPH_LABELS, MODULE_NUMERALS, SIDE_LABELS, TOWN_BUILDINGS } from './labels';
  import { sideStroke } from './palette';
  import type { Point } from './viewport';

  interface Props {
    cursor: Point | null;
    square: Square | null;
    feature: Feature;
    moduleIndex: number;
  }

  let { cursor, square, feature, moduleIndex }: Props = $props();

  const sides = $derived(
    square
      ? [
          ['North', square.n],
          ['South', square.s],
          ['West', square.w],
          ['East', square.e],
        ].map(([name, side]) => [name, describeSide(side as Square['n'])])
      : [],
  );

  function describeSide(side: Square['n']): string {
    const stroke = sideStroke(side);
    if (stroke === 'teleporter') {
      const targets = teleporterTargets(moduleIndex).map((index) => MODULE_NUMERALS[index]);
      return `${SIDE_LABELS.teleporter} to Module ${targets.join(' or ')}`;
    }
    return SIDE_LABELS[stroke ?? 'open'];
  }

  function describeFeature(feature: Feature): string {
    if (!feature) return '';
    if (feature.kind === 'town') return TOWN_BUILDINGS[feature.building - 1];
    const { floor, x, y } = feature.destination;
    const landing = feature.kind === 'trapdoor' ? `, lands at ${x}, ${y}` : '';
    return `${GLYPH_LABELS[feature.kind]} to floor ${floor}${landing}`;
  }
</script>

<section>
  {#if cursor && square}
    <h2>Square {cursor.x}, {cursor.y}</h2>
    {#if square.solid}
      <p class="feature">Rock</p>
    {:else}
      <dl>
        {#each sides as [name, description]}
          <dt>{name}</dt>
          <dd>{description}</dd>
        {/each}
      </dl>
      {#if feature}
        <p class="feature">{describeFeature(feature)}</p>
      {/if}
    {/if}
  {:else}
    <p class="hint">Point at a square to inspect it.</p>
  {/if}
</section>

<style>
  section {
    min-height: 150px;
  }
  h2 {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  .feature {
    margin: 10px 0 0;
    font-size: 13px;
    color: var(--accent);
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
