import { describe, expect, it } from 'vitest';
import {
  CLASS_NAMES,
  designYourOwn,
  openUroll,
  RACES,
  readUrollLine,
  readUrollLines,
  rollChar,
  rollCharacteristics,
  showRolledCharacter,
} from './character';
import { BorlandRng } from './rng';
import type { Game, ScreenLine } from './state';
import { newGame } from './state';

/** The line of a screen that starts with `text`, for a test that is about how it is drawn. */
function drawn(screen: ScreenLine[], text: string): ScreenLine {
  const line = screen.find((candidate) => candidate.text.startsWith(text));
  if (line === undefined) throw new Error(`no line starting "${text}" on the screen`);
  return line;
}

describe('reading UROLL.TXT', () => {
  it('hands back the first line of the file without its newline', () => {
    expect(readUrollLine(openUroll())).toBe('PLEASE SELECT ONE:');
  });

  it('walks the file one line at a time', () => {
    const file = openUroll();
    expect(readUrollLines(file, 3)).toEqual([
      'PLEASE SELECT ONE:',
      '1) NORMAL DIFFICULTY',
      'NORMAL CHARACTERS CAN VISIT MODULES I, II,',
    ]);
  });

  it('drops the bar characters the same function reads out of the tablets', () => {
    expect(readUrollLine(openUroll('A|B|C\nD\n'))).toBe('ABC');
  });

  it('drops the carriage returns of DOS line endings, as text mode does', () => {
    expect(readUrollLines(openUroll('ONE\r\nTWO\r\n'), 2)).toEqual(['ONE', 'TWO']);
  });

  it('reads the whole file roll_char reads, ending on the class descriptions', () => {
    const file = openUroll();
    // 13 lines of the difficulty screen and 3 more it throws away, 12 of the contest screen it
    // also throws away, 12 of the advice screen, 12 of the race screen and 16 of the classes.
    const lines = readUrollLines(file, 13 + 3 + 12 + 12 + 12 + 16);
    expect(lines[0]).toBe('PLEASE SELECT ONE:');
    expect(lines[40]).toBe('RACE SELECTION:');
    expect(lines[lines.length - 1]).toBe('POWERFUL LATER. NEEDS WELL-BALANCED CHARACTERISTICS.');
    // One line is left, the '-' the file ends on, and roll_char never reads it.
    expect(readUrollLine(file)).toBe('-');
  });
});

describe('the race table', () => {
  it('is the eight races the race menu offers', () => {
    expect(RACES.map((race) => race.name)).toEqual([
      'HUMANOID',
      'APE',
      'CHILDMAN',
      'RODENT',
      'HOBO',
      'GIANT',
      'MIDGET',
      'SHRIMP',
    ]);
  });

  it('is ten under the averages UROLL.TXT prints, except for two rows', () => {
    const file = openUroll();
    readUrollLines(file, 44);
    const printed = readUrollLines(file, 8).map((line) => line.slice(11).trim().split(/\s+/).map(Number));
    const rolled = RACES.map((race) => [race.str, race.iq, race.wis, race.con, race.dex, race.luck].map((n) => n + 10));
    // The exe rolls a HUMANOID 15 of everything and gives a MIDGET 25 intelligence; the file
    // says 14 and 18. Every other number in the file matches the table.
    expect(rolled[0]).toEqual([15, 15, 15, 15, 15, 15]);
    expect(printed[0]).toEqual([14, 14, 14, 14, 14, 14]);
    expect(rolled[6][1]).toBe(25);
    expect(printed[6][1]).toBe(18);
    for (const race of [1, 2, 3, 4, 5, 7]) expect(rolled[race]).toEqual(printed[race]);
  });
});

describe('the class names', () => {
  it('is the seven classes the class menu offers', () => {
    expect(CLASS_NAMES).toEqual(['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE']);
  });
});

describe('showRolledCharacter', () => {
  it('prints every number beside its own label, with the height four times the field', () => {
    const game = newGame({
      pc: { str: 15, iq: 16, wis: 17, con: 18, dex: 19, luck: 20, height: 21, weight: 130, age: 15, sex: 0 },
    });
    showRolledCharacter(game, 1);
    expect(game.messages).toEqual([
      'STRENGTH: 15',
      'INTELLIGENCE: 16',
      'WISDOM: 17',
      'CONSTITUTION: 18',
      'AGILITY: 19',
      'LUCK: 20',
      'HEIGHT: 84 INCHES',
      'WEIGHT: 130 POUNDS',
      'AGE: 15 YEARS',
      'SEX: MALE',
    ]);
  });

  it('prints a female character her own line', () => {
    const game = newGame({ pc: { sex: 1 } });
    showRolledCharacter(game, 1);
    expect(game.messages[game.messages.length - 1]).toBe('SEX: FEMALE');
  });

  it('prints nothing on the pass that rubs the numbers out', () => {
    const game = newGame();
    showRolledCharacter(game, 0);
    expect(game.messages).toEqual([]);
  });
});

describe('rollCharacteristics', () => {
  it('hands out sixty points on top of the race, whatever the seed', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (let race = 0; race < RACES.length; race++) {
        const game = newGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const pc = game.pc;
        const table = RACES[race];
        const rolled = pc.str + pc.iq + pc.wis + pc.con + pc.dex + pc.luck;
        const base = table.str + table.iq + table.wis + table.con + table.dex + table.luck;
        expect(rolled).toBe(base + 60);
        for (const stat of [pc.str, pc.iq, pc.wis, pc.con, pc.dex, pc.luck]) {
          expect(stat).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('never rolls a characteristic below its race or above its race plus sixty', () => {
    const game = newGame({ rng: new BorlandRng(7), pc: { race: 5 } });
    rollCharacteristics(game);
    expect(game.pc.str).toBeGreaterThanOrEqual(RACES[5].str);
    expect(game.pc.str).toBeLessThanOrEqual(RACES[5].str + 60);
  });

  it("keeps the age, the weight and the height inside the race table's spreads", () => {
    for (let seed = 1; seed <= 50; seed++) {
      for (let race = 0; race < RACES.length; race++) {
        const game = newGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const table = RACES[race];
        expect(game.pc.age).toBeGreaterThanOrEqual(table.age);
        expect(game.pc.age).toBeLessThanOrEqual(table.age + 9);
        expect(game.pc.weight).toBeGreaterThanOrEqual(table.weight - Math.trunc(table.weight / 10));
        expect(game.pc.weight).toBeLessThanOrEqual(
          table.weight + Math.trunc(table.weight / 5) - 1 - Math.trunc(table.weight / 10),
        );
        expect(game.pc.height).toBe(Math.trunc((table.height * 30) / 100));
        expect(game.pc.sex === 0 || game.pc.sex === 1).toBe(true);
      }
    }
  });

  it('stands a humanoid 84 inches tall and a giant 116', () => {
    const humanoid = newGame({ rng: new BorlandRng(1), pc: { race: 0 } });
    rollCharacteristics(humanoid);
    expect(humanoid.pc.height * 4).toBe(84);
    const giant = newGame({ rng: new BorlandRng(1), pc: { race: 5 } });
    rollCharacteristics(giant);
    expect(giant.pc.height * 4).toBe(116);
  });
});

describe('designYourOwn', () => {
  it('takes four off every characteristic and puts twenty-four back', () => {
    let asked = 0;
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => (asked++, 5) });
    rollCharacteristics(game);
    const before = { ...game.pc };
    expect(designYourOwn(game)).toBe(true);
    expect(asked).toBe(24);
    expect(game.pc.str).toBe(before.str - 4);
    expect(game.pc.luck).toBe(before.luck - 4 + 24);
    const total = game.pc.str + game.pc.iq + game.pc.wis + game.pc.con + game.pc.dex + game.pc.luck;
    const was = before.str + before.iq + before.wis + before.con + before.dex + before.luck;
    expect(total).toBe(was);
  });

  it('spreads the points over whichever characteristics are asked for', () => {
    const answers = [0, 1, 2, 3, 4, 5];
    let next = 0;
    const game = newGame({
      rng: new BorlandRng(3),
      pc: { race: 0 },
      askDesignStat: () => answers[next++ % answers.length],
    });
    rollCharacteristics(game);
    const before = { ...game.pc };
    designYourOwn(game);
    expect(game.pc.str).toBe(before.str);
    expect(game.pc.luck).toBe(before.luck);
  });

  it('gives up on Escape, having already taken the four points off', () => {
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => 6 });
    rollCharacteristics(game);
    const before = { ...game.pc };
    expect(designYourOwn(game)).toBe(false);
    expect(game.pc.str).toBe(before.str - 4);
  });

  it("prints the count down from twenty-four under the game's own prompt", () => {
    let left = 24;
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => (left--, 0) });
    rollCharacteristics(game);
    game.messages.length = 0;
    designYourOwn(game);
    expect(game.messages.slice(10, 13)).toEqual([
      'ESC-CANCEL THIS CHARACTER',
      'YOU MAY ASSIGN 24 ADDITIONAL POINTS',
      'TO THE ABOVE CHARACTERISTICS.',
    ]);
    expect(game.messages).toContain('CHARACTERISTIC POINTS LEFT: ');
    expect(game.messages).toContain('24');
    expect(game.messages).toContain('1');
  });
});

/** A game whose six questions are answered the way `answers` says, with a repeatable roll. */
function roller(answers: {
  seed?: number;
  difficulty?: number;
  race?: number;
  cls?: number;
  name?: string;
  keep?: number[];
  design?: number[];
}): Game {
  const keep = answers.keep ?? [0];
  const design = answers.design ?? [];
  let keepNext = 0;
  let designNext = 0;
  return newGame({
    rng: new BorlandRng(answers.seed ?? 1),
    askDifficulty: () => answers.difficulty ?? 0,
    askRace: () => answers.race ?? 0,
    askClass: () => answers.cls ?? 0,
    askName: () => answers.name ?? 'HERO',
    askKeepRerollDesign: () => keep[Math.min(keepNext++, keep.length - 1)],
    askDesignStat: () => design[Math.min(designNext++, design.length - 1)],
  });
}

describe('rollChar', () => {
  it('starts the character on floor 1 of module I with fists, skin and nothing else', () => {
    const game = roller({});
    rollChar(game);
    const pc = game.pc;
    expect(pc.x).toBe(58);
    expect(pc.y).toBe(44);
    expect(pc.level).toBe(1);
    expect(pc.module).toBe(0);
    expect(pc.dir).toBe(0);
    expect(pc.weaponsOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(pc.armorOwned).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(pc.weapon).toBe(0);
    expect(pc.armor).toBe(0);
    expect(pc.scrolls.every((count) => count === 0)).toBe(true);
    expect(pc.wands.every((count) => count === 0)).toBe(true);
    expect(pc.luckyCharms).toBe(0);
    expect(pc.bank).toBe(0);
  });

  it('leaves the character at level 0 with no experience, which is what the game does', () => {
    const game = roller({});
    rollChar(game);
    expect(game.pc.lev).toBe(0);
    expect(game.pc.exp).toBe(0);
  });

  it('fills the seven fields nothing in the game reads back', () => {
    const game = roller({});
    rollChar(game);
    const pc = game.pc;
    expect([pc.unread7fc, pc.unread7fe, pc.unread808, pc.unread80a, pc.unread80c, pc.unread80e, pc.unread810]).toEqual(
      [2146, 1431, 0, 56, 60, 300, 0],
    );
  });

  it('puts the map cursor at the middle of the view the game is showing', () => {
    const game = roller({});
    game.areaColumns = 0x13;
    game.areaRows = 0x21;
    rollChar(game);
    expect(game.pc.mapCursorX).toBe(9);
    expect(game.pc.mapCursorY).toBe(16);
  });

  it('takes the name in upper case, cut to the eighteen the field holds', () => {
    const game = roller({ name: 'a very long name indeed, honestly' });
    rollChar(game);
    expect(game.pc.name).toBe('A VERY LONG NAME I');
  });

  it('keeps letters, digits and spaces out of the name and nothing else', () => {
    const game = roller({ name: "o'brien-2!" });
    rollChar(game);
    expect(game.pc.name).toBe('OBRIEN2');
  });

  it('records the character and its file number where the game writes the file', () => {
    const game = roller({});
    game.slot = 27;
    rollChar(game);
    const created = game.events.filter((event) => event.kind === 'characterCreated');
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ slot: 27 });
    expect((created[0] as { pc: typeof game.pc }).pc).toBe(game.pc);
  });

  it('shows the tablet its class has, and the contest tablet to nobody', () => {
    for (let cls = 0; cls < 7; cls++) {
      const game = roller({ cls });
      rollChar(game);
      expect(game.events.filter((event) => event.kind === 'tabletShown')).toEqual([
        { kind: 'tabletShown', entry: 0x34 + cls },
      ]);
    }
  });
});

describe('the spells a class starts with', () => {
  const spellsOf = (cls: number): number[] => {
    const game = roller({ cls });
    rollChar(game);
    return game.pc.spellbook.flatMap((known, index) => (known ? [index] : []));
  };

  it('gives a fighter nothing', () => {
    expect(spellsOf(0)).toEqual([]);
  });

  it('gives a worshipper and a priest Little Cure and priest Strength', () => {
    expect(spellsOf(1)).toEqual([47, 137]);
    expect(spellsOf(4)).toEqual([47, 137]);
  });

  it('gives a wizard and a mage Little Cure and Magic Zap', () => {
    expect(spellsOf(3)).toEqual([47, 91]);
    expect(spellsOf(6)).toEqual([47, 91]);
  });

  it('gives a sage all three', () => {
    expect(spellsOf(5)).toEqual([47, 91, 137]);
  });

  it('gives a monk the whole book, all 180 flags', () => {
    expect(spellsOf(2)).toHaveLength(180);
  });
});

describe('health and spell points', () => {
  it('gives a normal-difficulty character 25 more health than a tough one', () => {
    const normal = roller({ difficulty: 0 });
    rollChar(normal);
    const tough = roller({ difficulty: 1 });
    rollChar(tough);
    expect(normal.pc.hard).toBe(0);
    expect(tough.pc.hard).toBe(1);
    expect(normal.pc.maxHp).toBe(tough.pc.maxHp + 25);
  });

  it('starts the character full up', () => {
    const game = roller({ cls: 3 });
    rollChar(game);
    expect(game.pc.hp).toBe(game.pc.maxHp);
    expect(game.pc.sp).toBe(game.pc.maxSp);
  });

  it('gives a fighter no spell points and every other class some', () => {
    const fighter = roller({ cls: 0, race: 7 });
    rollChar(fighter);
    expect(fighter.pc.maxSp).toBe(0);
    for (const cls of [1, 2, 3, 4, 6]) {
      const game = roller({ cls, race: 7 });
      rollChar(game);
      expect(game.pc.maxSp).toBeGreaterThan(0);
    }
  });

  it('works the spell points out of wisdom and intelligence, the way each class does', () => {
    for (const cls of [1, 2, 3, 4, 5, 6]) {
      const game = roller({ cls, race: 7 });
      rollChar(game);
      const { wis, iq } = game.pc;
      const expected = [
        0,
        Math.trunc((wis * 2 + iq) / 4),
        Math.trunc((wis + iq) / 17) + 1,
        Math.trunc((wis + iq * 2) / 7),
        Math.trunc((wis * 2 + iq) / 8),
        Math.trunc((wis + iq) / 18),
        Math.trunc((wis + iq * 2) / 12),
      ];
      expect(game.pc.maxSp).toBe(expected[cls]);
    }
  });

  it('gives a fighter and a sage two extra rolls of health', () => {
    // The health roll is the same for both seeds up to the class, so the two extra d22 rolls
    // are the whole difference between a fighter and a worshipper of the same numbers.
    const fighter = roller({ cls: 0 });
    rollChar(fighter);
    const worshipper = roller({ cls: 1 });
    rollChar(worshipper);
    expect(fighter.pc.maxHp).toBeGreaterThan(worshipper.pc.maxHp - 25);
  });
});

describe('starting money', () => {
  it('gives a fighter no magic crystals and everyone else some', () => {
    const fighter = roller({ cls: 0 });
    rollChar(fighter);
    expect(fighter.pc.crystals).toBe(0);
    const sage = roller({ cls: 5 });
    rollChar(sage);
    expect(sage.pc.crystals).toBeGreaterThan(0);
  });

  it('keeps a tough character to five times their luck plus a roll on twice it', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const game = roller({ seed, difficulty: 1, race: 4 });
      rollChar(game);
      expect(game.pc.money).toBeGreaterThanOrEqual(game.pc.luck * 5);
      expect(game.pc.money).toBeLessThan(game.pc.luck * 7);
    }
  });

  it('gives a normal-difficulty character at least five hundred more', () => {
    const game = roller({ difficulty: 0, race: 4 });
    rollChar(game);
    expect(game.pc.money).toBeGreaterThanOrEqual(game.pc.luck * 5 + 500);
  });
});

describe('keeping, rerolling and designing', () => {
  it('rolls another character for every N and keeps the last one', () => {
    const kept = roller({ keep: [0] });
    rollChar(kept);
    const rerolled = roller({ keep: [1, 1, 0] });
    rollChar(rerolled);
    expect(rerolled.messages.filter((line) => line === 'RACE: HUMANOID')).toHaveLength(3);
    expect(kept.messages.filter((line) => line === 'RACE: HUMANOID')).toHaveLength(1);
  });

  it('keeps a designed character without asking again', () => {
    const game = roller({ keep: [2], design: [0] });
    rollChar(game);
    expect(game.messages.filter((line) => line === 'RACE: HUMANOID')).toHaveLength(1);
    expect(game.pc.str).toBeGreaterThan(game.pc.iq);
  });

  it('rolls a fresh character when the design screen is escaped', () => {
    // Escape the first design, then keep the character rolled in its place.
    const game = roller({ keep: [2, 0], design: [6] });
    rollChar(game);
    expect(game.messages.filter((line) => line === 'RACE: HUMANOID')).toHaveLength(2);
    // The four points the abandoned character lost are not on the one that is kept.
    const pc = game.pc;
    const total = pc.str + pc.iq + pc.wis + pc.con + pc.dex + pc.luck;
    expect(total).toBe(RACES[0].str * 6 + 60);
  });
});

describe('the screens roll_char shows', () => {
  it('opens on the difficulty menu, without the contest UROLL.TXT still describes', () => {
    const game = roller({});
    rollChar(game);
    expect(game.messages.slice(0, 3)).toEqual([
      'PLEASE SELECT ONE:',
      '1) NORMAL DIFFICULTY',
      'NORMAL CHARACTERS CAN VISIT MODULES I, II,',
    ]);
    expect(game.messages[12]).toBe('ADVANCED PLAYER.');
    expect(game.messages).not.toContain('3) CONTEST DIFFICULTY (WIN 100 DOLLARS!)');
    expect(game.messages).not.toContain('MORAFFWARE IS RUNNING A CONTEST TO SEE WHO');
  });

  it('shows the advice and the race table before it rolls', () => {
    const game = roller({});
    rollChar(game);
    expect(game.messages[13]).toBe('CREATING A CHARACTER:');
    expect(game.messages[25]).toBe('RACE SELECTION:');
    expect(game.messages[29]).toBe('1) HUMANOID 14         14        14        14         14    14');
    expect(game.messages[37]).toBe('RACE: HUMANOID');
  });

  it('asks for the name, then shows the class descriptions and what was picked', () => {
    const game = roller({ cls: 6, name: 'ZOG' });
    rollChar(game);
    const asked = game.messages.indexOf('PLEASE TYPE YOUR NAME:');
    expect(game.messages[asked + 1]).toBe('NAME: ZOG');
    expect(game.messages[asked + 2]).toBe('PLEASE SELECT A CLASS BY HITTING A NUMBER 1-7:');
    expect(game.messages[asked + 18]).toBe('CLASS: MAGE');
  });

  it("ends on the health and spell points, with the game's own spacing", () => {
    const game = roller({ cls: 3, race: 7 });
    rollChar(game);
    const pc = game.pc;
    expect(game.messages[game.messages.length - 1]).toBe(
      `SPELL POINTS: ${pc.maxSp}    HEALTH POINTS: ${pc.maxHp}`,
    );
  });
});

describe('the colours the screens are drawn in', () => {
  /** The screen as it stands the first time `question` is asked. */
  function screenWhenAsked(question: keyof Game, overrides: Parameters<typeof roller>[0] = {}): ScreenLine[] {
    const game = roller(overrides);
    const ask = game[question] as () => number;
    let snapshot: ScreenLine[] | null = null;
    Object.assign(game, {
      [question]: () => {
        snapshot ??= game.screen.map((line) => ({ ...line }));
        return ask();
      },
    });
    rollChar(game);
    if (snapshot === null) throw new Error(`roll_char never asked ${question}`);
    return snapshot;
  }

  it('puts the difficulty menu up in yellow with its paragraphs indented in orange', () => {
    const screen = screenWhenAsked('askDifficulty');
    expect(drawn(screen, 'PLEASE SELECT ONE:')).toMatchObject({ x: 0, y: 0, font: 1, colour: 4 });
    expect(drawn(screen, '1) NORMAL DIFFICULTY')).toMatchObject({ colour: 4 });
    expect(drawn(screen, 'NORMAL CHARACTERS')).toMatchObject({ x: 0xa0, colour: 5 });
    expect(drawn(screen, '2) I CAN HANDLE')).toMatchObject({ colour: 4 });
  });

  it('clears each screen before the next one, so the race table stands on its own', () => {
    const screen = screenWhenAsked('askRace');
    expect(screen.map((line) => line.text)).toHaveLength(12);
    expect(drawn(screen, 'RACE SELECTION:')).toMatchObject({ font: 2, colour: 3 });
    expect(drawn(screen, '   PLEASE SELECT A RACE')).toMatchObject({ colour: 4 });
    expect(drawn(screen, '   RACE   STRENGTH')).toMatchObject({ colour: 5 });
    expect(drawn(screen, '1) HUMANOID')).toMatchObject({ colour: 8 });
    expect(drawn(screen, '8) SHRIMP')).toMatchObject({ colour: 8 });
  });

  it('shows the advice screen on its own, waiting for a key before the race table', () => {
    let screen: ScreenLine[] = [];
    const game = roller({});
    game.pressAnyKey = () => {
      if (screen.length === 0) screen = game.screen.map((line) => ({ ...line }));
    };

    rollChar(game);
    expect(drawn(screen, 'CREATING A CHARACTER:')).toMatchObject({ font: 2, colour: 3 });
    expect(drawn(screen, '  DIFFERENT CHARACTERS')).toMatchObject({ colour: 5 });
    expect(drawn(screen, '  ADVANCED PLAYERS')).toMatchObject({ colour: 8 });
    expect(drawn(screen, 'HIT ANY KEY')).toMatchObject({ colour: 4 });
  });

  it('draws the rolled character in two columns, the numbers lined up in one of their own', () => {
    const screen = screenWhenAsked('askKeepRerollDesign', { race: 1 });
    expect(drawn(screen, 'RACE: ')).toMatchObject({ x: 0, y: 0, font: 2, colour: 5, value: 'APE', valueX: 0x14a });
    for (const label of ['STRENGTH: ', 'INTELLIGENCE: ', 'WISDOM: ', 'CONSTITUTION: ', 'AGILITY: ', 'LUCK: ']) {
      expect(drawn(screen, label)).toMatchObject({ x: 0, valueX: 0x212, font: 1, colour: 6 });
    }
    for (const label of ['HEIGHT: ', 'WEIGHT: ', 'AGE: ']) {
      expect(drawn(screen, label)).toMatchObject({ x: 0x2ee, font: 1, colour: 8 });
    }
    expect(drawn(screen, 'SEX: ')).toMatchObject({ y: 0, font: 2, colour: 15 });
    for (const line of ['Y) KEEP', 'N) ROLL', 'D) DESIGN', 'PLEASE SELECT ONE OF THE ABOVE']) {
      expect(drawn(screen, line)).toMatchObject({ x: 0xbe, font: 1, colour: 4 });
    }
  });

  it('leaves only the top of the character screen standing under the name prompt', () => {
    const screen = screenWhenAsked('askName');
    expect(drawn(screen, 'PLEASE TYPE YOUR NAME:')).toMatchObject({ x: 0, y: 700, font: 1, colour: 7 });
    expect(screen.some((line) => line.text.startsWith('Y) KEEP'))).toBe(false);
    expect(drawn(screen, 'STRENGTH: ')).toMatchObject({ colour: 6 });
  });

  it('puts the design screen up in cyan, red and yellow with the count beside its label', () => {
    const screen = screenWhenAsked('askDesignStat', { keep: [2], design: [0] });
    expect(drawn(screen, 'ESC-CANCEL THIS CHARACTER')).toMatchObject({ x: 0x96, colour: 4 });
    expect(drawn(screen, 'YOU MAY ASSIGN')).toMatchObject({ colour: 3, spreadTo: 0x63f });
    expect(drawn(screen, 'TO THE ABOVE')).toMatchObject({ colour: 3 });
    expect(drawn(screen, 'CHARACTERISTIC POINTS LEFT: ')).toMatchObject({ y: 0x348, colour: 6 });
    expect(drawn(screen, '24')).toMatchObject({ x: 1000, y: 0x348, colour: 6 });
    expect(drawn(screen, "PRESS 'S'")).toMatchObject({ colour: 4 });
  });

  it('gives each of the seven classes its own colour', () => {
    const screen = screenWhenAsked('askClass');
    expect(drawn(screen, 'PLEASE SELECT A CLASS')).toMatchObject({ font: 1, colour: 2 });
    expect(drawn(screen, 'NAME: ')).toMatchObject({ x: 700, y: 0x136, colour: 8 });
    const colours = ['1) FIGHTER', '2) WORSHIPPER', '3) MONK', '4) WIZARD', '5) PRIEST', '6) SAGE', '7) MAGE'].map(
      (line) => drawn(screen, line).colour,
    );
    expect(colours).toEqual([3, 4, 5, 6, 8, 7, 2]);
  });

  it('ends on the sheet and the class list, the question rubbed out and the points in yellow', () => {
    const game = roller({ cls: 6, name: 'ZOG' });
    rollChar(game);
    expect(drawn(game.screen, 'CLASS: ')).toMatchObject({ x: 700, y: 0x17c, colour: 8, value: 'MAGE' });
    expect(drawn(game.screen, 'SPELL POINTS: ')).toMatchObject({ x: 0, y: 0x1cc, font: 1, colour: 4 });
    expect(drawn(game.screen, '7) MAGE')).toMatchObject({ colour: 2 });
    expect(game.screen.some((line) => line.text.startsWith('PLEASE SELECT A CLASS'))).toBe(false);
  });

  it('shows no spell or health points until the class has been picked', () => {
    const screen = screenWhenAsked('askClass');
    expect(screen.some((line) => line.text.startsWith('SPELL POINTS: '))).toBe(false);
  });
});
