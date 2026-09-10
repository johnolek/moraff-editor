import { describe, expect, it } from 'vitest';
import {
  CORRIDOR_HEIGHT,
  CORRIDOR_WIDTH,
  corridorFloor,
  corridorScene,
  renderMonsterInCorridor,
  type CorridorPlace,
} from './corridor';
import { allMonsters } from './monsters';
import type { RenderedImage } from './pictures';

const monsters = allMonsters();
const named = (name: string) => monsters.find((monster) => monster.name === name)!;

/** Module I floor 1: section 1, the first quarter of the module. */
const SECTION_ONE: CorridorPlace = { module: 0, floor: 1, section: 1, part: 1 };
/** Module I floor 6: section 2, the second quarter, drawn from a different wall file. */
const SECTION_TWO: CorridorPlace = { module: 0, floor: 6, section: 2, part: 2 };
/** Module I floor 16: section 4, one of the three sections whose floors are under water. */
const SECTION_FOUR: CorridorPlace = { module: 0, floor: 16, section: 4, part: 4 };

/** One row of the picture, as a string, so a test can say two pictures agree along it. */
const strip = (image: RenderedImage, x1: number, x2: number, y: number): string =>
  image.data.slice((y * image.width + x1) * 4, (y * image.width + x2) * 4).join(',');

/** A row across the middle of the picture, which is inside the monster. */
const acrossTheMonster = (image: RenderedImage) => strip(image, 200, 300, CORRIDOR_HEIGHT / 2);
/** A row along the top corner, which is corridor whatever stands in it. */
const acrossTheCorner = (image: RenderedImage) => strip(image, 4, 40, 8);

describe('the made-up floor', () => {
  const rows = corridorFloor();

  it('cuts one passage north from where the character stands', () => {
    expect(rows[5][5].n).toBe(3);
    expect(rows[4][5].n).toBe(3);
    expect(rows[3][5].n).toBe(3);
    expect(rows[2][5].n).toBe(3);
  });

  it('walls the far end of it', () => {
    expect(rows[1][5].n).toBe(0);
  });

  it('leaves the sides shut, which is what makes it a corridor', () => {
    for (const y of [5, 4, 3, 2]) {
      expect(rows[y][5].w).toBe(0);
      expect(rows[y][6].w).toBe(0);
    }
  });
});

describe('the scene the view is drawn from', () => {
  it('stands the monster one square ahead of the character', () => {
    const scene = corridorScene(named('Gargalon'), SECTION_ONE);

    expect(scene.monsters).toHaveLength(1);
    expect(scene.monsters[0]).toMatchObject({ x: scene.at.x, y: scene.at.y - 1 });
  });

  it('carries the monster picture and colours off its own record', () => {
    const entry = named('Gargalon');
    const scene = corridorScene(entry, SECTION_ONE);

    expect(scene.monsters[0]).toMatchObject({
      picnum: entry.picnum,
      builtin: false,
      colour: entry.color,
      colorSet: entry.colorSet,
    });
  });

  it('knows a built-in monster is drawn out of the shared picture file', () => {
    expect(corridorScene(named('Giant Garbage Can'), SECTION_ONE).monsters[0].builtin).toBe(true);
  });

  it('stands the monster in water in the sections that are under it', () => {
    expect(corridorScene(named('She-Demon'), SECTION_FOUR).water).toBe(true);
    expect(corridorScene(named('Gargalon'), SECTION_ONE).water).toBe(false);
  });

  it('hands the view no generator, so the monster is never mirrored', () => {
    expect(corridorScene(named('Gargalon'), SECTION_ONE).random).toBeUndefined();
  });
});

describe('the picture', () => {
  const gargalon = renderMonsterInCorridor(named('Gargalon'), SECTION_ONE);

  it('comes back at the size the card shows it', () => {
    expect(gargalon.width).toBe(CORRIDOR_WIDTH);
    expect(gargalon.height).toBe(CORRIDOR_HEIGHT);
    expect(gargalon.data).toHaveLength(CORRIDOR_WIDTH * CORRIDOR_HEIGHT * 4);
  });

  it('draws a corridor rather than leaving the background black', () => {
    const corner = new Set(acrossTheCorner(gargalon).split(','));

    expect(corner.size).toBeGreaterThan(1);
  });

  it('draws a different monster in the same corridor', () => {
    const other = renderMonsterInCorridor(named('Lesdidian Warrior'), SECTION_ONE);

    expect(acrossTheMonster(other)).not.toBe(acrossTheMonster(gargalon));
    expect(acrossTheCorner(other)).toBe(acrossTheCorner(gargalon));
  });

  it('draws the same monster a different corridor in another section', () => {
    const elsewhere = renderMonsterInCorridor(named('Gargalon'), SECTION_TWO);

    expect(acrossTheCorner(elsewhere)).not.toBe(acrossTheCorner(gargalon));
  });
});
