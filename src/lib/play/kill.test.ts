import { describe, expect, it } from 'vitest';
import { expValue } from '../game/port/combat';
import { GARBAGE_CAN } from '../game/port/kills';
import { WEAPON_NAMES } from '../game/port/drops';
import { MENU_LINE_STEP, MENU_TOP, MENU_X, MESSAGE_LINE_Y } from '../game/port/screens';
import { SeededRng, type Rng } from '../game/port/rng';
import { facingAMonster, inTheTown, press, townSquare, TAKE, LEAVE } from './battle.test-support';
import type { GameSession } from './engine';
import { KEY } from './keys';

/** A generator that rolls the lowest number it can, which is what makes every drop land. */
const lowest: Rng = { random: () => 0 };

/** What the tab draws in the message box, which is where the kill's own four messages go: the
 *  bar along its top is the strip kill_monster writes on. */
const boxText = (session: GameSession): string[] => session.view().box.map((line) => line.text);

describe('killing the monster being fought', () => {
  it('hands over the experience and parks the slot in the garbage can', async () => {
    const session = await facingAMonster(lowest, { cls: 2 });
    const game = session.game;
    const monster = game.monsters[0];
    const worth = expValue(game, 0);
    const before = game.pc.exp;
    monster.hp = 0;
    await press(session, 0x1b);
    expect(game.pc.exp).toBe(before + worth);
    // A monk is refused every drop, so the kill draws its one line and asks for no key at all.
    // The hit points line the battle banner was drawn with is still on the block underneath it:
    // nothing wipes the block for a kill, and the screen the delay holds is the screen as it was.
    expect(boxText(session)).toEqual(['IT HAS 50 HEALTH POINTS LEFT', 'YOU KILLED IT!']);
    expect(session.box).toEqual([]);
    expect([monster.x, monster.y]).toEqual([GARBAGE_CAN, GARBAGE_CAN]);
    expect(session.view().engaged).toBeNull();
    expect(session.view().monsters).toEqual([]);
  });

  it('holds the kill\'s own line while the drop it runs into is already drawn', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    const game = session.game;
    game.monsters[0].hp = 0;
    await press(session, 0x1b);
    // "YOU KILLED IT!" and "GOOD NEWS..." are drawn at the same x and y, so the game has only
    // the drop's line left; the tab is still showing the kill's, which the delay behind it holds
    // there for a second before the drop's heading takes its place.
    // Both stand in the message box at once: the kill's line on the bar along its top, and the
    // offer the drop is waiting on down the eight lines under it. The banner's hit points line
    // went off the held screen with the box's own wipe, so nothing of the fight covers the offer.
    expect(boxText(session)).toEqual([
      `YOU FIND A ${WEAPON_NAMES[1]}`,
      '',
      '1) TAKE THE WEAPON',
      '2) LEAVE THE WEAPON',
      '',
      'NOTE THAT YOU MAY END UP',
      'WITH SEVERAL WEAPONS WHICH',
      'WILL WEIGH YOU DOWN.',
      'YOU KILLED IT!',
    ]);
    expect(game.screen.map((line) => line.text)).toEqual(['GOOD NEWS...']);
  });

  it('gives up the rest of a message\'s delay when a key is pressed', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(boxText(session)).toContain('YOU KILLED IT!');
    // The key answers the offer standing in the box as well, which is what the original does
    // with a key typed while it was counting the delay out.
    await press(session, LEAVE);
    expect(boxText(session)).not.toContain('YOU KILLED IT!');
  });

  it('offers what the monster dropped and takes what the player says to take', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    const game = session.game;
    game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toContain('1) TAKE THE WEAPON');
    await press(session, TAKE);
    expect(game.pc.weaponsOwned[1]).toBe(1);
    expect(session.box).toContain('1) TAKE THE ARMOR');
    await press(session, LEAVE);
    expect(game.pc.armorOwned[1]).toBe(0);
    expect(session.view().engaged).toBeNull();
  });

  it('sends a level 0 character who has earned a level to an inn', async () => {
    const session = await facingAMonster(lowest, { cls: 2, lev: 0, exp: 1000000 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toContain('GOOD NEWS!');
    expect(session.box).toContain('LEVEL! GO TO THE TOWN, FIND');
  });
});

describe('the message box while the kill is being read', () => {
  /** Where a line stands, so that a box line can be told from the bar above it. */
  const placed = (session: GameSession): [string, number, number][] =>
    session.view().box.map((line) => [line.text, line.x, line.y]);

  it('puts the kill on the bar and the drop it found down the eight lines', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(placed(session)).toContainEqual(['1) TAKE THE WEAPON', MENU_X, MENU_TOP + 2 * MENU_LINE_STEP]);
    expect(placed(session)).toContainEqual(['YOU KILLED IT!', MENU_X, MESSAGE_LINE_Y]);
  });

  it('holds the drop until a key answers it and then empties the box', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toContain('1) TAKE THE WEAPON');
    await press(session, LEAVE);
    expect(session.box).toContain('1) TAKE THE ARMOR');
    await press(session, LEAVE);
    expect(session.box).toEqual([]);
    // Nothing of the kill is left standing over the map once the loop is back on the player's key.
    expect(session.view().screen).toEqual([]);
  });

  it('shows a hint, waits for its key and clears it', async () => {
    const session = await facingAMonster(lowest, { cls: 2 });
    // With nothing engaged the F key is the snake's hint, which waits for a key of its own.
    session.game.engaged = -1;
    await press(session, KEY.fight);
    expect(session.box[0]).toBe('YOU MUST BE STANDING NEXT TO A');
    await press(session, 0x1b);
    expect(session.box).toEqual([]);
  });
});

describe('the cup of health a kill turns up', () => {
  /**
   * post_kill_heal (exe 3000:afc5) on the generator a game is really played with, rather than on
   * a generator a test has told what to roll. A monk is refused every other drop except the
   * money, so the cup is the first thing this kill has to say.
   */
  it('is offered on a seeded run and heals the character', async () => {
    const session = await facingAMonster(new SeededRng(4), { cls: 2, hp: 100, maxHp: 400 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toEqual([
      'YOU FOUND A CUP OF HEALTH!',
      '',
      'PRESS ANY KEY TO DRINK',
      '  THE WONDERFUL LIQUID',
      '  AND GAIN A FEW HEALTH',
      '  POINTS.',
      '',
      'HIT ANY KEY...',
    ]);
    expect(session.game.pc.hp).toBe(106);
  });

  it('is refused to a character who has lost nothing', async () => {
    const session = await facingAMonster(new SeededRng(4), { cls: 2, hp: 400, maxHp: 400 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toEqual([]);
    expect(session.game.pc.hp).toBe(400);
  });
});

describe('the skull the kill paints over the monster', () => {
  it('stands while the kill is still printing and goes when the views are drawn again', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    const game = session.game;
    const monsterId = session.view().monsters[0].monsterId;
    const dir = game.enemyDir;
    expect(session.view().killed).toBeNull();

    game.monsters[0].hp = 0;
    await press(session, 0x1b);
    // The kill has stopped on the offer its drop printed, which is where the original still has
    // the skull standing on the screen.
    expect(session.view().killed).toEqual({ dir, monsterId });
    // ...and the monster it names is off the floor by now, so the picture the skull is drawn
    // over has to come from here rather than from the square.
    expect(session.view().monsters).toEqual([]);

    // The armour the kill drops next is a second offer, and the skull is still up for it.
    await press(session, LEAVE);
    expect(session.view().killed).toEqual({ dir, monsterId });

    await press(session, LEAVE);
    expect(session.view().killed).toBeNull();
  });

  it("stands through the kill's own message when nothing stops for a key", async () => {
    const session = await facingAMonster(lowest, { cls: 2 });
    const monsterId = session.view().monsters[0].monsterId;
    const dir = session.game.enemyDir;
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    // A monk is refused every drop, so the kill asks no menu at all and the loop is back on the
    // player's key with "YOU KILLED IT!" still being held. The original is still inside its
    // delay here, with the skull on the screen it drew, so the tab draws it on that screen too.
    expect(boxText(session)).toContain('YOU KILLED IT!');
    expect(session.view().killed).toEqual({ dir, monsterId });
    // The key gives up the rest of the delay, which is where the original has come round and
    // drawn the views again.
    await press(session, 0x1b);
    expect(session.view().killed).toBeNull();
  });

  it('names the view a monster killed beside the character was standing in', async () => {
    const start = townSquare('w');
    const session = inTheTown(lowest, { lev: 10, str: 60, cls: 0, ...start, dir: 0 });
    const planted = session.game.monsters[0];
    Object.assign(planted, { x: start.x - 1, y: start.y, hp: 50, level: 1, type: 0 });
    session.game.monsterMap[planted.y * 80 + planted.x] = 0;
    // A pass with a key nothing is bound to, which is where attack_timing meets the monster and
    // takes it up: it is engaged from the west rather than from straight ahead.
    await press(session, 0x1b);
    expect(session.game.engaged).toBe(0);
    expect(session.view().ahead).toBe(false);
    const monsterId = session.view().monsters[0].monsterId;

    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    // West is 2, which for a character facing north is the LEFT ARROW view: that is the view the
    // four are drawn into with the skull over the monster's own picture.
    expect(session.view().killed).toEqual({ dir: 2, monsterId });
  });

  it('is not painted for a monster that was never drawn in a view', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    const game = session.game;
    // Off the occupancy grid, the way a monster killed by something other than the swing that
    // met it can be: draw_3d_view drew nothing for it, so there is no rectangle to paint into.
    game.monsterMap[game.monsters[0].y * 80 + game.monsters[0].x] = -1;
    game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.view().killed).toBeNull();
  });
});
