<script lang="ts">
  import { expectedKills, perHour, type DropRow } from './drops';

  interface Props {
    rows: DropRow[];
    killsPerMinute: number;
  }

  let { rows, killsPerMinute }: Props = $props();

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;

  function kills(chance: number): string {
    const count = expectedKills(chance);
    return count === null ? 'never' : Math.round(count).toLocaleString();
  }
</script>

<table>
  <thead>
    <tr><th>Item</th><th>Chance per kill</th><th>Expected kills</th><th>Per hour</th></tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td>{row.name}</td>
        <td>{percent(row.chance)}</td>
        <td>{kills(row.chance)}</td>
        <td>{perHour(row.chance, killsPerMinute).toFixed(1)}</td>
      </tr>
    {/each}
  </tbody>
</table>
