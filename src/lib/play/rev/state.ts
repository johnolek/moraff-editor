import type { Rng } from '../../game/port/rng';
import { RevMapMemory } from './memory';
import { RevMonsters, type RevWalker } from './monsters';
import type { RevPc } from './record';

/**
 * The dungeon's own variables: what DUNSMALL.EXE keeps in DGROUP while a character is being
 * played, and the two places it writes words to.
 *
 * Every field names the address it stands for. The character's own numbers are in
 * {@link RevPc}; this is everything else the loop reads and writes.
 */

/** Something worth writing down about a run, which `../run.ts` turns into a milestone. */
export type RevEvent =
  | { kind: 'levelGained'; level: number }
  | { kind: 'bossKilled'; boss: number }
  | { kind: 'gameWon' };

/** What a fight holds while it is running (1000:8223). */
export interface RevFight {
  /** DGROUP B69C: the slot of the monster being fought, which is the whole monster. */
  slot: number;
  /** DGROUP B6DC: which of the dungeon's twenty-two names it is. */
  name: number;
  /** DGROUP B6B4: its level. */
  monsterLevel: number;
  /** DGROUP B6E4: the hit points it has left in this fight. */
  hitPoints: number;
  /** DGROUP B6F4: its kind, 1 to 7. */
  kind: number;
  /** DGROUP B6F0: what the kind adds to the number a swing has to beat. */
  kindAdjust: number;
  /** DGROUP B6F8: what the kind adds to its own chance of swinging back. */
  attackBonus: number;
  /** DGROUP B6FA: the experience killing it is worth, worked out once when it is met. */
  experience: number;
}

/** DUNSMALL.EXE part way through a dungeon: the character, the level and what is being said. */
export interface RevGame {
  pc: RevPc;
  rng: Rng;
  monsters: RevMonsters;
  memory: RevMapMemory;
  /** DGROUP B6B4 outside a fight: the level of the last monster met, which the clock reads and
   *  which the kill sets to the dungeon level. */
  lastMonsterLevel: number;
  /** DGROUP B524: 0 for the compass arrows of the flat map, 1 for the turning arrows. */
  arrowMode: number;
  /** DGROUP B4C6: the feature under the character — negative for a ladder up, 1 to 3 for a
   *  ladder down, 0 for a chute, and over 3 for open ground. */
  feature: number;
  /** DGROUP B4CE, B4D6 and B4DA: the square a chute last dropped the character on, which is
   *  what makes a false floor. */
  chuteLanding: { column: number; row: number; level: number } | null;
  /** DGROUP B50E with B69C: the fight, or null when there is none. */
  fight: RevFight | null;
  /** The lines the loop has printed since the last key, which the tab shows as a box. */
  said: string[];
  /** The line the ladder, the chute and the rope put under the map (1000:56D0). */
  prompt: string | null;
  /** What a fight is saying, which the original draws over the top of the screen rather than in
   *  the message box. */
  banner: string[];
  /** Things worth writing into a run log. */
  events: RevEvent[];
  /** The loop has come back: the character has quit or died. */
  over: boolean;
  /** A ported function is owed a key it could not wait for. */
  keyOwed: boolean;
  say(...lines: string[]): void;
  /** 1000:2F71: the blocking wait a ported function asks for and cannot take itself. */
  pressAnyKey(): void;
}

/**
 * Where the moves left on the invisibility spell are.
 *
 * The ten singles at DGROUP 6020 are values 27 to 36 of the record, element I at `6020 + 4 * I`,
 * and 1000:7342 reads element 5 to decide whether a monster can see the character.
 */
export const REV_INVISIBILITY_VALUE = 31;

/** What a character has to be for the monsters to take a turn against them. */
export function revWalker(game: RevGame): RevWalker {
  const pc = game.pc;
  return {
    column: pc.column,
    row: pc.row,
    facing: pc.facing,
    level: pc.dungeonLevel,
    generation: pc.generation,
    weight: pc.weight,
    invisible: pc.values[REV_INVISIBILITY_VALUE - 1] ?? 0,
    fighting: game.fight?.slot ?? 0,
  };
}

/** A dungeon as it stands the moment a character is loaded into it. */
export function newRevGame(pc: RevPc, rng: Rng, memory: RevMapMemory = new RevMapMemory()): RevGame {
  const game: RevGame = {
    pc,
    rng,
    monsters: new RevMonsters(),
    memory,
    lastMonsterLevel: 0,
    arrowMode: 0,
    feature: 50,
    chuteLanding: null,
    fight: null,
    said: [],
    prompt: null,
    banner: [],
    events: [],
    over: false,
    keyOwed: false,
    say(...lines: string[]) {
      game.said.push(...lines);
    },
    pressAnyKey() {
      game.keyOwed = true;
    },
  };
  return game;
}
