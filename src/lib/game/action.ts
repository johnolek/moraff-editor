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
 * - `dug` — a hole dug through the floor, the six moments spent on a dig a monster interrupted,
 *   or the move elsewhere on the floor the game makes for a Fighter too deep to dig.
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
 * Where a spell was cast from, in the two games that ask. Only `spellPoints` — the character's
 * own head — spends spell points; the other three spend the scroll, the wand's charge or the
 * sheet of paper.
 */
export type CastSource = 'spellPoints' | 'scroll' | 'wand' | 'paper';

/**
 * Which spell a cast was, named and numbered the way its own game names and numbers it.
 *
 * Dungeons of the Unforgiven and Moraff's World both hold 120 spells in four lists of ten lines
 * of three, so a cast there is three numbers and one of four places it was cast from. Moraff's
 * Revenge holds two sets of twelve, one for the dungeon and one for a fight, and a cast there is
 * a single number out of the set its prompt offers.
 */
export type CastSpell =
  | {
      game: 'unforgiven';
      /** 0 permanent, 1 preparation, 2 wizard battle, 3 priest battle. */
      type: number;
      /** 0 to 9, one less than the level the menu prints. */
      level: number;
      /** 0 to 2, the spell's place on its line of three. */
      slot: number;
      source: CastSource;
      /** The name the game's own spell menu prints. */
      name: string;
    }
  | {
      game: 'moraffsWorld';
      /** 0 permanent, 1 preparation, 2 wizard, 3 priestly. */
      category: number;
      /** 0 to 9, one less than the level the menu prints. */
      levelIndex: number;
      /** 0 to 2, the spell's place on its line of three. */
      slot: number;
      source: CastSource;
      /** The name the game's own spell grid prints. */
      name: string;
    }
  | {
      game: 'revenge';
      /** The dungeon's own twelve spells, or the fight prompt's twelve. */
      set: 'prep' | 'battle';
      /** 1 to 6. */
      level: number;
      /** 1 to 12: which spell of the set the level and the menu's answer reach. */
      number: number;
      /** The name the menu offers, out of the game's own `F1.COM` table. */
      name: string;
    };

/** A spell cast, which is also how a scroll or a wand is written. */
export interface CastEvent {
  kind: 'cast';
  spell: CastSpell;
}

/**
 * One action, as a game's ported functions push it.
 *
 * A cast says which spell it was, and the rest carry their own kind and nothing else. A game
 * whose journal has been grown pushes the richer shapes of `src/lib/game/journal-events.ts`
 * instead, which carry the same kinds with the damage, the names and the numbers on them; the
 * counting reads the kind either way.
 */
export type ActionEvent = { kind: Exclude<ActionKind, 'cast'> } | CastEvent;

const KINDS: ReadonlySet<string> = new Set<string>(ACTION_KINDS);

/** Whether an event a game pushed is one of the actions a run counts. */
export function isActionKind(kind: string): boolean {
  return KINDS.has(kind);
}
