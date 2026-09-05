<script lang="ts">
  import type { FloorSummary } from '../game/floor-summary';
  import { TOWN_BUILDINGS } from './labels';

  let { summary }: { summary: FloorSummary } = $props();

  const trapdoorDests = $derived(
    Object.entries(summary.trapdoorDests)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([floor, count]) => `${floor} ×${count}`)
      .join(', '),
  );

  const rows = $derived([
    ['Open squares', summary.open],
    ['Down ladders', summary.down],
    ['Up ladders', summary.up],
    ['Chutes', summary.chutes],
    ['Trap doors', summary.trapdoors + (trapdoorDests ? ` (to ${trapdoorDests})` : '')],
    ['Teleporter squares', summary.teleporterSquares],
    ['Doors', summary.doors],
    ['Secret doors', summary.secretDoors],
    ...(summary.floor === 0 ? TOWN_BUILDINGS.map((name, index) => [name, summary.town[index]]) : []),
  ]);
</script>

<section>
  <h2>This floor</h2>
  <dl>
    {#each rows as [label, value]}
      <dt>{label}</dt>
      <dd>{value}</dd>
    {/each}
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
