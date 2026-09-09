<script lang="ts">
  import { untrack } from 'svelte';
  import { app, currentEntry } from '../../app-state.svelte';
  import { armSpeaker } from '../../speaker';
  import { characterDied, replaceCharacterBytes } from '../../character/current';
  import FloorCanvas from '../../map/FloorCanvas.svelte';
  import { MORAFFS_REVENGE_MAP } from '../../map/game';
  import PlayRoster from '../PlayRoster.svelte';
  import { revStockedMonster } from '../../map/rev-stocking';
  import type { StockedMonster } from '../../map/stocking';
  import { FULL_FLOOR } from '../../map/viewport';
  import { isTyping } from '../../ui/keys';
  import PixelText from '../../ui/PixelText.svelte';
  import { downloadMapFiles, revMapFile } from '../export-maps';
  import { downloadRunLog } from '../export-run';
  import { actionWords, milestoneNote, milestoneWords, RunRecorder, RUN_GAMES } from '../run';
  import ScreenSwitch from '../ScreenSwitch.svelte';
  import {
    mapDrawn,
    monstersDrawn,
    panelVisible,
    PLAY_MODES,
    colourblindFilter,
    readPlayColourblind,
    readPlaySound,
    readPlayRedraw,
    readPlayDisplay,
    readPlayMode,
    writePlayMode,
    writePlaySound,
    type PlayDisplay,
    type PlayMode,
  } from '../mode';
  import RevPanel from './RevPanel.svelte';
  import {
    runRevDungeon,
    startRevGame,
    type RevCharacterFile,
    type RevGameSession,
    type RevPlayView,
  } from './engine';
  import { runPlayLoop } from '../loop';
  import { revGameKey } from './keys';
  import { revArrowRun, revRedrawMs } from './pace';
  import { revCharacterMap } from './memory';
  import RevScreenCanvas from './screen/RevScreenCanvas.svelte';
  import { revCgaPalette } from './settings';

  /** How many pixels a square is drawn at when the map is centred on the character. */
  const PLAY_CELL = 26;

  /** The facing as the map canvas numbers it — 0 north, 1 south, 2 west, 3 east — from the
   *  game's own 1 north, 2 east, 3 south, 4 west (1000:30C7). */
  const CANVAS_FACING = [0, 0, 3, 1, 2];

  /** What the sound checkbox says, which is what the game's own question at DUNSMALL.EXE
   *  1000:0517 asks and what the `O` key does with the answer afterwards. */
  const SOUND_NOTE = 'The game asks on the way in. O turns it off and on again while you play.';

  /** What each mode says about the two ways the arrows move, for the line under the map. */
  const ARROW_NOTE = {
    compass: 'Each arrow faces the way it points and steps that way.',
    turning: 'Up steps the way you face, left and right turn, and down turns around.',
  };

  let session = $state.raw<RevGameSession | null>(null);
  let playingId = $state.raw<string | null>(null);
  let view = $state.raw<RevPlayView | null>(null);
  let canvas = $state.raw<FloorCanvas | null>(null);
  let centredLevel = $state.raw<number | null>(null);
  let mode = $state<PlayMode>(readPlayMode('revenge'));
  let display = $state<PlayDisplay>(readPlayDisplay('revenge'));
  let colourblind = $state(readPlayColourblind('revenge'));
  let sound = $state(readPlaySound('revenge'));
  let redraw = $state(readPlayRedraw('revenge'));
  /** How many arrows have arrived in a row, which is what shortens the redraw (`pace.ts`). It is
   *  the tab's own count: nothing the game does reads it and it reaches no run log. */
  let arrowRun = $state(0);

  const character = $derived.by(() => {
    void app.characterVersion;
    return currentEntry();
  });
  const playable = $derived(character !== null && character.game === MORAFFS_REVENGE_MAP.id);

  /** The floor as the wall rule generates it, for the character's own generation. */
  const rows = $derived(
    view === null ? [] : MORAFFS_REVENGE_MAP.floor(view.place.level, session?.game.pc.generation ?? 1),
  );

  /** The monsters the map draws, named the way the map explorer names the ones it stocks, so
   *  that both reach the same entry of the Moraff's Revenge bestiary. */
  const monsters = $derived.by((): StockedMonster[] =>
    view === null
      ? []
      : monstersDrawn(mode, { monsters: asStocked(view.monsters), visible: asStocked(view.visible), engaged: null }),
  );

  function asStocked(standing: RevPlayView['monsters']): StockedMonster[] {
    const playing = session;
    if (!playing) return [];
    const level = playing.game.pc.dungeonLevel;
    return standing.map((monster) =>
      revStockedMonster(monster, level, playing.game.monsters.strengths[monster.slot] ?? 0),
    );
  }

  /**
   * The game's own screen, redrawn whenever anything the loop or the clock touches changes.
   *
   * A screen the game asked to be left up for a moment is what comes back while it is up
   * (`held.ts`), so a message the game holds for two seconds is on the tab for two seconds.
   */
  const gameScreen = $derived.by(() => {
    void view;
    const playing = session;
    if (!playing) return null;
    return playing.screen();
  });

  /**
   * How long the game's screen takes to appear: the slider, less what the arrows being held down
   * take off it (`pace.ts`). The view is read so that a press of `E` is felt on the next screen.
   */
  const screenRedraw = $derived.by(() => {
    void view;
    return revRedrawMs(redraw, session?.game.enterDelay ?? 0, arrowRun);
  });

  /**
   * The colours the game's screen is drawn in: the `@` key flips between the two `SCREEN 1`
   * palettes and the `#` key steps the colour behind everything. The view is read so that a
   * press of either redraws the canvas.
   */
  const screenColours = $derived.by(() => {
    void view;
    const playing = session;
    if (!playing) return { palette: 0, background: 0 };
    return { palette: revCgaPalette(playing.game), background: playing.game.background };
  });

  /** The map the floor is drawn from: the squares walked in faithful mode, the whole level in
   *  the other two. The view is read so that the map is drawn again as the character walks. */
  const discoveredMap = $derived.by(() => {
    void view;
    const playing = session;
    if (!playing) return null;
    const level = playing.game.pc.dungeonLevel;
    return mapDrawn(mode, { discovered: () => playing.game.memory.discovered(level) });
  });

  function start() {
    const entry = currentEntry();
    if (!entry) return;
    const file: RevCharacterFile = {
      bytes: entry.bytes,
      write(bytes) {
        this.bytes = bytes;
        replaceCharacterBytes(bytes);
      },
      died: characterDied,
      // The explored map lives beside the roster entry, the way <n>.BIN lives beside <n>.EXE.
      map: revCharacterMap(entry.id),
      // F5.COM holds the names in the game's own folder; here the roster entry does.
      name: entry.name,
    };
    const run = new RunRecorder({ game: 'revenge', name: entry.name, record: entry.bytes, sound });
    const started = startRevGame(file, run.rng, run, sound);
    started.onChange = () => (view = started.view());
    centredLevel = null;
    session = started;
    playingId = entry.id;
    view = started.view();
    void runPlayLoop(started, runRevDungeon(started));
  }

  function leave() {
    session?.finish();
    session = null;
    playingId = null;
    view = null;
  }

  $effect(() => {
    if (session) session.mode = mode;
  });

  /** The Save Editor writes the roster entry's bytes; the game reads the record again. */
  $effect(() => {
    void app.characterVersion;
    const playing = session;
    const id = playingId;
    untrack(() => {
      const entry = currentEntry();
      if (playing && entry && entry.id === id) playing.recordEdited(entry.bytes);
    });
  });

  /** The map follows the character: centred on arriving on a level, scrolled by a step. */
  $effect(() => {
    const place = view?.place;
    const showing = app.tab === 'play';
    untrack(() => {
      if (!showing || !place || !canvas) return;
      const at = { x: place.column - 1, y: place.row - 1 };
      if (centredLevel !== place.level) {
        if (canvas.centre(at, PLAY_CELL)) centredLevel = place.level;
      } else {
        canvas.reveal(at);
      }
    });
  });

  $effect(() => {
    const showing = app.tab === 'play';
    const playing = session;
    if (!showing || !playing) return;
    const frame = requestAnimationFrame(() => {
      const place = playing.view().place;
      if (canvas && canvas.centre({ x: place.column - 1, y: place.row - 1 }, PLAY_CELL)) centredLevel = place.level;
    });
    return () => cancelAnimationFrame(frame);
  });

  function onKeyDown(event: KeyboardEvent) {
    if (app.tab !== 'play' || !session || session.over) return;
    if (isTyping(event.target)) return;
    const key = revGameKey(event);
    if (key === null) return;
    event.preventDefault();
    // A browser starts audio only from something the player did, so the speaker is opened on the
    // key rather than when the game starts.
    armSpeaker();
    arrowRun = revArrowRun(arrowRun, key);
    session.press(key);
  }

  /** Letting a key go ends the run of arrows, which is where the original's own reset falls: a
   *  pass whose `INKEY$` finds nothing waiting puts the count back to 0 (1000:4260). */
  function onKeyUp(event: KeyboardEvent) {
    if (revGameKey(event) !== null) arrowRun = 0;
  }

  /** A new mode shows what that mode shows, until the switch says otherwise. */
  function chooseMode(input: HTMLInputElement) {
    writePlayMode('revenge', mode);
    input.blur();
  }

  /** The answer the game asks for on the way in, which is read when a game starts: a game
   *  already running keeps the flag the `O` key leaves it on. */
  function chooseSound(input: HTMLInputElement) {
    writePlaySound('revenge', sound);
    input.blur();
  }

  /** The <n>.BIN this character would have beside them in the game's own folder. */
  function exportMaps() {
    const playing = session;
    const entry = currentEntry();
    if (playing && entry) downloadMapFiles([revMapFile(playing.game.memory.bytes(), entry.slot)], entry.name);
  }

  function exportRun() {
    const run = session?.run;
    if (run) downloadRunLog({ ...run.log(), mode: session?.mode ?? null });
  }

  /** The game's own clock, which is the ticks the monsters moved on. */
  const clockWords = RUN_GAMES.revenge.clockWords;
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

<div class="play">
  {#if !session || !view}
    <div class="page">
      <h2><PixelText text="Play" scale={2} /></h2>
      <p class="lead">
        Moraff's Revenge, played in a browser: the dungeon the wall rule works out square by square, the monsters the
        disk has standing on it, and the game's own keys. The monsters move on their own clock while you think, and a
        fight is turn based once one is beside you. The character on the roster is the one who walks, and the game
        saves them back where it would have saved them.
      </p>
      {#if !playable}
        <p class="hint">Load a Moraff's Revenge save or roll a character, and this is where they play.</p>
      {:else}
        {#if character?.dead}
          <p class="hint">{character.name} is dead. Playing on carries on from wherever the game last saved them.</p>
        {/if}
        <div class="row">
          <button type="button" class="go" onclick={start}>Play as {character?.name}</button>
        </div>
      {/if}
      <PlayRoster game={MORAFFS_REVENGE_MAP.id} />
    </div>
  {:else}
    <div class="stage">
      <div class="map" style:filter={colourblindFilter(colourblind)}>
        {#if display === 'screen' && gameScreen}
          <RevScreenCanvas
            screen={gameScreen}
            palette={screenColours.palette}
            background={screenColours.background}
            redraw={screenRedraw} />
        {:else}
        <FloorCanvas
          bind:this={canvas}
          game={MORAFFS_REVENGE_MAP}
          {rows}
          floor={view.place.level}
          dungeon={session.game.pc.generation}
          {monsters}
          discovered={discoveredMap}
          bounds={FULL_FLOOR}
          you={{ x: view.place.column - 1, y: view.place.row - 1, dir: CANVAS_FACING[view.place.facing] ?? 0 }}
          focus={{ x: view.place.column - 1, y: view.place.row - 1, cell: PLAY_CELL }}
        />
        {/if}
        <!-- The game's own screen prints all of this on the four message rows at its top left
             (`screen/text.ts`), so this is only for the tab showing the map in its place. -->
        {#if !(display === 'screen' && gameScreen)}
          <div class="words">
            {#if view.advice.length > 0}
              <div class="advice">{view.advice.join(' ')}</div>
            {/if}
            {#if view.banner.length > 0}
              <div class="banner">{#each view.banner as line}<div>{line}</div>{/each}</div>
            {/if}
            {#if view.box.length > 0}
              <div class="box">{#each view.box as line}<div>{line}</div>{/each}</div>
            {/if}
            {#if view.prompt}
              <div class="prompt">{view.prompt}</div>
            {/if}
          </div>
        {/if}
        {#if view.over}
          <div class="over">
            <div class="over-box">
              <!-- A loop that threw has stopped the game wherever it was, so the box says so
                   rather than leaving the tab looking like a game still being played. -->
              {#if view.stopped}
                <div class="line stopped">The game stopped: {view.stopped}</div>
              {:else}
                <div class="line">{view.dead ? 'THE CHARACTER IS DEAD' : 'SAVED AND BACK ON THE ROSTER'}</div>
              {/if}
              <button type="button" onclick={leave}>Leave the game</button>
            </div>
          </div>
        {/if}
      </div>
      <aside class="side">
        <div class="switch"><ScreenSwitch game="revenge" bind:display bind:colourblind bind:redraw /></div>
        <div class="place">
          <span>{view.place.level === 0 ? 'The town' : `Level ${view.place.level}`}</span>
          <span>{view.place.column}, {view.place.row}</span>
          <span>{['', 'North', 'East', 'South', 'West'][view.place.facing] ?? ''}</span>
        </div>
        <div class="vitals">
          <span>{Math.trunc(session.game.pc.hp)} of {Math.trunc(session.game.pc.maxHp)} health points</span>
          <span>Level {Math.trunc(session.game.pc.level)}</span>
          <span>{Math.trunc(session.game.pc.money)} JP</span>
          <span>{Math.trunc(session.game.pc.weight)} lb</span>
        </div>
        {#if view.fight}
          <div class="fighting">
            <span>Fighting a level {view.fight.monsterLevel} monster</span>
            <span>{view.fight.hitPoints} hit points left</span>
          </div>
        {/if}
        <div class="run">
          {#if view.run}
            <span class="actions">{actionWords(view.run.actions)}</span>
            {#each view.run.milestones as milestone}
              <span class="milestone" title={milestoneNote(milestone, clockWords(milestone.time))}>
                {milestoneWords(milestone, MORAFFS_REVENGE_MAP.dungeonName)}
              </span>
            {/each}
            <button type="button" onclick={exportRun}>Export run</button>
          {/if}
          <button type="button" onclick={exportMaps}>Export maps</button>
        </div>
        <div class="keys">
          <div class="key-note">Play mode:</div>
          <div class="styles">
            {#each PLAY_MODES as choice}
              <label>
                <input type="radio" value={choice.id} bind:group={mode} onchange={(event) => chooseMode(event.currentTarget)} />
                <span>{choice.label}</span>
                <span class="how">{choice.how}</span>
              </label>
            {/each}
          </div>
          <div class="styles">
            <label>
              <input type="checkbox" bind:checked={sound} onchange={(event) => chooseSound(event.currentTarget)} />
              <span>Sound</span>
              <span class="how">{SOUND_NOTE}</span>
            </label>
          </div>
          <div class="key-note">Arrow keys, which Escape switches between:</div>
          <div class="how">{ARROW_NOTE[view.arrows]}</div>
        </div>
        {#if panelVisible(mode)}
          <RevPanel game={session.game} {view} />
        {/if}
      </aside>
    </div>
  {/if}
</div>

<style>
  .play {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
  }
  .page {
    padding: 24px;
    max-width: 760px;
  }
  h2 {
    margin: 0 0 14px;
    line-height: 0;
    color: var(--accent);
  }
  .lead,
  .hint {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.6;
  }
  .row {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  .go {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background: var(--accent-dim);
    color: #1a1822;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .stage {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
  }
  .map {
    position: relative;
    flex: 1;
    min-width: 420px;
    /* The screen is 4:3 and as wide as this column, so on a wide window the column stops
       growing where the screen would run under the character panel at the foot of the page. */
    max-width: min(100%, calc((100dvh - 22rem) * 4 / 3));
  }
  .words {
    position: absolute;
    left: 10px;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
    font-family: var(--font-dos);
    font-size: 15px;
    line-height: 1.35;
    white-space: pre-wrap;
  }
  .advice {
    color: #55ff55;
  }
  .banner {
    color: #ffffff;
  }
  .box {
    color: #ffff55;
    background: rgba(0, 0, 0, 0.72);
    padding: 4px 8px;
    border-radius: 6px;
    max-width: 40ch;
  }
  .prompt {
    color: #55ffff;
  }
  .over {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.6);
  }
  .over-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 20px 26px;
    border-radius: 10px;
    background: var(--panel);
    border: 1px solid var(--line);
  }
  .over-box .line {
    font-family: var(--font-dos);
    color: var(--accent);
  }
  .over-box .stopped {
    max-width: 42ch;
    text-align: center;
  }
  .side {
    width: 300px;
    flex: none;
    padding: 14px;
    border-left: 1px solid var(--line);
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .place,
  .vitals,
  .fighting,
  .run {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .run .actions {
    color: var(--accent);
  }
  .milestone {
    padding: 1px 6px;
    border-radius: 999px;
    border: 1px solid var(--line);
  }
  .keys {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .key-note {
    font-size: 11px;
    color: var(--muted);
  }
  .how {
    font-size: 11px;
    color: var(--muted);
    opacity: 0.8;
  }
  .styles {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }
  .styles label {
    display: flex;
    gap: 6px;
    align-items: baseline;
  }
  .run button {
    padding: 3px 7px;
    border-radius: 6px;
    border: 1px solid var(--line);
    background: var(--panel);
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
</style>
