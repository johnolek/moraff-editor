import { describe, expect, it } from 'vitest';
import { keyAction } from './keyboard';

describe('keyAction', () => {
  it('walks with the arrows', () => {
    expect(keyAction('ArrowUp')).toEqual({ kind: 'walk', dx: 0, dy: -1 });
    expect(keyAction('ArrowDown')).toEqual({ kind: 'walk', dx: 0, dy: 1 });
    expect(keyAction('ArrowLeft')).toEqual({ kind: 'walk', dx: -1, dy: 0 });
    expect(keyAction('ArrowRight')).toEqual({ kind: 'walk', dx: 1, dy: 0 });
  });

  it('climbs with U and D, shifted or not, the keys the game uses', () => {
    expect(keyAction('u')).toEqual({ kind: 'climb', direction: 'up' });
    expect(keyAction('U')).toEqual({ kind: 'climb', direction: 'up' });
    expect(keyAction('d')).toEqual({ kind: 'climb', direction: 'down' });
    expect(keyAction('D')).toEqual({ kind: 'climb', direction: 'down' });
  });

  it('changes floor with PgUp/PgDn, PgDn going deeper', () => {
    expect(keyAction('PageUp')).toEqual({ kind: 'floor', delta: -1 });
    expect(keyAction('PageDown')).toEqual({ kind: 'floor', delta: 1 });
  });

  it('zooms with plus and minus, shifted or not', () => {
    expect(keyAction('+')).toEqual({ kind: 'zoom', direction: 1 });
    expect(keyAction('=')).toEqual({ kind: 'zoom', direction: 1 });
    expect(keyAction('-')).toEqual({ kind: 'zoom', direction: -1 });
    expect(keyAction('_')).toEqual({ kind: 'zoom', direction: -1 });
  });

  it('ignores everything else, Enter included', () => {
    expect(keyAction('Enter')).toBeNull();
    expect(keyAction('a')).toBeNull();
    expect(keyAction('Escape')).toBeNull();
  });
});
