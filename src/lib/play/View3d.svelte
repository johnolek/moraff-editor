<script lang="ts">
  import { monsterById, type StockedMonster } from '../map/stocking';
  import type { MapSquare } from '../map/game';
  import { sectionInfo } from '../game/sections';
  import { sectionPalette } from '../bestiary/pictures';
  import { viewPictures } from './view3d/browser';
  import { newFrame, toRgba } from './view3d/frame';
  import { WHOLE_SCREEN_VIEW } from './view3d/geometry';
  import { renderView, type ViewMonster } from './view3d/render';

  interface Props {
    rows: MapSquare[][];
    /** Where the character stands, and which way. */
    place: { x: number; y: number; floor: number; module: number; dir: number };
    /** The monsters stocked on the floor; the view draws the ones it can see. */
    monsters: StockedMonster[];
    /** The character's own height, which is where the horizon sits. */
    height: number;
  }

  let { rows, place, monsters, height }: Props = $props();

  /** The game's own 320 x 200, which everything else is scaled up from. */
  const WIDTH = 320;
  const HEIGHT = 200;

  let canvas = $state.raw<HTMLCanvasElement | null>(null);

  const part = $derived(sectionInfo(place.module, place.floor)?.part ?? 1);

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

    const frame = newFrame(WIDTH, HEIGHT);
    renderView(
      frame,
      {
        rows,
        at: { x: place.x, y: place.y },
        floor: place.floor,
        module: place.module,
        moduleCarried: place.module,
        pictures: viewPictures(part),
        detail: 0,
        screen: { width: WIDTH, height: HEIGHT },
        videoClass: 2,
        horizonWeight: height,
        monsters: drawn,
        water: [4, 8, 20].includes((sectionInfo(place.module, place.floor)?.section ?? 0)),
      },
      WHOLE_SCREEN_VIEW,
      place.dir,
    );
    context.putImageData(new ImageData(toRgba(frame, sectionPalette(place.module + 1, part)), WIDTH, HEIGHT), 0, 0);
  });
</script>

<canvas class="view" bind:this={canvas} width={WIDTH} height={HEIGHT}></canvas>

<style>
  .view {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 320 / 200;
    background: #000;
    border: 1px solid var(--line);
    border-radius: 6px;
    /* The game's pixels stay pixels however far it is scaled up. */
    image-rendering: pixelated;
  }
</style>
