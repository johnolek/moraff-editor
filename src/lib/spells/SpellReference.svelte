<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { spellMechanics } from './mechanics';
  import { searchSpells, spellGroups } from './spells';

  let search = $state('');

  const lists = $derived(spellGroups(searchSpells(search)));
</script>

<div class="reference">
  <header>
    <input type="search" placeholder="Search spells" bind:value={search} />
  </header>
  <div class="scroll">
    {#each lists as list}
      <section>
        <SectionHeading title={list.label} />
        {#each list.levels as level}
          <h3>{level.label}</h3>
          <ul>
            {#each level.spells as spell}
              <li>
                <p class="name">{spell.name} <span class="cost">SP cost: {spell.spCost}</span></p>
                <dl>
                  <dt>In the game</dt>
                  <dd class="quote">{spell.description}</dd>
                  <dt>What it really does</dt>
                  <dd>{spellMechanics(spell)}</dd>
                </dl>
              </li>
            {/each}
          </ul>
        {/each}
      </section>
    {/each}
    {#if lists.length === 0}
      <p class="empty">No spells match.</p>
    {/if}
  </div>
</div>

<style>
  .reference {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
  }
  header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--line);
    background: var(--panel);
  }
  input {
    width: 300px;
    max-width: 100%;
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
    font-size: 13px;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px 40px;
  }
  section {
    margin-bottom: 28px;
  }
  h3 {
    position: sticky;
    top: 0;
    margin: 16px 0 6px;
    padding: 4px 0;
    background: var(--bg);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  li {
    max-width: 88ch;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel);
  }
  .name {
    margin: 0 0 8px;
    font-size: 14px;
    color: var(--ink);
  }
  .cost {
    margin-left: 8px;
    font-size: 12px;
    color: var(--muted);
  }
  dl {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 4px 12px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  .quote {
    color: var(--mw-cyan);
  }
  .empty {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
