<script lang="ts">
  import type { MapSquare } from '../map/game';
  import { monsterById, type StockedMonster } from '../map/stocking';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette } from '../bestiary/pictures';
  import { battleSpellLines } from '../game/port/screens';
  import type { Game, ScreenLine } from '../game/port/state';
  import type { DiscoveredMap } from '../map/draw-floor';
  import GameScreen from '../ui/GameScreen.svelte';
  import { debugMonsterLines } from './debug-screen';
  import { drawScreenFurniture, keyMenuLines, SCREEN_PIXELS, SCREEN_WINDOW, statusLines } from './display';
  import { viewPictures } from './view3d/browser';
  import { newFrame, toRgba } from './view3d/frame';
  import { renderFourViews, type ViewMonster } from './view3d/render';
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
  }

  let { game, rows, place, monsters, box, screen, discovered, prompt, mapMonsters = [], debug = false }: Props = $props();

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

  const drawn = $derived.by((): ViewMonster[] =>
    monsters.flatMap((monster) => {
      const entry = monsterById(monster.monsterId);
      if (!entry) return [];
      return [
        {
          x: monster.x,
          y: monster.y,
          picnum: entry.picnum,
          builtin: entry.origin.kind === 'builtin',
          colour: entry.color,
          colorSet: entry.colorSet,
        },
      ];
    }),
  );

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;

    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
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
      },
      place.dir,
    );
    drawScreenFurniture(frame, {
      rows,
      at: { x: place.x, y: place.y, dir: place.dir },
      known: (x, y) => discovered.known(x, y),
      monsters: mapMonsters,
    });
    const rgba = toRgba(frame, sectionPalette(place.module + 1, part));
    context.putImageData(new ImageData(rgba, SCREEN_PIXELS.width, SCREEN_PIXELS.height), 0, 0);
  });
</script>

<div class="screen">
  <canvas bind:this={canvas} width={SCREEN_PIXELS.width} height={SCREEN_PIXELS.height}></canvas>
  <div class="text"><GameScreen lines={text} window={SCREEN_WINDOW} /></div>
</div>

<style>
  .screen {
    position: relative;
    width: 100%;
    aspect-ratio: 640 / 480;
    background: #000;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
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
