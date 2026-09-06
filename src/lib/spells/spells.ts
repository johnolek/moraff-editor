import data from '../game/dotu-data.json';

export type Spell = (typeof data.spells)[number];

/** The three spells one line of a spell book holds. */
export interface SpellLevel {
  label: string;
  spells: Spell[];
}

/** One of the game's four spell lists. */
export interface SpellList {
  label: string;
  levels: SpellLevel[];
}

export function allSpells(): Spell[] {
  return data.spells;
}

/** The spells grouped the way the books are: by list, then by the line they sit on. */
export function spellGroups(spells: Spell[]): SpellList[] {
  const lists: SpellList[] = [];
  for (const spell of spells) {
    let list = lists.find((entry) => entry.label === spell.typeName);
    if (!list) {
      list = { label: spell.typeName, levels: [] };
      lists.push(list);
    }
    const label = `Level ${spell.level}`;
    let level = list.levels.find((entry) => entry.label === label);
    if (!level) {
      level = { label, spells: [] };
      list.levels.push(level);
    }
    level.spells.push(spell);
  }
  return lists;
}

const GRID_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234';

/**
 * The key the game prints in front of a spell, for the spell on `row` (0 for the level 1 line,
 * 9 for the level 10 line) in `column` (0 for the leftmost of the three). The keys run A to Z
 * and then 1 to 4, left to right and top to bottom, so the last line is keyed 2, 3 and 4.
 *
 * @param row Line of the spell book, 0 to 9.
 * @param column Slot on that line, 0 to 2.
 */
export function gridKey(row: number, column: number): string {
  return GRID_KEYS[row * 3 + column];
}
