<script lang="ts">
  import { untrack } from 'svelte';
  import { app, currentEntry } from '../app-state.svelte';
  import { characterDied, replaceCharacterBytes } from '../character/current';
  import FloorCanvas from '../map/FloorCanvas.svelte';
  import { UNFORGIVEN_MAP } from '../map/game';
  import { FULL_FLOOR } from '../map/viewport';
  import GameScreen from '../ui/GameScreen.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import Panel from './Panel.svelte';
  import Portrait from './Portrait.svelte';
  import { runMoveControl, startGame, type CharacterFile, type GameSession, type PlayView } from './engine';
  import { downloadRunLog } from './export-run';
  import { compassKeys, gameKey, INTERCEPTED_KEYS, KEY_BUTTONS } from './keys';
  import { actionWords, milestoneNote, milestoneWords, RunRecorder } from './run';
  import { arrowLabel, MOVEMENT_STYLES, readMovementStyle, writeMovementStyle, type MovementStyle } from './movement';
  import { monstersDrawn, panelVisible, PLAY_MODES, readPlayMode, writePlayMode, type PlayMode } from './mode';
  import { MENU_LINE_STEP, MENU_SPREAD_TO, MENU_TOP, MENU_X } from '../game/port/screens';
  import { MESSAGE_BOX_LINES } from './screens';

  /** How wide the message box's corner of the game's screen is, in the game's own units. */
  const BOX_WINDOW = {
    x: MENU_X,
    y: MENU_TOP - 10,
    width: MENU_SPREAD_TO - MENU_X,
    height: MENU_LINE_STEP * MESSAGE_BOX_LINES + 20,
  };

  /** How many pixels a square is drawn at when the map is centred on the character. */
  const PLAY_CELL = 22;

  let session = $state.raw<GameSession | null>(null);
  /** Which character on the roster the session is playing, so an edit to another one is left to
   *  the editor. */
  let playingId = $state.raw<string | null>(null);
  let view = $state.raw<PlayView | null>(null);
  let canvas = $state.raw<FloorCanvas | null>(null);
  let centredFloor = $state.raw<number | null>(null);
  let style = $state<MovementStyle>(readMovementStyle('unforgiven'));
  let mode = $state<PlayMode>(readPlayMode('unforgiven'));

  const character = $derived.by(() => {
    void app.characterVersion;
    return currentEntry();
  });
  const playable = $derived(character !== null && character.game === UNFORGIVEN_MAP.id);

  function start() {
    const entry = currentEntry();
    if (!entry) return;
    const file: CharacterFile = {
      bytes: entry.bytes,
      write(bytes) {
        this.bytes = bytes;
        replaceCharacterBytes(bytes);
      },
      died: characterDied,
    };
    // Every game is a run: a seed of its own, and every key that follows written down beside it.
    const run = new RunRecorder({ game: 'unforgiven', name: entry.name, record: entry.bytes });
    const started = startGame(file, run.rng, run);
    started.onChange = () => (view = started.view());
    centredFloor = null;
    session = started;
    playingId = entry.id;
    view = started.view();
    void runMoveControl(started);
  }

  function leave() {
    session?.finish();
    session = null;
    playingId = null;
    view = null;
  }

  /** The mode belongs to the tab; the session carries it so that anything keeping a record of
   *  the run can say which mode it was played in. */
  $effect(() => {
    if (session) session.mode = mode;
  });

  /** The Save Editor writes the roster entry's bytes and bumps the version; the game reads the
   *  record again and follows the edit. */
  $effect(() => {
    void app.characterVersion;
    const playing = session;
    const id = playingId;
    untrack(() => {
      const entry = currentEntry();
      if (playing && entry && entry.id === id) playing.recordEdited(entry.bytes);
    });
  });

  /**
   * The map follows the character: it is centred when they arrive on a floor, and scrolled when
   * a step takes them off the edge of what is drawn.
   *
   * Only the character's square and the tab being open are watched. Moving the map reads and
   * writes the canvas's own view, and an effect that watched that as well would move the map
   * because the map had moved.
   */
  $effect(() => {
    const place = view?.place;
    const showing = app.tab === 'play';
    untrack(() => {
      if (!showing || !place || !canvas) return;
      if (centredFloor !== place.floor) {
        if (canvas.centre(place, PLAY_CELL)) centredFloor = place.floor;
      } else {
        canvas.reveal(place);
      }
    });
  });

  /** Opening the tab puts the character back in the middle, since nothing could be drawn while
   *  it was hidden. */
  $effect(() => {
    const showing = app.tab === 'play';
    const playing = session;
    if (!showing || !playing) return;
    const frame = requestAnimationFrame(() => {
      const place = playing.view().place;
      if (canvas && canvas.centre(place, PLAY_CELL)) centredFloor = place.floor;
    });
    return () => cancelAnimationFrame(frame);
  });

  function onKeyDown(event: KeyboardEvent) {
    if (app.tab !== 'play' || !session || session.over) return;
    if (isTyping(event.target)) return;
    const key = gameKey(event);
    if (key === null) return;
    event.preventDefault();
    press(key);
  }

  /** The style is picked with the mouse, and the arrow keys belong to the game rather than to a
   *  radio button, so the control hands the keyboard back as soon as it has been answered. */
  function chooseStyle(input: HTMLInputElement) {
    writeMovementStyle('unforgiven', style);
    input.blur();
  }

  /** The mode is picked with the mouse, and hands the keyboard back the same way. */
  function chooseMode(input: HTMLInputElement) {
    writePlayMode('unforgiven', mode);
    input.blur();
  }

  /** A key on its way to the game. Under Moraff's World's arrows an arrow becomes the turn and
   *  the step that come to the same thing here, and the loop reads them one after the other. */
  function press(key: number) {
    const playing = session;
    if (!playing) return;
    const keys = style === UNFORGIVEN_MAP.id ? [key] : compassKeys(key, playing.game.pc.dir);
    for (const one of keys) playing.press(one);
  }

  /** The run as it stands, as a file. */
  function exportRun() {
    const run = session?.run;
    if (run) downloadRunLog(run.log());
  }

  /** The game's own clock, which the panel calls "spent down here". */
  const clockWords = (seconds: number) => `${seconds} second${seconds === 1 ? '' : 's'}`;

  function isTyping(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="play">
  {#if !session || !view}
    <div class="page">
      <h2><PixelText text="Play" scale={2} /></h2>
      <p class="lead">
        Dungeons of the Unforgiven, played in a browser: the game's own dungeon, its own monsters and its own keys, with
        the map where the 3-D view used to be. The character on the roster is the one who walks, and the game saves them
        back where it would have saved them, so they can go on playing in DOS.
      </p>
      {#if !playable}
        <p class="hint">Load a Dungeons of the Unforgiven save or roll a character, and this is where they play.</p>
      {:else}
        {#if character?.dead}
          <p class="hint">{character.name} is dead. Playing on carries on from wherever the game last saved them.</p>
        {/if}
        <div class="row">
          <button type="button" class="go" onclick={start}>Play as {character?.name}</button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="stage">
      <div class="map">
        <FloorCanvas
          bind:this={canvas}
          game={UNFORGIVEN_MAP}
          rows={view.rows}
          floor={view.place.floor}
          dungeon={view.place.module}
          monsters={monstersDrawn(mode, view)}
          bounds={FULL_FLOOR}
          you={{ x: view.place.x, y: view.place.y, dir: view.place.dir }}
          focus={{ x: view.place.x, y: view.place.y, cell: PLAY_CELL }}
        />
        {#if view.screen.length > 0}
          <div class="overlay"><GameScreen lines={view.screen} /></div>
        {/if}
        {#if view.prompt}
          <div class="prompt">{#each view.prompt as line}<div>{line}</div>{/each}</div>
        {/if}
        {#if view.over}
          <div class="over">
            <div class="over-box">
              <div class="line">{view.dead ? 'THE CHARACTER IS DEAD' : 'SAVED AND BACK ON THE ROSTER'}</div>
              <button type="button" onclick={leave}>Leave the game</button>
            </div>
          </div>
        {/if}
      </div>
      <aside class="side">
        <div class="place">
          <span>{view.place.floor === 0 ? 'Town' : `Floor ${view.place.floor}`}</span>
          <span>Module {view.place.module + 1}</span>
          <span>{view.place.x}, {view.place.y}</span>
          <span>{['North', 'South', 'West', 'East'][view.place.dir]}</span>
        </div>
        {#if view.run}
          <div class="run">
            <span class="actions">{actionWords(view.run.actions)}</span>
            {#each view.run.milestones as milestone}
              <span class="milestone" title={milestoneNote(milestone, clockWords(milestone.time))}>
                {milestoneWords(milestone, UNFORGIVEN_MAP.dungeonName)}
              </span>
            {/each}
            <button type="button" onclick={exportRun}>Export run</button>
          </div>
        {/if}
        <GameScreen lines={view.box} window={BOX_WINDOW} />
        {#if view.banner.length > 0}
          <div class="banner">
            {#each view.banner as line}<div>{line}</div>{/each}
          </div>
        {/if}
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
          <div class="key-note">Arrow keys:</div>
          <div class="styles">
            {#each MOVEMENT_STYLES as choice}
              <label>
                <input type="radio" value={choice.id} bind:group={style} onchange={(event) => chooseStyle(event.currentTarget)} />
                <span>{choice.label}</span>
                <span class="how">{choice.how}</span>
              </label>
            {/each}
          </div>
          <div class="key-note">The browser takes these, so here they are as buttons:</div>
          <div class="key-row">
            {#each INTERCEPTED_KEYS as button}
              <button type="button" title={button.label} onclick={() => press(button.key)}>{button.cap}</button>
            {/each}
          </div>
          <div class="key-note">Every key the game reads:</div>
          <div class="key-row">
            {#each KEY_BUTTONS as button}
              <button type="button" title={arrowLabel(style, button.key) ?? button.label} onclick={() => press(button.key)}>{button.cap}</button>
            {/each}
          </div>
        </div>
        <Portrait
          monster={view.ahead ? view.engaged : null}
          module={view.place.module}
          floor={view.place.floor}
        />
        {#if panelVisible(mode)}
          <Panel game={session.game} {view} />
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
    min-width: 0;
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    padding: 12px;
  }
  .overlay :global(.screen) {
    width: min(100%, 1100px);
  }
  .prompt {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 8px 12px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.8);
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.1;
    color: #fff;
  }
  .over {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
  }
  .over-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 20px 26px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: #000;
  }
  .over-box .line {
    font-family: var(--font-dos);
    font-size: 24px;
    color: var(--accent);
  }
  .run {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    font-size: 12px;
    color: var(--muted);
  }
  .run .actions {
    color: var(--ink);
  }
  .run .milestone {
    padding: 1px 6px;
    border: 1px solid var(--line);
    border-radius: 999px;
  }
  .run button {
    margin-left: auto;
  }
  .over-box button,
  .run button,
  .keys button {
    padding: 6px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel-2);
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .keys button {
    min-width: 30px;
    font-family: var(--font-dos);
    font-size: 16px;
  }
  .keys button:hover {
    color: var(--accent);
  }
  .side {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: clamp(300px, 26vw, 380px);
    flex-shrink: 0;
    padding: 12px;
    border-left: 1px solid var(--line);
    overflow-y: auto;
  }
  /* The message box is as tall as it is wide times its aspect ratio and holds nothing that takes
     up room of its own, so a column with more in it than fits would otherwise squash it to
     nothing. */
  .side :global(.screen) {
    flex-shrink: 0;
  }
  /* Narrow enough that a column beside the map would leave the map the smaller of the two: the
     side goes under the map instead and the whole tab scrolls. */
  @media (max-width: 900px) {
    .stage {
      flex-direction: column;
      overflow-y: auto;
    }
    .map {
      flex: none;
      height: min(70vh, 520px);
    }
    /* The message box is drawn to fill whatever it is given, so the column keeps roughly the
       width it has beside the map rather than stretching it across the screen. */
    .side {
      width: 100%;
      max-width: 460px;
      border-left: none;
      border-top: 1px solid var(--line);
      overflow-y: visible;
    }
  }
  .place {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    color: var(--muted);
    font-size: 12px;
  }
  .banner {
    padding: 8px 10px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: #000;
    font-family: var(--font-dos);
    font-size: 17px;
    line-height: 1.15;
    color: #ffd200;
  }
  .key-note {
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 12px;
  }
  .key-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px;
  }
  .styles {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
  }
  .styles label {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0 6px;
    font-size: 12px;
    cursor: pointer;
  }
  .styles input {
    grid-row: span 2;
    margin: 0;
    accent-color: var(--accent);
  }
  .styles .how {
    grid-column: 2;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.4;
  }
</style>
