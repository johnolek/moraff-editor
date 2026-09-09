import { describe, expect, it } from 'vitest';
import { formatRevRecord, REV_VALUE_COUNT } from '../../game/rev-port/record';
import { RunRecorder, countsAsAction, replayRun } from '../run';
import { REV_CLOCK_TICK, runRevDungeon, startRevGame, type RevCharacterFile } from './engine';
import { REV_KEY } from './keys';

function record(): Uint8Array<ArrayBuffer> {
  const values = new Array<number>(REV_VALUE_COUNT).fill(0);
  for (let stat = 1; stat <= 6; stat++) values[stat - 1] = 3 * 15 + 237;
  values[10 - 1] = 1;
  values[12 - 1] = 12316;
  values[13 - 1] = 476;
  values[14 - 1] = 376 + 40;
  values[15 - 1] = 176 + 40;
  values[17 - 1] = 71 + 150;
  values[18 - 1] = 4434;
  values[19 - 1] = 223 + 40;
  values[23 - 1] = 10;
  values[24 - 1] = 10;
  values[26 - 1] = 1;
  return formatRevRecord(values);
}

function settled(): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve));
}

describe('the actions a run counts', () => {
  it('counts a step, a ladder and a swing', () => {
    expect(countsAsAction('revenge', REV_KEY.arrowUp)).toBe(true);
    expect(countsAsAction('revenge', REV_KEY.down)).toBe(true);
    expect(countsAsAction('revenge', REV_KEY.sword)).toBe(true);
  });

  it('does not count the screen keys', () => {
    expect(countsAsAction('revenge', REV_KEY.stats)).toBe(false);
    expect(countsAsAction('revenge', REV_KEY.escape)).toBe(false);
    expect(countsAsAction('revenge', REV_KEY.quit)).toBe(false);
  });
});

describe('a run', () => {
  it('writes every tick of the clock into the log where it happened', async () => {
    const run = new RunRecorder({ game: 'revenge', name: 'FIGHTY', record: record(), seed: 11 });
    const file: RevCharacterFile = {
      bytes: run.record.slice(),
      write(bytes) {
        this.bytes = bytes;
      },
      died() {},
    };
    const session = startRevGame(file, run.rng, run);
    void runRevDungeon(session);
    await settled();
    session.enterLevel(2);
    session.tick();
    session.tick();
    session.press(REV_KEY.arrowRight);
    await settled();
    session.finish();
    const log = run.log();
    expect(log.inputs.filter((input) => input === REV_CLOCK_TICK)).toHaveLength(2);
    expect(log.inputs[log.inputs.length - 1]).toBe(REV_KEY.arrowRight);
    expect(log.actions).toBe(1);
  });

  it('replays to the same place, with the monsters where the ticks left them', async () => {
    const run = new RunRecorder({ game: 'revenge', name: 'FIGHTY', record: record(), seed: 21 });
    const file: RevCharacterFile = {
      bytes: run.record.slice(),
      write(bytes) {
        this.bytes = bytes;
      },
      died() {},
    };
    const session = startRevGame(file, run.rng, run);
    void runRevDungeon(session);
    await settled();
    for (const key of [REV_KEY.arrowRight, REV_KEY.arrowDown, REV_KEY.arrowLeft, REV_KEY.arrowUp]) {
      session.press(key);
      await settled();
    }
    session.tick();
    session.press(REV_KEY.arrowRight);
    await settled();
    session.save();
    session.finish();
    const log = run.log();
    const ending = { place: session.view().place, bytes: file.bytes };

    const again = await replayRun(log);
    // The replay's ending is where a run log's claim is checked against the game's own numbers,
    // which count columns and rows from one; the tab's view counts them from zero.
    expect(again.place).toMatchObject({
      x: ending.place.x + 1,
      y: ending.place.y + 1,
      floor: ending.place.level,
    });
    expect(again.record).toEqual(ending.bytes);
    expect(again.actions).toBe(log.actions);
  });

  it('marks the deepest floor reached, which is what this game is measured by', async () => {
    const run = new RunRecorder({ game: 'revenge', name: 'FIGHTY', record: record(), seed: 31 });
    const file: RevCharacterFile = {
      bytes: run.record.slice(),
      write(bytes) {
        this.bytes = bytes;
      },
      died() {},
    };
    const session = startRevGame(file, run.rng, run);
    void runRevDungeon(session);
    await settled();
    session.enterLevel(4);
    session.press(REV_KEY.stats);
    await settled();
    session.finish();
    const floors = run.log().milestones.filter((milestone) => milestone.kind === 'floor');
    expect(floors.map((milestone) => milestone.which)).toEqual([4]);
  });
});
