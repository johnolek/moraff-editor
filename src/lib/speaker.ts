/**
 * The PC speaker the three games play through.
 *
 * All three drive it the same way: a frequency is written to channel 2 of the 8253, which runs in
 * square-wave mode, and the speaker is gated on until the next write. So one square-wave
 * oscillator, one frequency at a time, is the whole instrument — Dungeons of the Unforgiven's
 * `sound` (UNF.EXE 1000:3c34) and Moraff's World's (WORLD.EXE 1000:3306) are the same routine,
 * and Moraff's Revenge reaches the same hardware through BASIC's `PLAY`.
 *
 * Sound is a side of the display and never of the game. Nothing here is awaited, nothing here
 * changes a game's state, and a session nobody is listening to — a replay, the verifier under
 * Node — never opens a speaker at all.
 */

/** One step of a sequence: a frequency to hold for `ms` milliseconds, or 0 Hz for a rest. */
export interface Tone {
  hz: number;
  ms: number;
}

/**
 * How loud a square wave is played back, as a share of full scale.
 *
 * A square wave at full scale is painfully loud through headphones, and the games' cues are short
 * and repeated often, so this is well down.
 */
const VOLUME = 0.07;

/**
 * The speaker, once a player has asked for one, and the sequence it is playing.
 *
 * A browser refuses to start audio that nothing the player did asked for, so this stays null
 * until a tab calls {@link armSpeaker} from a key the player pressed. Under Node there is no
 * `AudioContext` and it stays null for good.
 */
let speaker: AudioContext | null = null;
let playing: OscillatorNode | null = null;

/**
 * Open the speaker, if this is somewhere that has one and it is not open already.
 *
 * The three Play tabs call this from the key handler the player's key arrives on, which is the
 * gesture a browser wants before it will let a page make a noise.
 */
export function armSpeaker(): void {
  if (speaker || typeof AudioContext === 'undefined') return;
  speaker = new AudioContext();
}

/**
 * Play a sequence, and hand control straight back: no game waits for a sound, exactly as no game
 * waits for a frame that is being held.
 *
 * The real speaker holds one frequency at a time, so a sequence starting while another is playing
 * cuts the other off rather than sounding over it.
 */
export function playTones(tones: readonly Tone[]): void {
  const context = speaker;
  if (!context || tones.length === 0) return;
  silence();
  const gain = context.createGain();
  gain.connect(context.destination);
  const oscillator = context.createOscillator();
  oscillator.type = 'square';
  oscillator.connect(gain);
  let at = context.currentTime;
  for (const tone of tones) {
    gain.gain.setValueAtTime(tone.hz > 0 ? VOLUME : 0, at);
    if (tone.hz > 0) oscillator.frequency.setValueAtTime(tone.hz, at);
    at += tone.ms / 1000;
  }
  gain.gain.setValueAtTime(0, at);
  oscillator.onended = () => {
    if (playing === oscillator) playing = null;
  };
  oscillator.start();
  oscillator.stop(at);
  playing = oscillator;
}

/** `nosound` (UNF.EXE 1000:3c60, WORLD.EXE 1000:3332): stop whatever is playing. */
export function silence(): void {
  const oscillator = playing;
  if (!oscillator) return;
  playing = null;
  oscillator.onended = null;
  oscillator.stop();
  oscillator.disconnect();
}

/** Whether a speaker was ever opened, which is what a test asks to see that nothing was. */
export function speakerIsOpen(): boolean {
  return speaker !== null;
}
