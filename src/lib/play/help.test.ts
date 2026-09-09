import { describe, expect, it } from 'vitest';
import { HELP_TOPICS } from '../game/port/hints';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

describe('the F1 help menu', () => {
  it('fades the play screen away before it builds the help', async () => {
    const session = inTheTown({ random: () => 0 });
    await press(session, KEY.help);
    // movecontrol runs FUN_4000_5c25 before it blanks the screen and draws the menu
    // (exe 2000:cddc), so the tab is still showing the play screen going dark over it.
    expect(session.view().fade).toBe('out');
  });

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
