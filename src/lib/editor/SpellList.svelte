<script lang="ts">
  import { untrack } from 'svelte';
  import { blockWheel } from './block-wheel';
  import { hex, readNumber, writeNumber } from './fields';
  import type { SpellListField } from './schema';
  import { NAMED_SLOTS, SLOTS_PER_SUBCATEGORY, SPELL_NAMES, SPELL_SUBCATEGORIES } from './spell-names';

  let { view, field }: { view: DataView; field: SpellListField } = $props();

  const isBinary = $derived(field.binary === true);
  let showPadding = $state(false);

  // Each sub-category lays out its 30 named spells in a 3-column × 10-row grid matching the
  // in-game spell browser; the 15 padding slots stay hidden unless asked for.
  const subcategories = untrack(() => SPELL_SUBCATEGORIES.map((subcategory, subIndex) => {
    const base = field.offset + subIndex * SLOTS_PER_SUBCATEGORY;
    const cell = (slot: number) => ({
      offset: base + slot,
      name: slot < NAMED_SLOTS ? SPELL_NAMES[subcategory.key][slot] : `Slot ${slot + 1} (unused)`,
      named: slot < NAMED_SLOTS,
      initial: readNumber(view, 'uint8', base + slot),
    });
    return {
      title: subcategory.title,
      named: Array.from({ length: NAMED_SLOTS }, (_, slot) => cell(slot)),
      padding: Array.from({ length: SLOTS_PER_SUBCATEGORY - NAMED_SLOTS }, (_, i) => cell(NAMED_SLOTS + i)),
    };
  }));

  function setKnown(offset: number, event: Event) {
    writeNumber(view, 'uint8', offset, (event.currentTarget as HTMLInputElement).checked ? 1 : 0);
  }

  function setCount(offset: number, event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    if (!Number.isNaN(value)) writeNumber(view, 'uint8', offset, value);
  }
</script>

{#snippet cells(list: (typeof subcategories)[number]['named'])}
  {#each list as cell}
    {#if isBinary}
      <label class="known" class:padding={!cell.named}>
        <input type="checkbox" checked={cell.initial !== 0} title={hex(cell.offset)} onchange={(event) => setKnown(cell.offset, event)} />
        <span>{cell.name}</span>
      </label>
    {:else}
      <div class="count" class:padding={!cell.named}>
        <span>{cell.name}</span>
        <input type="number" min="0" max="255" value={cell.initial} title={hex(cell.offset)} oninput={(event) => setCount(cell.offset, event)} use:blockWheel />
      </div>
    {/if}
  {/each}
{/snippet}

<div>
  <label class="toggle">
    <input type="checkbox" bind:checked={showPadding} />
    Show unused padding slots (advanced)
  </label>
  {#each subcategories as subcategory}
    <div class="heading">{subcategory.title}</div>
    <div class="grid">{@render cells(subcategory.named)}</div>
    {#if showPadding}
      <div class="grid padding-grid">{@render cells(subcategory.padding)}</div>
    {/if}
  {/each}
  <small class="hint caption">
    {isBinary
      ? 'Spellbook entries are boolean — a checked box means the player knows the spell and can cast it for SP.'
      : 'Each value is a count of that consumable. u8 · 0 to 255.'}
  </small>
</div>

<style>
  .toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--muted);
  }
  .heading {
    font-size: 12px;
    color: var(--mw-green);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin: 14px 0 8px;
    border-bottom: 1px solid var(--line);
    padding-bottom: 4px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px 18px;
  }
  .padding-grid {
    margin-top: 6px;
  }
  .known {
    display: grid;
    grid-template-columns: 20px 1fr;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
  }
  .known input {
    accent-color: var(--accent);
  }
  .count {
    display: grid;
    grid-template-columns: 1fr 56px;
    gap: 8px;
    align-items: center;
    font-size: 13px;
  }
  .count input {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 4px 7px;
    font: inherit;
    font-size: 12px;
    width: 100%;
  }
  .padding span {
    color: var(--muted);
  }
  .caption {
    display: block;
    margin-top: 12px;
  }
</style>
