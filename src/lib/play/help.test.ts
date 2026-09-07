import { describe, expect, it } from 'vitest';
import { HELP_TOPICS } from '../game/port/hints';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

describe('the F1 help menu', () => {
  it('pads every label out to the width the exe holds it at', async () => {
    const session = inTheTown({ random: () => 0 });
    await press(session, KEY.f1);
    const drawn = session.game.screen.map((line) => line.text);
    expect(drawn).toContain('A-CHANGE (A)RMOR               ');
    for (const topic of HELP_TOPICS) {
      expect(drawn).toContain(topic.label.padEnd(31));
    }
    await press(session, KEY.escape);
    expect(session.game.screen).toEqual([]);
  });
});
