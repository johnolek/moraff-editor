<script lang="ts">
  import FieldView from './FieldView.svelte';
  import { WIDE_KINDS, type Field, type Section, type TextRecord } from './schema';

  let { view, record = null, section }: { view: DataView; record?: TextRecord | null; section: Section } = $props();

  // Wide fields stand on their own; runs of narrow fields share a grid.
  const groups = $derived.by(() => {
    const result: { wide: boolean; fields: Field[] }[] = [];
    for (const field of section.fields) {
      const wide = WIDE_KINDS.has(field.kind);
      const last = result[result.length - 1];
      if (!wide && last && !last.wide) last.fields.push(field);
      else result.push({ wide, fields: [field] });
    }
    return result;
  });
</script>

<section class="section">
  <h2>{section.title}</h2>
  {#if section.note}
    <p class="section-note">{section.note}</p>
  {/if}
  {#each groups as group}
    {#if group.wide}
      <FieldView {view} {record} field={group.fields[0]} />
    {:else}
      <div class="grid">
        {#each group.fields as field}
          <FieldView {view} {record} {field} />
        {/each}
      </div>
    {/if}
  {/each}
</section>
