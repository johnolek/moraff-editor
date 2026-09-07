import { describe, expect, it } from 'vitest';
import { MW_KEY, mwGameKey } from './keys';

const press = (key: string, modifiers: Partial<KeyboardEvent> = {}) =>
  mwGameKey({ key, altKey: false, metaKey: false, ctrlKey: false, ...modifiers } as KeyboardEvent);

describe('mwGameKey', () => {
  it('hands a letter over in lower case, which is what movecontrol dispatches on', () => {
    expect(press('L')).toBe(MW_KEY.loseItem);
    expect(press('l')).toBe(MW_KEY.loseItem);
  });

  it('hands over the three palette keys, which type punctuation rather than a letter', () => {
    expect(press('(')).toBe(MW_KEY.paletteGreen);
    expect(press(')')).toBe(MW_KEY.paletteBlue);
    expect(press('*')).toBe(MW_KEY.paletteRed);
  });

  it('names the keys that type nothing', () => {
    expect(press('ArrowUp')).toBe(MW_KEY.arrowUp);
    expect(press('Escape')).toBe(MW_KEY.escape);
    expect(press('F1')).toBe(MW_KEY.f1);
  });

  it('leaves a key held with a modifier to the browser', () => {
    expect(press('f', { ctrlKey: true })).toBe(null);
    expect(press('Tab')).toBe(null);
  });
});
