import type { PortedGameId } from '../app-state.svelte';
import { readStored, writeStored } from '../character/storage';
import type { StockedMonster } from '../map/stocking';

/**
 * How much of the game a Play tab shows, which is a choice the tab offers and the browser
 * remembers for each game.
 *
 * Both games keep a great deal to themselves — a monster's hit points, the charges left on a
 * wand, the turns left on a spell, where the monsters on the floor are standing — and the tabs
 * were built showing all of it. This is the switch: **faithful** shows nothing the game does not
 * show, **speedrun** adds the whole map and every monster standing on it so that a run need not
 * be planned against the maps elsewhere on this site, and **debug** shows everything the port
 * knows.
 */
export type PlayMode = 'faithful' | 'speedrun' | 'debug';

/** What a game is played in until the player says otherwise. */
export const DEFAULT_PLAY_MODE: PlayMode = 'faithful';

/** Where the choice is kept, one key per game. */
const PREFIX = 'moraff-tools.play.';
const SUFFIX = '.mode';

/** The three modes the control on a Play tab offers, each with a line about what it shows. */
export const PLAY_MODES: { id: PlayMode; label: string; how: string }[] = [
  {
    id: 'faithful',
    label: 'Faithful',
    how: 'Only what the game shows: no hidden numbers, and no monster on the map but the one you face.',
  },
  {
    id: 'speedrun',
    label: 'Speedrun',
    how: 'Every monster on the map, so a route can be planned, but still none of the hidden numbers.',
  },
  {
    id: 'debug',
    label: 'Debug',
    how: 'Everything: every monster, and the panel of numbers the game never prints.',
  },
];

function isPlayMode(value: unknown): value is PlayMode {
  return PLAY_MODES.some((mode) => mode.id === value);
}

/** Which mode this game is played in: the player's choice, or faithful. */
export function readPlayMode(game: PortedGameId): PlayMode {
  const stored = readStored(PREFIX + game + SUFFIX);
  return isPlayMode(stored) ? stored : DEFAULT_PLAY_MODE;
}

export function writePlayMode(game: PortedGameId, mode: PlayMode): void {
  writeStored(PREFIX + game + SUFFIX, mode);
}

/**
 * Whether the column of numbers the game keeps and never prints is shown — the engaged monster's
 * hit points and the chance a swing lands, the charges on every wand and scroll, the turns left
 * on every spell, the odds the square underfoot holds a trap door, how many monsters are left
 * alive and which are nearest.
 */
export function panelVisible(mode: PlayMode): boolean {
  return mode === 'debug';
}

/** What a tab knows about the monsters on the floor: every one standing on it, and the one the
 *  character is facing. Both games' views have these. */
export interface MonstersInSight {
  monsters: StockedMonster[];
  engaged: StockedMonster | null;
}

/**
 * The monsters the map draws. Faithful draws the one the character is fighting, which the game
 * names itself beside the picture; the other two modes draw the whole floor.
 *
 * Which monsters a faithful map may show is MORF-151's to settle, along with how much of the map
 * itself is drawn. Until it does, the one being fought is the only monster the game has told the
 * player about.
 */
export function monstersDrawn(mode: PlayMode, sight: MonstersInSight): StockedMonster[] {
  if (mode !== 'faithful') return sight.monsters;
  return sight.engaged === null ? [] : [sight.engaged];
}
