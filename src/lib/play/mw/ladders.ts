import { bundledMwDungeon } from '../../game/mw-dungeon';
import { arrivalHint } from '../../game/mw-port/town';
import type { MwGame } from '../../game/mw-port/state';
import { digAHole } from './dig';
import type { MwTurn } from './engine';
import { enterBuilding, mwBuildingName } from './town';

/** The ladders: U to climb one, D to go down one, and the line the game puts under the map. */

/**
 * ladder_delta (WORLD.EXE 3000:a449, mw.c "ladder_delta"): how many floors the ladder on this
 * square goes, down being positive and up negative, and 0 for a square with no ladder.
 */
export function ladderUnder(game: MwGame): number {
  return bundledMwDungeon.ladder(game.pc.x, game.pc.y, game.pc.floor, game.pc.dungeon);
}

/**
 * FUN_2000_a9bd (WORLD.EXE 2000:a9bd, mw.c "FUN_2000_a9bd"): the one line the game prints under
 * the map on a square with a way off the floor.
 *
 * movecontrol hands it -15 for a trap door the character has the key for, -1 for a ladder up or
 * a building of the town, 1 for a ladder down, and 0 for anywhere else — where the line says a
 * hole can be dug, whether or not the floor is deep enough to refuse one.
 */
export function ladderPrompt(ladder: number, building: number, trapdoor: boolean): string {
  if (trapdoor) return "HIT 'K' TO USE TRAP DOOR"; // DS:3264
  if (ladder < 0 || building !== 0) return "HIT 'U' TO GO UP"; // DS:3290
  if (ladder > 0) return "HIT 'D' TO GO DOWN"; // DS:327d
  return "HIT 'D' TO DIG A HOLE"; // DS:32a1
}

/**
 * movecontrol's 0x75 branch: U climbs the ladder up, or opens the building of the town the
 * square holds. A square with neither does nothing at all, and says nothing either.
 */
export async function goUp(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  if (turn.ladder < 0) {
    const to = game.pc.floor + turn.ladder;
    game.engaged = -1;
    session.enterFloor(to);
    arrivalHint(game, game.pc.floor);
    game.recenterMap = true;
    game.events.push({ kind: 'ladderTaken', to });
    return;
  }
  if (turn.building !== 0) {
    // The building is counted on the way in rather than on the way out, so that what a player is
    // shown while they are inside one already has it.
    game.events.push({ kind: 'buildingEntered', building: mwBuildingName(turn.building) });
    await enterBuilding(turn);
  }
  session.flushKeys();
}

/**
 * movecontrol's 0x64 branch: D goes down the ladder, and digs a hole through the floor where
 * there is no ladder to go down. A hole that lands somewhere else on the same floor puts the
 * character out of whatever building square they were standing on.
 */
export async function goDown(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  if (turn.ladder < 1) {
    if (await digAHole(turn)) turn.building = 0;
    return;
  }
  const to = game.pc.floor + turn.ladder;
  game.engaged = -1;
  session.enterFloor(to);
  arrivalHint(game, game.pc.floor);
  game.recenterMap = true;
  game.events.push({ kind: 'ladderTaken', to });
}
