import { describe, expect, it } from 'vitest';
import { UNFORGIVEN_MAP } from './game';

describe('the name of an exported floor', () => {
  it('names the file by module and floor, calling floor 0 the town', () => {
    expect(UNFORGIVEN_MAP.pngName(0, 0)).toBe('dotu-module-1-town.png');
    expect(UNFORGIVEN_MAP.pngName(4, 105)).toBe('dotu-module-5-floor-105.png');
    expect(UNFORGIVEN_MAP.pngName(0, -1500)).toBe('dotu-module-1-floor-minus-1500.png');
  });
});
