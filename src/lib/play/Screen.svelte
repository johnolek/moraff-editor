<script lang="ts">
  import type { MapSquare } from '../map/game';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette } from '../bestiary/pictures';
  import { battleSpellLines } from '../game/port/screens';
  import type { Game, ScreenLine, ScreenRect } from '../game/port/state';
  import type { DiscoveredMap } from '../map/draw-floor';
  import { SeededRng } from '../game/port/rng';
  import { debugMonsterLines } from './debug-screen';
  import { inRect } from './screens';
  import type { KilledOnScreen } from './engine';
  import {
    clearScreenRect,
    drawExpandedMap,
    drawScreenFurniture,
    keyMenuLines,
    SCREEN_PIXELS,
    SCREEN_WINDOW,
    statusLines,
  } from './display';
  import { drawSectionScreen, type SectionScreen } from './section-screen';
  import { drawTablet } from './tablet';
  import { viewPictures } from './view3d/browser';
  import { newFrame, toRgba } from './view3d/frame';
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
  }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  const section = $derived(sectionInfo(place.module, place.floor));
  const part = $derived(section?.part ?? 1);
  const height = $derived(game.pc.height);
  /** What a screen whose own fill the port does not know blacks out, which is all of it. */
  const WHOLE_DISPLAY: ScreenRect = { x: 0, y: 0, right: SCREEN_WINDOW.width, bottom: SCREEN_WINDOW.height };

  /** The rectangle a screen that is up has been drawn on black, and null when none is up. */
  const cleared = $derived(screen.length === 0 ? null : (screenCleared ?? WHOLE_DISPLAY));

  /**
   * Everything the tab paints afresh every pass. None of these is a line the game has printed —
   * it draws them itself, and puts them back when movecontrol comes round — so the wipe a screen
   * makes cannot take them off the way it takes a printed line off. The tab leaves out the ones
   * that stand where the wipe reached instead.
   */
  const standing = $derived([
    ...keyMenuLines(),
    ...battleSpellLines(game),
    ...statusLines(game.pc),
    ...viewLabels(game.pc.exp, height),
    ...box,
    ...(prompt ?? []),
  ]);

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
      const rgba = toRgba(frame, sectionPalette(place.module + 1, part, game.colourSetting));
      context.putImageData(new ImageData(rgba, SCREEN_PIXELS.width, SCREEN_PIXELS.height), 0, 0);
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
</script>

<!-- The game's screen: the four views, the boxes around them and the game's own lines of text. -->
<div class="screen" style:aspect-ratio="{SCREEN_PIXELS.width} / {SCREEN_PIXELS.height}">
  <canvas bind:this={canvas} width={SCREEN_PIXELS.width} height={SCREEN_PIXELS.height}></canvas>
</div>

<style>
  .screen {
    width: 100%;
    background: #000;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
  }
</style>
