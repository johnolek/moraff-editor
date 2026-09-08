import type { PortedGameId } from '../app-state.svelte';
import { SeededRng, type Rng } from '../game/port/rng';

/**
 * The run log: everything a game played here was, written down as it is played.
 *
 * Both games are turn based and every random number they draw comes from one generator, so a run
 * is completely described by three things — the character's record as play began, the seed the
 * generator was started from, and the keys that were pressed, in order. Running the same engine
 * over those again reproduces the whole game, which is what lets a claimed ending be checked
 * rather than believed. `replayRun` is the check.
 *
 * Nothing here touches the browser: the log is built and replayed under Node just as it is in a
 * tab.
 */

/** The shape of the log itself. A reader that does not know this number should not trust what it
 *  finds. */
export const RUN_LOG_VERSION = 1;

/** Which of the two playable games a run was played in. */
export type RunGame = PortedGameId;

/**
 * The commit the engine was built from, which `vite.config.ts` puts here with `git rev-parse
 * HEAD` at build time and vitest puts here the same way. A replay has to run the engine that
 * produced the run, and this is what says which one that was.
 */
export const ENGINE_COMMIT: string =
  typeof __ENGINE_COMMIT__ === 'string' ? __ENGINE_COMMIT__ : 'unknown';

/**
 * Not keys: Moraff's World has no key that turns the character without stepping, so a game played
 * with Dungeons of the Unforgiven's arrows turns them outside the loop (`mwTurn` in
 * `mw/keys.ts`). The log keeps each of those turns as an input of its own, by the facing it
 * leaves — 0 north, 1 south, 2 west, 3 east — so a replay makes the same turns in the same
 * places. Both games' keys are well inside -0x100 to 0xff, so nothing collides.
 */
export const TURN_INPUTS = [-0x101, -0x102, -0x103, -0x104];

/** Which facing a turn input asks for, or -1 for an input that is an ordinary key. */
export function turnedTo(input: number): number {
  return TURN_INPUTS.indexOf(input);
}

/** One game, played, as it is written down and handed about. */
export interface RunLog {
  version: number;
  /** The commit of the engine the run was played on. */
  engine: string;
  game: RunGame;
  /**
   * Which way the game was set up to be played, for a run to be compared with runs played the
   * same way. Null until the Play tab has a mode to name.
   */
  mode: string | null;
  /** The character's name, as the record held it when play began. */
  name: string;
  /** When the run started, as an ISO 8601 instant. */
  startedAt: string;
  /** The seed the run's generator was started from. */
  seed: number;
  /** The character's record as play began, base64. */
  record: string;
  /** Every input the game was given, in order. */
  inputs: number[];
}

/** The bytes of a base64 string from a run log. */
export function decodeRecord(record: string): Uint8Array {
  const binary = atob(record);
  const bytes = new Uint8Array(binary.length);
  for (let at = 0; at < binary.length; at++) bytes[at] = binary.charCodeAt(at);
  return bytes;
}

function encodeRecord(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** A seed of its own for every run, from the best randomness the platform has. */
function drawSeed(): number {
  const bits = new Uint32Array(1);
  crypto.getRandomValues(bits);
  return bits[0];
}

/** What a run is started with. Everything but the game and the record has a sensible default;
 *  a replay is what passes the rest. */
export interface RunStart {
  game: RunGame;
  name: string;
  /** The character's record as play begins. It is copied, so the game may write over it. */
  record: Uint8Array;
  seed?: number;
  startedAt?: string;
  mode?: string | null;
  /**
   * The inputs are coming from a log rather than from a player, so anything the engine would
   * otherwise make up for itself — Ctrl-F's own swings — is taken from the log instead.
   */
  replaying?: boolean;
}

/**
 * One run being written down. The session holds one and hands it every input it is given, and
 * `log()` is the run as it stands.
 */
export class RunRecorder {
  readonly game: RunGame;
  readonly name: string;
  readonly seed: number;
  readonly startedAt: string;
  readonly mode: string | null;
  /** The run is being replayed from a log rather than played by anybody. */
  readonly replaying: boolean;
  /** The character's record as play began. */
  readonly record: Uint8Array;
  /** The generator the game is played through, which is the seed and nothing else. */
  readonly rng: Rng;
  readonly inputs: number[] = [];

  constructor(start: RunStart) {
    this.game = start.game;
    this.name = start.name;
    this.record = start.record.slice();
    this.seed = start.seed ?? drawSeed();
    this.startedAt = start.startedAt ?? new Date().toISOString();
    this.mode = start.mode ?? null;
    this.replaying = start.replaying ?? false;
    this.rng = new SeededRng(this.seed);
  }

  /** A key on its way into the game. */
  input(key: number): void {
    this.inputs.push(key);
  }

  /** Moraff's World's turn where the character stands, which is no key of the game's. */
  turned(dir: number): void {
    this.inputs.push(TURN_INPUTS[dir]);
  }

  log(): RunLog {
    return {
      version: RUN_LOG_VERSION,
      engine: ENGINE_COMMIT,
      game: this.game,
      mode: this.mode,
      name: this.name,
      startedAt: this.startedAt,
      seed: this.seed,
      record: encodeRecord(this.record),
      inputs: [...this.inputs],
    };
  }
}
