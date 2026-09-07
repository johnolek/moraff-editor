import { describe, expect, it } from 'vitest';
import { tabFor, tabsFor, TABS } from './tabs';

describe('the tabs a game has', () => {
  it('is all of them for Dungeons of the Unforgiven', () => {
    expect(tabsFor('unforgiven')).toEqual(TABS);
  });

  it('is the Save Editor, the Monsters and New Character for Moraff’s World', () => {
    expect(tabsFor('moraffsWorld').map((tab) => tab.id)).toEqual(['editor', 'monsters', 'roller']);
  });
});

describe('the tab to show', () => {
  it('is the one asked for when the game has it', () => {
    expect(tabFor('moraffsWorld', 'roller')).toBe('roller');
    expect(tabFor('unforgiven', 'map')).toBe('map');
  });

  it('falls back to the Save Editor when the game has no such tab', () => {
    expect(tabFor('moraffsWorld', 'map')).toBe('editor');
    expect(tabFor('moraffsWorld', 'snake')).toBe('editor');
  });
});
