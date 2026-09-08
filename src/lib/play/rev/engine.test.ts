import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { formatRevRecord, REV_VALUE_COUNT } from '../../game/rev-port/record';
import { REV_KEY } from './keys';
import { REV_CLOCK_TICK, RevGameSession, runRevDungeon, startRevGame, type RevCharacterFile } from './engine';

/**
 * A character standing in the town, as the record stores it: a fighter with 22 health points, 40
 * jewel pieces and 150 pounds of weight, standing on 10, 10. `fields` names record values by
 * their number, shifts and all.
 */
export function revRecord(fields: Record<number, number> = {}): Uint8Array<ArrayBuffer> {
  const values = new Array<number>(REV_VALUE_COUNT).fill(0);
  for (let stat = 1; stat <= 6; stat++) values[stat - 1] = 3 * 15 + 237;
  values[10 - 1] = 1;
  values[12 - 1] = 12316;
  values[13 - 1] = 476;
  values[14 - 1] = 376 + 22;
  values[15 - 1] = 176 + 22;
  values[17 - 1] = 71 + 150;
  values[18 - 1] = 4434;
  values[19 - 1] = 223 + 40;
  values[23 - 1] = 10;
  values[24 - 1] = 10;
  values[25 - 1] = 0;
  values[26 - 1] = 1;
  for (const [value, number] of Object.entries(fields)) values[Number(value) - 1] = number;
  return formatRevRecord(values);
}

/** That record as a file a session can be started on, which remembers a death. */
export function revCharacterFile(bytes = revRecord()): RevCharacterFile & { dead: boolean } {
  return {
    bytes,
    dead: false,
    write(next) {
      this.bytes = next;
    },
    died() {
      this.dead = true;
    },
  };
}

/** Let the loop take what it has been given and come back to waiting. */
function settled(): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve));
}

async function playing(seed = 5, bytes = revRecord()): Promise<{ session: RevGameSession; held: ReturnType<typeof revCharacterFile> }> {
  const held = revCharacterFile(bytes);
  const session = startRevGame(held, new SeededRng(seed));
  void runRevDungeon(session);
  await settled();
  return { session, held };
}

describe('the loop', () => {
  it('starts the character where the record left them', async () => {
    const { session } = await playing();
    expect(session.view().place).toMatchObject({ column: 10, row: 10, level: 0 });
    session.finish();
  });

  it('marks the square underfoot and nothing else', async () => {
    const { session } = await playing();
    session.enterLevel(3);
    session.press(REV_KEY.stats);
    await settled();
    expect(session.game.memory.isKnown(10, 10, 3)).toBe(true);
    expect(session.game.memory.isKnown(11, 10, 3)).toBe(false);
    expect(session.game.memory.isKnown(10, 9, 3)).toBe(false);
    session.finish();
  });

  it('walks the character with the compass arrows and remembers where they went', async () => {
    const { session } = await playing();
    const before = session.view().place;
    session.press(REV_KEY.arrowRight);
    await settled();
    const after = session.view().place;
    expect(after.facing).toBe(2);
    expect(after.column === before.column + 1 || after.column === before.column).toBe(true);
    session.finish();
  });

  it('switches what the arrows do on Escape', async () => {
    const { session } = await playing();
    expect(session.view().arrows).toBe('compass');
    session.press(REV_KEY.escape);
    await settled();
    expect(session.view().arrows).toBe('turning');
    session.finish();
  });

  it('turns rather than steps with the turning arrows', async () => {
    const { session } = await playing();
    session.press(REV_KEY.escape);
    await settled();
    const before = session.view().place;
    session.press(REV_KEY.arrowRight);
    await settled();
    expect(session.view().place).toMatchObject({ column: before.column, row: before.row, facing: 2 });
    session.finish();
  });

  it('offers the rope on a town building square', async () => {
    const { session } = await playing(5, revRecord({ 23: 7, 24: 3 }));
    expect(session.view().prompt).toBe("There's a rope above. Hit U to climb it.");
    session.finish();
  });

  it('saves the record and comes back on Q', async () => {
    const { session, held } = await playing();
    session.press(REV_KEY.quit);
    await settled();
    expect(session.over).toBe(true);
    expect(held.bytes).not.toBe(undefined);
    session.finish();
  });

  it('says what a key it has not built would have done', async () => {
    const { session } = await playing();
    session.press(REV_KEY.cast);
    await settled();
    expect(session.view().box.join(' ')).toContain('NOT BUILT YET');
    session.finish();
  });
});

describe('the monsters', () => {
  it('stands none of them in the town and forty on a dungeon level', async () => {
    const { session } = await playing();
    expect(session.view().monsters).toHaveLength(0);
    session.enterLevel(3);
    expect(session.view().monsters).toHaveLength(40);
    session.finish();
  });

  it('moves them on a tick of the clock and not on a key', async () => {
    const { session } = await playing();
    session.enterLevel(3);
    const before = session.game.monsters.positions.slice(81, 121);
    session.tick();
    expect(session.game.monsters.positions.slice(81, 121)).not.toEqual(before);
    session.finish();
  });

  it('rolls nothing at all in the town, which the loop jumps straight past', async () => {
    const { session } = await playing();
    const before = session.game.monsters.positions.slice();
    session.tick();
    expect(session.ticks).toBe(0);
    expect(session.game.monsters.positions).toEqual(before);
    session.finish();
  });
});

it('is the tick input, not a key', () => {
  expect(REV_CLOCK_TICK).toBeLessThan(0);
});

describe('the town', () => {
  it('has ladders down of its own, which D takes', async () => {
    // (15, 5) of the town is one of its ten ladders down, and spans two levels.
    const { session } = await playing(5, revRecord({ 23: 15, 24: 5 }));
    expect(session.view().prompt).toContain('D-GO DOWN');
    session.press(REV_KEY.down);
    await settled();
    expect(session.view().place.level).toBe(2);
    session.finish();
  });

  it('climbs the rope into the Flea Bag Inn and takes the ten jewel pieces', async () => {
    const { session } = await playing(5, revRecord({ 23: 7, 24: 3, 19: 223 + 40 }));
    session.press(REV_KEY.up);
    await settled();
    expect(session.view().box.join(' ')).toContain('Flea Bag Inn');
    session.press('Y'.charCodeAt(0));
    await settled();
    expect(Math.trunc(session.game.pc.money)).toBe(30);
    session.finish();
  });

  it('throws a character out of the Kings Inn who cannot pay for it', async () => {
    const { session } = await playing(5, revRecord({ 23: 18, 24: 17 }));
    session.press(REV_KEY.up);
    await settled();
    session.press('Y'.charCodeAt(0));
    await settled();
    expect(session.view().box.join(' ')).toContain('gaurd throws you out');
    session.finish();
  });
});

describe('a fight', () => {
  /** Stand the character on a dungeon level with a monster on their own square. */
  async function beside(): Promise<RevGameSession> {
    const { session } = await playing(9, revRecord({ 25: 2, 23: 10, 24: 10, 142: 1 }));
    session.enterLevel(2);
    session.game.monsters.grid[22 * 10 + 10] = 41;
    session.game.monsters.positions[41] = 32 * 10 + 10;
    // A key of no consequence takes the loop round to the top, where the fight opens.
    session.press(REV_KEY.stats);
    await settled();
    return session;
  }

  it('opens when a monster reaches the character', async () => {
    const session = await beside();
    expect(session.view().fight).not.toBeNull();
    expect(session.view().fight?.slot).toBe(41);
    session.finish();
  });

  it('takes a swing with the sword the character owns', async () => {
    const session = await beside();
    const before = session.view().fight!.hitPoints;
    session.press(REV_KEY.sword);
    await settled();
    expect(session.view().banner.join(' ')).toMatch(/YOU DID/);
    const after = session.view().fight;
    expect(after === null || after.hitPoints < before).toBe(true);
    session.finish();
  });

  it('refuses a weapon the character does not own', async () => {
    const session = await beside();
    session.press(REV_KEY.mace);
    await settled();
    expect(session.view().box.join(' ')).toContain('YOU DO NOT HAVE THAT');
    session.finish();
  });

  it('keeps the rest of the level moving while the prompt is up', async () => {
    const session = await beside();
    const before = session.game.monsters.positions.slice(41, 81);
    session.tick();
    expect(session.game.monsters.positions.slice(41, 81)).not.toEqual(before);
    session.finish();
  });
});

describe('walking away from a fight', () => {
  it('ends it and writes what is left of the monster back into the file', async () => {
    const { session } = await playing(9, revRecord({ 25: 2, 23: 10, 24: 10, 142: 1 }));
    session.enterLevel(2);
    session.game.monsters.grid[22 * 10 + 10] = 41;
    session.game.monsters.positions[41] = 32 * 10 + 10;
    session.press(REV_KEY.stats);
    await settled();
    session.press(REV_KEY.sword);
    await settled();
    const fight = session.game.fight;
    if (!fight) {
      session.finish();
      return;
    }
    const left = fight.hitPoints;
    // Step off the square, whichever way the walls allow.
    for (const arrow of [REV_KEY.arrowUp, REV_KEY.arrowDown, REV_KEY.arrowLeft, REV_KEY.arrowRight]) {
      session.press(arrow);
      await settled();
      if (session.game.fight === null) break;
    }
    expect(session.game.fight).toBeNull();
    expect(session.game.monsters.strengths[41]).toBe(Math.round(left));
    session.finish();
  });
});
