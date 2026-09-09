import { describe, expect, it } from 'vitest';
import { BATTLE_HP_Y, BLOW_Y, MENU_X } from '../game/port/screens';
import { BorlandRng, type Rng } from '../game/port/rng';
import { facingAMonster, inTheTown, onAFloorFacingAMonster, press, settle } from './battle.test-support';
import type { GameSession } from './engine';
import { KEY } from './keys';

/** A generator that rolls as high as it can, so a swing always lands. */
const highest: Rng = { random: (n) => (n > 0 ? n - 1 : 0) };

/** A generator that rolls the lowest number it can, so nothing a swing rolls for lands. */
const lowest: Rng = { random: () => 0 };

/** What stands in the message box, each line with the place the game drew it at. */
const boxPlaces = (session: GameSession): [string, number, number][] =>
  session.view().box.map((line) => [line.text, line.x, line.y]);

describe('swinging at a monster', () => {
  it('takes the damage off the monster and spends the time the swing cost', async () => {
    const session = await facingAMonster(highest);
    const monster = session.game.monsters[0];
    const before = { hp: monster.hp, seconds: session.view().seconds };
    await press(session, KEY.fight);
    expect(monster.hp).toBeLessThan(before.hp);
    expect(session.view().box.map((line) => line.text)).toContain('YOU HIT THE MONSTER!!!');
    // The weapon in hand costs its own time, and a fifth of the agility the character is short
    // of 85 is spent on top of it.
    const pc = session.game.pc;
    const cost = session.game.weaponTime[pc.weapon] + Math.trunc((85 - pc.dex) / 5);
    expect(session.view().seconds).toBe(before.seconds + cost);
  });

  it('says nothing was hit when the swing misses', async () => {
    const session = await facingAMonster(lowest);
    const monster = session.game.monsters[0];
    await press(session, KEY.fight);
    // The original builds both messages in one buffer and prints it on the lower of the two
    // lines, so a miss leaves the upper one empty.
    expect(boxPlaces(session)).toContainEqual(['YOU MISSED THE MONSTER', MENU_X, BLOW_Y[1]]);
    expect(boxPlaces(session).some(([, , y]) => y === BLOW_Y[0])).toBe(false);
    expect(monster.hp).toBe(50);
  });

  it('draws the blow in the gap the battle banner leaves, with the banner standing', async () => {
    const session = await facingAMonster(highest);
    const monster = session.game.monsters[0];
    // The banner was drawn over the snake's arrival hint when the views went up, since
    // engagement_timing wipes the eight lines before it draws its own four.
    await press(session, KEY.fight);
    expect(boxPlaces(session)).toEqual([
      ['YOU ARE FIGHTING A LEVEL 1', MENU_X, 0x329],
      ['GIANT GARBAGE CAN', MENU_X, 0x351],
      [expect.stringContaining('EXP. VALUE: 24'), MENU_X, 0x441],
      ['WHAT AN ANNOYING MONSTER...', MENU_X, 0x469],
      ['YOU HIT THE MONSTER!!!', MENU_X, BLOW_Y[0]],
      [expect.stringContaining('POINTS OF DAMAGE!'), MENU_X, BLOW_Y[1]],
      // Drawn last, since the loop prints the banner again before it waits for the next key.
      [`IT HAS ${monster.hp} HEALTH POINTS LEFT`, MENU_X, BATTLE_HP_Y],
    ]);
  });

  it('leaves a message box standing except for the lines a fight wiped the strip under', async () => {
    const session = await facingAMonster(highest);
    // A box the game has left standing when the swing lands, so that the lines a fight wipes can
    // be told from the ones it leaves alone.
    const standing = ['LINE ONE', 'LINE TWO', 'LINE THREE', 'LINE FOUR', 'LINE FIVE'];
    session.game.say(...standing);
    await press(session, KEY.fight);
    // print_battle_hp_info wipes from 0x377 to 0x3a1 before it draws, and the third of the box's
    // eight lines is the one inside that strip. The line under it is untouched.
    const shown = boxPlaces(session).map(([text]) => text);
    expect(shown).not.toContain(standing[2]);
    expect(shown).toContain(standing[3]);
    expect(shown).toContain('YOU HIT THE MONSTER!!!');
  });

  it('sends the character to find a monster when there is nothing in front of them', async () => {
    const session = inTheTown(lowest);
    await settle();
    await press(session, KEY.fight);
    expect(session.box[0]).toBe('YOU MUST BE STANDING NEXT TO A');
    expect(session.view().engaged).toBeNull();
  });
});

describe('keeping the swings up with Ctrl-F', () => {
  it('swings until the monster is dead without another key', async () => {
    const session = await facingAMonster(highest, { cls: 2 }, { hp: 400 });
    const monster = session.game.monsters[0];
    await press(session, KEY.repeatFight);
    expect(session.repeatFight).toBe(true);
    for (let waited = 0; waited < 200 && session.repeatFight; waited++) await settle();
    expect(monster.hp).toBe(0);
    expect(session.view().box.map((line) => line.text)).toContain('YOU KILLED IT!');
    expect(session.repeatFight).toBe(false);
  });

  it('stops the moment the player touches a key', async () => {
    const session = await facingAMonster(highest, { cls: 2 }, { hp: 100000 });
    await press(session, KEY.repeatFight);
    await settle();
    session.press(KEY.escape);
    await settle();
    await settle();
    expect(session.repeatFight).toBe(false);
    expect(session.game.monsters[0].hp).toBeGreaterThan(0);
  });
});

describe('dying in a fight', () => {
  it('ends the game once the monster fighting back has taken the last hit point', async () => {
    // A stocked floor needs a generator that answers differently each time it is asked, since
    // the stocking draws squares until it finds a free one.
    const session = onAFloorFacingAMonster(new BorlandRng(7), 3, { hp: 1, maxHp: 1, lev: 0, str: 1 });
    await settle();
    for (let swing = 0; swing < 60 && !session.view().over; swing++) {
      // The monster's timer has run out, so the seconds the swing costs buy it an attack.
      session.game.monsterTimers[0] = -1;
      await press(session, KEY.fight);
    }
    expect(session.game.pc.hp).toBe(-100);
    expect(session.view().dead).toBe(true);
    expect(session.view().over).toBe(true);
  });
});

describe('a puffball that reaches you', () => {
  it('leaves what it did on the strip above the message box', async () => {
    const session = onAFloorFacingAMonster(new BorlandRng(7), 3);
    await settle();
    // Kind 2 is the lightest blue puffball: it does not attack at all, it moves one
    // characteristic and disappears.
    session.game.monsters[0].type = 2;
    // The monster's timer has run out, so the seconds the moment costs buy it its move.
    session.game.monsterTimers[0] = -1;
    await press(session, KEY.enter);
    const said = session.view().box.map((line) => line.text);
    expect(said.some((line) => line.endsWith('RAISED BY PUFFBALL!'))).toBe(true);
  });
});
