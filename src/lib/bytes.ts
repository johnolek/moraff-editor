/**
 * Bytes as text, which is how they travel through the parts of the browser that only carry
 * strings: the bundled `.pic` files, which Vite hands over as `data:` URLs, and localStorage,
 * which keeps a character's record and explored maps.
 */

/** The bytes of a base64 string. Throws on a string that is not base64, the way `atob` does. */
export function bytesFromBase64(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let at = 0; at < binary.length; at++) bytes[at] = binary.charCodeAt(at);
  return bytes;
}

/** Whether two runs of bytes hold the same bytes. */
export function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((byte, at) => byte === right[at]);
}

export function base64FromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** The bytes a `data:` URL holds, whatever its media type says they are. */
export function bytesFromDataUrl(url: string): Uint8Array<ArrayBuffer> {
  return bytesFromBase64(url.slice(url.indexOf(',') + 1));
}
