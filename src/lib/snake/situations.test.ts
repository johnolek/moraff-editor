import { describe, expect, it } from 'vitest';
import { decompSection } from '../source/decomp';
import { allHints, HINT_COUNT, TABLET_COUNT } from '../game/port/hints';
import { portFunction } from '../source/ports';
import { SITUATIONS } from './situations';

const placements = SITUATIONS.flatMap((situation) => situation.entries);

describe('the situations every message belongs to', () => {
  it('places every message of UH.BIN and UH2.BIN exactly once', () => {
    const counted = new Map<string, number>();
    for (const entry of placements) {
      const key = `${entry.file}:${entry.index}`;
      counted.set(key, (counted.get(key) ?? 0) + 1);
    }
    const expected = [
      ...Array.from({ length: HINT_COUNT }, (unused, index) => `uh.bin:${index}`),
      ...Array.from({ length: TABLET_COUNT }, (unused, index) => `uh2.bin:${index}`),
    ];
    for (const key of expected) expect(counted.get(key), key).toBe(1);
    expect(counted.size).toBe(expected.length);
  });

  it('places nothing the files do not hold', () => {
    const known = new Set(allHints().map((entry) => `${entry.file}:${entry.index}`));
    for (const entry of placements) expect(known.has(`${entry.file}:${entry.index}`), `${entry.file}:${entry.index}`).toBe(true);
  });

  it('says who hears every message', () => {
    for (const entry of placements) expect(entry.who.trim(), `${entry.file}:${entry.index}`).not.toBe('');
  });

  it('names a decompiled function and a ported one that really exist', () => {
    for (const situation of SITUATIONS) {
      expect(decompSection(situation.c), situation.id).not.toBeNull();
      if (situation.ts) {
        expect(portFunction('src/lib/game/port/hints.ts', situation.ts), situation.id).not.toBeNull();
      }
    }
  });
});
