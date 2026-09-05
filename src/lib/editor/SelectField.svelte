<script lang="ts">
  import { untrack } from 'svelte';
  import { hex, readNumber, writeNumber } from './fields';
  import type { SelectField } from './schema';

  let { view, field }: { view: DataView; field: SelectField } = $props();

  const id = $props.id();
  const initial = untrack(() => readNumber(view, 'uint8', field.offset));
  // A value the file holds that is not in the list gets its own option so nothing is
  // silently rewritten.
  const custom = $derived(field.choices.some((choice) => choice.value === initial) ? null : initial);
  const caption = $derived(field.hint ? `u8 · 0 to 255 · ${field.hint}` : 'u8 · 0 to 255');

  function onchange(event: Event) {
    writeNumber(view, 'uint8', field.offset, Number((event.currentTarget as HTMLSelectElement).value));
  }
</script>

<div class="field">
  <label for={id}><span>{field.label}</span><span class="offset">{hex(field.offset)}</span></label>
  <select {id} value={initial} {onchange}>
    {#each field.choices as choice}
      <option value={choice.value}>{choice.label} ({choice.value})</option>
    {/each}
    {#if custom !== null}
      <option value={custom}>Custom ({custom})</option>
    {/if}
  </select>
  <small class="hint">{caption}</small>
</div>
