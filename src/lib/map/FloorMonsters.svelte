<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { beyondMapCount, type StockedMonster } from './stocking';
  import type { MapGame } from './game';

  interface Props {
    game: MapGame;
    dungeon: number;
    floor: number;
    /** Monsters stocked on the floor, empty when it has not been stocked. */
    monsters: StockedMonster[];
    /** Monster whose squares stay marked until it is clicked again or cleared. */
    pinned: string | null;
    onstock: () => void;
    onclear: () => void;
    onhover: (monsterId: string | null) => void;
    onpin: (monsterId: string | null) => void;
  }

  let { game, dungeon, floor, monsters, pinned, onstock, onclear, onhover, onpin }: Props = $props();

  const canStock = $derived(game.stocking.stocks(dungeon, floor));
  const groups = $derived(game.stocking.groups(monsters));
  const beyondMap = $derived(beyondMapCount(monsters, game.area));
</script>

<section>
  <SectionHeading title="Monsters">
    {#if pinned}
      <button class="clear" onclick={() => onpin(null)}>Clear</button>
    {/if}
  </SectionHeading>
  {#if floor === 0}
    <p class="hint">The town has no monsters.</p>
  {:else}
    <div class="buttons">
      <button class="ghost" onclick={onstock} disabled={!canStock} title={canStock ? undefined : 'The game cannot stock this floor.'}>
        {monsters.length ? 'Roll again' : 'Stock this floor'}
      </button>
      {#if monsters.length}
        <button class="ghost" onclick={onclear}>Clear</button>
      {/if}
    </div>
    {#if game.stocking.note}
      <p class="hint note">{game.stocking.note}</p>
    {/if}
    {#if monsters.length}
      <p>{monsters.length} monsters</p>
      {#if beyondMap}
        <p class="hint">{game.stocking.beyondMap(beyondMap)}</p>
      {/if}
      {#each groups as group}
        {#if group.label}
          <h3>{group.label}</h3>
        {/if}
        <ul>
          {#each group.counts as { monsterId, name, count, detail }}
            <li>
              <button
                type="button"
                class="type"
                class:pinned={pinned === monsterId}
                onpointerenter={() => onhover(monsterId)}
                onpointerleave={() => onhover(null)}
                onclick={() => onpin(pinned === monsterId ? null : monsterId)}
              >
                <span class="line">
                  <span>{name}</span>
                  <span class="count">{count}</span>
                </span>
                {#if detail}
                  <span class="detail">{detail}</span>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      {/each}
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
  .note {
    font-size: 11px;
    line-height: 1.4;
  }
  h3 {
    margin: 12px 0 4px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }
  ul {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .type {
    display: flex;
    flex-direction: column;
    gap: 1px;
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
  .line {
    display: flex;
    justify-content: space-between;
    gap: 8px;
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
  .detail {
    color: var(--muted);
    font-size: 11px;
  }
</style>
