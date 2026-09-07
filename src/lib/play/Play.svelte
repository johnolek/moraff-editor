<script lang="ts">
  import { untrack } from 'svelte';
  import { app, currentEntry } from '../app-state.svelte';
  import { characterDied, replaceCharacterBytes } from '../character/current';
  import { RealRng } from '../game/port/rng';
  import FloorCanvas from '../map/FloorCanvas.svelte';
  import { UNFORGIVEN_MAP } from '../map/game';
  import { FULL_FLOOR } from '../map/viewport';
  import GameScreen from '../ui/GameScreen.svelte';
  import PixelText from '../ui/PixelText.svelte';
  import Panel from './Panel.svelte';
  import Portrait from './Portrait.svelte';
  import { runMoveControl, startGame, type CharacterFile, type GameSession, type PlayView } from './engine';
  import { gameKey, INTERCEPTED_KEYS, KEY_BUTTONS } from './keys';
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
    const started = startGame(file, new RealRng());
    started.onChange = () => (view = started.view());
    centredFloor = null;
    session = started;
    playingId = entry.id;
    view = started.view();
    void runMoveControl(started);
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
    const playing = session;
    if (app.tab !== 'play' || !playing || playing.over) return;
    if (isTyping(event.target)) return;
    const key = gameKey(event);
    if (key === null) return;
    event.preventDefault();
    playing.press(key);
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
          monsters={view.monsters}
          bounds={FULL_FLOOR}
          you={{ x: view.place.x, y: view.place.y }}
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
        <GameScreen lines={view.box} window={BOX_WINDOW} />
        {#if view.banner.length > 0}
          <div class="banner">
            {#each view.banner as line}<div>{line}</div>{/each}
          </div>
        {/if}
        <div class="keys">
          <div class="key-note">The browser takes these, so here they are as buttons:</div>
          <div class="key-row">
            {#each INTERCEPTED_KEYS as button}
              <button type="button" title={button.label} onclick={() => session?.press(button.key)}>{button.cap}</button>
            {/each}
          </div>
          <div class="key-note">Every key the game reads:</div>
          <div class="key-row">
            {#each KEY_BUTTONS as button}
              <button type="button" title={button.label} onclick={() => session?.press(button.key)}>{button.cap}</button>
            {/each}
          </div>
        </div>
        <Portrait
          monster={view.ahead ? view.engaged : null}
          module={view.place.module}
          floor={view.place.floor}
        />
        <Panel game={session.game} {view} />
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
</style>
