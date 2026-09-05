import { describe, expect, it } from 'vitest';
import data from '../game/dotu-data.json';
import { allMonsters, monsterDescriptions, monsterGroups } from './monsters';

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
