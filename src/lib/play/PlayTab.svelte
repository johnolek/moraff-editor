<!--
  The Play tab all three games are played in: the landing page, the map or the game's own screen,
  the switch, the mode radios, the run block and the over-box.

  Everything here is the same wherever the game came from. What is not — the screen itself, the
  numbers each game shows beside it, its panel and the way it reads an arrow — comes in as a
  snippet or as a row of `PLAY_GAMES` (`games.ts`). Each snippet is handed the game as it stands,
  so a wrapper never keeps a copy of the session or the view.
-->
<script lang="ts" generics="View extends PlayViewBase, Session extends PlaySession<View>">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { app, currentEntry, entryById, type Leaderboard } from '../app-state.svelte';
  import { leaderboardLabel, lockedPlayNote } from '../character/leaderboard';
  import type FloorCanvas from '../map/FloorCanvas.svelte';
  import { armSpeaker } from '../speaker';
  import { isTyping } from '../ui/keys';
  import PixelText from '../ui/PixelText.svelte';
  import { downloadMapFiles } from './export-maps';
  import { downloadRunLog } from './export-run';
  import type { PlayGame, PlaySession, PlayStage, PlayViewBase } from './games';
  import { runPlayLoop } from './loop';
  import PlayRoster from './PlayRoster.svelte';
  import ScreenSwitch from './ScreenSwitch.svelte';
  import { actionWords, lastMilestones, milestoneNote, milestoneWords, runLogOf, RUN_GAMES } from './run';
  import {
    colourblindFilter,
    PLAY_MODES,
    readPlayColourblind,
    readPlayDisplay,
    readPlayMode,
    readPlaySound,
    readPlayRedraw,
    writePlayMode,
    type PlayDisplay,
    type PlayMode,
  } from './mode';
  import './play-tab.css';

  type Stage = PlayStage<Session, View>;

  interface Props {
    game: PlayGame<Session, View>;
    /** The map canvas the screen snippet mounts, which the tab keeps centred on the character. */
    canvas?: FloorCanvas | null;
    /** Whether the game's sound is on as play begins; only Moraff's Revenge has such a flag. */
    sound?: boolean;
    /** A key on its way to the game, which each game translates its own way. */
    press: (session: Session, key: number) => void;
    /**
     * A key the tab answers itself before the game sees it, and whether it did. Debug mode's
     * monster details take the keyboard while they are up, and only the two games with such a
     * panel pass this.
     */
    takeKey?: (event: KeyboardEvent) => boolean;
    /** The game's own screen or the top-down map, and whatever the game draws over them. */
    screen: Snippet<[Stage]>;
    /** The spans of the line under the switch saying where the character is standing. */
    place: Snippet<[Stage]>;
    /** Between that line and the run block: Moraff's Revenge's own numbers. */
    afterPlace?: Snippet<[Stage]>;
    /** Between the run block and the keys: Dungeons of the Unforgiven's message box. */
    afterRun?: Snippet<[Stage]>;
    /** Under the mode radios: what each game says about its arrow keys. */
    afterModes: Snippet<[Stage]>;
    /** The foot of the side column: the pictures beside the map and the game's own panel. */
    sideFoot?: Snippet<[Stage]>;
  }

  let {
    game,
    canvas = null,
    sound = readPlaySound(game.id),
    press,
    takeKey,
    screen,
    place,
    afterPlace,
    afterRun,
    afterModes,
    sideFoot,
  }: Props = $props();

  let session = $state.raw<Session | null>(null);
  /** Which character on the roster the session is playing, so an edit to another one is left to
   *  the editor. */
  let playingId = $state.raw<string | null>(null);
  /** The map column, which the Full screen button puts alone on the display. */
  let mapElement = $state.raw<HTMLDivElement | null>(null);
  let view = $state.raw<View | null>(null);
  let centredFloor = $state.raw<number | null>(null);
  /* A tab is mounted for one game and never handed another, so what the browser remembered for
     that game is read once rather than followed. */
  let chosenMode = $state<PlayMode>(untrack(() => readPlayMode(game.id)));
  /**
   * The board the character being played was rolled for, taken as play begins and put down when
   * the game is left. It is taken once rather than read from the roster as the game runs, so that
   * picking another character elsewhere on the site cannot change the mode of a game in progress.
   */
  let lock = $state.raw<Leaderboard | null>(null);
  /** The mode this game is being played in: the board's for a locked character, and the one the
   *  radios were left on for any other. */
  const mode = $derived<PlayMode>(lock ?? chosenMode);
  let display = $state<PlayDisplay>(untrack(() => readPlayDisplay(game.id)));
  let colourblind = $state(untrack(() => readPlayColourblind(game.id)));
  let redraw = $state(untrack(() => readPlayRedraw(game.id)));

  const character = $derived.by(() => {
    void app.characterVersion;
    return currentEntry();
  });
  const playable = $derived(character !== null && character.game === game.id);

  function start() {
    const entry = currentEntry();
    if (!entry) return;
    const started = game.start(entry, sound);
    started.onChange = () => (view = started.view());
    centredFloor = null;
    session = started;
    playingId = entry.id;
    lock = entry.leaderboard;
    view = started.view();
    void runPlayLoop(started, game.loop(started));
  }

  /** Whether the browser will put an element alone on the display at all. */
  const fullscreenAllowed = typeof document !== 'undefined' && document.fullscreenEnabled;

  /**
   * The Keyboard Lock API, which Chromium has and the others do not: with Escape locked while the
   * map is full screen, the key reaches the game instead of leaving full screen (a held Escape
   * still leaves, which is the browser's own rule).
   */
  const keyboardLock = (typeof navigator !== 'undefined' ? navigator : undefined) as
    | (Navigator & { keyboard?: { lock?: (keys?: string[]) => Promise<void>; unlock?: () => void } })
    | undefined;
  const escapeLockable = typeof keyboardLock?.keyboard?.lock === 'function';
  /** Whether the map is alone on the display now. */
  let fullscreen = $state(false);

  async function enterFullscreen() {
    if (!mapElement) return;
    await mapElement.requestFullscreen();
    if (escapeLockable) await keyboardLock?.keyboard?.lock?.(['Escape']).catch(() => undefined);
  }

  function onFullscreenChange() {
    fullscreen = document.fullscreenElement === mapElement;
    if (!fullscreen) keyboardLock?.keyboard?.unlock?.();
  }

  /** Escape for the game, from the button a browser that cannot keep the key gets instead. */
  function pressEscape() {
    if (!session || session.over) return;
    const key = game.gameKey(new KeyboardEvent('keydown', { key: 'Escape' }));
    if (key !== null) press(session, key);
  }

  /** The roller's Play now: the character it kept is current, and the game starts as the tab
   *  opens. */
  $effect(() => {
    const wanted = app.startPlaying;
    if (wanted === null || session || !character || character.id !== wanted) return;
    app.startPlaying = null;
    start();
  });

  function leave() {
    session?.finish();
    session = null;
    playingId = null;
    lock = null;
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
    const at = view === null ? null : game.place(view);
    const showing = app.tab === 'play';
    untrack(() => {
      if (!showing || !at || !canvas) return;
      if (centredFloor !== at.floor) {
        if (canvas.centre(at, game.cell)) centredFloor = at.floor;
      } else {
        canvas.reveal(at);
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
      const at = game.place(playing.view());
      if (canvas && canvas.centre(at, game.cell)) centredFloor = at.floor;
    });
    return () => cancelAnimationFrame(frame);
  });

  function onKeyDown(event: KeyboardEvent) {
    if (app.tab !== 'play') return;
    if (takeKey?.(event)) return;
    if (!session || session.over) return;
    if (isTyping(event.target)) return;
    const key = game.gameKey(event);
    if (key === null) return;
    event.preventDefault();
    // A browser starts audio only from something the player did, so the speaker is opened on the
    // key rather than when the game starts.
    armSpeaker();
    press(session, key);
  }

  /** The mode is picked with the mouse, and the arrow keys belong to the game rather than to a
   *  radio button, so the control hands the keyboard back as soon as it has been answered. A new
   *  mode shows what that mode shows, until the switch says otherwise. */
  function chooseMode(input: HTMLInputElement) {
    writePlayMode(game.id, chosenMode);
    input.blur();
  }

  /** The character being played, which is not always the one being worked on: the save editor
   *  can be pointed at another character while a game is in progress. */
  function playedEntry() {
    return entryById(playingId);
  }

  /** The map files this character would have beside them in the game's own folder. */
  function exportMaps() {
    const playing = session;
    const entry = playedEntry();
    if (playing && entry) downloadMapFiles(game.mapFiles(playing, entry), entry.name);
  }

  /** The character's whole run — every session it has been played in — as a file. */
  function exportRun() {
    const playing = session;
    const entry = playedEntry();
    if (!playing?.run || !entry) return;
    // The run goes into the roster entry after every key, and the game may not have read one
    // since this session began, so it is written down again before it is handed over.
    playing.keepRun();
    downloadRunLog(runLogOf(entry.run));
  }

  /** The game's own words for its clock and for one of its dungeons. */
  const words = $derived(RUN_GAMES[game.id]);
</script>

<svelte:window onkeydown={onKeyDown} onfullscreenchange={onFullscreenChange} />

<div class="play">
  {#if !session || !view}
    <div class="page">
      <h2><PixelText text="Play" scale={2} /></h2>
      <p class="lead">{game.lead}</p>
      {#if !playable}
        <p class="hint">{game.hint}</p>
      {:else}
        {#if character?.dead}
          <p class="hint">{character.name} is dead. Playing on carries on from wherever the game last saved them.</p>
        {/if}
        <div class="row">
          <button type="button" class="go" onclick={start}>Play as {character?.name}</button>
        </div>
      {/if}
      <PlayRoster game={game.id} />
    </div>
  {:else}
    {@const stage = { session, view, mode, display, redraw }}
    <div class="stage">
      <div class="map" bind:this={mapElement} style:filter={colourblindFilter(colourblind)}>
        {@render screen(stage)}
        {#if fullscreen}
          <div class="fullscreen-bar">
            {#if !escapeLockable}
              <button type="button" onclick={pressEscape}>Esc</button>
            {/if}
            <button type="button" onclick={() => void document.exitFullscreen()}>Exit full screen</button>
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
        <div class="switch">
          <ScreenSwitch
            game={game.id}
            bind:display
            bind:colourblind
            bind:redraw
            onfullscreen={fullscreenAllowed ? () => void enterFullscreen() : undefined} />
        </div>
        <div class="place">{@render place(stage)}</div>
        {@render afterPlace?.(stage)}
        <div class="run">
          {#if view.run}
            {@const line = lastMilestones(view.run.milestones)}
            <span class="actions">{actionWords(view.run.actions)}</span>
            {#if line.earlier.length > 0}
              <span
                class="milestone earlier"
                title={line.earlier.map((milestone) => milestoneWords(milestone, words.dungeonName)).join(', ')}
                >+{line.earlier.length} more</span>
            {/if}
            {#each line.shown as milestone}
              <span class="milestone" title={milestoneNote(milestone, words.clockWords(milestone.time))}>
                {milestoneWords(milestone, words.dungeonName)}
              </span>
            {/each}
            <button type="button" onclick={exportRun}>Export run</button>
          {/if}
          <button type="button" onclick={exportMaps}>Export maps</button>
        </div>
        {@render afterRun?.(stage)}
        <div class="keys">
          <div class="key-note">Play mode:</div>
          {#if lock}
            <div class="locked">
              <span>{leaderboardLabel(lock)}</span>
              <span class="how">{lockedPlayNote(lock)}</span>
            </div>
          {:else}
            <div class="styles">
              {#each PLAY_MODES as choice}
                <label>
                  <input
                    type="radio"
                    value={choice.id}
                    bind:group={chosenMode}
                    onchange={(event) => chooseMode(event.currentTarget)} />
                  <span>{choice.label}</span>
                  <span class="how">{choice.how}</span>
                </label>
              {/each}
            </div>
          {/if}
          {@render afterModes(stage)}
        </div>
        {@render sideFoot?.(stage)}
      </aside>
    </div>
  {/if}
</div>
