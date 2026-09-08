import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

const lowest: Rng = { random: () => 0 };

describe('the M key', () => {
  it('counts everything the character owns and takes the statement down again', async () => {
    const session = inTheTown(lowest, {
      money: 1200,
      bank: 40,
      crystals: 7,
      dollars: 3,
      children: 2,
      cultureStock: 9,
    });
    await press(session, KEY.money);
    expect(session.box).toContain('LIST OF ASSETS:');
    expect(session.box).toContain('RUBLES IN POCKET:1200');
    expect(session.box).toContain('RUBLES IN BANK:  40');
    expect(session.game.screen.map((line) => line.text)).toContain('YOUR FINANCIAL STATEMENT:');
    await press(session, KEY.escape);
    expect(session.box).toEqual([]);
    expect(session.game.screen).toEqual([]);
  });
});

describe('the O key', () => {
  it('turns the high speed option on and off', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.options);
    expect(session.box).toContain('YOUR SPECIAL OPTIONS MENU:');
    await press(session, 0x31);
    expect(session.game.highSpeed).toBe(true);
    expect(session.box).toContain('HIGH SPEED MODE IS NOW IN');
    await press(session, KEY.escape);
    await press(session, KEY.options);
    await press(session, 0x31);
    expect(session.game.highSpeed).toBe(false);
    expect(session.box).toContain('HIGH SPEED MODE IS NO');
  });

  it("gives the game's own answer about sound", async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.options);
    await press(session, 0x36);
    expect(session.box).toContain('SOUND DOES NOT DO MUCH IN');
  });

  it('says what it has instead for the switches that are the DOS screen', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.options);
    await press(session, 0x33);
    expect(session.box).toContain('THAT SWITCH IS FOR THE DOS');
  });

  it('changes nothing on escape', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.options);
    await press(session, KEY.escape);
    expect(session.game.highSpeed).toBe(false);
  });
});

describe('the G key', () => {
  it('shows the graphics menu and says the port draws no 3-D views', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.graphics);
    expect(session.box).toContain('2) WALL IMAGE TOGGLE (3-WAY)');
    await press(session, 0x34);
    expect(session.box).toContain('THE GRAPHICS MENU SETS UP THE');
  });
});

describe('the X and Z keys', () => {
  it('say what the game would do with a screen this port draws the map on', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.expandMap);
    expect(session.box).toContain('THE GAME WOULD FILL THE SCREEN');
    // The box waits for a key of its own, the way every print_menu_only does.
    await press(session, KEY.escape);
    await press(session, KEY.zoomView);
    expect(session.box).toContain('THE ZOOM MAP. THIS PORT DRAWS');
  });
});
