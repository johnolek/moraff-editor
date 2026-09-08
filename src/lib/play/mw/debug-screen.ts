import type { MwGame } from '../../game/mw-port/state';
import type { MwMonsterViewCorner } from '../../game/mw-port/screens';
import type { ScreenLine } from '../../game/port/state';
import { mwEngagedMonster } from './panel';
import { MW_COLOURS } from './view3d/screen';

/**
 * What debug mode adds to the numbers Moraff's World already prints over the monster it is
 * fighting.
 *
 * The game prints the monster's level, its hit points and what killing it is worth —
 * `mwMonsterViewLines` in `src/lib/game/mw-port/screens.ts` — so the one number left to add is
 * the chance the character's next swing lands, which the game works out on every swing and shows
 * nowhere. It is `mwEngagedMonster`'s, so the view and the panel beside the screen always say the
 * same thing.
 */

/** How far under the hit points the line goes, which is the height of the grey bar they are
 *  printed on. */
const UNDER_THE_HIT_POINTS = 0x28;

/** The same offset along the line the hit points are printed at (FUN_2000_8728). */
const HIT_POINTS_X = 0xdb;

/** The chance the next swing lands, printed under the monster's hit points; nothing at all when
 *  nothing is being fought. */
export function mwDebugMonsterLines(game: MwGame, corner: MwMonsterViewCorner): ScreenLine[] {
  const engaged = mwEngagedMonster(game);
  if (engaged === null) return [];
  return [
    {
      text: `HIT:${(engaged.hitChance * 100).toFixed(1)}%`,
      x: corner.x + HIT_POINTS_X,
      y: corner.hpY + UNDER_THE_HIT_POINTS,
      font: 0,
      colour: MW_COLOURS.monsterText,
    },
  ];
}
