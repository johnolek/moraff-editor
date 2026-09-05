<script lang="ts">
  import { untrack } from 'svelte';
  import { blockWheel } from './block-wheel';
  import { describeFieldType, hex, readFlag, readNumber, writeFlag, writeNumber } from './fields';
  import type { OwnedListField } from './schema';

  let { view, field }: { view: DataView; field: OwnedListField } = $props();

  const items = untrack(() =>
    Array.from({ length: field.count }, (_, i) => ({
      name: field.names[i],
      ownedOffset: field.ownedOffset + i,
      levelOffset: field.levelOffset + i,
      level: readNumber(view, 'int8', field.levelOffset + i),
    })),
  );
  let owned = $state(untrack(() => items.map((item) => readFlag(view, item.ownedOffset))));

  function toggle(index: number) {
    owned[index] = !owned[index];
    writeFlag(view, items[index].ownedOffset, owned[index]);
  }

  function changeLevel(index: number, event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    if (!Number.isNaN(value)) writeNumber(view, 'int8', items[index].levelOffset, value);
  }
</script>

<div class="owned-list">
  <div class="row header"><span>Owned</span><span>Item</span><span>Enchant Level</span></div>
  {#each items as item, index}
    <div class="row">
      <input type="checkbox" checked={owned[index]} onchange={() => toggle(index)} />
      <button type="button" class="name" onclick={() => toggle(index)}>{item.name}</button>
      <input type="number" class="level" min="-128" max="127" title="Enchant level ({hex(item.levelOffset)})" value={item.level} oninput={(event) => changeLevel(index, event)} use:blockWheel />
    </div>
  {/each}
  <small class="hint">Enchant level: {describeFieldType({ kind: 'int8' })}</small>
</div>

<style>
  .owned-list {
    display: grid;
    gap: 6px;
  }
  .row {
    display: grid;
    grid-template-columns: 24px 1fr 110px;
    align-items: center;
    gap: 10px;
    padding: 3px 0;
  }
  .header {
    font-size: 11px;
    color: var(--muted);
    padding: 0;
  }
  .row input[type='checkbox'] {
    accent-color: var(--accent);
  }
  .name {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: 13px;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
  }
  .level {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 5px 7px;
    font: inherit;
    font-size: 12px;
    width: 100%;
  }
</style>
