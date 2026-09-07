<script lang="ts">
  import { app } from '../app-state.svelte';
  import { MW_CLASS_NAMES, MW_RACES, MINUTES_PER_YEAR } from '../game/mw-port/character';
  import type { MwCharacter } from '../game/mw-port/state';
  import { CLASS_NAMES, RACES } from '../game/port/character';
  import type { PlayerCharacter } from '../game/port/state';
  import PixelText from '../ui/PixelText.svelte';
  import { MW_SLOTS, mwSlotFileName, newMwCharacterFile } from './mw-save-file';
  import { MwRollerSession } from './mw-session';
  import { newCharacterFile, slotFileName, SLOTS } from './save-file';
  import { RollerSession } from './session';

  const STATS = ['STRENGTH', 'INTELLIGENCE', 'WISDOM', 'CONSTITUTION', 'AGILITY', 'LUCK'];

  /** Everything about the tab that is one game's rather than the other's. */
  const GAMES = {
    unforgiven: {
      name: 'Dungeons of the Unforgiven',
      slots: SLOTS,
      races: RACES.map((race) => race.name),
      classes: CLASS_NAMES,
      numbers: 'The game keeps ten characters, in files named 20 to 29. Pick the one you want to write over — the game picks it before it rolls, and so does this.',
      folder: 'Back up the file you are replacing first. Drop the download into your game folder next to UNF.EXE, keeping the name, and the character is waiting on the select screen.',
    },
    moraffsWorld: {
      name: "Moraff's World",
      slots: MW_SLOTS,
      races: MW_RACES.map((race) => race.name),
      classes: MW_CLASS_NAMES,
      numbers: 'The game keeps ten characters, in files named 0 to 9. Pick the one you want to write over — the game picks it before it rolls, and so does this.',
      folder: 'Back up the file you are replacing first. Drop the download into your game folder next to WORLD.EXE, keeping the name, and the character is waiting on the select screen.',
    },
  };

  type GameId = keyof typeof GAMES;

  let game = $state<GameId>('unforgiven');
  let slot = $state(20);
  let session = $state.raw<RollerSession | MwRollerSession | null>(null);
  let view = $state.raw<ReturnType<RollerSession['view']> | ReturnType<MwRollerSession['view']> | null>(null);
  let typed = $state('');
  let note = $state('');

  const chosen = $derived(GAMES[game]);
  const fileName = $derived(game === 'unforgiven' ? slotFileName(slot) : mwSlotFileName(slot));
  const sheet = $derived(view === null ? [] : sheetRows(view.pc, view.question === null));

  /** The character sheet beside the game's own screen: one label and one value a row. */
  function sheetRows(pc: PlayerCharacter | MwCharacter, finished: boolean): [string, string][] {
    const stats: [string, string][] = STATS.map((stat, index) => [
      stat,
      String([pc.str, pc.iq, pc.wis, pc.con, pc.dex, pc.luck][index]),
    ]);
    if ('ageMinutes' in pc) {
      return [
        ['RACE', MW_RACES[pc.race].name],
        ['SEX', pc.sex === 0 ? 'MALE' : 'FEMALE'],
        ...stats,
        ['HEIGHT', `${pc.height} INCHES`],
        ['WEIGHT', `${pc.weight} POUNDS`],
        ['AGE', `${Math.trunc(pc.ageMinutes / MINUTES_PER_YEAR)} YEARS`],
        ...(finished
          ? ([
              ['CLASS', MW_CLASS_NAMES[pc.cls]],
              ['HEALTH POINTS', String(pc.maxHp)],
              ['SPELL POINTS', String(pc.maxSp)],
              ['JEWELS', String(pc.money)],
            ] as [string, string][])
          : []),
      ];
    }
    return [
      ['RACE', RACES[pc.race].name],
      ['SEX', pc.sex === 0 ? 'MALE' : 'FEMALE'],
      ...stats,
      ['HEIGHT', `${pc.height * 4} INCHES`],
      ['WEIGHT', `${pc.weight} POUNDS`],
      ['AGE', `${pc.age} YEARS`],
      ...(finished
        ? ([
            ['CLASS', CLASS_NAMES[pc.cls]],
            ['HEALTH POINTS', String(pc.maxHp)],
            ['SPELL POINTS', String(pc.maxSp)],
            ['RUBLES', String(pc.money)],
            ['MAGIC CRYSTALS', String(pc.crystals)],
          ] as [string, string][])
        : []),
    ];
  }

  /** The bytes of the slot file, which is the whole record for either game. */
  function characterFile(pc: PlayerCharacter | MwCharacter): Uint8Array<ArrayBuffer> {
    return 'ageMinutes' in pc ? newMwCharacterFile(pc) : newCharacterFile(pc);
  }

  function pickGame(id: GameId) {
    game = id;
    slot = GAMES[id].slots[0];
  }

  function start() {
    const started = game === 'unforgiven' ? new RollerSession(slot) : new MwRollerSession(slot);
    session = started;
    view = started.view();
    typed = '';
    note = '';
  }

  function answer(value: number | string) {
    if (!session) return;
    session.answer(value);
    view = session.view();
    typed = '';
  }

  function enterName() {
    if (typed.trim() !== '') answer(typed);
  }

  function restart() {
    if (!session) return;
    session.restart();
    view = session.view();
    typed = '';
    note = '';
  }

  function leave() {
    session = null;
    view = null;
    note = '';
  }

  function openInEditor() {
    if (!view) return;
    app.requestedSave = { name: fileName, game, bytes: characterFile(view.pc) };
    app.tab = 'editor';
  }

  function download() {
    if (!view) return;
    const url = URL.createObjectURL(new Blob([characterFile(view.pc)], { type: 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    note = `Downloaded ${fileName}`;
  }
</script>

<div class="roller">
  <div class="page">
    {#if !session || !view}
      <h2><PixelText text="New Character" scale={2} /></h2>
      <p class="lead">
        Roll up a character the way the game does: the same questions, the same dice, the same starting kit. The finished
        character opens in the Save Editor and downloads as a character file you can drop into your game folder.
      </p>

      <section>
        <h3><PixelText text="Game" /></h3>
        <div class="row">
          <button type="button" class:picked={game === 'unforgiven'} onclick={() => pickGame('unforgiven')}>
            Dungeons of the Unforgiven
          </button>
          <button type="button" class:picked={game === 'moraffsWorld'} onclick={() => pickGame('moraffsWorld')}>
            Moraff's World
          </button>
        </div>
      </section>

      <section>
        <h3><PixelText text="Character Number" /></h3>
        <p class="hint">{chosen.numbers}</p>
        <div class="row">
          {#each chosen.slots as number}
            <button type="button" class:picked={slot === number} onclick={() => (slot = number)}>{number}</button>
          {/each}
        </div>
      </section>

      <div class="row">
        <button type="button" class="go" onclick={start}>Roll a character</button>
      </div>
    {:else}
      <div class="toolbar">
        <span class="badge">{chosen.name}</span>
        <span class="badge">Character {slot}</span>
        <button type="button" class="ghost" onclick={restart}>Start again</button>
        <button type="button" class="ghost" onclick={leave}>Pick another number</button>
      </div>

      <div class="screen">
        {#each view.screen as line}
          <div class="line">{line || ' '}</div>
        {/each}
      </div>

      {#if view.question === 'difficulty'}
        <div class="choices">
          <button type="button" onclick={() => answer(0)}>1) NORMAL DIFFICULTY</button>
          <button type="button" onclick={() => answer(1)}>2) I CAN HANDLE ANYTHING DIFFICULTY</button>
        </div>
      {:else if view.question === 'race'}
        <div class="choices grid">
          {#each chosen.races as race, index}
            <button type="button" onclick={() => answer(index)}>{index + 1}) {race}</button>
          {/each}
        </div>
      {:else if view.question === 'keepRerollDesign'}
        <div class="choices">
          <button type="button" onclick={() => answer(0)}>Y) KEEP THIS CHARACTER</button>
          <button type="button" onclick={() => answer(1)}>N) ROLL A NEW CHARACTER</button>
          <button type="button" onclick={() => answer(2)}>D) DESIGN YOUR OWN CHARACTER</button>
        </div>
      {:else if view.question === 'designStat'}
        <p class="hint">CHARACTERISTIC POINTS LEFT: {view.pointsLeft}</p>
        <div class="choices grid">
          {#each STATS as stat, index}
            <button type="button" onclick={() => answer(index)}>{stat}</button>
          {/each}
        </div>
        <div class="choices">
          <button type="button" class="ghost" onclick={() => answer(6)}>ESC-CANCEL THIS CHARACTER</button>
        </div>
      {:else if view.question === 'name'}
        <div class="choices">
          <input
            type="text"
            maxlength="18"
            bind:value={typed}
            onkeydown={(event) => event.key === 'Enter' && enterName()}
            placeholder="Up to 18 letters, digits and spaces"
          />
          <button type="button" disabled={typed.trim() === ''} onclick={enterName}>Enter</button>
        </div>
      {:else if view.question === 'class'}
        <div class="choices grid">
          {#each chosen.classes as name, index}
            <button type="button" onclick={() => answer(index)}>{index + 1}) {name}</button>
          {/each}
        </div>
      {/if}

      {#if view.question === null || view.question === 'keepRerollDesign' || view.question === 'designStat'}
        <section class="sheet">
          <h3><PixelText text={view.pc.name || 'The Character'} /></h3>
          <dl>
            {#each sheet as [label, value]}
              <div><dt>{label}</dt><dd>{value}</dd></div>
            {/each}
          </dl>
        </section>
      {/if}

      {#if view.question === null}
        <div class="choices">
          <button type="button" class="go" onclick={openInEditor}>Open in the Save Editor</button>
          <button type="button" onclick={download}>Download file {fileName}</button>
        </div>
        <p class="hint">{chosen.folder}</p>
        {#if note}<p class="note">{note}</p>{/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  .roller {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .page {
    max-width: 880px;
    margin: 0 auto;
    padding: 24px 32px 48px;
  }
  h2 {
    margin: 0 0 12px;
    color: var(--accent);
    line-height: 0;
  }
  h3 {
    margin: 0 0 10px;
    color: var(--accent);
    line-height: 0;
  }
  .lead {
    margin: 0 0 20px;
    color: var(--muted);
    font-size: 13px;
  }
  section {
    margin-bottom: 20px;
  }
  .hint {
    margin: 8px 0;
    color: var(--muted);
    font-size: 13px;
  }
  .note {
    margin: 8px 0;
    color: var(--good);
    font-size: 13px;
  }
  .row,
  .choices {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .choices {
    margin: 14px 0;
  }
  .choices.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }
  button {
    background: var(--panel);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 8px 14px;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }
  button:disabled {
    color: var(--muted);
    cursor: not-allowed;
    opacity: 0.55;
  }
  button.picked {
    border-color: var(--accent);
    color: var(--accent);
  }
  button.go {
    background: var(--accent);
    border-color: var(--accent);
    color: #1a1822;
    font-weight: 600;
  }
  button.go:hover {
    color: #1a1822;
  }
  button.ghost {
    background: none;
  }
  input {
    background: var(--panel-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    padding: 8px 12px;
    min-width: 280px;
  }
  .toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .badge {
    background: var(--panel);
    color: var(--accent);
    border: 1px solid var(--accent-dim);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  /* The game's own screens, in the game's own typeface. */
  .screen {
    background: #000;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px 20px;
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.25;
    color: var(--mw-green);
    white-space: pre-wrap;
    overflow-x: auto;
  }
  .line {
    min-height: 1.25em;
  }
  .sheet {
    margin-top: 22px;
  }
  .sheet h3 {
    margin-bottom: 14px;
  }
  .sheet dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 4px 20px;
    margin: 0;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px 20px;
  }
  .sheet dl div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--line);
    padding: 4px 0;
  }
  .sheet dt {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.4px;
  }
  .sheet dd {
    margin: 0;
    color: var(--ink);
    font-family: var(--font-dos);
    font-size: 19px;
    line-height: 1;
  }
</style>
