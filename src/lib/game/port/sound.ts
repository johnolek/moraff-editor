import { playTones, type Tone } from '../../speaker';
import type { Game } from './state';

/**
 * The four noises Dungeons of the Unforgiven makes, all of them in a fight. Nothing else in the
 * game — walking, digging, levelling, finding treasure, the whole town — makes any sound at all.
 *
 * Each is a wrapper around `sound` (exe 1000:3c34) and `nosound` (exe 1000:3c60), the stock
 * Borland pair, with `delay` (exe 1000:2789) between the notes. Each asks the sound switch
 * DS:022b first, and the two a swing makes ask the high speed option and the repeat-fight flag
 * as well.
 */

/** How long each step of the two sweeps is held: `delay(8)` in both loops. */
const SWEEP_MS = 8;

/**
 * FUN_2000_7dec (exe 2000:7dec, unf.c "FUN_2000_7dec"), which `strike` calls when the blow lands:
 * a rising sweep from 120 Hz, ten hertz at a time, held 8 ms a step.
 *
 * The loop stops below 210 rather than at it, so the last step is 200 Hz and the sweep is nine
 * steps of 8 ms.
 */
export function blowLandedTones(): Tone[] {
  const tones: Tone[] = [];
  for (let hz = 0x78; hz < 0xd2; hz += 10) tones.push({ hz, ms: SWEEP_MS });
  return tones;
}

/**
 * FUN_2000_826d (exe 2000:826d, unf.c "FUN_2000_826d"), which `defend` calls when the monster's
 * blow lands: a falling sweep from 700 Hz, twenty hertz at a time, held 8 ms a step. The loop
 * stops above 400, so the last step is 420 Hz and the sweep is fifteen steps.
 */
export function blowTakenTones(): Tone[] {
  const tones: Tone[] = [];
  for (let hz = 700; hz > 400; hz -= 0x14) tones.push({ hz, ms: SWEEP_MS });
  return tones;
}

/** FUN_3000_b0ea (exe 3000:b0ea, unf.c "FUN_3000_b0ea"), the first thing `kill_monster` does. */
export const MONSTER_KILLED_TONES: readonly Tone[] = [
  { hz: 0x2a8, ms: 0x8c },
  { hz: 0x2c6, ms: 0x6e },
];

/**
 * FUN_2000_907b (exe 2000:907b, unf.c "FUN_2000_907b"), the first thing the death routine
 * FUN_2000_9232 does.
 */
export const DEATH_TONES: readonly Tone[] = [
  { hz: 0x8c, ms: 0x2e4 },
  { hz: 0x5a, ms: 0x29e },
];

/**
 * The gate the two swing sounds share (exe 2000:7dec and 2000:826d): a swing makes no noise under
 * the high speed option, and none while Ctrl-F is swinging on its own, so a player in a hurry is
 * not sworn at by the speaker.
 */
function fightSoundIsWanted(game: Game): boolean {
  return game.sound && !game.highSpeed && !game.repeatFight;
}

/** FUN_2000_7dec (exe 2000:7dec) with its gates, as `strike` reaches it. */
export function playBlowLanded(game: Game): void {
  if (fightSoundIsWanted(game)) playTones(blowLandedTones());
}

/** FUN_2000_826d (exe 2000:826d) with its gates, as `defend` reaches it. */
export function playBlowTaken(game: Game): void {
  if (fightSoundIsWanted(game)) playTones(blowTakenTones());
}

/** FUN_3000_b0ea (exe 3000:b0ea), which asks the sound switch and nothing else. */
export function playMonsterKilled(game: Game): void {
  if (game.sound) playTones(MONSTER_KILLED_TONES);
}

/** FUN_2000_907b (exe 2000:907b), which asks the sound switch and nothing else. */
export function playDeath(game: Game): void {
  if (game.sound) playTones(DEATH_TONES);
}
