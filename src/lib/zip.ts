/**
 * A zip of a few small files, stored rather than compressed.
 *
 * A browser hands the user one file per click, and a character can have several explored-map
 * files beside them, so they travel together. Storing rather than deflating is a local file
 * header, a central directory entry and a checksum per file, and brings in no compressor.
 */

export interface ZipEntry {
  name: string;
  bytes: Uint8Array<ArrayBuffer>;
}

const LOCAL_HEADER = 0x04034b50;
const CENTRAL_HEADER = 0x02014b50;
const END_OF_DIRECTORY = 0x06054b50;
const LOCAL_HEADER_BYTES = 30;
const CENTRAL_HEADER_BYTES = 46;
const END_BYTES = 22;

/** Version 2.0, which is what every writer puts in both version fields for a stored entry. */
const VERSION = 20;
const STORED = 0;

/** 1 January 1980, the earliest a DOS timestamp can say, so that the same map always makes the
 *  same zip. */
const DOS_TIME = 0;
const DOS_DATE = 0x0021;

const CRC_TABLE = crcTable();

function crcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index++) {
    let value = index;
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
}

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** The bytes of a zip holding these files, in the order they are given. Names are ASCII. */
export function zipBytes(files: readonly ZipEntry[]): Uint8Array<ArrayBuffer> {
  const named = files.map((file) => ({ ...file, name: asciiBytes(file.name), crc: crc32(file.bytes) }));
  const localBytes = named.reduce((total, file) => total + LOCAL_HEADER_BYTES + file.name.length + file.bytes.length, 0);
  const directoryBytes = named.reduce((total, file) => total + CENTRAL_HEADER_BYTES + file.name.length, 0);
  const zip = new Uint8Array(localBytes + directoryBytes + END_BYTES);
  const view = new DataView(zip.buffer);

  const offsets: number[] = [];
  let at = 0;
  for (const file of named) {
    offsets.push(at);
    view.setUint32(at, LOCAL_HEADER, true);
    view.setUint16(at + 4, VERSION, true);
    view.setUint16(at + 8, STORED, true);
    view.setUint16(at + 10, DOS_TIME, true);
    view.setUint16(at + 12, DOS_DATE, true);
    view.setUint32(at + 14, file.crc, true);
    view.setUint32(at + 18, file.bytes.length, true);
    view.setUint32(at + 22, file.bytes.length, true);
    view.setUint16(at + 26, file.name.length, true);
    zip.set(file.name, at + LOCAL_HEADER_BYTES);
    zip.set(file.bytes, at + LOCAL_HEADER_BYTES + file.name.length);
    at += LOCAL_HEADER_BYTES + file.name.length + file.bytes.length;
  }

  const directory = at;
  named.forEach((file, index) => {
    view.setUint32(at, CENTRAL_HEADER, true);
    view.setUint16(at + 4, VERSION, true);
    view.setUint16(at + 6, VERSION, true);
    view.setUint16(at + 10, STORED, true);
    view.setUint16(at + 12, DOS_TIME, true);
    view.setUint16(at + 14, DOS_DATE, true);
    view.setUint32(at + 16, file.crc, true);
    view.setUint32(at + 20, file.bytes.length, true);
    view.setUint32(at + 24, file.bytes.length, true);
    view.setUint16(at + 28, file.name.length, true);
    view.setUint32(at + 42, offsets[index], true);
    zip.set(file.name, at + CENTRAL_HEADER_BYTES);
    at += CENTRAL_HEADER_BYTES + file.name.length;
  });

  view.setUint32(at, END_OF_DIRECTORY, true);
  view.setUint16(at + 8, named.length, true);
  view.setUint16(at + 10, named.length, true);
  view.setUint32(at + 12, directoryBytes, true);
  view.setUint32(at + 16, directory, true);
  return zip;
}

function asciiBytes(name: string): Uint8Array {
  const bytes = new Uint8Array(name.length);
  for (let index = 0; index < name.length; index++) bytes[index] = name.charCodeAt(index) & 0x7f;
  return bytes;
}
