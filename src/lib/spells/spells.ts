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

export function searchSpells(query: string): Spell[] {
  const wanted = query.trim().toLowerCase();
  if (!wanted) return allSpells();
  return allSpells().filter((spell) => spell.name.toLowerCase().includes(wanted));
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
