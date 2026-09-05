import { describe, expect, it } from 'vitest';
import { keyAction } from './keyboard';

describe('keyAction', () => {
  it('moves the cursor with the arrows', () => {
    expect(keyAction('ArrowUp')).toEqual({ kind: 'move', dx: 0, dy: -1 });
    expect(keyAction('ArrowDown')).toEqual({ kind: 'move', dx: 0, dy: 1 });
    expect(keyAction('ArrowLeft')).toEqual({ kind: 'move', dx: -1, dy: 0 });
    expect(keyAction('ArrowRight')).toEqual({ kind: 'move', dx: 1, dy: 0 });
  });

  it('changes floor with PgUp/PgDn, PgDn going deeper', () => {
    expect(keyAction('PageUp')).toEqual({ kind: 'floor', delta: -1 });
    expect(keyAction('PageDown')).toEqual({ kind: 'floor', delta: 1 });
  });

  it('follows with Enter and zooms with plus and minus, shifted or not', () => {
    expect(keyAction('Enter')).toEqual({ kind: 'follow' });
    expect(keyAction('+')).toEqual({ kind: 'zoom', direction: 1 });
    expect(keyAction('=')).toEqual({ kind: 'zoom', direction: 1 });
    expect(keyAction('-')).toEqual({ kind: 'zoom', direction: -1 });
    expect(keyAction('_')).toEqual({ kind: 'zoom', direction: -1 });
  });

  it('ignores everything else', () => {
    expect(keyAction('a')).toBeNull();
    expect(keyAction('Escape')).toBeNull();
  });
});
