import { describe, expect, it } from 'vitest';
import {
  designYourOwn,
  MINUTES_PER_YEAR,
  MW_CLASS_NAMES,
  MW_RACES,
  openRoll,
  readRollLine,
  readRollLines,
  rollChar,
  rollCharacteristics,
  showRoll,
  spellPoints,
  startingSpells,
  typedName,
} from './character';
import { BorlandRng } from '../port/rng';
import type { MwGame } from './state';
import { newMwGame } from './state';

/** A finished character, rolled with a repeatable seed and the answers the tab would give. */
function rolled(seed: number, race: number, cls: number, name = 'TESTY'): MwGame {
  const game = newMwGame({
    rng: new BorlandRng(seed),
    askRace: () => race,
    askClass: () => cls,
    askName: () => name,
    askKeepRerollDesign: () => 0,
  });
  rollChar(game);
  return game;
}

describe('reading ROLL.TXT', () => {
  it('hands back the first line of the file without its newline', () => {
    expect(readRollLine(openRoll())).toBe('CREATING A CHARACTER:');
  });

  it('drops the bar characters the same function reads out of the help files', () => {
    expect(readRollLine(openRoll('A|B|C\nD\n'))).toBe('ABC');
  });

  it('drops the carriage returns of DOS line endings, as text mode does', () => {
    expect(readRollLines(openRoll('ONE\r\nTWO\r\n'), 2)).toEqual(['ONE', 'TWO']);
  });

  it('reads the whole file roll_char reads, in three screens of 12, 12 and 16', () => {
    const file = openRoll();
    const lines = readRollLines(file, 12 + 12 + 16);
    expect(lines[0]).toBe('CREATING A CHARACTER:');
    expect(lines[11]).toBe('HIT ANY KEY TO CREATE YOUR OWN CHARACTER...');
    expect(lines[12]).toBe('RACE SELECTION:');
    expect(lines[24]).toBe('PLEASE SELECT A CLASS BY HITTING A NUMBER 1-7:');
    expect(lines[39]).toBe('POWERFUL LATER. NEEDS WELL-BALANCED CHARACTERISTICS.');
  });
});

describe('the race table', () => {
  it('is the eight races the race menu offers', () => {
    expect(MW_RACES.map((race) => race.name)).toEqual([
      'HUMAN',
      'ELF',
      'DWARF',
      'HOBBIT',
      'GNOME',
      'OGRE',
      'SPRITE',
      'IMP',
    ]);
  });

  it('is ten under the averages ROLL.TXT prints, every row of it', () => {
    const file = openRoll();
    readRollLines(file, 16);
    const printed = readRollLines(file, 8).map((line) => line.slice(11).trim().split(/\s+/).map(Number));
    const rolled = MW_RACES.map((race) =>
      [race.str, race.iq, race.wis, race.con, race.dex, race.luck].map((n) => n + 10),
    );
    expect(rolled).toEqual(printed);
  });
});

describe('the class names', () => {
  it('is the seven classes the class menu offers', () => {
    expect(MW_CLASS_NAMES).toEqual(['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE']);
  });
});

describe('showRoll', () => {
  it('prints every number beside its own label, with the age back in years', () => {
    const game = newMwGame({
      pc: {
        str: 22,
        iq: 23,
        wis: 24,
        con: 25,
        dex: 26,
        luck: 27,
        height: 70,
        weight: 130,
        ageMinutes: 17 * MINUTES_PER_YEAR,
        sex: 0,
      },
    });
    showRoll(game, 1);
    expect(game.messages).toEqual([
      'STRENGTH: 22',
      'INTELLIGENCE: 23',
      'WISDOM: 24',
      'CONSTITUTION: 25',
      'AGILITY: 26',
      'LUCK: 27',
      'HEIGHT: 70 INCHES',
      'WEIGHT: 130 POUNDS',
      'AGE: 17 YEARS',
      'SEX: MALE',
    ]);
  });

  it('prints a female character her own line', () => {
    const game = newMwGame({ pc: { sex: 1 } });
    showRoll(game, 1);
    expect(game.messages[game.messages.length - 1]).toBe('SEX: FEMALE');
  });

  it('prints nothing on the pass that rubs the numbers out', () => {
    const game = newMwGame();
    showRoll(game, 0);
    expect(game.messages).toEqual([]);
  });
});

describe('rollCharacteristics', () => {
  it('hands out sixty points over the race bases, however the dice fall', () => {
    for (const race of MW_RACES.keys()) {
      for (let seed = 1; seed <= 20; seed++) {
        const game = newMwGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const base = MW_RACES[race];
        const total = game.pc.str + game.pc.iq + game.pc.wis + game.pc.con + game.pc.dex + game.pc.luck;
        expect(total).toBe(base.str + base.iq + base.wis + base.con + base.dex + base.luck + 60);
        expect(game.pc.str).toBeGreaterThanOrEqual(base.str);
        expect(game.pc.luck).toBeGreaterThanOrEqual(base.luck);
      }
    }
  });

  it('takes a quarter to a third of the race age, as a count of minutes', () => {
    for (const race of MW_RACES.keys()) {
      for (let seed = 1; seed <= 30; seed++) {
        const game = newMwGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const base = MW_RACES[race].age;
        const years = game.pc.ageMinutes / MINUTES_PER_YEAR;
        expect(Number.isInteger(years)).toBe(true);
        expect(years).toBeGreaterThanOrEqual(Math.trunc((base * 25) / 100));
        expect(years).toBeLessThanOrEqual(Math.trunc((base * 34) / 100));
      }
    }
  });

  it('is 57 to 78 years old for an imp and 16 to 22 for a human', () => {
    const ages = (race: number) =>
      Array.from({ length: 200 }, (_, seed) => {
        const game = newMwGame({ rng: new BorlandRng(seed + 1), pc: { race } });
        rollCharacteristics(game);
        return game.pc.ageMinutes / MINUTES_PER_YEAR;
      });
    expect(Math.min(...ages(7))).toBe(57);
    expect(Math.max(...ages(7))).toBe(78);
    expect(Math.min(...ages(0))).toBe(16);
    expect(Math.max(...ages(0))).toBe(22);
  });

  it('spreads height and weight a fifth wide starting a tenth below the race base', () => {
    for (const race of MW_RACES.keys()) {
      const base = MW_RACES[race];
      for (let seed = 1; seed <= 30; seed++) {
        const game = newMwGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        expect(game.pc.height).toBeGreaterThanOrEqual(base.height - Math.trunc(base.height / 10));
        expect(game.pc.height).toBeLessThan(base.height + Math.trunc(base.height / 5) - Math.trunc(base.height / 10));
        expect(game.pc.weight).toBeGreaterThanOrEqual(base.weight - Math.trunc(base.weight / 10));
        expect(game.pc.weight).toBeLessThan(base.weight + Math.trunc(base.weight / 5) - Math.trunc(base.weight / 10));
      }
    }
  });

  it('is 117 to 142 pounds and 63 to 76 inches for a human, and 360 to 439 for an ogre', () => {
    const spread = (race: number, of: 'height' | 'weight') =>
      Array.from({ length: 400 }, (_, seed) => {
        const game = newMwGame({ rng: new BorlandRng(seed + 1), pc: { race } });
        rollCharacteristics(game);
        return game.pc[of];
      });
    expect([Math.min(...spread(0, 'weight')), Math.max(...spread(0, 'weight'))]).toEqual([117, 142]);
    expect([Math.min(...spread(0, 'height')), Math.max(...spread(0, 'height'))]).toEqual([63, 76]);
    expect([Math.min(...spread(5, 'weight')), Math.max(...spread(5, 'weight'))]).toEqual([360, 439]);
  });

  it('picks a sex with a coin toss', () => {
    const sexes = new Set(
      Array.from({ length: 20 }, (_, seed) => {
        const game = newMwGame({ rng: new BorlandRng(seed + 1) });
        rollCharacteristics(game);
        return game.pc.sex;
      }),
    );
    expect([...sexes].sort()).toEqual([0, 1]);
  });
});

describe('designYourOwn', () => {
  it('takes four off each characteristic and gives twenty-four back', () => {
    const game = newMwGame({ pc: { str: 20, iq: 21, wis: 22, con: 23, dex: 24, luck: 25 }, askDesignStat: () => 0 });
    expect(designYourOwn(game)).toBe(true);
    expect(game.pc.str).toBe(20 - 4 + 24);
    expect([game.pc.iq, game.pc.wis, game.pc.con, game.pc.dex, game.pc.luck]).toEqual([17, 18, 19, 20, 21]);
  });

  it('is point-neutral when the twenty-four are spread evenly', () => {
    let placed = 0;
    const game = newMwGame({
      pc: { str: 20, iq: 20, wis: 20, con: 20, dex: 20, luck: 20 },
      askDesignStat: () => placed++ % 6,
    });
    designYourOwn(game);
    expect([game.pc.str, game.pc.iq, game.pc.wis, game.pc.con, game.pc.dex, game.pc.luck]).toEqual([
      20, 20, 20, 20, 20, 20,
    ]);
  });

  it('says no on the Escape the screen calls cancelling the character', () => {
    let asked = 0;
    const game = newMwGame({ askDesignStat: () => (asked++ === 3 ? 6 : 0) });
    expect(designYourOwn(game)).toBe(false);
  });

  it('prints the count down from twenty-four', () => {
    const game = newMwGame({ askDesignStat: () => 0 });
    designYourOwn(game);
    const counts = game.messages.filter((line) => /^\d+$/.test(line));
    expect(counts).toEqual(Array.from({ length: 24 }, (_, i) => String(24 - i)));
  });
});

describe('typedName', () => {
  it('upper-cases and keeps only letters, digits and spaces', () => {
    expect(typedName("Bob's Hat 3")).toBe('BOBS HAT 3');
  });

  it('stops at the eighteen characters the record holds', () => {
    expect(typedName('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('ABCDEFGHIJKLMNOPQR');
  });
});

describe('startingSpells', () => {
  it('gives a fighter nothing', () => {
    const game = newMwGame({ pc: { cls: 0 } });
    startingSpells(game);
    expect(game.pc.spellbook.every((slot) => slot === 0)).toBe(true);
  });

  it('gives everyone but a fighter the preparation Little Cure', () => {
    for (const cls of [1, 2, 3, 4, 5, 6]) {
      const game = newMwGame({ pc: { cls } });
      startingSpells(game);
      expect(game.pc.spellbook[47]).toBe(1);
    }
  });

  it('gives the wizard, sage and mage Magic Zap', () => {
    // The monk is left out: it has every slot, so it has this one too.
    for (const cls of [0, 1, 3, 4, 5, 6]) {
      const game = newMwGame({ pc: { cls } });
      startingSpells(game);
      expect(game.pc.spellbook[91]).toBe([3, 5, 6].includes(cls) ? 1 : 0);
    }
  });

  it('gives the worshipper, priest and sage the priest Strength', () => {
    for (const cls of [0, 1, 3, 4, 5, 6]) {
      const game = newMwGame({ pc: { cls } });
      startingSpells(game);
      expect(game.pc.spellbook[137]).toBe([1, 4, 5].includes(cls) ? 1 : 0);
    }
  });

  it('gives a monk all 180 slots, which is the whole spellbook', () => {
    const game = newMwGame({ pc: { cls: 2 } });
    startingSpells(game);
    expect(game.pc.spellbook.every((slot) => slot === 1)).toBe(true);
  });

  it('leaves a sage with exactly three spells', () => {
    const game = newMwGame({ pc: { cls: 5 } });
    startingSpells(game);
    expect(game.pc.spellbook.reduce((total, slot) => total + slot, 0)).toBe(3);
  });
});

describe('spellPoints', () => {
  it('gives a fighter none whatever their wisdom and intelligence', () => {
    expect(spellPoints(0, 40, 40)).toBe(0);
  });

  it('matches the characters ROLLER.md read the formulas back off', () => {
    // The three never-played characters in the game folder: an imp worshipper with wisdom 24 and
    // intelligence 24 has 18, an imp mage with wisdom 25 and intelligence 22 has 5, and both
    // fighters have none.
    expect(spellPoints(1, 24, 24)).toBe(18);
    expect(spellPoints(6, 25, 22)).toBe(5);
    expect(spellPoints(0, 19, 9)).toBe(0);
  });

  it('gives a monk one more than a division that is nearly always zero', () => {
    expect(spellPoints(2, 20, 20)).toBe(3);
    expect(spellPoints(2, 8, 8)).toBe(1);
  });

  it('is the table ROLLER.md prints, for the same wisdom and intelligence', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map((cls) => spellPoints(cls, 30, 24))).toEqual([0, 21, 4, 11, 10, 3, 6]);
  });
});

describe('rollChar', () => {
  it('gives every character constitution plus luck for health', () => {
    for (let seed = 1; seed <= 10; seed++) {
      for (const cls of [0, 1, 2, 3, 4, 5, 6]) {
        const { pc } = rolled(seed, seed % 8, cls);
        expect(pc.hp).toBe(pc.con + pc.luck);
        expect(pc.maxHp).toBe(pc.hp);
      }
    }
  });

  it('gives every character the spell points its class formula works out', () => {
    for (let seed = 1; seed <= 10; seed++) {
      for (const cls of [0, 1, 2, 3, 4, 5, 6]) {
        const { pc } = rolled(seed, seed % 8, cls);
        expect(pc.maxSp).toBe(spellPoints(cls, pc.wis, pc.iq));
        expect(pc.sp).toBe(pc.maxSp);
      }
    }
  });

  it('pays out twice luck plus a roll of twice luck in jewels', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const { pc } = rolled(seed, seed % 8, 0);
      expect(pc.money).toBeGreaterThanOrEqual(pc.luck * 2);
      expect(pc.money).toBeLessThan(pc.luck * 4);
    }
  });

  it('starts the character on the square the game puts every new character', () => {
    const { pc } = rolled(3, 0, 0);
    expect([pc.x, pc.y, pc.floor, pc.module]).toEqual([56, 60, 0, 0]);
    expect([pc.returnX, pc.returnY, pc.returnModule]).toEqual([56, 60, 0]);
    expect([pc.worldX, pc.worldY]).toEqual([2146, 1431]);
    expect(pc.encounterCounter).toBe(300);
  });

  it('halves the map view into the map cursor, which is 9 and 19 in the big modes', () => {
    expect([rolled(3, 0, 0).pc.mapCursorX, rolled(3, 0, 0).pc.mapCursorY]).toEqual([9, 19]);
    const game = newMwGame({ mapViewColumns: 0x10, mapViewRows: 0x16, askName: () => 'A' });
    rollChar(game);
    expect([game.pc.mapCursorX, game.pc.mapCursorY]).toEqual([8, 11]);
  });

  it('hands out bare fists and bare skin and nothing else', () => {
    const { pc } = rolled(4, 2, 3);
    expect(pc.weaponsOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(pc.armorOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('names the character what was typed, in upper case and cut to eighteen', () => {
    expect(rolled(5, 1, 1, 'sir reginald the third').pc.name).toBe('SIR REGINALD THE T');
  });

  it('prints the health and spell points on one line, the way the game does', () => {
    const game = rolled(6, 0, 1);
    expect(game.messages[game.messages.length - 1]).toBe(
      `SPELL POINTS: ${game.pc.maxSp}    HEALTH POINTS: ${game.pc.maxHp}`,
    );
  });

  it('records the character against the slot it was told to write', () => {
    const game = newMwGame({ slot: 7, askName: () => 'A' });
    rollChar(game);
    expect(game.events).toEqual([
      { kind: 'characterCreated', slot: 7, pc: game.pc },
      { kind: 'sectionGenerated', section: 0 },
    ]);
  });

  it('rolls again when the design screen is escaped, from the race bases', () => {
    let designs = 0;
    const game = newMwGame({
      rng: new BorlandRng(2),
      askRace: () => 5,
      askKeepRerollDesign: () => (designs++ === 0 ? 2 : 0),
      askDesignStat: () => 6,
      askName: () => 'A',
    });
    rollChar(game);
    const base = MW_RACES[5];
    const total = game.pc.str + game.pc.iq + game.pc.wis + game.pc.con + game.pc.dex + game.pc.luck;
    expect(total).toBe(base.str + base.iq + base.wis + base.con + base.dex + base.luck + 60);
    expect(designs).toBe(2);
  });

  it('rerolls everything about the character, not just the numbers', () => {
    let asked = 0;
    const game = newMwGame({ rng: new BorlandRng(8), askKeepRerollDesign: () => (asked++ < 3 ? 1 : 0), askName: () => 'A' });
    rollChar(game);
    const shown = game.messages.filter((line) => line.startsWith('AGE: '));
    expect(shown).toHaveLength(4);
    expect(new Set(shown).size).toBeGreaterThan(1);
  });

  it('keeps the age a whole number of years, counted in minutes', () => {
    const game = rolled(9, 3, 4);
    expect(game.pc.ageMinutes % MINUTES_PER_YEAR).toBe(0);
  });
});
