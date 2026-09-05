<script lang="ts">
  import type { MonsterEntry, MonsterGroup } from './monsters';

  interface Props {
    groups: MonsterGroup[];
    selectedId: string;
    onselect: (entry: MonsterEntry) => void;
  }

  let { groups, selectedId, onselect }: Props = $props();
</script>

<nav>
  {#each groups as group}
    <h3>{group.label}</h3>
    <ul>
      {#each group.monsters as monster}
        <li>
          <button
            type="button"
            class:selected={monster.id === selectedId}
            onclick={() => onselect(monster)}
          >
            {monster.name}
          </button>
        </li>
      {/each}
    </ul>
  {/each}
  {#if groups.length === 0}
    <p class="empty">No monsters match.</p>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  h3 {
    position: sticky;
    top: 0;
    margin: 12px 0 2px;
    padding: 4px 0;
    background: var(--panel);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }
  h3:first-child {
    margin-top: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    width: 100%;
    padding: 4px 8px;
    border: none;
    border-radius: 5px;
    background: none;
    font: inherit;
    font-size: 13px;
    text-align: left;
    color: var(--muted);
    cursor: pointer;
  }
  button:hover {
    color: var(--ink);
  }
  button.selected {
    background: var(--panel-2);
    color: var(--accent);
  }
  .empty {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
