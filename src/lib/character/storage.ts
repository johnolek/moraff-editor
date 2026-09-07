import type { CurrentCharacter } from '../app-state.svelte';

/** Where the current character is kept between visits. */
const CHARACTER_KEY = 'moraff-tools.character';

/** The character record as it goes into storage: the bytes as base64, everything else as it is. */
interface StoredCharacter {
  game: string;
  name: string;
  slot: number | null;
  bytes: string;
}

/**
 * The browser's localStorage, or null when there is none to be had. Reading it throws outright
 * in a browser set to block site data, so every access goes through here.
 */
export function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readStored(key: string): string | null {
  try {
    return storage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    storage()?.setItem(key, value);
  } catch {
    // A full or blocked store only costs the user the memory of what they were doing.
  }
}

export function removeStored(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // As above.
  }
}

export function toBase64(bytes: Uint8Array): string {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

export function fromBase64(text: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

/** What was stored for the current character, or null when there is nothing usable there. */
export function storedCharacter(): CurrentCharacter | null {
  const text = readStored(CHARACTER_KEY);
  if (!text) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return characterFrom(parsed);
}

export function rememberCharacter(character: CurrentCharacter | null): void {
  if (!character) {
    removeStored(CHARACTER_KEY);
    return;
  }
  const stored: StoredCharacter = {
    game: character.game,
    name: character.name,
    slot: character.slot,
    bytes: toBase64(character.bytes),
  };
  writeStored(CHARACTER_KEY, JSON.stringify(stored));
}

/** A stored character is only taken when every field is the shape this build expects. */
function characterFrom(value: unknown): CurrentCharacter | null {
  if (typeof value !== 'object' || value === null) return null;
  const { game, name, slot, bytes } = value as Partial<StoredCharacter>;
  if (typeof game !== 'string' || typeof name !== 'string' || typeof bytes !== 'string') return null;
  if (slot !== null && !Number.isInteger(slot)) return null;
  const decoded = fromBase64(bytes);
  if (!decoded || decoded.length === 0) return null;
  return { game, name, slot: slot ?? null, bytes: decoded };
}
