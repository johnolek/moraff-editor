import { dungeonForLevel } from '../../../rev-bestiary/monsters';
import { revValue } from '../record';
import type { RevGame } from '../state';
import type { RevOccupancy } from './monsters';
import type { RevScreenState } from './screen';
import { MESSAGE_ROWS, SPELL_VALUES, type RevFightLines } from './text';
import { revDebugLines } from './debug';

/**
 * The game as the screen wants it.
 *
 * The port keeps the words the loop printed in three lists rather than at the rows the original
 * `LOCATE`d them to, so this is where they are put back on rows: the first thing said goes on
 * row 1, the line of advice on row 2 (1000:06FE prints it there), and the rest below.
 */

/** Which monster of the dungeon a name index is, for the line a fight puts at the top. */
function monsterName(name: number, level: number): string {
  return dungeonForLevel(level).monsters[name - 1]?.name ?? '';
}

function fightLines(game: RevGame): RevFightLines | null {
  const fight = game.fight;
  if (!fight) return null;
  return {
    monsterName: monsterName(fight.name, game.pc.dungeonLevel),
    monsterLevel: fight.monsterLevel,
    yourHealth: game.pc.hp,
    itsHealth: fight.hitPoints,
    experience: fight.experience,
  };
}

function occupancyOf(game: RevGame): RevOccupancy {
  return {
    slotOn: (column, row) => game.monsters.slotOn(column, row),
    strengthOf: (slot) => game.monsters.strengths[slot] ?? 0,
  };
}

/** The lines the loop has printed, laid out on the four rows the game's message area has. */
function messagesOf(game: RevGame): string[] {
  const said = [...game.banner, ...game.said];
  const lines = new Array<string>(MESSAGE_ROWS).fill('');
  lines[0] = said[0] ?? '';
  lines[1] = game.advice[0] ?? '';
  lines[2] = said[1] ?? '';
  lines[3] = said[2] ?? '';
  return lines;
}

/** What the Play tab's mode asks of the screen. */
export interface RevScreenModeOptions {
  /** Speedrun and debug draw the level the character has not walked yet; faithful asks the map
   *  memory, which is the one thing the game itself would answer. */
  wholeFloor: boolean;
  /** Debug marks every monster on the level on the map, which the game never does. */
  debug: boolean;
}

/**
 * Everything the screen draws, out of the game the session is running.
 *
 * The revealed level holds nothing back, because Moraff's Revenge has no rock to hold back. The
 * other two games leave out a square walled on all four sides, which nothing can ever stand on;
 * here such a square is one the character can be standing on, since a ladder and a chute keep
 * the column and the row while they change the level (1000:4C28, 1000:3491) and a Potion of
 * Relocation drops the character on a random square without asking about a wall (1000:99B7).
 */
export function revScreenStateOf(game: RevGame, options: RevScreenModeOptions): RevScreenState {
  const pc = game.pc;
  return {
    place: {
      column: pc.column,
      row: pc.row,
      level: pc.dungeonLevel,
      generation: pc.generation,
      facing: pc.facing,
    },
    known: options.wholeFloor ? () => true : (column, row) => game.memory.isKnown(column, row, pc.dungeonLevel),
    occupancy: occupancyOf(game),
    mapMonsters: options.debug ? game.monsters.standing() : [],
    debugLines: options.debug ? revDebugLines(game) : [],
    words: {
      messages: messagesOf(game),
      inTown: pc.dungeonLevel === 0,
      prompt: game.prompt,
      fight: fightLines(game),
      spells: SPELL_VALUES.map((value) => revValue(pc, value) > 0),
      characterLevel: pc.level,
    },
  };
}
