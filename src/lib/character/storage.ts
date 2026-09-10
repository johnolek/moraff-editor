import { base64FromBytes, bytesFromBase64 } from '../bytes';

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

/** Whether the value is now in the store. A browser with no store, and one whose store is full,
 *  both come back false: nothing was kept either way. */
export function writeStored(key: string, value: string): boolean {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Every key the store holds, as a list of its own, so that a caller may take keys out of the
 *  store while it walks them. */
export function storedKeys(): string[] {
  const store = storage();
  if (store === null) return [];
  try {
    return Array.from({ length: store.length }, (_, at) => store.key(at)).filter((key) => key !== null);
  } catch {
    return [];
  }
}

/** Take a key out of the store. A browser with no store has nothing to take out of it. */
export function removeStored(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // A store that will not answer has not kept the key either.
  }
}

/** The bytes a stored base64 string holds, or null when the store holds something that is not
 *  base64 at all -- anything may have written to it, so a bad value is answered rather than
 *  thrown. */
export function fromBase64(text: string): Uint8Array<ArrayBuffer> | null {
  try {
    return bytesFromBase64(text);
  } catch {
    return null;
  }
}
