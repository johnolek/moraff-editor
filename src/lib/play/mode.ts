import type { PortedGameId } from '../app-state.svelte';
import { readStored, writeStored } from '../character/storage';
import type { DiscoveredMap } from '../map/draw-floor';
import type { StockedMonster } from '../map/stocking';

/**
 * How much of the game a Play tab shows, which is a choice the tab offers and the browser
 * remembers for each game.
 *
 * Both games keep a great deal to themselves — a monster's hit points, the charges left on a
 * wand, the turns left on a spell, where the monsters on the floor are standing — and the tabs
 * were built showing all of it. This is the switch: **faithful** shows nothing the game does not
 * show, which is the map the character has discovered and the monsters its 3-D views would have
 * drawn; **speedrun** adds the whole floor and every monster standing on it, so that a run need
 * not be planned against the maps elsewhere on this site; and **debug** shows everything the
 * port knows.
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
    how: 'Only what the game shows: the map you have discovered, the monsters its views would draw, and no hidden numbers.',
  },
  {
    id: 'speedrun',
    label: 'Speedrun',
    how: 'The whole floor and every monster on it, so a route can be planned, but still none of the hidden numbers.',
  },
  {
    id: 'debug',
    label: 'Debug',
    how: 'The top-down map instead of the game screen: the whole floor, every monster, and the panel of numbers the game never prints.',
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
 * Which of the two a Play tab has on its stage: the game's own screen — the four 3-D views and
 * the boxes the game draws around them — or the site's top-down map of the floor.
 */
export type PlayDisplay = 'screen' | 'map';

/** Where the choice is kept, one key per game, beside the mode. */
const DISPLAY_SUFFIX = '.display';

/** The two the switch on a Play tab offers. */
export const PLAY_DISPLAYS: { id: PlayDisplay; label: string }[] = [
  { id: 'screen', label: "The game's screen" },
  { id: 'map', label: 'The map' },
];

function isPlayDisplay(value: unknown): value is PlayDisplay {
  return PLAY_DISPLAYS.some((display) => display.id === value);
}

/**
 * What a game shows before the player has chosen: the game's own screen, whatever the mode.
 * John (2026-09-08): the 3-D view is the default even for debug and speedrun; the top-down map
 * is a toggle of its own, which the mode never resets.
 */
export function defaultPlayDisplay(_mode: PlayMode): PlayDisplay {
  return 'screen';
}

/** Which of the two this game shows: the player's choice, or what the mode shows. */
export function readPlayDisplay(game: PortedGameId, mode: PlayMode): PlayDisplay {
  const stored = readStored(PREFIX + game + DISPLAY_SUFFIX);
  return isPlayDisplay(stored) ? stored : defaultPlayDisplay(mode);
}

export function writePlayDisplay(game: PortedGameId, display: PlayDisplay): void {
  writeStored(PREFIX + game + DISPLAY_SUFFIX, display);
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

/**
 * Whether debug mode's own marks are drawn over the game's own screen: the engaged monster's
 * numbers on its view, and a mark on every monster the zoom map's window reaches.
 *
 * Nothing here is a port of anything the game draws, so faithful and speedrun leave the screen
 * exactly as the game would have it.
 */
export function debugDrawn(mode: PlayMode): boolean {
  return mode === 'debug';
}

/** What a tab knows about the monsters on the floor: every one standing on it, the ones the
 *  3-D views have just drawn, and the one the character is facing. Both games' views have
 *  these. */
export interface MonstersInSight {
  monsters: StockedMonster[];
  visible: StockedMonster[];
  engaged: StockedMonster | null;
}

/**
 * The monsters the map draws.
 *
 * Faithful draws the ones the 3-D views drew this turn, which is every monster standing on a
 * square any of the four views reached, and the one being fought whether or not it is among
 * them: the game names that one itself, beside its picture, and Moraff's World points at it
 * without any line of sight at all. The other two modes draw the whole floor.
 */
export function monstersDrawn(mode: PlayMode, sight: MonstersInSight): StockedMonster[] {
  if (mode !== 'faithful') return sight.monsters;
  const seen = [...sight.visible];
  const engaged = sight.engaged;
  if (engaged !== null && !seen.some((monster) => monster.slot === engaged.slot)) seen.push(engaged);
  return seen;
}

/**
 * The monsters the game's own zoom map marks, which is every one on the floor in debug and none
 * at all otherwise.
 *
 * The three games draw the same small map of the squares around the character and not one of
 * them ever puts a monster on it, so this is a mark of the site's own: showing it in faithful or
 * in speedrun would be showing something no game ever showed.
 */
export function zoomMapMonsters(mode: PlayMode, sight: { monsters: StockedMonster[] }): StockedMonster[] {
  return debugDrawn(mode) ? sight.monsters : [];
}

/**
 * The map the floor is drawn from: the one the character has discovered in faithful, and none in
 * the other two modes, where the whole floor is drawn.
 *
 * `MapMemory` is what the two games that share a map engine hand it; Moraff's Revenge keeps its
 * own and hands over the same one question, which is all this asks for.
 */
export function mapDrawn(mode: PlayMode, memory: { discovered(): DiscoveredMap }): DiscoveredMap | null {
  return mode === 'faithful' ? memory.discovered() : null;
}
