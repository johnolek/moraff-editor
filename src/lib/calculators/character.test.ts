import { describe, expect, it } from 'vitest';
import { changedFields } from './character';

describe('the fields a calculator has changed', () => {
  it('are the ones that no longer hold the character\'s value', () => {
    expect(changedFields({ lev: 12, luck: 30 }, { lev: 45, luck: 30 })).toEqual({ lev: true, luck: false });
  });

  it('are none at all when there is no character to compare against', () => {
    expect(changedFields({ lev: 12 }, null)).toEqual({});
  });

  it('compare a list of what is owned by its contents', () => {
    expect(changedFields({ owned: [1, 2] }, { owned: [1, 2] })).toEqual({ owned: false });
    expect(changedFields({ owned: [1, 2] }, { owned: [2, 1] })).toEqual({ owned: true });
  });
});
