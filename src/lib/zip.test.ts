import { describe, expect, it } from 'vitest';
import { crc32, zipBytes, type ZipEntry } from './zip';

/** The files a zip holds, read back out of its central directory the way an unzipper does. */
function unzip(zip: Uint8Array<ArrayBuffer>): ZipEntry[] {
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  let end = zip.length - 22;
  while (end >= 0 && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < 0) throw new Error('no end of central directory');
  const count = view.getUint16(end + 10, true);
  const files: ZipEntry[] = [];
  let at = view.getUint32(end + 16, true);
  for (let index = 0; index < count; index++) {
    if (view.getUint32(at, true) !== 0x02014b50) throw new Error('no central directory entry');
    const nameLength = view.getUint16(at + 28, true);
    const size = view.getUint32(at + 24, true);
    const crc = view.getUint32(at + 16, true);
    const local = view.getUint32(at + 42, true);
    if (view.getUint32(local, true) !== 0x04034b50) throw new Error('no local file header');
    const name = String.fromCharCode(...zip.subarray(at + 46, at + 46 + nameLength));
    const from = local + 30 + view.getUint16(local + 26, true);
    const bytes = zip.subarray(from, from + size);
    if (crc32(bytes) !== crc) throw new Error(`${name} does not match its checksum`);
    files.push({ name, bytes });
    at += 46 + nameLength;
  }
  return files;
}

describe('crc32', () => {
  it('is the one the zip format asks for', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
    expect(crc32(new Uint8Array(0))).toBe(0);
  });
});

describe('a zip of a few small files', () => {
  it('gives every file back under its own name', () => {
    const files = [
      { name: 'D00.DUN', bytes: new Uint8Array([1, 2, 3]) },
      { name: 'D10.DUN', bytes: new Uint8Array(1116).fill(0xff) },
    ];

    const read = unzip(zipBytes(files));

    expect(read.map((file) => file.name)).toEqual(['D00.DUN', 'D10.DUN']);
    expect([...read[0].bytes]).toEqual([1, 2, 3]);
    expect([...read[1].bytes]).toEqual([...files[1].bytes]);
  });

  it('holds an empty file, and a zip of nothing at all is just the end record', () => {
    expect(unzip(zipBytes([{ name: '0.BIN', bytes: new Uint8Array(0) }]))[0].bytes).toHaveLength(0);
    expect(zipBytes([])).toHaveLength(22);
    expect(unzip(zipBytes([]))).toEqual([]);
  });

  it('writes the same bytes every time, since the timestamp is fixed', () => {
    const files = [{ name: '30.DUN', bytes: new Uint8Array([9, 9]) }];
    expect([...zipBytes(files)]).toEqual([...zipBytes(files)]);
  });
});
