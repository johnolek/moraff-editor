import type { MwKillChoices } from '../../game/mw-port/combat';
import { monsterKilled } from '../../game/mw-port/combat';
import type { MwGameSession } from './engine';
import { MW_KEY } from './keys';
import { runAsking } from './replay';

/**
 * movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol") after the key has been dealt with: a
 * monster being fought whose hit points have run out is killed here rather than wherever they
 * ran out, so a swing, a spell and a hand grenade all end the same way.
 *
 * `monster_killed` asks four menus while it hands out the loot — whether to take a weapon, a
 * suit of armor or the stones, and which weapon a boss's orb is used on — and each of them is a
 * key read where the box is on the screen, which is what `./replay.ts` is for.
 */

/** The four menus, by the name {@link runAsking} knows them by. */
const TAKE_WEAPON = 'takeWeapon';
const TAKE_ARMOR = 'takeArmor';
const TAKE_STONES = 'takeStones';
const ENHANCE_WEAPON = 'enhanceWeapon';

/** The six letters the pile of stones is sorted with (exe DS:600a). */
const STONE_KEYS = 'IGPAJL';

export async function killTheDead(session: MwGameSession): Promise<void> {
  const game = session.game;
  if (game.engaged === -1 || game.monsters[game.engaged].hp >= 1) return;
  await runAsking<void>(session, {
    run(hooked, take) {
      const choices: MwKillChoices = {
        takeWeapon: () => take(TAKE_WEAPON) as boolean,
        takeArmor: () => take(TAKE_ARMOR) as boolean,
        takeStones: () => take(TAKE_STONES) as string,
        enhanceWeapon: () => take(ENHANCE_WEAPON) as number,
      };
      monsterKilled(hooked, choices);
    },
    ask: (question) => askKillMenu(session, question),
  });
}

/** One of the four menus, read off the box the port has already printed. */
async function askKillMenu(session: MwGameSession, question: string): Promise<unknown> {
  if (question === TAKE_WEAPON || question === TAKE_ARMOR) {
    // FUN_2000_1fbd(2, 3): lines 3 and 4 of the box, which take and leave.
    return (await session.menuKey(2, 3)) === 0x31;
  }
  if (question === TAKE_STONES) {
    // The reader takes any of the six letters in either case, and Escape leaves the lot.
    for (;;) {
      const key = await session.key();
      if (key === MW_KEY.escape) return 'L';
      const letter = String.fromCharCode(key).toUpperCase();
      if (STONE_KEYS.includes(letter)) return letter;
    }
  }
  // FUN_2000_1fbd(0, 7): the eight weapon slots of the boss's orb.
  return (await session.menuKey(0, 7)) - 0x30;
}
