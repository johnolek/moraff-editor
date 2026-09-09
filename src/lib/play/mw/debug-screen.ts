import { describeEffects, MONSTERS } from '../../mw-bestiary/monsters';
import type { MwGame } from '../../game/mw-port/state';
import { MW_MONSTER_VIEW_CORNERS, type MwMonsterViewCorner } from '../../game/mw-port/screens';
import type { ScreenLine } from '../../game/port/state';
import { wrapToWidth } from '../debug-screen';
import { strokeAdvance, strokeLineHeight } from '../view3d/stroke-font';
import { mwEngagedMonster } from './panel';
import {
  MW_BACK_VIEW,
  MW_COLOURS,
  MW_EAST_VIEW,
  MW_FRONT_VIEW,
  MW_WEST_VIEW,
} from './view3d/screen';

/**
 * What debug mode adds to the numbers Moraff's World already prints over the monster it is
 * fighting.
 *
 * The game prints the monster's level, its hit points and what killing it is worth —
 * `mwMonsterViewLines` in `src/lib/game/mw-port/screens.ts` — so what is left to add is the
 * chance the character's next swing lands, which the game works out on every swing and shows
 * nowhere, and what the monster does beyond an ordinary hit. Both are `mwEngagedMonster`'s, so
 * the view and the panel beside the screen always say the same thing, and the words for the
 * second are the Monsters tab's own for that monster.
 */

/** How far under the hit points the line goes, which is the height of the grey bar they are
 *  printed on (FUN_2000_8728). */
const UNDER_THE_HIT_POINTS = 0x28;

/** Which view each of the four corners belongs to, so that a line printed at one is broken
 *  before it runs out of the view it is printed over. */
const CORNER_VIEWS = [
  { corner: MW_MONSTER_VIEW_CORNERS.north, view: MW_FRONT_VIEW },
  { corner: MW_MONSTER_VIEW_CORNERS.south, view: MW_BACK_VIEW },
  { corner: MW_MONSTER_VIEW_CORNERS.west, view: MW_WEST_VIEW },
  { corner: MW_MONSTER_VIEW_CORNERS.east, view: MW_EAST_VIEW },
];

/** How many characters fit between a corner and the right-hand edge of its own view. The four
 *  views are all about the same width, so this hardly changes between them. */
function lineCharacters(corner: MwMonsterViewCorner): number {
  const found = CORNER_VIEWS.find((one) => one.corner.x === corner.x && one.corner.y === corner.y);
  const right = found?.view.right ?? MW_FRONT_VIEW.right;
  return Math.max(1, Math.trunc((right - corner.x) / strokeAdvance('mw', 0)));
}

/**
 * The chance the next swing lands, printed under the bar the hit points are on and lined up with
 * the level, which is the corner itself: the hit points are printed further along the line, and
 * from there this longer line would run off the right of the east view. What the monster does
 * beyond an ordinary hit runs on down from there, a line at a time. Nothing is printed when
 * nothing is being fought.
 */
export function mwDebugMonsterLines(game: MwGame, corner: MwMonsterViewCorner): ScreenLine[] {
  const engaged = mwEngagedMonster(game);
  if (engaged === null) return [];
  const kind = MONSTERS[game.monsters[game.engaged].type];
  const effects = kind ? describeEffects(kind) : [];
  const texts = [
    `HIT:${(engaged.hitChance * 100).toFixed(1)}%`,
    ...wrapToWidth(effects, lineCharacters(corner)),
  ];
  const step = strokeLineHeight(0);
  return texts.map((text, at) => ({
    text,
    x: corner.x,
    y: corner.hpY + UNDER_THE_HIT_POINTS + at * step,
    font: 0,
    colour: MW_COLOURS.monsterText,
  }));
}
