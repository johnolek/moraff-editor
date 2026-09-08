import { describe, expect, it } from 'vitest';
import { tabFor, tabsFor, TABS } from './tabs';

describe('the tabs a game has', () => {
  it('is all of them for Dungeons of the Unforgiven', () => {
    expect(tabsFor('unforgiven')).toEqual(TABS);
  });

  it('is the Map, Play, the Save Editor, the Monsters, Spells, Tidbits, New Character and Source for Moraff’s World', () => {
    expect(tabsFor('moraffsWorld').map((tab) => tab.id)).toEqual(['map', 'play', 'editor', 'monsters', 'spells', 'tidbits', 'roller', 'source']);
  });

  it('is the Map, Play, the Save Editor, the Monsters, Tidbits, New Character and Source for Moraff’s Revenge', () => {
    expect(tabsFor('revenge').map((tab) => tab.id)).toEqual(['map', 'play', 'editor', 'monsters', 'tidbits', 'roller', 'source']);
  });

  it('gives all three games the Play tab, since all three of them can be played', () => {
    expect(tabsFor('unforgiven').map((tab) => tab.id)).toContain('play');
    expect(tabsFor('moraffsWorld').map((tab) => tab.id)).toContain('play');
    expect(tabsFor('revenge').map((tab) => tab.id)).toContain('play');
    expect(tabFor('moraffsWorld', 'play')).toBe('play');
    expect(tabFor('revenge', 'play')).toBe('play');
  });

  it('calls the map tab DotU Map under that game and Map under the others', () => {
    expect(TABS.find((tab) => tab.id === 'map')?.label).toBe('DotU Map');
    expect(tabsFor('moraffsWorld').find((tab) => tab.id === 'map')?.label).toBe('Map');
    expect(tabsFor('revenge').find((tab) => tab.id === 'map')?.label).toBe('Map');
  });
});

describe('the tab to show', () => {
  it('is the one asked for when the game has it', () => {
    expect(tabFor('moraffsWorld', 'roller')).toBe('roller');
    expect(tabFor('moraffsWorld', 'spells')).toBe('spells');
    expect(tabFor('unforgiven', 'map')).toBe('map');
  });

  it('falls back to the Save Editor when the game has no such tab', () => {
    expect(tabFor('moraffsWorld', 'calculators')).toBe('editor');
    expect(tabFor('moraffsWorld', 'snake')).toBe('editor');
  });

  it('falls back to the Save Editor for Moraff’s Revenge too, now that it has one', () => {
    expect(tabFor('revenge', 'spells')).toBe('editor');
    expect(tabFor('revenge', 'editor')).toBe('editor');
    expect(tabFor('revenge', 'source')).toBe('source');
  });
});
