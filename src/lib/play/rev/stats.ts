import { revBasicNumber } from './magic';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue } from './record';
import { revClearScreen, revDrawTheDungeonAgain, revHitAnyKey } from './screens';
import type { RevGame } from './state';
import { REV_SPELL_LEVELS } from './tables';
import { REV_ARMOUR_WORN } from './treasure';
import type { RevTownDesk } from './town';

/**
 * 1000:19F7: the V key, which is the whole character sheet on a screen of its own.
 *
 * The screen is cleared, the sheet is printed from row 1 down, the game waits for a key
 * (1000:1C4A) and then clears and draws the dungeon again (1000:1C69). Six other things end
 * here as well — the scroll of healing, the spell point scroll and four of the spells — which is
 * how the player is shown what they did.
 *
 * The store calls the same routine with DGROUP B582 set (1000:2833), which stops it at the
 * weapons and leaves the money and the disease off. Nothing else ever sets that flag, so the V
 * key always gets the whole sheet.
 */

/** 1000:1A33, 1A4B, 1A4C and 1A58: the heading and the class. */
export const REV_STATISTICS_FOR = 'Player Statistics For ';
export const REV_CLASS = 'Class: ';
export const REV_FIGHTER = ' FIGHTER';
export const REV_WIZARD = ' WIZARD';

/** 1000:1A0E: a name over forty characters is cut to thirty-seven and given an ellipsis. */
const NAME_FITS = 40;
const NAME_CUT_TO = 37;
const ELLIPSIS = '...';

/** 1000:1AEE, 1B0B, 1B25, 1B3F and 1B59: what is worn and what is owned. */
export const REV_WEARING = 'You are wearing ';
export const REV_WEAPONS_OWNED = 'Weapons owned:';
const WEAPONS = [
  { value: REV_VALUE.knife, name: 'KNIFE ' },
  { value: REV_VALUE.sword, name: 'SWORD ' },
  { value: REV_VALUE.mace, name: 'MACE' },
];

/** 1000:1B76 and 1B82: the health line, whose numbers are BASIC's own. */
export const REV_HEALTH_POINTS = 'Health points: ';
const OF = 'of';

/** 1000:1C35 and 1C41: what a diseased character is told. */
export const REV_DISEASED = ['You are diseased.  Get a cure disease at', '   the temple (400 JP).'];

/**
 * 1000:1B91 to 1C1E: the six lines that are printed through 1000:1C76.
 *
 * Each is `PRINT USING <label> + "############# "`, so the `#` the label ends with is part of
 * the field rather than of the words: every one of the six is a label thirteen characters wide
 * and a number right-justified to column twenty-six. `Experience` gets three of them because it
 * is the number that runs largest.
 */
const NUMBER_FIELD = '############# ';
const NUMBERED_LINES: { label: string; of: (game: RevGame) => number }[] = [
  { label: 'Spell points#', of: (game) => game.pc.spellPoints },
  { label: 'Player level#', of: (game) => game.pc.level },
  { label: 'Player weight', of: (game) => game.pc.weight },
  { label: 'Pocket money#', of: (game) => game.pc.money },
  { label: 'Experience###', of: (game) => game.pc.experience },
  { label: 'Money in bank', of: (game) => game.pc.bank },
];

/**
 * `PRINT USING` with one field of `#`s in it.
 *
 * BASIC rounds the number to a whole one, puts it at the right-hand end of the field and pads
 * the rest with spaces; a number too long for the field is printed in full with a `%` in front
 * of it. Every format this screen uses is literal text with a single run of `#`s in it, so that
 * is all this does.
 */
export function revPrintUsing(format: string, value: number): string {
  const field = /#+/.exec(format);
  if (!field) return format;
  const digits = String(Math.round(value));
  const written = digits.length > field[0].length ? `%${digits}` : digits.padStart(field[0].length);
  return `${format.slice(0, field.index)}${written}${format.slice(field.index + field[0].length)}`;
}

/** 1000:1A0E: the name as the heading takes it. */
function heading(name: string): string {
  const shown = name.length > NAME_FITS ? `${name.slice(0, NAME_CUT_TO)}${ELLIPSIS}` : name;
  return `${REV_STATISTICS_FOR}${shown}`;
}

/**
 * The sheet, line by line, in the order the game prints it.
 *
 * The name beside `Class: ` is an element of a string array DUNSMALL never fills — it arrives in
 * COMMON from the program that made the character, indexed by value 161 of the record
 * (1000:1A51) — so there is nothing here to put after the label. The line under it is the one
 * that says which class it is.
 */
export function revStatsSheet(game: RevGame): string[] {
  const pc = game.pc;
  const lines = [heading(game.name), REV_CLASS, pc.cls === 1 ? REV_FIGHTER : REV_WIZARD, ''];
  // 1000:1AA4: the six characteristics, each with the format `F1.COM` names its spell level
  // after (`tables.ts`), in the record's own order.
  REV_SPELL_LEVELS.forEach((level, at) => lines.push(revPrintUsing(level.stat, pc.stats[at])));
  lines.push('');
  lines.push(`${REV_WEARING}${REV_ARMOUR_WORN[revValue(pc, REV_ARMOUR_VALUE)] ?? ''}`);
  // 1000:1B08: every weapon owned is printed with a semicolon after it, so the three of them
  // are on the label's own line.
  const owned = WEAPONS.filter((weapon) => revValue(pc, weapon.value) === 1).map((weapon) => weapon.name);
  lines.push(`${REV_WEAPONS_OWNED}${owned.join('')}`);
  lines.push(`${REV_HEALTH_POINTS}${revBasicNumber(pc.hp)}${OF}${revBasicNumber(pc.maxHp)}`);
  for (const line of NUMBERED_LINES) lines.push(revPrintUsing(`${line.label}${NUMBER_FIELD}`, line.of(game)));
  if (revValue(pc, REV_VALUE.disease) > 0) lines.push(...REV_DISEASED);
  return lines;
}

/** 1000:19F7: the sheet on a screen of its own, until a key comes. */
export async function revShowStats(game: RevGame, desk: RevTownDesk): Promise<void> {
  // 1000:19F7 empties the keyboard before it clears the screen, so what was typed while the
  // player was walking does not answer the wait at the bottom of the sheet.
  game.flushKeys();
  revClearScreen(game);
  // 1000:1A00: the screen is one of the things that hold the rings of health back.
  game.ringsHeldBack = true;
  game.say(...revStatsSheet(game));
  await revHitAnyKey(game, desk);
  // 1000:1C69.
  revDrawTheDungeonAgain(game, 'afterAScreen');
}
