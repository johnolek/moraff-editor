import { afterEach, describe, expect, it } from 'vitest';
import { base64FromBytes } from '../bytes';
import { fromBase64, readStored, writeStored } from './storage';

/** Enough of the browser's Storage to stand in for it. */
export function fakeStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key: string) => items.get(key) ?? null,
    key: (index: number) => [...items.keys()][index] ?? null,
    removeItem: (key: string) => void items.delete(key),
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

function useStorage(storage: Storage | undefined): void {
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
}

afterEach(() => useStorage(undefined));

describe('base64', () => {
  it('round trips every byte value', () => {
    const all = Uint8Array.from({ length: 256 }, (_, index) => index);
    expect([...fromBase64(base64FromBytes(all))!]).toEqual([...all]);
  });

  it('is null for text that is not base64', () => {
    expect(fromBase64('not base64!!')).toBeNull();
  });
});

describe('the store', () => {
  it('gives back what was put in it', () => {
    useStorage(fakeStorage());
    expect(writeStored('key', 'value')).toBe(true);
    expect(readStored('key')).toBe('value');
  });

  it('reads nothing when there is no storage at all, and says nothing was kept', () => {
    useStorage(undefined);
    expect(writeStored('key', 'value')).toBe(false);
    expect(readStored('key')).toBeNull();
  });

  it('swallows a store that throws on every access', () => {
    useStorage({
      get length(): number {
        throw new Error('access denied');
      },
      clear: () => {},
      getItem: () => {
        throw new Error('access denied');
      },
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error('access denied');
      },
    });
    expect(writeStored('key', 'value')).toBe(false);
    expect(readStored('key')).toBeNull();
  });
});
