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
import type { Game, ScreenLine, ScreenRect } from '../game/port/state';
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
import { MapMemory, type MapStore } from './memory';
import { DEFAULT_PLAY_MODE, type PlayMode } from './mode';
import { resolveStep, stepForward, turnAround, turnLeft, turnRight } from './move';
import { quitGame } from './quit';
import { lookInPockets } from './pockets';
import type { RunRecorder, RunSummary } from './run';
import {
  MESSAGE_BOX_LINES,
  MESSAGE_BOX_LINES_TOP,
  MESSAGE_BOX_RECT,
  messageBoxScreen,
  screenTakenOver,
} from './screens';
import { PLAQUE_DELAY_MS } from './plaque';
import type { SectionScreen } from './section-screen';
import type { TownBuilding } from './building';
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
  /** save_maps and load_maps (exe 2000:7313 and 2000:74ae): the explored maps kept beside the
   *  record, the way the game keeps its `.DUN` file beside it. A caller with none — a replay, a
   *  test — plays with a map that lasts as long as the session. */
  maps?: MapStore;
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

/** How far along the HIT ANY KEY plaque's own wait the screen is. */
export type PlaqueState = 'blanked' | 'showing';

/** One key movecontrol dispatches on. */
export interface KeyHandler {
  /** The function of the game the key runs, for anyone reading the table. */
  c: string;
  run(turn: Turn): void | Promise<void>;
}

/** What the Play tab draws. */
/**
 * A monster killed whose skull `movecontrol` (exe 2000:c308) has painted over it, which stands
 * on the screen until the loop comes round and draws the four views again.
 */
export interface KilledOnScreen {
  /** DS:049d: which of the four ways the monster was standing in. */
  dir: number;
  monsterId: string;
}

export interface PlayView {
  place: { x: number; y: number; floor: number; module: number; dir: number };
  rows: MapSquare[][];
  monsters: StockedMonster[];
  /** The monsters standing on a square the four 3-D views drew this turn, which is exactly the
   *  ones the character can see. */
  visible: StockedMonster[];
  /** The message box, as the game draws it: the eight lines and the bar above them. */
  box: ScreenLine[];
  /** A screen the game has taken the whole display over with; empty when there is none. */
  screen: ScreenLine[];
  /** How much of the display that screen was drawn on black, and null where the port does not
   *  know the rectangle and the whole display goes black behind it. */
  screenCleared: ScreenRect | null;
  /** The battle banner: the monster being faced, as engagement_timing prints it. */
  banner: string[];
  /** The box the game puts up on a square with a ladder or a doorway, where it draws it. */
  prompt: ScreenLine[] | null;
  /** Seconds of game time the character has spent. */
  seconds: number;
  /** The monster the character is facing, or null. */
  engaged: StockedMonster | null;
  /** That monster is the one standing straight ahead (DS:c655) rather than one being fought
   *  from another side, which is when the game has its picture on the screen. */
  ahead: boolean;
  /** The monster the skull is standing over, or null when nothing has just been killed. */
  killed: KilledOnScreen | null;
  /** Which drawing of the four views this is, which mirrors the monster ahead. */
  viewsDrawn: number;
  /** The X key's map is filling the screen, which covers the views and everything around them. */
  expandedMap: boolean;
  /** The four lines of the stone tablet the snake's words are read on, or null when none is up. */
  tablet: string[] | null;
  /** The S key's screen, or null when it is not up: the section's five monsters in their panels
   *  and the slab its words are read off (`section-screen.ts`). */
  sectionScreen: SectionScreen | null;
  /** The town building whose picture is on the screen, or null when the character is not in one
   *  (`building.ts`). */
  buildingScreen: TownBuilding | null;
  /** The HIT ANY KEY plaque (`plaque.ts`) while a box's wait is running, or null. */
  plaque: PlaqueState | null;
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
export class GameSession {
  readonly game: Game;
  readonly floors = new FloorMonsters();
  /** The map this character has discovered, which is what the Play tab draws in faithful mode
   *  and what says which monsters can be seen. */
  readonly memory: MapMemory;
  /** The floor the character is on, as the map descriptor generates it. */
  rows: MapSquare[][];
  /** The eight strings the message box is showing, which is the game's own DS:c694. */
  get box(): string[] {
    return this.game.menuBox;
  }

  set box(lines: string[]) {
    this.game.menuBox = lines;
  }

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
   * The X key's map is up (`misc.ts`), which the original draws by filling the whole screen and
   * putting the floor over it, so nothing else on the display shows while it stands.
   */
  expandedMap = false;
  /** The lines of the stone tablet showing, or null. FUN_3000_9026 (exe 3000:9026) draws it and
   *  waits for a key, and the key it is given is what takes it down again. */
  tablet: string[] | null = null;
  /**
   * The S key's screen while it is up (`manual.ts`), which the tab draws the pictures of: the
   * five panels of the section's wall material with its monsters standing in them.
   */
  sectionScreen: SectionScreen | null = null;
  /**
   * The town building the character is inside, whose picture stands on the screen for as long as
   * they are dealing with it (`town.ts`), or null when they are not in one.
   */
  buildingScreen: TownBuilding | null = null;
  /**
   * The HIT ANY KEY plaque while the wait behind a message box is running: `blanked` for the hole
   * FUN_2000_3e73 (exe 2000:3e73) leaves in the screen while its delay counts out, and `showing`
   * once the plaque itself has been drawn on it.
   */
  plaque: PlaqueState | null = null;
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
  /** The monster the skull is standing over, until the loop draws the views again. */
  killed: KilledOnScreen | null = null;
  /**
   * The skull as it stood when the message timer was last asked to hold a screen.
   *
   * The original's skull is pixels on the screen, so it stands there through the delays
   * `kill_monster` counts out as surely as the words beside it do. The tab draws the skull from
   * the game as it is now rather than from the frame, and the loop is past the kill and has
   * cleared it long before those delays are up, so a kill that asks no menu would lose the skull
   * before the tab had drawn it once. This is what the frames are drawn with instead.
   */
  private killedWhileHeld: KilledOnScreen | null = null;
  /**
   * How many times the loop has drawn the four views, which is what the coin flip mirroring the
   * monster ahead is drawn from.
   *
   * The original flips that coin on its own generator, fresh for every view of every drawing
   * (exe 3000:2323). This port cannot: the tab redraws the screen whenever anything about it
   * changes, and spending the game's seeded generator per redraw would make a run unreplayable.
   * Counting the drawings gives a number that changes exactly as often as the original's draw
   * does, and the flip is worked out from it alone, so nothing of the game is spent and a
   * monster still turns to face the other way when the character moves.
   */
  viewsDrawn = 0;
  /** Where the character was standing when the views were last drawn, which is what movecontrol
   *  compares against to decide whether to draw them again. */
  private drawnFrom: { x: number; y: number; level: number } | null = null;
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
    /** The run log this game is being written down in, or null for a game nobody is recording. */
    readonly run: RunRecorder | null = null,
  ) {
    this.memory = new MapMemory(file.maps ?? null);
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
      markKnown: (x, y) => this.memory.markKnown(x, y),
      key: () => this.key(),
      choice: (allowed) => this.choice(allowed),
      pressAnyKey: () => {
        this.waitOwed = true;
      },
      delay: (ms) => {
        this.killedWhileHeld = this.killed;
        this.timed.hold(this.game.screen, ms);
      },
    });
    // What the game says goes through print_menu_only, which is the message box; what it draws
    // with pfont is a screen. The two are kept apart here the way they are on the screen.
    const said = this.game.say;
    this.game.say = (...lines: string[]) => {
      if (this.sayingBanner) this.banner = [...this.banner, ...lines];
      else this.showBox(lines);
      said(...lines);
    };
    // A tablet is a screen of its own rather than a box, and FUN_3000_9026 waits for a key at the
    // end of it (exe 3000:9081, the FUN_2000_412a call), which settle is where the port takes.
    this.game.tablet = (...lines: string[]) => {
      this.tablet = lines;
      said(...lines);
      this.waitOwed = true;
    };
    // movecontrol puts the map cursor in the middle of the view before its first pass. newGame
    // copies the record into a character of its own, so the cursor goes on that one.
    this.game.pc.mapCursorX = MAP_VIEW_COLUMNS >> 1;
    this.game.pc.mapCursorY = MAP_VIEW_ROWS >> 1;
    this.rows = UNFORGIVEN_MAP.floor(pc.level, pc.module);
    loadLevelMap(this.game, this.floors, this.rows, pc.level, this.game.rng);
    this.memory.enterFloor(pc.module, pc.level);
    this.memory.markArrival(this.rows, pc.x, pc.y);
    run?.watch(this.game.events, () => ({
      time: this.game.secondsElapsed,
      floor: this.game.pc.level,
      dungeon: this.game.pc.module,
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
   * The log is what the game read rather than what the player pressed, because the two differ:
   * a key typed while the character was swinging is thrown away by {@link flushKeys} and the game
   * never sees it, so a replay that pressed it would act on a key this run did not.
   * {@link RECORD_EDITED} is not a key at all.
   */
  private took(key: number): void {
    if (key !== RECORD_EDITED) this.run?.input(key);
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
    // A replay takes Ctrl-F's swings from the log rather than making them again, and the flag is
    // what would have the loop take an F of its own here.
    if (this.run?.replaying) this.repeatFight = false;
    const repeating = this.repeatFight;
    this.betweenActions = true;
    try {
      const key = await readKey(this);
      // With the flag up the loop takes F without reading the keyboard, so that swing reaches the
      // run log here rather than through press.
      if (repeating) this.run?.input(key);
      return key;
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
      await this.keyWithPlaque();
      // The key the tablet was waiting on is what takes it off the screen (exe 3000:9086, the
      // fade FUN_4000_5c25 runs the moment the key arrives).
      this.tablet = null;
      this.wipeMessageBlock();
    }
  }

  /**
   * The key FUN_2000_4054 (exe 2000:4054) waits for, with the plaque it waits behind.
   *
   * The rectangle beside the status block is blanked, `delay` (exe 1000:2789) counts 330 ms out
   * with that hole in the screen, and the plaque is drawn on it; the high speed option at DS:00c3
   * skips the delay, so with that on the plaque is there at once. The pause is a display timer of
   * the same kind the message delays are (`timed.ts`) and the game waits on nothing but the key.
   */
  private async keyWithPlaque(): Promise<number> {
    if (this.game.highSpeed) this.plaque = 'showing';
    else {
      this.plaque = 'blanked';
      this.timed.after(PLAQUE_DELAY_MS, () => {
        this.plaque = 'showing';
        this.changed();
      });
    }
    try {
      return await this.key();
    } finally {
      this.timed.cancelAfter();
      this.plaque = null;
      this.changed();
    }
  }

  /**
   * FUN_2000_4054 (exe 2000:4054, unf.c "FUN_2000_4054"), what it does once its key has arrived:
   * the eight lines are wiped with FUN_2000_2820 and the strip above them with FUN_2000_28be.
   *
   * That wait is what every eight-line message box is shown behind, so a box that asks for a key
   * stands only until it is given one.
   */
  wipeMessageBlock(): void {
    clearMenuBlock(this.game);
    clearMessageLine(this.game);
  }

  /**
   * engagement_timing (exe 2000:b782): the banner about the monster in front of the character,
   * which the original prints beside the monster rather than in the message box.
   */
  showBanner(): void {
    const game = this.game;
    this.banner = [];
    if (game.engagedAhead !== -1) {
      this.sayingBanner = true;
      engagementTiming(game);
      this.sayingBanner = false;
      return;
    }
    // movecontrol at 2000:c613: the banner is up and nothing is standing ahead any more, so the
    // block it was printed down is wiped, and whatever else was on it goes at the same time.
    if (!game.battleInfoOn) return;
    game.battleInfoOn = false;
    this.wipeMessageBlock();
  }

  /**
   * FUN_2000_2f5d (exe 2000:2f5d, unf.c "FUN_2000_2f5d"): put a box up. It wipes the menu column
   * before it draws, so whatever a screen had left down that column goes with it, and it copies
   * all eight of its strings into the buffer, so a box replaces the box before it rather than
   * being added to.
   *
   * The tab draws this box over whatever screen the message timer is still holding, so the wipe
   * reaches those screens as well. The strip above the column is left on them, which is what
   * keeps a kill's own line showing while the box its drop printed is already up.
   */
  showBox(lines: string[]): void {
    clearMenuBlock(this.game);
    const box = MESSAGE_BOX_RECT;
    this.timed.wipe(box.x, MESSAGE_BOX_LINES_TOP, box.right, box.bottom);
    this.box = lines.slice(0, MESSAGE_BOX_LINES);
  }

  /** Arriving on a floor: the floor itself, then its monsters. */
  enterFloor(level: number): void {
    const game = this.game;
    game.engaged = -1;
    game.pc.level = level;
    this.rows = UNFORGIVEN_MAP.floor(level, game.pc.module);
    loadLevelMap(game, this.floors, this.rows, level, game.rng);
    this.memory.enterFloor(game.pc.module, level);
    this.memory.markArrival(this.rows, game.pc.x, game.pc.y);
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
    this.run?.edited();
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
    this.run?.died();
    this.file.died();
  }

  /**
   * FUN_2000_ac9e (exe 2000:ac9e, unf.c "FUN_2000_ac9e"): the four 3-D views, as movecontrol
   * draws them.
   *
   * The loop draws them where it waits for a key, and only when the redraw flag (DS:c607) is up
   * or the character is not where they were when the views were last drawn; FUN_2000_ac9e puts
   * the flag down again as it draws. Anything else — a swing, a spell, a screen the key opened —
   * leaves the views exactly as they are, which is why the monster being fought does not turn
   * round between one blow and the next.
   *
   * The port draws the screen from the game rather than leaving the last drawing on it, so what
   * this counts is the drawings the original would have made: {@link viewsDrawn} is the whole of
   * it, and the coin flip that mirrors the monster ahead is worked out from that number.
   */
  drawViews(): void {
    const pc = this.game.pc;
    const from = this.drawnFrom;
    const moved = from === null || from.x !== pc.x || from.y !== pc.y || from.level !== pc.level;
    if (!moved && !this.game.redrawView) return;
    this.game.redrawView = false;
    this.drawnFrom = { x: pc.x, y: pc.y, level: pc.level };
    this.viewsDrawn += 1;
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

  view(): PlayView {
    const game = this.game;
    const pc = game.pc;
    const facing = game.engagedAhead === -1 ? game.engaged : game.engagedAhead;
    const drawn = drawnMonsters(game, pc.level);
    const printed = this.timed.showing(game.screen);
    return {
      place: { x: pc.x, y: pc.y, floor: pc.level, module: pc.module, dir: pc.dir },
      rows: this.rows,
      monsters: drawn,
      visible: drawn.filter((monster) => this.memory.isVisible(monster.x, monster.y)),
      box: messageBoxScreen({ box: this.box, banner: this.banner, drawn: printed }),
      // The expanded map has covered the display, so every line the game has drawn belongs to
      // that screen — including the two the X branch puts in the corner the message box stands
      // in, which erase_menu_block emptied on the way in.
      screen: this.expandedMap ? printed : screenTakenOver(printed),
      screenCleared: game.blackedOut,
      banner: this.banner,
      prompt: ladderPrompt(ladderUnder(game), pc.level === 0 ? buildingUnder(game) : 0),
      seconds: game.secondsElapsed,
      engaged: facing === -1 ? null : (drawn.find((monster) => monster.slot === facing) ?? null),
      ahead: game.engagedAhead !== -1,
      killed: this.timed.holding ? this.killedWhileHeld : this.killed,
      viewsDrawn: this.viewsDrawn,
      expandedMap: this.expandedMap,
      tablet: this.tablet,
      sectionScreen: this.sectionScreen,
      buildingScreen: this.buildingScreen,
      plaque: this.plaque,
      over: this.over,
      dead: this.dead,
      run: this.run?.summary() ?? null,
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
export function startGame(file: CharacterFile, rng: Rng, run: RunRecorder | null = null): GameSession {
  const session = new GameSession(file, rng, run);
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
  session.game.tablet(...tabletMessage(tablet));
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
  // load_level_map greets a character arriving in the town with the snake's stone tablet, and
  // FUN_3000_9026 waits for a key of its own at the end of it, all before movecontrol has run a
  // pass. That tablet is the only thing that can be owed a key this early.
  if (session.tablet) await session.settle();
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
    // The views are drawn again below, which is what takes the skull off the last monster killed.
    session.killed = null;
    // movecontrol (unf.c:15405) marks the square under the character's feet before it works
    // anything else out about it.
    session.memory.markStep(pc.x, pc.y);
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
    // Every square the four 3-D views draw is marked. The original marks them only on a pass it
    // draws the views on, which marks the same squares either way — the geometry has not
    // changed — and only leaves the monsters on the screen a moment stale. This marks them every
    // pass, so the monsters that can be seen are the ones standing there now.
    session.memory.markViews(session.rows, pc.x, pc.y);
    session.drawViews();
    const key = await session.keyOrEdit();
    // The square the pass was worked out from is the one the record has just replaced, so the
    // pass starts again rather than answering a key with what the character used to be.
    if (key === RECORD_EDITED) continue;
    // movecontrol wipes nothing where it takes its key, so the last thing said stands in the box
    // until a box, a menu or one of the wipes above paints over it.
    const handler = KEY_HANDLERS[key];
    session.run?.dispatched(key);
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
