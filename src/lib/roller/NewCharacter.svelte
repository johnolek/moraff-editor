<script lang="ts">
  import { app } from '../app-state.svelte';
  import { keepRolledCharacter } from '../character/current';
  import { goToTab } from '../history';
  import { MW_CLASS_NAMES, MW_RACES, MINUTES_PER_YEAR } from '../game/mw-port/character';
  import type { MwCharacter } from '../game/mw-port/state';
  import { CLASS_NAMES, RACES, typedName } from '../game/port/character';
  import type { PlayerCharacter, ScreenLine } from '../game/port/state';
  import GameScreen from '../ui/GameScreen.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import { DESIGN_STAT_KEYS, rollerKey, type RollerScreen } from './keys';
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

  let slot = $state(SLOTS[0]);
  let session = $state.raw<RollerSession | MwRollerSession | null>(null);
  let view = $state.raw<ReturnType<RollerSession['view']> | ReturnType<MwRollerSession['view']> | null>(null);
  let typed = $state('');
  let note = $state('');

  /** Which game is being rolled for. The tab is only offered for the two games with a roller,
   *  so a game without one shows Dungeons of the Unforgiven's behind the scenes. */
  const rolling = $derived<'unforgiven' | 'moraffsWorld'>(app.game === 'moraffsWorld' ? 'moraffsWorld' : 'unforgiven');
  const chosen = $derived(GAMES[rolling]);
  /** The screen a key would answer: the game's own, or the character number asked for first. */
  const screen = $derived<RollerScreen | null>(session && view ? view.question : 'number');
  const menus = $derived({ races: chosen.races.length, classes: chosen.classes.length, numbers: chosen.slots.length });
  const fileName = $derived(rolling === 'unforgiven' ? slotFileName(slot) : mwSlotFileName(slot));
  const sheet = $derived(view === null ? [] : sheetRows(view.pc));
  const showing = $derived(
    view === null ? [] : view.question === 'name' ? [...view.screen, nameBeingTyped()] : view.screen,
  );

  /**
   * The name as it is typed, which typed_name (exe 4000:55b2) draws under the prompt as the keys
   * come in: eighteen character slots between x = 0 and x = 0x44c, in the big font in yellow. The
   * port takes the finished name from the tab instead, so the tab draws this one. Both games keep
   * the same characters of what is typed, so either port's filter shows what will be stored.
   */
  function nameBeingTyped(): ScreenLine {
    const name = typedName(typed);
    return { text: name, x: 0, y: 1000, spreadTo: Math.round((0x44c / 18) * name.length), font: 2, colour: 4 };
  }

  /** The finished character under the game's own screen, with the money the screen never shows. */
  function sheetRows(pc: PlayerCharacter | MwCharacter): [string, string][] {
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
        ['CLASS', MW_CLASS_NAMES[pc.cls]],
        ['HEALTH POINTS', String(pc.maxHp)],
        ['SPELL POINTS', String(pc.maxSp)],
        ['JEWELS', String(pc.money)],
      ];
    }
    return [
      ['RACE', RACES[pc.race].name],
      ['SEX', pc.sex === 0 ? 'MALE' : 'FEMALE'],
      ...stats,
      ['HEIGHT', `${pc.height * 4} INCHES`],
      ['WEIGHT', `${pc.weight} POUNDS`],
      ['AGE', `${pc.age} YEARS`],
      ['CLASS', CLASS_NAMES[pc.cls]],
      ['HEALTH POINTS', String(pc.maxHp)],
      ['SPELL POINTS', String(pc.maxSp)],
      ['RUBLES', String(pc.money)],
      ['MAGIC CRYSTALS', String(pc.crystals)],
    ];
  }

  /** The bytes of the slot file, which is the whole record for either game. */
  function characterFile(pc: PlayerCharacter | MwCharacter): Uint8Array<ArrayBuffer> {
    return 'ageMinutes' in pc ? newMwCharacterFile(pc) : newCharacterFile(pc);
  }

  // A roll is one game's questions and one game's dice, so the switch in the header starts over.
  $effect(() => {
    slot = GAMES[rolling].slots[0];
    session = null;
    view = null;
    note = '';
  });

  function start() {
    const started = rolling === 'unforgiven' ? new RollerSession(slot) : new MwRollerSession(slot);
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
    keepRolledCharacter(rolling, view.pc.name || fileName, slot, characterFile(view.pc));
    goToTab(app, 'editor');
  }

  /** The game is answered from the keyboard while the tab is showing, the same keys its own
   *  screens ask for. A key belongs to whatever is being typed into, and a shortcut belongs to
   *  the browser. */
  function onKeyDown(event: KeyboardEvent) {
    if (app.tab !== 'roller' || screen === null) return;
    if (event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
    const action = rollerKey(screen, event.key, typed, menus);
    if (!action) return;
    event.preventDefault();
    if (action.kind === 'answer') answer(action.value);
    else if (action.kind === 'typing') typed = action.typed;
    else if (action.kind === 'pick') slot = chosen.slots[action.index];
    else if (screen === 'name') enterName();
    else start();
  }

  function isTyping(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
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

<svelte:window onkeydown={onKeyDown} />

<div class="roller">
  <div class="page">
    {#if !session || !view}
      <h2><PixelText text="New Character" scale={2} /></h2>
      <p class="lead">
        Roll up a character the way the game does: the same questions, the same dice, the same starting kit. The finished
        character opens in the Save Editor and downloads as a character file you can drop into your game folder.
      </p>

      <section>
        <h3><PixelText text="Character Number" /></h3>
        <p class="hint">{chosen.numbers}</p>
        <p class="hint">The keyboard picks them too: 0 to 9 for the ten numbers, then Enter to roll.</p>
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

      <GameScreen lines={showing} />

      {#if view.question === 'continue'}
        <div class="choices">
          <button type="button" onclick={() => answer(0)}>Hit any key</button>
        </div>
      {:else if view.question === 'difficulty'}
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
        <div class="choices grid">
          {#each STATS as stat, index}
            <button type="button" onclick={() => answer(index)}>{DESIGN_STAT_KEYS[index]}) {stat}</button>
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

      {#if view.question === null}
        <section class="sheet">
          <h3><PixelText text={view.pc.name || 'The Character'} /></h3>
          <dl>
            {#each sheet as [label, value]}
              <div><dt>{label}</dt><dd>{value}</dd></div>
            {/each}
          </dl>
        </section>

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
  /* The game's own screen, in the game's own typeface, laid out in the game's own coordinates. */
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
