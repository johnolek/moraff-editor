/**
 * The things a run counts: what happened to the character or to the world, pushed onto a game's
 * event list at the moment it happens.
 *
 * A run is judged by how few of these it took, so what is counted has to be what the game did
 * rather than what the player typed. Opening the spell menu and backing out of it is nothing and
 * the spell cast through it is one; pressing K where there is no trap door is nothing and going
 * through one is one. A key that only puts something on the screen — the stats, the pockets, the
 * maps — never reaches any of these, and neither does a turn, which costs the character nothing
 * in any of the three games.
 *
 * All three games push the same kinds where the thing is the same, so `RunRecorder` in
 * `src/lib/play/run.ts` adds up one game the way it adds up another. Each game's own event union
 * carries {@link ActionEvent}, and the ported functions push these beside the events those unions
 * already had.
 */

/**
 * Every kind of event a run counts as one action.
 *
 * - `stepped` — a step the square ahead allowed, which moved the character.
 * - `waited` — a moment spent standing still.
 * - `dug` — a hole dug through the floor.
 * - `trapdoorTaken` — a trap door opened with its key and dropped through.
 * - `ladderTaken` — a ladder climbed, and Dungeons of the Unforgiven's module teleporter.
 * - `buildingEntered` — one of the town's buildings opened.
 * - `swung` — a swing taken at a monster.
 * - `cast` — a spell cast, which is also how a scroll or a wand is written.
 * - `itemUsed` — a charge, a pill, a potion or one of the magic items spent.
 * - `dropped` — something put down to save carrying it.
 * - `gearSwitched` — the weapon held or the armour worn changed.
 * - `breathed` — Moraff's Revenge's breath of fire, which is a swing that cannot miss.
 * - `fountainDrunk` — Moraff's Revenge's fountain of youth, drunk from.
 */
export const ACTION_KINDS = [
  'stepped',
  'waited',
  'dug',
  'trapdoorTaken',
  'ladderTaken',
  'buildingEntered',
  'swung',
  'cast',
  'itemUsed',
  'dropped',
  'gearSwitched',
  'breathed',
  'fountainDrunk',
] as const;

export type ActionKind = (typeof ACTION_KINDS)[number];

/**
 * One action, as a game's ported functions push it.
 *
 * It carries its kind and nothing else for now; MORF-361 is what gives each of them the damage,
 * the names and the counts a run journal reads out in words.
 */
export interface ActionEvent {
  kind: ActionKind;
}

const KINDS: ReadonlySet<string> = new Set<string>(ACTION_KINDS);

/** Whether an event a game pushed is one of the actions a run counts. */
export function isActionKind(kind: string): boolean {
  return KINDS.has(kind);
}
