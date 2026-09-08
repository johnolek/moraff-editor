import { sectionOf } from '../game/dotu-files.js';
import { bundledDungeon } from '../game/dungeon';
import { attackTiming, engagementTiming } from '../game/port/combat';
import { CAST_SPELLBOOK } from '../game/port/inventory';
import { tabletMessage, townTablet } from '../game/port/hints';
import { checkDeath } from '../game/port/kills';
import { arriveSquare, leaveSquare } from '../game/port/moment';
import { loadPlayer, savePlayer } from '../game/port/record';
import { clearMenuBlock, clearMessageLine } from '../game/port/screens';
import type { Rng } from '../game/port/rng';
import type { Game, ScreenLine } from '../game/port/state';
import { MAP_PLAYER, newGame, sectionMonsterKinds, setMonsterMap } from '../game/port/state';
import { UNFORGIVEN_AREA } from '../map/area';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import type { StockedMonster } from '../map/stocking';
import { boxesOf } from './boxes';
import { castASpell, useAnItem } from './cast';
import { chuteUnder, fallDownChute } from './chute';
import { digHole } from './dig';
import { keepSwinging, readKey, swingAtMonster } from './fight';
import { drawnMonsters, FloorMonsters, loadLevelMap } from './floor';
import { changeArmor, changeWeapon } from './gear';
import { showHelp } from './help';
import { dropSomething } from './items';
import { killTheDead } from './kill';
import { KEY } from './keys';
import { goDown, goUp, ladderPrompt, ladderUnder } from './ladders';
import { readTheMonsterManual } from './manual';
import { countTheMoney, expandTheMap, openGraphics, openOptions, zoomTheView } from './misc';
import { DEFAULT_PLAY_MODE, type PlayMode } from './mode';
import { resolveStep, stepForward, turnAround, turnLeft, turnRight } from './move';
import { quitGame } from './quit';
import { lookInPockets } from './pockets';
import { MESSAGE_BOX_LINES, messageBoxLines } from './screens';
import { TimedScreens } from './timed';
import { showBattleSpells, showExpNeeded, showPrepSpells, showStats } from './spellScreens';
import { buildingUnder, explainTrapdoor, goThroughTrapDoor, trapdoorUnder } from './trapdoor';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), the loop the whole game is played in, and
 * the session it is played out of.
 *
 * The original blocks on the keyboard in the middle of the loop; here the loop is asynchronous
 * and every read of a key is a promise the Play tab settles. Everything else is the order the
 * original does things in: what it works out about the square before it asks for a key, the key
 * it dispatches on, and the step it resolves once the key has been dealt with.
 */

/**
 * The size of the map view the game keeps a cursor in, in squares, in its three biggest video
 * modes. Nothing but the "the map has scrolled off the character" flag reads it here, since the
 * Play tab draws the whole floor on a canvas.
 */
const MAP_VIEW_COLUMNS = 0x13;
const MAP_VIEW_ROWS = 0x21;

/** How many keys are kept for a loop that is not waiting for one yet. */
const KEY_QUEUE = 4;

/**
 * Not a key: what the loop's wait hands back when the save editor has written the record while
 * the game was waiting for one, so the pass starts again with the character it now describes.
 */
export const RECORD_EDITED = -1;

/** Where the character record lives while it is being played. */
export interface CharacterFile {
  /** The record as the roster holds it. */
  bytes: Uint8Array;
  /** save_player (exe 2000:79ad): keep these bytes as the character from now on. */
  write(bytes: Uint8Array<ArrayBuffer>): void;
  /** The character has died, which the roster marks and never undoes. */
  died(): void;
}

/** What movecontrol works out about the square before it reads a key. */
export interface Turn {
  session: GameSession;
  game: Game;
  /** check_for_ladder (exe 3000:827f): how many floors down a ladder here goes, up being
   *  negative, and 0 for no ladder. */
  ladder: number;
  /** town_features (exe 2000:bd32), which is the trap door despite the name the catalog gives
   *  it: the floor a trap door here leads to, and -1 for none or one there is no key for. */
  trapdoor: number;
  /** trapdoor (exe 2000:9cba), which is the town's buildings despite its name: 1 store, 2
   *  temple, 3 bank, 4 inn, and 0 for none. */
  building: number;
  /** retdwall2 (exe 2000:c22d) on the four sides of the square: 0 wall, 1 door, 2 secret door,
   *  3 open, 4 module teleporter. */
  sides: MapSquare;
  /** The step the key asked for, which the loop resolves once the key's handler has run. */
  step: { dx: number; dy: number };
}

/** One key movecontrol dispatches on. */
export interface KeyHandler {
  /** The function of the game the key runs, for anyone reading the table. */
  c: string;
  run(turn: Turn): void | Promise<void>;
}

/** What the Play tab draws. */
export interface PlayView {
  place: { x: number; y: number; floor: number; module: number; dir: number };
  rows: MapSquare[][];
  monsters: StockedMonster[];
  /** The eight-line message box, as the game draws it. */
  box: ScreenLine[];
  /** A screen the game has taken the whole display over with; empty when there is none. */
  screen: ScreenLine[];
  /** The battle banner: the monster being faced, as engagement_timing prints it. */
  banner: string[];
  /** The box the game puts up on a square with a ladder or a doorway. */
  prompt: string[] | null;
  /** Seconds of game time the character has spent. */
  seconds: number;
  /** The monster the character is facing, or null. */
  engaged: StockedMonster | null;
  /** That monster is the one standing straight ahead (DS:c655) rather than one being fought
   *  from another side, which is when the game has its picture on the screen. */
  ahead: boolean;
  /** The loop has come back: the character has quit or died. */
  over: boolean;
  dead: boolean;
}

/**
 * One character being played: the game, the floor they stand on, the monsters that floor is
 * stocked with, and the keyboard the loop waits on.
 */
export class GameSession {
  readonly game: Game;
  readonly floors = new FloorMonsters();
  /** The floor the character is on, as the map descriptor generates it. */
  rows: MapSquare[][];
  /** The lines the game has said since the current action began, which is the message box. */
  box: string[] = [];
  /** The lines of the battle banner, which the game prints beside the monster. */
  banner: string[] = [];
  /** DS:034c: the twelve lines view_battle_spells (exe 2000:9417) has showing, which is how it
   *  knows whether anything has changed since it last drew them. */
  battleSpellsShown: boolean[] = [];
  /** DS:041b: whether the spell menu is drawn in the miniature layout. The original keeps it in
   *  the character record at offset 0x975; the port keeps it for as long as the game is played. */
  miniSpellMenu = false;
  /** movecontrol has come back: the character has quit or died. */
  over = false;
  dead = false;
  /**
   * How much of the game the tab is showing (`mode.ts`). Nothing the game does reads it; it is
   * here so that anything keeping a record of the run can say which mode it was played in.
   */
  mode: PlayMode = DEFAULT_PLAY_MODE;
  /**
   * DS:0437, which Ctrl-F puts up (exe 2000:d285): the loop takes F rather than reading a key,
   * so the character keeps swinging. `fight.ts` is what reads it.
   */
  repeatFight = false;
  /** Called whenever the game is about to wait for a key, so the tab can draw what it is
   *  waiting with. */
  onChange: (() => void) | null = null;
  /**
   * The delays the game holds a drawn message for (exe 1000:2789), which the tab keeps to. The
   * loop runs straight past them; this is what decides which of the screens it drew is showing.
   */
  private readonly timed = new TimedScreens(() => this.changed());

  /** A key pressed while nothing was waiting for one, which is where DOS kept it too. */
  private queued: number[] = [];
  private waiting: ((key: number) => void) | null = null;
  /** A ported function has called mgetch_message and is owed a key once it has finished. */
  private waitOwed = false;
  /** Whether what the game says is going to the banner rather than the message box. */
  private sayingBanner = false;
  /** The record as the game last read it or wrote it back, which is how a record the save editor
   *  has written is told from the game's own save. */
  private known: Uint8Array;
  /** A record the save editor has written, waiting for the loop to be between actions. */
  private edited: Uint8Array | null = null;
  /** The loop is waiting for the player's key with nothing of the game's own part-way through. */
  private betweenActions = false;

  constructor(
    readonly file: CharacterFile,
    rng: Rng,
  ) {
    const pc = loadPlayer(file.bytes);
    this.known = file.bytes.slice();
    this.game = newGame({
      pc,
      rng,
      columns: UNFORGIVEN_AREA.columns,
      rows: UNFORGIVEN_AREA.rows,
      areaColumns: MAP_VIEW_COLUMNS,
      areaRows: MAP_VIEW_ROWS,
      monsterKinds: sectionMonsterKinds(sectionOf(pc.module, pc.level)),
      solid: (x, y, level, module) => bundledDungeon.solid(x, y, level, module),
      retdwall: (x, y, hv, level, module) => bundledDungeon.side(x, y, hv as 0 | 1, level, module),
      key: () => this.key(),
      choice: (allowed) => this.choice(allowed),
      pressAnyKey: () => {
        this.waitOwed = true;
      },
      delay: (ms) => this.timed.hold(this.game.screen, ms),
    });
    // What the game says goes through print_menu_only, which is the message box; what it draws
    // with pfont is a screen. The two are kept apart here the way they are on the screen.
    const said = this.game.say;
    this.game.say = (...lines: string[]) => {
      if (this.sayingBanner) this.banner = [...this.banner, ...lines];
      else this.showBox(lines);
      said(...lines);
    };
    // movecontrol puts the map cursor in the middle of the view before its first pass.
    pc.mapCursorX = MAP_VIEW_COLUMNS >> 1;
    pc.mapCursorY = MAP_VIEW_ROWS >> 1;
    this.rows = UNFORGIVEN_MAP.floor(pc.level, pc.module);
    loadLevelMap(this.game, this.floors, this.rows, pc.level, this.game.rng);
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

  /**
   * The `while (kbhit()) getch();` strike (exe 2000:7f2b) ends with: whatever the player typed
   * while the swing was on the screen is thrown away rather than answering the next turn.
   */
  flushKeys(): void {
    if (this.queued.length === 0) return;
    this.queued = [];
    this.repeatFight = false;
  }

  /** getch (exe 4000:417b): the next key, once there is one. */
  key(): Promise<number> {
    // getch raises DS:4ec3, which movecontrol reads at 2000:c80a to put the repeat-fight flag
    // down: anything that reads the keyboard stops the character swinging on its own.
    this.repeatFight = false;
    const queued = this.queued.shift();
    if (queued !== undefined) return Promise.resolve(queued);
    this.changed();
    return new Promise((resolve) => {
      this.waiting = resolve;
    });
  }

  /** get_choice (exe 2000:2d93): keys until one of the menu's own, or Escape. */
  async choice(allowed: number[]): Promise<number> {
    for (;;) {
      const key = await this.key();
      if (key === KEY.escape || allowed.includes(key)) return key;
    }
  }

  /**
   * The key movecontrol waits for at the top of a pass (exe 2000:c82d), or {@link RECORD_EDITED}
   * when the save editor writes the record while it waits.
   *
   * Nothing of the game's own is running while the loop waits here, which is what makes it the
   * one place a record written outside the game is safe to take.
   */
  async keyOrEdit(): Promise<number> {
    this.betweenActions = true;
    try {
      return await readKey(this);
    } finally {
      this.betweenActions = false;
    }
  }

  /**
   * The key a ported function asked for with mgetch_message while it was running. Synchronous
   * code cannot wait, so the wait is owed until the loop reaches somewhere it can take it.
   */
  async settle(): Promise<void> {
    while (this.waitOwed) {
      this.waitOwed = false;
      await this.key();
      this.box = [];
    }
  }

  /**
   * engagement_timing (exe 2000:b782): the banner about the monster in front of the character,
   * which the original prints beside the monster rather than in the message box.
   */
  showBanner(): void {
    this.banner = [];
    if (this.game.engagedAhead === -1) return;
    this.sayingBanner = true;
    engagementTiming(this.game);
    this.sayingBanner = false;
  }

  /**
   * FUN_2000_2f5d (exe 2000:2f5d, unf.c "FUN_2000_2f5d"): put a box up. It wipes the menu column
   * before it draws, so whatever a screen had left down that column goes with it, and it copies
   * all eight of its strings into the buffer, so a box replaces the box before it rather than
   * being added to.
   */
  showBox(lines: string[]): void {
    clearMenuBlock(this.game);
    this.box = lines.slice(0, MESSAGE_BOX_LINES);
  }

  /** Arriving on a floor: the floor itself, then its monsters. */
  enterFloor(level: number): void {
    const game = this.game;
    game.engaged = -1;
    game.pc.level = level;
    this.rows = UNFORGIVEN_MAP.floor(level, game.pc.module);
    loadLevelMap(game, this.floors, this.rows, level, game.rng);
    game.recenterMap = true;
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
    waiting(RECORD_EDITED);
  }

  /**
   * Read the record again, if the save editor has written one. The loop calls this at the top of
   * a pass, where no ported function is part-way through.
   *
   * Everything the record holds becomes the character; everything it does not — the monsters
   * standing on the floor, the monster being fought, the timers a moment counts down — is left
   * exactly as it was. A record that puts the character on another floor arrives there the way
   * the loop would, and one that moves them about the floor they are on moves them on the
   * occupancy grid with them.
   */
  takeEdits(): void {
    const bytes = this.edited;
    if (bytes === null) return;
    this.edited = null;
    this.known = bytes.slice();
    this.file.bytes = bytes;
    const game = this.game;
    const pc = game.pc;
    const floor = pc.level;
    const module = pc.module;
    leaveSquare(game);
    Object.assign(pc, loadPlayer(bytes));
    if (pc.level !== floor || pc.module !== module) {
      this.enterFloor(pc.level);
      return;
    }
    setMonsterMap(game, pc.x, pc.y, MAP_PLAYER);
    game.recenterMap = true;
  }

  /** save_player (exe 2000:79ad): the record back into the character it came from. */
  save(): void {
    const bytes = savePlayer(this.game.pc, this.file.bytes);
    this.known = bytes.slice();
    this.file.write(bytes);
  }

  /** The character is dead: the roster is told, and nothing more is written. */
  die(): void {
    this.dead = true;
    this.file.died();
  }

  /** Tell the Play tab to draw. */
  changed(): void {
    this.onChange?.();
  }

  view(): PlayView {
    const game = this.game;
    const pc = game.pc;
    const facing = game.engagedAhead === -1 ? game.engaged : game.engagedAhead;
    const drawn = drawnMonsters(game, pc.level);
    return {
      place: { x: pc.x, y: pc.y, floor: pc.level, module: pc.module, dir: pc.dir },
      rows: this.rows,
      monsters: drawn,
      box: messageBoxLines(this.box),
      screen: this.timed.showing(game.screen),
      banner: this.banner,
      prompt: ladderPrompt(ladderUnder(game), pc.level === 0 ? buildingUnder(game) : 0),
      seconds: game.secondsElapsed,
      engaged: facing === -1 ? null : (drawn.find((monster) => monster.slot === facing) ?? null),
      ahead: game.engagedAhead !== -1,
      over: this.over,
      dead: this.dead,
    };
  }
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
export function startGame(file: CharacterFile, rng: Rng): GameSession {
  const session = new GameSession(file, rng);
  greetTheTown(session);
  return session;
}

/**
 * FUN_3000_9488 (exe 3000:9488, unf.c "FUN_3000_9488"), which load_level_map calls on arriving
 * at floor 0: the snake's greeting, picked by the deepest floor the character has reached.
 */
function greetTheTown(session: GameSession): void {
  if (session.game.pc.level !== 0) return;
  const tablet = townTablet(session.game.pc.deepestFloor);
  if (tablet === null) return;
  session.game.say(...tabletMessage(tablet));
}

/**
 * The keys movecontrol dispatches on, by the byte it reads. A key with no entry here is one the
 * original does nothing with either.
 */
export const KEY_HANDLERS: Record<number, KeyHandler> = {
  [KEY.arrowUp]: { c: 'movecontrol, the -0x48 branch', run: stepForward },
  [KEY.arrowDown]: { c: 'movecontrol, case 0 of the arrow switch', run: turnAround },
  [KEY.arrowLeft]: { c: 'movecontrol, case 5 of the arrow switch', run: turnLeft },
  [KEY.arrowRight]: { c: 'movecontrol, case 3 of the arrow switch', run: turnRight },
  [KEY.homeTurnLeft]: { c: 'movecontrol, the -0x47 branch', run: turnLeft },
  [KEY.pageUpTurnRight]: { c: 'movecontrol, case 7 of the arrow switch', run: turnRight },
  [KEY.enter]: { c: 'movecontrol, the 0x0d branch', run: waitAMoment },
  [KEY.down]: { c: 'movecontrol, the 0x64 branch, and change_module', run: goDown },
  [KEY.up]: { c: 'movecontrol, the 0x75 branch', run: goUp },
  [KEY.trapDoor]: { c: 'trapdoor_dest', run: goThroughTrapDoor },
  [KEY.dig]: { c: 'dig_hole', run: digHole },
  [KEY.quit]: { c: 'quit_game', run: quitGame },
  [KEY.help]: { c: 'FUN_3000_7dfc', run: (turn) => showHelp(turn.session) },
  [KEY.f1]: { c: 'FUN_3000_7dfc', run: (turn) => showHelp(turn.session) },
  [KEY.fight]: { c: 'strike', run: swingAtMonster },
  [KEY.repeatFight]: { c: 'movecontrol, the DS:0437 repeat flag', run: keepSwinging },
  [KEY.cast]: { c: 'cast_a_spell', run: (turn) => castASpell(turn, CAST_SPELLBOOK) },
  [KEY.useItem]: { c: 'movecontrol, case 0x69, and use_magic_item', run: useAnItem },
  [KEY.viewPrepSpells]: { c: 'view_prep_spells', run: showPrepSpells },
  [KEY.viewBattleSpells]: { c: 'view_battle_spells', run: showBattleSpells },
  [KEY.armor]: { c: 'movecontrol, the 0x61 branch', run: changeArmor },
  [KEY.weapon]: { c: 'movecontrol, the 0x77 branch', run: changeWeapon },
  [KEY.expNeeded]: { c: 'FUN_2000_7bcd', run: showExpNeeded },
  [KEY.viewStats]: { c: 'view_stats', run: showStats },
  [KEY.pockets]: { c: 'FUN_3000_7545', run: lookInPockets },
  [KEY.money]: { c: 'show_money', run: countTheMoney },
  [KEY.loseItem]: { c: 'lose_item', run: dropSomething },
  [KEY.monsterManual]: { c: 'monster_manual', run: readTheMonsterManual },
  [KEY.options]: { c: 'movecontrol, the 0x6f branch', run: openOptions },
  [KEY.graphics]: { c: 'movecontrol, the 0x67 branch', run: openGraphics },
  [KEY.expandMap]: { c: 'movecontrol, the 0x78 branch', run: expandTheMap },
  [KEY.zoomView]: { c: 'movecontrol, the 0x7a branch', run: zoomTheView },
};

/**
 * movecontrol's 0x0d branch: leave the square and arrive on it again, which spends a moment
 * without going anywhere.
 */
function waitAMoment(turn: Turn): void {
  leaveSquare(turn.game);
  turn.game.redrawView = true;
  arriveSquare(turn.game);
}

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"): the loop. It comes back when the character
 * quits or dies, which is where the original goes back to the character select screen.
 */
export async function runMoveControl(session: GameSession): Promise<void> {
  const game = session.game;
  const pc = game.pc;
  for (;;) {
    // The save editor can write the record while the game is being played, and the top of a pass
    // is where the game takes it: nothing of the original's runs across it, and everything the
    // pass works out about the character and the square is worked out afterwards.
    session.takeEdits();
    if (pc.sp < 0) pc.sp = 0;
    if (pc.maxSp < 0) pc.maxSp = 0;
    // The original tests the top half of the 32-bit crystal count, so what it zeroes is a count
    // that has gone negative.
    if (pc.crystals < 0) pc.crystals = 0;
    if (pc.fillOnLoad === 1) {
      pc.fillOnLoad = 0;
      pc.hp = pc.maxHp;
      pc.sp = pc.maxSp;
    }
    const deathBeforeTheKey = deathBoxes(session);
    if (deathBeforeTheKey !== null) {
      await died(session, deathBeforeTheKey);
      return;
    }
    game.enemyDir = -1;
    const turn = beginTurn(session);
    if (turn.ladder === 0 && turn.trapdoor === -1 && pc.level > 0) {
      const chute = chuteUnder(game);
      if (chute !== pc.level) {
        await fallDownChute(turn, chute);
        continue;
      }
    }
    attackTiming(game);
    if (game.engaged === -1) pc.sleepTimer = 0;
    session.showBanner();
    if (pc.deepestFloor < pc.level) pc.deepestFloor = pc.level;
    const key = await session.keyOrEdit();
    // The square the pass was worked out from is the one the record has just replaced, so the
    // pass starts again rather than answering a key with what the character used to be.
    if (key === RECORD_EDITED) continue;
    session.box = [];
    // The one line above the box goes with it. A message drawn there that the game does not wipe
    // itself — "NOTHING! (HIT ANY KEY)" is the one that matters — would otherwise stand over the
    // map for the rest of the game, since this port draws the floor from the map rather than
    // repainting the screen the way the original does.
    clearMessageLine(game);
    const handler = KEY_HANDLERS[key];
    if (handler) await handler.run(turn);
    await session.settle();
    if (session.over) return;
    await killTheDead(session);
    // movecontrol at 2000:dbe9 asks whether the character is dead between the kill and the step,
    // and asks again at the top of the loop, which is where a step that killed them is caught.
    const deathAfterTheKill = deathBoxes(session);
    if (deathAfterTheKill !== null) {
      await died(session, deathAfterTheKill);
      return;
    }
    await resolveStep(turn);
    await session.settle();
    // FUN_2000_c28b (exe 2000:c28b): the map has scrolled off the character, so the view is
    // drawn again with them back in the middle of it.
    if (game.recenterMap) {
      pc.mapCursorX = game.areaColumns >> 1;
      pc.mapCursorY = game.areaRows >> 1;
      game.recenterMap = false;
    }
  }
}

/** What movecontrol works out about the square the character is standing on, in its order. */
function beginTurn(session: GameSession): Turn {
  const game = session.game;
  const turn: Turn = {
    session,
    game,
    ladder: ladderUnder(game),
    trapdoor: -1,
    building: 0,
    sides: session.rows[game.pc.y][game.pc.x],
    step: { dx: 0, dy: 0 },
  };
  if (turn.ladder !== 0) return turn;
  if (game.pc.level === 0) turn.building = buildingUnder(game);
  if (turn.building !== 0) return turn;
  turn.trapdoor = trapdoorUnder(game);
  // The box goes up on every pass round the loop, and the door is forgotten without its key.
  if (turn.trapdoor !== -1 && !explainTrapdoor(game, turn.trapdoor)) turn.trapdoor = -1;
  return turn;
}

/**
 * The check movecontrol makes after every hit and every kill, which `checkDeath` (exe 2000:c474)
 * answers: the snake says where the character has gone, and the loop hands back to what called
 * it, which is where the original puts the player back on the character select screen.
 *
 * FUN_2000_9232 prints two of UH.BIN's messages, each of which ends "HIT ANY KEY" and waits for
 * one, so both go up in turn.
 *
 * Nothing is written to the character's file, here or in the original: what is on disk is
 * whatever the last save point left there. The roster marks the character dead and keeps them.
 */
function deathBoxes(session: GameSession): string[][] | null {
  let dead = false;
  const boxes = boxesOf(session, () => {
    dead = checkDeath(session.game);
  });
  return dead ? boxes : null;
}

/** The messages the death printed, in turn, and then the loop hands back. */
async function died(session: GameSession, boxes: string[][]): Promise<void> {
  for (const box of boxes) {
    session.showBox(box);
    await session.key();
  }
  session.die();
  session.over = true;
  session.changed();
}
