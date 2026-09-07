import { swing } from '../../game/mw-port/combat';
import type { MwTurn } from './engine';

/**
 * movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol"), the 0x66 branch of its key switch: the
 * F key swings once at the monster the character is engaging.
 *
 * The swing itself, the weapon's own time and the fifth of whatever the character's agility is
 * short of 85 are all `swing` in `../../game/mw-port/combat.ts`, which is where movecontrol does
 * them inline. With nothing engaged the key does nothing at all and says nothing either.
 */
export function swingAtMonster(turn: MwTurn): void {
  turn.session.fighting(() => swing(turn.game));
}
