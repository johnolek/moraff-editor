<script lang="ts">
  import type { FloorSummary } from '../game/floor-summary';
  import { TOWN_BUILDINGS } from './labels';

  let { summary }: { summary: FloorSummary } = $props();

  const trapdoorLines = $derived([
    `${summary.trapdoors} total`,
    ...Object.entries(summary.trapdoorDests)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([floor, count]) => `to ${floor} (${count})`),
  ]);

  const rows = $derived([
    ['Open squares', String(summary.open)],
    ['Down ladders', String(summary.down)],
    ['Up ladders', String(summary.up)],
    ['Chutes', String(summary.chutes)],
    ['Teleporter squares', String(summary.teleporterSquares)],
    ['Doors', String(summary.doors)],
    ['Secret doors', String(summary.secretDoors)],
    ...(summary.floor === 0 ? TOWN_BUILDINGS.map((name, index) => [name, String(summary.town[index])]) : []),
  ]);
</script>

<section>
  <h2>This floor</h2>
  <dl>
    {#each rows as [label, value]}
      <dt>{label}</dt>
      <dd>{value}</dd>
    {/each}
    {#if summary.floor > 0}
      <dt>Trap doors</dt>
      <dd>
        {#each trapdoorLines as line}
          <div>{line}</div>
        {/each}
      </dd>
    {/if}
  </dl>
  {#if summary.trapdoorLanding}
    <p>Trap doors to this floor land at {summary.trapdoorLanding[0]}, {summary.trapdoorLanding[1]}.</p>
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
  p {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--muted);
  }
</style>
