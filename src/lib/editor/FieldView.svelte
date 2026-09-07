<script lang="ts">
  import CheckboxList from './CheckboxList.svelte';
  import CounterList from './CounterList.svelte';
  import EnumField from './EnumField.svelte';
  import OwnedList from './OwnedList.svelte';
  import ScalarField from './ScalarField.svelte';
  import type { Field, TextRecord } from './schema';
  import SelectField from './SelectField.svelte';
  import SpellList from './SpellList.svelte';
  import TextEnumFieldView from './TextEnumField.svelte';
  import TextNumberFieldView from './TextNumberField.svelte';

  let { view, record, field }: { view: DataView; record: TextRecord | null; field: Field } = $props();
</script>

{#if field.kind === 'text_number'}
  {#if record}<TextNumberFieldView {record} {field} />{/if}
{:else if field.kind === 'text_enum'}
  {#if record}<TextEnumFieldView {record} {field} />{/if}
{:else if field.kind === 'enum_uint8'}
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
