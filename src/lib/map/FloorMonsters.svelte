<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';

  interface Props {
    /** Monsters stocked on the floor, 0 when it has not been stocked. */
    count: number;
    town: boolean;
    onstock: () => void;
    onclear: () => void;
  }

  let { count, town, onstock, onclear }: Props = $props();
</script>

<section>
  <SectionHeading title="Monsters" />
  {#if town}
    <p class="hint">The town has no monsters.</p>
  {:else}
    <div class="buttons">
      <button class="ghost" onclick={onstock}>{count ? 'Reroll' : 'Stock this floor'}</button>
      {#if count}
        <button class="ghost" onclick={onclear}>Clear</button>
      {/if}
    </div>
    {#if count}
      <p>{count} monsters</p>
    {/if}
  {/if}
</section>

<style>
  .buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  button.ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }
  button.ghost:hover {
    color: var(--ink);
    border-color: var(--accent);
  }
  p {
    margin: 8px 0 0;
    font-size: 13px;
  }
  .hint {
    color: var(--muted);
  }
</style>
