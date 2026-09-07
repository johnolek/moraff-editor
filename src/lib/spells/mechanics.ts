import type { Spell } from './spells';

/** The key a spell has in the table: names repeat between the four lists. */
export function spellKey(spell: Spell): string {
  return `${spell.typeName}/${spell.name}`;
}

/**
 * The spells whose in-game help text the code contradicts, from the
 * reverse-engineering notes in dotu-tools/docs and the FAQ section [SPMC] they
 * were written from. A spell missing from the table does what its help text says.
 */
export const SPELL_CORRECTIONS: Record<string, string> = {
  'Permanent/Enchant Weapon Level 1':
    'Sets the plus of the one weapon you pick to exactly 1 instead of adding to it, so it will ruin a plus 25 weapon from a boss. The plus is added to your attack roll.',
  'Permanent/Enchant Weapon Level 2': 'Sets the plus of the one weapon you pick to exactly 2, up or down.',
  'Permanent/Enchant Weapon Level 3': 'Sets the plus of the one weapon you pick to exactly 3, up or down.',
  'Permanent/Enchant Weapon Level 4': 'Sets the plus of the one weapon you pick to exactly 4, up or down.',
  'Permanent/Enchant Armor Level 1':
    'Sets the plus of the one armor you pick to exactly 1 instead of adding to it. The plus goes on the defense score a monster\'s attack roll has to beat.',
  'Permanent/Enchant Armor Level 2': 'Sets the plus of the one armor you pick to exactly 2, up or down.',
  'Permanent/Enchant Armor Level 3': 'Sets the plus of the one armor you pick to exactly 3, up or down.',
  'Permanent/Enchant Armor Level 4': 'Sets the plus of the one armor you pick to exactly 4, up or down.',
  'Permanent/Anti Magic Ring Level 1':
    'Nothing in the combat or the spell code ever reads the anti-magic ring, so this costs you 4 maximum spell points when cast from the book and does nothing at all.',
  'Permanent/Anti-Magic Ring Level 2':
    'The anti-magic ring is never read by any formula in the game: 6 maximum spell points from the book for nothing.',
  'Permanent/Anti-Magic Ring Level 3':
    'Another ring no formula in the game ever reads: 7 maximum spell points from the book for nothing.',
  'Permanent/Anti-Magic Ring Level 5':
    'The strongest anti-magic ring, and just as unread by the game as the others: 9 maximum spell points from the book for nothing.',
  'Permanent/Permanent Invisibility':
    'Only changes a monster\'s first strike: the delay it normally skips 1 time in 3 applies anyway when rand(1.5 x depth) comes out above your level. Unlike the preparation Invisibility it never stops monsters moving.',
  'Permanent/Youth':
    'Sets your age to 20 and multiplies your experience by 0.9. It does not give back the Strength and Constitution that ageing took.',

  'Preparation/Little Cure':
    'Heals half your wisdom, rounded down. There is no random part, whatever the 1-20 in the help text suggests.',
  'Preparation/Descend':
    'One floor down, onto a random open square, and never past the bottom of the module: floor 25, 45, 65, 85 or 105.',
  'Preparation/Ascend':
    'One floor up, onto a random open square. It does not work from floor 66 or deeper, though the message says the 64th.',
  'Preparation/Double Ascend': 'Two floors up, onto a random open square. It does not work from floor 66 or deeper.',
  'Preparation/Major Ascend': 'Ten floors up, onto a random open square. It does not work from floor 66 or deeper.',

  'Wizard battle/Go Away':
    'Teleports the monster away every single time. There is no level ratio check at all, whatever the help text says, but it does nothing to a Shadow boss.',
  'Wizard battle/Power Weapon I':
    'Your damage die becomes 129 for 60 moves, the row after the one the weapon table labels POWER WEAPON 1. The to-hit bonus, magic plus and speed of the weapon in your hand still apply; the plus 3 in the help text is used nowhere.',
  'Wizard battle/Power Weapon II':
    'Your damage die becomes 199 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Wizard battle/Power Weapon III':
    'Your damage die becomes 399 for 60 moves, the biggest die in the weapon table; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Wizard battle/Resist Poison':
    'Blocks poison completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a poison you already carry.',
  'Wizard battle/Resist Level Drain':
    'Blocks a level drain completely for 60 moves — 100%, not the 90% the help text claims.',
  'Wizard battle/Pass Wall':
    'Moves you 2 to 19 squares in the direction you pick, to the first square that far away that is inside the map, not rock and has no monster on it, through whatever walls lie between. If no square within 19 qualifies nothing happens and the spell points are spent.',

  'Priest battle/Go Away':
    'Teleports the monster away every single time. There is no level ratio check at all, whatever the help text says, but it does nothing to a Shadow boss.',
  'Priest battle/Power Weapon I':
    'Your damage die becomes 129 for 60 moves, the row after the one the weapon table labels POWER WEAPON 1. The to-hit bonus, magic plus and speed of the weapon in your hand still apply; the plus 3 in the help text is used nowhere.',
  'Priest battle/Power Weapon II':
    'Your damage die becomes 199 for 60 moves; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Priest battle/Power Weapon III':
    'Your damage die becomes 399 for 60 moves, the biggest die in the weapon table; the weapon in your hand keeps its to-hit bonus, magic plus and speed.',
  'Priest battle/Resist Poison':
    'Blocks poison completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a poison you already carry.',
  'Priest battle/Resist Disease':
    'Blocks disease completely for 60 moves — 100%, not the 95% the help text claims — and pauses the counter of a disease you already carry.',
  'Priest battle/Resist Level Drain':
    'Blocks a level drain completely for 60 moves — 100%, not the 90% the help text claims.',
  'Priest battle/Protection':
    'Sets protection level 1, the same as Minor Protection, so it takes only 2 off the monster\'s attack roll where the wizard\'s Protection takes 8. That looks like a bug: a priest goes from 2 straight to Major Protection\'s 18.',
  'Priest battle/Pass Wall':
    'Moves you 2 to 19 squares in the direction you pick, to the first square that far away that is inside the map, not rock and has no monster on it, through whatever walls lie between. If no square within 19 qualifies nothing happens and the spell points are spent.',
};

export function spellCorrection(spell: Spell): string | null {
  return SPELL_CORRECTIONS[spellKey(spell)] ?? null;
}

/** What holds for a whole spell list, keyed by the list's name. */
export const LIST_NOTES: Record<string, string> = {
  Preparation: 'Preparation spells last until you rest at an inn; the inn clears every one of them.',
  Permanent:
    'Permanent spells can only be cast in town. Cast from your book, each one lowers your maximum spell points by its cost for good; from a scroll, wand or paper it costs nothing.',
};
