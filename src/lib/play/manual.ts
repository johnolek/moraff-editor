import { resetViewCaches } from '../game/port/character';
import { sectionOf } from '../game/dotu-files.js';
import data from '../game/dotu-data.json';
import { toUpperByte } from '../game/port/screens';
import type { Game } from '../game/port/state';
import type { Turn } from './engine';

/**
 * monster_manual (exe 3000:c39d, unf.c "monster_manual"), the S key: the section the character
 * is in, and the five monsters that live there.
 *
 * The text is MD.BIN's, which is `dotu-data.json`'s `sections`: four forty-column lines of
 * introduction and then twenty more, four to a monster, in the order the section's monster table
 * has them. load_md_bin (exe 2000:5fec) reads them into the twenty pointers at DS:c615 and
 * FUN_3000_9026 (exe 3000:9026) draws four of them at a time.
 *
 * The original fills the top of the screen with the five monsters' pictures and puts the letters
 * under them; this port draws the letters and the words alone. It also draws every line twice,
 * in colour 14 and then in 15, which is a shadow behind the text.
 */

/** How many lines of MD.BIN one monster's description is. */
const BLOCK_LINES = 4;

/**
 * Which description each of the five letters shows (exe 3000:ca35). The letters are not the
 * order the monster table is in: A is the section's Shadow boss, E is the first of the four
 * ordinary monsters, and B, C and D are the other three. The pictures are drawn in the same
 * order, so a letter is under the monster it describes.
 */
const LETTER_BLOCKS = [0, 2, 3, 4, 1];

/** The first and last of the five letters the manual reads. */
const FIRST_LETTER = 0x41;

/** The row of letters under the pictures (exe DS:352b), and where FUN_4000_069a puts it. */
const LETTERS = { text: 'A     B     C     D     E', x: 0x19, y: 0x41a, spreadTo: 0x564 };

/** The line across the bottom (exe DS:3598), as psfont draws it when there is no mouse. */
const PROMPT = {
  text: 'PRESS A, B, C, D, OR E FOR MORE INFORMATION OR HIT A KEY TO CONTINUE',
  x: 0,
  y: 0x488,
  spreadTo: 0x63f,
};

/** Where FUN_3000_9026 puts its four lines with the manual's own offset (DS:2412 of 2) applied. */
const TEXT_X = 100;
const TEXT_TOP = 0x37;
const TEXT_STEP = 0x8c;
const TEXT_TO = 0x5dc;
const TEXT_COLOUR = 0xf;

/** The S key, until the reader leaves it. */
export async function readTheMonsterManual(turn: Turn): Promise<void> {
  const game = turn.game;
  const section = data.sections[sectionOf(game.pc.module, game.pc.level) - 1];
  let shown: string[] = section.intro;
  for (;;) {
    drawPage(game, shown);
    const block = letterPressed(await game.key());
    if (block === null) break;
    shown = section.descriptions.slice(block * BLOCK_LINES, (block + 1) * BLOCK_LINES);
  }
  game.eraseScreen();
  resetViewCaches(game);
}

/**
 * Which description a key asks for. The original puts the key through toupper and treats
 * everything outside A to E as the answer that leaves, escape included.
 */
function letterPressed(key: number): number | null {
  const letter = toUpperByte(key) - FIRST_LETTER;
  return LETTER_BLOCKS[letter] ?? null;
}

/** The four lines of a page, with the letters and the prompt that stay under them. */
function drawPage(game: Game, lines: string[]): void {
  game.eraseScreen();
  lines.forEach((text, index) => {
    game.draw({
      text,
      x: TEXT_X,
      y: TEXT_TOP + index * TEXT_STEP,
      spreadTo: TEXT_TO,
      font: 1,
      colour: TEXT_COLOUR,
    });
  });
  game.draw({ ...LETTERS, font: 1, colour: TEXT_COLOUR });
  game.draw({ ...PROMPT, font: 0, colour: TEXT_COLOUR });
}
