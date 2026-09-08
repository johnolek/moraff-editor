import { LEVELS } from '../../game/revmap.js';
import type { Rng } from '../../game/port/rng';
import { REV_POLLS_PER_TICK, REV_TICK_MS, revPoll } from './clock';
import { revFallDownAChute } from './chute';
import type { RevMagicDesk } from './desk';
import { revAtTheFountain, revDrinkFromTheFountain, revNeedsAFountain, revRollTheFountain } from './fountain';
import {
  revBreatheFire,
  revMagicItemsOwned,
  revTakeAPill,
  revUseAWandInAFight,
  revUseAWandInTheDungeon,
  revUseAnItem,
  revUseAnItemInAFight,
} from './items';
import { revFloorStats } from './magic';
import {
  revCastInAFight,
  revCastInTheDungeon,
  revCountDownBattleSpells,
  revEndPreppedSpells,
} from './spells';
import { revTreasureFromAKill } from './treasure';
import { revDie } from './death';
import {
  revLeaveTheFight,
  revMeetMonster,
  revMonsterAnswers,
  revOwnsWeapon,
  revSwing,
  revSwingWords,
  revWeaponFor,
  NO_SUCH_WEAPON,
} from './fight';
import { revMonsterAttack } from './attack';
import { revShowHelp } from './help';
import { revPause } from './pause';
import { revSetEnterDelay, revStepBackground, revStepPalette, revToggleSound } from './settings';
import { revKillMonster } from './kill';
import { REV_KEY, revArrowMode, revCompassArrow, revTurningArrow, revWrapFacing } from './keys';
import { revFeatureUnder, revLookDown } from './ladders';
import { RevMapMemory, type RevMapStore } from './memory';
import { DEFAULT_PLAY_MODE, type PlayMode } from '../mode';
import { revStep, type RevStep } from './move';
import { revPass } from './pass';
import { REV_UNBANKED_EXPERIENCE_VALUE, loadRevPlayer, revPlayerFromValues, revValue, saveRevPlayer } from './record';
import type { RunRecorder, RunSummary } from '../run';
import { revAdvice } from './advice';
import {
  revBuildingUnder,
  revStayAtInn,
  revVisitBank,
  revVisitGuild,
  revVisitStore,
  revVisitTemple,
  type RevTownDesk,
} from './town';
import { newRevGame, revWalker, type RevGame } from './state';
import type { RevStanding } from './monsters';
import { REV_NOT_BUILT } from './screens';

/**
 * The loop Moraff's Revenge is played in — the `INKEY$` poll at DUNSMALL.EXE 1000:087F and the
 * key dispatch at 1000:0CD2 behind it — and the session it is played out of.
 *
 * The original never blocks: it spins on `INKEY$` and rolls the monsters' clock on every pass.
 * Here the poll is a display timer (`clock.ts`) the session runs only while the loop is waiting
 * for a key, and each of its ticks is an input of its own in the run log, so a run replays
 * without any clock at all.
 */

/** How many keys are kept for a loop that is not waiting for one yet. */
const KEY_QUEUE = 4;

/** Not a key: the loop's wait hands this back when the save editor has written the record. */
export const REV_RECORD_EDITED = -0x201;

/** Not a key: one tick of the monsters' clock, which the log keeps where it happened. */
export const REV_CLOCK_TICK = -0x202;

/** Where the character record lives while it is being played. */
export interface RevCharacterFile {
  bytes: Uint8Array;
  /** 1000:B308: keep these bytes as the character from now on. */
  write(bytes: Uint8Array<ArrayBuffer>): void;
  /** The character has died, which the roster marks and never undoes. */
  died(): void;
  /** 1000:B583 and 1000:B964: the explored map kept beside the record, the way the game keeps
   *  `<n>.BIN` beside `<n>.EXE`. */
  map?: RevMapStore;
}

/** What the Play tab draws. */
export interface RevPlayView {
  place: { column: number; row: number; level: number; facing: number };
  /** Every monster standing on the level, for the map. */
  monsters: RevStanding[];
  /** The ones the character can see, which in this game is the one on their own square alone. */
  visible: RevStanding[];
  /** The lines the loop has printed. */
  box: string[];
  /** The line of advice the loop prints on its own row at the top of every pass. */
  advice: string[];
  /** The line the ladder, the chute and the rope put under the map. */
  prompt: string | null;
  /** What the fight is saying, which the original draws over the top of the screen. */
  banner: string[];
  /** The monster being fought, with what is left of it. */
  fight: { slot: number; name: number; monsterLevel: number; hitPoints: number } | null;
  /** Which way the arrows move, which Escape switches. */
  arrows: 'compass' | 'turning';
  over: boolean;
  dead: boolean;
  run: RunSummary | null;
}

/** One character being played. */
export class RevGameSession {
  readonly game: RevGame;
  over = false;
  dead = false;
  mode: PlayMode = DEFAULT_PLAY_MODE;
  onChange: (() => void) | null = null;

  private queued: number[] = [];
  private waiting: ((key: number) => void) | null = null;
  /** The record as the game last read it or wrote it back. */
  private known: Uint8Array;
  private edited: Uint8Array | null = null;
  /** The loop is at the poll with nothing of the game's own part-way through, which is where a
   *  tick of the monsters' clock belongs and where an edited record is safe to take. */
  private polling = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    readonly file: RevCharacterFile,
    rng: Rng,
    readonly run: RunRecorder | null = null,
  ) {
    const pc = loadRevPlayer(file.bytes) ?? revPlayerFromValues(new Array<number>(340).fill(0));
    this.known = file.bytes.slice();
    this.game = newRevGame(pc, rng, new RevMapMemory(file.map ?? null));
    this.game.flushKeys = () => this.flushKeys();
    // 1000:B98F: a character who has never been played has no fountain of youth yet, and the
    // load rolls one for them.
    if (revNeedsAFountain(pc)) revRollTheFountain(this.game);
    this.game.monsters.stock(pc.dungeonLevel, rng);
    run?.watch(this.game.events, () => ({
      time: this.ticks,
      floor: this.game.pc.dungeonLevel,
      dungeon: 0,
    }));
  }

  /** How many ticks of the monsters' clock the run has spent, which is this game's own clock. */
  ticks = 0;

  /** A key from the Play tab. */
  press(key: number): void {
    const waiting = this.waiting;
    if (waiting) {
      this.waiting = null;
      waiting(key);
      return;
    }
    if (this.queued.length < KEY_QUEUE) this.queued.push(key);
  }

  /**
   * 1000:2FCB: the keys typed and not read yet are thrown away.
   *
   * The original reads `INKEY$` eighteen times over, which empties the BIOS buffer of whatever
   * was typed while it was busy. Here that is the queue a key waits in when the loop is not at
   * its poll.
   */
  flushKeys(): void {
    this.queued = [];
  }

  /** 1000:2F71: the next key, once there is one. */
  key(): Promise<number> {
    const queued = this.queued.shift();
    if (queued !== undefined) {
      this.run?.input(queued);
      return Promise.resolve(queued);
    }
    this.changed();
    return new Promise((resolve) => {
      this.waiting = (key) => {
        // Neither of the two things that are not keys belongs in the log here: an edited record
        // is not an input at all, and a tick has already written itself down.
        if (key !== REV_RECORD_EDITED && key !== REV_CLOCK_TICK) this.run?.input(key);
        resolve(key);
      };
    });
  }

  /**
   * 1000:087F: the poll. It waits for a key the way {@link key} does, and while it waits the
   * monsters' clock runs.
   */
  async poll(): Promise<number> {
    this.polling = true;
    this.startClock();
    try {
      return await this.key();
    } finally {
      this.polling = false;
      this.stopClock();
    }
  }

  /**
   * One tick of the monsters' clock: the passes of the `INKEY$` poll that much wall-clock time
   * is worth, each rolling 1000:7EEC through the run's generator.
   *
   * The fight's own prompt polls as well (1000:86E2 before 1000:86E5), so the rest of the level
   * keeps shuffling around while it is up; what does not happen there is a swing, since the
   * monster's attack is only ever reached from the far side of a key.
   *
   * It is written into the log as an input of its own, which is what lets a replay reproduce it
   * without a timer.
   */
  tick(): void {
    // 1000:0891: the town skips the clock outright, which is why nothing walks there.
    if (this.game.over || this.game.pc.dungeonLevel === 0) return;
    this.run?.input(REV_CLOCK_TICK);
    this.ticks += 1;
    // `TIMER`, which the three potions that wear off are timed against.
    this.game.seconds = (this.ticks * REV_TICK_MS) / 1000;
    const walker = revWalker(this.game);
    for (let pass = 0; pass < REV_POLLS_PER_TICK; pass++) revPoll(this.game.monsters, walker, this.game.lastMonsterLevel, this.game.rng);
    // 1000:08F6: a monster that has reached the character's square opens a fight at once.
    if (this.game.fight === null && this.monsterHere() > 0) {
      const waiting = this.waiting;
      this.waiting = null;
      waiting?.(REV_CLOCK_TICK);
    }
    this.changed();
  }

  /** The slot standing on the character's own square (1000:08F6). */
  monsterHere(): number {
    const pc = this.game.pc;
    return this.game.monsters.slotOn(pc.column, pc.row);
  }

  private startClock(): void {
    if (this.timer !== null || typeof setInterval !== 'function') return;
    if (this.game.pc.dungeonLevel === 0) return;
    this.timer = setInterval(() => this.tick(), REV_TICK_MS);
  }

  private stopClock(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
  }

  /** 1000:B308 with the BSAVE it falls into: the record and the map, written back together. */
  save(): void {
    const bytes = saveRevPlayer(this.game.pc);
    this.known = bytes.slice();
    this.file.write(bytes);
    this.game.memory.save();
  }

  /** 1000:A249: the character's two files are deleted. The roster marks the entry instead and
   *  keeps the bytes, the way the other two games' ports do; the map really is thrown away. */
  die(): void {
    this.dead = true;
    this.over = true;
    this.game.over = true;
    this.run?.died();
    this.game.memory.forgetEverything();
    this.file.died();
  }

  /** 1000:4C28: the level changes, which re-stocks the monster grid. */
  enterLevel(level: number): void {
    const pc = this.game.pc;
    const from = pc.dungeonLevel;
    pc.dungeonLevel = Math.min(Math.max(level, 0), LEVELS);
    this.game.monsters.stock(pc.dungeonLevel, this.game.rng);
    // 1000:3F42: the spells that last until the town are taken off when the character reaches
    // it, and 1000:3F4E is one of the five moments the character is saved.
    if (pc.dungeonLevel === 0 && from !== 0) {
      revEndPreppedSpells(this.game);
      this.save();
    }
  }

  /** The save editor has written the record while the game is being played. */
  recordEdited(bytes: Uint8Array): void {
    if (sameBytes(bytes, this.known)) return;
    this.edited = bytes;
    if (!this.polling) return;
    const waiting = this.waiting;
    if (!waiting) return;
    this.waiting = null;
    waiting(REV_RECORD_EDITED);
  }

  /** Read the record again, if the save editor has written one. */
  takeEdits(): void {
    const bytes = this.edited;
    if (bytes === null) return;
    this.edited = null;
    this.known = bytes.slice();
    this.file.bytes = bytes;
    const read = loadRevPlayer(bytes);
    if (!read) return;
    const level = this.game.pc.dungeonLevel;
    Object.assign(this.game.pc, read, { facing: this.game.pc.facing });
    if (this.game.pc.dungeonLevel !== level) this.enterLevel(this.game.pc.dungeonLevel);
  }

  changed(): void {
    this.onChange?.();
  }

  /** Nothing is going to draw this session again. */
  finish(): void {
    this.stopClock();
  }

  /**
   * 1000:7DC9 and 1000:2F71: how a spell, an item, a pill or a wand asks its questions.
   *
   * The poll runs the monsters' clock the way the original's does, and a tick is not a key: the
   * original's `INKEY$` gives it an empty string and it asks again. What it does hand back
   * instead of a key is a space, once a monster is standing on the character's square
   * (1000:7E4A), and that is the null here.
   */
  magic(): RevMagicDesk {
    return {
      poll: async () => {
        for (;;) {
          if (this.monsterHere() > 0 && this.game.fight === null) return null;
          const key = await this.poll();
          if (key !== REV_CLOCK_TICK && key !== REV_RECORD_EDITED) return key;
        }
      },
      wait: async () => {
        const key = await this.key();
        revFloorStats(this.game.pc);
        return key;
      },
      enterLevel: (level) => this.enterLevel(level),
      stats: () => showStats({ session: this, game: this.game, building: 0 }),
      save: () => this.save(),
    };
  }

  /** The town desk, which is how a building asks its questions. */
  desk(): RevTownDesk {
    return {
      key: () => this.key(),
      number: async (prompt) => {
        this.game.say(...prompt);
        return revReadNumber(await this.key());
      },
    };
  }

  view(): RevPlayView {
    const game = this.game;
    const pc = game.pc;
    const monsters = game.monsters.standing();
    const here = this.monsterHere();
    return {
      place: { column: pc.column, row: pc.row, level: pc.dungeonLevel, facing: pc.facing },
      monsters,
      visible: monsters.filter((monster) => monster.slot === here),
      box: game.said,
      advice: game.advice,
      prompt: game.prompt,
      banner: game.banner,
      fight: game.fight
        ? {
            slot: game.fight.slot,
            name: game.fight.name,
            monsterLevel: game.fight.monsterLevel,
            hitPoints: game.fight.hitPoints,
          }
        : null,
      arrows: revArrowMode(game.arrowMode),
      over: this.over,
      dead: this.dead,
      run: this.run?.summary() ?? null,
    };
  }
}

/**
 * 1000:21F3: a number typed at a prompt.
 *
 * The original reads a whole line; the tab has no line editor of its own, so one digit key is
 * one number and anything else is nothing typed. What the buildings do with the answer is the
 * original's.
 */
export function revReadNumber(key: number): number | null {
  const digit = key - '0'.charCodeAt(0);
  return digit >= 0 && digit <= 9 ? digit : null;
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  for (let at = 0; at < left.length; at++) if (left[at] !== right[at]) return false;
  return true;
}

/** Start playing a character. */
export function startRevGame(file: RevCharacterFile, rng: Rng, run: RunRecorder | null = null): RevGameSession {
  return new RevGameSession(file, rng, run);
}

/** What the loop knows about the square before it reads a key. */
export interface RevTurn {
  session: RevGameSession;
  game: RevGame;
  /** The building under the character on level 0, and 0 everywhere else. */
  building: number;
}

/** One key the dungeon dispatches on. */
export interface RevKeyHandler {
  /** The function of the game the key runs, for anyone reading the table. */
  c: string;
  run(turn: RevTurn): void | Promise<void>;
}

/** The keys 1000:0CD2 dispatches on, by the byte it compares. */
export const REV_KEY_HANDLERS: Record<number, RevKeyHandler> = {
  [REV_KEY.down]: { c: '1000:0DE0, the ladder down and the false floor', run: goDown },
  [REV_KEY.up]: { c: '1000:0DAF, the ladder up and the rope into a building', run: goUp },
  [REV_KEY.stats]: { c: '1000:19F7, view_stats', run: showStats },
  [REV_KEY.quit]: { c: '1000:0D7D, the save and the chain back to BEGIN', run: quitAndSave },
  [REV_KEY.escape]: { c: '1000:10BE, the movement-mode switch', run: switchArrows },
  [REV_KEY.cast]: { c: '1000:35AC, cast a spell', run: (turn) => revCastInTheDungeon(turn.game, turn.session.magic()) },
  [REV_KEY.magic]: { c: '1000:3B16, the magic items owned', run: (turn) => turn.game.say(...revMagicItemsOwned(turn.game)) },
  [REV_KEY.item]: { c: '1000:1340, use an item', run: (turn) => revUseAnItem(turn.game, turn.session.magic()) },
  [REV_KEY.abandon]: { c: '1000:1918, drop all the coins', run: (turn) => notBuiltYet(turn, 'drop all of your coins') },
  [REV_KEY.help]: { c: '1000:C332, the help pages', run: (turn) => revShowHelp(turn.game, turn.session.desk()) },
  [REV_KEY.f1]: { c: '1000:C332, the help pages', run: (turn) => revShowHelp(turn.game, turn.session.desk()) },
  [REV_KEY.pause]: { c: '1000:7FFB, the pause screen', run: (turn) => revPause(turn.game, turn.session.desk(), () => quitAndSave(turn)) },
  [REV_KEY.enterDelay]: { c: '1000:0F00, the enter delay', run: (turn) => revSetEnterDelay(turn.game, turn.session.desk()) },
  [REV_KEY.pill]: { c: '1000:7C49, take a pill', run: (turn) => revTakeAPill(turn.game, turn.session.magic()) },
  [REV_KEY.wand]: { c: '1000:7AA1, use a wand', run: (turn) => revUseAWandInTheDungeon(turn.game, turn.session.magic()) },
  [REV_KEY.background]: { c: '1000:0FF5, the background colour', run: (turn) => revStepBackground(turn.game) },
  [REV_KEY.palette]: { c: '1000:102A, the palette', run: (turn) => revStepPalette(turn.game) },
  [REV_KEY.sound]: { c: '1000:1055, the sound', run: (turn) => revToggleSound(turn.game) },
};

/** 1000:10BE: Escape counts the movement mode 0, 1, 0. */
function switchArrows(turn: RevTurn): void {
  turn.game.arrowMode = (turn.game.arrowMode + 1) % 2;
}

/** A key whose function this port has not built, saying what the game would have done. */
function notBuiltYet(turn: RevTurn, what: string): void {
  turn.game.say(...REV_NOT_BUILT(what));
}

/** 1000:0DE0: D takes a ladder down, and the false floor a chute left behind. */
function goDown(turn: RevTurn): void {
  const game = turn.game;
  // 1000:0CE0: the fountain of youth is asked about before the ladder is, so D drinks where a
  // character is standing on it.
  if (revAtTheFountain(game)) {
    revDrinkFromTheFountain(game, turn.session.magic());
    return;
  }
  if (game.feature < 1 || game.feature > 3) return;
  turn.session.enterLevel(game.pc.dungeonLevel + game.feature);
}

/** 1000:0DAF: U takes a ladder up, or climbs the rope into a town building. */
async function goUp(turn: RevTurn): Promise<void> {
  const game = turn.game;
  if (turn.building > 0 && game.pc.dungeonLevel === 0) {
    await enterBuilding(turn, turn.building);
    return;
  }
  if (game.feature >= 0) return;
  turn.session.enterLevel(game.pc.dungeonLevel + game.feature);
}

/** 1000:132A: `ON building GOTO`, the seven routines the ten squares lead to. */
async function enterBuilding(turn: RevTurn, building: number): Promise<void> {
  const desk = turn.session.desk();
  if (building >= 1 && building <= 3) await revStayAtInn(turn.game, building - 1, desk);
  else if (building === 4) await revVisitBank(turn.game, desk);
  else if (building === 5) await revVisitTemple(turn.game, desk);
  else if (building === 6) await revVisitStore(turn.game, desk);
  else if (building === 7) await revVisitGuild(turn.game, desk, turn.session.magic());
}

/** 1000:19F7: the statistics screen. */
function showStats(turn: RevTurn): void {
  const pc = turn.game.pc;
  turn.game.say(
    `Player level: ${Math.trunc(pc.level)}`,
    `Experience: ${Math.trunc(pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE))}`,
    `Health points: ${Math.trunc(pc.hp)} of ${Math.trunc(pc.maxHp)}`,
    `Spell points: ${Math.trunc(pc.spellPoints)}`,
    `Player weight: ${Math.trunc(pc.weight)}`,
    `Pocket money: ${Math.trunc(pc.money)}`,
    `Money in bank: ${Math.trunc(pc.bank)}`,
    pc.cls === 1 ? ' FIGHTER' : ' WIZARD',
  );
}

/** 1000:0D7D: Q saves everything and goes back to BEGIN. */
function quitAndSave(turn: RevTurn): void {
  turn.session.save();
  turn.session.over = true;
  turn.game.over = true;
}

/** The keys the fight prompt takes and the dungeon does not (1000:87CA onwards). */
async function fightKey(session: RevGameSession, key: number): Promise<void> {
  const game = session.game;
  const desk = session.magic();
  const weapon = revWeaponFor(key);
  if (weapon === null) {
    // 1000:8985: the breath is a swing that cannot miss, and it is only looked for while the
    // potion of fire is still burning.
    if (key === REV_KEY.breathe) {
      const breath = revBreatheFire(game);
      if (breath === null) return;
      game.banner = revSwingWords(game, breath);
      monsterAnswers(session);
      return;
    }
    // 1000:884A: the fight prompt's P is the same pause screen as the dungeon's, not a prayer.
    if (key === REV_KEY.pause) {
      await revPause(game, session.desk(), () => {
        session.save();
        session.over = true;
        game.over = true;
      });
    } else if (key === REV_KEY.cast) {
      await revCastInAFight(game, desk);
      monsterAnswers(session);
    } else if (key === REV_KEY.item) {
      await revUseAnItemInAFight(game, desk);
      monsterAnswers(session);
    } else if (key === REV_KEY.pill) await revTakeAPill(game, desk);
    else if (key === REV_KEY.wand) await revUseAWandInAFight(game, desk);
    return;
  }
  if (!revOwnsWeapon(game.pc, weapon)) {
    game.say(...NO_SUCH_WEAPON);
    return;
  }
  const swing = revSwing(game, weapon);
  game.banner = revSwingWords(game, swing);
  monsterAnswers(session);
}

/** 1000:9A2F and 1000:8E44: the monster's own turn, which is only ever reached from the far side
 *  of a key of the character's. */
function monsterAnswers(session: RevGameSession): void {
  const game = session.game;
  const fight = game.fight;
  if (fight && fight.hitPoints < 1) {
    revKillMonster(game);
    return;
  }
  // 1000:8E44 and 1000:878E: the monster's own swing, which is only ever reached from here.
  if (revMonsterAnswers(game)) revMonsterAttack(game, () => session.save());
}

/**
 * The loop. It comes back when the character quits or dies, which is where the original chains
 * back to BEGIN or to the hall of fame.
 */
export async function runRevDungeon(session: RevGameSession): Promise<void> {
  const game = session.game;
  const pc = game.pc;
  for (;;) {
    session.takeEdits();
    if (session.over) return;
    if (pc.hp < 0) {
      if (!revDie(game)) {
        session.die();
        return;
      }
      session.enterLevel(0);
    }
    // 1000:05F2: the facing is brought back into 1 to 4 at the top of every pass.
    pc.facing = revWrapFacing(pc.facing);
    game.memory.markStep(pc.column, pc.row, pc.dungeonLevel);
    game.feature = revFeatureUnder(pc.column, pc.row, pc.dungeonLevel);
    // 1000:552B sends a chute straight to the fall rather than putting a prompt up. The fall
    // refuses the square it last landed on, which is where the false floor prompt comes from.
    if (game.feature === 0 && revFallDownAChute(game, () => session.save())) {
      session.enterLevel(pc.dungeonLevel);
      continue;
    }
    revLookDown(game);
    // 1000:0A4F: the top of every pass wraps the step counter and takes off the two spells a
    // fight casts on the character when it has come round to them.
    revCountDownBattleSpells(game);
    game.advice = revAdvice(game);
    const turn: RevTurn = { session, game, building: revBuildingUnder(pc.column, pc.row, pc.dungeonLevel) };
    // 1000:08F6 and 1000:0946: a monster on the character's own square opens a fight.
    if (game.fight === null && session.monsterHere() > 0) revMeetMonster(game, session.monsterHere());
    const key = await session.poll();
    if (key === REV_RECORD_EDITED || key === REV_CLOCK_TICK) continue;
    // The words the last key printed come down when the next one arrives, which is what the
    // redraw at 1000:3029 does to them.
    game.said = [];
    game.banner = [];
    session.run?.dispatched(key);
    let step: RevStep | null = null;
    if (game.fight !== null) {
      // 1000:8701 and 1000:871F: the fight prompt hands Escape and the four arrows to the same
      // two routines the dungeon does, so a character can turn and walk away from a monster.
      if (key === REV_KEY.escape) switchArrows(turn);
      else if (revCompassArrow(key) !== 0 || revTurningArrow(key) !== null) step = await stepOrTurn(session, key);
      else await fightKey(session, key);
    } else {
      const handler = REV_KEY_HANDLERS[key];
      if (handler) await handler.run(turn);
      else step = await stepOrTurn(session, key);
    }
    // 1000:A4E7: whatever killed the monster, what it dropped is offered before the next key.
    if (game.killed) {
      game.killed = false;
      await revTreasureFromAKill(game, session.magic());
    }
    // 1000:3FFC, which every key comes back through. The one that does not is a step a monster
    // stood in the way of: 1000:33EA prints MONSTER BLOCKS WAY and returns.
    if (step !== 'monster') revPass(game);
    // The fight is over the moment the character is no longer standing on the monster.
    if (game.fight !== null && session.monsterHere() !== game.fight.slot) revLeaveTheFight(game);
    if (session.over) return;
  }
}

/**
 * 1000:0AC2: what the arrows do, which depends on the movement mode Escape switches.
 *
 * What it hands back is what the step came to, since the per-key routine is reached from a
 * different place for each of them, and a step a monster blocked never reaches it at all.
 */
async function stepOrTurn(session: RevGameSession, key: number): Promise<RevStep | null> {
  const game = session.game;
  const pc = game.pc;
  if (game.arrowMode === 0) {
    const facing = revCompassArrow(key);
    if (facing === 0) return null;
    pc.facing = facing;
    return revStep(game, facing);
  }
  const arrow = revTurningArrow(key);
  if (arrow === null) return null;
  if (arrow.step) return revStep(game, pc.facing);
  pc.facing += arrow.turn;
  return null;
}
