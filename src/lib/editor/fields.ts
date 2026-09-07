import type { ScalarField, ScalarKind, TextEnumField, TextNumberField, TextRecord } from './schema';

export function readString(view: DataView, offset: number, maxLength: number): string {
  const bytes: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    const byte = view.getUint8(offset + i);
    if (byte === 0) break;
    bytes.push(byte);
  }
  return new TextDecoder('ascii').decode(new Uint8Array(bytes));
}

export function writeString(view: DataView, offset: number, maxLength: number, value: string): void {
  const encoded = new TextEncoder().encode(value).slice(0, maxLength);
  for (let i = 0; i < maxLength; i++) view.setUint8(offset + i, i < encoded.length ? encoded[i] : 0);
}

export function readNumber(view: DataView, kind: Exclude<ScalarKind, 'string'>, offset: number): number {
  switch (kind) {
    case 'uint8':
      return view.getUint8(offset);
    case 'int8':
      return view.getInt8(offset);
    case 'uint16':
      return view.getUint16(offset, true);
    case 'int16':
      return view.getInt16(offset, true);
    case 'uint32':
      return view.getUint32(offset, true);
    case 'int32':
      return view.getInt32(offset, true);
    case 'float32':
      return view.getFloat32(offset, true);
    case 'float64':
      return view.getFloat64(offset, true);
  }
}

export function writeNumber(view: DataView, kind: Exclude<ScalarKind, 'string'>, offset: number, value: number): void {
  switch (kind) {
    case 'uint8':
      view.setUint8(offset, value & 0xff);
      break;
    case 'int8':
      view.setInt8(offset, value);
      break;
    case 'uint16':
      view.setUint16(offset, value >>> 0, true);
      break;
    case 'int16':
      view.setInt16(offset, value, true);
      break;
    case 'uint32':
      view.setUint32(offset, value >>> 0, true);
      break;
    case 'int32':
      view.setInt32(offset, value, true);
      break;
    case 'float32':
      view.setFloat32(offset, value, true);
      break;
    case 'float64':
      view.setFloat64(offset, value, true);
      break;
  }
}

export function readScalar(view: DataView, field: ScalarField): string | number {
  if (field.kind === 'string') return readString(view, field.offset, field.length ?? 0);
  return readNumber(view, field.kind, field.offset);
}

export function writeScalar(view: DataView, field: ScalarField, value: string | number): void {
  if (field.kind === 'string') writeString(view, field.offset, field.length ?? 0, String(value));
  else writeNumber(view, field.kind, field.offset, Number(value));
}

export function readFlag(view: DataView, offset: number): boolean {
  return view.getUint8(offset) !== 0;
}

export function writeFlag(view: DataView, offset: number, on: boolean): void {
  view.setUint8(offset, on ? 1 : 0);
}

export const INT_RANGES: Partial<Record<ScalarKind, [number, number]>> = {
  uint8: [0, 255],
  int8: [-128, 127],
  uint16: [0, 65535],
  int16: [-32768, 32767],
  uint32: [0, 4294967295],
  int32: [-2147483648, 2147483647],
};

const KIND_LABELS: Record<ScalarKind, string> = {
  uint8: 'u8',
  int8: 'i8',
  uint16: 'u16',
  int16: 'i16',
  uint32: 'u32',
  int32: 'i32',
  float32: 'f32',
  float64: 'f64',
  string: 'string',
};

const FLOAT_RANGES: Partial<Record<ScalarKind, string>> = {
  float32: '±3.4 × 10³⁸ (any decimal)',
  float64: '±1.8 × 10³⁰⁸ (any decimal)',
};

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

/** Short caption such as "u16 · 0 to 65,535". */
export function describeFieldType(field: Pick<ScalarField, 'kind' | 'length'>): string {
  if (field.kind === 'string') return `string · max ${field.length} chars`;
  const range = INT_RANGES[field.kind];
  if (range) return `${KIND_LABELS[field.kind]} · ${NUMBER_FORMAT.format(range[0])} to ${NUMBER_FORMAT.format(range[1])}`;
  const floatRange = FLOAT_RANGES[field.kind];
  if (floatRange) return `${KIND_LABELS[field.kind]} · ${floatRange}`;
  return KIND_LABELS[field.kind];
}

export function hex(offset: number): string {
  return '0x' + offset.toString(16).padStart(4, '0');
}

/** The number a text field holds, as the game shows it: the shift taken off and the scale undone. */
export function readTextNumber(record: TextRecord, field: TextNumberField | TextEnumField): number {
  const stored = record.values[field.value - 1] ?? 0;
  if (field.kind === 'text_enum') return stored;
  return (stored - (field.shift ?? 0)) / (field.scale ?? 1);
}

/** Put a number back the way the file holds it, which is the same arithmetic the other way. */
export function writeTextNumber(record: TextRecord, field: TextNumberField | TextEnumField, value: number): void {
  if (field.kind === 'text_enum') record.values[field.value - 1] = value;
  else record.values[field.value - 1] = value * (field.scale ?? 1) + (field.shift ?? 0);
}

/** Short caption such as "value 14 · stored with 376 added". */
export function describeTextField(field: TextNumberField): string {
  const place = `value ${field.value}`;
  const scale = field.scale && field.scale !== 1 ? `${field.scale} × the number` : 'the number';
  if (!field.shift && (!field.scale || field.scale === 1)) return `${place} · stored as it is`;
  const shift = field.shift ? ` plus ${NUMBER_FORMAT.format(field.shift)}` : '';
  return `${place} · stored as ${scale}${shift}`;
}
