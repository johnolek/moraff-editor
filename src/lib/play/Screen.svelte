<script lang="ts">
  import type { MapSquare } from '../map/game';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette } from '../bestiary/pictures';
  import { battleSpellLines } from '../game/port/screens';
  import type { Game, ScreenLine } from '../game/port/state';
  import type { DiscoveredMap } from '../map/draw-floor';
  import GameScreen from '../ui/GameScreen.svelte';
  import { SeededRng } from '../game/port/rng';
  import { debugMonsterLines } from './debug-screen';
  import type { KilledOnScreen } from './engine';
  import { drawScreenFurniture, keyMenuLines, SCREEN_PIXELS, SCREEN_WINDOW, statusLines } from './display';
  import { viewPictures } from './view3d/browser';
  import { newFrame, toRgba } from './view3d/frame';
  import { renderFourViews, type KilledMonster, type ViewMonster } from './view3d/render';
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
  }

  let {
    game,
    rows,
    place,
    monsters,
    box,
    screen,
    discovered,
    prompt,
    mapMonsters = [],
    debug = false,
    killed = null,
    viewsDrawn = 0,
  }: Props = $props();

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  const section = $derived(sectionInfo(place.module, place.floor));
  const part = $derived(section?.part ?? 1);
  const height = $derived(game.pc.height);
  const text = $derived([
    ...keyMenuLines(),
    ...battleSpellLines(game),
    ...statusLines(game.pc),
    ...viewLabels(game.pc.exp, height),
    ...box,
    ...(prompt ?? []),
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
    // The coin flip that mirrors the monster ahead (exe 3000:2323), drawn from the pass number
    // rather than from the game's own generator: a run has to replay exactly, and the tab redraws
    // the screen far more often than the loop draws the views. Seeded here, so a redraw within
    // one pass gets the same four flips and the picture stands still while the player reads.
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
    drawScreenFurniture(frame, {
      rows,
      at: { x: place.x, y: place.y, dir: place.dir },
      known: (x, y) => discovered.known(x, y),
      monsters: mapMonsters,
    });
    const rgba = toRgba(frame, sectionPalette(place.module + 1, part, game.colourSetting));
    context.putImageData(new ImageData(rgba, SCREEN_PIXELS.width, SCREEN_PIXELS.height), 0, 0);
  });
</script>

<div class="screen" style:aspect-ratio="{SCREEN_PIXELS.width} / {SCREEN_PIXELS.height}">
  <canvas bind:this={canvas} width={SCREEN_PIXELS.width} height={SCREEN_PIXELS.height}></canvas>
  <!-- A screen that takes the display over fills the rectangles it draws in with colour 0 before
       it draws them: FUN_3000_7dfc (exe 3000:7dfc) fills its two columns that way. Which
       rectangles each of them fills is not in the port, so the whole screen goes black behind
       one. -->
  {#if screen.length > 0}
    <div class="cleared"></div>
  {/if}
  <div class="text"><GameScreen lines={text} window={SCREEN_WINDOW} /></div>
</div>

<style>
  .screen {
    position: relative;
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
  .cleared {
    position: absolute;
    inset: 0;
    background: #000;
  }
  .text {
    position: absolute;
    inset: 0;
  }
  /* The text lies over the drawing, so it brings no background or border of its own. */
  .text :global(.screen) {
    height: 100%;
    background: none;
    border: none;
    border-radius: 0;
  }
</style>
