import type { Frame } from '../../view3d/frame';
import { TEXT } from './colours';
import { drawText } from './font';

/**
 * Everything on the screen that is a `LOCATE` and a `PRINT`: the message lines, the spells the
 * character is under, the help offered to a beginner and what a kill would be worth.
 *
 * Each of these is one place in the executable and one row and column, which is why they are all
 * in one file rather than beside the code that would have printed them.
 */

/** The four rows the message clearer at `1000:3038` blanks, which is the message area proper. */
export const MESSAGE_ROWS = 4;

/** The five spells the panel lists, in the rows they are printed on (1000:02D6). */
export const SPELL_NAMES = ['SPD A', 'STR A', 'STR P', 'SPD P', 'INVIS'];

/** A fight, as the three lines at the top of the screen say it (1000:7FCB, 8553, 8588). */
export interface RevFightLines {
  monsterName: string;
  monsterLevel: number;
  yourHealth: number;
  itsHealth: number;
  /** The double at B6FA, printed under `EXP. VALUE:` on every round. */
  experience: number;
}

/** What the words on the screen need of the game. */
export interface RevWords {
  /** The lines the loop has printed, from row 1 down. */
  messages: string[];
  /** Row 5's own line, which the full redraw prints in the town (1000:4D31). */
  inTown: boolean;
  /** The line the ladder, the chute and the rope put over the BACK label (1000:5685). */
  prompt: string | null;
  fight: RevFightLines | null;
  /** Which of the five spells are running, which is what puts a name in the list. */
  spells: boolean[];
  /** The character's own level; `H=HELP` is offered only below level 2 (1000:49D1). */
  characterLevel: number;
}

/**
 * A number the way BASIC's `PRINT` writes one: a space where the minus sign would be, and a
 * space after it.
 *
 * Single precision carries about seven digits, and every number this screen prints is small
 * enough that writing it out plainly gives what the game gave.
 */
export function basicNumber(value: number): string {
  const rounded = Number(Math.abs(value).toPrecision(7));
  return `${value < 0 ? '-' : ' '}${rounded}${' '}`;
}

/** The message lines, top left: rows 1 to 4, and the town's own line on row 5. */
export function drawMessages(screen: Frame, words: RevWords): void {
  if (words.fight) {
    const { monsterLevel, monsterName, yourHealth, itsHealth } = words.fight;
    drawText(screen, `A LEVEL${basicNumber(monsterLevel)}${monsterName} IS ATTACKING!`, 1, 1, TEXT);
    drawText(screen, 'YOUR HEALTH POINTS:', 3, 1, TEXT);
    drawText(screen, basicNumber(yourHealth), 3, 21, TEXT);
    drawText(screen, 'ITS HEALTH POINTS:', 4, 1, TEXT);
    drawText(screen, basicNumber(itsHealth), 4, 21, TEXT);
  } else {
    words.messages.slice(0, MESSAGE_ROWS).forEach((line, at) => drawText(screen, line, at + 1, 1, TEXT));
  }
  if (words.inTown) drawText(screen, "YOU'RE IN TOWN", 5, 1, TEXT);
}

/**
 * The spells panel, top right.
 *
 * `1000:4CDF` prints the two-line heading whenever the floor is redrawn and `1000:4ABD` fills
 * the five rows under it, blanking a row whose spell has run out.
 */
export function drawSpells(screen: Frame, spells: boolean[]): void {
  drawText(screen, 'SPELLS', 5, 35, TEXT);
  drawText(screen, 'CAST', 6, 35, TEXT);
  SPELL_NAMES.forEach((name, at) => drawText(screen, spells[at] ? name : '     ', at + 7, 35, TEXT));
}

/** What killing the monster in front of you would be worth, bottom left (1000:8520). */
export function drawExperience(screen: Frame, experience: number): void {
  drawText(screen, 'EXP. VALUE:', 24, 1, TEXT);
  drawText(screen, basicNumber(experience), 25, 3, TEXT);
}

/** `H=HELP`, in the box between the four views, for a character who has not levelled up yet. */
export function drawHelp(screen: Frame, characterLevel: number): void {
  if (characterLevel < 2) drawText(screen, 'H=HELP', 18, 28, TEXT);
}

/** The ladder-and-rope line, which the game prints over the BACK label (1000:5685). */
export function drawPrompt(screen: Frame, prompt: string): void {
  drawText(screen, prompt.slice(0, 19), 25, 22, TEXT);
}
