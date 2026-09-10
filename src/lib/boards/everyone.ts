import type { EveryoneRow, EveryoneStatus } from '../../../server/everyone';

/**
 * Cutting the table of everyone down and putting it in order.
 *
 * The server hands the whole table over at once and decides nothing about it beyond a first order
 * worth reading, so which of it a reader sees and how it stands is all here. It is the page's own
 * arithmetic and nothing draws in it, which is what makes it testable without a browser.
 */

/**
 * Which rows the checkboxes above the table leave showing: one set per group, holding the boxes
 * that are ticked.
 */
export interface EveryoneFilters {
  statuses: ReadonlySet<EveryoneStatus>;
  boards: ReadonlySet<string>;
  classes: ReadonlySet<string>;
}

/**
 * The classes there are to filter by, which are the classes the characters on screen actually
 * are, in alphabetical order.
 *
 * They are not a fixed list, because a class only means anything here once somebody has played
 * one: three games with different classes share this table, and a box for a class nobody has is a
 * box that does nothing.
 */
export function classesOf(rows: readonly EveryoneRow[]): string[] {
  const found = new Set<string>();
  for (const row of rows) if (row.now !== null) found.add(row.now.cls);
  return [...found].sort(byWords);
}

/**
 * The rows the ticked boxes leave showing.
 *
 * A group only ever hides a row it has a box for. A character the server holds no readable record
 * of has no class among the boxes, and one rolled for neither board has no board among them, so
 * neither is what those boxes are about and neither is hidden by them; unticking every class
 * still leaves such a character on screen, which is the only honest answer for a row the filter
 * cannot speak about.
 */
export function filterRows(rows: readonly EveryoneRow[], filters: EveryoneFilters): EveryoneRow[] {
  return rows.filter(
    (row) =>
      filters.statuses.has(row.status) &&
      (row.leaderboard === null || filters.boards.has(row.leaderboard)) &&
      (row.now === null || filters.classes.has(row.now.cls)),
  );
}

/** Which column the table stands in order of. The six characteristics are one key each, in the
 *  order the game's own record keeps them. */
export type EveryoneSortKey =
  | 'player'
  | 'name'
  | 'leaderboard'
  | 'status'
  | 'cls'
  | 'level'
  | 'hp'
  | 'stat0'
  | 'stat1'
  | 'stat2'
  | 'stat3'
  | 'stat4'
  | 'stat5'
  | 'deepest'
  | 'actions'
  | 'clock'
  | 'playMs'
  | 'at';

/** The six characteristics' keys by their place in the record, so a heading drawn from
 *  `statLabels` can name the key beside it. */
export const STAT_SORT_KEYS: readonly EveryoneSortKey[] = ['stat0', 'stat1', 'stat2', 'stat3', 'stat4', 'stat5'];

/** Which column the table is in order of, and which way round. */
export interface EveryoneSort {
  by: EveryoneSortKey;
  descending: boolean;
}

/** What the table opens in, which is the order the server hands it over in. */
export const DEFAULT_SORT: EveryoneSort = { by: 'level', descending: true };

/**
 * One column: the value it sorts on, and which way round it goes when it is first picked.
 *
 * A number reads best largest first — the highest level, the furthest, the longest played — and a
 * list of words reads best alphabetically, so that is what a first click on each gives.
 *
 * A value of null is a row the column has nothing for: no record to read a class or a
 * characteristic out of, no board, no moment, or a play time the server never watched. Those
 * stand at the bottom whichever way the column is turned.
 */
interface SortedColumn {
  value: (row: EveryoneRow) => number | string | null;
  descending: boolean;
}

const COLUMNS: Record<EveryoneSortKey, SortedColumn> = {
  player: { value: (row) => row.player, descending: false },
  name: { value: (row) => row.name, descending: false },
  leaderboard: { value: (row) => row.leaderboard, descending: false },
  status: { value: (row) => row.status, descending: false },
  cls: { value: (row) => row.now?.cls ?? null, descending: false },
  level: { value: (row) => row.level, descending: true },
  hp: { value: (row) => row.now?.hp ?? null, descending: true },
  stat0: { value: (row) => statAt(row, 0), descending: true },
  stat1: { value: (row) => statAt(row, 1), descending: true },
  stat2: { value: (row) => statAt(row, 2), descending: true },
  stat3: { value: (row) => statAt(row, 3), descending: true },
  stat4: { value: (row) => statAt(row, 4), descending: true },
  stat5: { value: (row) => statAt(row, 5), descending: true },
  deepest: { value: (row) => row.deepest, descending: true },
  actions: { value: (row) => row.actions, descending: true },
  clock: { value: (row) => row.clock, descending: true },
  playMs: { value: (row) => (row.timed && row.playMs > 0 ? row.playMs : null), descending: true },
  at: { value: (row) => whenOf(row.at), descending: true },
};

function statAt(row: EveryoneRow, index: number): number | null {
  return row.now?.stats[index] ?? null;
}

/** A moment as a number, so that two of them compare the way a clock would. A moment the browser
 *  cannot read is one the column has nothing for. */
function whenOf(at: string | null): number | null {
  if (at === null) return null;
  const when = Date.parse(at);
  return Number.isNaN(when) ? null : when;
}

/**
 * The rows in the order asked for.
 *
 * The sort is stable, which is what keeps the tie-break the server's: two characters standing
 * equally on the column picked stay in the order they arrived in, which is the furthest and then
 * the fewest actions.
 */
export function sortRows(rows: readonly EveryoneRow[], sort: EveryoneSort): EveryoneRow[] {
  const column = COLUMNS[sort.by];
  return [...rows].sort((one, other) => {
    const mine = column.value(one);
    const theirs = column.value(other);
    if (mine === null || theirs === null) {
      if (mine === theirs) return 0;
      return mine === null ? 1 : -1;
    }
    const order =
      typeof mine === 'string' ? byWords(mine, theirs as string) : mine - (theirs as number);
    return sort.descending ? -order : order;
  });
}

/** Words in alphabetical order, with capitals counting for nothing: a player who names their
 *  character in capitals is not a separate half of the alphabet. */
function byWords(one: string, other: string): number {
  const mine = one.toLowerCase();
  const theirs = other.toLowerCase();
  if (mine < theirs) return -1;
  return mine > theirs ? 1 : 0;
}

/**
 * What clicking a column heading comes to: the column already sorted on turns round, and any
 * other is sorted on the way that column reads best.
 */
export function toggledSort(current: EveryoneSort, key: EveryoneSortKey): EveryoneSort {
  if (current.by === key) return { by: key, descending: !current.descending };
  return { by: key, descending: COLUMNS[key].descending };
}
