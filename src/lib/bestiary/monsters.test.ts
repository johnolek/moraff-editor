import { describe, expect, it } from 'vitest';
import data from '../game/dotu-data.json';
import { sectionOf } from '../game/dotu-files.js';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import {
  allMonsters,
  allowedFloors,
  allowedModules,
  describeEffects,
  floorsOf,
  homeFloor,
  monsterDescriptions,
  monsterGroups,
  sectionFloors,
  stockingOdds,
  whereItAppears,
} from './monsters';

describe('monsterDescriptions', () => {
  it('gives every one of the 100 section monsters a description', () => {
    const missing = data.sections.flatMap((section) =>
      monsterDescriptions(section).flatMap((text, i) => (text ? [] : [`${section.section} ${section.monsters[i].name}`])),
    );
    expect(missing).toEqual([]);
  });

  it('joins the lines of a paragraph, mending a word broken over two lines', () => {
    const [boss] = monsterDescriptions(data.sections[19]);
    expect(boss).toBe(
      'This is the commander of all of the Dungeons of the Unforgivin! It drains lots of things, so be extremely careful!',
    );
  });

  it('matches paragraphs to monsters by name rather than by order', () => {
    const [, troggisher, dozard, torman] = monsterDescriptions(data.sections[4]);
    expect(troggisher).toContain('This overgrown lizard');
    expect(dozard).toContain('This almost humanoid lizard');
    expect(torman).toContain('cross-bred');
  });

  it('hands a paragraph whose heading is spelled differently to the monster left over', () => {
    const [, flame] = monsterDescriptions(data.sections[1]);
    expect(flame).toContain('This flaming monster');
  });
});

describe('allMonsters', () => {
  it('lists the 22 built-ins and the 5 monsters of each of the 20 sections', () => {
    const monsters = allMonsters();
    expect(monsters).toHaveLength(122);
    expect(monsters[0].name).toBe('Giant Garbage Can');
    expect(monsters.filter((m) => m.origin.kind === 'builtin')).toHaveLength(22);
    expect(new Set(monsters.map((m) => m.id)).size).toBe(122);
  });

  it('includes all 12 puffballs', () => {
    const puffballs = allMonsters().filter((m) => m.name.endsWith('Puffball'));
    expect(puffballs).toHaveLength(12);
    expect(puffballs.map((m) => m.statDrain)).toEqual([1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5, -6]);
  });

  it('carries the type row and the section origin', () => {
    const vulture = allMonsters().find((m) => m.name === 'Vulture Of Death')!;
    expect(vulture.origin).toEqual({ kind: 'section', section: 3, module: 0, part: 3, slot: 23 });
    expect(vulture.type).toMatchObject({ type: 7, defense: 20, damageDie: 8, hpPerLevel: 16, speed: 55 });
    expect(vulture.description).toContain('skillful');
    expect(vulture.isBoss).toBe(false);
  });

  it('marks the 20 Shadow bosses', () => {
    const bosses = allMonsters().filter((m) => m.isBoss);
    expect(bosses).toHaveLength(20);
    expect(bosses.every((m) => m.special === 100 && m.type.type === 5 && m.expMult === 16)).toBe(true);
  });
});

describe('monsterGroups', () => {
  it('labels the built-ins and every section with its number, module and boss', () => {
    const groups = monsterGroups();
    expect(groups).toHaveLength(21);
    expect(groups[0].label).toBe('Built-in');
    expect(groups[3].label).toBe('Section 3 · Module I · Shadow Vulture');
    expect(groups[20].label).toBe('Section 20 · Module V · Shadow Ogeroth');
  });
});

describe('sectionFloors', () => {
  it('splits every module the same way the game does', () => {
    for (let module = 0; module < 5; module++) {
      for (let part = 1; part <= 4; part++) {
        const range = sectionFloors(module, part);
        for (const floor of floorsOf(range)) {
          expect(sectionOf(module, floor)).toBe(module * 4 + part);
        }
      }
    }
  });

  it('covers every floor of every module exactly once', () => {
    for (let module = 0; module < 5; module++) {
      const floors = [1, 2, 3, 4].flatMap((part) => floorsOf(sectionFloors(module, part)));
      expect(floors).toEqual(floorsOf({ module, from: 1, to: BOTTOM_LEVEL[module] }));
    }
  });
});

describe('whereItAppears', () => {
  it('puts a built-in on every dungeon floor of every module', () => {
    const can = allMonsters()[0];
    expect(whereItAppears(can)).toEqual({
      kind: 'builtin',
      ranges: [
        { module: 0, from: 1, to: 25 },
        { module: 1, from: 1, to: 45 },
        { module: 2, from: 1, to: 65 },
        { module: 3, from: 1, to: 85 },
        { module: 4, from: 1, to: 105 },
      ],
    });
    expect(allowedModules(can)).toEqual([0, 1, 2, 3, 4]);
    expect(homeFloor(can)).toEqual({ module: 0, floor: 1 });
  });

  it('keeps a section monster on its own section', () => {
    const vulture = allMonsters().find((m) => m.name === 'Vulture Of Death')!;
    expect(whereItAppears(vulture)).toEqual({ kind: 'section', ranges: [{ module: 0, from: 11, to: 15 }] });
    expect(allowedModules(vulture)).toEqual([0]);
    expect(allowedFloors(vulture, 0)).toEqual([11, 12, 13, 14, 15]);
    expect(homeFloor(vulture)).toEqual({ module: 0, floor: 11 });
  });

  it('runs the fourth section of a module down to the module bottom', () => {
    const rat = allMonsters().find((m) => m.name === 'Water Rat')!;
    expect(whereItAppears(rat)).toEqual({ kind: 'section', ranges: [{ module: 4, from: 76, to: 105 }] });
  });

  it('puts a Shadow boss on its boss floor alone', () => {
    const ogeroth = allMonsters().find((m) => m.name === 'Shadow Ogeroth')!;
    expect(whereItAppears(ogeroth)).toEqual({ kind: 'boss', ranges: [{ module: 4, from: 100, to: 100 }] });
    expect(allowedFloors(ogeroth, 4)).toEqual([100]);
    expect(homeFloor(ogeroth)).toEqual({ module: 4, floor: 100 });
  });
});

describe('describeEffects', () => {
  const effectsOf = (name: string) => describeEffects(allMonsters().find((m) => m.name === name)!);

  it('says nothing about a plain monster', () => {
    expect(effectsOf('Giant Garbage Can')).toEqual([]);
  });

  it('reports the stat a puffball gives or takes, and that it is worth nothing', () => {
    expect(effectsOf('Lt. Blue Puffball')).toEqual([
      '+1 Strength when it hits you',
      'Vanishes when it hits you, and is worth no experience',
    ]);
    expect(effectsOf('Dk. Grey Puffball')[0]).toBe('-1 Luck when it hits you');
  });

  it('reports poison and disease', () => {
    expect(effectsOf('Poison Flask')).toEqual(['Poisons you when it hits you']);
    expect(effectsOf('Flask Of Disease')).toEqual(['Gives you a disease when it hits you']);
  });

  it('reports level drain, experience drain and breath', () => {
    expect(effectsOf('Were Rat-Bat')).toEqual(['Drains 1 level when it hits you']);
    expect(effectsOf('Sustrontima')).toEqual(['Drains 30 experience when it hits you']);
    expect(effectsOf('Hydra')).toEqual(['Breathes fire instead of striking half the time']);
    expect(effectsOf('Rotten Swamp Plant')).toEqual([
      'Drains 2 levels when it hits you',
      '-1 Intelligence when it hits you',
    ]);
  });

  it('reports what a Shadow boss is immune to', () => {
    expect(effectsOf('Shadow Evil God')).toEqual([
      '-1 Strength when it hits you',
      'Breathes ice instead of striking half the time',
      'Immune to Sleep, Go Away, Autokill, Drain Monster and grenades',
    ]);
  });
});

describe('stockingOdds', () => {
  const oddsOf = (name: string) => stockingOdds(allMonsters().find((m) => m.name === name)!);

  it('splits 1 in 20 over the twelve puffballs', () => {
    expect(oddsOf('White Puffball')).toBeCloseTo(1 / 240, 10);
  });

  it('splits the blocker roll between the garbage can and the ball', () => {
    expect(oddsOf('Giant Garbage Can')).toBeCloseTo((19 / 20) * (1 / 7) / 2, 10);
    expect(oddsOf('Giant Ball')).toBe(oddsOf('Giant Garbage Can'));
  });

  it('splits the poison and disease roll over the eight built-ins', () => {
    expect(oddsOf('Chemical Bomb')).toBeCloseTo((19 / 20) * (6 / 7) * (14 / 15) * (1 / 12) / 8, 10);
  });

  it('gives the section its level drainer and three regulars', () => {
    expect(oddsOf('Were Rat-Bat')).toBeCloseTo((19 / 20) * (6 / 7) * (1 / 15), 10);
    expect(oddsOf('Flying Spectra')).toBeCloseTo((19 / 20) * (6 / 7) * (14 / 15) * (11 / 12) / 3, 10);
  });

  it('does not roll for a Shadow boss', () => {
    expect(oddsOf('Shadow Vulture')).toBe(null);
  });

  it('adds up to 1 over every monster of a section', () => {
    const section = allMonsters().filter(
      (m) => m.origin.kind === 'builtin' || (m.origin.section === 3 && !m.isBoss),
    );
    const total = section.reduce((sum, m) => sum + (stockingOdds(m) ?? 0), 0);
    expect(total).toBeCloseTo(1, 10);
  });
});

describe('line-break hyphens', () => {
  it('mends the words the forty-column layout split and keeps real compounds', () => {
    const text = allMonsters()
      .map((monster) => monster.description ?? '')
      .join('\n');
    expect(text).toContain('temperature');
    expect(text).toContain('Unforgivin');
    expect(text).toContain('surfboards');
    expect(text).toContain('Crab-Horse-Spider');
    expect(text).toContain('shish-kabob');
    expect(text).not.toContain('temp-erature');
  });
});
