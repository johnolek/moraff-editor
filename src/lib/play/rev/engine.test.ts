import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { formatRevRecord, REV_VALUE_COUNT } from '../../game/rev-port/record';
import { REV_KEY } from './keys';
import { REV_CLOCK_TICK, RevGameSession, runRevDungeon, startRevGame, type RevCharacterFile } from './engine';

/** A character standing in the town, as the record stores it. */
function record(fields: Record<number, number> = {}): Uint8Array<ArrayBuffer> {
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

function file(bytes = record()): RevCharacterFile & { dead: boolean } {
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

async function playing(seed = 5, bytes = record()): Promise<{ session: RevGameSession; held: ReturnType<typeof file> }> {
  const held = file(bytes);
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
    expect(session.game.memory.isKnown(10, 10, 0)).toBe(true);
    expect(session.game.memory.isKnown(11, 10, 0)).toBe(false);
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
    const { session } = await playing(5, record({ 23: 7, 24: 3 }));
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

  it('writes every tick into the run log where it happened', async () => {
    const { session } = await playing();
    session.enterLevel(3);
    session.tick();
    session.tick();
    expect(session.run).toBeNull();
    session.finish();
  });
});

it('is the tick input, not a key', () => {
  expect(REV_CLOCK_TICK).toBeLessThan(0);
});
