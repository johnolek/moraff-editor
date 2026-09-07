<script lang="ts">
  import { untrack } from 'svelte';
  import { app, currentEntry } from '../../app-state.svelte';
  import { characterDied, replaceCharacterBytes } from '../../character/current';
  import { RealRng } from '../../game/port/rng';
  import FloorCanvas from '../../map/FloorCanvas.svelte';
  import { MORAFFS_WORLD_MAP } from '../../map/game';
  import { FULL_FLOOR } from '../../map/viewport';
  import GameScreen from '../../ui/GameScreen.svelte';
  import { SCREEN_COLOURS } from '../../roller/screen';
  import PixelText from '../../ui/PixelText.svelte';
  import MwPanel from './MwPanel.svelte';
  import MwPortrait from './MwPortrait.svelte';
  import { runMwMoveControl, startMwGame, type MwCharacterFile, type MwGameSession, type MwPlayView } from './engine';
  import { mwFacingArrow, mwGameKey, mwStepKey, mwTurn, MW_INTERCEPTED_KEYS, MW_KEY_BUTTONS } from './keys';
  import { arrowLabel, MOVEMENT_STYLES, readMovementStyle, writeMovementStyle, type MovementStyle } from '../movement';
  import { mwOnMessageLine } from '../../game/mw-port/state';
  import {
    mwCharacteristicLines,
    mwMonsterViewLines,
    mwStatusLines,
    MW_MONSTER_VIEW_CORNERS,
    MW_NORTH_VIEW,
    MW_SCREEN,
    MW_STATUS_BLOCK,
  } from '../../game/mw-port/screens';
  import { mwCorner, MW_CORNER_WIDTH, MW_MESSAGE_BOX } from './screens';

  /** How many pixels a square is drawn at when the map is centred on the character. */
  const PLAY_CELL = 22;

  let session = $state.raw<MwGameSession | null>(null);
  /** Which character on the roster the session is playing, so an edit to another one is left to
   *  the editor. */
  let playingId = $state.raw<string | null>(null);
  let view = $state.raw<MwPlayView | null>(null);
  let canvas = $state.raw<FloorCanvas | null>(null);
  let centredFloor = $state.raw<number | null>(null);
  let style = $state<MovementStyle>(readMovementStyle(MORAFFS_WORLD_MAP.id));

  const character = $derived.by(() => {
    void app.characterVersion;
    return currentEntry();
  });
  const playable = $derived(character !== null && character.game === MORAFFS_WORLD_MAP.id);

  /** A screen with a line outside the corner the message box lives in is one the game has taken
   *  the whole display over with; one that fits is drawn in that corner with the rest of it. */
  const screenTakesOver = $derived(view !== null && !view.screen.every(mwOnMessageLine));
  const corner = $derived(
    view === null
      ? { lines: [], height: 0 }
      : mwCorner(screenTakesOver ? [] : view.screen, view.banner, view.box),
  );
  const cornerWindow = $derived({ x: 0, y: 0, width: MW_CORNER_WIDTH, height: corner.height });

  /**
   * The values over the monster being faced. The game prints them around whichever of its four
   * views that monster stands in; there is one picture here, so they are always the view ahead's.
   */
  const monsterValues = $derived(
    session === null || view?.engaged == null
      ? []
      : mwMonsterViewLines(session.game, view.engaged.slot, MW_MONSTER_VIEW_CORNERS.north),
  );

  /** The numbers along the bottom of the screen, which the game redraws after every action. The
   *  record they are read out of changes under the session, so the view is what says when. */
  const statusLines = $derived(view === null || session === null ? [] : mwStatusLines(session.game));
  const characteristicLines = $derived(
    view === null || session === null ? [] : mwCharacteristicLines(session.game),
  );

  /** How tall a line of the body font is: the message box steps this far between its own. */
  const LINE_HEIGHT = MW_MESSAGE_BOX.step;

  /** The top and bottom edges of the view ahead, which are the two the values are printed on. */
  const MONSTER_TOP = {
    x: MW_NORTH_VIEW.x,
    y: MW_NORTH_VIEW.y,
    width: MW_NORTH_VIEW.right - MW_NORTH_VIEW.x,
    height: LINE_HEIGHT,
  };
  const MONSTER_BOTTOM = { ...MONSTER_TOP, y: MW_NORTH_VIEW.bottom - LINE_HEIGHT };

  /** The character's own numbers and the six characteristics, side by side along the bottom. */
  const STATUS_HEIGHT = MW_STATUS_BLOCK.bottom - MW_STATUS_BLOCK.y;
  const CHARACTERISTICS_WIDTH = MW_SCREEN.width - MW_STATUS_BLOCK.right;
  const STATUS_WINDOW = {
    x: MW_STATUS_BLOCK.x,
    y: MW_STATUS_BLOCK.y,
    width: MW_STATUS_BLOCK.right,
    height: STATUS_HEIGHT,
  };
  const CHARACTERISTICS_WINDOW = {
    x: MW_STATUS_BLOCK.right,
    y: MW_STATUS_BLOCK.y,
    width: CHARACTERISTICS_WIDTH,
    height: STATUS_HEIGHT,
  };

  function start() {
    const entry = currentEntry();
    if (!entry) return;
    const file: MwCharacterFile = {
      bytes: entry.bytes,
      write(bytes) {
        this.bytes = bytes;
        replaceCharacterBytes(bytes);
      },
      died: characterDied,
    };
    const started = startMwGame(file, new RealRng());
    started.onChange = () => (view = started.view());
    centredFloor = null;
    session = started;
    playingId = entry.id;
    view = started.view();
    void runMwMoveControl(started);
  }

  function leave() {
    session = null;
    playingId = null;
    view = null;
  }

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
    const key = mwGameKey(event);
    if (key === null) return;
    event.preventDefault();
    press(key);
  }

  /** The style is picked with the mouse, and the arrow keys belong to the game rather than to a
   *  radio button, so the control hands the keyboard back as soon as it has been answered. */
  function chooseStyle(input: HTMLInputElement) {
    writeMovementStyle(MORAFFS_WORLD_MAP.id, style);
    input.blur();
  }

  /** A key on its way to the game. Under Dungeons of the Unforgiven's arrows the up arrow steps
   *  the way the character faces and the other three turn them where they stand. */
  function press(key: number) {
    const playing = session;
    if (!playing) return;
    const arrow = style === MORAFFS_WORLD_MAP.id ? null : mwFacingArrow(key, playing.game.pc.dir);
    if (!arrow) playing.press(key);
    else if (arrow.step) playing.press(mwStepKey(arrow.dir));
    else mwTurn(playing, arrow.dir);
  }

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
        Moraff's World, played in a browser: the game's own dungeon, its own monsters and its own keys, with the map
        where the 3-D view used to be. The character on the roster is the one who walks, and the game saves them back
        where it would have saved them, so they can go on playing in DOS.
      </p>
      {#if !playable}
        <p class="hint">Load a Moraff's World save or roll a character, and this is where they play.</p>
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
      <!-- The overlays are drawn in the game's own palette entries, the way it draws them. -->
      <div class="map" style:--status-colour={SCREEN_COLOURS[5]}>
        <FloorCanvas
          bind:this={canvas}
          game={MORAFFS_WORLD_MAP}
          rows={view.rows}
          floor={view.place.floor}
          dungeon={view.place.dungeon}
          monsters={view.monsters}
          bounds={FULL_FLOOR}
          you={{ x: view.place.x, y: view.place.y, dir: view.place.dir }}
          focus={{ x: view.place.x, y: view.place.y, cell: PLAY_CELL }}
        />
        {#if corner.lines.length > 0}
          <div class="corner top-left">
            <GameScreen lines={corner.lines} window={cornerWindow} />
          </div>
        {/if}
        <div class="corner top-right">
          {#if view.engaged}
            <div class="monster">
              <MwPortrait monster={view.engaged} floor={view.place.floor} />
              <div class="values top"><GameScreen lines={monsterValues} window={MONSTER_TOP} /></div>
              <div class="values bottom"><GameScreen lines={monsterValues} window={MONSTER_BOTTOM} /></div>
            </div>
          {/if}
          {#if view.prompt}
            <div class="status">{view.prompt}</div>
          {/if}
        </div>
        <div class="bottom-blocks">
          <div class="block" style:flex={MW_STATUS_BLOCK.right}>
            <GameScreen lines={statusLines} window={STATUS_WINDOW} />
          </div>
          <div class="block" style:flex={CHARACTERISTICS_WIDTH}>
            <GameScreen lines={characteristicLines} window={CHARACTERISTICS_WINDOW} />
          </div>
        </div>
        {#if screenTakesOver}
          <div class="overlay"><GameScreen lines={view.screen} /></div>
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
          <span>{view.place.floor === 0 ? 'The surface' : `Floor ${view.place.floor}`}</span>
          <span>Dungeon {view.place.dungeon}</span>
          <span>{view.place.x}, {view.place.y}</span>
          <span>{['North', 'South', 'West', 'East'][view.place.dir]}</span>
        </div>
        <div class="keys">
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
            {#each MW_INTERCEPTED_KEYS as button}
              <button type="button" title={button.label} onclick={() => press(button.key)}>{button.cap}</button>
            {/each}
          </div>
          <div class="key-note">Every key the game reads:</div>
          <div class="key-row">
            {#each MW_KEY_BUTTONS as button}
              <button type="button" title={arrowLabel(style, button.key) ?? button.label} onclick={() => press(button.key)}>{button.cap}</button>
            {/each}
          </div>
        </div>
        <MwPanel game={session.game} {view} />
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
  /* The four corners of the game's own screen, laid over the map the way it lays them over the
     3-D views: the message box top left, the monster faced top right, the character's own block
     bottom left and the characteristics bottom right. */
  .corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  .top-left {
    left: 10px;
    top: 10px;
    width: clamp(240px, 34%, 460px);
  }
  /* The game keeps both blocks on one screen, so they are given the share of the map's width
     they have of its 1600 and come out at the same size. */
  .bottom-blocks {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: flex;
    gap: 6px;
    pointer-events: none;
  }
  .block {
    min-width: 0;
  }
  .top-right {
    right: 10px;
    top: 10px;
    align-items: flex-end;
    width: clamp(180px, 26%, 330px);
  }
  .monster {
    position: relative;
    width: 100%;
  }
  /* The strips FUN_2000_8728 clears before it prints, so that white on a light monster reads. */
  .values {
    position: absolute;
    left: 0;
    right: 0;
  }
  .values.top {
    top: 0;
  }
  .values.bottom {
    bottom: 0;
  }
  .values :global(.screen) {
    background: rgba(0, 0, 0, 0.55);
    border: none;
    border-radius: 0;
  }
  /* FUN_2000_a9bd (WORLD.EXE 2000:a9bd) prints this one in colour 5. */
  .status {
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.8);
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.1;
    text-align: right;
    color: var(--status-colour);
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
  .over-box button,
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
