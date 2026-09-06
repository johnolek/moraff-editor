<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { monsterCounts, type StockedMonster } from './stocking';

  interface Props {
    /** Monsters stocked on the floor, empty when it has not been stocked. */
    monsters: StockedMonster[];
    town: boolean;
    /** Whether the game itself could stock this floor; the override reaches ones it could not. */
    canStock: boolean;
    /** Monster whose squares stay marked until it is clicked again or cleared. */
    pinned: string | null;
    onstock: () => void;
    onclear: () => void;
    onhover: (monsterId: string | null) => void;
    onpin: (monsterId: string | null) => void;
  }

  let { monsters, town, canStock, pinned, onstock, onclear, onhover, onpin }: Props = $props();

  const counts = $derived(monsterCounts(monsters));
</script>

<section>
  <SectionHeading title="Monsters">
    {#if pinned}
      <button class="clear" onclick={() => onpin(null)}>Clear</button>
    {/if}
  </SectionHeading>
  {#if town}
    <p class="hint">The town has no monsters.</p>
  {:else}
    <div class="buttons">
      <button class="ghost" onclick={onstock} disabled={!canStock} title={canStock ? undefined : 'The game cannot stock this floor.'}>
        {monsters.length ? 'Reroll' : 'Stock this floor'}
      </button>
      {#if monsters.length}
        <button class="ghost" onclick={onclear}>Clear</button>
      {/if}
    </div>
    {#if monsters.length}
      <p>{monsters.length} monsters</p>
      <ul>
        {#each counts as { monsterId, name, count }}
          <li>
            <button
              type="button"
              class="type"
              class:pinned={pinned === monsterId}
              onpointerenter={() => onhover(monsterId)}
              onpointerleave={() => onhover(null)}
              onclick={() => onpin(pinned === monsterId ? null : monsterId)}
            >
              <span>{name}</span>
              <span class="count">{count}</span>
            </button>
          </li>
        {/each}
      </ul>
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
  button.ghost:hover:not(:disabled) {
    color: var(--ink);
    border-color: var(--accent);
  }
  button.ghost:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .clear {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: 11px;
    color: var(--muted);
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
  }
  .clear:hover {
    color: var(--ink);
  }
  p {
    margin: 8px 0 0;
    font-size: 13px;
  }
  .hint {
    color: var(--muted);
  }
  ul {
    list-style: none;
    margin: 6px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .type {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    width: calc(100% + 8px);
    margin: 0 -4px;
    padding: 2px 4px;
    border: none;
    border-radius: 4px;
    background: none;
    color: var(--ink);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }
  .type:hover {
    background: var(--panel-2);
  }
  .type.pinned {
    background: var(--panel-2);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
  .count {
    color: var(--muted);
  }
</style>
