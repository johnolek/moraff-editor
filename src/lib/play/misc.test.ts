import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { newGame, type Game } from '../game/port/state';
import { inTheTown, press } from './battle.test-support';
import type { GameSession } from './engine';
import { BOSS_KIND } from './floor';
import { KEY } from './keys';
import { bossSignpost } from './misc';

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

  it('steps the colour setting round its four values without saying anything', async () => {
    const session = inTheTown(lowest);
    expect(session.game.colourSetting).toBe(0);
    for (const want of [1, 2, 3, 0]) {
      await press(session, KEY.options);
      const menu = [...session.box];
      await press(session, 0x32);
      expect(session.game.colourSetting).toBe(want);
      // The game answers this switch by redrawing, so the menu is left as it stands.
      expect(session.box).toEqual(menu);
    }
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

describe('the Z key', () => {
  it('says what the game would do with a screen this port draws the map on', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.zoomView);
    expect(session.box).toContain('THE ZOOM MAP. THIS PORT DRAWS');
  });
});

describe('the X key', () => {
  /** What the game has drawn over the whole display. */
  const drawn = (session: GameSession): string[] => session.view().screen.map((line) => line.text);

  it('fills the screen with the floor and takes it down again on a key', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.expandMap);
    expect(session.view().expandedMap).toBe(true);
    expect(drawn(session)).toEqual(['EXPANDED DUNGEON MAP, HIT ANY KEY...']);
    await press(session, KEY.escape);
    expect(session.view().expandedMap).toBe(false);
    expect(drawn(session)).toEqual([]);
  });

  it('empties the message box on the way in, the way erase_menu_block does', async () => {
    const session = inTheTown(lowest, { money: 5 });
    await press(session, KEY.money);
    expect(session.box).toContain('LIST OF ASSETS:');
    await press(session, KEY.escape);
    await press(session, KEY.expandMap);
    expect(session.box).toEqual([]);
  });

  it('says nothing about the way to go on a floor with no boss standing', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.expandMap);
    expect(drawn(session).some((line) => line.startsWith('GO '))).toBe(false);
  });
});

describe('the way to the boss the expanded map prints', () => {
  /** A game with the section's Shadow boss standing in slot 0, where stock_level puts him. */
  function withBossAt(x: number, y: number): Game {
    const game = newGame();
    Object.assign(game.monsters[0], { x, y, type: BOSS_KIND, hp: 10 });
    Object.assign(game.pc, { x: 40, y: 40 });
    return game;
  }

  const wayTo = (x: number, y: number): string | null => bossSignpost(withBossAt(x, y))?.text ?? null;

  it('names the axis with further to go', () => {
    expect(wayTo(20, 45)).toBe('GO WEST');
    expect(wayTo(60, 45)).toBe('GO EAST');
    expect(wayTo(45, 20)).toBe('GO NORTH');
    expect(wayTo(45, 60)).toBe('GO SOUTH');
  });

  it('gives a tie between the two axes to north and south', () => {
    expect(wayTo(30, 30)).toBe('GO NORTH');
    expect(wayTo(50, 50)).toBe('GO SOUTH');
  });

  it('says nothing at all unless slot 0 still holds the boss', () => {
    const game = withBossAt(20, 45);
    game.monsters[0].type = 0;
    expect(bossSignpost(game)).toBeNull();
  });

  it('is drawn in the corner the map itself does not reach', () => {
    expect(bossSignpost(withBossAt(20, 45))).toEqual({
      text: 'GO WEST',
      x: 0x4b0,
      y: 0x442,
      font: 0,
      colour: 4,
    });
  });
});
