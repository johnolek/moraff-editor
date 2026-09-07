<script lang="ts">
  import { expectedKills, type DropRow } from './drops';

  interface Props {
    rows: DropRow[];
  }

  let { rows }: Props = $props();

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;

  function kills(chance: number): string {
    const count = expectedKills(chance);
    return count === null ? 'never' : Math.round(count).toLocaleString();
  }
</script>

<table>
  <thead>
    <tr><th>Item</th><th>Chance per kill</th><th>Expected kills</th></tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td>{row.name}</td>
        <td>{percent(row.chance)}</td>
        <td>{kills(row.chance)}</td>
      </tr>
    {/each}
  </tbody>
</table>
