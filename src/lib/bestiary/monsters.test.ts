import { describe, expect, it } from 'vitest';
import data from '../game/dotu-data.json';
import { sectionOf } from '../game/dotu-files.js';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import {
  allMonsters,
  allowedFloors,
  allowedModules,
  floorsOf,
  homeFloor,
  monsterDescriptions,
  monsterGroups,
  sectionFloors,
  whereItAppears,
} from './monsters';

describe('monsterDescriptions', () => {
  it('gives every one of the 100 section monsters a description', () => {
    const missing = data.sections.flatMap((section) =>
      monsterDescriptions(section).flatMap((text, i) => (text ? [] : [`${section.section} ${section.monsters[i].name}`])),
    );
    expect(missing).toEqual([]);
  });

  it('joins the lines of a paragraph, keeping the hyphen of a word broken over two lines', () => {
    const [boss] = monsterDescriptions(data.sections[19]);
    expect(boss).toBe(
      'This is the commander of all of the Dungeons of the Unfor-givin! It drains lots of things, so be extremely careful!',
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
