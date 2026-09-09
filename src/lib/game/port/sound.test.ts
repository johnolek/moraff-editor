import { describe, expect, it } from 'vitest';
import { blowLandedTones, blowTakenTones, DEATH_TONES, MONSTER_KILLED_TONES } from './sound';

describe('the noises a fight makes', () => {
  it('sweeps up from 120 Hz to 200 Hz when the blow lands', () => {
    const tones = blowLandedTones();
    expect(tones).toHaveLength(9);
    expect(tones[0]).toEqual({ hz: 120, ms: 8 });
    expect(tones[8]).toEqual({ hz: 200, ms: 8 });
  });

  it('sweeps down from 700 Hz to 420 Hz when the monster lands one', () => {
    const tones = blowTakenTones();
    expect(tones).toHaveLength(15);
    expect(tones[0]).toEqual({ hz: 700, ms: 8 });
    expect(tones[14]).toEqual({ hz: 420, ms: 8 });
  });

  it('chirps twice over a dead monster and groans twice over a dead character', () => {
    expect(MONSTER_KILLED_TONES).toEqual([
      { hz: 680, ms: 140 },
      { hz: 710, ms: 110 },
    ]);
    expect(DEATH_TONES).toEqual([
      { hz: 140, ms: 740 },
      { hz: 90, ms: 670 },
    ]);
  });
});
