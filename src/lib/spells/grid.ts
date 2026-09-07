/** One spell of a list, as the book's grid shows it. */
export interface SpellCell {
  /** What the book tracks the selection by. Spell names repeat between the lists, so a name
   *  will not do. */
  id: string;
  /** The letter or digit the game's menu answers to. */
  key: string;
  /** The name the menu prints, in the game's own capitals. */
  name: string;
}

/** One of the four spell lists, as the book lays it out. */
export interface SpellCategory {
  /** The line the game's type menu prints, such as "3) WIZARD BATTLE SPELLS". */
  label: string;
  /** What the page has to say about the whole list, a paragraph an entry. */
  notes: string[];
  /** The thirty spells of the list, in the order the menu prints them: three to a line, ten
   *  lines, the lowest level first. */
  cells: SpellCell[];
}

/** The spell the menu key `key` picks out of `category`, or null when the key names none. */
export function cellForKey(category: SpellCategory, key: string): SpellCell | null {
  return category.cells.find((cell) => cell.key === key) ?? null;
}

/**
 * The spell `step` cells along the grid from the one showing, or null at the two ends. The grid
 * is three spells wide, so a step of 3 is the slot straight down; left and right run along the
 * whole list, so the end of a line leads onto the next.
 */
export function stepCell(category: SpellCategory, id: string, step: number): SpellCell | null {
  const index = category.cells.findIndex((cell) => cell.id === id);
  if (index < 0) return null;
  return category.cells[index + step] ?? null;
}
