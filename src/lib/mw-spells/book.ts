import {
  MW_SPELL_CATEGORIES,
  MW_SPELL_CATEGORY_LABELS,
  MW_SPELL_LEVELS,
  MW_SPELL_NAMES,
  MW_SPELLS_PER_LEVEL,
  mwSpellBookSlot,
  mwSpellHelp,
  mwSpellKey,
  mwMaximumSpellPointCost,
  mwSpellPointCost,
  mwSpellRecord,
} from '../game/mw-port/spells';
import { MW_SPELL_EFFECTS, type MwSpellEffect } from './effects';

/** One spell of the book, with everything the page shows about it. */
export interface MwSpell {
  /** 0 permanent, 1 preparation, 2 wizard, 3 priestly. */
  category: number;
  /** 1 to 10. */
  level: number;
  /** 0 to 2. */
  slot: number;
  /** Which record of SPELLS.HLP holds its description. */
  record: number;
  /** Which byte of the spellbook, the scrolls, the wands and the magic paper it is. */
  bookSlot: number;
  /** The letter or digit the game's menu answers to. */
  key: string;
  /** The name the menu prints, from the executable's own table. */
  name: string;
  /** The lines of its SPELLS.HLP record, byte for byte. */
  help: string[];
  /** Spell points it takes out of the pool. */
  cost: number;
  /** Spell points it takes off the maximum for good, which is nothing outside the permanent list. */
  maximumCost: number;
  effect: MwSpellEffect;
}

/** One line of the menu: three spells. */
export interface MwSpellLevel {
  level: number;
  spells: MwSpell[];
}

/** One of the four categories, as the menu lays it out. */
export interface MwSpellList {
  category: number;
  key: (typeof MW_SPELL_CATEGORIES)[number];
  /** The line the game's own type menu shows, such as "3) WIZARD BATTLE SPELLS". */
  label: string;
  levels: MwSpellLevel[];
}

function mwSpell(category: number, level: number, slot: number): MwSpell {
  const record = mwSpellRecord(category, level, slot);
  return {
    category,
    level,
    slot,
    record,
    bookSlot: mwSpellBookSlot(category, level, slot),
    key: mwSpellKey(level, slot),
    name: MW_SPELL_NAMES[record],
    help: mwSpellHelp(record),
    cost: mwSpellPointCost(level),
    maximumCost: mwMaximumSpellPointCost(category, level),
    effect: MW_SPELL_EFFECTS[record],
  };
}

/** The whole spell book, laid out the way the game's own menus lay it out. */
export function mwSpellBook(): MwSpellList[] {
  return MW_SPELL_CATEGORIES.map((key, category) => ({
    category,
    key,
    label: MW_SPELL_CATEGORY_LABELS[category],
    levels: Array.from({ length: MW_SPELL_LEVELS }, (_, line) => ({
      level: line + 1,
      spells: Array.from({ length: MW_SPELLS_PER_LEVEL }, (_, slot) => mwSpell(category, line + 1, slot)),
    })),
  }));
}
