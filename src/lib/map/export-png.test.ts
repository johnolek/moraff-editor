import { describe, expect, it } from 'vitest';
import { floorPngName } from './export-png';

describe('floorPngName', () => {
  it('names the file by module and floor, calling floor 0 the town', () => {
    expect(floorPngName(0, 0)).toBe('dotu-module-1-town.png');
    expect(floorPngName(4, 105)).toBe('dotu-module-5-floor-105.png');
    expect(floorPngName(0, -1500)).toBe('dotu-module-1-floor-minus-1500.png');
  });
});
