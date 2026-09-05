import { describe, expect, it } from 'vitest';
import { describeFieldType, hex, readFlag, readNumber, readScalar, readString, writeFlag, writeNumber, writeScalar, writeString } from './fields';

function view(size = 32): DataView {
  return new DataView(new ArrayBuffer(size));
}

describe('numbers', () => {
  it.each([
    ['uint8', 200],
    ['int8', -5],
    ['uint16', 65000],
    ['int16', -12345],
    ['uint32', 4000000000],
    ['int32', -2000000000],
    ['float32', 1.5],
    ['float64', 5.3e15],
  ] as const)('round-trips %s', (kind, value) => {
    const v = view();
    writeNumber(v, kind, 4, value);
    expect(readNumber(v, kind, 4)).toBe(value);
  });

  it('writes little-endian', () => {
    const v = view();
    writeNumber(v, 'int16', 0, 0x1234);
    expect(v.getUint8(0)).toBe(0x34);
    expect(v.getUint8(1)).toBe(0x12);
  });

  it('wraps out-of-range bytes the way the old editor did', () => {
    const v = view();
    writeNumber(v, 'uint8', 0, 300);
    expect(readNumber(v, 'uint8', 0)).toBe(44);
  });
});

describe('strings', () => {
  it('stops at the first zero byte and pads with zeros on write', () => {
    const v = view();
    writeString(v, 2, 8, 'LUCKSTER');
    expect(readString(v, 2, 8)).toBe('LUCKSTER');
    writeString(v, 2, 8, 'AL');
    expect(readString(v, 2, 8)).toBe('AL');
    expect(v.getUint8(4)).toBe(0);
    expect(v.getUint8(9)).toBe(0);
  });

  it('truncates to the field length', () => {
    const v = view();
    writeString(v, 0, 4, 'MORAFF');
    expect(readString(v, 0, 4)).toBe('MORA');
    expect(v.getUint8(4)).toBe(0);
  });
});

describe('scalars and flags', () => {
  it('dispatches on the field kind', () => {
    const v = view();
    writeScalar(v, { kind: 'string', offset: 0, length: 6, label: 'Name' }, 'ELF');
    writeScalar(v, { kind: 'int16', offset: 8, label: 'HP' }, '-3');
    expect(readScalar(v, { kind: 'string', offset: 0, length: 6, label: 'Name' })).toBe('ELF');
    expect(readScalar(v, { kind: 'int16', offset: 8, label: 'HP' })).toBe(-3);
  });

  it('treats any non-zero byte as on and writes 1/0', () => {
    const v = view();
    v.setUint8(3, 7);
    expect(readFlag(v, 3)).toBe(true);
    writeFlag(v, 3, false);
    expect(v.getUint8(3)).toBe(0);
    writeFlag(v, 3, true);
    expect(v.getUint8(3)).toBe(1);
  });
});

describe('captions', () => {
  it('describes each kind', () => {
    expect(describeFieldType({ kind: 'uint16' })).toBe('u16 · 0 to 65,535');
    expect(describeFieldType({ kind: 'int8' })).toBe('i8 · -128 to 127');
    expect(describeFieldType({ kind: 'float64' })).toBe('f64 · ±1.8 × 10³⁰⁸ (any decimal)');
    expect(describeFieldType({ kind: 'string', length: 18 })).toBe('string · max 18 chars');
  });

  it('formats offsets as 4-digit hex', () => {
    expect(hex(0x7ac)).toBe('0x07ac');
  });
});
