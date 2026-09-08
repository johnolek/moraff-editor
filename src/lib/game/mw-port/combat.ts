import data from '../mw-data.json';
import {
  armorFind,
  ballOfThought,
  cupOfHealth,
  moneyFind,
  paperFind,
  scrollFind,
  specialFind,
  spellbookFind,
  wandFind,
  weaponFind,
} from './drops';
import { HINT, loadHBin } from './hints';
import { canLevelUp, experienceNeeded, goDownLevel } from './levels';
import type { MwGame } from './state';
import {
  MW_SQUARE_EMPTY,
  MW_SQUARE_PLAYER,
  mwClearMessageLine,
  mwMessageLine,
  mwOccupantAt,
  mwSetOccupant,
} from './state';
import { MONSTER_SLOTS } from './stocking';

/**
 * The fight: the character's swing, the monster's turn, the monsters' step towards the character
 * and the clock that decides how many turns they get while the character acts.
 *
 * The message text is the exact bytes of the game's own strings, read out of the data segment of
 * the unpacked executable; the comment on each say call gives the address of every line it
 * prints, in order.
 *
 * The port never reseeds the random number generator, which is the third of the departures the
 * `../port/README.md` sets out: `strike` reseeds from the BIOS tick count and `monster_turn`
 * from the tick count plus a hundred, and the port calls nothing there.
 *
 * Moraff's World keeps no separate per-type stats table the way Dungeons of the Unforgiven does,
 * so one monster row does every job: the byte at 0x16 is taken off the character's swing *and*
 * is the monster's speed, which sets how often it attacks.
 */

const MONSTERS = data.monsters;
const WEAPONS = data.weapons;
const ARMOUR = data.armour;

/** The special byte at 0x10: 1 poisons, 2 diseases, 6 is a puffball, 99 is ordinary. */
const PUFFBALL = 6;
const POISONS = 1;
const DISEASES = 2;
const ORDINARY = 99;

/** The moves an affliction runs for before it bites, and again after it has. */
const AFFLICTION_MOVES = 450;

/** A swing past this floor can roll a bonus, and a monster's attack gets one outright. */
const DEEP_FLOOR = 75;

/** Eight rows into the weapon table is POWER WEAPON 1, which is where the spell aims. */
const FIRST_POWER_WEAPON = 8;

/**
 * puffball_stat (WORLD.EXE 2000:603f, mw.c "puffball_stat"): move one of the six characteristics
 * by `amount`, which the monster table holds as -6..-1 to drain and 1..6 to raise.
 *
 * Which characteristic it is comes from the size of the number, and how far it moves from the
 * number itself divided by that same size — so every one of the twelve values moves its
 * characteristic by exactly one point. The original leaves the name in the shared string buffer
 * at DS:cb52 for its caller to finish the sentence with; the port hands it back instead, and a
 * number outside the twelve gives the empty string.
 */
export function puffballStat(game: MwGame, amount: number): string {
  const pc = game.pc;
  switch (Math.abs(amount)) {
    case 1:
      pc.str += amount;
      return 'STRENGTH'; // DS:2735
    case 2:
      pc.iq += Math.trunc(amount / 2);
      return 'INTELLIGENCE'; // DS:273e
    case 3:
      pc.wis += Math.trunc(amount / 3);
      return 'WISDOM'; // DS:274b
    case 4:
      pc.con += Math.trunc(amount / 4);
      return 'CONSTITUTION'; // DS:2752
    case 5:
      pc.dex += Math.trunc(amount / 5);
      return 'DEXTERITY'; // DS:275f
    case 6:
      pc.luck += Math.trunc(amount / 6);
      return 'LUCK'; // DS:2769
  }
  return '';
}

/** Which way the monster in `slot` lies from the character, as the message names it. */
function bearing(game: MwGame, slot: number): string {
  const pc = game.pc;
  const monster = game.monsters[slot];
  // DS:26ee 26f4 26fa 2701, each with the trailing space the next word is written after
  if (monster.x < pc.x) return 'WEST ';
  if (pc.x < monster.x) return 'EAST ';
  if (monster.y < pc.y) return 'NORTH ';
  if (pc.y < monster.y) return 'SOUTH ';
  // Nothing can stand on the character's own square, so the original never reaches this and
  // would print whatever was left in the shared string buffer if it did.
  return '';
}

/**
 * strike (WORLD.EXE 2000:5bef, mw.c "strike"): one swing at the monster the character is
 * engaging. Returns the damage it did; zero is a miss.
 *
 * The roll is a d80 plus everything the character brings, less twice the monster's depth and the
 * three bytes of its row the table gives it for defence. Every full 40 points the roll ends up
 * above 40 rolls the weapon's damage die once, so a big enough roll hits several times over.
 *
 * A Power Weapon spell writes 1, 2 or 3, and eight rows into the weapon table is the row labelled
 * POWER WEAPON 1, so Power Weapon I swings the 129 die of POWER WEAPON 2 and Power Weapon III
 * swings the 399 die of POWER WEAPON 4, which no spell is supposed to reach. The to-hit bonus and
 * the plus still come from the weapon in hand.
 *
 * On floors 1 to 4 the hit is announced on a line of its own and the damage line says "TAKES";
 * deeper than that both go, and the line reads "WEST 12 POINTS DAMAGE".
 */
export function strike(game: MwGame): number {
  const pc = game.pc;
  // The original sets a flag at DS:cd2e here that nothing in the game ever reads back.
  let die = pc.weapon;
  if (pc.powerWeaponLevel !== 0) die = pc.powerWeaponLevel + FIRST_POWER_WEAPON;
  // srand(clock_ticks()) at 2000:5c14, deliberately not ported.
  const monster = game.monsters[game.engaged];
  const kind = MONSTERS[monster.type];
  let chance =
    game.rng.random(80) +
    pc.lev * 2 +
    pc.str +
    pc.luck +
    pc.unread7c7 +
    WEAPONS[pc.weapon].toHit +
    pc.gauntlet +
    pc.weaponPlus[pc.weapon] +
    pc.enchantWeaponLevel;
  if (pc.floor > DEEP_FLOOR && game.rng.random(30) === 1) chance += 40;
  chance -= monster.depth * 2 + kind.defence + kind.extraDefence + kind.defenceAndAttack;
  let damage = 0;
  while (chance > 40) {
    damage += game.rng.random(WEAPONS[die].damageDie);
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
  game.eraseScreen();
  if (damage < 1) {
    game.say('YOU MISSED THE MONSTER'); // DS:271e
  } else {
    // DS:26d2, on its own line above the damage
    if (pc.floor < 5) game.say('YOU HIT! THE MONSTER IN THE');
    let line = bearing(game, game.engaged);
    if (pc.floor < 5) line += 'TAKES '; // DS:2708
    // The damage, then DS:270f
    game.say(`${line}${damage} POINTS DAMAGE`);
  }
  // The original writes through the pointer at DS:cd28, which attack_timing aims at the engaged
  // monster's hit points at the same moment it writes the slot number this function reads.
  monster.hp -= damage;
  return damage;
}

/**
 * The puffball half of monster_turn (WORLD.EXE 2000:615c, mw.c "monster_turn"): a monster whose
 * special byte is 6 does not attack at all. It moves one of the six characteristics by a point
 * and disappears.
 */
function puffball(game: MwGame, slot: number): number {
  const monster = game.monsters[slot];
  const amount = MONSTERS[monster.type].statDrain;
  const stat = puffballStat(game, amount);
  game.eraseScreen();
  // DS:276e / DS:2784, after the characteristic's own name
  game.say(stat + (amount < 0 ? ' DRAINED BY PUFFBALL!' : ' RAISED BY PUFFBALL!'));
  mwSetOccupant(game, monster.x, monster.y, MW_SQUARE_EMPTY);
  // The slot is not freed. It is left holding a depth 0 monster of type 0 — an OGRE
  // at (100, 100), off the right edge of an 80-wide floor. The occupancy grid is one unchecked
  // run of 80 * 110 bytes, so whenever it is rebuilt from the monster list that can lands at
  // byte 8100, the square (20, 101).
  monster.x = 100;
  monster.y = 100;
  monster.hp = 0;
  monster.type = 0;
  monster.depth = 0;
  game.redrawView = true;
  return 0;
}

/**
 * The breath half of monster_turn (WORLD.EXE 2000:615c, mw.c "monster_turn"): half the time, a
 * monster whose row names a breath weapon breathes it instead of swinging, and the damage worked
 * out above is thrown away for `depth + random(depth)`, halved by the matching resistance.
 *
 * Acid has no resistance and does something worse instead: it destroys the armor being worn, plus
 * and all, and leaves the character in their skin.
 */
function breathe(game: MwGame, slot: number): number {
  const pc = game.pc;
  const monster = game.monsters[slot];
  const breath = MONSTERS[monster.type].breath;
  const lines = ['', '', '', '', '', '', '', ''];
  // DS:2799, then DS:27af 27b4 27b8 27bd 27ca for the five kinds
  lines[0] = 'THE MONSTER BREATHES ';
  if (breath === 1) lines[0] += 'FIRE';
  if (breath === 2) lines[0] += 'ICE';
  if (breath === 3) lines[0] += 'ACID';
  if (breath === 4) lines[0] += 'GREEN PHLEGM';
  if (breath === 5) lines[0] += 'BLACK SLIME';
  let damage = monster.depth + game.rng.random(monster.depth);
  if (breath === 1 && pc.antiFireTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 2 && pc.antiColdTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 4 && pc.resistDiseaseTimer > 0) damage = Math.trunc(damage / 2);
  if (breath === 5 && pc.resistPoisonTimer > 0) damage = Math.trunc(damage / 2);
  // DS:27d6 with the damage and DS:2375 on the end, then DS:27e9
  lines[1] = `  ON YOU. IT DOES ${damage} POINTS`;
  lines[2] = '  OF DAMAGE TO YOU.';
  if (breath === 1 && pc.antiFireTimer < 1) lines[3] = 'YOU FEEL TOASTED.'; // DS:27fd
  if (breath === 2 && pc.antiColdTimer < 1) lines[3] = 'YOU FEEL CHILLED.'; // DS:280f
  if (breath === 3 && pc.armor !== 0) {
    lines[3] = 'THE ACID DISOLVES YOUR ARMOR'; // DS:2821, the game's own spelling
    pc.armorPlus[pc.armor] = 0;
    pc.armorOwned[pc.armor] -= 1;
    pc.armor = 0;
  }
  if (breath === 4 && pc.resistDiseaseTimer < 1) {
    if (pc.diseaseTimer < 1) pc.diseaseTimer = AFFLICTION_MOVES;
    game.events.push({ kind: 'playerSaved' });
    // DS:283e 285b
    lines[3] = 'YOU FEEL VERY SICK. YOU NEED';
    lines[4] = '  A CURE DISEASE SPELL.';
  }
  if (breath === 5 && pc.resistPoisonTimer < 1) {
    if (pc.poisonTimer < 1) pc.poisonTimer = AFFLICTION_MOVES;
    game.events.push({ kind: 'playerSaved' });
    // DS:2873 288e
    lines[3] = 'YOU FEEL KIND OF WEAK. YOU';
    lines[4] = '  MIGHT GET A CURE POISON.';
  }
  game.say(...lines);
  return damage;
}

/**
 * What a hit brings with it, in monster_turn (WORLD.EXE 2000:615c, mw.c "monster_turn"): the
 * level drain, the characteristic drain, and the poison and disease. None of it happens on a
 * miss, and the breath weapon skips all of it.
 *
 * Unlike Dungeons of the Unforgiven, there is no experience drain here: a negative number in the
 * level drain byte would put levels *on* the character and roll none of them, so the loop that
 * takes the hit points back never runs. Nothing in the table holds one.
 *
 * The line the characteristic drain leaves in the shared string buffer is printed twice, once
 * inside its own block and once by the print at the end of the attack; the port hands the buffer
 * back so the caller can print it again the same way.
 */
function drainsAndAilments(game: MwGame, slot: number): string {
  const pc = game.pc;
  const kind = MONSTERS[game.monsters[slot].type];
  let buffer = '';
  if (kind.levelDrain !== 0 && pc.lev > 0 && pc.resistDrainTimer < 1) {
    pc.lev -= kind.levelDrain;
    pc.exp = experienceNeeded(pc.lev - 1);
    for (let lost = 0; lost < kind.levelDrain; lost++) goDownLevel(game);
    game.events.push({ kind: 'playerSaved' });
    // DS:28c5 with the count, then DS:28da or DS:28d1
    const lost = `  YOU LOSE ${kind.levelDrain}` + (kind.levelDrain < 2 ? ' LEVEL!' : ' LEVELS!');
    // DS:28e2, the line above, an empty line, DS:28ff
    game.say('OH NO! HIT BY LEVEL DRAINER!', lost, '', 'HIT ANY KEY');
  }
  if (kind.statDrain !== 0) {
    const stat = puffballStat(game, kind.statDrain);
    // DS:290b / DS:291e, after the characteristic's own name
    buffer = stat + (kind.statDrain < 0 ? ' HAS BEEN DRAINED!' : ' HAS BEEN RAISED!');
    game.events.push({ kind: 'playerSaved' });
    game.say(buffer);
  }
  if (kind.kind !== 0) {
    if (kind.kind !== ORDINARY) game.events.push({ kind: 'playerSaved' });
    if (kind.kind === POISONS && pc.resistPoisonTimer < 1) {
      // DS:2930 2945 2951 296b 2988 29a4, an empty line, DS:28ff
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
      if (pc.poisonTimer < 1) pc.poisonTimer = AFFLICTION_MOVES;
    }
    if (kind.kind === DISEASES && pc.resistDiseaseTimer < 1) {
      // DS:29ad 29c6 29d1 296b 29ec 29a4, an empty line, DS:28ff
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
      if (pc.diseaseTimer < 1) pc.diseaseTimer = AFFLICTION_MOVES;
    }
  }
  return buffer;
}

/**
 * monster_turn (WORLD.EXE 2000:615c, mw.c "monster_turn"): the monster in `slot` attacks the
 * character. Returns the damage it did; zero is a miss, a puffball, or a character the monster
 * is asleep beside.
 *
 * The roll is a d80 plus twice the monster's depth and the two bytes of its row that go into an
 * attack, less everything the character is wearing and carrying, and every full 40 points it ends
 * up above 32 rolls the monster's damage die. Past that the damage is worked over three more
 * times: a floor-deep bonus, a one in four chance of throwing the whole roll away for a small
 * one, and a constitution reduction.
 *
 * A Monk *adds* a roll on their own intelligence to the monster's chance of hitting them, where
 * Dungeons of the Unforgiven takes the same roll off it. It is the only place in either game
 * where the two differ by a sign.
 *
 * Sleep and Hold Monster are counted here in the monster's turns rather than in moves, and every
 * turn the monster does not get is another roll at shaking the spell off — the deeper the floor,
 * the likelier that roll is to land.
 */
export function monsterTurn(game: MwGame, slot: number): number {
  const pc = game.pc;
  const monster = game.monsters[slot];
  const kind = MONSTERS[monster.type];
  if (kind.kind === PUFFBALL) return puffball(game, slot);
  if (pc.sleepTimer >= 1) {
    pc.sleepTimer -= 1;
    if (game.rng.random(500) < pc.floor) pc.sleepTimer = 0;
    return 0;
  }
  if (pc.holdMonsterTimer >= 1) {
    pc.holdMonsterTimer -= 1;
    if (game.rng.random(500) < pc.floor) pc.holdMonsterTimer = 0;
    return 0;
  }
  // srand(clock_ticks() + 100) at 2000:61c0, deliberately not ported.
  let chance = game.rng.random(80) + monster.depth * 2 + kind.attack + kind.defenceAndAttack;
  if (pc.cls === 2) chance += game.rng.random(pc.iq);
  chance -= pc.lev * 2;
  chance -= pc.dex + pc.luck;
  chance -= pc.unread7c7;
  chance -= ARMOUR[pc.armor].armourClass;
  chance -= pc.enchantArmorLevel;
  chance -= pc.unread0dd;
  chance -= pc.bodyArmorLevel;
  chance -= pc.ringOfProtection;
  chance -= pc.protectionLevel * pc.protectionLevel * 2;
  if (pc.floor > DEEP_FLOOR) chance += Math.trunc((pc.floor - DEEP_FLOOR) / 2);
  let damage = 0;
  // The roll has to clear 32 for the first die but 40 comes off for each one, so 33 rolls the
  // die once, 73 rolls it twice, and every 40 points after that rolls it again.
  while (chance > 32) {
    damage += game.rng.random(kind.damageDie);
    chance -= 40;
  }
  if (game.rng.random(500) < pc.floor) damage += 1;
  // One attack in four throws away everything above and rolls a small number instead, which can
  // come out zero and turn a hit into a miss.
  if (game.rng.random(4) === 1) damage = game.rng.random(Math.trunc(pc.floor / 2) + 3);
  if (damage > 0 && pc.lev < pc.floor) {
    damage += game.rng.random(pc.floor - pc.lev);
    if (pc.floor > 25) damage += game.rng.random(pc.floor * 4);
    if (pc.floor > 100) damage += game.rng.random(pc.floor * 5);
    const depthRoll = game.rng.random(monster.depth);
    let toughness = 100 - pc.con;
    if (toughness < 1) toughness = 1;
    damage = Math.trunc(((toughness + 50) * (damage + depthRoll)) / 150);
    if (damage < 1) damage = 1;
  }
  if (pc.lev === 0 && damage > 4) damage = game.rng.random(4) + 1;
  // Random(2) is only rolled for a monster that has a breath weapon, so a monster without one
  // costs the sequence nothing here.
  if (kind.breath !== 0 && game.rng.random(2) !== 0) {
    damage = breathe(game, slot);
  } else {
    game.eraseScreen();
    // The bearing, then DS:28a9 for a level 0 character, then DS:28b9 or DS:27e3 with the
    // damage and DS:28b2 or DS:2375
    let line = bearing(game, slot);
    if (pc.lev === 0) line += 'MONSTER ';
    if (damage < 1) line += 'MISSES YOU!';
    else line += `DOES ${damage}` + (damage === 1 ? ' POINT' : ' POINTS');
    game.say(line);
    const buffer = damage > 0 ? drainsAndAilments(game, slot) : '';
    // The original prints the shared string buffer again here, so a characteristic drain's line
    // goes up twice and everything else prints nothing.
    game.say(buffer);
  }
  if (damage > 0) pc.hp -= damage;
  return damage;
}

/**
 * tick_spell_timers (WORLD.EXE 2000:7e4f, mw.c "tick_spell_timers"): count every spell timer
 * down by `moves` and undo what expires.
 *
 * The two that lent the character seven points give them back when they run out. Power Weapon
 * and Protection each clear the level beside their timer, which is the only thing that ever
 * does; a level left standing over a zero timer stays until a night at the inn.
 */
export function tickSpellTimers(game: MwGame, moves: number): void {
  const pc = game.pc;
  if (pc.slowEnemiesTimer > 0) {
    pc.slowEnemiesTimer -= moves;
    if (pc.slowEnemiesTimer < 0) pc.slowEnemiesTimer = 0;
  }
  if (pc.strengthTimer > 0) {
    if (moves < pc.strengthTimer) pc.strengthTimer -= moves;
    else {
      pc.strengthTimer = 0;
      pc.str -= 7;
    }
  }
  if (pc.speedTimer > 0) {
    if (moves < pc.speedTimer) pc.speedTimer -= moves;
    else {
      pc.speedTimer = 0;
      pc.dex -= 7;
    }
  }
  if (pc.powerWeaponTimer > 0) {
    pc.powerWeaponTimer -= moves;
    if (pc.powerWeaponTimer < 1) {
      pc.powerWeaponLevel = 0;
      pc.powerWeaponTimer = 0;
    }
  }
  if (pc.protectionTimer > 0) {
    pc.protectionTimer -= moves;
    if (pc.protectionTimer < 1) {
      pc.protectionLevel = 0;
      pc.protectionTimer = 0;
    }
  }
  if (pc.antiFireTimer > 0) {
    pc.antiFireTimer -= moves;
    if (pc.antiFireTimer < 0) pc.antiFireTimer = 0;
  }
  if (pc.antiColdTimer > 0) {
    pc.antiColdTimer -= moves;
    if (pc.antiColdTimer < 0) pc.antiColdTimer = 0;
  }
  if (pc.resistDrainTimer > 0) {
    pc.resistDrainTimer -= moves;
    if (pc.resistDrainTimer < 0) pc.resistDrainTimer = 0;
  }
  if (pc.resistPoisonTimer > 0) {
    pc.resistPoisonTimer -= moves;
    if (pc.resistPoisonTimer < 0) pc.resistPoisonTimer = 0;
  }
  if (pc.resistDiseaseTimer > 0) {
    pc.resistDiseaseTimer -= moves;
    if (pc.resistDiseaseTimer < 0) pc.resistDiseaseTimer = 0;
  }
  // Both of these wipe the line printed beside the monster when they run out.
  if (pc.sleepTimer > 0) {
    if (moves < pc.sleepTimer) pc.sleepTimer -= moves;
    else {
      pc.sleepTimer = 0;
      game.monsterStatusLine = '';
    }
  }
  if (pc.holdMonsterTimer > 0) {
    if (moves < pc.holdMonsterTimer) pc.holdMonsterTimer -= moves;
    else {
      pc.holdMonsterTimer = 0;
      game.monsterStatusLine = '';
    }
  }
}

/** How close a monster has to be before it starts walking towards the character. */
function chaseRange(floor: number): number {
  return Math.trunc(floor / 10) + 10;
}

/**
 * monsters_move (WORLD.EXE 2000:81cd, mw.c "monsters_move"): one move of the world.
 *
 * Every spell timer counts down by one, the poison and the disease each get a move closer to
 * biting, and then all 145 monsters take a step towards the character — the ones close enough,
 * one time in five staying put. A monster steps west, east, north or south in that order, into
 * the first of those that is neither out through a wall nor already taken.
 *
 * Fast Move and Invisibility each skip the whole pass one move in four, which is how they get the
 * character away from something: the two rolls stack, so both running gives nine moves in sixteen
 * where nothing follows.
 *
 * A monster walks through a door or a secret door — the wall test is only that the side is not a
 * wall, where the character's engagement test wants it fully open.
 */
export function monstersMove(game: MwGame): void {
  const pc = game.pc;
  tickSpellTimers(game, 1);
  if (pc.fastMove === 1 && game.rng.random(4) === 1) return;
  if (pc.diseaseTimer > 0 && pc.resistDiseaseTimer < 1) {
    pc.diseaseTimer -= 1;
    if (pc.diseaseTimer === 1) {
      pc.diseaseTimer = AFFLICTION_MOVES;
      pc.con -= 1;
      if (pc.con < 2) pc.con = 1;
      game.events.push({ kind: 'playerSaved' });
      loadHBin(game, HINT.diseaseBites);
    }
  }
  if (pc.poisonTimer > 0 && pc.resistPoisonTimer < 1) {
    pc.poisonTimer -= 1;
    if (pc.poisonTimer === 1) {
      pc.poisonTimer = AFFLICTION_MOVES;
      pc.str -= 1;
      if (pc.str < 2) pc.str = 1;
      game.events.push({ kind: 'playerSaved' });
      loadHBin(game, HINT.poisonBites);
    }
  }
  if (pc.invisibility === 1 && game.rng.random(4) === 1) return;
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
    // Slow Enemies gives a third of the character's agility back to a monster's timer one move
    // in four — every monster on the floor, not only the ones next to the character.
    if (pc.slowEnemiesTimer > 0 && game.rng.random(4) === 0) {
      game.monsterTimers[slot] += Math.trunc(pc.dex / 3);
    }
    if (game.rng.random(5) === 1) continue;
    const monster = game.monsters[slot];
    const dx = pc.x - monster.x;
    const dy = pc.y - monster.y;
    if (Math.abs(dx) + Math.abs(dy) >= chaseRange(pc.floor)) {
      // A monster too far off to chase has its timer pushed back up to 1, so it cannot bank
      // attacks while the character is elsewhere on the floor.
      if (game.monsterTimers[slot] < 0) game.monsterTimers[slot] = 1;
      continue;
    }
    game.monsterTimers[slot] = 0;
    mwSetOccupant(game, monster.x, monster.y, MW_SQUARE_EMPTY);
    const open = (x: number, y: number, hv: 0 | 1) =>
      game.wallSide(x, y, hv, pc.floor, pc.dungeon) !== 0;
    const free = (x: number, y: number) => mwOccupantAt(game, x, y) === -1;
    if (dx < 0 && open(monster.x, monster.y, 0) && free(monster.x - 1, monster.y)) {
      monster.x -= 1;
    } else if (dx >= 1 && open(monster.x + 1, monster.y, 0) && free(monster.x + 1, monster.y)) {
      monster.x += 1;
    } else if (dy < 0 && open(monster.x, monster.y, 1) && free(monster.x, monster.y - 1)) {
      monster.y -= 1;
    } else if (dy > 0 && open(monster.x, monster.y + 1, 1) && free(monster.x, monster.y + 1)) {
      monster.y += 1;
    }
    mwSetOccupant(game, monster.x, monster.y, slot);
  }
}

/**
 * check_engagement (WORLD.EXE 2000:7d60, mw.c "FUN_2000_7d60"): the slot of the monster standing
 * on the square the character faces, or -1 when there is nothing there or anything but open air
 * in the way. A door counts as in the way, which is why a monster in a doorway cannot be hit.
 */
export function checkEngagement(game: MwGame): number {
  const pc = game.pc;
  let x = pc.x;
  let y = pc.y;
  if (pc.dir === 0) {
    if (game.wallSide(x, y, 1, pc.floor, pc.dungeon) !== 3) return -1;
    y -= 1;
  }
  if (pc.dir === 1) {
    if (game.wallSide(x, y + 1, 1, pc.floor, pc.dungeon) !== 3) return -1;
    y += 1;
  }
  if (pc.dir === 2) {
    if (game.wallSide(x, y, 0, pc.floor, pc.dungeon) !== 3) return -1;
    x -= 1;
  }
  if (pc.dir === 3) {
    if (game.wallSide(x + 1, y, 0, pc.floor, pc.dungeon) !== 3) return -1;
    x += 1;
  }
  const slot = mwOccupantAt(game, x, y);
  if (slot !== -1 && slot !== MW_SQUARE_PLAYER) return slot;
  return -1;
}

/**
 * Whether meeting a monster starts its attack timer at a roll on the character's agility, which
 * is what gives a nimble character the first move.
 *
 * One new engagement in three does not, unless the character is invisible and the floor's roll
 * beats their level — so being invisible deep down is what keeps the first move.
 */
function winsFirstMove(game: MwGame): boolean {
  const pc = game.pc;
  if (game.rng.random(3) !== 0) return true;
  if (pc.invisibility === 0) return false;
  return pc.lev < game.rng.random(pc.floor + Math.trunc(pc.floor / 2));
}

/**
 * attack_timing (WORLD.EXE 2000:9ed9, mw.c "FUN_2000_9ed9"): work out which monster the character
 * is fighting, turning to face it.
 *
 * It looks the way the character faces first and then round the other three sides. Unlike
 * Dungeons of the Unforgiven's version it leaves the character facing whichever side it settled
 * on rather than putting them back, so walking past a monster turns the character towards it.
 *
 * Walking away from the last monster leaves the slot at -1, and the original then writes the
 * agility roll at `monster_time[-1]`, which is the two bytes in front of the timer array. The
 * port rolls and throws the roll away.
 */
export function attackTiming(game: MwGame): number {
  const pc = game.pc;
  let slot = checkEngagement(game);
  if (slot === -1) {
    game.engagedBanner = -1;
    pc.dir = (pc.dir + 1) % 4;
    slot = checkEngagement(game);
    if (slot === -1) {
      pc.dir = (pc.dir + 1) % 4;
      slot = checkEngagement(game);
      if (slot === -1) {
        pc.dir = (pc.dir + 1) % 4;
        slot = checkEngagement(game);
        // The step is inside the test and the wrap is not, so the fourth failure turns the
        // character one more time and every other path leaves the direction alone.
        if (slot === -1) pc.dir += 1;
        pc.dir = pc.dir % 4;
      }
    }
  }
  if (slot !== game.engaged) {
    // The original also aims the pointer at DS:cd28 at this monster's hit points, which is what
    // strike writes its damage through.
    game.engaged = slot;
    if (winsFirstMove(game)) {
      const start = game.rng.random(pc.dex);
      if (game.engaged !== -1) game.monsterTimers[game.engaged] = start;
    }
  }
  if (game.engaged !== -1 && pc.dir !== game.engagedBanner) {
    game.engagedBanner = pc.dir;
    game.eraseScreen();
    game.say('YOU ARE FIGHTING THE MONSTER'); // DS:2eeb
    // DS:2f08 2f15 2f22 2f30, each with DS:2e0e on the end
    let where = '';
    if (pc.dir === 2) where = 'IN THE WEST ';
    else if (pc.dir === 3) where = 'IN THE EAST ';
    else if (pc.dir === 0) where = 'IN THE NORTH ';
    else if (pc.dir === 1) where = 'IN THE SOUTH ';
    game.say(where + 'VIEW.');
    // DS:2f3e with the monster's own name on the end
    game.say(`MONSTER TYPE: ${MONSTERS[game.monsters[game.engaged].type].name}`);
  }
  return slot;
}

/**
 * spend_time (WORLD.EXE 2000:7fb1, mw.c "FUN_2000_7fb1"): let `moves` of game time go by and give
 * every monster standing next to the character, with open air between, whatever turns that much
 * time buys it.
 *
 * A monster's timer counts down the moves until its next turn and goes back up by
 * `(85 - its row's byte at 0x16) / 3 + 10` after each one, so a monster whose byte is 55 attacks
 * every twenty moves. Three turns is the most one call can produce: the third throws the timer up
 * to the character's whole agility first, which no ordinary action is long enough to spend.
 *
 * The town has no monsters, so there only the clock moves.
 */
export function spendTime(game: MwGame, moves: number): void {
  const pc = game.pc;
  game.movesTaken += moves;
  if (pc.floor === 0) return;
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
    game.monsterTimers[slot] -= moves;
    if (pc.slowEnemiesTimer > 0 && game.rng.random(4) === 0) {
      game.monsterTimers[slot] += Math.trunc(pc.dex / 3);
    }
    const monster = game.monsters[slot];
    const dx = monster.x - pc.x;
    const dy = monster.y - pc.y;
    if (!((dy === 0 && Math.abs(dx) === 1) || (dx === 0 && Math.abs(dy) === 1))) continue;
    const open = (x: number, y: number, hv: 0 | 1) =>
      game.wallSide(x, y, hv, pc.floor, pc.dungeon) === 3;
    if (
      !(
        (dy === -1 && open(pc.x, pc.y, 1)) ||
        (dy === 1 && open(pc.x, pc.y + 1, 1)) ||
        (dx === -1 && open(pc.x, pc.y, 0)) ||
        (dx === 1 && open(pc.x + 1, pc.y, 0))
      )
    ) {
      continue;
    }
    let turns = 0;
    while (game.monsterTimers[slot] < 0) {
      turns += 1;
      if (turns === 3) game.monsterTimers[slot] = pc.dex;
      // The row is read again on each pass, so a puffball that has just turned itself into an
      // empty slot sets the next interval from monster type 0 rather than its own.
      const speed = MONSTERS[monster.type].extraDefence;
      game.monsterTimers[slot] += Math.trunc((85 - speed) / 3) + 10;
      if (monster.hp > 0) game.lastMonsterDamage = monsterTurn(game, slot);
    }
  }
}

/**
 * The swing, which movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol") does inline for the
 * attack key rather than in a function of its own: one strike, then the weapon's own time, then a
 * fifth of whatever the character's agility is short of 85.
 *
 * The game spends the two as separate calls, and each one is another run at an adjacent monster's
 * timer, so they are not the same thing as one call for their sum. This is why the great sword is
 * not simply the best weapon: it costs 25 moves a swing where a knife costs 8.
 */
export function swing(game: MwGame): void {
  const pc = game.pc;
  if (game.engaged === -1) return;
  game.lastStrikeDamage = strike(game);
  spendTime(game, WEAPONS[pc.weapon].swingTime);
  if (85 - pc.dex > 1) spendTime(game, Math.trunc((85 - pc.dex) / 5));
}

/**
 * The other thing movecontrol (WORLD.EXE 2000:aad5, mw.c "movecontrol") does inline, on a step
 * onto an empty square: the monster the character was fighting has its attack timer pushed back
 * up, so walking away from a fight and back into it does not hand the monster free turns.
 *
 * The roll is over agility plus twenty rather than the plain agility {@link attackTiming} uses.
 * The original guards it with a test that the step is not diagonal, which no step ever is.
 */
export function startEngagementTimer(game: MwGame): void {
  if (game.engaged === -1) return;
  if (!winsFirstMove(game)) return;
  game.monsterTimers[game.engaged] = game.rng.random(game.pc.dex + 20);
}

/** experience_for_kill caps the depth here, so nothing deeper is worth any more. */
const EXP_DEPTH_CAP = 130;
/** The doubles the kill's experience is worked out from: 1.23 at DS:5df1 and 5 at DS:5df9. */
const EXP_BASE = 1.23;
const EXP_SCALE = 5;

/**
 * experience_for_kill (WORLD.EXE 3000:b8d4, mw.c "experience_for_kill"): what killing the monster
 * in `slot` is worth. Depths past 130 are all worth the same.
 *
 * Ghidra kept the `pow` base and dropped the FPU arithmetic around it; `mw-tools/docs/DUNGEON.md`
 * writes the whole expression out. `mw-data.json` stores the multiplier one higher than the word
 * in the table, so the -1 that would mean no experience at all is a 0 here: the original returns
 * without leaving anything behind and its caller adds whatever was on the floating point stack.
 * Nothing in the table holds -1.
 */
export function experienceForKill(game: MwGame, slot: number): number {
  const monster = game.monsters[slot];
  let depth = monster.depth;
  if (depth > EXP_DEPTH_CAP) depth = EXP_DEPTH_CAP;
  const kind = MONSTERS[monster.type];
  if (kind.expMult === 0) return 0;
  return kind.expMult * (EXP_SCALE * Math.pow(EXP_BASE, depth) + depth + 1);
}

/**
 * The menus monster_killed reads from the keyboard while it hands out the loot.
 *
 * Each is a function rather than a value because the original reads the keyboard where the menu
 * is on the screen: a kill that turns up no weapon never asks about one.
 */
export interface MwKillChoices {
  /** "1) TAKE THE WEAPON / 2) LEAVE THE WEAPON". */
  takeWeapon(): boolean;
  /** "1) TAKE THE ARMOR / 2) LEAVE THE ARMOR". */
  takeArmor(): boolean;
  /** Which piles of stones to carry: A, L, I, G, P or J. */
  takeStones(): string;
  /** "SELECT A WEAPON TO ENHANCE:", 1 to 8, for the two orbs the last two bosses drop. */
  enhanceWeapon(): number;
}

/** The first and last of the eight quest bosses, which are monsters 104 to 111. */
const FIRST_BOSS = 0x68;
const LAST_BOSS = 0x6f;

/** The line the enhance-a-weapon menu shows for each of the eight weapons. */
function weaponMenuLine(game: MwGame, weapon: number): string {
  const pc = game.pc;
  if (pc.weaponsOwned[weapon] < 1) return '--------'; // DS:6b82
  // DS:56af with the plus on the end, after the weapon's own name
  if (pc.weaponPlus[weapon] === 0) return WEAPONS[weapon].name;
  return `${WEAPONS[weapon].name}, PLUS ${pc.weaponPlus[weapon]}`;
}

/**
 * The orb the fourth and the eighth quest boss drop, in monster_killed (WORLD.EXE 3000:d51c):
 * it turns one weapon the character owns into a plus 25 or a plus 100 weapon.
 *
 * The original keeps asking until the answer names a weapon the character actually owns, so a
 * choice that names one they do not is no choice at all and nothing is enhanced.
 */
function enhanceWeapon(game: MwGame, choice: () => number, plus: number): void {
  const pc = game.pc;
  game.say(...Array.from({ length: 8 }, (_, weapon) => weaponMenuLine(game, weapon)));
  game.say('SELECT A WEAPON TO ENHANCE:'); // DS:6b8b
  const weapon = choice();
  if (weapon < 1 || weapon > 8) return;
  if (pc.weaponsOwned[weapon - 1] < 1) return;
  pc.weaponPlus[weapon - 1] = plus;
}

/**
 * What a quest boss leaves behind, in monster_killed (WORLD.EXE 3000:d51c, mw.c
 * "monster_killed"): a kill flag so the boss is never placed again, and the one item that boss
 * carries.
 *
 * The four shallow bosses give plus 9 body armor, plus 12 gauntlets, a plus 15 ring of protection
 * and the plus 25 orb; the four deep ones give the same four again at 25, 50, 50 and 100. Each
 * message points at the next boss down.
 */
function bossReward(game: MwGame, type: number, choice: () => number): void {
  const pc = game.pc;
  const bit = type - FIRST_BOSS;
  pc.killedBosses |= 1 << bit;
  // Every one of these boxes opens with DS:68f9
  const found = '  YOU HAVE FOUND THE PLUS';
  if (type === 0x68) {
    pc.bodyArmorLevel = 9;
    // DS:6913 692b 6943 4fd1+0x18, DS:6959 6973 698b
    game.say(
      found,
      '9 BODY ARMOR! THIS ITEM',
      'WILL MAKE IT HARDER FOR',
      'ENEMY MONSTERS TO HIT',
      'TO TAKE MORE STRIKES AT YOU.',
      '  NOW LOOK FOR THE SHADOW',
      'MINI-DRAGON ON LEVEL 8.',
      'HE HAS NICE GLOVES.',
    );
  }
  if (type === 0x69) {
    pc.gauntlet = 12;
    // DS:699f 69b9 69d0 69e7, DS:6959 69f1 6a0b
    game.say(
      found,
      '12 GAUNTLET! WHEN YOU PUT',
      'IT ON, YOUR HAND SEEMS',
      'STRONGER AND MUCH MORE',
      'ACCURATE.',
      '  NOW LOOK FOR THE SHADOW',
      'MAJOR DRAGON ON LEVEL 12.',
      'HE HAS A NICE RING.',
    );
  }
  if (type === 0x6a) {
    pc.ringOfProtection = 15;
    // DS:6a1f 6a39 6a51 6a68, DS:6a70 6a86 6aa2
    game.say(
      found,
      '15 RING OF PROTECTION. IT',
      'MAKES YOU FEEL LIKE YOU',
      'CAN DODGE ATTACKS MORE',
      'EASILY.',
      '  NOW FIND THE SHADOW',
      'DRAGON KING ON LEVEL 16. HE',
      'HAS SOMETHING SPECIAL...',
    );
  }
  if (type === 0x6b) {
    // DS:6abb 6ad7 6aec 6b06 6b20, DS:6b2f 6b4a 6b67
    game.say(
      '  FINALLY! YOU NOW HAVE THE',
      'MIGHTY ORB OF WEAPON',
      'ENHANCEMENT. IT WILL TURN',
      'ANY WEAPON INTO A PLUS 25',
      'ATTACK WEAPON.',
      '  THIS WEAPON IS EXTREMELY',
      'USEFUL IN THE 200 PLUS LEVEL',
      'ADVANCED VERSION OF WORLD.',
    );
    enhanceWeapon(game, choice, 25);
  }
  if (type === 0x6c) {
    pc.bodyArmorLevel = 25;
    // DS:6ba7 6bc0 6bd9 6bef, DS:6bf8 6c0f 6c29
    game.say(
      found,
      '25 BODY ARMOR! THIS ITEM',
      'WILL MAKE IT MUCH HARDER',
      'FOR ENEMY MONSTERS TO',
      'HIT YOU.',
      '  NOW LOOK FOR THE RED',
      'MINI DRAGON ON LEVEL 150.',
      'HE IS ONE TOUGH COOKIE.',
    );
  }
  if (type === 0x6d) {
    pc.gauntlet = 50;
    // DS:6c41 69b9 6c5b 6c73, DS:6bf8 6c82 6a0b
    game.say(
      found,
      '50 GAUNTLET! WHEN YOU PUT',
      'IT ON, YOUR HAND SEEMS',
      'STRONGER AND INCREDIBLY',
      'MORE ACCURATE.',
      '  NOW LOOK FOR THE RED',
      'MAJOR DRAGON ON LEVEL 175.',
      'HE HAS A NICE RING.',
    );
  }
  if (type === 0x6e) {
    pc.ringOfProtection = 50;
    // DS:6c9d 6a39 6cb7 6a68, DS:6cd3 6cee 6d0b
    game.say(
      found,
      '50 RING OF PROTECTION. IT',
      'MAKES YOU FEEL LIKE YOU',
      'CAN DODGE ATTACKS MUCH MORE',
      'EASILY.',
      '  NOW FIND AND DESTROY THE',
      'MOST POWERFUL MONSTER IN THE',
      "WORLD! HE'S ON LEVEL 200...",
    );
  }
  if (type === 0x6f) {
    // DS:6d27 6d44 6d61 6d7e 6d99 6db6 6dd1 6dee
    game.say(
      'THE GROUND BEGINS TO RUMBLE,',
      'AND SUDDENLY THE BODY OF THE',
      'GREAT DRAGON KING TURNS INTO',
      'A SMALL RAT WHICH SCURRIES',
      'OFF INTO A HOLE IN THE WALL.',
      'YOU HAVE DEFEATED THE MOST',
      "POWERFUL MONSTER IN MORAFF'S",
      'WORLD!      HIT ANY KEY...',
    );
    // DS:6abb 6e09 6e21 6e3d 6e59, DS:6e6c 6e88 6214
    game.say(
      '  FINALLY! YOU NOW HAVE THE',
      'MIGHTY ORB OF EXPLOSIVE',
      'WEAPON ENHANCEMENT. IT WILL',
      'TURN ANY WEAPON INTO A PLUS',
      '100 ATTACK WEAPON!',
      '  THIS WEAPON IS BY FAR THE',
      'MOST POWERFUL WEAPON EVER!',
      'PERIOD.      HIT ANY KEY...',
    );
    enhanceWeapon(game, choice, 100);
    // DS:6ea3 6ebf 6ed8 6ef3 6f0f 6f29 6f46 6f61
    game.say(
      '  YOU HAVE BEATEN THE GREAT',
      'RED DRAGON KING. YOU MAY',
      'CONTINUE TO WANDER THROUGH',
      "MORAFF'S WORLD IN SEARCH OF",
      'LOOT AND TREASURE, OR YOU',
      'MAY ATTEMPT TO COMPLETE THIS',
      'GREAT ADVENTURE WITH A NEW',
      'AND DIFFERENT CHARACTER.',
    );
  }
}

/** The six vitamin pills a level drainer can carry, in the order the record keeps them. */
const PILL_NAMES = [
  'YOU FOUND AN ORANGE PILL!', // DS:679c
  'YOU FOUND A GREEN PILL!', // DS:67ec
  'YOU FOUND A BLUE PILL!', // DS:6804
  'YOU FOUND A RED PILL!', // DS:681b
  'YOU FOUND A WHITE PILL!', // DS:6831
  'YOU FOUND A YELLOW PILL!', // DS:6849
];

/** What a level drainer may be carrying beside its loot, in monster_killed. */
function levelDrainerExtras(game: MwGame): void {
  const pc = game.pc;
  if (game.rng.random(375) < pc.floor + 175) {
    const pill = game.rng.random(6);
    pc.pills[pill] += 1;
    // The pill's own line, then DS:67b6 67d1, then DS:4a75
    game.say(
      PILL_NAMES[pill],
      '',
      "USE THE 'USE ITEM' MENU TO",
      "  TAKE THE PILL (HIT 'I').",
      '',
      'HIT ANY KEY...',
    );
  }
  // The key is for the floor's own ten, and its flag sits one byte past the start of the array,
  // so floor 10 writes the first of the twenty. Floors 180, 190 and 200 fall outside the test,
  // which is why the last three keys can never be found.
  const key = Math.trunc(pc.floor / 10);
  if (pc.trapdoorKeys[key - 1] === 1 || pc.floor < 10 || pc.floor > 178) return;
  // DS:6862, DS:687d with the number and DS:4686, DS:6890 68aa 68c4, DS:6214+7
  game.say(
    '  YOU HAVE FOUND A KEY! IT',
    `IS LABELED NUMBER ${key * 10}.`,
    '',
    '  THIS KEY WILL ALLOW YOU',
    'TO USE TRAP DOORS LABELED',
    'WITH THIS NUMBER.',
    '',
    '      HIT ANY KEY...',
  );
  pc.trapdoorKeys[key - 1] = 1;
}

/**
 * The colour monster_killed (WORLD.EXE 3000:d51c) draws each of its own three messages in.
 *
 * All three go on the strip above the message box, and each is preceded by a fill_rect wiping
 * whatever was there. None of them is wiped afterwards: every fill_rect the kill makes once a
 * message is up starts at y 0x78 or y 0x28, which is the message box rather than the strip. Each
 * message stands until the next thing written there replaces it, and the last one until the Play
 * tab's loop takes the strip off with the box.
 */
const KILL_MESSAGE_COLOUR = 8;

/**
 * How long monster_killed leaves "YOU KILLED IT!" up (WORLD.EXE 3000:d5c0), the pause it takes
 * before it says anything about what the monster was carrying (3000:da11), and how long
 * "YOU FIND..." stands (3000:da8a).
 *
 * The first is drawn only while DS:45c9 is 0, which is the layout the Z key cycles through three
 * of. This port is played on the map and never leaves that first layout, so it always applies.
 */
const KILLED_IT_MS = 1050;
const BEFORE_THE_FIND_MS = 750;
const FIND_MS = 3000;

/**
 * monster_killed (WORLD.EXE 3000:d51c, mw.c "monster_killed"): the kill.
 *
 * The experience is added, a level drainer's pill and trap door key are handed over, the slot is
 * emptied, and then every loot routine in `./drops.ts` runs in turn. A quest boss adds its kill
 * flag and its one item on top.
 *
 * **The slot is emptied before the loot is rolled**, which is why every routine that reads the
 * dead monster's depth reads a zero. The experience is worked out first and is not affected.
 *
 * A level 0 character gets two pieces of advice at the end: one about the temple if they are
 * fifteen hit points down, and one about the inn if they are ready for their first level.
 */
export function monsterKilled(game: MwGame, choices: MwKillChoices): void {
  const pc = game.pc;
  const slot = game.engaged;
  const monster = game.monsters[slot];
  const type = monster.type;
  const kind = MONSTERS[type];
  if (kind.kind !== PUFFBALL) {
    mwClearMessageLine(game);
    game.draw(mwMessageLine('YOU KILLED IT!', KILL_MESSAGE_COLOUR)); // DS:678d
    game.delay(KILLED_IT_MS);
  }
  pc.exp += experienceForKill(game, slot);
  if (kind.levelDrain > 0) levelDrainerExtras(game);
  mwSetOccupant(game, monster.x, monster.y, MW_SQUARE_EMPTY);
  monster.x = 100;
  monster.y = 100;
  monster.hp = 0;
  monster.type = 0;
  monster.depth = 0;
  game.redrawView = true;
  weaponFind(game, () => choices.takeWeapon());
  armorFind(game, () => choices.takeArmor());
  moneyFind(game, () => choices.takeStones());
  cupOfHealth(game);
  ballOfThought(game);
  if (pc.cls !== 2 && game.rng.random(950) < pc.floor + 40 && game.rng.random(20) < pc.floor) {
    game.delay(BEFORE_THE_FIND_MS);
    mwClearMessageLine(game);
    game.draw(mwMessageLine('YOU FIND...', KILL_MESSAGE_COLOUR)); // DS:68d6
    game.delay(FIND_MS);
    if (game.rng.random(2) === 0) specialFind(game);
    else {
      game.draw(mwMessageLine('NOTHING! (HIT ANY KEY)', KILL_MESSAGE_COLOUR)); // DS:68e2
      game.pressAnyKey();
    }
  }
  spellbookFind(game);
  const writing = game.rng.random(3);
  if (writing === 0) scrollFind(game);
  if (writing === 1) wandFind(game);
  if (writing === 2) paperFind(game);
  if (type > FIRST_BOSS - 1 && type < LAST_BOSS + 1) {
    game.events.push({ kind: 'bossKilled', boss: type - FIRST_BOSS });
    if (type === LAST_BOSS) game.events.push({ kind: 'gameWon' });
    bossReward(game, type, () => choices.enhanceWeapon());
  }
  game.engaged = -1;
  if (pc.lev !== 0) return;
  if (pc.hp + 15 < pc.maxHp) {
    // DS:6f7a 6f95, then DS:6fae 6fc9 6fe4 6fff 701c 7038 for a fighter and DS:704e 706a 7087
    // 70a4 70bf 70dc for anyone who can cast
    game.say(
      '  YOU KILLED THAT MONSTER,',
      'BUT YOU ARE INJURED. YOU',
      ...(pc.cls === 0
        ? [
            'SHOULD GO TO THE TEMPLE IN',
            'TOWN AND BUY A CURE SPELL.',
            'IF YOUR HEALTH POINTS DROP',
            'BELOW 0, YOU WILL DIE. CURES',
            'ARE EXPENSIVE, BUT THEY ARE',
            'WELL WORTH THE MONEY.',
          ]
        : [
            'SHOULD CAST A CURE SPELL TO',
            'INCREASE YOUR HEALTH POINTS.',
            '  IF YOUR HEALTH POINTS FALL',
            'BELOW 0, YOU WILL DIE. USE',
            'THE CAST SPELL MENU AND THEN',
            "SELECT '2' TO CAST A CURE.",
          ]),
    );
  }
  if (!canLevelUp(game)) return;
  // DS:70f7 7102 711f 713b 7157 7170 718d 71a9
  game.say(
    'GOOD NEWS!',
    "YOU ARE READY TO BECOME 1'ST",
    'LEVEL! GO TO THE TOWN, FIND',
    'AN INN, AND STAY THE NIGHT.',
    '  WHEN YOU WAKE THE NEXT',
    "MORNING, YOU'LL BE MUCH MORE",
    'POWERFUL! THEN THE MONSTERS',
    'WILL REALLY COME AFTER YOU!',
  );
}
