<script lang="ts">
  import { app, currentEntry, type RosterEntry, type Tab } from '../app-state.svelte';
  import { GAMES, UNFORGIVEN } from '../editor/games';
  import { goToTab } from '../history';
  import { chooseCharacter, forgetCharacter, renameCharacter, restoreCharacterImport } from './current';
  import { EXP_NEEDED_HEADING, expNeededRows } from './exp-needed';
  import { characterStatus, collapsedLine, expLabel, levelLabel, withSeparators } from './record';
  import { readStored, writeStored } from './storage';

  /** Whether the panel was left folded away, remembered between visits. */
  const COLLAPSED_KEY = 'moraff-tools.character-panel-collapsed';

  let collapsed = $state(readStored(COLLAPSED_KEY) === 'yes');
  let choosing = $state(false);
  let showingExpNeeded = $state(false);
  /** The character whose name is being typed over, if any. */
  let renaming = $state<string | null>(null);
  let typedName = $state('');

  const character = $derived(currentEntry());
  const status = $derived.by(() => {
    void app.characterVersion;
    return character ? characterStatus(character) : null;
  });
  const game = $derived(GAMES.find((entry) => entry.id === character?.game) ?? null);
  const expRows = $derived(status && showingExpNeeded ? expNeededRows(status.lev, status.hard) : []);
  /** The characters of the game the site is showing; the others are only counted. */
  const ours = $derived(app.roster.filter((entry) => entry.game === app.game));
  const elsewhere = $derived(app.roster.length - ours.length);
  const otherGameName = $derived(GAMES.find((entry) => entry.id !== app.game)?.displayName ?? '');
  const elsewhereLine = $derived(`${elsewhere} more character${elsewhere === 1 ? '' : 's'} under ${otherGameName}.`);

  function toggle() {
    collapsed = !collapsed;
    if (collapsed) {
      choosing = false;
      showingExpNeeded = false;
    }
    writeStored(COLLAPSED_KEY, collapsed ? 'yes' : 'no');
  }

  function show(tab: Tab) {
    goToTab(app, tab);
  }

  function showOnMap() {
    if (!status) return;
    app.requestedPlace = { ...status.place };
    goToTab(app, 'map');
  }

  const points = (value: number) => String(Math.trunc(value));
  /** The level in the list is read out of the record, which changes under it as the current
   *  character is edited. */
  const levelOf = (entry: RosterEntry) => {
    void app.characterVersion;
    return characterStatus(entry)?.lev ?? 0;
  };
  const editedOn = (when: string) => new Date(when).toLocaleDateString();

  function choose(id: string) {
    chooseCharacter(id);
    choosing = false;
  }

  function startRename(entry: RosterEntry) {
    renaming = entry.id;
    typedName = entry.name;
  }

  function commitRename() {
    if (renaming) renameCharacter(renaming, typedName);
    renaming = null;
  }

  function onRenameKey(event: KeyboardEvent) {
    if (event.key === 'Enter') commitRename();
    if (event.key === 'Escape') renaming = null;
  }

  function remove(entry: RosterEntry) {
    if (confirm(`Remove ${entry.name} from this browser?`)) forgetCharacter(entry.id);
  }

  function focusInput(node: HTMLInputElement) {
    node.focus();
    node.select();
  }
</script>

<section class="character-panel">
  {#if expRows.length > 0}
    <!-- The game's own EXP NEEDED screen, on the black it prints its screens on. -->
    <div class="exp-needed">
      <div class="line">{EXP_NEEDED_HEADING}</div>
      {#each expRows as row}
        <div class="line">{row.level}) {withSeparators(row.exp)}</div>
      {/each}
    </div>
  {/if}

  {#if choosing}
    {#if ours.length > 0}
      <table class="chooser">
        <thead>
          <tr><th>Character</th><th>Level</th><th>Number</th><th>From</th><th>Edited</th><th></th></tr>
        </thead>
        <tbody>
          {#each ours as entry (entry.id)}
            <tr class:current={entry.id === character?.id}>
              <td>
                {#if renaming === entry.id}
                  <input class="rename" bind:value={typedName} onkeydown={onRenameKey} onblur={commitRename} use:focusInput />
                {:else}
                  <button type="button" class="link" onclick={() => choose(entry.id)}>{entry.name}</button>
                {/if}
              </td>
              <td>{levelOf(entry)}</td>
              <td>{entry.slot ?? '—'}</td>
              <td>{entry.importedBytes ? 'imported' : 'rolled'}</td>
              <td>{editedOn(entry.editedAt)}</td>
              <td class="actions">
                <button type="button" class="link" onclick={() => startRename(entry)}>Rename</button>
                {#if entry.importedBytes}
                  <button type="button" class="link" onclick={() => restoreCharacterImport(entry.id)}>Restore the import</button>
                {/if}
                <button type="button" class="link" onclick={() => remove(entry)}>Remove</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    {#if elsewhere > 0}
      <p class="elsewhere">{elsewhereLine}</p>
    {/if}
  {/if}
  {#if !character || !status}
    {#if app.roster.length > 0}
      <div class="identity">
        <button type="button" class="link" onclick={() => (choosing = !choosing)}>Characters ({ours.length})</button>
      </div>
    {/if}
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
    <div class="identity">
      <strong>{character.name}</strong>
      <span>{status.cls}</span>
      {#if game}<span>{game.displayName}</span>{/if}
      {#if character.slot !== null}<span>Character {character.slot}</span>{/if}
      <button type="button" class="link" onclick={() => show('editor')}>Edit in Save Editor</button>
      <button type="button" class="link" onclick={() => show('roller')}>Roll another</button>
      <button type="button" class="link" onclick={showOnMap}>Show on map</button>
      {#if character.game === UNFORGIVEN.id}
        <button type="button" class="link" onclick={() => (showingExpNeeded = !showingExpNeeded)}>Exp needed</button>
      {/if}
      <button type="button" class="link" onclick={() => (choosing = !choosing)}>Characters ({ours.length})</button>
    </div>
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
  {/if}


  {#if character && status}
    <button type="button" class="chevron" aria-label={collapsed ? 'Show the whole character' : 'Fold the character away'} onclick={toggle}>
      {collapsed ? '▴' : '▾'}
    </button>
  {/if}
</section>

<style>
  .character-panel {
    position: relative;
    padding: 10px 44px 10px 24px;
    border-top: 1px solid var(--line);
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
    margin-bottom: 8px;
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
  .exp-needed {
    display: inline-block;
    margin-bottom: 10px;
    padding: 8px 16px 10px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: #000;
    color: var(--mw-green);
  }
  .exp-needed .line {
    color: var(--mw-green);
  }
  .chooser {
    margin-bottom: 10px;
    border-collapse: collapse;
    font-size: 12px;
    color: var(--muted);
  }
  .chooser th {
    text-align: left;
    font-weight: 600;
    padding: 3px 16px 3px 0;
    border-bottom: 1px solid var(--line);
  }
  .chooser td {
    padding: 4px 16px 4px 0;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  .chooser tr.current td {
    color: var(--ink);
  }
  .elsewhere {
    margin: 0 0 10px;
    color: var(--muted);
    font-size: 12px;
  }
  .chooser .actions {
    display: flex;
    gap: 12px;
  }
  .rename {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--accent-dim);
    border-radius: 4px;
    padding: 2px 6px;
    font: inherit;
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
