import { attackTiming } from '../../game/mw-port/combat';
import { bundledMwDungeon } from '../../game/mw-dungeon';
import { recomputeWeight } from '../../game/mw-port/magic';
import { mwMenuKey, mwLineMenuKey } from '../../game/mw-port/screens';
import type { MwGame } from '../../game/mw-port/state';
import { MW_SQUARE_PLAYER, mwClearMessageLine, mwSetOccupant, newMwGame } from '../../game/mw-port/state';
import type { Rng } from '../../game/port/rng';
import type { ScreenLine } from '../../game/port/state';
import { MORAFFS_WORLD_MAP, type MapSquare } from '../../map/game';
import type { StockedMonster } from '../../map/stocking';
import { adviseTheWalker, type MwLessons } from './advice';
import { fallDownAChute, chuteUnder } from './chute';
import { mwDie } from './death';
import { castAtTheSpellScreen, useAnItem } from './cast';
import {
  changeTheBrickSpeed,
  expandTheMap,
  stepTheBackgroundColour,
  switchTheSound,
  zoomTheView,
} from './display';
import { dropSomething } from './drop';
import { swingAtMonster } from './fight';
import { MwFloorMonsters, mwDrawnMonsters, mwEnterLevel } from './floor';
import { MapMemory } from '../memory';
import { killTheDead } from './kill';
import { goDown, goUp, ladderPrompt, ladderUnder } from './ladders';
import { MW_KEY } from './keys';
import {
  chooseArmor,
  chooseWeapon,
  showExperienceNeeded,
  showHelpMenu,
  showMoney,
  showPockets,
  showSpellsInForce,
  showVitalStats,
} from './letters';
import { DEFAULT_PLAY_MODE, type PlayMode } from '../mode';
import { leaveSquare } from './moment';
import { resolveStep, turnAndStep, waitAMoment } from './move';
import { loadMwPlayer, saveMwPlayer } from './record';
import { mwMessageBoxLines, MW_MESSAGE_BOX } from './screens';
import { TimedScreens } from '../timed';
import { quitAndSave } from './quit';
import type { RunRecorder, RunSummary } from '../run';
import { buildingUnder } from './town';
import { explainTrapdoor, goThroughTrapDoor, trapdoorUnder } from './trapdoor';

/**
 * movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol"), the loop Moraff's World is played in,
 * and the session it is played out of.
 *
 * The original blocks on the keyboard in the middle of the loop; here the loop is asynchronous
 * and every read of a key is a promise the Play tab settles. Everything else is the order the
 * original does things in: what it works out about the square before it asks for a key, the key
 * it dispatches on, the monsters' answer, and the step it resolves at the end.
 */

/** How many keys are kept for a loop that is not waiting for one yet. */
const KEY_QUEUE = 4;

/**
 * Not a key: what the loop's wait hands back when the save editor has written the record while
 * the game was waiting for one, so the pass starts again with the character it now describes.
 */
export const MW_RECORD_EDITED = -1;

/** Where the character record lives while it is being played. */
export interface MwCharacterFile {
  /** The record as the roster holds it. */
  bytes: Uint8Array;
  /** save_player (WORLD.EXE 2000:58bf): keep these bytes as the character from now on. */
  write(bytes: Uint8Array<ArrayBuffer>): void;
  /** The character has died, which the roster marks and never undoes. */
  died(): void;
}

/** What movecontrol works out about the square before it reads a key. */
export interface MwTurn {
  session: MwGameSession;
  game: MwGame;
  /** ladder_delta (WORLD.EXE 3000:a449): how many floors a ladder here goes, down being
   *  positive and up negative, and 0 for no ladder. */
  ladder: number;
  /** trapdoor_target (WORLD.EXE 2000:a698): the floor a trap door here leads to, and -1 for
   *  none or one there is no key for. */
  trapdoor: number;
  /** surface_feature (WORLD.EXE 2000:7c2d) on floor 0: 1 store, 2 temple, 3 bank, 4 inn, 5 the
   *  gate to the world map, and 0 for open ground. */
  building: number;
  /** wall_side (WORLD.EXE 3000:a524) on the four sides of the square: 0 wall, 1 door, 2 secret
   *  door, 3 open. */
  sides: MapSquare;
  /** The step the key asked for, which the loop resolves once the key's handler has run. */
  step: { dx: number; dy: number };
}

/** One key movecontrol dispatches on. */
export interface MwKeyHandler {
  /** The function of the game the key runs, for anyone reading the table. */
  c: string;
  run(turn: MwTurn): void | Promise<void>;
}

/** What the Play tab draws. */
export interface MwPlayView {
  place: { x: number; y: number; floor: number; dungeon: number; dir: number };
  rows: MapSquare[][];
  monsters: StockedMonster[];
  /** The eight-line message box, as the game draws it. */
  box: ScreenLine[];
  /** A screen the game has taken the whole display over with; empty when there is none. */
  screen: ScreenLine[];
  /** The line FUN_2000_a9bd puts under the map on a square with a way off the floor. */
  prompt: string | null;
  /** attack_timing's lines about the monster being fought. */
  banner: string[];
  /** Moves of game time the character has spent. */
  moves: number;
  /** The monster the character is facing, or null. */
  engaged: StockedMonster | null;
  /** The loop has come back: the character has quit or died. */
  over: boolean;
  dead: boolean;
  /** How the run stands, or null for a game nobody is recording. */
  run: RunSummary | null;
}

/**
 * One character being played: the game, the floor they stand on, the monsters that floor is
 * stocked with, and the keyboard the loop waits on.
 */
export class MwGameSession {
  readonly game: MwGame;
  readonly floors = new MwFloorMonsters();
  /** The map this character has discovered, which is what the Play tab draws in faithful mode
   *  and what says which monsters can be seen. */
  readonly memory: MapMemory;
  /** The floor the character is on, as the map descriptor generates it. */
  rows: MapSquare[][];
  /** The eight lines showing in the message box. */
  box: string[] = [];
  /**
   * What the fight draws at the top left of the screen — attack_timing's lines about the monster
   * being faced, the swing, the monster's turn and the wall that refuses to move. Every one of
   * those is a print_text at y 0 to 0x78 in colour 15, over the message box rather than in it,
   * so they are kept apart here the way they are on the screen.
   */
  banner: string[] = [];
  /** movecontrol has come back: the character has quit or died. */
  over = false;
  dead = false;
  /**
   * How much of the game the tab is showing (`../mode.ts`). Nothing the game does reads it; it
   * is here so that anything keeping a record of the run can say which mode it was played in.
   */
  mode: PlayMode = DEFAULT_PLAY_MODE;
  /** Called whenever the game is about to wait for a key, so the tab can draw what it is
   *  waiting with. */
  onChange: (() => void) | null = null;
  /**
   * The delays the game holds a drawn message for (WORLD.EXE 1000:22a2), which the tab keeps to.
   * The loop runs straight past them; this is what decides which of the screens it drew is
   * showing.
   */
  private readonly timed = new TimedScreens(() => this.changed());

  /** A key pressed while nothing was waiting for one, which is where DOS kept it too. */
  private queued: number[] = [];
  private waiting: ((key: number) => void) | null = null;
  /** A ported function has called wait_key and is owed a key once it has finished. */
  private waitOwed = false;
  /** How far through the fourteen lessons the little mouse has got (DS:4482). */
  readonly lessons: MwLessons = { next: 0 };

  /** Every box printed since the last one was shown, oldest first. */
  private pending: string[][] = [];
  /** Where what the game says goes while a fight is being drawn. */
  private bannerSink: string[][] | null = null;
  /** The record as the game last read it or wrote it back, which is how a record the save editor
   *  has written is told from the game's own save. */
  private known: Uint8Array;
  /** A record the save editor has written, waiting for the loop to be between actions. */
  private edited: Uint8Array | null = null;
  /** The loop is waiting for the player's key with nothing of the game's own part-way through. */
  private betweenActions = false;

  constructor(
    readonly file: MwCharacterFile,
    rng: Rng,
    /** The run log this game is being written down in, or null for a game nobody is recording. */
    readonly run: RunRecorder | null = null,
  ) {
    this.memory = new MapMemory();
    const pc = loadMwPlayer(file.bytes);
    this.known = file.bytes.slice();
    this.game = newMwGame({
      pc,
      rng,
      isSolid: (x, y, floor, dungeon) => bundledMwDungeon.solid(x, y, floor, dungeon),
      wallSide: (x, y, hv, floor, dungeon) => bundledMwDungeon.side(x, y, hv, floor, dungeon),
      pressAnyKey: () => {
        this.waitOwed = true;
        // A fight stops for a key only where it printed a real message box — the notice a level
        // drain, a poisoning or a disease brings. That is the last thing it said, so it comes
        // out of the banner and into the box.
        const said = this.bannerSink;
        const box = said?.pop();
        if (box) {
          this.pending.push(box);
          this.box = box.slice(0, MW_MESSAGE_BOX.lines);
        }
      },
      delay: (ms) => this.timed.hold(this.game.screen, ms),
    });
    // The boxes go through say and the screens through draw, the way they are kept apart on the
    // screen itself.
    const said = this.game.say;
    this.game.say = (...lines: string[]) => {
      if (this.bannerSink) this.bannerSink.push(lines);
      else {
        this.pending.push(lines);
        this.box = lines.slice(0, MW_MESSAGE_BOX.lines);
      }
      said(...lines);
    };
    // movecontrol puts the character on the occupancy grid and the map cursor in the middle of
    // the view before its first pass.
    this.rows = MORAFFS_WORLD_MAP.floor(pc.floor, pc.dungeon);
    mwEnterLevel(this.game, this.floors, this.rows, pc.floor, this.game.rng);
    this.memory.enterFloor(pc.dungeon, pc.floor);
    mwSetOccupant(this.game, pc.x, pc.y, MW_SQUARE_PLAYER);
    this.game.pc.mapCursorY = this.game.mapViewRows >> 1;
    this.game.pc.mapCursorX = this.game.mapViewColumns >> 1;
    recomputeWeight(this.game);
    run?.watch(this.game.events, () => ({
      time: this.game.movesTaken,
      floor: this.game.pc.floor,
      dungeon: this.game.pc.dungeon,
    }));
  }

  /** A key from the Play tab. */
  press(key: number): void {
    // Whatever is left of a message's delay is given up: the original is not reading the keyboard
    // while it waits, so by the time a key of the player's is looked at the wait is behind it.
    this.timed.release();
    const waiting = this.waiting;
    if (waiting) {
      this.waiting = null;
      waiting(key);
      return;
    }
    if (this.queued.length < KEY_QUEUE) this.queued.push(key);
  }

  /** The `while (kbhit()) getch();` of flush_keys (WORLD.EXE 4000:3532): whatever was typed
   *  while the game was busy is thrown away rather than answering the next menu. */
  flushKeys(): void {
    this.queued = [];
  }

  /** getch (WORLD.EXE 1000:28b4): the next key, once there is one. */
  key(): Promise<number> {
    const queued = this.queued.shift();
    if (queued !== undefined) {
      this.took(queued);
      return Promise.resolve(queued);
    }
    this.changed();
    return new Promise((resolve) => {
      this.waiting = (key) => {
        this.took(key);
        resolve(key);
      };
    });
  }

  /**
   * A key the game has just read, which is where it reaches the run log.
   *
   * The log is what the game read rather than what the player pressed, because the two differ: a
   * key typed while the game was busy is thrown away by {@link flushKeys} and never seen, so a
   * replay that pressed it would act on a key this run did not. {@link MW_RECORD_EDITED} is not a
   * key at all.
   */
  private took(key: number): void {
    if (key !== MW_RECORD_EDITED) this.run?.input(key);
  }

  /**
   * The key movecontrol waits for at the top of a pass, or {@link MW_RECORD_EDITED} when the save
   * editor writes the record while it waits.
   *
   * Nothing of the game's own is running while the loop waits here, which is what makes it the
   * one place a record written outside the game is safe to take.
   */
  async keyOrEdit(): Promise<number> {
    this.betweenActions = true;
    try {
      return await this.key();
    } finally {
      this.betweenActions = false;
    }
  }

  /** FUN_2000_1fbd (WORLD.EXE 2000:1fbd): keys until one of the menu's own digits, or Escape. */
  async menuKey(first: number, last: number): Promise<number> {
    for (;;) {
      const chosen = mwMenuKey(first, last, await this.key());
      if (chosen !== -1) return chosen;
    }
  }

  /**
   * FUN_2000_1d0b (WORLD.EXE 2000:1d0b): the same over a menu that hands back the digit.
   *
   * Escape ends the original's wait and it returns -1, which every caller reads as a line the
   * character owns nothing on, so the menu closes and nothing happens. A key the menu does not
   * take is thrown away and the wait goes on.
   */
  async lineMenuKey(lo: number, hi: number): Promise<number> {
    for (;;) {
      const chosen = mwLineMenuKey(lo, hi, await this.key());
      if (chosen === 'escape') return -1;
      if (chosen !== null) return chosen;
    }
  }

  /** The boxes a ported function printed, taken off the queue rather than left for the loop. */
  takeBoxes(print: () => void): string[][] {
    const from = this.pending.length;
    print();
    return this.pending.splice(from);
  }

  /**
   * attack_timing (WORLD.EXE 2000:9ed9): which monster the character is fighting, and the three
   * lines the game draws about it.
   *
   * Those lines go at y 0x28, 0x50 and 0x78, which is over the message box rather than in it, so
   * they are kept apart here the way they are on the screen. They are drawn again only when the
   * character turns, and go when there is nothing left to fight.
   */
  faceTheMonster(): number {
    return this.fighting(() => attackTiming(this.game));
  }

  /**
   * Run something whose lines belong at the top left of the screen rather than in the box. What
   * it runs has to finish before it returns, so nothing asynchronous belongs here.
   */
  fighting<T>(run: () => T): T {
    const said: string[][] = [];
    const outer = this.bannerSink;
    this.bannerSink = said;
    try {
      return run();
    } finally {
      this.bannerSink = outer;
      if (said.length > 0) this.banner = said.flat();
    }
  }

  /** Boxes shown one after another, each waiting for a key, with the last one left up. */
  async showBoxes(boxes: string[][]): Promise<void> {
    for (let at = 0; at < boxes.length; at++) {
      this.box = boxes[at].slice(0, MW_MESSAGE_BOX.lines);
      if (at < boxes.length - 1) await this.key();
    }
  }

  /**
   * A ported function that draws a screen and calls wait_key: what is on the screen at each of
   * those waits is kept, since the function goes on to clear it, and shown here one at a time.
   */
  async showScreens(draw: () => void): Promise<void> {
    const screen = this.game.screen;
    const pages: ScreenLine[][] = [];
    const owed = this.game.pressAnyKey;
    this.game.pressAnyKey = () => pages.push([...screen]);
    try {
      draw();
    } finally {
      this.game.pressAnyKey = owed;
    }
    for (const page of pages) {
      screen.length = 0;
      screen.push(...page);
      await this.key();
    }
    screen.length = 0;
  }

  /**
   * The boxes and the waits a ported function asked for while it ran. Synchronous code cannot
   * wait, so a box is shown here and the key it wanted is taken here.
   */
  async settle(): Promise<void> {
    const boxes = this.pending;
    this.pending = [];
    for (let at = 0; at < boxes.length - 1; at++) {
      this.box = boxes[at].slice(0, MW_MESSAGE_BOX.lines);
      await this.key();
    }
    if (boxes.length > 0) this.box = boxes[boxes.length - 1].slice(0, MW_MESSAGE_BOX.lines);
    while (this.waitOwed) {
      this.waitOwed = false;
      await this.key();
    }
  }

  /** Everything said since the last key is forgotten, which is what the next key does to it. */
  clearBox(): void {
    this.pending = [];
    this.box = [];
  }

  /** enter_level (WORLD.EXE 2000:55fc): arriving on a floor, and the monsters on it. */
  enterFloor(level: number): void {
    const game = this.game;
    game.pc.floor = level;
    this.rows = MORAFFS_WORLD_MAP.floor(level, game.pc.dungeon);
    mwEnterLevel(game, this.floors, this.rows, level, game.rng);
    this.memory.enterFloor(game.pc.dungeon, level);
  }

  /**
   * The save editor has written the character's record while the game is being played, and the
   * game follows it. The record is read again at the next point the loop is between actions; a
   * loop already waiting for a key is woken so that it takes the edit at once.
   *
   * The bytes the game itself last read or saved are the ones it already has, so its own save
   * writing the record back is not an edit.
   */
  recordEdited(bytes: Uint8Array): void {
    if (sameBytes(bytes, this.known)) return;
    this.edited = bytes;
    if (!this.betweenActions) return;
    const waiting = this.waiting;
    if (!waiting) return;
    this.waiting = null;
    waiting(MW_RECORD_EDITED);
  }

  /**
   * Read the record again, if the save editor has written one. The loop calls this at the top of
   * a pass, where no ported function is part-way through.
   *
   * Everything the record holds becomes the character; everything it does not — the monsters
   * standing on the floor, the monster being fought, the moves a step spends — is left exactly as
   * it was. A record that puts the character on another floor arrives there the way a ladder
   * would, and one that moves them about the floor they are on moves them on the occupancy grid
   * with them.
   */
  takeEdits(): void {
    const bytes = this.edited;
    if (bytes === null) return;
    this.edited = null;
    this.known = bytes.slice();
    this.file.bytes = bytes;
    const game = this.game;
    const pc = game.pc;
    const floor = pc.floor;
    const dungeon = pc.dungeon;
    leaveSquare(game);
    Object.assign(pc, loadMwPlayer(bytes));
    // Starting a session works the carried weight out from what the character owns rather than
    // trusting the figure the record holds, and a record read again is worked out the same way.
    recomputeWeight(game);
    if (pc.floor !== floor || pc.dungeon !== dungeon) {
      game.engaged = -1;
      this.enterFloor(pc.floor);
    }
    mwSetOccupant(game, pc.x, pc.y, MW_SQUARE_PLAYER);
    game.recenterMap = true;
  }

  /** save_player (WORLD.EXE 2000:58bf): the record back into the character it came from. */
  save(): void {
    const bytes = saveMwPlayer(this.game.pc, this.file.bytes);
    this.known = bytes.slice();
    this.file.write(bytes);
  }

  /** The character is dead: the roster is told, and nothing more is written. */
  die(): void {
    this.dead = true;
    this.run?.died();
    this.file.died();
  }

  /** Tell the Play tab to draw. */
  changed(): void {
    this.onChange?.();
  }

  /** Nothing is going to draw this session again, so the message timer is dropped rather than
   *  left holding the page — or a replay under Node — open. */
  finish(): void {
    this.timed.stop();
  }

  view(): MwPlayView {
    const game = this.game;
    const pc = game.pc;
    const drawn = mwDrawnMonsters(game);
    return {
      place: { x: pc.x, y: pc.y, floor: pc.floor, dungeon: pc.dungeon, dir: pc.dir },
      rows: this.rows,
      monsters: drawn,
      box: mwMessageBoxLines(this.box),
      screen: this.timed.showing(game.screen),
      prompt: ladderPrompt(
        ladderUnder(game),
        pc.floor === 0 ? buildingUnder(game) : 0,
        trapdoorHere(this),
      ),
      banner: this.banner,
      moves: game.movesTaken,
      engaged: game.engaged === -1 ? null : (drawn.find((monster) => monster.slot === game.engaged) ?? null),
      over: this.over,
      dead: this.dead,
      run: this.run?.summary() ?? null,
    };
  }
}

/**
 * Whether the square holds a trap door the character has the key for, which is what decides
 * between the prompt's two lines. The box the trap door prints is left to the loop.
 */
function trapdoorHere(session: MwGameSession): boolean {
  const game = session.game;
  if (ladderUnder(game) !== 0) return false;
  const destination = trapdoorUnder(game);
  return destination !== -1 && game.pc.trapdoorKeys[Math.trunc(destination / 10) - 1] !== 0;
}

/** Whether two records hold the same bytes. */
function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  for (let at = 0; at < left.length; at++) {
    if (left[at] !== right[at]) return false;
  }
  return true;
}

/** Start playing a character. */
export function startMwGame(file: MwCharacterFile, rng: Rng, run: RunRecorder | null = null): MwGameSession {
  return new MwGameSession(file, rng, run);
}

/**
 * The keys movecontrol dispatches on, by the byte it reads. A key with no entry here is one the
 * original does nothing with either.
 */
export const MW_KEY_HANDLERS: Record<number, MwKeyHandler> = {
  [MW_KEY.arrowUp]: { c: 'movecontrol, case -0x48 of its key switch', run: (turn) => turnAndStep(turn, 0) },
  [MW_KEY.arrowDown]: { c: 'movecontrol, case -0x50 of its key switch', run: (turn) => turnAndStep(turn, 1) },
  [MW_KEY.arrowLeft]: { c: 'movecontrol, case -0x4b of its key switch', run: (turn) => turnAndStep(turn, 2) },
  [MW_KEY.arrowRight]: { c: 'movecontrol, case -0x4d of its key switch', run: (turn) => turnAndStep(turn, 3) },
  [MW_KEY.wait]: { c: 'movecontrol, the 0x74 branch', run: waitAMoment },
  [MW_KEY.space]: { c: 'movecontrol, the 0x20 branch', run: waitAMoment },
  [MW_KEY.escape]: { c: 'movecontrol, the 0x1b branch', run: wipeTheTopOfTheScreen },
  [MW_KEY.down]: { c: 'movecontrol, the 0x64 branch, and dig_hole', run: goDown },
  [MW_KEY.up]: { c: 'movecontrol, the 0x75 branch, and the town', run: goUp },
  [MW_KEY.trapDoor]: { c: 'movecontrol, the 0x6b branch, and FUN_2000_a6fa', run: goThroughTrapDoor },
  [MW_KEY.fight]: { c: 'strike, and the two spend_time calls after it', run: swingAtMonster },
  [MW_KEY.cast]: { c: 'spell_screen', run: castAtTheSpellScreen },
  [MW_KEY.useItem]: { c: 'movecontrol, case 0x69 of its letter switch', run: useAnItem },
  [MW_KEY.viewStats]: { c: 'view_stats', run: showVitalStats },
  [MW_KEY.viewPrepSpells]: { c: 'FUN_2000_7421(0)', run: (turn) => showSpellsInForce(turn, 0) },
  [MW_KEY.viewBattleSpells]: { c: 'FUN_2000_7421(1)', run: (turn) => showSpellsInForce(turn, 1) },
  [MW_KEY.pockets]: { c: 'FUN_3000_a047', run: showPockets },
  [MW_KEY.help]: { c: 'FUN_2000_919a', run: showHelpMenu },
  [MW_KEY.f1]: { c: 'FUN_2000_919a', run: showHelpMenu },
  [MW_KEY.expNeeded]: { c: 'experience_for_level', run: showExperienceNeeded },
  [MW_KEY.money]: { c: 'financial_statement', run: showMoney },
  [MW_KEY.weapon]: { c: 'movecontrol, the 0x77 branch', run: chooseWeapon },
  [MW_KEY.armor]: { c: 'movecontrol, the 0x61 branch', run: chooseArmor },
  [MW_KEY.save]: { c: 'save_player', run: (turn) => turn.session.save() },
  [MW_KEY.quit]: { c: 'FUN_2000_7b86', run: quitAndSave },
  [MW_KEY.loseItem]: { c: 'drop_item', run: dropSomething },
  [MW_KEY.brickSpeed]: { c: 'movecontrol, the 0x62 branch', run: changeTheBrickSpeed },
  [MW_KEY.sound]: { c: 'movecontrol, the 0x6f branch', run: switchTheSound },
  [MW_KEY.expandMap]: { c: 'movecontrol, the 0x78 branch', run: expandTheMap },
  [MW_KEY.zoomView]: { c: 'FUN_2000_9968', run: zoomTheView },
  [MW_KEY.paletteGreen]: { c: 'movecontrol, the 0x28 branch', run: (turn) => stepTheBackgroundColour(turn, 'GREEN') },
  [MW_KEY.paletteBlue]: { c: 'movecontrol, the 0x29 branch', run: (turn) => stepTheBackgroundColour(turn, 'BLUE') },
  [MW_KEY.paletteRed]: { c: 'movecontrol, the 0x2a branch', run: (turn) => stepTheBackgroundColour(turn, 'RED') },
};

/**
 * movecontrol's 0x1b branch: Escape fills the top left of the screen with the background colour,
 * which takes down both the message box and the fight's banner.
 */
function wipeTheTopOfTheScreen(turn: MwTurn): void {
  turn.session.clearBox();
  turn.session.banner = [];
}

/**
 * movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol"): the loop. It comes back when the
 * character quits or dies, which is where the original goes back to the character select screen.
 */
export async function runMwMoveControl(session: MwGameSession): Promise<void> {
  const game = session.game;
  const pc = game.pc;
  for (;;) {
    // The save editor can write the record while the game is being played, and the top of a pass
    // is where the game takes it: nothing of the original's runs across it, and everything the
    // pass works out about the character and the square is worked out afterwards.
    session.takeEdits();
    if (pc.hp < 0) {
      session.flushKeys();
      await mwDie(session);
      if (session.over) return;
    }
    // movecontrol (mw.c:14005) marks the square under the character's feet before it works
    // anything else out about it.
    session.memory.markStep(pc.x, pc.y);
    const turn = await beginTurn(session);
    session.faceTheMonster();
    await session.settle();
    // FUN_2000_8b3f (WORLD.EXE 2000:8b3f): the four 3-D views, one per compass direction, and
    // every square any of them draws is marked. The four cover the whole circle, so the squares
    // are the same ones Dungeons of the Unforgiven's turning views mark.
    session.memory.markViews(session.rows, pc.x, pc.y);
    const key = await session.keyOrEdit();
    // The square the pass was worked out from is the one the record has just replaced, so the
    // pass starts again rather than answering a key with what the character used to be.
    if (key === MW_RECORD_EDITED) continue;
    session.clearBox();
    // The strip above the box goes with it. A kill's own messages are never wiped by the game —
    // the fill_rect after each covers the box rather than the strip — so one would otherwise
    // stand over the map for the rest of the game, this port having no repaint of the play
    // screen to take it off.
    mwClearMessageLine(game);
    const handler = MW_KEY_HANDLERS[key];
    session.run?.dispatched(key);
    if (handler) await handler.run(turn);
    await session.settle();
    if (session.over) return;
    if (turn.step.dx !== 0 || turn.step.dy !== 0) {
      adviseTheWalker(game, session.lessons);
      await session.settle();
    }
    await killTheDead(session);
    await session.settle();
    if (pc.hp < 0) {
      await mwDie(session);
      if (session.over) return;
    }
    session.fighting(() => resolveStep(turn));
    await session.settle();
    recentreTheMap(session);
  }
}

/** What movecontrol works out about the square the character is standing on, in its order. */
async function beginTurn(session: MwGameSession): Promise<MwTurn> {
  const game = session.game;
  const pc = game.pc;
  const turn: MwTurn = {
    session,
    game,
    ladder: ladderUnder(game),
    trapdoor: -1,
    building: 0,
    sides: session.rows[pc.y][pc.x],
    step: { dx: 0, dy: 0 },
  };
  if (turn.ladder === 0) {
    turn.trapdoor = trapdoorUnder(game);
    // The box goes up on every pass round the loop, and the door is forgotten without its key.
    if (turn.trapdoor !== -1 && !explainTrapdoor(game, turn.trapdoor)) turn.trapdoor = -1;
  }
  if (turn.ladder === 0 && pc.floor > 0 && turn.trapdoor === -1) {
    await fallDownAChute(session, chuteUnder(game));
  }
  // The original works the building out after the fall, so a chute onto floor 0 is standing in
  // the town by the time this runs; the ladder and the trap door it read before the fall are
  // the floor above's and are left as they were.
  if (pc.floor === 0) turn.building = buildingUnder(game);
  turn.sides = session.rows[pc.y][pc.x];
  return turn;
}

/**
 * FUN_3000_b066 (WORLD.EXE 3000:b066) behind DS:123d: the map has scrolled off the character, so
 * the cursor goes back to the middle of the view and the floor is drawn again.
 */
function recentreTheMap(session: MwGameSession): void {
  const game = session.game;
  if (!game.recenterMap) return;
  game.pc.mapCursorY = game.mapViewRows >> 1;
  game.pc.mapCursorX = game.mapViewColumns >> 1;
  game.recenterMap = false;
}

