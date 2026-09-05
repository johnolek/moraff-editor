<script lang="ts">
  import ScalarField from './ScalarField.svelte';
  import type { CounterListField, ScalarField as ScalarFieldDef } from './schema';

  let { view, field }: { view: DataView; field: CounterListField } = $props();

  const fields = $derived<ScalarFieldDef[]>(field.names.map((name, i) => ({ kind: field.itemKind, offset: field.offset + i * field.stride, label: name })));
</script>

<div class="grid">
  {#each fields as scalar}
    <ScalarField {view} field={scalar} />
  {/each}
</div>
