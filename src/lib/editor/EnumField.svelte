<script lang="ts">
  import { untrack } from 'svelte';
  import { hex, readNumber, writeNumber } from './fields';
  import type { EnumField } from './schema';

  let { view, field }: { view: DataView; field: EnumField } = $props();

  const id = $props.id();
  const initial = untrack(() => readNumber(view, 'uint8', field.offset));
  const caption = $derived(field.hint ? `u8 · choose by index · ${field.hint}` : 'u8 · choose by index');

  function onchange(event: Event) {
    writeNumber(view, 'uint8', field.offset, Number((event.currentTarget as HTMLSelectElement).value));
  }
</script>

<div class="field">
  <label for={id}><span>{field.label}</span><span class="offset">{hex(field.offset)}</span></label>
  <select {id} value={initial} {onchange}>
    {#each field.choices as name, index}
      <option value={index}>{index} — {name}</option>
    {/each}
  </select>
  <small class="hint">{caption}</small>
</div>
