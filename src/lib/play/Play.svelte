<script lang="ts">
  import { untrack } from 'svelte';
  import { app, currentEntry } from '../app-state.svelte';
  import { characterDied, replaceCharacterBytes } from '../character/current';
  import FloorCanvas from '../map/FloorCanvas.svelte';
  import { UNFORGIVEN_MAP } from '../map/game';
  import { FULL_FLOOR } from '../map/viewport';
  import WallTexture from '../map/WallTexture.svelte';
  import GameScreen from '../ui/GameScreen.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import MessageBox from './MessageBox.svelte';
  import Panel from './Panel.svelte';
  import Portrait from './Portrait.svelte';
  import Screen from './Screen.svelte';
  import { runMoveControl, startGame, type CharacterFile, type GameSession, type PlayView } from './engine';
  import { runPlayLoop } from './loop';
  import { dotuMapFiles, downloadMapFiles } from './export-maps';
  import { downloadRunLog } from './export-run';
  import { compassKeys, gameKey, KEY_BUTTONS } from './keys';
  import { actionWords, milestoneNote, milestoneWords, RunRecorder, RUN_GAMES } from './run';
  import { arrowLabel, MOVEMENT_STYLES, readMovementStyle, writeMovementStyle, type MovementStyle } from './movement';
  import { characterMaps } from './memory';
  import ScreenSwitch from './ScreenSwitch.svelte';
  import {
    debugDrawn,
    mapDrawn,
    monstersDrawn,
    panelVisible,
    PLAY_MODES,
    readPlayDisplay,
    readPlayMode,
    sidePicturesVisible,
    writePlayMode,
    zoomMapMonsters,
    type PlayDisplay,
    type PlayMode,
  } from './mode';
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
  const storedMode = readPlayMode('unforgiven');
  let mode = $state<PlayMode>(storedMode);
  let display = $state<PlayDisplay>(readPlayDisplay('unforgiven', storedMode));

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
      // The explored maps live beside the roster entry, the way the game's .DUN files live
      // beside the character's record.
      maps: characterMaps(entry.id),
    };
    // Every game is a run: a seed of its own, and every key that follows written down beside it.
    const run = new RunRecorder({ game: 'unforgiven', name: entry.name, record: entry.bytes });
    const started = startGame(file, run.rng, run);
    started.onChange = () => (view = started.view());
    centredFloor = null;
    session = started;
    playingId = entry.id;
    view = started.view();
    void runPlayLoop(started, runMoveControl(started));
  }

  function leave() {
    session?.finish();
    session = null;
    playingId = null;
    view = null;
  }

  /**
   * The map the floor is drawn from: in faithful mode the one the character has discovered, and
   * none in the other two, where the whole floor is drawn. The view is read so that the map is
   * drawn again as the character learns more of the floor.
   */
  const discoveredMap = $derived.by(() => {
    void view;
    const playing = session;
    return playing ? mapDrawn(mode, playing.memory) : null;
  });

  /**
   * What the zoom map on the game's own screen knows: in faithful the map the character has
   * discovered, and in the other two every square, since those are the modes that show the whole
   * floor.
   */
  const zoomMap = $derived(discoveredMap ?? { known: () => true, knownOnArrival: () => true });

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

  /** The mode is picked with the mouse, and hands the keyboard back the same way. A new mode
   *  shows what that mode shows, until the switch says otherwise. */
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

  /** The .DUN files this character would have beside them in the game's own folder. */
  function exportMaps() {
    const playing = session;
    const entry = currentEntry();
    if (playing && entry) downloadMapFiles(dotuMapFiles(playing.memory.exploredFloors(), entry.slot), entry.name);
  }

  /** The run as it stands, as a file. */
  function exportRun() {
    const run = session?.run;
    if (run) downloadRunLog({ ...run.log(), mode: session?.mode ?? null });
  }

  /** The game's own clock, which the panel calls "spent down here". */
  const clockWords = RUN_GAMES.unforgiven.clockWords;

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
        Dungeons of the Unforgiven, played in a browser: the game's own dungeon, its own monsters and its own keys, on
        the screen the game draws them on. The character on the roster is the one who walks, and the game saves them
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
        {#if display === 'screen'}
          <Screen
            game={session.game}
            rows={view.rows}
            place={view.place}
            monsters={monstersDrawn(mode, view)}
            box={view.box}
            screen={view.screen}
            screenCleared={view.screenCleared}
            discovered={zoomMap}
            mapMonsters={zoomMapMonsters(mode, view)}
            debug={debugDrawn(mode)}
            prompt={view.prompt}
            killed={view.killed}
            viewsDrawn={view.viewsDrawn}
            expandedMap={view.expandedMap}
            tablet={view.tablet}
            sectionScreen={view.sectionScreen}
            buildingScreen={view.buildingScreen}
            plaque={view.plaque} />
        {:else}
          <FloorCanvas
            bind:this={canvas}
            game={UNFORGIVEN_MAP}
            rows={view.rows}
            floor={view.place.floor}
            dungeon={view.place.module}
            monsters={monstersDrawn(mode, view)}
            discovered={discoveredMap}
            bounds={FULL_FLOOR}
            you={{ x: view.place.x, y: view.place.y, dir: view.place.dir }}
            focus={{ x: view.place.x, y: view.place.y, cell: PLAY_CELL }}
          />
          {#if view.prompt}
            <div class="prompt">{#each view.prompt as line}<div>{line.text}</div>{/each}</div>
          {/if}
          <!-- The game's screen draws these across the four views; with the map in their place
               there is nowhere on it to put them, so they cover the map the way they cover the
               views. -->
          {#if view.screen.length > 0}
            <div class="overlay"><GameScreen lines={view.screen} /></div>
          {/if}
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
        <div class="switch"><ScreenSwitch game="unforgiven" bind:display /></div>
        <div class="place">
          <span>{view.place.floor === 0 ? 'Town' : `Floor ${view.place.floor}`}</span>
          <span>Module {view.place.module + 1}</span>
          <span>{view.place.x}, {view.place.y}</span>
          <span>{['North', 'South', 'West', 'East'][view.place.dir]}</span>
        </div>
        <div class="run">
          {#if view.run}
            <span class="actions">{actionWords(view.run.actions)}</span>
            {#each view.run.milestones as milestone}
              <span class="milestone" title={milestoneNote(milestone, clockWords(milestone.time))}>
                {milestoneWords(milestone, UNFORGIVEN_MAP.dungeonName)}
              </span>
            {/each}
            <button type="button" onclick={exportRun}>Export run</button>
          {/if}
          <button type="button" onclick={exportMaps}>Export maps</button>
        </div>
        {#if display === 'map'}
          <MessageBox lines={view.box} />
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
          <div class="key-note">Every key the game reads:</div>
          <div class="key-row">
            {#each KEY_BUTTONS as button}
              <button type="button" title={arrowLabel(style, button.key) ?? button.label} onclick={() => press(button.key)}>{button.cap}</button>
            {/each}
          </div>
        </div>
        {#if sidePicturesVisible(mode, display)}
          <Portrait
            monster={view.ahead ? view.engaged : null}
            module={view.place.module}
            floor={view.place.floor}
          />
          <WallTexture game={UNFORGIVEN_MAP.id} dungeon={view.place.module} floor={view.place.floor} />
        {/if}
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
    /* The screen is 4:3 and as wide as this column, so on a wide window the column stops
       growing where the screen would run under the character panel at the foot of the page. */
    max-width: min(100%, calc((100dvh - 22rem) * 4 / 3));
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
  .over-box .stopped {
    max-width: 42ch;
    text-align: center;
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
  .run button + button {
    margin-left: 0;
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
