import { afterEach, describe, expect, it } from 'vitest';
import { fromBase64, rememberCharacter, storedCharacter, toBase64 } from './storage';

/** Enough of the browser's Storage to stand in for it, plus a switch for a store that throws. */
class FakeStorage implements Storage {
  private items = new Map<string, string>();

  constructor(readonly broken = false) {}

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    if (this.broken) throw new Error('access denied');
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    if (this.broken) throw new Error('access denied');
    this.items.set(key, value);
  }
}

function useStorage(storage: Storage | undefined): void {
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
}

afterEach(() => useStorage(undefined));

const bytes = (values: number[]) => Uint8Array.from(values);

describe('base64', () => {
  it('round trips every byte value', () => {
    const all = Uint8Array.from({ length: 256 }, (_, index) => index);
    expect([...fromBase64(toBase64(all))!]).toEqual([...all]);
  });

  it('is null for text that is not base64', () => {
    expect(fromBase64('not base64!!')).toBeNull();
  });
});

describe('the stored character', () => {
  it('comes back as it went in', () => {
    useStorage(new FakeStorage());
    rememberCharacter({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes: bytes([1, 2, 3, 255]) });
    const restored = storedCharacter();
    expect(restored).toEqual({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes: bytes([1, 2, 3, 255]) });
  });

  it('keeps a character with no slot', () => {
    useStorage(new FakeStorage());
    rememberCharacter({ game: 'moraffsWorld', name: 'HERO', slot: null, bytes: bytes([7]) });
    expect(storedCharacter()?.slot).toBeNull();
  });

  it('is null once the character is cleared', () => {
    useStorage(new FakeStorage());
    rememberCharacter({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes: bytes([1]) });
    rememberCharacter(null);
    expect(storedCharacter()).toBeNull();
  });

  it('is null when there is no storage at all', () => {
    useStorage(undefined);
    rememberCharacter({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes: bytes([1]) });
    expect(storedCharacter()).toBeNull();
  });

  it('is null when the store throws on every access', () => {
    useStorage(new FakeStorage(true));
    rememberCharacter({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes: bytes([1]) });
    expect(storedCharacter()).toBeNull();
  });

  it('is null when what was stored is not a character', () => {
    const storage = new FakeStorage();
    useStorage(storage);
    storage.setItem('moraff-tools.character', '{"game":"unforgiven"}');
    expect(storedCharacter()).toBeNull();
  });
});
