import tables from '../../game/rev-tables.json';

/**
 * `F1.COM` and `F2.COM`: every word Moraff's Revenge says about a spell or a magic item.
 *
 * Both files are BASIC `WRITE #` tables the game reads at start-up (DUNSMALL.EXE 1000:BBDD and
 * 1000:BCE8), and `../../game/rev-tables.json` is them, built out of a game folder by
 * `rev-tools/reference/build_rev_tables.py`. Nothing here is typed in by hand.
 */

/** One spell, as the table names it and describes it. */
export interface RevSpellText {
  /** The name the menu offers, in the game's capitals. */
  name: string;
  /** The sentence the wizard's guild reads out. */
  text: string;
}

/** The four spells of one of the six levels. */
export interface RevSpellLevel {
  level: number;
  /** The characteristic the level is named after, which only the roller's own screen shows. */
  stat: string;
  /** The two spells the dungeon's own menu offers, in the order it offers them. */
  prep: RevSpellText[];
  /** The two the fight prompt offers. */
  battle: RevSpellText[];
}

/** The six levels, level 1 first. */
export const REV_SPELL_LEVELS: RevSpellLevel[] = tables.spells;

/** How many levels of spells there are (1000:35FD's `1` and `6`). */
export const REV_SPELL_LEVEL_COUNT = REV_SPELL_LEVELS.length;

/** The two spells a level's menu offers, which is which of the two lists 1000:C5D0 reads. */
export function revSpellsAt(level: number, where: 'prep' | 'battle'): RevSpellText[] {
  return REV_SPELL_LEVELS[level - 1]?.[where] ?? [];
}

/**
 * The magic items' four string tables.
 *
 * `headings` is what the shop screen labels each row with, `names` what a found one is called,
 * and the two texts are the sentences the guild reads out for the items used out of a fight
 * (1000:2CCF) and in one (1000:2D36).
 */
export const REV_ITEM_TABLE: {
  headings: string[];
  names: string[];
  prepText: string[];
  battleText: string[];
} = tables.items;
