<script lang="ts">
  import { untrack } from 'svelte';
  import { blockWheel } from './block-wheel';
  import { describeTextField, readTextNumber, writeTextNumber } from './fields';
  import type { TextNumberField, TextRecord } from './schema';

  let { record, field }: { record: TextRecord; field: TextNumberField } = $props();

  const id = $props.id();
  const caption = $derived(field.hint ? `${describeTextField(field)} · ${field.hint}` : describeTextField(field));
  // Read once: the input is uncontrolled from here on, and the whole editor remounts when the
  // record is replaced.
  const initial = untrack(() => readTextNumber(record, field));

  function oninput(event: Event) {
    const raw = (event.currentTarget as HTMLInputElement).value;
    const value = Number(raw);
    if (raw === '' || Number.isNaN(value)) return;
    writeTextNumber(record, field, value);
  }
</script>

<div class="field">
  <label for={id}><span>{field.label}</span><span class="offset">value {field.value}</span></label>
  <input {id} type="number" min={field.min} max={field.max} step="any" value={initial} {oninput} use:blockWheel />
  <small class="hint">{caption}</small>
</div>
