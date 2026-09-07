import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Rng } from '../port/rng';
import {
  derivedValues,
  printUsing,
  REV_RACE_NAMES,
  REV_RACE_STATS,
  REV_TOWN_ROWS,
  revTypedName,
  rollChar,
  startingSpellPoints,
} from './character';
import { newRevGame, type RevGame, type RevGameOptions } from './state';

interface ShippedCharacter {
  strength: number;
  intelligence: number;
  wisdom: number;
  health: number;
  agility: number;
  laziness: number;
  fromStrength: number;
  fromHealth: number;
  fromAgility: number;
  class: number;
  spellPoints: number;
  maxHealthPoints: number;
  pocketMoney: number;
  race: number;
}

const shipped: Record<string, ShippedCharacter> = JSON.parse(
  readFileSync('rev-tools/fixtures/characters.json', 'utf8'),
).characters;

/** Characters 1 and 5 have been played, and the game has rewritten two of their fields. */
const UNTOUCHED = ['2', '3', '4'];

const statsOf = (character: ShippedCharacter) => [
  character.strength,
  character.intelligence,
  character.wisdom,
  character.health,
  character.agility,
  character.laziness,
];

/** RND handing back the fractions it is given, and 0 once they run out. */
class ScriptedRng implements Rng {
  private at = 0;

  constructor(private readonly fractions: number[]) {}

  random(n: number): number {
    const fraction = this.at < this.fractions.length ? this.fractions[this.at++] : 0;
    return Math.trunc(fraction * n);
  }
}

/** A generator with no pattern worth speaking of, so a range can be checked over many rolls. */
function spread(seed: number): Rng {
  let state = seed;
  return {
    random(n: number) {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return Math.trunc((state / 0x80000000) * n);
    },
  };
}

function run(rng: Rng, answers: Partial<RevGameOptions> = {}): RevGame {
  const game = newRevGame({
    rng,
    race: 1,
    askRace: () => 1,
    askKeep: () => 0,
    askClass: () => 1,
    askName: () => 'nameless',
    pressAnyKey: () => {},
    ...answers,
  });
  rollChar(game);
  return game;
}

describe('the race table CHCHAR reads out of its own DATA', () => {
  it('has a row for each of the four races', () => {
    expect(REV_RACE_STATS).toHaveLength(REV_RACE_NAMES.length);
  });

  it('gives every race the same twenty-four points to start from', () => {
    for (const stats of REV_RACE_STATS) expect(stats.reduce((total, stat) => total + stat, 0)).toBe(24);
  });

  it('leaves every shipped character above the race it was rolled as', () => {
    for (const character of Object.values(shipped)) {
      const base = REV_RACE_STATS[character.race - 1];
      statsOf(character).forEach((stat, index) => expect(stat).toBeGreaterThanOrEqual(base[index]));
    }
  });
});

describe('the roll', () => {
  it('hands out INT(RND * 10) + 52 points, one at a time', () => {
    // The first fraction is the number of points, and each one after it picks a characteristic.
    const game = run(new ScriptedRng([0.99, ...Array<number>(61).fill(0)]));
    expect(game.pc.stats).toEqual([4 + 61, 4, 4, 4, 4, 4]);
  });

  it('starts every characteristic at the race the player picked', () => {
    const game = run(new ScriptedRng([0]), { askRace: () => 4, race: 4 });
    const spent = game.pc.stats.map((stat, index) => stat - REV_RACE_STATS[3][index]);
    expect(spent.reduce((total, stat) => total + stat, 0)).toBe(52);
  });

  it('comes to between 76 and 85 whichever race is rolled', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const game = run(spread(seed), { askRace: () => (seed % 4) + 1 });
      const total = game.pc.stats.reduce((sum, stat) => sum + stat, 0);
      expect(total).toBeGreaterThanOrEqual(76);
      expect(total).toBeLessThanOrEqual(85);
    }
  });

  it('gives the purse the same eleven-to-twenty roll every time', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const game = run(spread(seed));
      expect(game.pc.money).toBeGreaterThanOrEqual(11);
      expect(game.pc.money).toBeLessThanOrEqual(20);
    }
  });

  it('rolls again when the player says no', () => {
    let asked = 0;
    const game = run(spread(7), {
      askKeep: () => {
        asked += 1;
        return asked < 3 ? 1 : 0;
      },
    });
    expect(asked).toBe(3);
    expect(game.pc.stats.reduce((total, stat) => total + stat, 0)).toBeGreaterThanOrEqual(76);
  });
});

describe('the three numbers worked out from the characteristics', () => {
  it.each(UNTOUCHED)('matches character %s of the shipped disk', (which) => {
    const character = shipped[which];
    expect(derivedValues(statsOf(character))).toEqual({
      fromStrength: character.fromStrength,
      fromHealth: character.fromHealth,
      fromAgility: character.fromAgility,
    });
  });
});

describe('the spell points a character starts with', () => {
  it.each(['1', '2', '3', '4', '5'])('matches character %s of the shipped disk', (which) => {
    const character = shipped[which];
    expect(startingSpellPoints(statsOf(character), character.class)).toBe(character.spellPoints);
  });

  it('is nothing at all for a fighter who cannot think', () => {
    expect(startingSpellPoints([10, 3, 3, 10, 10, 10], 1)).toBe(0);
  });
});

describe('the health points', () => {
  it('are ten plus a roll of ten plus the number worked out from health', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const game = run(spread(seed));
      const { fromHealth } = derivedValues(game.pc.stats);
      expect(game.pc.maxHp).toBeGreaterThanOrEqual(fromHealth + 10);
      expect(game.pc.maxHp).toBeLessThanOrEqual(fromHealth + 19);
    }
  });
});

describe('what the roller leaves behind', () => {
  it('starts everybody at 150 pounds with the town on the map', () => {
    const game = run(spread(3));
    expect(game.pc.weight).toBe(150);
    expect(game.pc.explored).toEqual(REV_TOWN_ROWS);
  });

  it('takes the class the player picked and nothing else', () => {
    const answers = [5, 0, 2];
    const game = run(spread(3), { askClass: () => answers.shift() ?? 2 });
    expect(game.pc.cls).toBe(2);
  });

  it('uppercases the name the way the game does', () => {
    expect(revTypedName('Fighty the bold')).toBe('FIGHTY THE BOLD');
    expect(revTypedName('a`z')).toBe('A@Z');
  });

  it('will not take an empty name', () => {
    const typed = ['', '   ', 'gimli'];
    const game = run(spread(3), { askName: () => typed.shift() ?? '' });
    expect(game.pc.name).toBe('   ');
  });
});

describe('the screens', () => {
  it('prints the characteristics screen and waits for a key', () => {
    let keys = 0;
    const game = newRevGame({
      rng: spread(1),
      askRace: () => 1,
      askKeep: () => 0,
      askClass: () => 1,
      askName: () => 'x',
      pressAnyKey: () => {
        keys += 1;
        if (keys === 1) throw new Error('stop');
      },
    });
    expect(() => rollChar(game)).toThrow('stop');
    expect(game.width).toBe(80);
    expect(game.screen[0].text).toContain('These are the characteristics');
    expect(game.screen[game.screen.length - 1]).toMatchObject({ row: 25, column: 28, text: 'MORE   (HIT ANY KEY)' });
  });

  it('prints the seventh paragraph in blue, the first colour of the table', () => {
    let keys = 0;
    const game = newRevGame({
      rng: spread(1),
      askRace: () => 1,
      askKeep: () => 0,
      askClass: () => 1,
      askName: () => 'x',
      pressAnyKey: () => {
        keys += 1;
        if (keys === 1) throw new Error('stop');
      },
    });
    expect(() => rollChar(game)).toThrow('stop');
    const laziness = game.screen.find((line) => line.text.startsWith('Laziness:'));
    expect(laziness?.colour).toBe(9);
  });

  it('narrows to forty columns for the race menu and marks the race being pointed at', () => {
    const game = run(spread(1), { race: 3 });
    const menu = newRevGame({
      rng: spread(1),
      race: 3,
      askRace: () => {
        throw new Error('menu drawn');
      },
      askKeep: () => 0,
      askClass: () => 1,
      askName: () => 'x',
      pressAnyKey: () => {},
    });
    expect(() => rollChar(menu)).toThrow('menu drawn');
    expect(menu.width).toBe(40);
    expect(game.width).toBe(40);
    const elf = menu.screen.find((line) => line.text === 'Elf');
    expect(elf).toMatchObject({ row: 1, column: 21, colour: 0 });
    expect(elf?.background).toBeGreaterThan(0);
    expect(menu.screen.find((line) => line.text === 'Human')?.background).toBe(0);
  });

  it('prints the roll from row three down', () => {
    const game = newRevGame({
      rng: new ScriptedRng([0, ...Array<number>(52).fill(0)]),
      askRace: () => 1,
      askKeep: () => {
        throw new Error('asked');
      },
      askClass: () => 1,
      askName: () => 'x',
      pressAnyKey: () => {},
    });
    expect(() => rollChar(game)).toThrow('asked');
    const rows = game.screen.filter((line) => line.row >= 3 && line.row <= 13).map((line) => line.text);
    expect(rows[0]).toBe('Strength:     56 ');
    expect(rows[6]).toBe('');
    expect(rows[7]).toBe('TOTAL:        76');
    expect(rows[8]).toBe('Health points: 1   ');
    expect(rows[10]).toBe('Do you want it (Y, N, OR ESC)?');
  });
});

describe('PRINT USING', () => {
  it('right-justifies the number in the run of hashes', () => {
    expect(printUsing('Strength:    ### ', 7)).toBe('Strength:      7 ');
    expect(printUsing('TOTAL:       ###', 85)).toBe('TOTAL:        85');
  });

  it('marks a number too wide for the field the way BASIC does', () => {
    expect(printUsing('TOTAL:       ###', 1234)).toBe('TOTAL:       %1234');
  });
});
