<script lang="ts">
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import { MODULE_NUMERALS } from '../map/labels';

  interface Props {
    module: number;
    floor: number;
  }

  let { module = $bindable(), floor = $bindable() }: Props = $props();

  const floors = $derived(Array.from({ length: BOTTOM_LEVEL[module] }, (_, index) => index + 1));

  function changeModule(event: Event) {
    module = Number((event.currentTarget as HTMLSelectElement).value);
    floor = Math.min(floor, BOTTOM_LEVEL[module]);
  }
</script>

<label>
  <span>Module</span>
  <select value={module} onchange={changeModule}>
    {#each MODULE_NUMERALS as numeral, index}
      <option value={index}>{numeral}</option>
    {/each}
  </select>
</label>
<label>
  <span>Floor</span>
  <select bind:value={floor}>
    {#each floors as level}
      <option value={level}>{level}</option>
    {/each}
  </select>
</label>
