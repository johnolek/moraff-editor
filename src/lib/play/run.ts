import type { PortedGameId } from '../app-state.svelte';
import { SeededRng, type Rng } from '../game/port/rng';
import { MORAFFS_REVENGE_MAP, MORAFFS_WORLD_MAP, UNFORGIVEN_MAP } from '../map/game';
import { runMoveControl, startGame, type CharacterFile } from './engine';
import { runPlayLoop, type PlayLoopSession } from './loop';
import { KEY } from './keys';
import { runMwMoveControl, startMwGame, type MwCharacterFile } from './mw/engine';
import { MW_KEY, mwTurn } from './mw/keys';
import { REV_CLOCK_TICK, runRevDungeon, startRevGame, type RevCharacterFile } from './rev/engine';
import { REV_KEY } from './rev/keys';

/**
 * The run log: everything a game played here was, written down as it is played.
 *
 * Two of the three games are turn based and every random number they draw comes from one
 * generator, so a run is completely described by three things — the character's record as play
 * began, the seed the generator was started from, and the keys that were pressed, in order.
 * Moraff's Revenge is not turn based, and the answer is the same shape: the ticks of the clock
 * its monsters move on are written into the log as inputs of their own, so a replay makes the
 * same number of them in the same places and needs no clock. Running the same engine over the
 * three again reproduces the whole game, which is what lets a claimed ending be checked rather
 * than believed. `replayRun` is the check.
 *
 * Nothing here touches the browser: the log is built and replayed under Node just as it is in a
 * tab.
 */

/** The shape of the log itself. A reader that does not know this number should not trust what it
 *  finds. */
export const RUN_LOG_VERSION = 2;

/** Which of the playable games a run was played in. */
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

/**
 * The keys of Dungeons of the Unforgiven that count as an action, each named with the handler
 * `KEY_HANDLERS` in `engine.ts` gives it.
 *
 * An action is a key the loop hands to a handler that spends a moment of the character's time, or
 * opens one of the town's buildings or a spell: a step, a swing, a cast, a night at the inn, a
 * dig. A key that only puts something on the screen — the stats, the experience table, the
 * pockets, the monster manual, the two spell lists, the money, the maps, the settings — is not an
 * action, and neither is a turn, which in this game costs the character nothing. Fewest actions is
 * the order a leaderboard puts runs in, so this is the number a run is judged by.
 *
 * It counts the keys the game was asked for rather than the moments it granted: a step into a wall
 * and a swing at nothing are each an action, the same as they are a key. Ctrl-F is not here
 * because it only raises the repeat flag; every swing it goes on to take arrives as an F of its
 * own and is counted as one.
 */
const UNFORGIVEN_ACTIONS = new Set<number>([
  KEY.arrowUp, // stepForward, and the step movecontrol resolves at the end of the pass
  KEY.enter, // waitAMoment: leave the square and arrive on it again
  KEY.down, // goDown: the ladder down, and change_module
  KEY.up, // goUp: the ladder up, or into the store, the temple, the bank or the inn
  KEY.trapDoor, // goThroughTrapDoor: trapdoor_dest
  KEY.dig, // digHole: dig_hole spends a moment for each of its flashes
  KEY.fight, // swingAtMonster: strike, and the time the swing costs
  KEY.cast, // castASpell: cast_a_spell, which ends in pass_moment
  KEY.useItem, // useAnItem: use_magic_item
]);

/** The same in Moraff's World, by the handler `MW_KEY_HANDLERS` in `mw/engine.ts` gives it. Its
 *  four arrows each face the character and step them, so all four are actions; the turn where the
 *  character stands, which this port does outside the loop, costs nothing and is not one. */
const MORAFFS_WORLD_ACTIONS = new Set<number>([
  MW_KEY.arrowUp, // turnAndStep
  MW_KEY.arrowDown,
  MW_KEY.arrowLeft,
  MW_KEY.arrowRight,
  MW_KEY.wait, // waitAMoment
  MW_KEY.space, // the same branch as T
  MW_KEY.down, // goDown: the ladder down, or dig_hole
  MW_KEY.up, // goUp: the ladder up, or the town's buildings
  MW_KEY.trapDoor, // goThroughTrapDoor
  MW_KEY.fight, // swingAtMonster: strike and the two spend_time calls after it
  MW_KEY.cast, // castAtTheSpellScreen: spell_screen
  MW_KEY.useItem, // useAnItem
]);

/**
 * The same in Moraff's Revenge, by the handler `REV_KEY_HANDLERS` and the fight prompt give it.
 *
 * All four arrows are here. Which of them steps depends on the movement mode Escape switches, and
 * the log holds the key rather than what it did, so a run played with the turning arrows counts
 * its turns as well as its steps. The five keys of the fight prompt are each a swing; C, I, T, W
 * and A each spend the character's own moment even where this port has not built what they do,
 * so they are counted.
 */
const MORAFFS_REVENGE_ACTIONS = new Set<number>([
  REV_KEY.arrowUp,
  REV_KEY.arrowDown,
  REV_KEY.arrowLeft,
  REV_KEY.arrowRight,
  REV_KEY.down, // a ladder down, or the false floor a chute left
  REV_KEY.up, // a ladder up, or the rope into one of the town's ten buildings
  REV_KEY.sword, // the four swings of the fight prompt
  REV_KEY.mace,
  REV_KEY.knife,
  REV_KEY.fists,
  REV_KEY.breathe,
  REV_KEY.cast,
  REV_KEY.item,
  REV_KEY.pill,
  REV_KEY.wand,
  REV_KEY.abandon,
]);

const ACTIONS: Record<RunGame, Set<number>> = {
  unforgiven: UNFORGIVEN_ACTIONS,
  moraffsWorld: MORAFFS_WORLD_ACTIONS,
  revenge: MORAFFS_REVENGE_ACTIONS,
};

/** Whether a key the loop has dispatched counts as one of the run's actions. */
export function countsAsAction(game: RunGame, key: number): boolean {
  return ACTIONS[game].has(key);
}

/**
 * What a run is verified against: the handful of things that happened in it worth naming.
 *
 * A boss is a section's Shadow boss in Dungeons of the Unforgiven (0 to 19) and one of the eight
 * quest bosses in Moraff's World (0 to 7); a level is the one the character woke on at the inn,
 * or bought at Moraff's Revenge's temple; a dungeon is the module or the dungeon the character
 * moved to; a floor is the deepest one a Moraff's Revenge character has reached, which is what
 * that game is measured by since it has only the one dungeon. A death and a win have nothing to
 * count, and `which` is 0 for them.
 */
export type MilestoneKind = 'boss' | 'level' | 'dungeon' | 'floor' | 'death' | 'win';

export interface Milestone {
  kind: MilestoneKind;
  /** Which boss, which level, which module or dungeon. */
  which: number;
  /** How many actions the run had spent by then. */
  actions: number;
  /** The game's own clock: the seconds call_check_eng counts in Dungeons of the Unforgiven, the
   *  moves spend_time counts in Moraff's World. */
  time: number;
  /** The floor the character was standing on. */
  floor: number;
}

/** Where the game had got to when a milestone was reached. */
export interface RunClock {
  time: number;
  floor: number;
  /** The module of Dungeons of the Unforgiven, or the dungeon of Moraff's World. */
  dungeon: number;
}

/**
 * The events either game's ported functions push that become milestones. Both `GameEvent` and
 * `MwEvent` carry these three, so a run reads them the same way whichever game it is.
 */
export type RunEvent =
  | { kind: 'bossKilled'; boss: number }
  | { kind: 'gameWon' }
  | { kind: 'levelGained'; level: number };

/** The same event, if it is one a run keeps. The events arrive as two unions this file does not
 *  import, and their three shared members are what it reads. */
function runEvent(event: { kind: string }): RunEvent | null {
  const kind = event.kind;
  if (kind !== 'bossKilled' && kind !== 'gameWon' && kind !== 'levelGained') return null;
  return event as RunEvent;
}

/** How a run stands, for the line the Play tab shows. */
export interface RunSummary {
  actions: number;
  milestones: Milestone[];
}

/** "1 action", "12 actions": how much of a run has been spent. */
export function actionWords(actions: number): string {
  return `${actions} action${actions === 1 ? '' : 's'}`;
}

/**
 * The few words a milestone shows as. `dungeonName` is the game's own name for a module or a
 * dungeon, which `src/lib/map/game.ts` gives for each game.
 */
export function milestoneWords(milestone: Milestone, dungeonName: (dungeon: number) => string): string {
  if (milestone.kind === 'boss') return `Boss ${milestone.which + 1} beaten`;
  if (milestone.kind === 'level') return `Level ${milestone.which}`;
  if (milestone.kind === 'dungeon') return dungeonName(milestone.which);
  if (milestone.kind === 'floor') return `Floor ${milestone.which}`;
  return milestone.kind === 'win' ? 'Won' : 'Died';
}

/** Where in the run a milestone happened. `clock` is the game's own words for its time, such as
 *  "12 seconds" or "12 moves". */
export function milestoneNote(milestone: Milestone, clock: string): string {
  const where = milestone.floor === 0 ? 'in the town' : `on floor ${milestone.floor}`;
  return `After ${actionWords(milestone.actions)} and ${clock}, ${where}.`;
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
  /** How many of those keys were actions, which is what a run is judged by. */
  actions: number;
  /** The game's own clock where the run had got to: the seconds call_check_eng counts in
   *  Dungeons of the Unforgiven, the moves spend_time counts in Moraff's World. */
  time: number;
  /** What the run reached, oldest first. */
  milestones: Milestone[];
  /**
   * How many times a record written outside the game — the Save Editor's — reached the character
   * while the run was being played. A run with any cannot be checked: those records are not in
   * the log, so a replay has no way of putting the character back into them.
   */
  edits: number;
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
  /** How many actions the run has spent. */
  actions = 0;
  /** How many records written outside the game have reached the character. */
  edits = 0;
  /** What the run has reached, oldest first. */
  readonly milestones: Milestone[] = [];

  /** Where the game has got to, which stamps a milestone. Null until the session hands it over. */
  private clock: (() => RunClock) | null = null;
  /** The events the game's ported functions push, and how many of them have been read. */
  private events: readonly { kind: string }[] = [];
  private eventsRead = 0;
  /** The module or dungeon the character was last seen in, so that moving between them shows. */
  private dungeon = 0;
  /** The deepest floor the character has reached, which only Moraff's Revenge counts. */
  private deepest = 0;

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

  /**
   * The session hands over the events its ported functions push and the game's own clock, which
   * between them are where the milestones come from. Anything already pushed belongs to setting
   * the game up rather than to playing it.
   */
  watch(events: readonly { kind: string }[], clock: () => RunClock): void {
    this.events = events;
    this.eventsRead = events.length;
    this.clock = clock;
    this.dungeon = clock().dungeon;
    this.deepest = clock().floor;
  }

  /** A key on its way into the game. */
  input(key: number): void {
    this.inputs.push(key);
  }

  /** Moraff's World's turn where the character stands, which is no key of the game's. */
  turned(dir: number): void {
    this.inputs.push(TURN_INPUTS[dir]);
  }

  /** The loop has read a key and is about to hand it to its handler. */
  dispatched(key: number): void {
    this.note();
    if (countsAsAction(this.game, key)) this.actions += 1;
  }

  /** A record the Save Editor wrote has reached the character, which is the end of what this log
   *  describes: the log holds the record the run began with and nothing since. */
  edited(): void {
    this.edits += 1;
  }

  /** The character is dead, which is the end of the run. */
  died(): void {
    this.note();
    const now = this.clock?.();
    if (now) this.milestones.push({ kind: 'death', which: 0, actions: this.actions, time: now.time, floor: now.floor });
  }

  /**
   * Everything the game has done since this was last asked, as milestones. It is asked before
   * every action, at a death and whenever the log is read, so nothing is left behind.
   */
  private note(): void {
    const clock = this.clock;
    if (clock === null) return;
    const now = clock();
    const reach = (kind: MilestoneKind, which: number) =>
      this.milestones.push({ kind, which, actions: this.actions, time: now.time, floor: now.floor });
    if (now.dungeon !== this.dungeon) {
      this.dungeon = now.dungeon;
      reach('dungeon', now.dungeon);
    }
    // Moraff's Revenge has one dungeon and seventy levels of it, so how deep a character got is
    // what a run of that game is measured by. The other two are measured by their modules and
    // dungeons and their logs are left as they were.
    if (this.game === 'revenge' && now.floor > this.deepest) {
      this.deepest = now.floor;
      reach('floor', now.floor);
    }
    while (this.eventsRead < this.events.length) {
      const event = runEvent(this.events[this.eventsRead++]);
      if (event === null) continue;
      if (event.kind === 'bossKilled') reach('boss', event.boss);
      if (event.kind === 'levelGained') reach('level', event.level);
      if (event.kind === 'gameWon') reach('win', 0);
    }
  }

  /** How the run stands, which is what the Play tab draws. */
  summary(): RunSummary {
    this.note();
    return { actions: this.actions, milestones: this.milestones.map((milestone) => ({ ...milestone })) };
  }

  log(): RunLog {
    const summary = this.summary();
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
      actions: summary.actions,
      time: this.clock?.().time ?? 0,
      milestones: summary.milestones,
      edits: this.edits,
    };
  }
}

/** Where a run ended: what a claim about it is checked against. */
export interface RunReplay {
  /** The character's record as the game would save it, which is the whole of what they are. */
  record: Uint8Array;
  place: { x: number; y: number; floor: number; dungeon: number; dir: number };
  /** The game's own clock: seconds in Dungeons of the Unforgiven, moves in Moraff's World. */
  time: number;
  actions: number;
  milestones: Milestone[];
  /** The loop came back: the character quit or died. */
  over: boolean;
  dead: boolean;
}

/**
 * What a run needs of the game it was played in: the loop that plays it again, the game's own
 * words for its clock, and its own name for a dungeon.
 *
 * A game with an entry in {@link RUN_GAMES} can be recorded, replayed and checked, and nothing
 * that does any of those three has to know which games there are.
 */
export interface RunGameEngine {
  replay(log: RunLog, run: RunRecorder): Promise<RunReplay>;
  /** "12 seconds" in Dungeons of the Unforgiven, "12 moves" in Moraff's World. */
  clockWords(time: number): string;
  /** The game's own name for one of its modules or dungeons. */
  dungeonName(dungeon: number): string;
}

/**
 * Play a run log through the engine again and hand back where it ended.
 *
 * This is the check MORF-145 is for: a claimed ending is believed because the same engine, given
 * the same record, the same seed and the same keys, arrives at the same place. It runs under Node
 * as well as in a browser, since nothing here draws.
 *
 * The engine it runs is this build's. A log whose `engine` is not {@link ENGINE_COMMIT} was made
 * by another one and its ending is only as good as the two engines agreeing; the caller is what
 * compares them.
 */
export async function replayRun(log: RunLog): Promise<RunReplay> {
  const record = decodeRecord(log.record);
  const run = new RunRecorder({
    game: log.game,
    name: log.name,
    record,
    seed: log.seed,
    startedAt: log.startedAt,
    mode: log.mode,
    replaying: true,
  });
  return RUN_GAMES[log.game].replay(log, run);
}

/** Let the loop take what it has been given and come back to waiting for the next key. */
function loopRuns(): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve));
}

/**
 * A replay whose loop threw is no replay at all, so the throw is raised again here.
 *
 * `runPlayLoop` catches it to keep a tab from freezing; a replay has no tab, and the numbers a
 * game left half-played hold would be read as the run having gone somewhere else rather than as
 * the engine having stopped.
 */
function stoppedReplay(session: PlayLoopSession): void {
  if (session.stopped !== null) throw new Error(session.stopped);
}

async function replayUnforgiven(log: RunLog, run: RunRecorder): Promise<RunReplay> {
  const file: CharacterFile = {
    bytes: run.record.slice(),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
  };
  const session = startGame(file, run.rng, run);
  void runPlayLoop(session, runMoveControl(session));
  await loopRuns();
  for (const input of log.inputs) {
    if (session.over) break;
    session.press(input);
    await loopRuns();
  }
  session.finish();
  stoppedReplay(session);
  // save_player is what turns the character back into a record, and the record is what a claim
  // about a run is made of. It writes nothing outside this replay.
  session.save();
  const pc = session.game.pc;
  return {
    record: file.bytes,
    place: { x: pc.x, y: pc.y, floor: pc.level, dungeon: pc.module, dir: pc.dir },
    time: session.game.secondsElapsed,
    actions: run.actions,
    milestones: run.log().milestones,
    over: session.over,
    dead: session.dead,
  };
}

async function replayMoraffsWorld(log: RunLog, run: RunRecorder): Promise<RunReplay> {
  const file: MwCharacterFile = {
    bytes: run.record.slice(),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
  };
  const session = startMwGame(file, run.rng, run);
  void runPlayLoop(session, runMwMoveControl(session));
  await loopRuns();
  for (const input of log.inputs) {
    if (session.over) break;
    const dir = turnedTo(input);
    if (dir === -1) session.press(input);
    else mwTurn(session, dir);
    await loopRuns();
  }
  session.finish();
  stoppedReplay(session);
  session.save();
  const pc = session.game.pc;
  return {
    record: file.bytes,
    place: { x: pc.x, y: pc.y, floor: pc.floor, dungeon: pc.dungeon, dir: pc.dir },
    time: session.game.movesTaken,
    actions: run.actions,
    milestones: run.log().milestones,
    over: session.over,
    dead: session.dead,
  };
}

/**
 * Moraff's Revenge, replayed.
 *
 * Its log holds two kinds of input: the keys the dungeon read, and {@link REV_CLOCK_TICK}, one
 * for each tick of the clock the monsters moved on. A tick is not a key and is not pressed —
 * `session.tick()` runs the passes of the poll it stands for, drawing the same numbers from the
 * same generator, which is what makes a run that nobody was sitting still through replayable.
 */
async function replayMoraffsRevenge(log: RunLog, run: RunRecorder): Promise<RunReplay> {
  const file: RevCharacterFile = {
    bytes: run.record.slice(),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
    name: log.name,
  };
  const session = startRevGame(file, run.rng, run);
  void runPlayLoop(session, runRevDungeon(session));
  await loopRuns();
  for (const input of log.inputs) {
    if (session.over) break;
    if (input === REV_CLOCK_TICK) session.tick();
    else session.press(input);
    await loopRuns();
  }
  session.finish();
  stoppedReplay(session);
  session.save();
  const pc = session.game.pc;
  return {
    record: file.bytes,
    place: { x: pc.column, y: pc.row, floor: pc.dungeonLevel, dungeon: 0, dir: pc.facing },
    time: session.ticks,
    actions: run.actions,
    milestones: run.log().milestones,
    over: session.over,
    dead: session.dead,
  };
}

export const RUN_GAMES: Record<RunGame, RunGameEngine> = {
  unforgiven: {
    replay: replayUnforgiven,
    clockWords: (seconds) => `${seconds} second${seconds === 1 ? '' : 's'}`,
    dungeonName: UNFORGIVEN_MAP.dungeonName,
  },
  moraffsWorld: {
    replay: replayMoraffsWorld,
    // The clock counts in fractions of a move, which is rounded wherever it is shown.
    clockWords: (moves) => `${Math.round(moves)} move${Math.round(moves) === 1 ? '' : 's'}`,
    dungeonName: MORAFFS_WORLD_MAP.dungeonName,
  },
  revenge: {
    replay: replayMoraffsRevenge,
    // This game's clock is the ticks of the poll its monsters move on, which `rev/clock.ts` has.
    clockWords: (ticks) => `${ticks} tick${ticks === 1 ? '' : 's'}`,
    dungeonName: MORAFFS_REVENGE_MAP.dungeonName,
  },
};

/** Whether a value out of a file names one of the games a run can have been played in. */
export function isRunGame(value: unknown): value is RunGame {
  return typeof value === 'string' && Object.keys(RUN_GAMES).includes(value);
}
