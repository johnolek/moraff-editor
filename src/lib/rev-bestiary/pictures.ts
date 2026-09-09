import { DUNGEONS, PALETTES, type RevDungeon, type RevMonster, type RevPicture } from './monsters';

/**
 * Drawing a Moraff's Revenge monster.
 *
 * The game draws in `SCREEN 1`, CGA's four-colour 320 by 200 mode, so a picture is nothing but
 * a grid of colour indexes 0 to 3 and the four colours the mode is set to. `4.NUM` holds the
 * close-up pictures and `6.NUM` the distant ones; `rev-tools/reference/build_rev_data.py`
 * unpacks the QuickBASIC `GET` images and `rev-tools/docs/MONSTERS.md` describes the format.
 */

export interface RenderedPicture {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

/**
 * The two sets of colours `SCREEN 1` can be in. The game starts on the first — 1000:0174 sets
 * the background to 0 and the palette to 2, and an even palette number is CGA palette 0 — and
 * the `@` key flips to the second (1000:1038).
 */
export const PALETTE_NAMES = ['Green, red and brown', 'Cyan, magenta and white'];

/** How many of the two sets there are, so the toggle need not hard-code it. */
export const PALETTE_COUNT = PALETTES.length;

/** The close-up picture a monster is drawn with, or null when `3.NUM` names one the file lacks. */
export function closeUpOf(dungeon: RevDungeon, monster: RevMonster): RevPicture | null {
  return dungeon.closeUps.find((picture) => picture.index === monster.closeUp) ?? null;
}

/** The distant picture a monster is drawn with, or null when `5.NUM` names one the file lacks. */
export function distantOf(dungeon: RevDungeon, monster: RevMonster): RevPicture | null {
  return dungeon.distants.find((picture) => picture.index === monster.distant) ?? null;
}

/**
 * The other monsters of the dungeon drawn with the same close-up picture.
 *
 * Both dungeons hold a name twice over in places, and two lines of the same name are the same
 * monster to look at, so they are left out rather than listed as sharing with themselves.
 */
export function drawnAlike(dungeon: RevDungeon, monster: RevMonster): RevMonster[] {
  return dungeon.monsters.filter(
    (other) => other.closeUp === monster.closeUp && other.name !== monster.name,
  );
}

/** Every dungeon, for a caller that wants to walk both sets. */
export function dungeons(): RevDungeon[] {
  return DUNGEONS;
}

/** One `#rrggbb` string as the three bytes it holds. */
function rgb(colour: string): [number, number, number] {
  const value = parseInt(colour.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/**
 * The picture as pixels, in one of the two palettes.
 *
 * A `GET` image is a rectangle, so the monster comes with the background it was cut out of.
 * `showBackground` false leaves colour 0 out of the picture altogether, which is what a monster
 * drawn over something else wants — a square of the map, rather than a black box on it.
 */
export function renderPicture(picture: RevPicture, palette: number, showBackground = true): RenderedPicture {
  const colours = PALETTES[palette].map(rgb);
  const data = new Uint8ClampedArray(picture.width * picture.height * 4);
  for (let y = 0; y < picture.height; y++) {
    const row = picture.rows[y];
    for (let x = 0; x < picture.width; x++) {
      const value = Number(row[x]);
      const [red, green, blue] = colours[value];
      const at = (y * picture.width + x) * 4;
      data[at] = red;
      data[at + 1] = green;
      data[at + 2] = blue;
      data[at + 3] = value === 0 && !showBackground ? 0 : 255;
    }
  }
  return { width: picture.width, height: picture.height, data };
}
