import type { Game } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked executable. The comment on each say call gives the address of every line it
// prints, in order; dotu-tools/reference/scripts/exe_strings.py reads them back.

/**
 * FUN_2000_8189 (exe 2000:8189, unf.c "FUN_2000_8189"): move one of the six stats by `amount`,
 * which the monster tables hold as -6..-1 to drain and 1..6 to raise. Which stat it is comes
 * from the size of the number and how far it moves from the number itself, divided by that same
 * size — so every one of the twelve values moves its stat by exactly one point.
 *
 * The original leaves the stat's name in the shared string buffer at DS:c427 for its caller to
 * finish the sentence with; the port hands it back instead. A number outside -6..-1 and 1..6
 * changes nothing and leaves whatever was in the buffer, which is the empty string here.
 */
export function gainOrDrain(game: Game, amount: number): string {
  const pc = game.pc;
  switch (Math.abs(amount)) {
    case 1:
      pc.str += amount;
      return 'STRENGTH'; // DS:134e
    case 2:
      pc.iq += Math.trunc(amount / 2);
      return 'INTELLIGENCE'; // DS:1357
    case 3:
      pc.wis += Math.trunc(amount / 3);
      return 'WISDOM'; // DS:1364
    case 4:
      pc.con += Math.trunc(amount / 4);
      return 'CONSTITUTION'; // DS:136b
    case 5:
      pc.dex += Math.trunc(amount / 5);
      // DS:1378. The recovered source says "AGILITY" here; the 1993 executable says this.
      return 'DEXTERITY';
    case 6:
      pc.luck += Math.trunc(amount / 6);
      return 'LUCK'; // DS:1382
  }
  return '';
}

/**
 * strike (exe 2000:7e36, unf.c "strike"): one swing at the monster the player is engaging.
 * Returns the damage it did; zero is a miss.
 *
 * The roll is a d80 plus everything the character brings, less twice the monster's level and its
 * type's to-hit armor and speed. Every full 40 points the roll ends up above 40 rolls the
 * weapon's damage die once, so a big enough roll hits several times over.
 */
export function strike(game: Game): number {
  const pc = game.pc;
  // The original sets a flag at DS:c651 here that nothing in the game ever reads back.
  let die = pc.weapon;
  // A Power Weapon spell writes 1, 2 or 3, and eight rows into the weapon table is the row
  // labelled POWER WEAPON 1, so Power Weapon I swings the 129 die of POWER WEAPON 2 and Power
  // Weapon III swings the 399 die of POWER WEAPON 4, which no spell is supposed to reach.
  if (pc.powerWeapon !== 0) die = pc.powerWeapon + 8;
  // srand(clock()) at 2000:7e6f, deliberately not ported: see the README's third departure.
  const monster = game.monsters[game.engaged];
  const stats = game.monsterStats[game.monsterKinds[monster.type].type];
  let chance = game.rng.random(80) + pc.lev * 2 + pc.str;
  if (pc.hard === 0) {
    if (pc.str > 25) chance += 25;
    chance += pc.str;
  }
  // The to-hit bonus and the plus come from the weapon in hand even when a power weapon is
  // supplying the damage die.
  chance +=
    pc.luck +
    pc.luckyCharms +
    game.weaponHit[pc.weapon] +
    pc.gauntlet +
    pc.weaponPlus[pc.weapon] +
    pc.tempWeaponPlus;
  if (pc.level > 75 && game.rng.random(30) === 1) chance += 40;
  chance -= monster.level * 2 + stats.defense + stats.speed;
  let damage = 0;
  while (chance > 40) {
    damage += game.rng.random(game.weaponDamage[die]);
    chance -= 40;
  }
  if (damage > 0) {
    damage +=
      game.rng.random(20) < pc.lev
        ? game.rng.random(pc.str)
        : game.rng.random(Math.trunc(pc.str / 3));
    if (damage > 0 && pc.lev < 5) damage += game.rng.random(5 - pc.lev);
    damage += game.rng.random(pc.lev);
  }
  if (damage < 1) {
    // DS:1337
    game.say('YOU MISSED THE MONSTER');
  } else {
    // DS:1303
    game.say('YOU HIT THE MONSTER!!!');
    // DS:131a 1324, with the damage written between them
    game.say(`IT TAKES ${damage} POINTS OF DAMAGE!`);
  }
  // The original writes through the pointer at DS:c64b, which attack_timing aims at the engaged
  // monster's hit points at the same moment it writes the slot number this function reads.
  monster.hp -= damage;
  return damage;
}
