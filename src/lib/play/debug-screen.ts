import type { Game, ScreenLine } from '../game/port/state';
import { engagedMonster } from './panel';
import { AHEAD_VIEW } from './view3d/geometry';

/**
 * What debug mode prints over the game's own screen: what the monster in the big forward view is
 * made of, which the game shows nowhere at all.
 *
 * The numbers are `engagedMonster`'s in `panel.ts`, so the lines over the view and the panel
 * beside the screen always say the same thing. Moraff's World prints its own monster's level and
 * hit points over the view it stands in, and these are placed to match.
 */

/** Where they go: inside the top left corner of the forward view, clear of the yellow label the
 *  game spreads across the middle of its top edge. */
const CORNER = { x: AHEAD_VIEW.left + 0x10, y: AHEAD_VIEW.top + 6 };

/** How far apart two lines of the game's smallest font sit, which is the key menu's own step. */
const LINE_STEP = 0x25;

/** White, which is what Moraff's World prints the same numbers in. */
const NUMBER_COLOUR = 15;

/** The share of swings that land, to a tenth of a per cent, as the panel prints it. */
function hitPercent(chance: number): string {
  return `${(chance * 100).toFixed(1)}%`;
}

/**
 * The two lines over the monster: its level and hit points on one, the chance the character's
 * next swing lands on the other. Nothing is printed when nothing is being faced.
 */
export function debugMonsterLines(game: Game): ScreenLine[] {
  const engaged = engagedMonster(game);
  if (engaged === null) return [];
  const line = (text: string, at: number): ScreenLine => ({
    text,
    x: CORNER.x,
    y: CORNER.y + at * LINE_STEP,
    font: 0,
    colour: NUMBER_COLOUR,
  });
  return [line(`LEVEL:${engaged.level} HP:${engaged.hp}`, 0), line(`HIT:${hitPercent(engaged.hitChance)}`, 1)];
}
