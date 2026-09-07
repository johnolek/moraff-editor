import { MwDungeon } from './mwmap.js';
import { DUNG_B64 } from './dung.b64.js';

/** The DUNG.BIN wall tile set shipped with the app. */
export function bundledMwTileset(): Uint8Array {
  return Uint8Array.from(atob(DUNG_B64), (c) => c.charCodeAt(0));
}

export const bundledMwDungeon = new MwDungeon(bundledMwTileset());
