import { playTones } from '../../speaker';
import { blowLandedTones, blowTakenTones, DEATH_TONES, MONSTER_KILLED_TONES } from '../port/sound';
import type { MwGame } from './state';

/**
 * The four noises Moraff's World makes, all of them in a fight. Nothing else in the game makes a
 * sound at all.
 *
 * They are Dungeons of the Unforgiven's four cues three years earlier, note for note the same:
 * FUN_2000_5bb6 (WORLD.EXE 2000:5bb6) is UNF.EXE's FUN_2000_7dec, FUN_2000_6123 (2000:6123) is
 * FUN_2000_826d, FUN_3000_d4d9 (3000:d4d9) is FUN_3000_b0ea, and FUN_2000_722c (2000:722c) is
 * FUN_2000_907b. The sequences are taken from the other port rather than written out twice, the
 * way `ScreenLine` already is.
 *
 * What differs is the gate. All four ask the sound switch DS:119f and nothing else, so a swing
 * makes its noise here even where Dungeons of the Unforgiven silences its own.
 */

/** FUN_2000_5bb6 (WORLD.EXE 2000:5bb6), which `strike` calls when the blow lands. */
export function playMwBlowLanded(game: MwGame): void {
  if (game.sound) playTones(blowLandedTones());
}

/** FUN_2000_6123 (WORLD.EXE 2000:6123), which `monster_turn` calls when the monster's lands. */
export function playMwBlowTaken(game: MwGame): void {
  if (game.sound) playTones(blowTakenTones());
}

/** FUN_3000_d4d9 (WORLD.EXE 3000:d4d9), the first thing `monster_killed` does. */
export function playMwMonsterKilled(game: MwGame): void {
  if (game.sound) playTones(MONSTER_KILLED_TONES);
}

/** FUN_2000_722c (WORLD.EXE 2000:722c), the first thing the death routine does. */
export function playMwDeath(game: MwGame): void {
  if (game.sound) playTones(DEATH_TONES);
}
