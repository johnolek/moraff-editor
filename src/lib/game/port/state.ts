import data from '../dotu-data.json';
import { DUNGEON_XMAX, DUNGEON_YMAX, HEIGHT, WIDTH } from '../unfmap.js';
import type { Rng } from './rng';
import { BorlandRng } from './rng';

/** The occupancy map's code for "nothing here" (0xff). */
export const MAP_EMPTY = 0xff;
/** The occupancy map's code for the square the player stands on (0xfe). */
export const MAP_PLAYER = 0xfe;

/**
 * The fields of the character record the battle spells read or write. Each is one field of the
 * save file, and the name is the one `src/lib/game/dotu-files.js` already gives that offset;
 * fields that file does not parse are named after their label in `src/lib/editor/games.ts`.
 * The original reaches them as globals in the data segment, where `DAT_6000_xxxx` is save
 * offset `xxxx - 0xb880`.
 */
export interface PlayerCharacter {
  /** 0x31, DS:b8b1. */
  hp: number;
  /** 0x33, DS:b8b3. */
  maxHp: number;
  /** 0x3f, DS:b8bf: what the character weighs with nothing carried. */
  weight: number;
  /** 0x41, DS:b8c1: what the character weighs carrying everything they own. */
  loadedWeight: number;
  /** 0x81, DS:b901: how many of each of the eight weapons the character owns. */
  weaponsOwned: number[];
  /** 0x8e, DS:b90e: the plus on each of the eight weapons. */
  weaponPlus: number[];
  /** 0xb0, DS:b930: how many of each of the eight armors the character owns. */
  armorOwned: number[];
  /** 0xb8, DS:b938: the plus on each of the eight armors. */
  armorPlus: number[];
  /** 0x22b, DS:baab: 180 scroll counts, indexed `type * 45 + level * 3 + slot`. */
  scrolls: number[];
  /** 0x2df, DS:bb5f: 180 wand charge counts, indexed the same way. */
  wands: number[];
  /** 0x7ac, DS:c02c: the character's experience level. */
  lev: number;
  /** 0x7b0, DS:c030. */
  x: number;
  /** 0x7b2, DS:c032. */
  y: number;
  /** 0x7b4, DS:c034: the floor the character is on, not the character's own level. */
  level: number;
  /** 0x7b6, DS:c036: 0..4. */
  module: number;
  /** 0x7b8, DS:c038: where the character sits in the scrolling map view, not on the floor. */
  mapCursorX: number;
  /** 0x7b9, DS:c039. */
  mapCursorY: number;
  /** 0x7d4, DS:c054: the level of the Body Armor spell in effect. */
  bodyArmor: number;
  /** 0x7d5, DS:c055: the plus on the Ring of Protection. */
  protRing: number;
  /** 0x7d6, DS:c056: the plus on the Anti-Magic Ring. */
  antiMagicRing: number;
  /** 0x7d7, DS:c057: 1 from the preparation spell, 100 from the permanent one. */
  feather: number;
  /** 0x7e2, DS:c062: moves left on the Strength spell's +7 STR. */
  strengthTimer: number;
  /** 0x7e4, DS:c064: moves left on the Speed spell's +7 AGI. */
  speedTimer: number;
  /** 0x7e6, DS:c066. */
  slowEnemiesTimer: number;
  /** 0x7e8, DS:c068: 1, 2 or 3 for Power Weapon I, II and III. */
  powerWeapon: number;
  /** 0x7e9, DS:c069. */
  powerWeaponTime: number;
  /** 0x7eb, DS:c06b: 1 Minor, 2 Protection, 3 Major, 4 Ultra. */
  protection: number;
  /** 0x7ec, DS:c06c. */
  protectionTime: number;
  /** 0x7ee, DS:c06e. */
  resistPoisonTimer: number;
  /** 0x7f0, DS:c070. */
  resistDiseaseTimer: number;
  /** 0x7f2, DS:c072. */
  antiColdTimer: number;
  /** 0x7f4, DS:c074. */
  antiFireTimer: number;
  /** 0x7f6, DS:c076. */
  resistDrainTimer: number;
  /** 0x7f8, DS:c078: moves the engaged monster stays asleep. */
  sleepTimer: number;
  /** 0x7fa, DS:c07a: moves the engaged monster stays held. */
  holdMonsterTimer: number;
  /** 0x816, DS:c096. */
  str: number;
  /** 0x818, DS:c098. */
  iq: number;
  /** 0x81a, DS:c09a. */
  wis: number;
  /** 0x81e, DS:c09e: agility. The save parser calls this field `dex`. */
  dex: number;
}

/**
 * One of a floor's 145 monster slots: the 6-byte `?MON.MAP` record `[x, y, hp lo, hp hi, type,
 * level]` the game keeps at DS:c4cd.
 */
export interface Monster {
  x: number;
  y: number;
  hp: number;
  /** Which of the 27 rows of `monsterKinds` this monster is. */
  type: number;
  /** The monster's own level, stored as one unsigned byte. */
  level: number;
}

/**
 * The two fields of a monster's 29-byte description (exe DS:4fc9 for the 22 built-in monsters,
 * `MD.BIN` for the section's 22..26) that the battle spells read.
 */
export interface MonsterKind {
  /** Byte 24. 100 marks a Shadow boss, which several spells refuse to touch. */
  special: number;
  /** Byte 25: which row of `monsterStats` this monster fights with. */
  type: number;
}

/**
 * What the three menus of `write_scroll_or_wand` (exe 3000:d384) come back with: a type, a
 * level and a place on that line. The scroll and wand arrays are indexed
 * `type * 45 + level * 3 + slot`.
 */
export interface SpellChoice {
  /** 1 preparation, 2 wizard, 3 priest: the digit the first menu takes. */
  type: number;
  /** 0..9: the level menu's digit less one, so 0 is a level 1 spell and 9 a level 10 one. */
  level: number;
  /** 0..2: the place on that line, the third menu's 1..3 less one. */
  slot: number;
}

/**
 * Something the original does after a spell that this port records instead of doing. See the
 * README's second departure.
 */
export type GameEvent =
  /** load_level_map (exe 2000:7687) reads in another floor's monsters. */
  | { kind: 'levelChanged'; from: number; to: number }
  /** give_hint (exe 2000:313a) prints one of the hints in `UH.BIN`. */
  | { kind: 'hintShown'; hint: number };

/** The two columns of the type table `mstats` (exe DS:5402) that the battle spells read. */
export interface MonsterStats {
  /** Hit points per level; Drain Monster takes half of it for each point of wisdom. */
  hpPerLevel: number;
  /** The `dex` column of the table; Autokill rolls against it. */
  speed: number;
}

/**
 * Everything a ported game function touches.
 *
 * **This is a deliberate departure from the original.** The 1993 code keeps all of this in
 * globals in the data segment and every function reads and writes them directly; the port hands
 * the same state to each function as an argument instead, so a spell can be run and checked
 * without a running game. Nothing else about a ported function is allowed to depart: the reads,
 * the writes, the order they happen in and the values are the ones the exe has.
 */
export interface Game {
  pc: PlayerCharacter;
  /** DS:c4cd: the current floor's 145 monster slots. */
  monsters: Monster[];
  /** The 27 monster descriptions for the current section. */
  monsterKinds: MonsterKind[];
  /** The 16 rows of `mstats`. */
  monsterStats: MonsterStats[];
  /** The weight column of the eight weapons (exe DS:01a6, one every 7 bytes). */
  weaponWeights: number[];
  /** The weight column of the seven armors (exe DS:01f8, one every 5 bytes). */
  armorWeights: number[];
  /**
   * DS:c4d1: one byte per square of the whole 80 x 110 grid, indexed `y * 80 + x`. Holds
   * {@link MAP_EMPTY}, {@link MAP_PLAYER}, or the slot number of the monster standing there.
   */
  monsterMap: Uint8Array;
  /** DS:2517: the slot of the monster the player is fighting, or -1 for none. */
  engaged: number;
  /** DS:2328: how many columns of a floor the game lets the player reach. */
  columns: number;
  /** DS:232a: how many rows of a floor the game lets the player reach. */
  rows: number;
  /** DS:2503: the width of the area being displayed — the whole 80 in the dungeon, less indoors. */
  areaColumns: number;
  /** DS:2504: the height of the area being displayed. */
  areaRows: number;
  /** DS:0327: the map view has to be re-centred on the player. */
  recenterMap: boolean;
  /** DS:c607: the 3D view has to be redrawn. */
  redrawView: boolean;
  /** DS:c4dd: the line printed beside the monster during a fight. */
  monsterStatusLine: string;
  /** Every line the game has printed, oldest first. */
  messages: string[];
  /** Every side effect the port declined to carry out, oldest first. */
  events: GameEvent[];
  rng: Rng;
  /**
   * solidcheck (exe 3000:86b5, unf.c "solidcheck"): whether the square is rock, meaning all
   * four of its sides are walls. `Dungeon.solid` in `src/lib/game/unfmap.js` is the same test.
   */
  solid(x: number, y: number, level: number, module: number): boolean;
  /**
   * get_choice (exe 2000:2d93) reading the direction menu Pass Wall prints: 1 north, 2 south, 3
   * east, 4 west, 5 cancel. The original reads the keyboard; the port asks whoever built the
   * game, and {@link newGame} cancels by default.
   */
  chooseDirection(): number;
  /**
   * mset_gmenu (exe 2000:2b08) reading the eight-line weapon menu enchant_weapon_perm prints:
   * 1 to 8 for a line of the menu, or null for the -1 it hands back on Escape. {@link newGame}
   * escapes by default.
   */
  chooseWeapon(): number | null;
  /** The same menu of the eight armors, for enchant_armor_perm. */
  chooseArmor(): number | null;
  /**
   * The three menus write_scroll_or_wand prints — the kind of spell, its level, and which of the
   * three spells on that line — as one answer, or null for the Escape that leaves the first of
   * them. `maxLevel` is the deepest level the spell being cast will write, which is all the
   * level menu does with it. {@link newGame} escapes by default.
   */
  chooseSpell(maxLevel: number): SpellChoice | null;
  /**
   * print_menu_only (exe 2000:309e): show a screen of up to eight lines and wait for a key.
   * The game fills the slots it does not use with the empty string at DS:258b; those trailing
   * blanks are dropped here, blank lines between two printed ones are kept.
   */
  say(...lines: string[]): void;
}

/**
 * FUN_2000_65b0 (exe 2000:65b0, unf.c "FUN_2000_65b0"): the slot of the monster standing on a
 * square, or -1 when the square is empty. A square holding the player reads back as 0xfe, not
 * as empty.
 */
export function monsterAt(game: Game, x: number, y: number): number {
  const value = game.monsterMap[y * WIDTH + x];
  return value === MAP_EMPTY ? -1 : value;
}

/** set_monster_map (exe 2000:65dc, unf.c "set_monster_map"): write one square of the map. */
export function setMonsterMap(game: Game, x: number, y: number, value: number): void {
  game.monsterMap[y * WIDTH + x] = value;
}

/**
 * The overrides {@link newGame} accepts: any field of a {@link Game} except `say`, which it
 * always supplies itself, and `pc`, which it takes field by field.
 */
export interface GameOverrides extends Partial<Omit<Game, 'pc' | 'say'>> {
  pc?: Partial<PlayerCharacter>;
}

/** A character to run a ported function against. Fresh each call, arrays and all. */
function defaultPc(): PlayerCharacter {
  return {
    hp: 100,
    maxHp: 100,
    weight: 150,
    loadedWeight: 150,
    weaponsOwned: [1, 0, 0, 0, 0, 0, 0, 0],
    weaponPlus: [0, 0, 0, 0, 0, 0, 0, 0],
    armorOwned: [1, 0, 0, 0, 0, 0, 0, 0],
    armorPlus: [0, 0, 0, 0, 0, 0, 0, 0],
    scrolls: Array.from({ length: 180 }, () => 0),
    wands: Array.from({ length: 180 }, () => 0),
    lev: 10,
    x: 40,
    y: 50,
    level: 5,
    module: 0,
    mapCursorX: 40,
    mapCursorY: 55,
    bodyArmor: 0,
    protRing: 0,
    antiMagicRing: 0,
    feather: 0,
    strengthTimer: 0,
    speedTimer: 0,
    slowEnemiesTimer: 0,
    powerWeapon: 0,
    powerWeaponTime: 0,
    protection: 0,
    protectionTime: 0,
    resistPoisonTimer: 0,
    resistDiseaseTimer: 0,
    antiColdTimer: 0,
    antiFireTimer: 0,
    resistDrainTimer: 0,
    sleepTimer: 0,
    holdMonsterTimer: 0,
    str: 20,
    iq: 20,
    wis: 20,
    dex: 20,
  };
}

/** The 145 empty slots a floor starts with. */
function emptySlots(): Monster[] {
  return Array.from({ length: 145 }, () => ({ x: 0, y: 0, hp: 0, type: 0, level: 1 }));
}

/**
 * A game to run a ported function against. The defaults are a level 10 character standing on
 * floor 5 of module I with nothing engaged, an empty floor, and the monster tables of section 1.
 */
export function newGame(overrides: GameOverrides = {}): Game {
  const { pc: pcOverrides, ...rest } = overrides;
  const messages = overrides.messages ?? [];
  return {
    pc: { ...defaultPc(), ...pcOverrides },
    events: [],
    monsters: emptySlots(),
    monsterKinds: [...data.builtinMonsters, ...data.sections[0].monsters],
    monsterStats: data.monsterTypes,
    weaponWeights: data.weapons.slice(0, 8).map((weapon) => weapon.weight),
    armorWeights: data.armor.map((armor) => armor.weight),
    monsterMap: new Uint8Array(WIDTH * HEIGHT).fill(MAP_EMPTY),
    engaged: -1,
    columns: DUNGEON_XMAX,
    rows: DUNGEON_YMAX,
    areaColumns: WIDTH,
    areaRows: HEIGHT,
    recenterMap: false,
    redrawView: false,
    monsterStatusLine: '',
    rng: new BorlandRng(1),
    solid: () => false,
    chooseDirection: () => 5,
    chooseWeapon: () => null,
    chooseArmor: () => null,
    chooseSpell: () => null,
    ...rest,
    messages,
    say(...lines: string[]): void {
      let last = lines.length;
      while (last > 0 && lines[last - 1] === '') last--;
      for (let i = 0; i < last; i++) messages.push(lines[i]);
    },
  };
}
