import { callCheckEng } from '../game/port/combat';
import {
  castSpell,
  castTypeAllowed,
  drawCastTypeMenu,
  drawSpellList,
  showSpellHelp,
  spellCost,
  spellListChoice,
  CAST_SPELLBOOK,
} from '../game/port/inventory';
import { passMoment } from '../game/port/moment';
import {
  anyKeyChoice,
  clearMenuBlock,
  clearMessageLine,
  clearRect,
  gmenuChoice,
  type MenuChoice,
} from '../game/port/screens';
import type { Game } from '../game/port/state';
import type { Turn } from './engine';

/**
 * cast_a_spell (exe 2000:e017, unf.c "cast_a_spell"), the whole of it: the menu of the eight
 * lists, the thirty spells of the list that was picked, and the spell itself.
 *
 * The screens are ported in `src/lib/game/port/inventory.ts`, each split into the part that
 * draws and the part that says what one key means; this is the loop between them, and the time
 * movecontrol spends on the spell afterwards.
 */

/** Read keys the way the game's menu readers do: past every key the reader makes nothing of. */
async function menuChoice(
  game: Game,
  reader: (key: number) => MenuChoice,
): Promise<number | 'escape'> {
  for (;;) {
    const choice = reader(await game.key());
    if (choice !== null) return choice;
  }
}

/**
 * What cast_a_spell wipes before it leaves the spell table, whichever way it leaves it: the
 * miniature layout takes the menu column and the line above it back, and the big one clears the
 * top of the screen it drew the table over.
 */
function clearSpellList(game: Game, mini: boolean): void {
  if (mini) {
    clearMenuBlock(game);
    clearMessageLine(game);
    return;
  }
  clearRect(game, 0, 0, 0x640, 0x21c);
}

/**
 * cast_a_spell (exe 2000:e017, unf.c "cast_a_spell"): cast a spell out of `source`, which is the
 * spellbook for the C key and a scroll, a wand or a sheet of paper for the I key.
 */
export async function castASpell(turn: Turn, source: number): Promise<void> {
  const { game, session } = turn;
  if (!drawCastTypeMenu(game, source)) {
    game.pressAnyKey();
    return;
  }
  const line = await menuChoice(game, (key) => gmenuChoice(1, 8, key));
  if (line === 'escape') return;
  const type = line - 1;
  if (!castTypeAllowed(game, source, type)) {
    game.pressAnyKey();
    return;
  }
  drawSpellList(game, source, type, session.miniSpellMenu);
  game.redrawView = true;
  for (;;) {
    const choice = spellListChoice(game, source, type, await game.key());
    if (choice.kind === 'ignored') continue;
    clearSpellList(game, session.miniSpellMenu);
    if (choice.kind === 'switchLayout') {
      session.miniSpellMenu = !session.miniSpellMenu;
      return;
    }
    if (choice.kind === 'escape') return;
    if (type < 4) {
      castPickedSpell(turn, source, type, choice.level, choice.slot);
      return;
    }
    // The four help lists show a description and wait; mset_gmenu called with a first of -1 takes
    // whatever key is pressed, escape included, and the description stays on the screen.
    showSpellHelp(game, type - 4, choice.level, choice.slot);
    anyKeyChoice(await game.key());
    return;
  }
}

/**
 * The rest of cast_a_spell once a spell has been picked, and the time movecontrol (exe 2000:c308)
 * spends on it afterwards.
 *
 * A spell that moves the character to another floor is loaded onto it here: the original's
 * spell_effect calls load_level_map itself, which the port records as an event instead — see the
 * port README's second departure — so the session lays the new floor out.
 */
function castPickedSpell(
  turn: Turn,
  source: number,
  type: number,
  level: number,
  slot: number,
): void {
  const { game, session } = turn;
  const affordable = source !== CAST_SPELLBOOK || spellCost(level) <= game.pc.sp;
  const floorBefore = game.pc.level;
  const result = castSpell(game, source, type, level, slot, session.battleSpellsShown);
  session.battleSpellsShown = result.battleSpellsShown;
  // The refusal cast_a_spell prints for a spell there are no points for is a print_menu_only,
  // which waits for a key.
  if (!affordable) game.pressAnyKey();
  if (game.pc.level !== floorBefore) session.enterFloor(game.pc.level);
  spendSpellSeconds(game, result.seconds);
}

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), what it does with the seconds cast_a_spell
 * hands back: give every monster standing beside the character the attacks that time buys, then
 * let one moment of the game go by.
 *
 * A spell that cost nothing costs no time either. Under a minute is spent in one go; anything
 * longer is spent a minute at a time, and ten hours — which is what a permanent spell costs — is
 * so long that the loop declines to spend it at all and no time passes.
 *
 * The decompilation keeps both of those branches but loses the number each call_check_eng is
 * given; a minute is what the loop can hand it without overflowing the int it takes, which is
 * also why the ten-hour case is left out.
 */
function spendSpellSeconds(game: Game, seconds: number): void {
  if (seconds === 0) return;
  if (seconds < 60) callCheckEng(game, seconds);
  else if (seconds < 30000) {
    for (let minute = 0; minute < Math.trunc(seconds / 60); minute += 1) callCheckEng(game, 60);
  }
  passMoment(game);
  game.redrawView = true;
}
