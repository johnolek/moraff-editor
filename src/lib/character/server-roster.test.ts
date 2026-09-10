import { describe, expect, it } from 'vitest';
import type { RosterEntry } from '../app-state.svelte';
import type { RunSession } from '../play/run';
import { deviceIsAhead, entryFromServer, type ServerCharacter } from './server-roster';

/** One sitting of a run: what it was played from, and how many keys went into it. */
function sitting(at: number, keys: number): RunSession {
  return {
    engine: 'a'.repeat(40),
    game: 'unforgiven',
    mode: 'faithful',
    leaderboard: 'faithful',
    sound: null,
    name: 'Grond',
    startedAt: `2026-09-09T1${at}:00:00.000Z`,
    seed: 1000 + at,
    record: 'AAEC',
    inputs: Array.from({ length: keys }, (_, key) => key),
    actions: keys,
    time: keys,
    milestones: [],
    edits: 0,
  };
}

describe('which copy of a character stands', () => {
  it('takes the server’s where the two say the same thing', () => {
    expect(deviceIsAhead([sitting(0, 5)], [sitting(0, 5)])).toBe(false);
  });

  it('keeps this device’s where it holds keys the server has not been sent', () => {
    expect(deviceIsAhead([sitting(0, 9)], [sitting(0, 5)])).toBe(true);
  });

  it('keeps this device’s where it has played a sitting the server never saw', () => {
    expect(deviceIsAhead([sitting(0, 5), sitting(1, 3)], [sitting(0, 5)])).toBe(true);
  });

  it('takes the server’s where it has been played on since', () => {
    expect(deviceIsAhead([sitting(0, 5)], [sitting(0, 5), sitting(1, 3)])).toBe(false);
  });

  it('takes the server’s where its copy of a sitting has keys this one has not', () => {
    expect(deviceIsAhead([sitting(0, 5)], [sitting(0, 8)])).toBe(false);
  });

  it('takes the server’s where the two runs have parted company', () => {
    const elsewhere = { ...sitting(1, 3), seed: 99 };
    expect(deviceIsAhead([sitting(0, 5), sitting(1, 3)], [sitting(0, 5), elsewhere])).toBe(false);
  });

  it('takes the server’s where this device has more of a sitting the run was played past', () => {
    expect(deviceIsAhead([sitting(0, 9), sitting(1, 3)], [sitting(0, 5), sitting(1, 3)])).toBe(false);
  });

  it('takes the server’s for a character this device has never played', () => {
    expect(deviceIsAhead([], [sitting(0, 5)])).toBe(false);
  });
});

describe('a character as it comes back from the server', () => {
  const character: ServerCharacter = {
    id: 'k3p9x1-ab12cd',
    game: 'unforgiven',
    name: 'Grond',
    slot: 21,
    dead: false,
    leaderboard: 'faithful',
    createdAt: '2026-09-08T09:00:00.000Z',
    editedAt: '2026-09-09T12:00:00.000Z',
    record: 'AAECAw==',
    maps: null,
    savedAt: '2026-09-09T12:00:01.000Z',
    run: [sitting(0, 5)],
    leasedElsewhere: false,
  };

  it('is the roster entry the server describes', () => {
    const entry = entryFromServer(character, null);

    expect(entry).toMatchObject({ id: 'k3p9x1-ab12cd', name: 'Grond', slot: 21, leaderboard: 'faithful' });
    expect(Array.from(entry!.bytes)).toEqual([0, 1, 2, 3]);
    expect(entry!.run).toHaveLength(1);
  });

  it('keeps the file the character was imported from, which never leaves this device', () => {
    const imported = new Uint8Array([9, 9]) as Uint8Array<ArrayBuffer>;
    const kept = { importedBytes: imported } as RosterEntry;

    expect(entryFromServer(character, kept)!.importedBytes).toBe(imported);
  });

  it('is nothing at all for a character the server has no record of', () => {
    expect(entryFromServer({ ...character, record: null }, null)).toBeNull();
  });
});
