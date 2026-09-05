<script lang="ts">
  import CheckboxList from './CheckboxList.svelte';
  import CounterList from './CounterList.svelte';
  import EnumField from './EnumField.svelte';
  import OwnedList from './OwnedList.svelte';
  import ScalarField from './ScalarField.svelte';
  import type { Field } from './schema';
  import SelectField from './SelectField.svelte';
  import SpellList from './SpellList.svelte';

  let { view, field }: { view: DataView; field: Field } = $props();
</script>

{#if field.kind === 'enum_uint8'}
  <EnumField {view} {field} />
{:else if field.kind === 'select_uint8'}
  <SelectField {view} {field} />
{:else if field.kind === 'owned_list'}
  <OwnedList {view} {field} />
{:else if field.kind === 'checkbox_list'}
  <CheckboxList {view} {field} />
{:else if field.kind === 'counter_list'}
  <CounterList {view} {field} />
{:else if field.kind === 'spell_list'}
  <SpellList {view} {field} />
{:else}
  <ScalarField {view} {field} />
{/if}
