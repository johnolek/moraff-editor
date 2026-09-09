import { LEVELS } from '../../game/revmap.js';
import type { RevMagicDesk } from './desk';
import { REV_FOUR_SECONDS, REV_TWO_SECONDS } from './held';
import { REV_MAGIC, revBasicNumber } from './magic';
import { REV_VALUE, revValue, setRevValue, type RevPc } from './record';
import { revKillMonster } from './kill';
import { REV_SPELL_LEVEL_COUNT, revSpellsAt } from './tables';
import type { RevGame } from './state';

/**
 * Casting a spell: the C key of the dungeon (DUNSMALL.EXE 1000:35AC) and of the fight prompt
 * (1000:90D3).
 *
 * There are twenty-four spells in two sets of twelve, and which set a level's menu offers is the
 * only difference between the two routines: the dungeon's own twelve are the "prep" spells and
 * the fight's are the "battle" spells, which is what `F1.COM` calls them and what the wizard's
 * guild sells the descriptions of. Both routines ask for a level of 1 to 6, put the level's two
 * spells up as a menu (1000:C5D0), and jump into a twelve-way `ON ... GOTO` on
 * `2 * level + choice - 2`.
 *
 * A spell the character has not been taught is left off the menu, and the two bitfields that say
 * which they know are numbers of their own record.
 */

/** 1000:35CD and 1000:90E8: what the two routines ask for. */
export const REV_WHAT_LEVEL_SPELL = 'WHAT LEVEL SPELL (1-6)?';
export const REV_WHAT_LEVEL = 'WHAT LEVEL (1-6)?';
export const REV_ESC_CAST_NO_SPELL = 'ESC-CAST NO SPELL';

/** 1000:3632 and 1000:9152: what a level the character cannot pay for says. */
export const REV_NOT_ENOUGH_SPELL_POINTS = 'NOT ENOUGH SPELL POINTS!!';

/** 1000:C6C0: the menu's own third line. */
export const REV_CAST_NO_SPELL = '3) CAST NO SPELL';

/** What the menu answers when nothing is cast (1000:C70A). */
const NO_SPELL = 3;

/** The two lists of spells, and which of the record's two bitfields says the character knows
 *  one: value `116 + 2 * level` for the dungeon's and `115 + 2 * level` for a fight's
 *  (1000:B8CA reads the pairs, and 1000:C5DA picks between them). */
export type RevSpellSet = 'prep' | 'battle';

function knownMask(pc: RevPc, level: number, set: RevSpellSet): number {
  return Math.round(revValue(pc, (set === 'prep' ? 116 : 115) + 2 * level));
}

/** 1000:3B02: hit points never sit above the maximum — except where a spell writes them
 *  straight past it without calling this. */
export function revCapHitPoints(pc: RevPc): void {
  if (pc.hp > pc.maxHp) pc.hp = pc.maxHp;
}

/** 1000:21F3's answer for one key: the number `VAL` reads out of it, and 0 for anything that is
 *  not a digit. */
function typedNumber(key: number | null): number {
  if (key === null) return 0;
  const digit = key - '0'.charCodeAt(0);
  return digit >= 0 && digit <= 9 ? digit : 0;
}

/** Escape, which the spell menu reads as the third answer (1000:C719). */
const ESCAPE = 0x1b;

/**
 * 1000:C5D0: the two spells of a level, and which of them the player picks.
 *
 * A spell the character does not know prints as an empty line and, chosen anyway, comes back as
 * "cast no spell" (1000:C759). So does anything at all if a monster has walked onto the square
 * while the menu was up (1000:C707), which is the one thing that can happen to a character
 * standing still in front of a menu.
 *
 * The answer is handed back in the compiler's scratch cell rather than in a variable of its own,
 * and 1000:917C and 918E are the fight's own C key reading it out of there. That cell is
 * `game.scratch`, which a monster's next swing starts its d20 from (`attack.ts`), so what the
 * menu leaves there is worth having right.
 */
export async function revSpellMenu(
  game: RevGame,
  desk: RevMagicDesk,
  level: number,
  set: RevSpellSet,
): Promise<number> {
  const mask = knownMask(game.pc, level, set);
  // 1000:C5EA and C603: the two lines are worked out from the scratch cell, so the mask stands
  // in it until the answer replaces it.
  game.scratch = mask;
  const spells = revSpellsAt(level, set);
  const offered = [(mask & 1) !== 0 ? spells[0]?.name ?? '' : '', (mask & 2) !== 0 ? spells[1]?.name ?? '' : ''];
  game.say(`LEVEL${revBasicNumber(level)}- SELECT ONE:  `, `1) ${offered[0]}`, `2) ${offered[1]}`, REV_CAST_NO_SPELL);
  let choice = 0;
  for (;;) {
    const key = await desk.poll();
    // 1000:C6E7: a monster on the character's own square, outside a fight, ends the menu.
    if (key === null) {
      // 1000:C707
      game.scratch = NO_SPELL;
      return NO_SPELL;
    }
    choice = typedNumber(key === ESCAPE ? '3'.charCodeAt(0) : key);
    // 1000:C730: what was typed goes in the cell before it is looked at, so a key that is none
    // of the three leaves its own number there while the menu asks again.
    game.scratch = choice;
    if (choice >= 1 && choice <= NO_SPELL) break;
  }
  if (offered[choice - 1] === '') {
    // 1000:C79C
    game.scratch = NO_SPELL;
    return NO_SPELL;
  }
  return choice;
}

/**
 * 1000:3676 and 918E: which of the twelve a level and the menu's answer name.
 *
 * Both C keys work the arm of their `ON ... GOTO` out in the scratch cell, over the answer the
 * menu left there. It is still standing when the monster answers the key, since eight of the
 * twelve battle spells write nothing of their own over it, so it is the number their d20 starts
 * from (`attack.ts`).
 */
function revSpellArm(game: RevGame, level: number, choice: number): number {
  const arm = 2 * level + choice - 2;
  game.scratch = arm;
  return arm;
}

/**
 * 1000:35AC: the C key in the dungeon.
 *
 * The level has to be one the character has the spell points for, and the test is `level > 6 OR
 * level > spell points` — so a wizard with two points is told they have not enough for a level
 * of 7, which is the same sentence for two different refusals.
 */
export async function revCastInTheDungeon(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const level = await askForALevel(game, desk, REV_WHAT_LEVEL_SPELL);
  if (level === null) return;
  const choice = await revSpellMenu(game, desk, level, 'prep');
  if (choice === NO_SPELL) return;
  game.events.push({ kind: 'cast' });
  await REV_PREP_SPELLS[revSpellArm(game, level, choice) - 1].cast(game, desk, level);
}

/** The level prompt both routines open with, or null where they turn round. */
async function askForALevel(game: RevGame, desk: RevMagicDesk, prompt: string): Promise<number | null> {
  game.say(prompt, REV_ESC_CAST_NO_SPELL);
  const level = typedNumber(await desk.poll());
  game.spellLevel = level;
  if (level < 1) return null;
  if (level > REV_SPELL_LEVEL_COUNT || level > game.pc.spellPoints) {
    game.say(REV_NOT_ENOUGH_SPELL_POINTS);
    // 1000:363B: two seconds to read it before the dungeon redraws.
    game.delay(REV_TWO_SECONDS);
    return null;
  }
  return level;
}

/** One of the twelve, with the address of the arm of the `ON ... GOTO` it is. */
export interface RevSpell {
  c: string;
  cast(game: RevGame, desk: RevMagicDesk, level: number): void | Promise<void>;
}

/** 1000:36AA: `Cure' heals a point for every point of wisdom, for one spell point. */
async function cure(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  pc.hp += pc.stats[2];
  pc.spellPoints -= 1;
  revCapHitPoints(pc);
  await desk.stats();
}

/** 1000:36D0: `Sense Level' says which level the character is on. */
function senseLevel(game: RevGame): void {
  game.say(`YOU ARE ON LEVEL${revBasicNumber(game.pc.dungeonLevel)}`);
  game.pc.spellPoints -= 1;
}

/** 1000:36F4: `Strength' adds six to strength until the character is back in the town. Cast
 *  twice it does nothing at all and costs nothing. */
async function strength(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  if (revValue(pc, REV_MAGIC.preppedStrength) !== 0) return;
  pc.stats[0] += 6;
  setRevValue(pc, REV_MAGIC.preppedStrength, 1);
  pc.spellPoints -= 2;
  await desk.stats();
}

/** 1000:3729: `Speed' does the same for agility, and adds seven. */
async function speed(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  if (revValue(pc, REV_MAGIC.preppedSpeed) !== 0) return;
  pc.stats[4] += 7;
  setRevValue(pc, REV_MAGIC.preppedSpeed, 1);
  pc.spellPoints -= 2;
  await desk.stats();
}

/**
 * 1000:3779: `Sense Location' reads the two coordinates out as well as the level.
 *
 * The comma between them is BASIC's, so the `Y=` starts at the next print zone rather than after
 * a fixed gap.
 */
function senseLocation(game: RevGame): void {
  const pc = game.pc;
  const across = `X=${revBasicNumber(pc.column)}`;
  game.say(
    `${across}${' '.repeat(PRINT_ZONE - (across.length % PRINT_ZONE))}Y=${revBasicNumber(pc.row)}`,
    `AND YOU ARE ON LEVEL${revBasicNumber(pc.dungeonLevel)}`,
  );
  pc.spellPoints -= 3;
  // 1000:37C3: four seconds, which is the only way the two lines are read before the redraw.
  game.delay(REV_FOUR_SECONDS);
}

/** How wide a BASIC print zone is, which is where a comma in a `PRINT` moves to. */
const PRINT_ZONE = 14;

/** 1000:37CA: `Descend' drops the character one level. */
function descend(game: RevGame, desk: RevMagicDesk): void {
  game.pc.spellPoints -= 3;
  desk.enterLevel(game.pc.dungeonLevel + 1);
}

/**
 * 1000:37EA: `Feather' takes 250 off the weight — and then, unless that has taken it below zero,
 * **falls straight into `Ascend'**.
 *
 * The `IF weight < 0` at 1000:37FA is the last statement of the line, so the path where the
 * character is still carrying something runs the next line of the program, which is the spell
 * after this one. A heavy character casting Feather floats up a level as well.
 */
async function feather(game: RevGame, desk: RevMagicDesk, level: number): Promise<void> {
  const pc = game.pc;
  pc.weight -= 250;
  if (pc.weight < 0) {
    pc.weight = 0;
    pc.spellPoints -= 4;
    await desk.stats();
    return;
  }
  await ascend(game, desk, level);
}

/** 1000:3819: `Ascend' floats the character up one level, for as many spell points as the level
 *  of the spell. In the town it does nothing and costs nothing. */
function ascend(game: RevGame, desk: RevMagicDesk, level: number): void {
  const pc = game.pc;
  if (pc.dungeonLevel === 0) return;
  game.say('POOF');
  pc.spellPoints -= level;
  desk.enterLevel(pc.dungeonLevel - 1);
}

/**
 * 1000:386F: `Change Level' moves the character between five levels up and four down.
 *
 * The step is `INT(RND * 10) - 5` with a step of nothing turned into a step of one up, so it is
 * never nothing; the loop at 1000:38BD that would roll again if the level had not changed can
 * therefore never run.
 */
function changeLevel(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  let step = game.rng.random(10) - 5;
  if (step === 0) step = -1;
  // 1000:388F, with the step of nothing turned into one at 1000:38A2: both are the scratch cell,
  // and the floor it moves to is worked out over the top of it rather than in it (1000:38A5), so
  // the step is what is left standing.
  game.scratch = step;
  let level = pc.dungeonLevel + step;
  if (level < 0) level = 0;
  if (level > LEVELS) level = LEVELS;
  pc.spellPoints -= 5;
  desk.enterLevel(level);
}

/** 1000:38FA: `Invisibility' makes the monsters slower to find the character. */
function invisibility(game: RevGame): void {
  setRevValue(game.pc, REV_VALUE.invisibility, 1);
  game.pc.spellPoints -= 5;
}

/** 1000:392D: `Heal' puts the hit points at the maximum plus half of wisdom, and nothing brings
 *  them back down, so a wise character walks around above their own maximum. */
function heal(game: RevGame): void {
  const pc = game.pc;
  pc.hp = Math.floor(0.5 * pc.stats[2]) + pc.maxHp;
  pc.spellPoints -= 6;
}

/** 1000:3957: `Mocciolo' is one of six things, and two of them are bad. */
function mocciolo(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  pc.spellPoints -= 6;
  // 1000:397A: the d6 is rolled in the scratch cell, which is what the ON GOTO jumps on.
  const roll = game.rng.random(6) + 1;
  game.scratch = roll;
  if (roll === 1) {
    // 1000:3995: a point on every characteristic.
    for (let stat = 0; stat < pc.stats.length; stat++) pc.stats[stat] += 1;
    game.say('WOW!');
    // 1000:39E4. The point off every characteristic at roll 5 says UH OH... and holds nothing.
    game.delay(REV_FOUR_SECONDS);
    return;
  }
  if (roll === 2) {
    // 1000:39E8: straight back to the town, on the square in front of the buildings.
    pc.column = 10;
    pc.row = 10;
    revArriveInTheTown(game);
    desk.enterLevel(0);
    return;
  }
  if (roll === 3) {
    // 1000:3A06: full health and thirty more spell points.
    pc.hp = pc.maxHp;
    pc.spellPoints += 30;
    return;
  }
  if (roll === 4) {
    // 1000:3A1E: level 50, wherever the character was.
    desk.enterLevel(50);
    return;
  }
  if (roll === 5) {
    // 1000:3A2B: a point off every characteristic.
    for (let stat = 0; stat < pc.stats.length; stat++) pc.stats[stat] -= 1;
    game.say('UH OH...');
    return;
  }
  // 1000:3A7A: two levels and every point of experience gone, and the maximum hit points cut by
  // two rolls of a d10 and twice the bonus health hands out.
  pc.level -= 2;
  pc.experience = 0;
  pc.maxHp = pc.maxHp - game.rng.random(10) - game.rng.random(10) - 2 * pc.fromHealth + 2;
  if (pc.maxHp < 0) pc.maxHp = 1;
  game.say('Oh my God!');
  // 1000:3AFB.
  game.delay(REV_FOUR_SECONDS);
  revCapHitPoints(pc);
}

/** The twelve the dungeon's own menu casts, in the order `2 * level + choice - 2` reaches them
 *  (1000:368E). */
export const REV_PREP_SPELLS: RevSpell[] = [
  { c: '1000:36AA, CURE', cast: (game, desk) => cure(game, desk) },
  { c: '1000:36D0, SENSE LEVEL', cast: (game) => senseLevel(game) },
  { c: '1000:36F4, STRENGTH', cast: (game, desk) => strength(game, desk) },
  { c: '1000:3729, SPEED', cast: (game, desk) => speed(game, desk) },
  { c: '1000:3779, SENSE LOCATION', cast: (game) => senseLocation(game) },
  { c: '1000:37CA, DESCEND', cast: (game, desk) => descend(game, desk) },
  { c: '1000:37EA, FEATHER', cast: feather },
  { c: '1000:3819, ASCEND', cast: ascend },
  { c: '1000:386F, CHANGE LEVEL', cast: (game, desk) => changeLevel(game, desk) },
  { c: '1000:38FA, INVISIBILITY', cast: (game) => invisibility(game) },
  { c: '1000:392D, HEAL', cast: (game) => heal(game) },
  { c: '1000:3957, MOCCIOLO', cast: (game, desk) => mocciolo(game, desk) },
];

/**
 * 1000:1CF5: the character has arrived in the town, however they got there.
 *
 * The level goes to 0 and the three bonuses the fight arithmetic reads are worked out again from
 * the characteristics, each halved rather than floored when it comes out below one.
 */
export function revArriveInTheTown(game: RevGame): void {
  const pc = game.pc;
  pc.dungeonLevel = 0;
  pc.fromHealth = Math.floor(2 * pc.stats[3] - 26);
  if (pc.fromHealth < 1) pc.fromHealth = Math.trunc(0.5 * pc.fromHealth);
  pc.fromStrength = Math.trunc(pc.stats[0] - 11) * 0.7;
  if (pc.fromStrength < 1) pc.fromStrength = Math.trunc(0.5 * pc.fromStrength);
  pc.fromAgility = pc.stats[4] - 12;
  if (pc.fromAgility < 1) pc.fromAgility = 0;
}

/**
 * 1000:1C93: the spells that last until the town are taken back off.
 *
 * Invisibility just stops; the two prep spells give back exactly what they added, so a character
 * who cast Strength twice — which the second cast refuses — is not left six points up.
 */
export function revEndPreppedSpells(game: RevGame): void {
  const pc = game.pc;
  setRevValue(pc, REV_VALUE.invisibility, 0);
  if (revValue(pc, REV_MAGIC.preppedStrength) === 1) {
    setRevValue(pc, REV_MAGIC.preppedStrength, 0);
    pc.stats[0] -= 6;
  }
  if (revValue(pc, REV_MAGIC.preppedSpeed) === 1) {
    setRevValue(pc, REV_MAGIC.preppedSpeed, 0);
    pc.stats[4] -= 7;
  }
}

/**
 * 1000:0A4F: the top of every pass takes the two spells a fight casts on the character off again
 * when the step counter has come back round to where they were cast.
 *
 * Both are written down as "the step before the one you cast on", so both last a full sixteen
 * steps — however long that takes, since standing still never moves the counter on.
 */
export function revCountDownBattleSpells(game: RevGame): void {
  const pc = game.pc;
  // 1000:0A2B: the pass after the character has taken their turn in a fight skips all of this,
  // counter and all. Nothing moves the counter inside a fight anyway — the only key that does is
  // a step, and a step walks away from the monster — so this is the whole of that test here.
  if (game.fight !== null) return;
  if (game.steps > BATTLE_SPELL_STEPS) game.steps = 1;
  if (revValue(pc, REV_MAGIC.battleSpeed) === game.steps) {
    setRevValue(pc, REV_MAGIC.battleSpeed, 0);
    pc.stats[4] -= 11;
  }
  if (revValue(pc, REV_MAGIC.battleStrength) === game.steps) {
    setRevValue(pc, REV_MAGIC.battleStrength, 0);
    pc.fromStrength -= 7;
  }
}

/** 1000:0A4F's own 16: how far the step counter runs before it starts again. */
const BATTLE_SPELL_STEPS = 16;

/**
 * 1000:9257 and 92C8: the step the spell runs out on.
 *
 * It means "the step before this one", and it wraps a 1 up to 16 before taking the 1 off rather
 * than after, so a spell cast on the first step of a round runs out on the fifteenth and lasts a
 * step less than any other.
 */
function runsOutAt(game: RevGame): number {
  return (game.steps === 1 ? BATTLE_SPELL_STEPS : game.steps) - 1;
}

/**
 * 1000:9569: what a spell that does damage does with it.
 *
 * The spell points come off here rather than in the spell, so every one of the six that ends
 * this way costs the level that was typed. A monster with nothing left is killed on the spot.
 */
function damageTheMonster(game: RevGame, level: number, damage: number): void {
  const pc = game.pc;
  pc.spellPoints -= level;
  const fight = game.fight;
  if (!fight) return;
  fight.hitPoints -= damage;
  game.say(`YOU DO${revBasicNumber(damage)} POINTS`);
  // 1000:95A6: held before the monster is looked at, so the damage is read even where it kills.
  game.delay(REV_TWO_SECONDS);
  if (fight.hitPoints < 1) revKillMonster(game);
}

/** 1000:9518: the monster is dead without a swing having touched it. */
function killOutright(game: RevGame, level: number): void {
  game.pc.spellPoints -= level;
  revKillMonster(game);
}

/** 1000:9529: the spell was paid for and did nothing. */
function noEffect(game: RevGame, level: number): void {
  game.pc.spellPoints -= level;
  game.say('NO EFFECT ', '');
  // 1000:954F.
  game.delay(REV_TWO_SECONDS);
}

/** 1000:9555: the spell is done and the monster gets its turn. */
function spellDone(game: RevGame, level: number): void {
  game.pc.spellPoints -= level;
  // 1000:9563: two seconds with whatever the spell itself printed still on the screen.
  game.delay(REV_TWO_SECONDS);
}

/** The monster's level, which in a fight is what DGROUP B6B4 holds. */
function monsterLevel(game: RevGame): number {
  return game.fight?.monsterLevel ?? game.lastMonsterLevel;
}

/** 1000:9455: what `God?' does at its best and what `Gas' borrows to finish a sleeping
 *  monster. */
function actOfGod(game: RevGame, level: number): void {
  damageTheMonster(game, level, game.rng.random(5000) + 1376);
}

/** 1000:91C2: `Gas' puts a monster under the fourth level to sleep half the time, and the sleep
 *  is a blow of between 1,376 and 6,375 points. */
function gas(game: RevGame, level: number): void {
  // 1000:91D7: the coin is tossed in the scratch cell and read back out of it, so the toss is
  // what stands there when the monster answers the key (`attack.ts`).
  const roll = game.rng.random(2) + 1;
  game.scratch = roll;
  if (roll === 1 && monsterLevel(game) < 4) {
    game.say('IT FALLS ASLEEP AND YOU KILL IT');
    actOfGod(game, level);
    return;
  }
  noEffect(game, level);
}

/** 1000:9214: `Magic Zot' does a d4 for every level of the caster, and their level and three
 *  again. */
function magicZot(game: RevGame, level: number): void {
  const player = game.pc.level;
  damageTheMonster(game, level, game.rng.random(4) * player + player + 3);
}

/** 1000:9239: `Magic Bolt' does between 11 and 37, whoever casts it. */
function magicBolt(game: RevGame, level: number): void {
  damageTheMonster(game, level, game.rng.random(27) + 11);
}

/** 1000:9257: the fight's `Speed' adds eleven to agility for sixteen steps. */
function battleSpeed(game: RevGame, level: number): void {
  const pc = game.pc;
  pc.stats[4] += 11;
  setRevValue(pc, REV_MAGIC.battleSpeed, runsOutAt(game));
  spellDone(game, level);
}

/** 1000:9298: `Lightning' does a d4 for every level of the caster, and twice their level and
 *  five. */
function lightning(game: RevGame, level: number): void {
  const player = game.pc.level;
  damageTheMonster(game, level, game.rng.random(4 * player) + 2 * player + 5);
}

/** 1000:92C8: the fight's `Strength' adds seven to what strength puts on a swing, for sixteen
 *  steps. */
function battleStrength(game: RevGame, level: number): void {
  const pc = game.pc;
  setRevValue(pc, REV_MAGIC.battleStrength, runsOutAt(game));
  pc.fromStrength += 7;
  spellDone(game, level);
}

/** 1000:9309: `Go Away!' sends the monster off and leaves its treasure, when a roll on the
 *  caster's own level beats the monster's. It is the kill without the words. */
function goAway(game: RevGame, level: number): void {
  // 1000:9322: the roll is made in the scratch cell and compared there.
  const roll = game.rng.random(2 * game.pc.level) + 5;
  game.scratch = roll;
  if (roll > monsterLevel(game)) {
    game.say("IT'S GONE");
    game.monsterLeft = true;
    killOutright(game, level);
    return;
  }
  noEffect(game, level);
}

/** 1000:935F: `Rise...' floats the character up a level, monster and all. */
function rise(game: RevGame, desk: RevMagicDesk, level: number): void {
  const pc = game.pc;
  pc.spellPoints -= level;
  game.say('POOF');
  const to = pc.dungeonLevel - 1;
  if (to === 0) revArriveInTheTown(game);
  desk.enterLevel(to);
}

/** 1000:93B8: `Auto Kill' is `Go Away!' with three times the roll and no treasure of its own. */
function autoKill(game: RevGame, level: number): void {
  // 1000:93D3: the roll is made in the scratch cell, the way `Go Away!' makes its own.
  const roll = game.rng.random(3 * game.pc.level) + 5;
  game.scratch = roll;
  if (roll > monsterLevel(game)) {
    killOutright(game, level);
    return;
  }
  noEffect(game, level);
}

/** 1000:93E9: `Explosion' does a d4 per level of the caster, three times their level, and
 *  twenty. */
function explosion(game: RevGame, level: number): void {
  const player = game.pc.level;
  damageTheMonster(game, level, game.rng.random(4 * player) + 3 * player + 20);
}

/** 1000:941B: the fight's `Heal' puts the hit points back to the maximum exactly. */
function battleHeal(game: RevGame, level: number): void {
  game.pc.hp = game.pc.maxHp;
  spellDone(game, level);
}

/**
 * 1000:9427: `God?' is one of five things.
 *
 * Three of its arms take their six spell points off where they stand and then leave by a door
 * that takes six off again, so the last one costs twelve.
 */
function god(game: RevGame, desk: RevMagicDesk, level: number): void {
  const pc = game.pc;
  // 1000:943C: the d5 is rolled in the scratch cell, which is what the ON GOTO jumps on.
  const roll = game.rng.random(5) + 1;
  game.scratch = roll;
  if (roll === 1) {
    actOfGod(game, level);
    return;
  }
  if (roll === 2) {
    // 1000:9473: straight out of the dungeon and back to the town.
    pc.spellPoints -= 6;
    pc.column = 10;
    pc.row = 10;
    revArriveInTheTown(game);
    desk.enterLevel(0);
    return;
  }
  if (roll === 3) {
    // 1000:949F: full health, and the fight goes on.
    pc.spellPoints -= 6;
    pc.hp = pc.maxHp;
    return;
  }
  if (roll === 4) {
    noEffect(game, level);
    return;
  }
  // 1000:94B9: a point off every characteristic, and six more spell points on the way out.
  pc.spellPoints -= 6;
  for (let stat = 0; stat < pc.stats.length; stat++) pc.stats[stat] -= 1;
  game.say('UH OH... ');
  spellDone(game, level);
}

/** The twelve the fight prompt casts, in the order `2 * level + choice - 2` reaches them
 *  (1000:91A6). */
export const REV_BATTLE_SPELLS: RevSpell[] = [
  { c: '1000:91C2, GAS', cast: (game, desk, level) => gas(game, level) },
  { c: '1000:9214, MAGIC ZOT', cast: (game, desk, level) => magicZot(game, level) },
  { c: '1000:9239, MAGIC BOLT', cast: (game, desk, level) => magicBolt(game, level) },
  { c: '1000:9257, SPEED', cast: (game, desk, level) => battleSpeed(game, level) },
  { c: '1000:9298, LIGHTNING', cast: (game, desk, level) => lightning(game, level) },
  { c: '1000:92C8, STRENGTH', cast: (game, desk, level) => battleStrength(game, level) },
  { c: "1000:9309, GO AWAY!", cast: (game, desk, level) => goAway(game, level) },
  { c: '1000:935F, RISE...', cast: rise },
  { c: '1000:93B8, AUTO KILL', cast: (game, desk, level) => autoKill(game, level) },
  { c: '1000:93E9, EXPLOSION', cast: (game, desk, level) => explosion(game, level) },
  { c: '1000:941B, HEAL', cast: (game, desk, level) => battleHeal(game, level) },
  { c: '1000:9427, GOD?', cast: god },
];

/**
 * 1000:90D3: the C key at the fight prompt.
 *
 * It asks the same two questions the dungeon's does, in the other order: a level outside 1 to 6
 * is turned down without a word, and only then are the spell points counted.
 */
export async function revCastInAFight(game: RevGame, desk: RevMagicDesk): Promise<void> {
  game.say(REV_WHAT_LEVEL, REV_ESC_CAST_NO_SPELL);
  const level = typedNumber(await desk.poll());
  game.spellLevel = level;
  if (level < 1 || level > REV_SPELL_LEVEL_COUNT) return;
  if (level > game.pc.spellPoints) {
    game.say(REV_NOT_ENOUGH_SPELL_POINTS);
    // 1000:915B: the fight's own copy of the same refusal, held for the same two seconds.
    game.delay(REV_TWO_SECONDS);
    return;
  }
  const choice = await revSpellMenu(game, desk, level, 'battle');
  if (choice === NO_SPELL) return;
  game.events.push({ kind: 'cast' });
  await REV_BATTLE_SPELLS[revSpellArm(game, level, choice) - 1].cast(game, desk, level);
}
