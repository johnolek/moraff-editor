import { describe, expect, it } from 'vitest';
import { gameKey, INTERCEPTED_KEYS, KEY, KEY_BUTTONS } from './keys';

/** A key event as a browser would hand one over. */
const press = (key: string, modifiers: Partial<KeyboardEvent> = {}) => ({ key, altKey: false, ctrlKey: false, metaKey: false, ...modifiers }) as KeyboardEvent;

describe('the key the game reads', () => {
  it('turns the arrows into the negative scan codes movecontrol dispatches on', () => {
    expect(gameKey(press('ArrowUp'))).toBe(-0x48);
    expect(gameKey(press('ArrowDown'))).toBe(-0x50);
    expect(gameKey(press('ArrowLeft'))).toBe(-0x4b);
    expect(gameKey(press('ArrowRight'))).toBe(-0x4d);
  });

  it('reads Home and Page Up, the two keys that turn without a sound', () => {
    expect(gameKey(press('Home'))).toBe(-0x47);
    expect(gameKey(press('PageUp'))).toBe(-0x49);
  });

  it('reads F1 as the help key', () => {
    expect(gameKey(press('F1'))).toBe(KEY.f1);
  });

  it('reads Enter and Escape', () => {
    expect(gameKey(press('Enter'))).toBe(0x0d);
    expect(gameKey(press('Escape'))).toBe(0x1b);
  });

  it('reads a letter as its lower-case byte whichever case it was typed in', () => {
    expect(gameKey(press('q'))).toBe(0x71);
    expect(gameKey(press('Q'))).toBe(0x71);
    expect(gameKey(press('u'))).toBe(KEY.up);
  });

  it('reads the digits the game’s menus take', () => {
    expect(gameKey(press('1'))).toBe(0x31);
    expect(gameKey(press('9'))).toBe(0x39);
  });

  it('reads Ctrl-F as the repeat-fight key and no other combination as anything', () => {
    expect(gameKey(press('f', { ctrlKey: true }))).toBe(KEY.repeatFight);
    expect(gameKey(press('q', { ctrlKey: true }))).toBeNull();
    expect(gameKey(press('q', { metaKey: true }))).toBeNull();
    expect(gameKey(press('ArrowUp', { altKey: true }))).toBeNull();
  });

  it('reads nothing for a key the game has no byte for', () => {
    expect(gameKey(press('Tab'))).toBeNull();
    expect(gameKey(press('F5'))).toBeNull();
    expect(gameKey(press('-'))).toBeNull();
  });
});

describe('the buttons under the game', () => {
  it('offers every key a browser would take for itself', () => {
    expect(INTERCEPTED_KEYS.map((button) => button.key)).toEqual([KEY.f1]);
  });

  it('names a key once each', () => {
    const keys = KEY_BUTTONS.map((button) => button.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('starts with the four the game’s own button bar starts with', () => {
    expect(KEY_BUTTONS.slice(0, 4).map((button) => button.label)).toEqual(['MOVE FORWARD', 'TURN LEFT', 'TURN AROUND', 'TURN RIGHT']);
  });
});
