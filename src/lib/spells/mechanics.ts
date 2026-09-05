import type { Spell } from './spells';

export const NOT_DOCUMENTED = 'Not documented in the disassembly notes.';

/** The key a spell has in the table: names repeat between the four lists. */
export function spellKey(spell: Spell): string {
  return `${spell.typeName}/${spell.name}`;
}

/**
 * What each spell does in the code, from the reverse-engineering notes in
 * dotu-tools/docs and the FAQ section [SPMC] they were written from.
 */
export const SPELL_MECHANICS: Record<string, string> = {
  'Permanent/Enchant Weapon Level 1':
    'Sets the plus of the one weapon you pick to exactly 1 instead of adding to it, so it will ruin a plus 25 weapon from a boss. The plus is added to your attack roll.',
  'Permanent/Extra Health Point': 'Adds 1 to your maximum hit points for good.',
  'Permanent/Write Scroll To Level 3':
    'Writes one scroll for any spell of level 3 or below. A permanent spell cast from a scroll costs no spell points and does not lower your maximum SP.',
  'Permanent/Enchant Armor Level 1':
    'Sets the plus of the one armor you pick to exactly 1 instead of adding to it. The plus goes on the defense score a monster\'s attack roll has to beat.',
  'Permanent/Extra 3 Health Points': 'Adds 3 to your maximum hit points for good.',
  'Permanent/Enchant Wand Level 3':
    'Puts 5 charges of any spell of level 3 or below into a wand. Wands cost no spell points to use; the ones monsters drop hold 2 to 6 charges.',
  'Permanent/Enchant Weapon Level 2': 'Sets the plus of the one weapon you pick to exactly 2, up or down.',
  'Permanent/Extra 5 Health Points': 'Adds 5 to your maximum hit points for good.',
  'Permanent/Enchant Ring Level 1':
    'Sets your ring of protection to 1, which adds 1 to the defense score a monster has to beat. It refuses to cast if you already have that much or better.',
  'Permanent/Enchant Armor Level 2': 'Sets the plus of the one armor you pick to exactly 2, up or down.',
  'Permanent/Anti Magic Ring Level 1':
    'Nothing in the combat or the spell code ever reads the anti-magic ring, so this costs you 4 maximum spell points and does nothing at all.',
  'Permanent/Write Scroll To Level 10':
    'Writes one scroll for any spell in the game. A permanent spell cast from a scroll does not lower your maximum SP.',
  'Permanent/Enchant Weapon Level 3': 'Sets the plus of the one weapon you pick to exactly 3, up or down.',
  'Permanent/Enchant Ring Level 2':
    'Sets your ring of protection to 2, adding 2 to the defense score a monster has to beat. It refuses to cast if you already have that much or better.',
  'Permanent/Body Armor Level 1':
    'Sets your body armor to 1, which adds 1 to the defense score a monster has to beat. It refuses to cast if you already have that much or better.',
  'Permanent/Enchant Armor Level 3': 'Sets the plus of the one armor you pick to exactly 3, up or down.',
  'Permanent/Anti-Magic Ring Level 2':
    'The anti-magic ring is never read by any formula in the game: 6 maximum spell points for nothing.',
  'Permanent/Enchant Wand Level 8': 'Puts 5 charges of any spell of level 8 or below into a wand.',
  'Permanent/Enchant Ring Level 3':
    'Sets your ring of protection to 3, adding 3 to the defense score a monster has to beat.',
  'Permanent/Anti-Magic Ring Level 3':
    'Another ring no formula in the game ever reads: 7 maximum spell points for nothing.',
  'Permanent/Body Armor Level 2': 'Sets your body armor to 2, adding 2 to the defense score a monster has to beat.',
  'Permanent/Enchant Weapon Level 4': 'Sets the plus of the one weapon you pick to exactly 4, up or down.',
  'Permanent/Enchant Armor Level 4': 'Sets the plus of the one armor you pick to exactly 4, up or down.',
  'Permanent/Enchant Wand Any Level': 'Puts 5 charges of any spell in the game into a wand.',
  'Permanent/Permanent Feather': 'Your weight counts as 0 when the game works out how long a move takes, for good.',
  'Permanent/Anti-Magic Ring Level 5':
    'The strongest anti-magic ring, and just as unread by the game as the others: 9 maximum spell points for nothing.',
  'Permanent/Extra 25 Health Points': 'Adds 25 to your maximum hit points for good.',
  'Permanent/Permanent Invisibility':
    'Only changes a monster\'s first strike: the delay it normally skips 1 time in 3 applies anyway when rand(1.5 x depth) comes out above your level. Unlike the preparation Invisibility it never stops monsters moving.',
  'Permanent/Youth':
    'Sets your age to 20 and multiplies your experience by 0.9. It does not give back the Strength and Constitution that ageing took.',
  'Permanent/Body Armor Level 4': 'Sets your body armor to 4, adding 4 to the defense score a monster has to beat.',

  'Preparation/Enchant Armor Level 1':
    'Adds 1 to the defense score a monster\'s attack roll has to beat, until you sleep at an inn. It refuses to cast if you already have that much or better.',
  'Preparation/Enchant Weapon Level 1':
    'Adds 1 to your attack roll until you sleep at an inn. It refuses to cast if you already have that much or better.',
  'Preparation/Little Cure':
    'Heals half your wisdom, rounded down. There is no random part, whatever the 1-20 in the help text suggests.',
  'Preparation/Enchant Weapon Level 2': 'Adds 2 to your attack roll until you sleep at an inn.',
  'Preparation/Relocate': 'Puts you on a random open square on the same floor.',
  'Preparation/Detect Level': 'Tells you which floor you are on.',
  'Preparation/Cure': 'Heals 20 + 2 x rand(wisdom), never more than 60.',
  'Preparation/Enchant Armor Level 2':
    'Adds 2 to the defense score a monster has to beat, until you sleep at an inn.',
  'Preparation/Strength': '+5 Strength until you sleep at an inn.',
  'Preparation/Enchant Weapon Level 3': 'Adds 3 to your attack roll until you sleep at an inn.',
  'Preparation/Agility': '+5 Agility until you sleep at an inn.',
  'Preparation/Descend':
    'One floor down, onto a random open square, and never past the bottom of the module: floor 25, 45, 65, 85 or 105.',
  'Preparation/Ascend':
    'One floor up, onto a random open square. It does not work from floor 66 or deeper, though the message says the 64th.',
  'Preparation/Detect Position': 'Tells you your x and y on the floor.',
  'Preparation/Feather':
    'Your weight counts as 0 when the game works out how long a move takes, until you sleep at an inn.',
  'Preparation/Big Cure': 'Heals 50 + rand(4 x wisdom), never more than 150.',
  'Preparation/Double Ascend': 'Two floors up, onto a random open square. It does not work from floor 66 or deeper.',
  'Preparation/Enchant Weapon Level 4': 'Adds 4 to your attack roll until you sleep at an inn.',
  'Preparation/Invisibility':
    'On 1 move in 4 no monster on the floor moves, and a monster that engages you is likelier to have to wait before its first strike. Lasts until you sleep at an inn.',
  'Preparation/Enchant Armor Level 3':
    'Adds 3 to the defense score a monster has to beat, until you sleep at an inn.',
  'Preparation/Fast Move': 'On 1 move in 4 no monster on the floor moves, until you sleep at an inn.',
  'Preparation/Super Strength': '+10 Strength until you sleep at an inn.',
  'Preparation/Enchant Weapon Level 5': 'Adds 5 to your attack roll until you sleep at an inn.',
  'Preparation/Major Descend': 'Ten floors down, onto a random open square, and never past the bottom of the module.',
  'Preparation/Super Agility': '+10 Agility until you sleep at an inn.',
  'Preparation/Cure Poison':
    'Clears poison, which otherwise takes a point of Strength every 450 moves for ever. The temple charges 300 rubles for the same thing.',
  'Preparation/Heal All Wounds': 'Puts your hit points back to their maximum.',
  'Preparation/Major Ascend': 'Ten floors up, onto a random open square. It does not work from floor 66 or deeper.',
  'Preparation/Cure Disease':
    'Clears disease, which otherwise takes a point of Constitution every 450 moves for ever. The temple charges 500 rubles for the same thing.',
  'Preparation/Enchant Armor Level 4':
    'Adds 4 to the defense score a monster has to beat, until you sleep at an inn.',

  'Wizard battle/Sleep':
    'Works when rand(monster level) < 3: always at monster level 3 or below, otherwise 3 in the monster\'s level, which is 15% at level 20 and 5% at level 60. Lasts 25 moves, and every attack the sleeping monster does not make has a depth in 500 chance of waking it. It works on Shadow bosses.',
  'Wizard battle/Magic Zap': '2 x your level + 2 damage.',
  'Wizard battle/Minor Protection': 'Takes 2 off the monster\'s attack roll for 60 moves.',
  'Wizard battle/Slow Enemies':
    'Every second of game time each monster has a 1 in 4 chance of having your agility divided by 3 seconds added to its attack timer, which at agility 20 or so roughly doubles the gap between its attacks. Lasts 60 moves, and casting it again restarts it rather than adding to it.',
  'Wizard battle/Strength': '+7 Strength for 60 moves, and the game takes it back when the spell runs out.',
  'Wizard battle/Minor Shock': '25 damage.',
  'Wizard battle/Lightning Bolt': '4 x your level + 4 damage.',
  'Wizard battle/Magic Missile': '50 damage.',
  'Wizard battle/Speed': '+7 Agility for 60 moves, and the game takes it back when the spell runs out.',
  'Wizard battle/Go Away':
    'Teleports the monster away every single time. There is no level ratio check at all, whatever the help text says, but it does nothing to a Shadow boss.',
  'Wizard battle/Relocate': 'Puts you on a random open square on the same floor.',
  'Wizard battle/Power Weapon I':
    'Your damage die becomes 69 for 60 moves. The to-hit bonus, magic plus and speed of the weapon in your hand still apply; the plus 3 in the help text is used nowhere.',
  'Wizard battle/Minor Explosion': '75 + rand(101) damage, so 75 to 175.',
  'Wizard battle/Protection': 'Takes 8 off the monster\'s attack roll for 60 moves.',
  'Wizard battle/Resist Poison':
    'Blocks poison completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a poison you already carry.',
  'Wizard battle/Magic Zot':
    '(your level + 1) rolls of 4 + rand(5), so 4 to 8 damage for each of your levels plus one.',
  'Wizard battle/Shock': '125 damage.',
  'Wizard battle/Anti-Cold': 'Halves the damage of cold breath for 60 moves.',
  'Wizard battle/Explosion': '125 + rand(101) damage, so 125 to 225.',
  'Wizard battle/Pass Wall': NOT_DOCUMENTED,
  'Wizard battle/Anti-Fire': 'Halves the damage of fire breath for 60 moves.',
  'Wizard battle/Magic Bolt':
    '(your level + 1) rolls of 7 + rand(5), so 7 to 11 damage for each of your levels plus one.',
  'Wizard battle/Resist Level Drain':
    'Blocks a level drain completely for 60 moves — 100%, not the 90% the help text claims.',
  'Wizard battle/Power Weapon Ii':
    'Your damage die becomes 129 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Wizard battle/Hold Monster-Stops Monster':
    'Always works on anything but a Shadow boss. Lasts 15 moves, and every attack the held monster does not make has a depth in 500 chance of freeing it.',
  'Wizard battle/Drain Monster':
    'If the monster\'s level is below your wisdom its level and hit points drop to 0 and it dies; otherwise its level drops by your wisdom and its hit points by (hit points per level / 2) x wisdom. Experience is worked out from the reduced level, so a kill this way pays only 6 times the monster\'s multiplier. Nothing happens to a Shadow boss.',
  'Wizard battle/Major Shock': '300 damage.',
  'Wizard battle/Major Explosion': '200 + rand(301) damage, so 200 to 500.',
  'Wizard battle/Autokill':
    'Succeeds when rand(monster level + rand(monster speed)) is less than rand(your level + rand(intelligence + wisdom)) + rand(depth). A success sets the monster\'s hit points to -100 and pays full experience; a Shadow boss is immune.',
  'Wizard battle/Power Weapon Iii':
    'Your damage die becomes 199 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed. Power Weapon IV, a 399 die, is in the weapon table but no spell, scroll, wand or paper casts it.',

  'Priest battle/Sleep':
    'Works when rand(monster level) < 3: always at monster level 3 or below, otherwise 3 in the monster\'s level, which is 15% at level 20 and 5% at level 60. Lasts 25 moves, and every attack the sleeping monster does not make has a depth in 500 chance of waking it. It works on Shadow bosses.',
  'Priest battle/Minor Protection': 'Takes 2 off the monster\'s attack roll for 60 moves.',
  'Priest battle/Strength': '+7 Strength for 60 moves, and the game takes it back when the spell runs out.',
  'Priest battle/Resist Poison':
    'Blocks poison completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a poison you already carry.',
  'Priest battle/Speed': '+7 Agility for 60 moves, and the game takes it back when the spell runs out.',
  'Priest battle/Fast Cure': 'Heals half your wisdom, rounded down.',
  'Priest battle/Resist Disease':
    'Blocks disease completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a disease you already carry.',
  'Priest battle/Relocate': 'Puts you on a random open square on the same floor.',
  'Priest battle/Slow Enemies':
    'Every second of game time each monster has a 1 in 4 chance of having your agility divided by 3 seconds added to its attack timer, which at agility 20 or so roughly doubles the gap between its attacks. Lasts 60 moves, and casting it again restarts it rather than adding to it.',
  'Priest battle/Anti-Cold': 'Halves the damage of cold breath for 60 moves.',
  'Priest battle/Go Away':
    'Teleports the monster away every single time. There is no level ratio check at all, whatever the help text says, but it does nothing to a Shadow boss.',
  'Priest battle/Power Weapon I':
    'Your damage die becomes 69 for 60 moves. The to-hit bonus, magic plus and speed of the weapon in your hand still apply; the plus 3 in the help text is used nowhere.',
  'Priest battle/Protection':
    'Sets protection level 1, the same as Minor Protection, so it takes only 2 off the monster\'s attack roll where the wizard\'s Protection takes 8. That looks like a bug: a priest goes from 2 straight to Major Protection\'s 18.',
  'Priest battle/Anti-Fire': 'Halves the damage of fire breath for 60 moves.',
  'Priest battle/Pass Wall': NOT_DOCUMENTED,
  'Priest battle/Resist Level Drain':
    'Blocks a level drain completely for 60 moves — 100%, not the 90% the help text claims.',
  'Priest battle/Drain Monster':
    'If the monster\'s level is below your wisdom its level and hit points drop to 0 and it dies; otherwise its level drops by your wisdom and its hit points by (hit points per level / 2) x wisdom. Experience is worked out from the reduced level, so a kill this way pays only 6 times the monster\'s multiplier. Nothing happens to a Shadow boss.',
  'Priest battle/Fast Big Cure': 'Heals rand(4 x wisdom), never more than 90, and it can roll 0.',
  'Priest battle/Hold Monster':
    'Always works on anything but a Shadow boss. Lasts 15 moves, and every attack the held monster does not make has a depth in 500 chance of freeing it.',
  'Priest battle/Power Weapon Ii':
    'Your damage die becomes 129 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Priest battle/Shock': '125 damage.',
  'Priest battle/Major Protection': 'Takes 18 off the monster\'s attack roll for 60 moves.',
  'Priest battle/Explosion': '125 + rand(101) damage, so 125 to 225.',
  'Priest battle/Magic Zot':
    '(your level + 1) rolls of 4 + rand(5), so 4 to 8 damage for each of your levels plus one.',
  'Priest battle/Autokill':
    'Succeeds when rand(monster level + rand(monster speed)) is less than rand(your level + rand(intelligence + wisdom)) + rand(depth). A success sets the monster\'s hit points to -100 and pays full experience; a Shadow boss is immune.',
  'Priest battle/Power Weapon Iii':
    'Your damage die becomes 199 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed. Power Weapon IV, a 399 die, is in the weapon table but no spell, scroll, wand or paper casts it.',
  'Priest battle/Strength And Speed': '+7 Strength and +7 Agility for 60 moves: both of the battle spells at once.',
  'Priest battle/Ultra Protection': 'Takes 32 off the monster\'s attack roll for 60 moves.',
  'Priest battle/Fast Heal': 'Puts your hit points back to their maximum, even in the middle of a fight.',
  'Priest battle/Major Shock': '300 damage.',
};

export function spellMechanics(spell: Spell): string {
  return SPELL_MECHANICS[spellKey(spell)] ?? NOT_DOCUMENTED;
}
