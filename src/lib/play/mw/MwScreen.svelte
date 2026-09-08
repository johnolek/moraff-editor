<script lang="ts">
  import type { DiscoveredMap } from '../../map/draw-floor';
  import type { MapSquare } from '../../map/game';
  import type { StockedMonster } from '../../map/stocking';
  import { MONSTERS } from '../../mw-bestiary/monsters';
  import { floorPalette } from '../../mw-bestiary/pictures';
  import type { ScreenLine } from '../../game/port/state';
  import GameScreen from '../../ui/GameScreen.svelte';
  import { fillRect, newFrame, toRgba, type Frame } from '../view3d/frame';
  import { mwViewPictures } from './view3d/browser';
  import { mwHorizonWeight } from './view3d/geometry';
  import { renderMwView, type MwViewMonster, type MwViewScene } from './view3d/render';
  import {
    MW_COLOURS,
    MW_KEY_MENU_RECT,
    MW_MAP_CELL,
    MW_MAP_COLUMNS,
    MW_MAP_LEFT,
    MW_MAP_ROWS,
    MW_MAP_TOP_PIXELS,
    MW_MESSAGE_BOX_RECT,
    MW_SCREEN_PIXELS,
    MW_SCREEN_UNITS_X,
    MW_SCREEN_UNITS_Y,
    MW_VIEWS,
    MW_WHOLE_SCREEN_VIEW,
  } from './view3d/screen';

  interface Props {
    rows: MapSquare[][];
    /** Where the character stands. The game has no facing: all four views are compass ones. */
    place: { x: number; y: number; floor: number; dungeon: number };
    /** The monsters the views may draw. */
    monsters: StockedMonster[];
    /** The character's height in inches, which is where the horizon sits. */
    height: number;
    /** `ladder_delta` for a square: above zero a way down, below it a way up. */
    ladderAt: (x: number, y: number) => number;
    /** The map the character has discovered, or null to draw the whole floor. */
    discovered: DiscoveredMap | null;
    /** The text the game draws over the screen, in its own 1600 by 1200 units. */
    lines: ScreenLine[];
    /** One view over the whole screen, the way the Z key zooms one; null draws all four. */
    zoomed?: number | null;
  }

  let { rows, place, monsters, height, ladderAt, discovered, lines, zoomed = null }: Props = $props();

  const WIDTH = MW_SCREEN_PIXELS.width;
  const HEIGHT = MW_SCREEN_PIXELS.height;
  /** The text is placed in the same grid the views are drawn in, so the two register. */
  const TEXT_WINDOW = { x: 0, y: 0, width: MW_SCREEN_UNITS_X, height: MW_SCREEN_UNITS_Y };

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  const drawn = $derived.by((): MwViewMonster[] =>
    monsters.flatMap((monster) => {
      const entry = MONSTERS[Number(monster.monsterId)];
      if (!entry) return [];
      return [{ x: monster.x, y: monster.y, picture: entry.picture, colour: entry.colour }];
    }),
  );

  $effect(() => {
    const target = canvas;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;

    const frame = newFrame(WIDTH, HEIGHT);
    const scene: MwViewScene = {
      rows,
      at: { x: place.x, y: place.y },
      floor: place.floor,
      dungeon: place.dungeon,
      pictures: mwViewPictures(),
      bricks: 0,
      // Mode 11, the 640 by 480 in 256 colours the game's own screenshots are in.
      videoMode: 11,
      screen: { width: WIDTH, height: HEIGHT },
      horizonWeight: mwHorizonWeight(height),
      monsters: drawn,
      ladderAt,
    };

    if (zoomed === null) {
      for (const [view, rect] of MW_VIEWS.entries()) renderMwView(frame, scene, rect, view);
      drawBoxes(frame);
    } else {
      renderMwView(frame, scene, MW_WHOLE_SCREEN_VIEW, zoomed);
    }
    context.putImageData(new ImageData(toRgba(frame, floorPalette(place.floor)), WIDTH, HEIGHT), 0, 0);
  });

  /** The message box, the key menu and the zoom map, which sit around the four views. */
  function drawBoxes(frame: Frame): void {
    const toX = (x: number) => Math.trunc(((WIDTH - 1) * x) / 0x63f);
    const toY = (y: number) => Math.trunc(((HEIGHT - 1) * y) / 0x4af);
    for (const box of [MW_MESSAGE_BOX_RECT, MW_KEY_MENU_RECT]) {
      fillRect(frame, toX(box.left), toY(box.top), toX(box.right), toY(box.bottom), 0);
    }

    // FUN_3000_b066 (WORLD.EXE 3000:b066): the maroon box the discovered map is drawn on, and
    // draw_map_square (exe 3000:a97d) filling a walked square black and marking its walls white.
    const right = Math.trunc(((WIDTH - 1) * 0x119) / MW_SCREEN_UNITS_X);
    fillRect(frame, 0, MW_MAP_TOP_PIXELS, right, MW_MAP_TOP_PIXELS + MW_MAP_ROWS * MW_MAP_CELL + 2, MW_COLOURS.map);
    for (let row = 0; row < MW_MAP_ROWS; row++) {
      for (let col = 0; col < MW_MAP_COLUMNS; col++) {
        const x = place.x + col - (MW_MAP_COLUMNS >> 1);
        const y = place.y + row - (MW_MAP_ROWS >> 1);
        const square = rows[y]?.[x];
        if (!square || square.solid) continue;
        if (discovered && !discovered.known(x, y)) continue;
        const px = MW_MAP_LEFT + col * MW_MAP_CELL;
        const py = MW_MAP_TOP_PIXELS + row * MW_MAP_CELL;
        fillRect(frame, px + 1, py + 1, px + MW_MAP_CELL, py + MW_MAP_CELL, 0);
        if (square.w !== 3) fillRect(frame, px, py + 1, px, py + MW_MAP_CELL - 1, MW_COLOURS.mapWall);
        if (square.n !== 3) fillRect(frame, px + 1, py, px + MW_MAP_CELL - 1, py, MW_COLOURS.mapWall);
      }
    }
    // FUN_2000_7c8a (exe 2000:7c8a) fills the character's own square in the next of the sixteen
    // colours each pass, so it blinks. One colour has to stand for that here.
    const cx = MW_MAP_LEFT + (MW_MAP_COLUMNS >> 1) * MW_MAP_CELL;
    const cy = MW_MAP_TOP_PIXELS + (MW_MAP_ROWS >> 1) * MW_MAP_CELL;
    fillRect(frame, cx + 2, cy + 2, cx + MW_MAP_CELL, cy + MW_MAP_CELL, MW_COLOURS.menuKey);
  }
</script>

<!-- The game's screen: the painted views under the lines of text it draws over them. -->
<div class="screen" style:aspect-ratio="{MW_SCREEN_UNITS_X} / {MW_SCREEN_UNITS_Y}">
  <canvas bind:this={canvas} width={WIDTH} height={HEIGHT}></canvas>
  <div class="text"><GameScreen {lines} window={TEXT_WINDOW} /></div>
</div>

<style>
  .screen {
    position: relative;
    width: 100%;
    background: #000;
  }
  .screen canvas {
    display: block;
    width: 100%;
    height: 100%;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
  }
  /* The text sits over the painted screen in the same 1600 by 1200 grid, so every line lands
     where the game prints it. */
  .text {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .text :global(.screen) {
    height: 100%;
    background: transparent;
    border: none;
    border-radius: 0;
  }
</style>
