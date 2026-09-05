<script lang="ts">
  import { untrack } from 'svelte';
  import { blockWheel } from './block-wheel';
  import { describeFieldType, hex, INT_RANGES, readScalar, writeScalar } from './fields';
  import type { ScalarField } from './schema';

  let { view, field }: { view: DataView; field: ScalarField } = $props();

  const id = $props.id();
  const isString = $derived(field.kind === 'string');
  const isFloat = $derived(field.kind === 'float32' || field.kind === 'float64');
  const range = $derived(INT_RANGES[field.kind]);
  const caption = $derived(field.hint ? `${describeFieldType(field)} · ${field.hint}` : describeFieldType(field));
  // Read once: the input is uncontrolled from here on, and the whole editor remounts
  // when the bytes are replaced.
  const initial = untrack(() => readScalar(view, field));

  function oninput(event: Event) {
    const raw = (event.currentTarget as HTMLInputElement).value;
    if (isString) {
      writeScalar(view, field, raw);
      return;
    }
    const value = Number(raw);
    if (raw === '' || Number.isNaN(value)) return;
    writeScalar(view, field, value);
  }
</script>

<div class="field">
  <label for={id}><span>{field.label}</span><span class="offset">{hex(field.offset)}</span></label>
  {#if isString}
    <input {id} type="text" maxlength={field.length} value={initial} {oninput} />
  {:else}
    <input {id} type="number" min={range?.[0]} max={range?.[1]} step={isFloat ? 'any' : undefined} value={initial} {oninput} use:blockWheel />
  {/if}
  <small class="hint">{caption}</small>
</div>
