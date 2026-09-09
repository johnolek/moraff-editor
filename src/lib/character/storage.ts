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

/**
 * One key of the store holding a JSON object.
 *
 * Reading a key that has never been written, or that holds anything but an object, gives a new
 * empty object, so a caller can always write into what it reads back.
 */
export function jsonStore<T extends object>(key: string): {
  read(): T;
  write(value: T): void;
  clear(): void;
} {
  return {
    read() {
      const text = readStored(key);
      if (!text) return {} as T;
      try {
        const parsed: unknown = JSON.parse(text);
        return typeof parsed === 'object' && parsed !== null ? (parsed as T) : ({} as T);
      } catch {
        return {} as T;
      }
    },
    write(value) {
      writeStored(key, JSON.stringify(value));
    },
    clear() {
      writeStored(key, JSON.stringify({}));
    },
  };
}

/** One key of the store holding a run of bytes, base64 encoded. Reading gives null when there
 *  are none there. */
export function blobStore(key: string): {
  read(): Uint8Array<ArrayBuffer> | null;
  write(bytes: Uint8Array): void;
  clear(): void;
} {
  return {
    read() {
      const text = readStored(key);
      return text ? fromBase64(text) : null;
    },
    write(bytes) {
      writeStored(key, base64FromBytes(bytes));
    },
    clear() {
      writeStored(key, '');
    },
  };
}
