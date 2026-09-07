<script lang="ts">
  import { app, type Tab } from '../app-state.svelte';
  import { GAMES } from '../editor/games';
  import { characterStatus, collapsedLine, expLabel, levelLabel, withSeparators } from './record';
  import { readStored, writeStored } from './storage';

  /** Whether the panel was left folded away, remembered between visits. */
  const COLLAPSED_KEY = 'moraff-tools.character-panel-collapsed';

  let collapsed = $state(readStored(COLLAPSED_KEY) === 'yes');

  const character = $derived(app.character);
  const status = $derived.by(() => {
    void app.characterVersion;
    return character ? characterStatus(character) : null;
  });
  const game = $derived(GAMES.find((entry) => entry.id === character?.game) ?? null);

  function toggle() {
    collapsed = !collapsed;
    writeStored(COLLAPSED_KEY, collapsed ? 'yes' : 'no');
  }

  function show(tab: Tab) {
    app.tab = tab;
  }

  function showOnMap() {
    if (!status?.place) return;
    app.requestedPlace = { ...status.place };
    app.tab = 'map';
  }

  const points = (value: number) => String(Math.trunc(value));
</script>

<section class="character-panel">
  {#if !character || !status}
    <div class="status empty">
      <span class="line">
        NO CHARACTER.
        <button type="button" class="dos-link" onclick={() => show('editor')}>LOAD A SAVE</button>
        OR
        <button type="button" class="dos-link" onclick={() => show('roller')}>ROLL ONE</button>.
      </span>
    </div>
  {:else if collapsed}
    <div class="status">
      <span class="line green">{collapsedLine(status, character.name)}</span>
    </div>
  {:else}
    <div class="boxes">
      <div class="status">
        <div class="left">
          <div class="line cyan">ARMOR:{status.armor} &nbsp; WEAPON:{status.weapon}</div>
          <div class="line yellow">{levelLabel(status.lev)}{status.lev} &nbsp; {expLabel(status.lev)}{withSeparators(status.exp)}</div>
          <div class="line green">SPELL POINTS:{points(status.sp)} OF {points(status.maxSp)}</div>
          <div class="line green">HEALTH POINTS:{status.hp} OF {status.maxHp}</div>
        </div>
        <div class="stats">
          {#each [0, 2, 4] as first}
            <div class="line red">
              {#each status.stats.slice(first, first + 2) as stat}
                <span class="stat">{stat.label}:{stat.value}</span>
              {/each}
            </div>
          {/each}
        </div>
      </div>
      {#if status.battleSpells.length > 0}
        <div class="spells">
          <div class="line heading">CURRENT BATTLE SPELLS IN EFFECT</div>
          <div class="spell-lines">
            {#each status.battleSpells as spell}
              <div class="line">{spell}</div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
    <div class="identity">
      <strong>{character.name}</strong>
      <span>{status.cls}</span>
      {#if game}<span>{game.displayName}</span>{/if}
      {#if character.slot !== null}<span>Character {character.slot}</span>{/if}
      <button type="button" class="link" onclick={() => show('editor')}>Edit in Save Editor</button>
      <button type="button" class="link" onclick={() => show('roller')}>Roll another</button>
      {#if status.place}<button type="button" class="link" onclick={showOnMap}>Show on map</button>{/if}
    </div>
  {/if}

  {#if character && status}
    <button type="button" class="chevron" aria-label={collapsed ? 'Show the whole character' : 'Fold the character away'} onclick={toggle}>
      {collapsed ? '▸' : '▾'}
    </button>
  {/if}
</section>

<style>
  .character-panel {
    position: relative;
    padding: 10px 44px 10px 24px;
    border-bottom: 1px solid var(--line);
  }
  .boxes {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    flex-wrap: wrap;
  }
  /* The game's own status block: a green panel with the numbers in a DOS terminal face. */
  .status {
    display: inline-flex;
    gap: 26px;
    padding: 5px 12px 7px;
    border: 2px solid #17a017;
    border-radius: 4px;
    background: #0a6a0a;
  }
  .stats {
    /* The game starts the characteristics beside the level, a line below the top of the box. */
    margin-top: 1.15em;
  }
  .spells {
    padding: 5px 12px 7px;
    border: 2px solid #a01717;
    border-radius: 4px;
    background: #6a0a0a;
  }
  .spell-lines {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 20px;
  }
  .line {
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.15;
    white-space: nowrap;
    color: var(--ink);
  }
  .heading {
    color: var(--accent);
  }
  .cyan {
    color: var(--mw-cyan);
  }
  .yellow {
    color: var(--accent);
  }
  .green {
    color: var(--mw-green);
  }
  .red {
    color: var(--mw-red);
  }
  .stat {
    display: inline-block;
    min-width: 5.5em;
  }
  .dos-link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--mw-cyan);
    text-decoration: underline;
    cursor: pointer;
  }
  .empty .line {
    color: var(--mw-green);
  }
  .identity {
    display: flex;
    margin-top: 8px;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--muted);
  }
  .identity strong {
    color: var(--ink);
    font-size: 14px;
  }
  .link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--accent-dim);
    cursor: pointer;
  }
  .link:hover {
    color: var(--accent);
  }
  .chevron {
    position: absolute;
    top: 8px;
    right: 12px;
    padding: 2px 8px;
    border: none;
    background: none;
    color: var(--muted);
    font-size: 14px;
    cursor: pointer;
  }
  .chevron:hover {
    color: var(--ink);
  }
</style>
