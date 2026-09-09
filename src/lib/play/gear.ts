import { ARMOR_NAMES, WEAPON_NAMES } from '../game/port/drops';
import {
  clearMenuBlock,
  clearMessageLine,
  drawMenu,
  gmenuChoice,
  MENU_X,
  MESSAGE_LINE_Y,
} from '../game/port/screens';
import type { Game } from '../game/port/state';
import type { Turn } from './engine';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), its 0x61 and 0x77 branches: the A key, which
 * changes the armor worn, and the W key, which changes the weapon in hand.
 *
 * Both build their own eight-line menu of what the character owns rather than calling a function
 * for it, and the enchant spells build the same menu again — enchant_weapon_perm (exe 3000:d148)
 * and enchant_armor_perm (exe 3000:d211) — so {@link gearMenuLines} is the one copy of it.
 *
 * Neither branch works the loaded weight out again: compute_weight (exe 2000:41ae) runs once
 * before movecontrol's loop and then only where something is picked up or thrown away, so a
 * character who puts a heavier suit on is not slowed down by it until then.
 *
 * The message text is the exact bytes of the game's own strings, read out of the data segment of
 * the unpacked executable; dotu-tools/reference/scripts/exe_strings.py reads them back.
 */

/** How many rows the menu has, which is one more than the armor table holds. */
const GEAR_SLOTS = 8;

/** What a slot the character owns nothing in reads as (exe DS:1806, and DS:326e in the enchant
 *  spells, which are the same eight dashes stored twice). */
const EMPTY_SLOT = '--------';

/** What goes between the name and the plus already on it (exe DS:1691). */
const PLUS = ', PLUS ';

/**
 * The eight lines the menu is built from: the row number from DS:080b onwards, then the name of
 * what is in the slot with the plus on it written after it, or the dashes for a slot the
 * character owns nothing in.
 *
 * The armor table (exe DS:01f4) has seven rows and the menu has eight, so the eighth line reads
 * a name that is not there; nothing in the game ever puts armor in that slot, so the dashes are
 * what the port shows for it.
 */
export function gearMenuLines(names: string[], owned: number[], plus: number[]): string[] {
  return Array.from({ length: GEAR_SLOTS }, (unused, slot) => {
    const name = names[slot];
    if (owned[slot] < 1 || name === undefined) return `${slot + 1}) ${EMPTY_SLOT}`;
    return `${slot + 1}) ${name}${plus[slot] === 0 ? '' : `${PLUS}${plus[slot]}`}`;
  });
}

/**
 * movecontrol's 0x61 branch (exe 2000:d0ec): which of the seven suits a class may wear. A
 * worshipper and a wizard wear nothing but their own skin, and a monk and a sage get no further
 * than leather.
 */
export function armorAllowed(cls: number, slot: number): boolean {
  if (slot >= 1 && (cls === 1 || cls === 3)) return false;
  return !(slot >= 2 && (cls === 2 || cls === 5));
}

/**
 * movecontrol's 0x77 branch (exe 2000:d213): which of the eight weapons a class may hold. A
 * worshipper and a monk fight with their fists; a wizard and a sage may also carry the stick and
 * the knife; and the great sword is the fighter's alone.
 */
export function weaponAllowed(cls: number, slot: number): boolean {
  if (slot >= 1 && (cls === 1 || cls === 2)) return false;
  if (slot >= 2 && slot !== 4 && (cls === 3 || cls === 5)) return false;
  return !(slot === 7 && cls !== 0);
}

/** The question each branch draws over its menu (exe DS:1d19 and DS:1d9c), in the colour at
 *  DS:0435, which is white and nothing ever writes to. */
const ARMOR_QUESTION = 'PLEASE SELECT YOUR ARMOR:';
const WEAPON_QUESTION = 'PLEASE SELECT YOUR WEAPON:';
const QUESTION = { x: MENU_X, y: MESSAGE_LINE_Y, font: 0, colour: 15 } as const;

/** What a class that may not wear the armor it picked is told (exe DS:1d33 1d51 1d73 1d93 06f0
 *  0c5a 06f0 06f0). */
const WRONG_ARMOR = [
  'CHARACTERS OF YOUR PROFESSION',
  '  CAN NOT WEAR ARMOR OF THIS TYPE',
  '  YOU CONTINUE TO WEAR YOUR OLD',
  '  ARMOR.',
  '',
  'HIT ANY KEY...',
];

/** And for the weapon (exe DS:1db7 1dd0 1deb 1e03 1e1d 06f0 0c5a 06f0). */
const WRONG_WEAPON = [
  'CHARACTERS OF YOUR CLASS',
  '  CAN NOT USE THAT WEAPON.',
  '  YOU SHOULD, THEREFORE',
  '  DROP THE WEAPON TO SAVE',
  '  WEIGHT.',
  '',
  'HIT ANY KEY...',
];

/** The A key: the armor worn, out of the suits the character is carrying. */
export async function changeArmor(turn: Turn): Promise<void> {
  const pc = turn.game.pc;
  const slot = await pickASlot(
    turn.game,
    ARMOR_QUESTION,
    gearMenuLines(ARMOR_NAMES, pc.armorOwned, pc.armorPlus),
    pc.armorOwned,
  );
  if (slot === null) return;
  if (!armorAllowed(pc.cls, slot)) {
    turn.game.say(...WRONG_ARMOR);
    turn.game.pressAnyKey();
    return;
  }
  pc.armor = slot;
  turn.game.events.push({ kind: 'gearSwitched' });
}

/** The W key: the weapon in hand, out of the weapons the character is carrying. */
export async function changeWeapon(turn: Turn): Promise<void> {
  const pc = turn.game.pc;
  const slot = await pickASlot(
    turn.game,
    WEAPON_QUESTION,
    gearMenuLines(WEAPON_NAMES, pc.weaponsOwned, pc.weaponPlus),
    pc.weaponsOwned,
  );
  if (slot === null) return;
  if (!weaponAllowed(pc.cls, slot)) {
    turn.game.say(...WRONG_WEAPON);
    turn.game.pressAnyKey();
    return;
  }
  pc.weapon = slot;
  turn.game.events.push({ kind: 'gearSwitched' });
}

/**
 * The question, the menu, and the row that comes back — or null when the row picked holds
 * nothing the character owns, and for escape.
 *
 * mset_gmenu hands escape back as -1 and the branch then asks whether the character owns row -1,
 * which reads the padding byte in front of the table it is asking about: record offset 0xae for
 * the armor and 0x80 for the weapons. Both are zero in every character file, so escape leaves
 * the character in what they had on.
 *
 * The original leaves the question and the menu on the screen for whatever draws in that column
 * next; the port takes them down, since a screen left there would go on covering the map.
 */
async function pickASlot(
  game: Game,
  question: string,
  lines: string[],
  owned: number[],
): Promise<number | null> {
  clearMessageLine(game);
  game.draw({ ...QUESTION, text: question });
  drawMenu(game, lines);
  let row: number | 'escape' | null = null;
  while (row === null) row = gmenuChoice(1, GEAR_SLOTS, await game.key());
  clearMessageLine(game);
  clearMenuBlock(game);
  if (row === 'escape') return null;
  return owned[row - 1] > 0 ? row - 1 : null;
}
