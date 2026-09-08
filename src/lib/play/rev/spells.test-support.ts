import type { Rng } from '../../game/port/rng';
import type { RevMagicDesk } from './desk';
import { REV_VALUE_COUNT } from '../../game/rev-port/record';
import { revPlayerFromValues, type RevPc } from './record';
import { newRevGame, type RevGame } from './state';

/** What the spell, item, treasure and fountain tests set a game up with. Nothing outside a test
 *  imports this. */

/** A character with nothing in the record but what the test puts there. */
export function revCharacter(fields: Partial<RevPc> = {}): RevPc {
  const pc = revPlayerFromValues(new Array<number>(REV_VALUE_COUNT).fill(0));
  return {
    ...pc,
    stats: [15, 15, 15, 15, 15, 15],
    cls: 1,
    level: 5,
    maxHp: 40,
    hp: 20,
    weight: 150,
    money: 0,
    spellPoints: 20,
    column: 7,
    row: 3,
    dungeonLevel: 10,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

/** A generator that hands back the numbers the test names, in order, and then zeroes. */
export function revRolls(numbers: number[]): Rng {
  let at = 0;
  return { random: () => numbers[at++] ?? 0 };
}

/** A game around one character, with the levels it is sent to written down. */
export function revTestGame(
  pc: RevPc,
  rng: Rng = revRolls([]),
): { game: RevGame; desk: RevMagicDesk; keys: number[]; levels: number[]; statsShown: number; saves: number } {
  const game = newRevGame(pc, rng);
  const keys: number[] = [];
  const levels: number[] = [];
  const out = {
    game,
    keys,
    levels,
    statsShown: 0,
    saves: 0,
    desk: {
      poll: async () => keys.shift() ?? null,
      wait: async () => keys.shift() ?? 0,
      enterLevel(level: number) {
        levels.push(level);
        pc.dungeonLevel = level;
      },
      stats() {
        out.statsShown += 1;
      },
      save() {
        out.saves += 1;
      },
    },
  };
  return out;
}
