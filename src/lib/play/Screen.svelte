<script lang="ts">
  import type { MapSquare } from '../map/game';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import type { Rgb } from '../game/dotu-pic.js';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette, townPalette } from '../bestiary/pictures';
  import { battleSpellLines } from '../game/port/screens';
  import type { Game, ScreenLine, ScreenRect } from '../game/port/state';
  import type { DiscoveredMap } from '../map/draw-floor';
  import { SeededRng } from '../game/port/rng';
  import { facingArrowCells } from '../map/you';
  import { debugMonsterLines } from './debug-screen';
  import { inRect } from './screens';
  import type { KilledOnScreen } from './engine';
  import {
    ARROW_DARK_COLOUR,
    ARROW_FLASH_MS,
    ARROW_LIT_COLOUR,
    clearScreenRect,
    drawExpandedMap,
    drawScreenFurniture,
    FACING_ARROW_RECT,
    fillScreenBox,
    keyMenuLines,
    MESSAGE_BOX,
    SCREEN_PIXELS,
    SCREEN_WINDOW,
    statusLines,
  } from './display';
  import type { PlaqueState } from './engine';
  import { blankPlaque, cycleGradientBank, drawPlaque } from './plaque';
  import { drawBuilding, type TownBuilding } from './building';
  import { drawSectionScreen, type SectionScreen } from './section-screen';
  import { drawTablet } from './tablet';
  import { buildingPictures, viewPictures } from './view3d/browser';
  import { newFrame, toRgba, type Frame } from './view3d/frame';
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
    /** Whether the numbers the game never prints are printed over the views, which is debug
     *  mode's own doing. */
    debug?: boolean;
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
    /** The HIT ANY KEY plaque while a message box's wait is running, or null (`plaque.ts`). */
    plaque?: PlaqueState | null;
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
    debug = false,
    killed = null,
    viewsDrawn = 0,
    expandedMap = false,
    tablet = null,
    sectionScreen = null,
    buildingScreen = null,
    plaque = null,
  }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);
  let arrowCanvas = $state.raw<HTMLCanvasElement | null>(null);
  /** The screen as it was last painted, for the plaque's own animation to work from. */
  let painted = $state.raw<{ frame: Frame; palette: Rgb[] } | null>(null);

  const section = $derived(sectionInfo(place.module, place.floor));
  const part = $derived(section?.part ?? 1);
  const height = $derived(game.pc.height);
  /** What a screen whose own fill the port does not know blacks out, which is all of it. */
  const WHOLE_DISPLAY: ScreenRect = { x: 0, y: 0, right: SCREEN_WINDOW.width, bottom: SCREEN_WINDOW.height };

  /** The rectangle a screen that is up has been drawn on black, and null when none is up. */
  const cleared = $derived(screen.length === 0 ? null : (screenCleared ?? WHOLE_DISPLAY));

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
    !tablet && !sectionScreen && !expandedMap && !buildingScreen && cleared === null && !plaque,
  );

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

  const text = $derived([
    ...(cleared === null ? standing : standing.filter((line) => !inRect(cleared, line))),
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

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;

    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
    const floor = {
      rows,
      at: { x: place.x, y: place.y, dir: place.dir },
      map: discovered,
      monsters: mapMonsters,
    };
    const paint = (): void => {
      // The plaque goes over everything else on the screen, whichever of them is up: FUN_2000_4054
      // (exe 2000:4054) draws it where it stands rather than clearing anything first.
      if (plaque === 'blanked') blankPlaque(frame, SCREEN_PIXELS);
      if (plaque === 'showing') drawPlaque(frame, SCREEN_PIXELS, viewPictures(section?.section ?? 1).wall);
      // Walking into a building raises DS:2505 and calls set_palette again (exe 2000:c9ac), which
      // copies the two shop tables over the banks the building picture is drawn out of.
      const rgba = toRgba(frame, palette);
      context.putImageData(new ImageData(rgba, SCREEN_PIXELS.width, SCREEN_PIXELS.height), 0, 0);
      painted = plaque === 'showing' ? { frame, palette } : null;
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
    // A screen that takes the display over fills the rectangle it draws in with colour 0 first:
    // FUN_3000_7dfc (exe 3000:7dfc) fills its two columns that way and cast_a_spell the top of
    // the screen its spell table stands on. A screen whose rectangle the port does not know
    // blacks the whole display out instead.
    if (cleared) clearScreenRect(frame, cleared);
    drawDotuScreenText(frame, SCREEN_PIXELS, text);
    paint();
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
    // A tab nobody is looking at is not worth a timer, and a browser throttles one anyway.
    const follow = (): void => {
      stop();
      if (document.hidden) return;
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
   * The plaque's frame crawling: FUN_2000_2a2e (exe 2000:2a2e) turns the palette's gradient bank
   * once for every poll of the keyboard while it waits, and everything drawn in that bank crawls
   * with it, the distance shading on the walls as much as the plaque's frame. The port turns it
   * once a frame the browser draws and repaints the whole screen in the turned palette, which is
   * what the game's own display shows.
   */
  $effect(() => {
    const holding = painted;
    const target = canvas;
    if (!holding || !target) return;
    const context = target.getContext('2d');
    if (!context) return;
    let steps = 0;
    let request = 0;
    const tick = (): void => {
      steps += 1;
      const turned = cycleGradientBank(holding.palette, steps);
      context.putImageData(new ImageData(toRgba(holding.frame, turned), SCREEN_PIXELS.width, SCREEN_PIXELS.height), 0, 0);
      request = requestAnimationFrame(tick);
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
