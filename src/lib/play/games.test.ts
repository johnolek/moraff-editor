import { afterEach, describe, expect, it } from 'vitest';
import { app, type RosterEntry } from '../app-state.svelte';
import { newEntry } from '../character/roster';
import { characterFile, floorSquare, press, settle, teleporterSquare } from './battle.test-support';
import type { GameSession } from './engine';
import { PLAY_GAMES } from './games';
import { KEY } from './keys';
import { runPlayLoop } from './loop';
import { runLogOf } from './run';
import { verifyRun } from './verify';

/**
 * Playing a character off the roster, which is what the Play tab does: the run the character has
 * already been through is on its roster entry, and the game goes on from there.
 */

/** A character on the roster, being worked on, standing on a floor of its own. */
function rostered(where: Parameters<typeof characterFile>[0] = { level: 3, dir: 0, ...floorSquare(3) }): RosterEntry {
  const bytes = Uint8Array.from(characterFile({ lev: 20, str: 60, ...where }).bytes);
  const entry = newEntry({ game: 'unforgiven', name: 'BRAWLER', slot: 1, bytes, imported: false });
  app.roster = [entry];
  app.characterId = entry.id;
  return entry;
}

/** One sitting at the game, played to the end of the keys and left. */
async function playASession(entry: RosterEntry, keys: number[]): Promise<GameSession> {
  const game = PLAY_GAMES.unforgiven;
  const session = game.start(entry, false);
  void runPlayLoop(session, game.loop(session));
  await settle();
  // The snake's stone tablet greets a character standing in the town and takes a key of its own.
  if (session.tablet) await press(session, KEY.escape);
  for (const key of keys) await press(session, key);
  session.finish();
  return session;
}

afterEach(() => {
  app.roster = [];
  app.characterId = null;
});

describe('a character played again', () => {
  it('goes on counting its actions where the session before it left off', async () => {
    const entry = rostered();
    // Two moments waited, each of which is one action. A step would do as well when the way is
    // clear, but the floor is stocked afresh every session and a monster standing in front of the
    // character stops one.
    const first = await playASession(entry, [KEY.enter, KEY.enter]);
    const spent = first.view().run!.actions;

    const second = await playASession(entry, [KEY.enter]);

    expect(spent).toBe(2);
    expect(second.view().run!.actions).toBe(3);
    expect(entry.run.map((session) => session.actions)).toEqual([2, 3]);
  });

  it('shows the milestones of the whole run and not of this sitting alone', async () => {
    const entry = rostered({ level: 0, dir: 0, ...teleporterSquare() });
    // The teleporter under the town takes the character to another module, which is a milestone;
    // the Escape answers the welcome the crossing puts up and the Enter the box after it.
    await playASession(entry, [KEY.arrowUp, KEY.escape, KEY.enter]);

    const second = await playASession(entry, [KEY.arrowUp]);

    expect(entry.run[0].milestones.map((milestone) => milestone.kind)).toEqual(['dungeon']);
    expect(entry.run[1].milestones).toEqual([]);
    expect(second.view().run!.milestones.map((milestone) => milestone.kind)).toEqual(['dungeon']);
  });

  it('makes a chain of sessions that verifies as one run', async () => {
    const entry = rostered();
    await playASession(entry, [KEY.enter, KEY.arrowLeft, KEY.enter]);
    await playASession(entry, [KEY.enter, KEY.enter]);

    const verdict = await verifyRun(runLogOf(entry.run));

    expect(verdict.reason).toBeNull();
    expect(verdict.status).toBe('verified');
    expect(verdict.sessions).toBe(2);
    // The turn where the character stands costs this game nothing, so four of the five keys count.
    expect(verdict.claimed.actions).toBe(4);
  });
});
