import type { Game } from './state';
import { MAP_EMPTY, setMonsterMap } from './state';

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

/**
 * exp_needed (exe 2000:7b48, unf.c "exp_needed"): the experience a character has once they are
 * `level` levels in. A level drain writes this back over the character's experience, which is
 * how the drain takes away the progress towards the next level as well.
 *
 * Ghidra kept the two `pow` bases — the doubles at DS:0421 (1.4) and DS:0429 (2.0) — and dropped
 * the FPU arithmetic around them; the 250 and the 80 are `expNeeded` in `dotu-mech.js`.
 */
export function expNeeded(game: Game, level: number): number {
  if (game.pc.hard === 1) return 250 * Math.pow(2, level - 1);
  return 250 * Math.pow(1.4, level - 1) - 80;
}

/**
 * go_down_level (exe 3000:c093, unf.c "go_down_level"): take back one level's worth of maximum
 * hit points and spell points, rolled the same way the level-up gives them out. A fighter is the
 * only class with no spell points to lose.
 */
export function goDownLevel(game: Game): void {
  const pc = game.pc;
  switch (pc.cls) {
    case 0:
      pc.maxHp -= game.rng.random(pc.con * 2 + Math.trunc(pc.luck / 2) + 10) + 35;
      break;
    case 1:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 2) + 10) + 15;
      pc.maxSp -= Math.trunc((pc.wis * 2 + pc.iq) / 3);
      break;
    case 2:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 5) + 14;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq) / 13);
      break;
    case 3:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 3) + Math.trunc(pc.luck / 5) + 4) + 13;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq * 2) / 5);
      break;
    case 4:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 4) + 14;
      pc.maxSp -= Math.trunc((pc.wis * 2 + pc.iq) / 5);
      break;
    case 5:
      pc.maxHp -= game.rng.random(pc.con * 3 + pc.luck + 17) + 55;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq) / 14);
      break;
    case 6:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 7) + 14;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq * 2) / 8);
      break;
  }
  if (pc.maxSp < pc.sp) pc.sp = pc.maxSp;
  if (pc.maxHp < pc.hp) pc.hp = pc.maxHp;
}

/**
 * The puffball half of defend (exe 2000:82b7, unf.c "defend"): a monster whose special is 6 does
 * not attack at all. It moves one of the six stats by a point and disappears.
 */
function puffball(game: Game, slot: number): number {
  const monster = game.monsters[slot];
  const amount = game.monsterKinds[monster.type].statDrain;
  const stat = gainOrDrain(game, amount);
  // DS:1387 / DS:139d, after the stat's own name
  game.say(stat + (amount < 0 ? ' DRAINED BY PUFFBALL!' : ' RAISED BY PUFFBALL!'));
  setMonsterMap(game, monster.x, monster.y, MAP_EMPTY);
  // The slot is not freed. It is left holding a level 0 monster of kind 0 — a Giant Garbage Can
  // — standing at (100, 100), which is off the bottom of every floor.
  monster.x = 100;
  monster.y = 100;
  monster.hp = 0;
  monster.type = 0;
  monster.level = 0;
  game.redrawView = true;
  return 0;
}

/**
 * The breath half of defend (exe 2000:82b7, unf.c "defend"): half the time, a monster whose
 * description names a breath weapon breathes it instead of swinging, and the damage worked out
 * above is thrown away for `level + Random(level)`, halved by the matching resistance.
 *
 * Acid has no resistance and does something worse instead: it destroys the armor being worn,
 * plus and all, and leaves the character in their skin.
 */
function breathe(game: Game, slot: number): number {
  const pc = game.pc;
  const monster = game.monsters[slot];
  const breath = game.monsterKinds[monster.type].breath;
  const lines = ['', '', '', '', '', '', '', ''];
  // DS:13b2, then DS:13c8 13cd 13d1 13d6 13e3 for the five kinds
  lines[0] = 'THE MONSTER BREATHES ';
  if (breath === 1) lines[0] += 'FIRE';
  if (breath === 2) lines[0] += 'ICE';
  if (breath === 3) lines[0] += 'ACID';
  if (breath === 4) lines[0] += 'GREEN PHLEGM';
  if (breath === 5) lines[0] += 'BLACK SLIME';
  let damage = monster.level + game.rng.random(monster.level);
  if (breath === 1 && pc.antiFireTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 2 && pc.antiColdTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 4 && pc.resistDiseaseTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 5 && pc.resistPoisonTimer > 0) damage = Math.trunc(damage / 2);
  // DS:13ef 1402 140a
  lines[1] = `  ON YOU. IT DOES ${damage} POINTS`;
  lines[2] = '  OF DAMAGE TO YOU.';
  if (breath === 1 && pc.antiFireTimer < 1) lines[3] = 'YOU FEEL TOASTED.'; // DS:141e
  if (breath === 2 && pc.antiColdTimer < 1) lines[3] = 'YOU FEEL CHILLED.'; // DS:1430
  if (breath === 3 && pc.armor !== 0) {
    lines[3] = 'THE ACID DISOLVES YOUR ARMOR'; // DS:1442, the game's own spelling
    pc.armorPlus[pc.armor] = 0;
    pc.armorOwned[pc.armor] -= 1;
    pc.armor = 0;
  }
  if (breath === 4 && pc.resistDiseaseTimer < 1) {
    if (pc.disease < 1) pc.disease = 450;
    game.events.push({ kind: 'playerSaved' });
    // DS:145f 147c
    lines[3] = 'YOU FEEL VERY SICK. YOU NEED';
    lines[4] = '  A CURE DISEASE SPELL.';
  }
  if (breath === 5 && pc.resistPoisonTimer < 1) {
    if (pc.poison < 1) pc.poison = 450;
    game.events.push({ kind: 'playerSaved' });
    // DS:1494 14af
    lines[3] = 'YOU FEEL KIND OF WEAK. YOU';
    lines[4] = '  MIGHT GET A CURE POISON.';
  }
  game.say(...lines);
  game.reprintBattleInfo = true;
  return damage;
}

/**
 * What a hit brings with it, in defend (exe 2000:82b7, unf.c "defend"): the level or experience
 * drain, the stat drain, and the poison and disease. None of it happens on a miss.
 */
function drainsAndAilments(game: Game, slot: number): void {
  const pc = game.pc;
  const kind = game.monsterKinds[game.monsters[slot].type];
  const drain = kind.levelDrain;
  if ((drain < 0 || (drain !== 0 && pc.lev > 0)) && pc.resistDrainTimer < 1) {
    if (drain < 1) {
      // The amount taken is the float 30.0 at DS:14df, not the monster's own number, which is
      // only what the message prints. Every experience drainer in the game holds -30, so the
      // two agree by luck rather than by design.
      if (pc.exp <= 30) pc.exp = 0;
      else pc.exp -= 30;
    } else {
      pc.lev -= drain;
      pc.exp = expNeeded(game, pc.lev - 1);
      for (let i = 0; i < drain; i++) goDownLevel(game);
    }
    game.events.push({ kind: 'playerSaved' });
    // DS:14e3, then DS:1500 for experience and DS:14f8 / DS:14ef for one level or several
    const lost =
      drain < 1
        ? `  YOU LOSE ${-drain} EXP. POINTS!`
        : `  YOU LOSE ${drain}` + (drain < 2 ? ' LEVEL!' : ' LEVELS!');
    // DS:150e, the line above, DS:06f0, DS:152a
    game.say('OH NO! HIT BY LIFE DRAINER!', lost, '', 'HIT ANY KEY');
    game.reprintBattleInfo = true;
  }
  if (kind.statDrain !== 0) {
    const stat = gainOrDrain(game, kind.statDrain);
    // DS:1536 / DS:1549, after the stat's own name
    const line = stat + (kind.statDrain < 0 ? ' HAS BEEN DRAINED!' : ' HAS BEEN RAISED!');
    game.events.push({ kind: 'playerSaved' });
    game.say(line);
  }
  if (kind.special !== 0) {
    if (kind.special !== 99) game.events.push({ kind: 'playerSaved' });
    if (kind.special === 1 && pc.resistPoisonTimer < 1) {
      // DS:155b 1570 157c 1596 15b3 15cf 06f0 152a
      game.say(
        'OH NO! YOU HAVE BEEN',
        '  POISONED!',
        'YOU CAN GET A CURE POISON',
        '  AT THE TEMPLE IN THE TOWN.',
        'THERE IS ALSO A CURE POISON',
        '  SPELL.',
        '',
        'HIT ANY KEY',
      );
      game.reprintBattleInfo = true;
      if (pc.poison < 1) pc.poison = 450;
    }
    if (kind.special === 2 && pc.resistDiseaseTimer < 1) {
      // DS:15d8 15f1 15fc 1596 1617 15cf 06f0 152a
      game.say(
        'OH NO! YOU HAVE CAUGHT A',
        '  DISEASE!',
        'YOU CAN GET A CURE DISEASE',
        '  AT THE TEMPLE IN THE TOWN.',
        'THERE IS ALSO A CURE DISEASE',
        '  SPELL.',
        '',
        'HIT ANY KEY',
      );
      game.reprintBattleInfo = true;
      if (pc.disease < 1) pc.disease = 450;
    }
  }
}

/**
 * defend (exe 2000:82b7, unf.c "defend"): the monster in slot `slot` attacks the player. Returns
 * the damage it did; zero is a miss, a puffball, or a monster that is asleep or held.
 *
 * The roll is a d80 plus 20 and twice the monster's level, less everything the character is
 * wearing and carrying, and every full 40 points it ends up above 32 rolls the monster type's
 * damage die. Past that the damage is worked over three more times: a floor-deep bonus, a one in
 * four chance of throwing the whole roll away for a small one, and a constitution reduction.
 *
 * The permanent plus on the armor being worn is not in the subtraction anywhere, so a permanently
 * enchanted suit of armor is worth exactly as much as a plain one. The plus is only ever printed,
 * and destroyed by acid.
 */
export function defend(game: Game, slot: number): number {
  const pc = game.pc;
  const monster = game.monsters[slot];
  const kind = game.monsterKinds[monster.type];
  if (kind.special === 6) return puffball(game, slot);
  // The two spells that stop a monster are shaken off early by the deep floors: every attack the
  // monster does not make is another roll at waking it up.
  if (pc.sleepTimer >= 1) {
    pc.sleepTimer -= 1;
    if (game.rng.random(500) < pc.level) pc.sleepTimer = 0;
    return 0;
  }
  if (pc.holdMonsterTimer >= 1) {
    pc.holdMonsterTimer -= 1;
    if (game.rng.random(500) < pc.level) pc.holdMonsterTimer = 0;
    return 0;
  }
  // srand(clock() + 100) at 2000:8313, deliberately not ported: see the README's third
  // departure. TIDBITS records that this seed never showed through anyway, because the first
  // roll below goes through Random, which reseeds again.
  const stats = game.monsterStats[kind.type];
  let chance = game.rng.random(80) + 20 + monster.level * 2;
  if (pc.cls === 2) chance -= game.rng.random(pc.iq);
  chance -= pc.lev * 2;
  chance -= pc.dex + pc.luck;
  chance -= Math.trunc(pc.dex / 2);
  chance -= pc.luckyCharms;
  chance -= game.armorHitChance[pc.armor];
  chance -= pc.tempArmorPlus;
  chance -= pc.shield;
  chance -= pc.bodyArmor;
  chance -= pc.protRing;
  chance -= pc.protection * pc.protection * 2;
  // The original sets a flag at DS:c64f here that nothing in the game ever reads back.
  let damage = 0;
  if (pc.level > 75) chance += Math.trunc((pc.level - 75) / 2);
  // The roll has to clear 32 to do any damage at all but 40 comes off for each die rolled, so a
  // roll of 33 rolls the die once and the swing after it starts 7 points in hand.
  while (chance > 32) {
    damage += game.rng.random(stats.damageDie);
    chance -= 40;
  }
  if (game.rng.random(500) < pc.level) damage += 1;
  // One attack in four throws away everything above and rolls a small number instead, which can
  // come out zero and turn a hit into a miss.
  if (game.rng.random(4) === 1) damage = game.rng.random(Math.trunc(pc.level / 2) + 3);
  if (damage > 0 && pc.level > pc.lev) {
    damage += game.rng.random(pc.level - pc.lev);
    if (pc.level > 25) damage += game.rng.random(pc.level * 4);
    if (pc.level > 100) damage += game.rng.random(pc.level * 5);
    damage += game.rng.random(monster.level);
    let toughness = 100 - pc.con;
    if (toughness < 1) toughness = 1;
    damage = Math.trunc(((toughness + 50) * damage) / 150);
    if (damage < 1) damage = 1;
    // This reads as a cap on four times the floor number, but what it writes is the floor
    // number, so the biggest hits on floor 90 come down from 361-odd to 90.
    if (damage > pc.level * 4) damage = pc.level;
  }
  if (pc.lev === 0 && damage > 3) damage = game.rng.random(3) + 1;
  if (pc.lev < 3 && damage > 6) damage = Math.trunc(damage / 2);
  // Random(2) is only rolled for a monster that has a breath weapon, so a monster without one
  // costs the sequence nothing here.
  if (kind.breath !== 0 && game.rng.random(2) !== 0) {
    damage = breathe(game, slot);
  } else {
    // DS:14ca, the monster's name, then DS:13fb with DS:14cf or DS:1402, or DS:14d6
    let line = `THE ${kind.name}`;
    if (damage > 0) line += ` DOES ${damage}` + (damage === 1 ? ' POINT' : ' POINTS');
    else line += ' MISSES!';
    game.say(line);
    if (damage > 0) drainsAndAilments(game, slot);
  }
  if (damage > 0) pc.hp -= damage;
  return damage;
}
