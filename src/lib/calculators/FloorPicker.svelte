<script lang="ts">
  import { BOTTOM_LEVEL } from '../game/unfmap.js';
  import { MODULE_NUMERALS } from '../map/labels';
  import FieldLabel from './FieldLabel.svelte';

  interface Props {
    module: number;
    floor: number;
    /** Whether the module and the floor are still the ones the current character is on. */
    changedModule?: boolean;
    changedFloor?: boolean;
  }

  let { module = $bindable(), floor = $bindable(), changedModule = false, changedFloor = false }: Props = $props();

  const floors = $derived(Array.from({ length: BOTTOM_LEVEL[module] }, (_, index) => index + 1));

  function changeModule(event: Event) {
    module = Number((event.currentTarget as HTMLSelectElement).value);
    floor = Math.min(floor, BOTTOM_LEVEL[module]);
  }
</script>

<label>
  <FieldLabel text="Module" changed={changedModule} />
  <select value={module} onchange={changeModule}>
    {#each MODULE_NUMERALS as numeral, index}
      <option value={index}>{numeral}</option>
    {/each}
  </select>
</label>
<label>
  <FieldLabel text="Floor" changed={changedFloor} />
  <select bind:value={floor}>
    {#each floors as level}
      <option value={level}>{level}</option>
    {/each}
  </select>
</label>
