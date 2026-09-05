import { describe, expect, it } from 'vitest';
import data from '../game/dotu-data.json';
import { monsterDescriptions } from './monsters';

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
