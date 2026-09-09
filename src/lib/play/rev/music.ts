import { playTones, type Tone } from '../../speaker';
import { REV_FOUR_SECONDS } from './held';
import type { RevGame } from './state';

/**
 * Moraff's Revenge's music: a march at the temple, a dirge on death and a hymn at the inns.
 *
 * There is one `PLAY` in the whole module, at 1000:05E2, and three routines that set a string and
 * fall into it. Every tune is prefixed `MB`, so BASIC plays it in the background and the program
 * carries straight on — which is what this port does too.
 *
 * The start-up loading tune is not ported: it is six fragments played one between each `BLOAD`
 * (1000:BBBC, BC18, BCDC, BE47, BF21 and BF30), and this port has no loading to do and no loading
 * screen to play them over.
 */

/**
 * The twelve frequencies of BASIC's top octave, whole hertz, read out of BRUN30.EXE at file
 * offset 0xF8EC: C8 through B8. Every other note is this table halved once per octave down, so
 * octave 0 starts at 65 Hz and octave 2 is the one holding middle C.
 */
const TOP_OCTAVE = [4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902];

/** The highest octave `PLAY` counts, which is the one {@link TOP_OCTAVE} holds. */
const HIGHEST_OCTAVE = 6;

/** How far above the octave's C each of the seven letters is. */
const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** What `PLAY` starts every string at: octave 4, quarter notes, 120 of them a minute. */
const DEFAULT_OCTAVE = 4;
const DEFAULT_LENGTH = 4;
const DEFAULT_TEMPO = 120;

/**
 * The share of a note's time that is sounded: `ML` legato holds it all, `MN` normal holds seven
 * eighths and `MS` staccato three quarters. The rest of the time is silence, so the articulation
 * changes how a tune sounds and not how long it takes.
 */
const ARTICULATION: Record<string, number> = { L: 1, N: 7 / 8, S: 3 / 4 };

/** A whole note is four beats, and the tempo is beats a minute. */
const BEATS_PER_WHOLE_NOTE = 4;
const MS_PER_MINUTE = 60000;

/** What a dot after a note multiplies its length by, once per dot. */
const DOTTED = 1.5;

/**
 * Read a BASIC `PLAY` string into the tones the speaker holds, in order.
 *
 * This understands what the three tunes are written in: `T` tempo, `O` octave with `<` and `>`
 * to step it, `L` default length, `M` for articulation and for foreground or background, `P`
 * rests, and the seven note letters with an optional `#` or `+` sharp, an optional length of
 * their own and any number of dots. Anything else throws, which is safe because the only strings
 * ever read are the three constants below and a test reads all three.
 *
 * `MF` and `MB` are taken and ignored: nothing here blocks, so every tune is background music.
 */
export function revPlayTones(play: string): Tone[] {
  const text = play.toUpperCase();
  const tones: Tone[] = [];
  let octave = DEFAULT_OCTAVE;
  let length = DEFAULT_LENGTH;
  let tempo = DEFAULT_TEMPO;
  let sounded = ARTICULATION.N;
  let at = 0;

  /** The digits at `at`, or null where there are none, which is what makes a length optional. */
  function takeNumber(): number | null {
    const start = at;
    while (at < text.length && text[at] >= '0' && text[at] <= '9') at += 1;
    return at === start ? null : Number(text.slice(start, at));
  }

  /** How long one note lasts, in milliseconds, counting the dots that follow it. */
  function takeDuration(noteLength: number): number {
    let ms = (BEATS_PER_WHOLE_NOTE * MS_PER_MINUTE) / (tempo * noteLength);
    while (text[at] === '.') {
      ms *= DOTTED;
      at += 1;
    }
    return ms;
  }

  /** Put a note or a rest down, with the silence the articulation leaves after a note. */
  function push(hz: number, ms: number): void {
    if (hz === 0) {
      tones.push({ hz: 0, ms });
      return;
    }
    tones.push({ hz, ms: ms * sounded });
    if (sounded < 1) tones.push({ hz: 0, ms: ms * (1 - sounded) });
  }

  while (at < text.length) {
    const command = text[at];
    at += 1;
    if (command === ' ') continue;
    if (command === '<') {
      if (octave > 0) octave -= 1;
      continue;
    }
    if (command === '>') {
      if (octave < HIGHEST_OCTAVE) octave += 1;
      continue;
    }
    if (command === 'T' || command === 'O' || command === 'L') {
      const value = takeNumber();
      if (value === null) throw new Error(`PLAY: ${command} with no number in ${play}`);
      if (command === 'T') tempo = value;
      else if (command === 'O') octave = value;
      else length = value;
      continue;
    }
    if (command === 'M') {
      const mode = text[at];
      at += 1;
      if (mode === 'F' || mode === 'B') continue;
      if (!(mode in ARTICULATION)) throw new Error(`PLAY: M${mode} in ${play}`);
      sounded = ARTICULATION[mode];
      continue;
    }
    if (command === 'P') {
      push(0, takeDuration(takeNumber() ?? length));
      continue;
    }
    if (!(command in SEMITONES)) throw new Error(`PLAY: ${command} in ${play}`);
    let semitone = SEMITONES[command];
    if (text[at] === '#' || text[at] === '+') {
      semitone += 1;
      at += 1;
    }
    push(TOP_OCTAVE[semitone] / 2 ** (HIGHEST_OCTAVE - octave), takeDuration(takeNumber() ?? length));
  }
  return tones;
}

/** 1000:05A0: the march the temple opens with. */
export const TEMPLE_MARCH =
  'T135O3L8CEFGL4<<C<G>>>L8CEFGL4<CL8<G>C>CEFL4GECEDL8G.L16AL8GFEDL4C.L8CL4EL8GGGF4L8<<G+L4F>>L8EFL4GECDL2C';

/** 1000:05AC: the dirge played over a dead character. */
export const DEATH_DIRGE = 'T90O1MNL4F.FL8FL4F.G+L8GL4GL8FL4FL8EL4F.';

/** 1000:05B8: the hymn an inn plays while the character sleeps. */
export const INN_HYMN =
  'T250O3MNL4E.G8>ED2C<E.G8>C<B2.F.>C8FE2CDC<AG2.E.G8>ED2C<E.G8>C<B2.F.>C8FE2CD<AB>C2.';

const TEMPLE_MARCH_TONES = revPlayTones(TEMPLE_MARCH);
const DEATH_DIRGE_TONES = revPlayTones(DEATH_DIRGE);
const INN_HYMN_TONES = revPlayTones(INN_HYMN);

/** 1000:05CB: the `PLAY` all three tunes share, which plays nothing while the sound is off. */
function revPlay(game: RevGame, tones: readonly Tone[]): void {
  if (game.sound === 1) return;
  playTones(tones);
}

/** 1000:05A0, played from 1000:2543 between the temple's welcome and its offer. */
export function revPlayTempleMarch(game: RevGame): void {
  revPlay(game, TEMPLE_MARCH_TONES);
}

/** 1000:05AC, played from 1000:A013 before the screen is cleared for YOU'RE DEAD HA HA HA... */
export function revPlayDeathDirge(game: RevGame): void {
  revPlay(game, DEATH_DIRGE_TONES);
}

/**
 * 1000:05B8, played from 1000:1FC9 after "You are sleeping...", which is a night at any of the
 * three inns.
 *
 * This is the one tune with something behind it: at 1000:05BF the sound being off jumps to the
 * four-second wait at 1000:2F35 instead of playing, so a night takes the same time whether or
 * not there is anything to hear.
 */
export function revPlayInnHymn(game: RevGame): void {
  if (game.sound === 1) {
    game.delay(REV_FOUR_SECONDS);
    return;
  }
  revPlay(game, INN_HYMN_TONES);
}
