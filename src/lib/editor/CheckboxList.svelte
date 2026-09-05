<script lang="ts">
  import { untrack } from 'svelte';
  import { readFlag, writeFlag } from './fields';
  import type { CheckboxListField } from './schema';

  let { view, field }: { view: DataView; field: CheckboxListField } = $props();

  let checked = $state(untrack(() => field.names.map((_, i) => readFlag(view, field.offset + i))));

  function set(index: number, on: boolean) {
    checked[index] = on;
    writeFlag(view, field.offset + index, on);
  }

  function setAll(on: boolean) {
    field.names.forEach((_, index) => set(index, on));
  }
</script>

<div>
  <div class="actions">
    <button type="button" class="ghost" onclick={() => setAll(true)}>Enable all</button>
    <button type="button" class="ghost" onclick={() => setAll(false)}>Clear all</button>
  </div>
  <div class="grid">
    {#each field.names as name, index}
      <label>
        <input type="checkbox" checked={checked[index]} onchange={(event) => set(index, event.currentTarget.checked)} />
        <span>{name}</span>
      </label>
    {/each}
  </div>
</div>

<style>
  .actions {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .actions button {
    padding: 5px 12px;
    font-size: 12px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 4px 14px;
  }
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
  }
  input {
    accent-color: var(--accent);
  }
</style>
