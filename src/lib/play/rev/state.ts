import type { Rng } from '../../game/port/rng';
import { RevMapMemory } from './memory';
import { RevMonsters, type RevWalker } from './monsters';
import { REV_VALUE, revValue, type RevPc } from './record';

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
  /** 1000:06D2's line of advice, which the loop prints on its own row at the top of every pass
   *  and which nothing the keys do writes over. */
  advice: string[];
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
  /**
   * DGROUP B2AE, B72C and B2AA: what the monster's last swing rolled, the armour class it had to
   * beat and the damage it did.
   *
   * They outlive the swing because 1000:9A7C reads all three before writing them: a monster of
   * kind 3 that is stuck to the character throws its damage again against the roll its last
   * swing made.
   */
  monsterSwing: { roll: number; armourClass: number; damage: number };
  /**
   * DGROUP B706: what the spell at 1000:9971 adds for a hundred seconds to the number the
   * monster's swing has to beat. The spells are not built, so nothing here ever raises it.
   */
  shield: number;
  /**
   * DGROUP 52FC, the compiler's scratch cell, which hundreds of statements write and one reads
   * back without writing it first: the monster's d20 at 1000:9A96 accumulates into it where the
   * character's at 1000:8A14 assigns. It is here because that bug needs somewhere to live.
   */
  scratch: number;
  say(...lines: string[]): void;
  /** 1000:2F71: the blocking wait a ported function asks for and cannot take itself. */
  pressAnyKey(): void;
}

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
    invisible: revValue(pc, REV_VALUE.invisibility),
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
    advice: [],
    prompt: null,
    banner: [],
    events: [],
    over: false,
    keyOwed: false,
    monsterSwing: { roll: 0, armourClass: 0, damage: 0 },
    shield: 0,
    scratch: 0,
    say(...lines: string[]) {
      game.said.push(...lines);
    },
    pressAnyKey() {
      game.keyOwed = true;
    },
  };
  return game;
}
