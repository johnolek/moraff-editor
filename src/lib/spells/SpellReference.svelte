<script lang="ts">
  import PixelText from '../ui/PixelText.svelte';
  import { LIST_NOTES, spellCorrection } from './mechanics';
  import { allSpells, spellGroups } from './spells';

  /** The game's own wording, from the type menu of its spell screen. */
  const TYPE_HEADING = 'SELECT THE TYPE OF SPELL:';

  const lists = spellGroups(allSpells());

  let listIndex = $state(0);

  const list = $derived(lists[listIndex]);

  function typeLabel(label: string, index: number): string {
    return `${index + 1}) ${label.toUpperCase()} SPELLS`;
  }
</script>

<div class="reference">
  <div class="scroll">
    <div class="types">
      <p class="type-heading"><PixelText font="small" scale={3} text={TYPE_HEADING} /></p>
      <div class="type-items">
        {#each lists as entry, index}
          <button
            type="button"
            class="type-item"
            class:current={index === listIndex}
            aria-pressed={index === listIndex}
            onclick={() => (listIndex = index)}
          >
            <PixelText font="small" scale={3} text={typeLabel(entry.label, index)} colour={index === listIndex ? '#000' : undefined} />
          </button>
        {/each}
      </div>
    </div>

    {#if LIST_NOTES[list.label]}
      <p class="list-note">{LIST_NOTES[list.label]}</p>
    {/if}

    {#each list.levels as level}
      <h3>{level.label}</h3>
      <ul>
        {#each level.spells as spell}
          {@const correction = spellCorrection(spell)}
          <li>
            <p class="name">{spell.name} <span class="cost">SP cost: {spell.spCost}</span></p>
            <dl>
              <dt>In the game</dt>
              <dd class="quote">{spell.description}</dd>
              {#if correction}
                <dt>What it really does</dt>
                <dd>{correction}</dd>
              {/if}
            </dl>
          </li>
        {/each}
      </ul>
    {/each}
  </div>
</div>

<style>
  .reference {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px 40px;
  }
  /* The game draws its type menu on a grey panel; #404040 is the grey it uses. */
  .types {
    padding: 14px 16px 16px;
    border-radius: 6px;
    background: #404040;
  }
  .type-heading {
    margin: 0 0 12px;
    line-height: 0;
    color: var(--mw-green);
  }
  .type-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
  }
  .type-item {
    padding: 4px 6px;
    border: none;
    border-radius: 3px;
    background: none;
    line-height: 0;
    color: var(--mw-red);
    cursor: pointer;
  }
  /* A DOS menu marks the item you are on by swapping its colours over. */
  .type-item.current {
    background: var(--mw-red);
  }
  .type-item:focus-visible {
    outline: 2px solid var(--accent);
  }
  .list-note {
    margin: 18px 0;
    max-width: 88ch;
    font-size: 13px;
    color: var(--muted);
  }
  h3 {
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
</style>
