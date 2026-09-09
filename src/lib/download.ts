/**
 * Handing the browser a file to save.
 *
 * Every download on the site goes the same way: an object URL over the bytes, an `<a download>`
 * clicked without ever being on the page, and the URL let go again. The site has no server, so
 * this is the only way a file leaves it.
 */

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/** Bytes as a file of their own, the way the games' own files are: a character's record, an
 *  explored map, or a zip of several. */
export function downloadBytes(bytes: Uint8Array<ArrayBuffer>, name: string): void {
  downloadBlob(new Blob([bytes], { type: 'application/octet-stream' }), name);
}

/** A value as indented JSON, which is what a run log downloads as. */
export function downloadJson(value: unknown, name: string): void {
  downloadBlob(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }), name);
}
