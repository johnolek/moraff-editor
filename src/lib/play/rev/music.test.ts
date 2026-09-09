import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { REV_FOUR_SECONDS } from './held';
import { DEATH_DIRGE, INN_HYMN, revPlayInnHymn, revPlayTones, TEMPLE_MARCH } from './music';
import type { RevPc } from './record';
import { newRevGame } from './state';

/** Every note and rest of a tune, rounded, so a whole sequence can be read in a line. */
function played(play: string): string[] {
  return revPlayTones(play).map((tone) => `${Math.round(tone.hz)}/${Math.round(tone.ms)}`);
}

/** How long a tune takes from its first note to its last, in milliseconds. */
function lasts(play: string): number {
  return Math.round(revPlayTones(play).reduce((total, tone) => total + tone.ms, 0));
}

describe('the PLAY string reader', () => {
  it('takes the tempo and the length as the beats they are', () => {
    // A whole note is four beats and the tempo is beats a minute, so a quarter note at 120 is
    // half a second. ML holds the note for all of it, and O2 is the octave holding middle C.
    expect(played('MLO2T120L4C')).toEqual(['262/500']);
    expect(played('MLO2T120L8C')).toEqual(['262/250']);
    expect(played('MLO2T60L4C')).toEqual(['262/1000']);
  });

  it('counts the octave from the one that holds middle C, and steps it either way', () => {
    expect(played('MLO2L1C')).toEqual(['262/2000']);
    expect(played('MLO2L1<C')).toEqual(['131/2000']);
    expect(played('MLO2L1>C')).toEqual(['523/2000']);
    expect(played('MLO0L1C')).toEqual(['65/2000']);
    expect(played('MLO6L1C')).toEqual(['4186/2000']);
  });

  it('sharpens a note with either sign and takes a length of its own', () => {
    expect(played('MLO2L4G#')).toEqual(['415/500']);
    expect(played('MLO2L4G+')).toEqual(['415/500']);
    expect(played('MLO2L4G8')).toEqual(['392/250']);
  });

  it('lengthens a dotted note by half, once per dot', () => {
    expect(played('MLO2T120L4C.')).toEqual(['262/750']);
    expect(played('MLO2T120L4C..')).toEqual(['262/1125']);
  });

  it('leaves a note short and its time whole under MN and MS', () => {
    expect(played('MNO2T120L4C')).toEqual(['262/438', '0/63']);
    expect(played('MSO2T120L4C')).toEqual(['262/375', '0/125']);
  });

  it('rests for as long as the note it is written like', () => {
    expect(played('MLO2T120L4P4')).toEqual(['0/500']);
  });

  it('reads MB and MF as nothing, since no tune here is waited for', () => {
    expect(played('MBMLO2T120L4C')).toEqual(['262/500']);
    expect(played('MFMLO2T120L4C')).toEqual(['262/500']);
  });

  it('refuses a letter it does not know rather than dropping the note', () => {
    expect(() => revPlayTones('MLO2Q4C')).toThrow();
  });
});

describe("the temple's march (1000:05A0)", () => {
  it('opens on the melody an octave above middle C and drops to its bass', () => {
    // T135O3L8CEFG, then L4<<C<G: the first four eighths at 135, then C two octaves down and the
    // G below that, quarters. Nothing sets M, so the normal seven eighths stands.
    expect(played(TEMPLE_MARCH).slice(0, 12)).toEqual([
      '523/194', '0/28',
      '659/194', '0/28',
      '699/194', '0/28',
      '784/194', '0/28',
      '131/389', '0/56',
      '98/389', '0/56',
    ]);
  });

  it('runs for fourteen seconds', () => {
    expect(lasts(TEMPLE_MARCH)).toBe(14000);
  });
});

describe("the death dirge (1000:05AC)", () => {
  it('is slow, low and normal-length', () => {
    // T90O1MNL4F.F: a dotted F below middle C at 90, then a plain one.
    expect(played(DEATH_DIRGE).slice(0, 4)).toEqual(['175/875', '0/125', '175/583', '0/83']);
    expect(lasts(DEATH_DIRGE)).toBe(7000);
  });
});

describe("the inns' hymn (1000:05B8)", () => {
  it('starts on a dotted E above the march and runs for eleven and a half seconds', () => {
    expect(played(INN_HYMN).slice(0, 4)).toEqual(['659/315', '0/45', '784/105', '0/15']);
    expect(lasts(INN_HYMN)).toBe(11520);
  });
});

/** A character standing in the town, since an inn is the only place the hymn is played. */
function sleeping(sound: number) {
  const pc: RevPc = {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 22,
    hp: 22,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 0,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 0,
    generation: 1,
    facing: 1,
  };
  const game = newRevGame(pc, new SeededRng(1));
  game.sound = sound;
  const waits: number[] = [];
  game.delay = (ms) => waits.push(ms);
  return { game, waits };
}

describe('the hymn with the sound off', () => {
  it('waits the four seconds the game waits in its place (1000:05BF)', () => {
    const { game, waits } = sleeping(1);
    revPlayInnHymn(game);
    expect(waits).toEqual([REV_FOUR_SECONDS]);
  });

  it('waits for nothing while the sound is on, because the tune is background music', () => {
    const { game, waits } = sleeping(0);
    revPlayInnHymn(game);
    expect(waits).toEqual([]);
  });
});
