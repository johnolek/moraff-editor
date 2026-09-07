import type { Rng } from '../port/rng';

/**
 * A string CHCHAR.EXE has printed, with the row and column LOCATE put it on.
 *
 * The program runs in text mode — `SCREEN 0` at its offset 0049 and `WIDTH 80` at 004E, then
 * `WIDTH 40` at 091E once the instructions are done — so a screen is a grid of characters rather
 * than the pixel-positioned lines the other two games' rollers draw.
 */
export interface RevScreenLine {
  /** The row, 1 to 25. */
  row: number;
  /** The column the first character sits in, 1 upwards. */
  column: number;
  text: string;
  /** The foreground COLOR was last set to. Bit 4 is the blink bit, which the game does set. */
  colour: number;
  /** The background, 0 everywhere except the race the menu is sitting on. */
  background: number;
}

/**
 * A character as CHCHAR.EXE has it when it writes the file.
 *
 * Every field is the number the player sees; the shifts the file stores the numbers under are
 * applied by {@link newRevCharacterFile}, the way CHCHAR applies them at its offsets 127E onwards.
 */
export interface RevCharacter {
  /** The name, which does not go in the character file at all — it goes in F5.COM. */
  name: string;
  /** 1 Human, 2 Dwarf, 3 Elf, 4 Hobbit; record value 161. */
  race: number;
  /** 1 fighter, 2 wizard; record value 10. */
  cls: number;
  /** Strength, intelligence, wisdom, health, agility, laziness; record values 1 to 6. */
  stats: number[];
  /**
   * Record value 7, `strength - 11`, halved and truncated when that comes out below one
   * (CHCHAR 0D0F). The game rewrites it during play, so what it means is not settled.
   */
  fromStrength: number;
  /** Record value 8, `INT(health * 3 - 39)`, divided by three when below one (CHCHAR 0CCE). */
  fromHealth: number;
  /** Record value 9, `agility - 12`, zero when below one (CHCHAR 0D48). */
  fromAgility: number;
  /** Record value 14; the current health points, value 15, start equal to it. */
  maxHp: number;
  /** Record value 22. */
  spellPoints: number;
  /** Record value 19: the jewel pieces in the purse. */
  money: number;
  /** Record value 17. Everybody starts at 150. */
  weight: number;
  /** Record values 150 and 151, each `INT(RND(1) * 15) + 2` (CHCHAR 0DBA and 0DDD). What the
   *  game reads them back for is not settled. */
  unknown150: number;
  unknown151: number;
  /** Rows 1 to 20 of the explored map: the town, the same twenty numbers for everybody. */
  explored: number[];
}

/** What {@link rollChar} needs from outside itself: the dice and the answers. */
export interface RevGameOptions {
  rng: Rng;
  /** The race the menu is sitting on, 1 to 4, which is what the menu draws highlighted. */
  race?: number;
  /** The race the player pressed Enter on, 1 to 4. */
  askRace(): number;
  /** 0 to keep the character, 1 to roll another. */
  askKeep(): number;
  /** 1 for a fighter, 2 for a wizard. */
  askClass(): number;
  askName(): string;
  /** The key each of the two instruction screens waits for. */
  pressAnyKey(): void;
}

/** CHCHAR.EXE part way through a roll: what it has printed and what it has decided. */
export interface RevGame extends RevGameOptions {
  screen: RevScreenLine[];
  /** How many columns the screen is: 80 for the instructions, 40 from the race menu on. */
  width: number;
  /** Where the next PRINT goes. */
  row: number;
  column: number;
  /** The foreground COLOR was last set to, and the background. */
  colour: number;
  background: number;
  /**
   * The subscript `nextColour` (CHCHAR 16E8) is on. It counts 1 to 6 and then wraps to 0, and
   * element 0 of the colour table is never filled in, so every seventh paragraph is printed in
   * colour 0 — black on black.
   */
  colourStep: number;
  pc: RevCharacter;
}

/** A character with nothing rolled yet: what the BASIC variables hold before roll starts. */
export function blankRevCharacter(): RevCharacter {
  return {
    name: '',
    race: 1,
    cls: 1,
    stats: [0, 0, 0, 0, 0, 0],
    fromStrength: 0,
    fromHealth: 0,
    fromAgility: 0,
    maxHp: 0,
    spellPoints: 0,
    money: 0,
    weight: 0,
    unknown150: 0,
    unknown151: 0,
    explored: [],
  };
}

/** CHCHAR.EXE as it stands at its offset 0040, before anything has been printed. */
export function newRevGame(options: RevGameOptions): RevGame {
  return {
    ...options,
    screen: [],
    // SCREEN 0 at 0049 and WIDTH 80 at 004E.
    width: 80,
    row: 1,
    column: 1,
    colour: 7,
    background: 0,
    colourStep: 0,
    pc: blankRevCharacter(),
  };
}
