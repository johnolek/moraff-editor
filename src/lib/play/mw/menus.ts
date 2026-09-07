import type { MwGame } from '../../game/mw-port/state';
import { ARMOUR, WEAPONS } from '../../mw-bestiary/monsters';
import { MW_TEXT_COLOUR } from './screens';

/**
 * The menus movecontrol and the spells put up themselves, rather than through a ported function.
 *
 * Every one of them is the eight-line message box FUN_2000_1d0b (WORLD.EXE 2000:1d0b) draws and
 * reads a digit off, sometimes with one line drawn over the top of the map above it.
 */

/** How many slots the weapon and the armor menus list. */
const SLOTS = 8;

/** FUN_2000_1c86 (WORLD.EXE 2000:1c86): the "1) " to "8) " every slot line starts with. */
function numbered(lines: string[]): string[] {
  return lines.map((line, index) => `${index + 1}) ${line}`);
}

/**
 * The eight weapon slots as enchant_weapon (WORLD.EXE 2000:c30e) and movecontrol's W key list
 * them: the name of the weapon owned in each, with its plus, and eight dashes for an empty slot.
 */
export function weaponSlotLines(game: MwGame): string[] {
  const pc = game.pc;
  return numbered(
    Array.from({ length: SLOTS }, (unused, slot) => {
      if (pc.weaponsOwned[slot] < 1) return '--------'; // DS:2ba3
      // DS:2a48 with the plus on the end, after the weapon's own name
      if (pc.weaponPlus[slot] === 0) return WEAPONS[slot].name;
      return `${WEAPONS[slot].name}, PLUS ${pc.weaponPlus[slot]}`;
    }),
  );
}

/**
 * The same over the eight armor slots (enchant_armour, WORLD.EXE 2000:c3d5, and movecontrol's A
 * key). The table has seven rows and the menu lists eight, so the last line reads whatever
 * follows the table; the port leaves it empty.
 */
export function armorSlotLines(game: MwGame): string[] {
  const pc = game.pc;
  return numbered(
    Array.from({ length: SLOTS }, (unused, slot) => {
      if (pc.armorOwned[slot] < 1) return '--------'; // DS:2ba3
      const name = ARMOUR[slot]?.name ?? '';
      // DS:2a48 with the plus on the end
      if (pc.armorPlus[slot] === 0) return name;
      return `${name}, PLUS ${pc.armorPlus[slot]}`;
    }),
  );
}

/** movecontrol's 0x77 branch: the weapon menu, with its heading over the map. */
export function drawWeaponMenu(game: MwGame): void {
  game.draw({ text: 'PLEASE SELECT YOUR WEAPON:', x: 0, y: 0, font: 0, colour: MW_TEXT_COLOUR }); // DS:3380
  game.say(...weaponSlotLines(game));
}

/** movecontrol's 0x61 branch: the armor menu. */
export function drawArmorMenu(game: MwGame): void {
  game.draw({ text: 'PLEASE SELECT YOUR ARMOR:', x: 0, y: 0, font: 0, colour: MW_TEXT_COLOUR }); // DS:32fd
  game.say(...armorSlotLines(game));
}

/** The slot menus the two enchantment spells put up, which have no heading of their own. */
export function drawWeaponSlotMenu(game: MwGame): void {
  game.say(...weaponSlotLines(game));
}

export function drawArmorSlotMenu(game: MwGame): void {
  game.say(...armorSlotLines(game));
}

/** teleport_direction (WORLD.EXE 2000:d195): the menu Pass Wall asks its direction with. */
export function drawDirectionMenu(game: MwGame): void {
  // DS:3c5f, DS:1476, DS:3c73 3c81 3c91 3ca1 3cb0
  game.say(
    'SELECT A DIRECTION:',
    '',
    '1) NORTH (UP)',
    '2) SOUTH (DOWN)',
    '3) EAST (RIGHT)',
    '4) WEST (LEFT)',
    '5) CANCEL SPELL (ESCAPE)',
  );
}
