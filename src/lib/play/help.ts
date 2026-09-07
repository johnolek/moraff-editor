import { HELP_TOPICS, helpScreen, type HelpLine } from '../game/port/hints';
import type { Game } from '../game/port/state';
import type { GameSession } from './engine';
import { KEY } from './keys';

/**
 * FUN_3000_7dfc (exe 3000:7dfc, unf.c "FUN_3000_7dfc"): the help the snake called Smarty keeps,
 * which F1 and H both open.
 *
 * It is a menu of twenty-eight topics in two columns of fourteen, and each one is a `.uhp` file
 * of pages that read_spell_help (exe 3000:7c6d) draws a line at a time. Every coordinate here is
 * the game's own.
 */

/** How many rows the menu has; the topics fill the left column first. */
const MENU_ROWS = 14;

/** Where the snake's own four lines go, from FUN_3000_9026 (exe 3000:9026). */
const SNAKE_X = 100;
const SNAKE_Y = 0x159;
const SNAKE_STEP = 0x50;

/** The snake's greeting, which is four strings rather than one (exe DS:2d57). */
const SNAKE_LINES = [
  'A little snake scurries up and says',
  "'Smarty is my name, and information",
  'is my game! Learning means earning,',
  'so what can I do for you?',
];

/** Where the two columns of the menu start and how far each line is spread. */
const LEFT_X = 0x6e;
const LEFT_TO = 0x2b2;
const RIGHT_X = 0x38e;
const RIGHT_TO = 0x5d2;
const MENU_Y = 0x73;
const MENU_STEP = 0x4e;

/** The line across the top of the menu (exe DS:2de3), and where it goes. */
const EXIT_LINE = 'HIT RIGHT BUTTON OR ESCAPE TO EXIT';
const EXIT_X = 0xdc;
const EXIT_Y = 0x1a;
const EXIT_TO = 0x56e;

/** Where a page of a help file is drawn: forty units a line, from the top of the screen. */
const PAGE_X = 0x2d0;
const PAGE_STEP = 0x28;

/** Show the help until the reader leaves it. */
export async function showHelp(session: GameSession): Promise<void> {
  const game = session.game;
  for (;;) {
    drawMenu(game);
    const key = await game.key();
    game.eraseScreen();
    if (key === KEY.escape) return;
    const topic = HELP_TOPICS.find((entry) => entry.key.toLowerCase().charCodeAt(0) === key);
    if (!topic) continue;
    await showPages(session, helpScreen(topic.file));
  }
}

/** The snake, its question, and the two columns of topics. */
function drawMenu(game: Game): void {
  game.eraseScreen();
  game.draw({ text: EXIT_LINE, x: EXIT_X, y: EXIT_Y, spreadTo: EXIT_TO, font: 1, colour: 5 });
  SNAKE_LINES.forEach((text, index) => {
    game.draw({ text, x: SNAKE_X, y: SNAKE_Y + index * SNAKE_STEP, font: 1, colour: 15 });
  });
  HELP_TOPICS.forEach((topic, index) => {
    const right = index >= MENU_ROWS;
    game.draw({
      text: topic.label,
      x: right ? RIGHT_X : LEFT_X,
      y: MENU_Y + (index % MENU_ROWS) * MENU_STEP,
      spreadTo: right ? RIGHT_TO : LEFT_TO,
      font: 0,
      colour: 6,
    });
  });
}

/** One topic, a page at a time, each page waiting for a key. */
async function showPages(session: GameSession, pages: HelpLine[][]): Promise<void> {
  const game = session.game;
  for (const page of pages) {
    game.eraseScreen();
    page.forEach((line, index) => {
      if (line.text === '') return;
      game.draw({ text: line.text, x: PAGE_X, y: index * PAGE_STEP, font: 0, colour: line.colour });
    });
    await game.key();
  }
  game.eraseScreen();
}
