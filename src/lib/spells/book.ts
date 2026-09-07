import type { SpellCategory } from './grid';
import { LIST_NOTES, spellKey } from './mechanics';
import { allSpells, gridKey, spellGroups } from './spells';

/**
 * The book the page draws: the four lists of the game's own type menu, each with its thirty
 * spells keyed the way the game keys them, A to Z and then 1 to 4.
 */
export function spellBook(): SpellCategory[] {
  return spellGroups(allSpells()).map((list, index) => ({
    label: `${index + 1}) ${list.label.toUpperCase()} SPELLS`,
    notes: LIST_NOTES[list.label] ? [LIST_NOTES[list.label]] : [],
    cells: list.levels.flatMap((level, row) =>
      level.spells.map((spell, column) => ({
        id: spellKey(spell),
        key: gridKey(row, column),
        name: spell.name.toUpperCase(),
      })),
    ),
  }));
}
