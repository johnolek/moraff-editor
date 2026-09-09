<script lang="ts">
  import type { MapSquare } from '../map/game';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import type { Rgb } from '../game/dotu-pic.js';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette, townPalette } from '../bestiary/pictures';
  import { battleSpellLines } from '../game/port/screens';
  import type { Game, ScreenLine, ScreenRect } from '../game/port/state';
  import type { DiscoveredMap } from '../map/draw-floor';
  import type { Point } from '../map/viewport';
  import { SeededRng } from '../game/port/rng';
  import { facingArrowCells } from '../map/you';
  import { debugMonsterLines } from './debug-screen';
  import { dotuMonsterThumbnail } from './monster-thumbnails';
  import { onScreen } from '../ui/on-screen.svelte';
  import { inRect } from './screens';
  import { zoomMapMonsterAt } from './zoom-monsters';
  import type { KilledOnScreen } from './engine';
  import {
    ARROW_DARK_COLOUR,
    ARROW_FLASH_MS,
    ARROW_LIT_COLOUR,
    clearScreenRect,
    drawExpandedMap,
    drawScreenFurniture,
    expandedMapWindow,
    EXPANDED_CENTRE,
    FACING_ARROW_RECT,
    fillScreenBox,
    keyMenuLines,
    MESSAGE_BOX,
    SCREEN_PIXELS,
    SCREEN_WINDOW,
    statusLines,
    UNFORGIVEN_ZOOM_MAP,
  } from './display';
  import type { PlaqueState } from './engine';
  import { fadedPalette, fadeSteps, FADE_STEP_MS, type Fade } from './fade';
  import {
    blankPlaque,
    cycleGradientBank,
    drawPlaque,
    GRADIENT_STEPS_PER_SECOND,
    holdsGradientBank,
  } from './plaque';
  import { BOSS_OFFICE_PANEL, drawBossOffice, type BossOffice } from './boss-office';
  import { drawBuilding, type TownBuilding } from './building';
  import { drawSectionScreen, type SectionScreen } from './section-screen';
  import { drawTablet } from './tablet';
  import { buildingPictures, viewPictures } from './view3d/browser';
  import { framePainter } from './view3d/canvas';
  import { newFrame, type Frame } from './view3d/frame';
  import { renderFourViews, type KilledMonster, type ViewMonster } from './view3d/render';
  import { drawDotuScreenText } from './view3d/text';
  import { viewLabels } from './view3d/views';

  interface Props {
    /** The game itself, for the numbers the standing screen prints every turn. */
    game: Game;
    rows: MapSquare[][];
    /** Where the character stands, and which way. */
    place: { x: number; y: number; floor: number; module: number; dir: number };
    /** The monsters stocked on the floor; the views draw the ones they can see. */
    monsters: StockedMonster[];
    /** The message box: its eight lines and whatever the game drew on the bar above them. */
    box: ScreenLine[];
    /** A screen the game has taken the whole display over with, at its own coordinates. */
    screen: ScreenLine[];
    /** How much of the display that screen was drawn on black, or null for the whole of it. */
    screenCleared?: ScreenRect | null;
    /** The map the character has discovered, which is all the zoom map draws. */
    discovered: DiscoveredMap;
    /** The monsters marked on the zoom map, which is every one on the floor in debug mode and
     *  none at all in the modes that show only what the game showed. */
    mapMonsters?: StockedMonster[];
    /** The kind of monster picked out of debug mode's list, every one of which the zoom map
     *  rings, or null while nothing is picked. */
    highlightMonsterId?: string | null;
    /** The squares of the route debug mode is drawing, which the zoom map dots. */
    routeSquares?: Point[];
    /** Whether the numbers the game never prints are printed over the views, which is debug
     *  mode's own doing. */
    debug?: boolean;
    /** Told which monster a click on the zoom map landed on, for the tab to open its details.
     *  Only debug mode marks them, so in the other two modes nothing is ever found. */
    onmonster?: (monster: StockedMonster) => void;
    /** The HIT U/D box, where draw_ladder_prompt puts it. */
    prompt: ScreenLine[] | null;
    /** The monster the skull is standing over, or null when nothing has just been killed. */
    killed?: KilledOnScreen | null;
    /** Which drawing of the four views this is, which mirrors the monster ahead. */
    viewsDrawn?: number;
    /** The X key's map is filling the screen, which is drawn instead of everything else. */
    expandedMap?: boolean;
    /** The four lines of the stone tablet the snake's words are read on, or null when none is up. */
    tablet?: string[] | null;
    /** The S key's screen, or null when it is not up: the section's monsters in their panels. */
    sectionScreen?: SectionScreen | null;
    /** The town building the character is inside, whose picture stands over the views, or null. */
    buildingScreen?: TownBuilding | null;
    /** The section whose Shadow boss is taunting the character, or null when none is
     *  (`boss-office.ts`): its picture stands in a panel over the views. */
    bossOffice?: BossOffice | null;
    /** The HIT ANY KEY plaque while a message box's wait is running, or null (`plaque.ts`). */
    plaque?: PlaqueState | null;
    /** The palette fade running over the screen (`fade.ts`), or null when none is. */
    fade?: Fade | null;
    /** How long a new screen takes to appear, in milliseconds, revealed from the top down the
     *  way a slow machine drew one (`mode.ts`). Nothing at all draws it in one go. */
    redraw?: number;
  }

  let {
    game,
    rows,
    place,
    monsters,
    box,
    screen,
    screenCleared = null,
    discovered,
    prompt,
    mapMonsters = [],
    highlightMonsterId = null,
    routeSquares = [],
    debug = false,
    onmonster,
    killed = null,
    viewsDrawn = 0,
    expandedMap = false,
    tablet = null,
    sectionScreen = null,
    buildingScreen = null,
    bossOffice = null,
    plaque = null,
    fade = null,
    redraw = 0,
  }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);
  /** Whether the tab the screen is on is the one showing, since the tabs all stay mounted and
   *  neither the arrow's timer nor the two animations below is worth running behind one. */
  const visible = onScreen(() => canvas);
  /** The screen's own painter, so every repaint writes over the same RGBA buffer. */
  const painter = framePainter(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
  let arrowCanvas = $state.raw<HTMLCanvasElement | null>(null);
  /** The screen as it was last painted, for the palette crawl and the fades to work from, with
   *  whether anything on it is drawn out of the gradient bank the crawl turns. */
  let painted = $state.raw<{ frame: Frame; palette: Rgb[]; crawls: boolean } | null>(null);
  /**
   * How far the gradient bank has been turned (`plaque.ts`), which carries across every repaint.
   *
   * The original never puts the bank back: it turns while the game waits and stays where it was
   * left while a key is handled. Counting from zero for each screen instead would snap the walls
   * and the teleporter faces back to their starting colours on every keypress.
   */
  let crawlStep = 0;
  /** How long this screen takes to appear: the player's choice, and nothing at all behind a tab
   *  nobody is looking at, where a wipe would be drawing for no one. */
  const revealed = $derived(visible.showing ? redraw : 0);

  const section = $derived(sectionInfo(place.module, place.floor));
  const part = $derived(section?.part ?? 1);
  const height = $derived(game.pc.height);
  /** What a screen whose own fill the port does not know blacks out, which is all of it. */
  const WHOLE_DISPLAY: ScreenRect = { x: 0, y: 0, right: SCREEN_WINDOW.width, bottom: SCREEN_WINDOW.height };

  /**
   * The rectangle a screen that is up has been drawn on black, and null when none is up.
   *
   * The boss's taunt is the one screen that wipes nothing at all: its three lines are drawn
   * straight over the play screen (`boss-office.ts`), so they do not mean the display has been
   * taken over.
   */
  const cleared = $derived(
    screen.length === 0 || bossOffice ? null : (screenCleared ?? WHOLE_DISPLAY),
  );

  // Walking into a building raises DS:2505 and calls set_palette again (exe 2000:c9ac), which
  // copies the two shop tables over the banks the building picture is drawn out of.
  const palette = $derived(
    buildingScreen
      ? townPalette(place.module + 1, part, game.colourSetting)
      : sectionPalette(place.module + 1, part, game.colourSetting),
  );

  /**
   * Whether the little map is on the screen with `movecontrol` waiting for a key over it, which
   * is the only time the game flashes the arrow on it.
   *
   * Every screen that takes the display over covers the map, and so does the wait a message box
   * asks for: the plaque's own poll is `FUN_2000_2a2e` (exe 2000:2a2e) and the arrow is not in it.
   */
  const arrowFlashing = $derived(
    !tablet &&
      !sectionScreen &&
      !expandedMap &&
      !buildingScreen &&
      !bossOffice &&
      cleared === null &&
      !plaque,
  );

  /**
   * Whether the map the monsters are marked on is the one on the screen, which is what a click
   * can be about. Every screen that takes the display over covers it.
   */
  const mapShowing = $derived(
    expandedMap || (!tablet && !sectionScreen && !buildingScreen && cleared === null),
  );

  /**
   * Which monster a click landed on, if any.
   *
   * The canvas is the game's own 1024 by 768 screen scaled to whatever room the column has, so a
   * click is scaled back to those pixels and read off the map — the corner one, or the whole
   * floor while the X key's map is up.
   */
  function onpointerup(event: PointerEvent): void {
    if (!onmonster || !mapShowing || mapMonsters.length === 0) return;
    const box = (event.currentTarget as HTMLCanvasElement).getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const at = {
      x: ((event.clientX - box.left) / box.width) * SCREEN_PIXELS.width,
      y: ((event.clientY - box.top) / box.height) * SCREEN_PIXELS.height,
    };
    const window = expandedMap ? expandedMapWindow() : UNFORGIVEN_ZOOM_MAP.window(SCREEN_PIXELS);
    const found = zoomMapMonsterAt(window, expandedMap ? EXPANDED_CENTRE : place, mapMonsters, at);
    if (found) onmonster(found);
  }

  /**
   * Everything the tab paints afresh every pass. None of these is a line the game has printed —
   * it draws them itself, and puts them back when movecontrol comes round — so the wipe a screen
   * makes cannot take them off the way it takes a printed line off. The tab leaves out the ones
   * that stand where the wipe reached instead.
   */
  const standing = $derived(
    // Walking into a town building blanks the whole display (erase_menu_block, exe 4000:42b4,
    // fills it with colour 0) and movecontrol is not running to put any of this back, so the only
    // words on the screen are the ones the building itself printed.
    buildingScreen
      ? box
      : [
          ...keyMenuLines(),
          ...battleSpellLines(game),
          ...statusLines(game.pc),
          ...viewLabels(game.pc.exp, height),
          ...box,
          ...(prompt ?? []),
        ],
  );

  /**
   * What is standing over the lines the tab draws of its own accord: the black a screen was drawn
   * on, or the panel the boss's taunt lays down over the key menu.
   */
  const covered = $derived(cleared ?? (bossOffice ? BOSS_OFFICE_PANEL : null));

  const text = $derived([
    ...(covered === null ? standing : standing.filter((line) => !inRect(covered, line))),
    ...screen,
    ...(debug ? debugMonsterLines(game) : []),
  ]);

  const viewMonster = (monster: { x: number; y: number; monsterId: string }): ViewMonster | null => {
    const entry = monsterById(monster.monsterId);
    if (!entry) return null;
    return {
      x: monster.x,
      y: monster.y,
      picnum: entry.picnum,
      builtin: entry.origin.kind === 'builtin',
      colour: entry.color,
      colorSet: entry.colorSet,
    };
  };

  const drawn = $derived.by((): ViewMonster[] =>
    monsters.flatMap((monster) => {
      const one = viewMonster(monster);
      return one ? [one] : [];
    }),
  );

  const skull = $derived.by((): KilledMonster | null => {
    if (!killed) return null;
    // The square it stood on is not read: the skull goes into the rectangle its picture was
    // drawn in, which the direction alone names.
    const one = viewMonster({ x: 0, y: 0, monsterId: killed.monsterId });
    return one ? { dir: killed.dir, monster: one } : null;
  });

  /**
   * Everything the frame is drawn from that is plain data, as one string.
   *
   * The tab is handed a fresh view for every key the game takes, including the ones that change
   * nothing on the screen: a key the game has no handler for, a step into a wall, a second look
   * at a screen already up. Rebuilding the whole 1024 by 768 frame for one of those costs as much
   * as rebuilding it for a step, so what would be drawn is compared with what is on the canvas
   * first. The floor and the discovered map are not in here because both keep their identity
   * while they are unchanged, so they are compared as they are.
   */
  const drawnFrom = $derived(
    JSON.stringify({
      place,
      text,
      box,
      drawn,
      skull,
      mapMonsters,
      highlightMonsterId,
      routeSquares,
      viewsDrawn,
      expandedMap,
      debug,
      tablet,
      sectionScreen,
      buildingScreen,
      bossOffice,
      plaque,
      fade,
      cleared,
      height,
      colourSetting: game.colourSetting,
    }),
  );

  /** What the canvas is showing, so the effect below can tell that nothing has changed. */
  let onCanvas: { drawnFrom: string; rows: MapSquare[][]; discovered: DiscoveredMap } | null = null;

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    if (onCanvas?.drawnFrom === drawnFrom && onCanvas.rows === rows && onCanvas.discovered === discovered) return;
    onCanvas = { drawnFrom, rows, discovered };

    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
    const floor = {
      rows,
      at: { x: place.x, y: place.y, dir: place.dir },
      map: discovered,
      monsters: mapMonsters,
      thumbnail: dotuMonsterThumbnail,
      highlight: highlightMonsterId,
      route: routeSquares,
    };
    const paint = (): void => {
      // The plaque goes over everything else on the screen, whichever of them is up: FUN_2000_4054
      // (exe 2000:4054) draws it where it stands rather than clearing anything first.
      if (plaque === 'blanked') blankPlaque(frame, SCREEN_PIXELS);
      if (plaque === 'showing') drawPlaque(frame, SCREEN_PIXELS, viewPictures(section?.section ?? 1).wall);
      // Walking into a building raises DS:2505 and calls set_palette again (exe 2000:c9ac), which
      // copies the two shop tables over the banks the building picture is drawn out of.
      // A fade's first step is drawn here so that nothing of the screen shows at full strength
      // before the animation below has its first frame.
      // Neither a fade nor the plaque going up is revealed a row at a time: the fade repaints the
      // whole screen many times a second below, and a plaque is a corner of the screen changing
      // rather than a screen arriving. The crawl repaints too, and waits a wipe out instead.
      const animated = fade !== null || plaque === 'showing';
      const crawls = holdsGradientBank(frame);
      const shown =
        fade !== null
          ? fadedPalette(palette, fade, 0)
          : crawls
            ? cycleGradientBank(palette, crawlStep)
            : palette;
      painter.reveal(context, frame, shown, animated ? 0 : revealed);
      painted = { frame, palette, crawls };
    };
    // The stone tablet the snake's words are read on (exe 3000:9026), which is a screen of its own:
    // the slab and its four lines and nothing else.
    if (tablet) {
      drawTablet(frame, SCREEN_PIXELS, tablet, viewPictures(section?.section ?? 1).wall);
      paint();
      return;
    }
    // The S key's screen (monster_manual, exe 3000:c39d): the section's five monsters in their
    // panels and the slab its words are read off, with the lines the manual printed over them.
    if (sectionScreen) {
      drawSectionScreen(frame, SCREEN_PIXELS, sectionScreen, viewPictures(sectionScreen.section));
      drawDotuScreenText(frame, SCREEN_PIXELS, text);
      paint();
      return;
    }
    // The X key's map is a fill over the whole screen with the floor drawn on it (exe 2000:d341),
    // so the views and the boxes around them are not drawn at all while it is up.
    if (expandedMap) {
      drawExpandedMap(frame, floor);
      drawDotuScreenText(frame, SCREEN_PIXELS, text);
      paint();
      return;
    }
    // The coin flip that mirrors the monster ahead (exe 3000:2323), drawn from the number of the
    // drawing rather than from the game's own generator: a run has to replay exactly, and the tab
    // redraws the screen far more often than the loop draws the views. Seeded here, so every
    // redraw between two drawings gets the same four flips and the monster being fought stands
    // the way round it was.
    const flips = new SeededRng(viewsDrawn);
    // A building takes the display over: the views and the boxes around them were wiped on the way
    // in, and every message box the building prints fills its own background again (exe 2000:2820).
    if (buildingScreen) {
      drawBuilding(frame, SCREEN_PIXELS, buildingScreen, {
        building: buildingPictures(buildingScreen.file),
        wall: viewPictures(section?.section ?? 1).wall,
      });
      if (box.length > 0) fillScreenBox(frame, MESSAGE_BOX);
      drawDotuScreenText(frame, SCREEN_PIXELS, text);
      paint();
      return;
    }
    renderFourViews(
      frame,
      {
        rows,
        at: { x: place.x, y: place.y },
        floor: place.floor,
        module: place.module,
        moduleCarried: place.module,
        pictures: viewPictures(section?.section ?? 1),
        detail: 0,
        screen: SCREEN_PIXELS,
        videoClass: 2,
        horizonWeight: height,
        dir: place.dir,
        monsters: drawn,
        water: [4, 8, 20].includes(section?.section ?? 0),
        killed: skull,
        random: () => flips.rand() / 0x8000,
      },
      place.dir,
    );
    drawScreenFurniture(frame, floor);
    // The boss's taunt stands on the play screen: boss_office_message (exe 3000:6c9d) wipes
    // nothing before it lays the panel down, so the views are still underneath it.
    if (bossOffice) drawBossOffice(frame, SCREEN_PIXELS, bossOffice, viewPictures(bossOffice.section));
    // A screen that takes the display over fills the rectangle it draws in with colour 0 first:
    // FUN_3000_7dfc (exe 3000:7dfc) fills its two columns that way and cast_a_spell the top of
    // the screen its spell table stands on. A screen whose rectangle the port does not know
    // blacks the whole display out instead.
    if (cleared) clearScreenRect(frame, cleared);
    drawDotuScreenText(frame, SCREEN_PIXELS, text);
    paint();
  });

  /**
   * A screen going off the page part-drawn is shown whole at once, the same rule the animations
   * below keep: a wipe left half-finished behind a hidden tab would be what the player came back
   * to.
   */
  $effect(() => {
    if (!visible.showing) painter.finish();
  });

  /**
   * The arrow on the little map flashing (`display.ts` for the period and the two colours).
   *
   * It is a canvas of its own over the arrow's own seven by seven pixels rather than a second
   * whole-frame animation beside the plaque's: nothing else on the screen changes with it, and
   * repainting a 1024 by 768 frame three times a second to turn seven pixels over is not worth
   * the work. Redrawing the arrow in colour 0 is what the game itself does, so a square with a
   * town building on it keeps its own colour around the dark half.
   */
  $effect(() => {
    const target = arrowCanvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    const size = FACING_ARROW_RECT.size;
    const cells = facingArrowCells(place.dir);
    const colours = [ARROW_LIT_COLOUR, ARROW_DARK_COLOUR].map((entry) => {
      const [r, g, b] = palette[entry] ?? [0, 0, 0];
      return `rgb(${r} ${g} ${b})`;
    });
    let lit = 0;
    const draw = (): void => {
      context.clearRect(0, 0, size, size);
      context.fillStyle = colours[lit];
      for (const cell of cells) context.fillRect(cell.x, cell.y, 1, 1);
    };
    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = (): void => {
      if (timer !== null) clearInterval(timer);
      timer = null;
    };
    const showing = visible.showing;
    // A tab nobody is looking at is not worth a timer, and a browser throttles one anyway.
    const follow = (): void => {
      stop();
      if (document.hidden || !showing) return;
      timer = setInterval(() => {
        lit = 1 - lit;
        draw();
      }, ARROW_FLASH_MS);
    };
    draw();
    follow();
    document.addEventListener('visibilitychange', follow);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', follow);
    };
  });

  /**
   * A screen fading in or out (`fade.ts`), which is the same repaint the plaque's crawl is: the
   * frame is drawn again in a palette stepped toward or away from black. The step is worked out
   * from the clock rather than counted per animation frame, so the fade takes the time the
   * game's own 7 ms delays take however often the browser draws.
   *
   * A CSS transition on the canvas would be cheaper and would not look the same: the DAC steps
   * every component by one, so a dim colour is gone long before a bright one and the picture
   * falls away to its highlights rather than dimming evenly.
   */
  $effect(() => {
    const holding = painted;
    const running = fade;
    const target = canvas;
    if (!holding || !target || running === null || !visible.showing) return;
    const context = target.getContext('2d');
    if (!context) return;
    const started = performance.now();
    const last = fadeSteps(running);
    let request = 0;
    const tick = (now: number): void => {
      const step = Math.min(last, Math.floor((now - started) / FADE_STEP_MS));
      painter.paint(context, holding.frame, fadedPalette(holding.palette, running, step));
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  });

  /**
   * The gradient bank crawling, which is what the game does with every poll of the keyboard:
   * movecontrol turns it once each time round the loop it waits for a key in (exe 2000:c308),
   * FUN_2000_2a2e once per poll behind a message box's plaque (exe 2000:2a2e), and FUN_2000_2d93
   * once per poll while a menu waits for its choice (exe 2000:2d93). The rotation is of the
   * palette, so everything painted in entries 96 to 255 moves together — a teleporter's face, the
   * distance shading on the walls, the plaque's own frame — and it stops as soon as a key is
   * handled, because the game is drawing rather than waiting.
   *
   * The port repaints the whole screen in the turned palette, so it only runs where the frame has
   * a pixel out of the bank on it, and paces the turns off the clock rather than making one per
   * frame the browser draws. A hidden tab draws no frames, so the crawl stops with it.
   */
  $effect(() => {
    const holding = painted;
    const target = canvas;
    if (!holding?.crawls || !target || fade !== null || !visible.showing) return;
    const context = target.getContext('2d');
    if (!context) return;
    let last = performance.now();
    let request = 0;
    const tick = (now: number): void => {
      request = requestAnimationFrame(tick);
      // A screen still being revealed a row at a time is left to finish: painting the whole of it
      // here would show the rest of it the moment the wipe started.
      if (painter.wiping) {
        last = now;
        return;
      }
      const steps = Math.floor(((now - last) * GRADIENT_STEPS_PER_SECOND) / 1000);
      if (steps === 0) return;
      last += (steps * 1000) / GRADIENT_STEPS_PER_SECOND;
      crawlStep += steps;
      painter.paint(context, holding.frame, cycleGradientBank(holding.palette, crawlStep));
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  });
</script>

<!-- The game's screen: the four views, the boxes around them and the game's own lines of text. -->
<div class="screen" style:aspect-ratio="{SCREEN_PIXELS.width} / {SCREEN_PIXELS.height}">
  <canvas
    class="screen-pixels"
    bind:this={canvas}
    width={SCREEN_PIXELS.width}
    height={SCREEN_PIXELS.height}
    {onpointerup}
  ></canvas>
  {#if arrowFlashing}
    <canvas
      class="arrow"
      bind:this={arrowCanvas}
      width={FACING_ARROW_RECT.size}
      height={FACING_ARROW_RECT.size}
      style:left="{(FACING_ARROW_RECT.x / SCREEN_PIXELS.width) * 100}%"
      style:top="{(FACING_ARROW_RECT.y / SCREEN_PIXELS.height) * 100}%"
      style:width="{(FACING_ARROW_RECT.size / SCREEN_PIXELS.width) * 100}%"
      style:height="{(FACING_ARROW_RECT.size / SCREEN_PIXELS.height) * 100}%"
    ></canvas>
  {/if}
</div>

<style>
  .screen {
    position: relative;
    width: 100%;
    background: #000;
  }
  canvas {
    display: block;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
  }
  canvas.screen-pixels {
    width: 100%;
    height: 100%;
  }
  /* The arrow on the little map: its corner and its size are the seven pixels it stands in, as
     fractions of the same box the screen's own canvas fills. */
  canvas.arrow {
    position: absolute;
  }
</style>
