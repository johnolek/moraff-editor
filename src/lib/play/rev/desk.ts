/**
 * How a spell, an item, a pill or a wand asks the player something.
 *
 * All four put a menu up and read a key, and three of the things they then need — the next
 * level, the statistics screen, the monsters' clock — belong to the session rather than to the
 * character. This is what the session hands them, so that `spells.ts` and `items.ts` need
 * nothing of `engine.ts` at run time.
 */
export interface RevMagicDesk {
  /**
   * 1000:7DC9: a key, polled for with the monsters' clock running.
   *
   * It comes back null where the original hands the caller a space instead of a key, which is
   * when a monster is standing on the character's square (1000:7E4A) — the case the spell menu
   * turns into "cast no spell" at 1000:C707.
   */
  poll(): Promise<number | null>;
  /** 1000:2F71: a key, waited for, with every characteristic floored at 1 afterwards
   *  (1000:2F43). */
  wait(): Promise<number>;
  /** 1000:4C28: the character is on a new level, which re-stocks the monsters. */
  enterLevel(level: number): void;
  /** 1000:19F7: the statistics screen, which several spells and two scrolls end at. It takes
   *  the whole screen and waits for a key, so the caller waits with it. */
  stats(): Promise<void>;
  /** 1000:B308: the record written back, which the fountain of youth does before it lets go. */
  save(): void;
}
