import { Dungeon } from './unfmap.js';
import { UNFDUNG_B64 } from './unfdung.b64.js';

/** The UNFDUNG.BIN wall tile set shipped with the app. */
export function bundledTileset(): Uint8Array {
  return Uint8Array.from(atob(UNFDUNG_B64), (c) => c.charCodeAt(0));
}

export const bundledDungeon = new Dungeon(bundledTileset());
