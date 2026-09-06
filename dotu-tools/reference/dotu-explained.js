// dotu-explained.js — the rules of Moraff's Dungeons of the Unforgiven (1993), rewritten
// as plain JavaScript that a non-programmer can follow.
//
// Every function here does the same arithmetic as the original 16-bit game (unf.exe,
// Borland C++), but with long names and one named step per line, so a calculator page
// can show *how* a number was arrived at, not just the number.  Each function also
// returns a `steps` list — the intermediate values in order — for exactly that purpose.
//
// This file is deliberately verbose.  For the compact versions used by the tools see
// dotu-mech.js (formulas), unfmap.js (dungeon generator) and dotu-files.js (file
// formats).  `node dotu-explained.js` runs a self-test that feeds the same seeded random
// numbers through this file and through dotu-mech.js / unfmap.js and checks that both
// give identical answers.
//
// Vocabulary
//   floor        the dungeon level number you are standing on (0 = town, 1..25 in Module I,
//                1..45 in Module II, ... 1..105 in Module V)
//   module       which of the five dungeons (0..4 in the code; players say I..V)
//   monsterLevel the level stored with each monster on the floor (usually floor + 15*module,
//                nudged a little)
//   characterLevel, strength, intelligence, wisdom, constitution, agility, luck  — the
//                character sheet.  The game calls agility "dex" internally.
//   characterClass  0 Fighter, 1 Worshipper, 2 Monk, 3 Wizard, 4 Priest, 5 Sage, 6 Mage
//   hardMode     the "I can handle anything" difficulty flag
//
// The original C used 16-bit integers and truncating division; `wholePart` below is C's
// integer division and `random(n)` is Borland's random(n) = a whole number from 0 to n-1.

const wholePart = Math.trunc;          // C integer division rounds toward zero

export const CLASS = { FIGHTER: 0, WORSHIPPER: 1, MONK: 2, WIZARD: 3, PRIEST: 4, SAGE: 5, MAGE: 6 };
export const CLASS_NAMES = ["Fighter", "Worshipper", "Monk", "Wizard", "Priest", "Sage", "Mage"];

// A tiny helper that records the intermediate steps of a calculation.
function makeSteps() {
  const steps = [];
  return {
    steps,
    note(label, value) { steps.push({ label, value }); return value; },
  };
}

// =====================================================================================
// 1. Random numbers — exactly what the 1993 game does
// =====================================================================================

/**
 * Borland C's random number generator.  The game uses it for everything random
 * (combat rolls, loot, monster placement).  A "seed" is a 32-bit number that is
 * scrambled on every call; the top 15 bits of the scrambled seed are the random number.
 *
 * random(n) is Borland's macro: a whole number from 0 up to n-1 (never n itself).
 * That is why "random(20) < characterLevel" is true 100% of the time at level 20.
 */
export class BorlandRandom {
  constructor(seed = 1) { this.seed = seed >>> 0; }
  /** rand(): 0..32767 */
  rand() {
    const scrambled = (Math.imul(this.seed, 0x015A4E35) + 1) >>> 0;   // seed * 22695477 + 1, mod 2^32
    this.seed = scrambled;
    return (scrambled >>> 16) & 0x7fff;                                // bits 16..30
  }
  /** random(n): 0..n-1.  Borland computes rand() * n / 32768 with 32-bit math.
   *  (The real macro still burns a rand() call when n is 0; we skip it, like dotu-mech.js,
   *  which only matters if you are trying to replay the game's exact random sequence.) */
  random(n) {
    if (n <= 0) return 0;
    return wholePart((this.rand() * n) / 0x8000);
  }
}

/** The game's `Random(n)` (capital R) re-seeds from the clock first: srand(clock()); random(n).
 *  For a calculator that is just another random number, so we model it as random(n). */

// =====================================================================================
// 2. Experience and character levels
// =====================================================================================

/**
 * How much experience the "E" screen says you need.  The game keeps one number per level:
 *   normal:     250 * 1.4^(level-1) - 80
 *   hard mode:  250 * 2^(level-1)
 * and you become level L as soon as your experience is MORE than the number for L-1.
 */
export function experienceThreshold(level, hardMode) {
  const t = makeSteps();
  const growthFactor = t.note("growth factor per level", hardMode ? 2.0 : 1.4);
  const powerOf = t.note("raised to the power (level - 1)", Math.pow(growthFactor, level - 1));
  const scaled = t.note("times 250", 250 * powerOf);
  const threshold = t.note("minus 80 on normal difficulty", hardMode ? scaled : scaled - 80);
  return { threshold, steps: t.steps };
}

/** Experience needed to REACH a given character level (threshold of the level below it). */
export function experienceToReachLevel(targetLevel, hardMode) {
  return experienceThreshold(targetLevel - 1, hardMode);
}

/**
 * Level-ups only happen when you sleep at an inn: the inn checks
 * "is experience > threshold(currentLevel)?" and raises you one level at a time until
 * it is not.  (Killing a monster only prints the hint that you could gain a level.)
 */
export function levelAfterRestingAtInn(experience, currentLevel, hardMode) {
  let level = currentLevel;
  while (experience > experienceThreshold(level, hardMode).threshold && level < 1000) level++;
  return level;
}

/**
 * Experience for killing one monster (exe 3000:a0fa):
 *   (expMultiplier + 1) * (L + 1 + 5 * 1.23^L)      where L = min(monsterLevel, 130)
 * expMultiplier is the monster's "exp" byte: 0 for an ordinary section monster, 15 for
 * every Shadow boss (so x16), 2 for garbage cans and balls (x3), 4 for poison/disease things.
 */
export function experienceForKill(monsterLevel, expMultiplierByte = 0) {
  const t = makeSteps();
  const cappedLevel = t.note("monster level, capped at 130", Math.min(monsterLevel, 130));
  const exponential = t.note("1.23 to the power of that level", Math.pow(1.23, cappedLevel));
  const baseValue = t.note("level + 1 + 5 * exponential", cappedLevel + 1 + 5 * exponential);
  const multiplier = t.note("multiplier = exp byte + 1", expMultiplierByte + 1);
  const experience = t.note("experience awarded", multiplier * baseValue);
  return { experience, steps: t.steps };
}

// =====================================================================================
// 3. What one level-up gives you (exe 3000:bd9a, go_up_level)
// =====================================================================================

/**
 * Max-HP gain is "35 + random(2*con + luck/2 + 10)" for a Fighter, and so on per class.
 * Spell-point gain is a fixed formula of wisdom and intelligence (no randomness).
 * Returns the RANGE of possible HP gains and the exact SP gain.
 */
export function levelUpGains(characterClass, constitution, luck, wisdom, intelligence) {
  const half = v => wholePart(v / 2), third = v => wholePart(v / 3), fifth = v => wholePart(v / 5);
  const table = {
    [CLASS.FIGHTER]:    { fixedHp: 35, randomHpRange: 2 * constitution + half(luck) + 10, spellPoints: 0 },
    [CLASS.WORSHIPPER]: { fixedHp: 15, randomHpRange: half(constitution) + half(luck) + 10, spellPoints: third(2 * wisdom + intelligence) },
    [CLASS.MONK]:       { fixedHp: 14, randomHpRange: half(constitution) + third(luck) + 5,  spellPoints: wholePart((wisdom + intelligence) / 13) },
    [CLASS.WIZARD]:     { fixedHp: 13, randomHpRange: third(constitution) + fifth(luck) + 4, spellPoints: fifth(wisdom + 2 * intelligence) },
    [CLASS.PRIEST]:     { fixedHp: 14, randomHpRange: half(constitution) + third(luck) + 4,  spellPoints: fifth(2 * wisdom + intelligence) },
    [CLASS.SAGE]:       { fixedHp: 55, randomHpRange: 3 * constitution + luck + 17,          spellPoints: wholePart((wisdom + intelligence) / 14) },
    [CLASS.MAGE]:       { fixedHp: 14, randomHpRange: half(constitution) + third(luck) + 7,  spellPoints: wholePart((wisdom + 2 * intelligence) / 8) },
  }[characterClass];
  const smallestHpGain = table.fixedHp;                                   // random(n) can be 0
  const largestHpGain = table.fixedHp + Math.max(0, table.randomHpRange - 1);
  return { smallestHpGain, largestHpGain, spellPointGain: table.spellPoints,
           steps: [{ label: "fixed HP", value: table.fixedHp },
                   { label: "plus random(" + table.randomHpRange + ")", value: "0.." + (table.randomHpRange - 1) },
                   { label: "spell points", value: table.spellPoints }] };
}

// =====================================================================================
// 4. How a floor is stocked with monsters (exe 2000:671e stock_level, 2000:65f8 get_mtype)
// =====================================================================================

/** Every floor gets 145 monsters.  Their level starts at floor + 15 * module. */
export const MONSTERS_PER_FLOOR = 145;

/**
 * The level written into a fresh monster: start at floor + 15*module (Module V floor 1 is
 * already level 61), then "while random(3) == 0, add random(3) - 1" — a small random walk
 * that usually does nothing — and clamp to 1..210.
 */
export function rollMonsterLevel(floor, moduleIndex, rng) {
  const t = makeSteps();
  const baseLevel = t.note("floor + 15 * module", floor + 15 * moduleIndex);
  let level = t.note("(becomes 1 if that is 221 or more)", baseLevel >= 221 ? 1 : baseLevel);
  let nudges = 0;
  while (rng.random(3) === 0) {           // one chance in three to keep nudging
    level += rng.random(3) - 1;           // -1, 0 or +1
    nudges++;
  }
  t.note("random nudges applied", nudges);
  level = t.note("clamped to 1..210", Math.max(1, Math.min(210, level)));
  return { monsterLevel: level, steps: t.steps };
}

/**
 * Which kind of monster goes into a slot.  The checks happen in this order, so the later
 * ones only get the leftovers:
 *   1 in 20  -> a puffball (type 2..13, one of the twelve colours)
 *   else 1 in 7  -> a Giant Garbage Can or a Giant Ball ("blockers")
 *   else 1 in 15 -> this section's level drainer
 *   else 1 in 12 -> a poison or disease thing (type 14..21)
 *   else         -> one of the section's three ordinary monsters (type 23..25)
 * Returns the monster TYPE INDEX (0..26) the game stores in the monster slot.
 */
export function rollMonsterKind(rng) {
  if (rng.random(20) === 0) return { kind: "puffball", typeIndex: rng.random(12) + 2 };
  if (rng.random(7) === 0)  return { kind: "blocker", typeIndex: rng.random(2) };
  if (rng.random(15) === 0) return { kind: "level drainer", typeIndex: 26 };
  if (rng.random(12) === 0) return { kind: "poison/disease", typeIndex: rng.random(8) + 14 };
  return { kind: "section monster", typeIndex: rng.random(3) + 23 };
}

/** The same odds as exact fractions, for a table (no randomness). */
export const MONSTER_KIND_ODDS = (() => {
  const puffball = 1 / 20;
  const blocker = (19 / 20) * (1 / 7);
  const drainer = (19 / 20) * (6 / 7) * (1 / 15);
  const poisonDisease = (19 / 20) * (6 / 7) * (14 / 15) * (1 / 12);
  const section = 1 - puffball - blocker - drainer - poisonDisease;
  return { puffball, blocker, drainer, poisonDisease, section, eachSectionMonster: section / 3 };
})();

/**
 * Monster hit points: two rolls of random(hpPerLevel * level + 1), averaged (plus one).
 * Shadow bosses add 20 * level, and in sections 18-20 the boss total is doubled.
 * Never below 1, never above 32,000.
 */
export function rollMonsterHitPoints(hpPerLevel, monsterLevel, isShadowBoss, sectionNumber, rng) {
  const t = makeSteps();
  const dieSize = t.note("die size = hpPerLevel * level + 1", hpPerLevel * monsterLevel + 1);
  const firstRoll = t.note("first random(die)", rng.random(dieSize));
  const secondRoll = t.note("second random(die)", rng.random(dieSize));
  let hp = t.note("(first + second + 2) / 2", wholePart((firstRoll + secondRoll + 2) / 2));
  if (isShadowBoss) {
    hp = t.note("boss bonus: + 20 * level", hp + 20 * monsterLevel);
    if (sectionNumber >= 18) hp = t.note("sections 18-20: doubled", hp * 2);
  }
  hp = t.note("clamped to 1..32000", Math.max(1, Math.min(32000, hp)));
  return { hitPoints: hp, steps: t.steps };
}

/** Floors whose slot 0 is the section's Shadow boss: 5, 10, 15, 20 times (module + 1). */
export function isBossFloor(floor, moduleIndex) {
  const stride = 5 * (moduleIndex + 1);
  return floor > 0 && floor % stride === 0 && floor <= 4 * stride;
}

// =====================================================================================
// 5. Combat
// =====================================================================================

/**
 * One swing at a monster (UNF.CPP strike(), exe 2000:7e36).
 *
 * The game builds up an "attack total", subtracts the monster's defences, and then every
 * full 40 points left over is one roll of the weapon's damage die.  Then it adds strength
 * and level bonuses.  A total of 40 or less is a miss.
 *
 * player: { characterLevel, strength, luck, luckyCharms, weaponHitBonus, gauntletBonus,
 *           weaponPlus, temporaryWeaponPlus, hardMode, weaponDamageDie }
 * monster: { level, defense, speed }       (defense/speed come from the monster type table)
 */
export function playerStrike(player, monster, floor, rng) {
  const t = makeSteps();
  let attackTotal = t.note("random(80)", rng.random(80));
  attackTotal = t.note("+ 2 * character level", attackTotal + 2 * player.characterLevel);
  attackTotal = t.note("+ strength", attackTotal + player.strength);
  if (!player.hardMode) {
    if (player.strength > 25) attackTotal = t.note("normal mode, strength over 25: + 25", attackTotal + 25);
    attackTotal = t.note("normal mode: + strength again", attackTotal + player.strength);
  }
  attackTotal = t.note("+ luck", attackTotal + player.luck);
  attackTotal = t.note("+ lucky charms", attackTotal + (player.luckyCharms || 0));
  attackTotal = t.note("+ weapon hit bonus", attackTotal + (player.weaponHitBonus || 0));
  attackTotal = t.note("+ gauntlet bonus", attackTotal + (player.gauntletBonus || 0));
  attackTotal = t.note("+ weapon plus (permanent)", attackTotal + (player.weaponPlus || 0));
  attackTotal = t.note("+ weapon plus (Enchant Weapon prep spell)", attackTotal + (player.temporaryWeaponPlus || 0));
  if (floor > 75 && rng.random(30) === 1) attackTotal = t.note("deep floor lucky hit (1 in 30): + 40", attackTotal + 40);

  attackTotal = t.note("- 2 * monster level", attackTotal - 2 * monster.level);
  attackTotal = t.note("- monster defense", attackTotal - monster.defense);
  attackTotal = t.note("- monster speed", attackTotal - monster.speed);

  let damage = 0, dieRolls = 0;
  while (attackTotal > 40) {                       // each full 40 points = one damage die
    damage += rng.random(player.weaponDamageDie);
    attackTotal -= 40;
    dieRolls++;
  }
  t.note("damage dice rolled (one per 40 points over 40)", dieRolls);
  t.note("damage from the dice", damage);
  if (damage > 0) {
    const strengthBonus = rng.random(20) < player.characterLevel
      ? rng.random(player.strength)                      // level 20+: always the full strength die
      : rng.random(wholePart(player.strength / 3));
    damage = t.note("+ strength bonus", damage + strengthBonus);
    if (damage > 0 && player.characterLevel < 5)
      damage = t.note("+ beginner bonus random(5 - level)", damage + rng.random(5 - player.characterLevel));
    damage = t.note("+ random(character level)", damage + rng.random(player.characterLevel));
  }
  return { hit: damage > 0, damage, steps: t.steps };
}

/**
 * One monster attack on the player (UNF.CPP defend(), exe 2000:82b7), without breath.
 *
 * Same idea in reverse: the monster's attack total minus your defences; every 40 points over
 * 32 is one roll of the monster's damage die.  Then a series of floor-based adjustments.
 *
 * player: { characterLevel, characterClass, intelligence, agility, luck, luckyCharms,
 *           armorClass, temporaryArmorPlus, bodyArmorSpell, protectionRing, protectionLevel,
 *           constitution }
 * monster: { level, damageDie }
 */
export function monsterAttack(player, monster, floor, rng) {
  const t = makeSteps();
  let attackTotal = t.note("random(80) + 20", rng.random(80) + 20);
  attackTotal = t.note("+ 2 * monster level", attackTotal + 2 * monster.level);
  if (player.characterClass === CLASS.MONK)
    attackTotal = t.note("monk: - random(intelligence)", attackTotal - rng.random(player.intelligence));
  attackTotal = t.note("- 2 * character level", attackTotal - 2 * player.characterLevel);
  attackTotal = t.note("- agility, - agility/2", attackTotal - player.agility - wholePart(player.agility / 2));
  attackTotal = t.note("- luck, - lucky charms", attackTotal - player.luck - (player.luckyCharms || 0));
  attackTotal = t.note("- armor class", attackTotal - player.armorClass);
  attackTotal = t.note("- armor plus (Enchant Armor prep spell)", attackTotal - (player.temporaryArmorPlus || 0));
  attackTotal = t.note("- Body Armor spell", attackTotal - (player.bodyArmorSpell || 0));
  attackTotal = t.note("- Ring of Protection spell", attackTotal - (player.protectionRing || 0));
  const prot = player.protectionLevel || 0;
  attackTotal = t.note("- 2 * protection^2 (Minor 2, Protection 8, Major 18, Ultra 32)", attackTotal - 2 * prot * prot);
  if (floor > 75) attackTotal = t.note("deep floor: + (floor - 75) / 2", attackTotal + wholePart((floor - 75) / 2));

  let damage = 0, dieRolls = 0;
  while (attackTotal > 32) { damage += rng.random(monster.damageDie); attackTotal -= 40; dieRolls++; }
  t.note("damage dice rolled (one per 40 points while over 32)", dieRolls);
  t.note("damage from the dice", damage);

  if (rng.random(500) < floor) damage = t.note("floor/500 chance: + 1", damage + 1);
  if (rng.random(4) === 1) damage = t.note("1 in 4: damage REPLACED by random(floor/2 + 3)", rng.random(wholePart(floor / 2) + 3));

  if (damage > 0 && floor > player.characterLevel) {   // only when the floor outranks you
    damage = t.note("floor above your level: + random(floor - level)", damage + rng.random(floor - player.characterLevel));
    if (floor > 25) damage = t.note("floor over 25: + random(4 * floor)", damage + rng.random(floor * 4));
    if (floor > 100) damage = t.note("floor over 100: + random(5 * floor)", damage + rng.random(floor * 5));
    damage = t.note("+ random(monster level)", damage + rng.random(monster.level));
    const toughness = Math.max(1, 100 - player.constitution);
    damage = t.note("scaled by constitution: (150 - con) * damage / 150", wholePart((toughness + 50) * damage / 150));
    if (damage < 1) damage = t.note("at least 1", 1);
    if (damage > floor * 4) damage = t.note("over 4 * floor: capped down to floor", floor);
  }
  if (player.characterLevel === 0 && damage > 3) damage = t.note("level 0: at most random(3) + 1", rng.random(3) + 1);
  if (player.characterLevel < 3 && damage > 6) damage = t.note("level 1-2: halved when over 6", wholePart(damage / 2));
  return { hit: damage > 0, damage, steps: t.steps };
}

/** Breath weapons: monsterLevel + random(monsterLevel), halved by the matching Anti-Fire / Anti-Cold. */
export function breathDamage(monsterLevel, hasMatchingResist, rng) {
  const raw = monsterLevel + rng.random(monsterLevel);
  return hasMatchingResist ? wholePart(raw / 2) : raw;
}

// =====================================================================================
// 6. What you get for a kill (exe 3000:b12d kill_monster and the routines it calls)
// =====================================================================================

/**
 * Level-drainer bonus (only when the monster's levelDrain byte is > 0):
 *   random(375) < floor + 175   -> a random stat potion
 *   otherwise                   -> the trap-door key for this depth (if 3 < floor < 179 and not owned)
 */
export function drainerKillBonus(floor, rng) {
  const roll = rng.random(375);
  if (roll < floor + 175) {
    const potion = ["green", "orange", "yellow", "red", "blue", "white"][rng.random(6)];
    return { reward: "potion", potion, roll };
  }
  if (floor > 3 && floor < 179) return { reward: "trapdoor key", keyDepth: wholePart(floor / 5) * 5, roll };
  return { reward: "nothing", roll };
}

export const WEAPON_NAMES = ["Fist", "Stick", "Club", "Mace", "Knife", "Shortsword", "Long Sword", "Great Sword"];
export const ARMOR_NAMES = ["Skin", "Leather", "Chain", "Scale", "Breast Plate", "Field Plate", "Titanium"];

/**
 * Weapon drop (exe 3000:a1fc).  Not for Monks.  Pick one of the seven weapons at random,
 * then it drops if random(100 * pick) <= monsterLevel + 10.  Great Sword is pick 7, so it
 * needs random(700) <= level + 10 — about 1.6% of the times it is picked at level 1.
 * You only receive a weapon you do not already own.
 */
export function weaponDropRoll(monsterLevel, characterClass, rng) {
  if (characterClass === CLASS.MONK) return { dropped: false, reason: "monks never find weapons" };
  const pick = rng.random(7) + 1;                       // 1 Stick .. 7 Great Sword
  const difficulty = 100 * pick;
  const roll = rng.random(difficulty);
  const dropped = roll <= monsterLevel + 10;
  return { dropped, weapon: WEAPON_NAMES[pick], roll, needed: monsterLevel + 10, outOf: difficulty };
}

/** Armor drop (exe 3000:a3d7): same shape with six armors; duplicates allowed. */
export function armorDropRoll(monsterLevel, characterClass, rng) {
  if (characterClass === CLASS.MONK) return { dropped: false, reason: "monks never find armor" };
  const pick = rng.random(6) + 1;                       // 1 Leather .. 6 Titanium
  const difficulty = 100 * pick;
  const roll = rng.random(difficulty);
  return { dropped: roll <= monsterLevel + 10, armor: ARMOR_NAMES[pick], roll, needed: monsterLevel + 10, outOf: difficulty };
}

/** Chance per kill of a specific weapon/armor: (1/7 or 1/6 to pick it) * P(random(100*pick) <= level + 10). */
export function dropChancePerKill(pick, picks, monsterLevel) {
  return (1 / picks) * Math.min(1, (monsterLevel + 11) / (100 * pick));
}

/**
 * Greater American Dollars from a kill (exe 4000:6aca).  n = floor + 1.
 * The big product random(n^2) * random(n) * random(n^2) is what makes deep floors rain money.
 */
export function moneyDrop(floor, characterClass, hardMode, rng) {
  const t = makeSteps();
  const n = floor + 1;
  let amount = 0;
  if (floor > 4) amount = t.note("random(n^2) * random(n) * random(n^2)", rng.random(n * n) * rng.random(n) * rng.random(n * n));
  if (amount === 0 && rng.random(4) === 1) amount = t.note("was 0, 1 in 4 rebate: random(200 n)", rng.random(200 * n));
  if (amount !== 0) {
    if (characterClass === CLASS.WORSHIPPER || characterClass === CLASS.WIZARD)
      amount = t.note("worshipper/wizard: + random(200 * floor)", amount + rng.random(200 * floor));
    if (floor < 5) amount = t.note("floor 1-4: + random(200 * floor)", amount + rng.random(200 * floor));
    else if (floor < 15) amount = t.note("floor 5-14: + a third", amount + wholePart(amount / 3));
    else if (floor > 16) amount = t.note("floor 17+: - a third", amount - wholePart(amount / 3));
    if (!hardMode) amount = t.note("normal difficulty: + random(7000)", amount + rng.random(7000));
    if (characterClass === CLASS.SAGE) amount = t.note("sage: tripled", amount * 3);
  }
  if (amount > 107000000) amount = t.note("over 107M: 107M - random(32000) * random(1000)", 107000000 - rng.random(32000) * rng.random(1000));
  return { dollars: amount, steps: t.steps };
}

/** After a kill: 1 in 4 chance of hp += random(11) + 4 (+ random(4) more past floor 6); 1 in 6 of +1 SP (non-fighters). */
export function postKillRecovery(floor, characterClass, rng) {
  const out = { hpGained: 0, spGained: 0 };
  if (rng.random(4) === 1) { out.hpGained = rng.random(11) + 4; if (floor > 6) out.hpGained += rng.random(4); }
  if (characterClass !== CLASS.FIGHTER && rng.random(6) === 1) out.spGained = 1;
  return out;
}

export const FIND_ITEMS = ["Nuclear hand grenade", "Stone of teleportation", "Stone of seeing", "Floor slosher",
  "Potion of healing", "Ring of regeneration", "Book of Strength", "Book of Intelligence", "Book of Wisdom",
  "Book of Constitution", "Book of Agility", "Book of Luck"];

/**
 * "YOU FIND ..." (exe 3000:b12d gate, 3000:ae27 table).  Never for Monks.  Three gates:
 *   1. Random(950 - 400 if Fighter or Sage) < floor + 40
 *   2. random(20) < floor            (always passes from floor 20 on)
 *   3. random(3) == 1 means "NOTHING", otherwise one of the twelve items, all equally likely.
 */
export function findItemRoll(floor, characterClass, rng) {
  if (characterClass === CLASS.MONK) return { found: null, reason: "monks never find items" };
  const gateSize = (characterClass === CLASS.FIGHTER || characterClass === CLASS.SAGE) ? 550 : 950;
  const gateRoll = rng.random(gateSize);
  if (!(gateRoll < floor + 40)) return { found: null, reason: "gate 1 failed", gateRoll, gateSize };
  if (!(rng.random(20) < floor)) return { found: null, reason: "gate 2 failed (floor under 20)" };
  if (rng.random(3) === 1) return { found: null, reason: "NOTHING" };
  return { found: FIND_ITEMS[rng.random(12)] };
}

/** Per-kill chance of one particular find item, as a fraction. */
export function findItemChancePerKill(floor, characterClass) {
  if (characterClass === CLASS.MONK) return 0;
  const gateSize = (characterClass === CLASS.FIGHTER || characterClass === CLASS.SAGE) ? 550 : 950;
  const gate1 = Math.min(1, (floor + 40) / gateSize);
  const gate2 = Math.min(1, floor / 20);
  const notNothing = 2 / 3;
  return gate1 * gate2 * notNothing / 12;
}

/**
 * Spell book (exe 3000:a65d).  Not for Fighters or Monks (monks already know everything).
 * Sages must also pass Random(300 - floor) <= 175 and Random(400 - floor) <= 140.
 * Book level = random(2 * floor / 3), re-rolled as random(10) if that is 10 or more;
 * book type = random(4) (0 wizard, 1 priest, 2 ?, 3 ?) with class restrictions; slot = random(3).
 * The book only matters if you do not already know that spell.
 */
export function spellbookRoll(floor, characterClass, rng) {
  if (characterClass === CLASS.FIGHTER || characterClass === CLASS.MONK) return { book: null, reason: "class never gets books" };
  if (characterClass === CLASS.SAGE) {
    if (!(rng.random(300 - floor) <= 175)) return { book: null, reason: "sage gate 1 failed" };
    if (!(rng.random(400 - floor) <= 140)) return { book: null, reason: "sage gate 2 failed" };
  }
  let level = rng.random(wholePart(2 * floor / 3));
  if (level >= 10) level = rng.random(10);
  const type = rng.random(4), slot = rng.random(3);
  const wizardBook = type === 0, priestBook = type === 1;
  if (wizardBook && (characterClass === CLASS.WORSHIPPER || characterClass === CLASS.PRIEST)) return { book: null, reason: "wizard book, priest class" };
  if (priestBook && (characterClass === CLASS.WIZARD || characterClass === CLASS.MAGE)) return { book: null, reason: "priest book, wizard class" };
  return { book: { type, level, slot } };
}

/** Highest spell level a source can produce on a floor (the game rolls random(N), so the max index is N-1). */
export function highestSpellLevelFromLoot(floor, characterClass) {
  const cap = n => Math.max(1, Math.min(10, n));
  const sage = characterClass === CLASS.SAGE, fighter = characterClass === CLASS.FIGHTER;
  return {
    book: cap(wholePart(2 * floor / 3)),
    scroll: cap(wholePart((floor + 4) / 2)),
    wand: cap(wholePart(floor / (sage ? 2 : 4))),
    paper: cap(wholePart(floor / (fighter || sage ? 2 : 6))),
  };
}

/**
 * When no book was learned, one of scroll / wand / paper is tried (random(3)).  Each needs
 * Random(350 - floor) <= 15 (a Sage's scroll gate is <= 45).  Class rules: Fighters and
 * Monks get no scrolls or wands; Monks get no papers.
 */
export function consumableRoll(floor, characterClass, rng) {
  const which = ["scroll", "wand", "paper"][rng.random(3)];
  const fighterOrMonk = characterClass === CLASS.FIGHTER || characterClass === CLASS.MONK;
  if (which !== "paper" && fighterOrMonk) return { item: null, which, reason: "class cannot use it" };
  if (which === "paper" && characterClass === CLASS.MONK) return { item: null, which, reason: "monks never get papers" };
  const gate = rng.random(350 - floor);
  const limit = (which === "scroll" && characterClass === CLASS.SAGE) ? 45 : 15;
  if (!(gate <= limit)) return { item: null, which, reason: "gate failed", gate, limit };
  const levels = highestSpellLevelFromLoot(floor, characterClass);
  const level = rng.random(levels[which]);
  if (which === "wand") return { item: { which, level, type: rng.random(3) + 1, charges: rng.random(5) + 2 } };
  return { item: { which, level, type: rng.random(4), slot: rng.random(3) } };
}

// =====================================================================================
// 7. Town
// =====================================================================================

/** Culture stock, per unit: ((level/3 + 1) * level^2 + 10) / 3. */
export function cultureStockPrice(characterLevel) {
  const t = makeSteps();
  const factor = t.note("level / 3 + 1", wholePart(characterLevel / 3) + 1);
  const squared = t.note("times level squared", factor * characterLevel * characterLevel);
  const price = t.note("(that + 10) / 3", wholePart((squared + 10) / 3));
  return { price, steps: t.steps };
}

/** Magic crystals, per unit: ((level/2 + 1) * level^2 + 10) / 3, or / 2 in hard mode. */
export function magicCrystalPrice(characterLevel, hardMode) {
  const t = makeSteps();
  const factor = t.note("level / 2 + 1", wholePart(characterLevel / 2) + 1);
  const squared = t.note("times level squared", factor * characterLevel * characterLevel);
  const price = t.note(hardMode ? "(that + 10) / 2 (hard mode)" : "(that + 10) / 3", wholePart((squared + 10) / (hardMode ? 2 : 3)));
  return { price, steps: t.steps };
}

/** "YOU SAVED N RUBLES BECAUSE YOU HAVE HELPED NEEDY CHILDREN": min(children * spent / 100, spent / 2). */
export function storeRefundForChildren(rublesSpent, childrenHelped) {
  const percentRefund = wholePart(childrenHelped * rublesSpent / 100);
  const halfPrice = wholePart(rublesSpent / 2);
  return Math.min(percentRefund, halfPrice);
}

/** A night at the inn: level^4 + 10 - level * children, never less than half of level^4 + 10. */
export function innRoomCost(characterLevel, childrenHelped) {
  const t = makeSteps();
  const fullPrice = t.note("level^4 + 10", Math.pow(characterLevel, 4) + 10);
  const discount = t.note("minus level * children helped", characterLevel * childrenHelped);
  const floorPrice = t.note("but never below half price", wholePart(fullPrice / 2));
  const cost = t.note("room cost", Math.max(fullPrice - discount, floorPrice));
  return { cost, steps: t.steps };
}

/** Culture stock eaten per stay: level^2 units.  Short of that, you age min(6, shortfall) years. */
export function innStayAging(characterLevel, cultureStockOwned, ageNow) {
  const needed = characterLevel * characterLevel;
  if (cultureStockOwned >= needed) return { yearsAged: 0, stockLeft: cultureStockOwned - needed, needed };
  const yearsAged = Math.min(6, needed - cultureStockOwned);
  const over60 = ageNow > 60;
  return { yearsAged, stockLeft: 0, needed, strengthAndConstitutionLost: over60 ? yearsAged : 0 };
}

export const TEMPLE_SERVICES = [
  { key: 1, name: "Cure wounds", price: 10, heals: "random(10) + 1" },
  { key: 2, name: "Cure serious wounds", price: 100, heals: "4 * random(45) + 10" },
  { key: 3, name: "Heal all wounds", price: 500, heals: "everything" },
  { key: 4, name: "Cure poison", price: 300 },
  { key: 5, name: "Cure disease", price: 500 },
  { key: 6, name: "Help a needy child", price: 100, effect: "children helped + 1 (inn and store discounts)" },
];

// =====================================================================================
// 8. Time — the game clock advances by whole seconds per action
// =====================================================================================

/** Body weight plus armor and weapon weight (zero while Feather is active). */
export function loadedWeight(bodyWeight, armorWeight, weaponWeight, featherActive) {
  return featherActive ? 0 : bodyWeight + armorWeight + weaponWeight;
}
/** Seconds one step takes: (100 + weight - 10 * agility) / 100 + 1, never negative inside. */
export function secondsPerMove(weight, agility) {
  return wholePart(Math.max(0, 100 + weight - 10 * agility) / 100) + 1;
}
/** Seconds one of your attacks takes: weapon speed + (85 - agility) / 5 while 85 - agility > 1. */
export function secondsPerAttack(weaponSpeed, agility) {
  const slowness = 85 - agility;
  return weaponSpeed + (slowness > 1 ? wholePart(slowness / 5) : 0);
}
/** Seconds between a monster's attacks: (85 - monster speed) / 3 + 10. */
export function secondsBetweenMonsterAttacks(monsterSpeed) {
  return wholePart((85 - monsterSpeed) / 3) + 10;
}

// =====================================================================================
// 9. Spells that depend on numbers
// =====================================================================================

/** Sleep (exe 3000:d904): random(monsterLevel) < 3, i.e. certain up to level 3, then 3/level; 25 moves. Bosses are immune. */
export function sleepMonsterChance(monsterLevel) { return monsterLevel <= 3 ? 1 : 3 / monsterLevel; }

/** Drain Monster: kills outright if monsterLevel < wisdom, otherwise monsterLevel -= wisdom (kill pays level-0 XP). */
export function drainMonster(monsterLevel, wisdom) {
  return monsterLevel < wisdom ? { killed: true } : { killed: false, newLevel: monsterLevel - wisdom };
}

/** Autokill (exe 3000:dc18): random(monsterLevel + random(speed)) < random(level + random(int + wis)) + random(floor). */
export function autokillAttempt(monsterLevel, monsterSpeed, characterLevel, intelligence, wisdom, floor, rng) {
  const monsterSide = rng.random(monsterLevel + rng.random(monsterSpeed));
  const yourSide = rng.random(characterLevel + rng.random(intelligence + wisdom)) + rng.random(floor);
  return { success: monsterSide < yourSide, monsterSide, yourSide };
}

/** Healing spells, by wisdom. */
export function cureAmounts(wisdom) {
  return {
    littleCure: wholePart(wisdom / 2),
    fastCure: wholePart(wisdom / 2),
    cure: { min: 20, max: Math.min(60, 20 + 2 * (wisdom - 1)) },
    bigCure: { min: 50, max: Math.min(150, 50 + 4 * wisdom - 1) },
    fastBigCure: { min: 20, max: Math.min(90, 20 + 4 * wisdom - 1) },
  };
}

/** Attack spells, by character level (fixed ones do not scale). */
export function attackSpellDamage(characterLevel) {
  const L = characterLevel;
  return {
    magicZap: 2 * L + 2, lightning: 4 * L + 4,
    magicZot: { min: (L + 1) * 4, max: (L + 1) * 8 }, magicBolt: { min: (L + 1) * 7, max: (L + 1) * 11 },
    minorShock: 25, magicMissile: 50, shock: 125, majorShock: 300,
    minorExplosion: { min: 75, max: 175 }, explosion: { min: 125, max: 225 }, majorExplosion: { min: 200, max: 500 },
  };
}

/** Protection spells subtract 2 * level^2 from every monster attack roll. */
export const PROTECTION_ROLL_BONUS = { none: 0, minor: 2, protection: 8, major: 18, ultra: 32 };
/** Power weapon spells replace your weapon's damage die (hit/plus/speed stay those of the held weapon). */
export const POWER_WEAPON_DIE = { minor: 69, normal: 129, major: 199 };

// =====================================================================================
// 10. The dungeon itself — no map is stored anywhere; every wall is recomputed from a hash
// =====================================================================================

export const DUNGEON_WIDTH = 80, DUNGEON_HEIGHT = 110;   // playable x 1..78, y 1..103
export const BOTTOM_FLOOR = [25, 45, 65, 85, 105];          // per module
export const WALL_PATTERNS = 25;                            // 16x16 blocks in UNFDUNG.BIN

// 16-bit helpers: the original code overflowed happily, and the maps depend on it.
const wrap16 = v => (v << 16) >> 16;
const multiply16 = (a, b) => wrap16(Math.imul(a, b));
const divide16 = (a, b) => wholePart(a / b);
const remainder16 = (a, b) => a - divide16(a, b) * b;

/**
 * myrand(x, y, floor, module, range) — the "dungeon hash" (exe 3000:81ba).
 * Same inputs always give the same output, which is why the dungeon never has to be saved:
 * doors, ladders, trap doors, chutes and shops are all "whatever the hash says here".
 */
export function dungeonHash(x, y, floor, moduleIndex, range) {
  if (x < 0 || y < 0) return 0;
  const X = wrap16(x + 9), Y = wrap16(y + 7), F = wrap16(floor + 13), M = wrap16(moduleIndex + 15);
  let v = wrap16(divide16(multiply16(X, 25), Y) + multiply16(M, 7));   // 25x/y + 7m
  v = multiply16(v, F);                                                //   ... times f
  v = wrap16(v + remainder16(multiply16(F, 27), M));                   // + (27f mod m)
  v = wrap16(v + remainder16(multiply16(Y, 31), F));                   // + (31y mod f)
  v = wrap16(v + divide16(multiply16(multiply16(X, Y), F), 17));       // + xyf/17
  v = wrap16(v + multiply16(X, 13));                                   // + 13x
  v = wrap16(v + multiply16(Y, 11));                                   // + 11y
  v = wrap16(v + multiply16(F, 17));                                   // + 17f
  const positive = v === -0x8000 ? -0x8000 : Math.abs(v);              // abs() of -32768 stays negative in C
  let r = remainder16(positive, range);
  if (r < 0) r = 0;
  if (r >= range) r = range - 1;
  return r;
}

/**
 * The wall on one side of a square (exe 3000:8360 retdwall).  sideIsNorth=false means the
 * WEST side of (x, y); true means the NORTH side.  The dungeon is tiled with 16x16-square
 * blocks; each block picks one of 25 wall patterns via the hash, and the pattern byte holds
 * two squares' worth of 2-bit side codes: 0 wall, 1 door, 2 secret door, 3 open.
 */
export function wallOnSide(patternBytes, x, y, sideIsNorth, floor, moduleIndex) {
  if (!sideIsNorth && (x < 2 || x >= 79)) return 0;
  if (sideIsNorth && (y < 1 || y >= 104)) return 0;
  const blockX = x >> 4, blockY = y >> 4;
  const pattern = dungeonHash(blockX, blockY, floor, moduleIndex, WALL_PATTERNS);
  const byteIndex = pattern * 0x200 + (blockX & 1) * 0x100 + (blockY & 1) * 0x80 + ((x >> 1) & 7) * 0x10 + (y & 0xf);
  const bitShift = (sideIsNorth ? 2 : 0) + ((x & 1) ? 4 : 0);
  return (patternBytes[byteIndex] >> bitShift) % 4;
}

/** A square is solid rock when all four sides are walls. */
export function isSolidRock(patternBytes, x, y, floor, moduleIndex) {
  return wallOnSide(patternBytes, x, y, false, floor, moduleIndex) === 0
      && wallOnSide(patternBytes, x, y, true, floor, moduleIndex) === 0
      && wallOnSide(patternBytes, x + 1, y, false, floor, moduleIndex) === 0
      && wallOnSide(patternBytes, x, y + 1, true, floor, moduleIndex) === 0;
}

/**
 * Module teleporters (exe 2000:c22d retdwall2 — present in the shipped game, commented out in
 * the recovered source): a wall side becomes a teleporter when floor < 15 (or in Module I) and
 * (x * y + floor * module) mod 128 == 1, all in 16-bit arithmetic.
 */
export function isTeleporterWall(x, y, floor, moduleIndex, wallCode) {
  if (wallCode !== 0) return false;
  if (!(floor < 15 || moduleIndex === 0)) return false;
  return remainder16(wrap16(multiply16(x, y) + multiply16(floor, moduleIndex)), 128) === 1;
}

/** A ladder exists where the hash with range 27 comes out as exactly 1 (about 1 square in 27). */
export function hasLadderSeed(x, y, floor, moduleIndex) { return dungeonHash(x, y, floor, moduleIndex, 27) === 1; }

/** Trap door: hash(range 2400) * 5 is the destination floor, if it is a valid one and not this block of five. */
export function trapDoorDestination(x, y, floor, moduleIndex) {
  const destination = dungeonHash(x, y, floor, moduleIndex, 2400) * 5;
  if (destination < 5 || destination >= wholePart(4 * BOTTOM_FLOOR[moduleIndex] / 5)) return null;
  if (wholePart(destination / 5) === wholePart(floor / 5)) return null;
  return destination;
}

/** Chute odds: hash(range max(20, 230 - floor/3)) < 5, i.e. about 5 in 230 near the top, 5 in 20 very deep. */
export function hasChuteSeed(x, y, floor, moduleIndex) {
  const range = Math.max(20, 230 - wholePart(floor / 3));
  return dungeonHash(x, y, floor, moduleIndex, range) < 5;
}

/** Where EVERY trap door to a floor lands: the first non-solid square from srand(10), srand(11), ... */
export function trapDoorLandingSquare(patternBytes, floor, moduleIndex) {
  for (let seed = 10; ; seed++) {
    const rng = new BorlandRandom(seed);
    const x = rng.random(60) + 10, y = rng.random(90) + 10;
    if (!isSolidRock(patternBytes, x, y, floor, moduleIndex)) return { x, y, seed };
  }
}

/** Which of the module's four sections a floor belongs to (0-based, 0..19 across all modules). */
export function sectionOfFloor(floor, moduleIndex) {
  const m = moduleIndex;
  if (floor > 19 * (m + 1)) return m * 4 + 3;
  return wholePart((floor - 1) / (5 * (m + 1))) + m * 4;
}

/** Town squares on floor 0: hash(range 60) of 1 store, 2 temple, 3 bank, 4 inn; anything else is nothing. */
export function townBuildingAt(x, y, moduleIndex) {
  if (x <= 0 || x >= 79 || y <= 0 || y >= 104) return null;
  const n = dungeonHash(x, y, 0, moduleIndex, 60);
  return [null, "store", "temple", "bank", "inn"][n] || null;
}

// =====================================================================================
// Self-test: same seeded random numbers into this file and into dotu-mech.js / unfmap.js
// =====================================================================================
if (typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("dotu-explained.js")) {
  const mech = await import("./dotu-mech.js");
  const map = await import("./unfmap.js");
  let failures = 0;
  const check = (name, ok) => { console.log((ok ? "ok   " : "FAIL ") + name); if (!ok) failures++; };

  check("experience to reach 7", Math.abs(experienceToReachLevel(7, false).threshold - mech.expToReach(7, false)) < 1e-9);
  check("experience to reach 20 hard", experienceToReachLevel(20, true).threshold === mech.expToReach(20, true));
  check("experience for kill 61", Math.abs(experienceForKill(61).experience - mech.expValue(61)) < 1e-6);
  check("level gains sage", (() => { const a = levelUpGains(5, 20, 10, 15, 15), b = mech.levelGain(5, 20, 10, 15, 15);
    return a.smallestHpGain === b.hp[0] && a.largestHpGain === b.hp[1] && a.spellPointGain === b.sp; })());
  check("stock price 20", cultureStockPrice(20).price === mech.stockPrice(20));
  check("crystal price 25 hard", magicCrystalPrice(25, true).price === mech.crystalPrice(25, true));
  check("inn cost 10 / 600 children", innRoomCost(10, 600).cost === mech.innCost(10, 600));
  check("monster interval", secondsBetweenMonsterAttacks(55) === mech.monsterAttackInterval(55));
  check("move seconds", secondsPerMove(400, 0) === mech.moveSeconds(400, 0));

  // combat: drive both implementations with identical random streams
  const rngA = new BorlandRandom(12345), rngB = new BorlandRandom(12345);
  let same = true;
  for (let i = 0; i < 2000 && same; i++) {
    const floor = 1 + (i % 100), lev = 1 + (i % 40);
    const p = { characterLevel: lev, strength: 20 + (i % 30), luck: 10, luckyCharms: 0, weaponHitBonus: 3, gauntletBonus: 0,
                weaponPlus: 2, temporaryWeaponPlus: 0, hardMode: i % 2 === 0, weaponDamageDie: 12 };
    const m = { level: floor + 15 * (i % 5), defense: 15, speed: 15 };
    const mine = playerStrike(p, m, floor, rngA).damage;
    const theirs = mech.strike({ lev, str: p.strength, luck: 10, luckyCharms: 0, weaponHit: 3, gauntlet: 0, weaponPlus: 2,
      tempWeaponPlus: 0, hard: p.hardMode, depth: floor, damageDie: 12 }, m, asFractionRandom(rngB));
    if (mine !== theirs) same = false;
  }
  check("playerStrike matches dotu-mech.strike over 2000 rolls", same);

  const rngC = new BorlandRandom(777), rngD = new BorlandRandom(777);
  same = true;
  for (let i = 0; i < 2000 && same; i++) {
    const floor = 1 + (i % 105), lev = i % 50;
    const p = { characterLevel: lev, characterClass: i % 7, intelligence: 20, agility: 15, luck: 8, luckyCharms: 0, armorClass: 6,
                temporaryArmorPlus: 0, bodyArmorSpell: 0, protectionRing: 0, protectionLevel: i % 5, constitution: 18 };
    const m = { level: floor + 15 * (i % 5), damageDie: 10 };
    const mine = monsterAttack(p, m, floor, rngC).damage;
    const theirs = mech.defend({ lev, cls: p.characterClass, iq: 20, dex: 15, luck: 8, luckyCharms: 0, armor: 6, tempArmorPlus: 0,
      bodyArmor: 0, protRing: 0, protection: p.protectionLevel, con: 18, depth: floor }, m, asFractionRandom(rngD));
    if (mine !== theirs) same = false;
  }
  check("monsterAttack matches dotu-mech.defend over 2000 rolls", same);

  const rngE = new BorlandRandom(99), rngF = new BorlandRandom(99);
  same = true;
  for (let i = 0; i < 2000 && same; i++) {
    const floor = 1 + (i % 105);
    if (moneyDrop(floor, i % 7, i % 3 === 0, rngE).dollars !== mech.rollMoney(floor, i % 7, i % 3 === 0, asFractionRandom(rngF))) same = false;
  }
  check("moneyDrop matches dotu-mech.rollMoney over 2000 rolls", same);

  // dungeon: hash and walls against unfmap.js
  same = true;
  for (let i = 0; i < 5000 && same; i++) {
    const x = i % 80, y = (i * 7) % 110, f = 1 + (i % 105), mI = i % 5;
    if (dungeonHash(x, y, f, mI, 27) !== map.myrand(x, y, f, mI, 27)) same = false;
    if (dungeonHash(x, y, f, mI, 2400) !== map.myrand(x, y, f, mI, 2400)) same = false;
  }
  check("dungeonHash matches unfmap.myrand", same);
  try {
    const fs = await import("fs");
    const bytes = new Uint8Array(fs.readFileSync(new URL("../data/unfdung.bin", import.meta.url)));
    const d = new map.Dungeon(bytes);
    same = true;
    for (let i = 0; i < 20000 && same; i++) {
      const x = i % 80, y = (i * 13) % 110, f = i % 26, mI = 0;
      if (wallOnSide(bytes, x, y, false, f, mI) !== d.side(x, y, 0, f, mI)) same = false;
      if (wallOnSide(bytes, x, y, true, f, mI) !== d.side(x, y, 1, f, mI)) same = false;
      const tele = isTeleporterWall(x, y, f, mI, d.side(x, y, 0, f, mI));
      if (tele !== (d.side2(x, y, 0, f, mI) === 4)) same = false;
    }
    check("wallOnSide / teleporters match unfmap.Dungeon", same);
    const land = trapDoorLandingSquare(bytes, 10, 0), land2 = d.trapdoorDest(10, 0);
    check("trap door landing square matches", land.x === land2[0] && land.y === land2[1]);
  } catch (e) { console.log("skip  wall check (../data/unfdung.bin not found: " + e.message + ")"); }

  console.log(failures ? failures + " failures" : "all checks passed");
  function asFractionRandom(rng) { return () => rng.rand() / 0x8000; }   // dotu-mech does T(frac * k); rand()*k/32768 == random(k)
}
