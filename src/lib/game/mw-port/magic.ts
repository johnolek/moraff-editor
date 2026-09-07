import data from '../mw-data.json';
import type { MwGame } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked WORLD.EXE. The comment on each say call gives the address of every line it prints,
// in order; dotu-tools/reference/scripts/exe_strings.py --ds 2bb9 reads them back.

/**
 * The weight column of the twelve weapon rows (exe DS:01c6, one every 7 bytes). `mw-data.json`
 * calls it `worth` because that is what the column looked like from the store; recomputeWeight
 * is the only thing in the game that reads it, and it reads it as a weight.
 */
const WEAPON_WEIGHTS = data.weapons.map((weapon) => weapon.worth);

/** The weight column of the seven armour rows (exe DS:0218, one every 5 bytes). */
const ARMOUR_WEIGHTS = data.armour.map((armour) => armour.worth);

/** How many moves a battle spell runs for, and how many more a second cast adds. */
const SPELL_MOVES = 60;

/**
 * The monster table (exe DS:0237, 112 rows of 35 bytes), as the bytes of each row. Every byte a
 * spell reads out of a row it reads as a signed char, which is what the Int8Array is for: the
 * two bytes autokill adds together run past 127 on several monsters.
 */
const MONSTER_ROWS = data.monsters.map((monster) => {
  const bytes = new Int8Array(monster.raw.length / 2);
  for (let at = 0; at < bytes.length; at++) {
    bytes[at] = parseInt(monster.raw.slice(at * 2, at * 2 + 2), 16);
  }
  return bytes;
});

/** Row offset 0x10, the kind, which spell_proof compares against 100. */
const MONSTER_KIND = 0x10;

/** Row offset 0x11, the hit points per floor of depth, which Drain Monster halves. */
const MONSTER_HP_PER_FLOOR = 0x11;

/**
 * Row offsets 0x13 and 0x14, which autokill adds together and rolls against the character's
 * mind. Nothing else in the game reads either byte, so neither has a name in `mw-data.json`.
 */
const MONSTER_MIND = [0x13, 0x14];

/** The kind byte of the ten monsters that refuse every battle spell. */
const SPELL_PROOF_KIND = 100;

/** What autokill writes over the hit points of a monster whose brain it explodes. */
const AUTOKILL_HP = -100;

/** say_no_monster (WORLD.EXE 2000:c28a, mw.c "say_no_monster"). */
export function sayNoMonster(game: MwGame): void {
  // DS:354f 3565 1476 20bd
  game.say('YOU ARE NOT CURRENTLY', '   ENGAGING ANY MONSTER.', '', 'HIT ANY KEY...');
}

/** say_redundant (WORLD.EXE 2000:c2b6, mw.c "say_redundant"). */
export function sayRedundant(game: MwGame): void {
  // DS:357e 3597 1476 20bd
  game.say('CASTING THIS SPELL WOULD', '   BE REDUNDANT.', '', 'HIT ANY KEY...');
}

/** say_already_cast (WORLD.EXE 2000:c2e2, mw.c "say_already_cast"). */
export function sayAlreadyCast(game: MwGame): void {
  // DS:35a8 35be 1476 20bd
  game.say('YOU HAVE ALREADY CAST', '   THIS SPELL!', '', 'HIT ANY KEY...');
}

/** say_feel_good (WORLD.EXE 2000:c97a, mw.c "say_feel_good"): what a small cure prints. */
export function sayFeelGood(game: MwGame): void {
  // DS:375e
  game.say('YOU FEEL GOOD - HIT ANY KEY');
}

/**
 * say_feel_very_good (WORLD.EXE 2000:c9a6, mw.c "say_feel_very_good"): what a big cure or a stat
 * boost prints.
 */
export function sayFeelVeryGood(game: MwGame): void {
  // DS:377a 1476 20bd
  game.say('YOU FEEL VERY GOOD!', '', 'HIT ANY KEY...');
}

/**
 * say_sixty_more_moves (WORLD.EXE 2000:cedc, mw.c "say_sixty_more_moves"): what re-casting a
 * Power Weapon or a Protection at the level already up prints.
 */
export function saySixtyMoreMoves(game: MwGame): void {
  // DS:399e 39b8 39d5 1476 20bd
  game.say(
    'YOU HAD ALREADY CAST THIS',
    '  SPELL, SO NOW IT WILL LAST',
    '  60 MOVES LONGER.',
    '',
    'HIT ANY KEY...',
  );
}

/**
 * recompute_weight (WORLD.EXE 2000:2d8e, mw.c "recompute_weight"): work out what the character is
 * carrying — their own body unless a Feather is up, then the metal stones at a pound per sixteen,
 * then the armour and the weapons they own.
 *
 * The armour loop stops at seven of the eight slots, so whatever is in the eighth is weightless;
 * the sixth stone pile is left out of the sum the same way.
 */
export function recomputeWeight(game: MwGame): void {
  const pc = game.pc;
  let body = pc.weight;
  if (pc.feather !== 0) body = 0;
  let carried = 0;
  for (let pile = 0; pile < 5; pile++) carried += Math.trunc(pc.stones[pile] / 16);
  pc.loadedWeight = carried + body;
  for (let slot = 0; slot < 7; slot++) pc.loadedWeight += pc.armorOwned[slot] * ARMOUR_WEIGHTS[slot];
  for (let slot = 0; slot < 8; slot++) pc.loadedWeight += pc.weaponsOwned[slot] * WEAPON_WEIGHTS[slot];
}

/**
 * enchant_weapon (WORLD.EXE 2000:c30e, mw.c "enchant_weapon"): the permanent Enchant Weapon,
 * which puts `plus` on one of the eight weapons the character owns.
 *
 * It sets the plus rather than adding to it, so casting Enchant Weapon Level 1 on a plus 4 sword
 * takes the sword down to plus 1. The menu lists all eight slots, naming the ones the character
 * owns with their plus and drawing the rest as eight dashes; picking a slot they own nothing in
 * does nothing at all and the spell costs nothing.
 */
export function enchantWeapon(game: MwGame, plus: number): boolean {
  const choice = game.chooseWeaponSlot();
  // Escape makes the menu hand back -1, which the original subtracts one from and uses as an
  // index, so it reads the unlabelled record byte at 0x7f rather than a weapon and would write
  // the plus at 0x8c. That byte is zero in a rolled character, so escaping cancels by accident.
  if (choice < 1) return false;
  const slot = choice - 1;
  if (game.pc.weaponsOwned[slot] < 1) return false;
  game.pc.weaponPlus[slot] = plus;
  return true;
}

/**
 * enchant_armour (WORLD.EXE 2000:c3d5, mw.c "enchant_armour"): the same menu over the eight suits
 * of armour, setting the plus of the one picked to exactly `plus`. Escaping reads the unlabelled
 * record byte at 0xae the way {@link enchantWeapon} reads 0x7f.
 */
export function enchantArmour(game: MwGame, plus: number): boolean {
  const choice = game.chooseArmorSlot();
  if (choice < 1) return false;
  const slot = choice - 1;
  if (game.pc.armorOwned[slot] < 1) return false;
  game.pc.armorPlus[slot] = plus;
  return true;
}

/**
 * raise_prep_armour (WORLD.EXE 2000:c49c, mw.c "raise_prep_armour"): the preparation Enchant
 * Armor, which comes off a monster's attack roll until the next night at an inn. It refuses a
 * level no better than the one already up, and the refusal costs nothing.
 */
export function raisePrepArmour(game: MwGame, level: number): number {
  if (level <= game.pc.enchantArmorLevel) {
    sayRedundant(game);
    return 0;
  }
  game.pc.enchantArmorLevel = level;
  return level;
}

/**
 * raise_prep_weapon (WORLD.EXE 2000:c4be, mw.c "raise_prep_weapon"): the preparation Enchant
 * Weapon, which is added to the character's own attack roll until the next night at an inn.
 */
export function raisePrepWeapon(game: MwGame, level: number): number {
  if (level <= game.pc.enchantWeaponLevel) {
    sayRedundant(game);
    return 0;
  }
  game.pc.enchantWeaponLevel = level;
  return level;
}

/**
 * raise_body_armour (WORLD.EXE 2000:c4e0, mw.c "raise_body_armour"): the permanent Body Armor,
 * which also comes off a monster's attack roll.
 */
export function raiseBodyArmour(game: MwGame, level: number): number {
  if (level <= game.pc.bodyArmorLevel) {
    sayRedundant(game);
    return 0;
  }
  game.pc.bodyArmorLevel = level;
  return level;
}

/**
 * raise_ring_protection (WORLD.EXE 2000:c502, mw.c "raise_ring_protection"): the permanent
 * Enchant Ring, whose plus comes off a monster's attack roll.
 */
export function raiseRingProtection(game: MwGame, level: number): number {
  if (level <= game.pc.ringOfProtection) {
    sayRedundant(game);
    return 0;
  }
  game.pc.ringOfProtection = level;
  return level;
}

/**
 * raise_ring_antimagic (WORLD.EXE 2000:c524, mw.c "raise_ring_antimagic"): the permanent
 * Anti-Magic Ring. Nothing in the game reads that byte back except the inventory screen, so the
 * ring does nothing at all and the spell points are simply gone.
 */
export function raiseRingAntimagic(game: MwGame, level: number): number {
  if (level <= game.pc.antiMagicRing) {
    sayRedundant(game);
    return 0;
  }
  game.pc.antiMagicRing = level;
  return level;
}

/**
 * boost_strength (WORLD.EXE 2000:cb43, mw.c "boost_strength"): the battle Strength, worth +7 for
 * 60 moves. {@link tickSpellTimers} takes the 7 back off when the timer runs out. Casting it
 * while it is running is refused and costs nothing.
 */
export function boostStrength(game: MwGame): boolean {
  if (game.pc.strengthTimer === 0) {
    game.pc.strengthTimer = SPELL_MOVES;
    game.pc.str += 7;
    sayFeelVeryGood(game);
    return true;
  }
  sayAlreadyCast(game);
  return false;
}

/** boost_agility (WORLD.EXE 2000:cb6d, mw.c "boost_agility"): the battle Speed, +7 for 60 moves. */
export function boostAgility(game: MwGame): boolean {
  if (game.pc.speedTimer === 0) {
    game.pc.speedTimer = SPELL_MOVES;
    game.pc.dex += 7;
    sayFeelVeryGood(game);
    return true;
  }
  sayAlreadyCast(game);
  return false;
}

/**
 * boost_strength_and_agility (WORLD.EXE 2000:cb97, mw.c "boost_strength_and_agility"): the
 * priestly Strength And Speed, which puts 60 moves on both timers.
 *
 * It is refused only when both are already running, and it adds the +7 to a characteristic only
 * where that timer was not running — so it is the cheap way to top either one up on its own.
 */
export function boostStrengthAndAgility(game: MwGame): boolean {
  const pc = game.pc;
  if (pc.speedTimer !== 0 && pc.strengthTimer !== 0) {
    sayAlreadyCast(game);
    return false;
  }
  pc.speedTimer += SPELL_MOVES;
  pc.strengthTimer += SPELL_MOVES;
  if (pc.speedTimer === SPELL_MOVES) pc.dex += 7;
  if (pc.strengthTimer === SPELL_MOVES) pc.str += 7;
  sayFeelVeryGood(game);
  return true;
}

/**
 * raise_power_weapon (WORLD.EXE 2000:cf08, mw.c "raise_power_weapon"): the three Power Weapon
 * spells, which swap the damage die of whatever is in hand for the die of a row further down the
 * weapon table for 60 moves. The same level again adds 60 more moves; a weaker one is refused.
 */
export function raisePowerWeapon(game: MwGame, level: number): boolean {
  const pc = game.pc;
  if (level < pc.powerWeaponLevel) {
    sayRedundant(game);
    return false;
  }
  if (pc.powerWeaponLevel === level) {
    pc.powerWeaponTimer += SPELL_MOVES;
    saySixtyMoreMoves(game);
  } else {
    pc.powerWeaponLevel = level;
    pc.powerWeaponTimer = SPELL_MOVES;
    // DS:39e8 39fe 3a1a 3a35 3a4f 1476 28ff
    game.say(
      'YOUR WEAPON BEGINS TO',
      '   SHIMMER WITH POWER. THIS',
      '   WEAPON IS AUTOMATICALLY',
      '   IN USE UNTIL THE SPELL',
      '   ENDS.',
      '',
      'HIT ANY KEY',
    );
  }
  return true;
}

/**
 * raise_protection (WORLD.EXE 2000:cf6c, mw.c "raise_protection"): the four Protection spells,
 * which take 2 × level² off a monster's attack roll for 60 moves. The same level again adds 60
 * more moves; a weaker one is refused.
 */
export function raiseProtection(game: MwGame, level: number): boolean {
  const pc = game.pc;
  if (level < pc.protectionLevel) {
    sayRedundant(game);
    return false;
  }
  if (pc.protectionLevel === level) {
    pc.protectionTimer += SPELL_MOVES;
    saySixtyMoreMoves(game);
  } else {
    pc.protectionLevel = level;
    pc.protectionTimer = SPELL_MOVES;
    // DS:3a58 3a74 3a8f 3aa9 3ac3 1476 28ff
    game.say(
      'YOUR BODY BEGINS TO SHIMMER',
      '   WITH SHIFTING COLORS OF',
      '   LIGHT. THIS PROTECTION',
      '   WILL LAST FOR 60 MOVES',
      '   OR STEPS.',
      '',
      'HIT ANY KEY',
    );
  }
  return true;
}

/**
 * resist_poison (WORLD.EXE 2000:cfd0, mw.c "resist_poison"): 60 more moves of half damage from a
 * poison attack, no chance at all of catching a new poison, and the poison already carried
 * stopping its count down. It never refuses, so it always costs.
 */
export function resistPoison(game: MwGame): boolean {
  game.pc.resistPoisonTimer += SPELL_MOVES;
  // DS:3ad0 3aea 3b01 1476 28ff
  game.say(
    'YOU FEEL A WARMTH IN YOUR',
    '   BLOOD AS THE RESIST',
    '   POISON TAKES EFFECT.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/** resist_disease (WORLD.EXE 2000:d006, mw.c "resist_disease"): the same 60 moves for disease. */
export function resistDisease(game: MwGame): boolean {
  game.pc.resistDiseaseTimer += SPELL_MOVES;
  // DS:3b19 3b35 3b4b 1476 28ff
  game.say(
    'YOU FEEL A TINGLING IN YOUR',
    '   BODY AS THE RESIST',
    '   DISEASE TAKES EFFECT.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/**
 * anti_cold (WORLD.EXE 2000:d03c, mw.c "anti_cold"): 60 more moves of half damage from a cold
 * attack, which is all it does — it does not prevent one.
 */
export function antiCold(game: MwGame): boolean {
  game.pc.antiColdTimer += SPELL_MOVES;
  // DS:3b64 3b7f 3b95 3bab 1476 28ff
  game.say(
    'YOU FEEL A WARM FEELING AS',
    '   YOUR BODY PREPARES',
    '   FOR AN ICE ATTACK.',
    '   SPELL WILL LAST 60 MOVES.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/** anti_fire (WORLD.EXE 2000:d072, mw.c "anti_fire"): the same 60 moves for a fire attack. */
export function antiFire(game: MwGame): boolean {
  game.pc.antiFireTimer += SPELL_MOVES;
  // DS:3bc8 3b7f 3be3 3bab 1476 28ff
  game.say(
    'YOU FEEL A COOL FEELING AS',
    '   YOUR BODY PREPARES',
    '   FOR A FIRE ATTACK.',
    '   SPELL WILL LAST 60 MOVES.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/**
 * resist_drain (WORLD.EXE 2000:d0a8, mw.c "resist_drain"): 60 more moves in which a level drain
 * is blocked outright.
 */
export function resistDrain(game: MwGame): boolean {
  game.pc.resistDrainTimer += SPELL_MOVES;
  // DS:3bf9 3c0d 3c27 3c43 1476 28ff
  game.say(
    'YOU FEEL A HEAVENLY',
    '   PRESENCE AS THE FORCES',
    '   OF GOOD GATHER TO DEFEND',
    '   YOU AGAINST LEVEL DRAIN.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/**
 * explosion (WORLD.EXE 2000:c9d2, mw.c "explosion"): the three explosion spells, `size` 0 for
 * Minor, 1 for Explosion and 2 for Major, doing 75 to 175, 125 to 225 and 200 to 500.
 *
 * The original reuses its own argument as the damage, testing it against 0, 1 and 2 in three
 * separate ifs after the roll has already overwritten it. Every roll lands well above 2, so no
 * spell is rolled twice, and this port keeps the cascade as it stands.
 */
export function explosion(game: MwGame, size: number): boolean {
  if (game.engaged === -1) {
    sayNoMonster(game);
    return false;
  }
  let headline = '';
  // DS:378e 37a7 37c0
  if (size === 0) headline = 'A SMALL EXPLOSION OCCURS';
  if (size === 1) headline = 'A LARGE EXPLOSION OCCURS';
  if (size === 2) headline = 'A HUGE EXPLOSION OCCURS';
  // The engaged check stands here a second time, unchanged.
  if (game.engaged === -1) {
    sayNoMonster(game);
    return false;
  }
  let damage = size;
  if (damage === 0) damage = game.rng.random(101) + 75;
  if (damage === 1) damage = game.rng.random(101) + 125;
  if (damage === 2) damage = game.rng.random(301) + 200;
  game.monsters[game.engaged].hp -= damage;
  // DS:37ef 3809 37d8 381f 1476 28ff
  game.say(
    headline,
    '   ON THE GROUND DIRECTLY',
    '   BELOW THE MONSTER.',
    `   THE EXPLOSION DOES ${damage}`,
    '   POINTS OF DAMAGE.',
    '',
    'HIT ANY KEY',
  );
  return true;
}

/**
 * sleep_monster (WORLD.EXE 2000:caba, mw.c "sleep_monster"): Sleep, which puts the engaged
 * monster out for ten of its own turns when `random(its depth)` comes out 0 — so the chance is
 * one in its depth. Anything else prints "THE SPELL FAILS." and the spell still costs.
 *
 * The redundancy test asks whether the sleep timer is exactly 1, which is only true on the last
 * turn of a sleep already running, so re-casting it at any other point rolls again.
 */
export function sleepMonster(game: MwGame): boolean {
  if (game.engaged === -1) {
    sayNoMonster(game);
    return false;
  }
  if (game.pc.sleepTimer === 1) {
    sayRedundant(game);
    return false;
  }
  if (game.rng.random(game.monsters[game.engaged].depth) === 0) {
    game.pc.sleepTimer = 10;
    // DS:3834
    game.monsterStatusLine = 'MONSTER IS SLEEPING';
  } else {
    // DS:3848 1476 28ff
    game.say('THE SPELL FAILS.', '', 'HIT ANY KEY');
  }
  return true;
}

/**
 * spell_proof (WORLD.EXE 2000:cc66, mw.c "spell_proof"): whether the engaged monster is one of
 * the ten whose kind byte is 100 — ZEUS, the DEVIL and the eight quest bosses — which no battle
 * spell that singles a monster out will touch.
 *
 * The two Hold Monster cases ask this before they check that a monster is engaged at all, and
 * the original then reads the six bytes in front of the monster list. There is nothing in front
 * of the list here, so the port answers no and the Hold goes on to its own engaged check.
 */
export function spellProof(game: MwGame): boolean {
  if (game.engaged === -1) return false;
  const kind = MONSTER_ROWS[game.monsters[game.engaged].type][MONSTER_KIND];
  if (kind === SPELL_PROOF_KIND) {
    // DS:3859 3876 3892 38ac 38c7 38e2 38fb 28ff
    game.say(
      '  WHEN YOU BEGIN TO CAST THE',
      'SPELL THE MONSTER STOPS YOU',
      "AND SAYS, 'NO. THAT SILLY",
      "SPELL DOESTN'T WORK ON ME.",
      'TRY SOMETHING ELSE WHILE I',
      'TEAR YOUR LIMBS FROM ONE',
      'ANOTHER. HEE HEE HEE.',
      'HIT ANY KEY',
    );
    return true;
  }
  return false;
}

/**
 * autokill (WORLD.EXE 2000:cdc5, mw.c "autokill"): the brain explosion. The monster rolls
 * `random(random(the two unnamed bytes of its table row added) + its depth)`, the character rolls
 * `random(level + random(intelligence + wisdom)) + random(the floor)`, and the bigger roll wins.
 * A win writes −100 over the monster's hit points; a loss prints and still costs the points.
 */
export function autokill(game: MwGame): boolean {
  if (game.engaged === -1) {
    sayNoMonster(game);
    return false;
  }
  if (spellProof(game)) return false;
  const monster = game.monsters[game.engaged];
  const row = MONSTER_ROWS[monster.type];
  let theirs = game.rng.random(row[MONSTER_MIND[0]] + row[MONSTER_MIND[1]]);
  theirs = game.rng.random(monster.depth + theirs);
  let mine = game.rng.random(game.pc.iq + game.pc.wis);
  mine = game.rng.random(game.pc.lev + mine);
  const luck = game.rng.random(game.pc.floor);
  if (theirs < mine + luck) {
    monster.hp = AUTOKILL_HP;
    // DS:3911 392e 394a 3966 1476 28ff
    game.say(
      "THE MONSTER'S BRAIN EXPLODES",
      '   FROM ULTRA-INTENSE BRAIN',
      '   WAVES WHICH EMINATE FROM',
      '   YOUR MIND.',
      '',
      'HIT ANY KEY',
    );
    return true;
  }
  // DS:3974 3992 1476 20bd
  game.say('THE SPELL FAILS... TOUGH LUCK', '   CHARLIE.', '', 'HIT ANY KEY...');
  return true;
}

/**
 * drain_monster (WORLD.EXE 2000:d0de, mw.c "drain_monster"): Drain Monster, which takes the
 * character's wisdom off the engaged monster's depth. A monster shallower than that wisdom has
 * both its depth and its hit points set to zero, so the spell simply kills it; a deeper one also
 * loses half its hit points per floor, times the wisdom, in health.
 *
 * It prints nothing at all: the only sign it worked is the monster's own line changing.
 */
export function drainMonster(game: MwGame): boolean {
  if (game.engaged === -1) {
    sayNoMonster(game);
    return false;
  }
  if (spellProof(game)) return false;
  const monster = game.monsters[game.engaged];
  if (monster.depth < game.pc.wis) {
    monster.depth = 0;
    monster.hp = 0;
  } else {
    // The depth is one byte of the monster's record.
    monster.depth = (monster.depth - game.pc.wis) & 0xff;
    const perFloor = MONSTER_ROWS[monster.type][MONSTER_HP_PER_FLOOR];
    monster.hp -= Math.trunc(perFloor / 2) * game.pc.wis;
  }
  return true;
}
