import { describe, expect, it } from 'vitest';
import {
  REV_EAST,
  REV_KEY,
  REV_KEY_BUTTONS,
  REV_NORTH,
  REV_SOUTH,
  REV_WEST,
  revArrowMode,
  revCompassArrow,
  revGameKey,
  revTurningArrow,
  revWrapFacing,
} from './keys';

function press(key: string, modifiers: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return { key, altKey: false, ctrlKey: false, metaKey: false, ...modifiers } as KeyboardEvent;
}

describe('revGameKey', () => {
  it('hands the loop the capital, since the dungeon compares capitals and folds nothing', () => {
    expect(revGameKey(press('D'))).toBe(REV_KEY.down);
    expect(revGameKey(press('d'))).toBe(REV_KEY.down);
    expect(revGameKey(press('#'))).toBe(REV_KEY.background);
  });

  it('reads the arrows as the negated scan codes behind their CHR$(0) pairs', () => {
    expect(revGameKey(press('ArrowUp'))).toBe(REV_KEY.arrowUp);
    expect(revGameKey(press('ArrowRight'))).toBe(REV_KEY.arrowRight);
    expect(revGameKey(press('ArrowDown'))).toBe(REV_KEY.arrowDown);
    expect(revGameKey(press('ArrowLeft'))).toBe(REV_KEY.arrowLeft);
    expect(revGameKey(press('F1'))).toBe(REV_KEY.f1);
    expect(revGameKey(press('Escape'))).toBe(REV_KEY.escape);
  });

  it('reads nothing for a key held with a modifier or one that types no character', () => {
    expect(revGameKey(press('d', { ctrlKey: true }))).toBeNull();
    expect(revGameKey(press('Shift'))).toBeNull();
  });
});

describe('the arrows', () => {
  it('faces and steps the way the arrow points in the compass mode', () => {
    expect(revCompassArrow(REV_KEY.arrowUp)).toBe(REV_NORTH);
    expect(revCompassArrow(REV_KEY.arrowRight)).toBe(REV_EAST);
    expect(revCompassArrow(REV_KEY.arrowDown)).toBe(REV_SOUTH);
    expect(revCompassArrow(REV_KEY.arrowLeft)).toBe(REV_WEST);
    expect(revCompassArrow(REV_KEY.down)).toBe(0);
  });

  it('steps forward or turns in the turning mode', () => {
    expect(revTurningArrow(REV_KEY.arrowUp)).toEqual({ turn: 0, step: true });
    expect(revTurningArrow(REV_KEY.arrowRight)).toEqual({ turn: 1, step: false });
    expect(revTurningArrow(REV_KEY.arrowDown)).toEqual({ turn: 2, step: false });
    expect(revTurningArrow(REV_KEY.arrowLeft)).toEqual({ turn: -1, step: false });
    expect(revTurningArrow(REV_KEY.down)).toBeNull();
  });

  it('wraps a facing the turns pushed outside 1 to 4', () => {
    expect(revWrapFacing(0)).toBe(REV_WEST);
    expect(revWrapFacing(5)).toBe(REV_NORTH);
    expect(revWrapFacing(6)).toBe(REV_EAST);
    expect(revWrapFacing(REV_SOUTH)).toBe(REV_SOUTH);
  });

  it('starts in the compass mode and switches on Escape', () => {
    expect(revArrowMode(0)).toBe('compass');
    expect(revArrowMode(1)).toBe('turning');
  });
});

it('gives every button a key the game reads', () => {
  const known = new Set<number>(Object.values(REV_KEY));
  for (const button of REV_KEY_BUTTONS) expect(known.has(button.key)).toBe(true);
});

it('offers the Return a kill waits at as a button of its own', () => {
  expect(REV_KEY_BUTTONS.map((button) => button.key)).toContain(REV_KEY.enter);
});
