<script lang="ts">
  import { untrack } from 'svelte';
  import { readTextNumber, writeTextNumber } from './fields';
  import type { TextEnumField, TextRecord } from './schema';

  let { record, field }: { record: TextRecord; field: TextEnumField } = $props();

  const id = $props.id();
  const initial = untrack(() => readTextNumber(record, field));

  function onchange(event: Event) {
    writeTextNumber(record, field, Number((event.currentTarget as HTMLSelectElement).value));
  }
</script>

<div class="field">
  <label for={id}><span>{field.label}</span><span class="offset">value {field.value}</span></label>
  <select {id} value={String(initial)} {onchange}>
    {#each field.choices as choice}
      <option value={String(choice.value)}>{choice.label}</option>
    {/each}
    {#if !field.choices.some((choice) => choice.value === initial)}
      <option value={String(initial)}>{initial}</option>
    {/if}
  </select>
  {#if field.hint}<small class="hint">{field.hint}</small>{/if}
</div>
