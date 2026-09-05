/** Spell names by sub-category, shared by Moraff's World and Dungeons of the Unforgiven.
 *  The in-game spell browser shows 3 columns × 10 rows = 30 named spells per sub-category;
 *  the trailing 15 bytes of each 45-byte sub-category are unused padding. */
export const SPELL_SUBCATEGORIES = [
  { key: 'permanent', title: 'Permanent' },
  { key: 'preparation', title: 'Preparation' },
  { key: 'wizard', title: 'Wizard' },
  { key: 'priest', title: 'Priest' },
] as const;

export const SLOTS_PER_SUBCATEGORY = 45;
export const NAMED_SLOTS = 30;

export const SPELL_NAMES: Record<(typeof SPELL_SUBCATEGORIES)[number]['key'], string[]> = {
  permanent: [
    'Enchant Weapon Level 1', 'Extra Health Point', 'Write Scroll to Level 3',
    'Enchant Armor Level 1', 'Extra 3 Health Points', 'Enchant Wand Level 3',
    'Enchant Weapon Level 2', 'Extra 5 Health Points', 'Enchant Ring Level 1',
    'Enchant Armor Level 2', 'Anti-Magic Ring Level 1', 'Write Scroll - Level 10',
    'Enchant Weapon Level 3', 'Enchant Ring Level 2', 'Body Armor Level 1',
    'Enchant Armor Level 3', 'Anti-Magic Ring Level 2', 'Enchant Wand Level 8',
    'Enchant Ring Level 3', 'Anti-Magic Ring Level 3', 'Body Armor Level 2',
    'Enchant Weapon Level 4', 'Enchant Armor Level 4', 'Enchant Wand Any Level',
    'Permanent Feather', 'Anti-Magic Ring Level 5', 'Extra 25 Health Points',
    'Permanent Invisibility', 'Youth', 'Body Armor Level 4',
  ],
  preparation: [
    'Enchant Armor Level 1', 'Enchant Weapon Level 1', 'Little Cure',
    'Enchant Weapon Level 2', 'Relocate', 'Detect Level',
    'Cure', 'Enchant Armor Level 2', 'Strength',
    'Enchant Weapon Level 3', 'Agility', 'Descend',
    'Ascend', 'Detect Position', 'Feather',
    'Big Cure', 'Double Ascend', 'Enchant Weapon Level 4',
    'Invisibility', 'Enchant Armor Level 3', 'Fast Move',
    'Super Strength', 'Enchant Weapon Level 5', 'Major Descend',
    'Super Agility', 'Cure Poison', 'Heal All Wounds',
    'Major Ascend', 'Cure Disease', 'Enchant Armor Level 4',
  ],
  wizard: [
    'Sleep', 'Magic Zap', 'Minor Protection',
    'Slow Enemies', 'Strength', 'Minor Shock',
    'Lightning', 'Magic Missile', 'Speed',
    'Go Away', 'Relocate', 'Power Weapon I',
    'Minor Explosion', 'Protection', 'Resist Poison',
    'Magic Zot', 'Shock', 'Anti-Cold',
    'Explosion', 'Pass Wall', 'Anti-Fire',
    'Magic Bolt', 'Major Protection', 'Power Weapon II',
    'Hold Monster', 'Drain Monster', 'Major Shock',
    'Major Explosion', 'Autokill', 'Power Weapon III',
  ],
  priest: [
    'Sleep', 'Minor Protection', 'Strength',
    'Resist Poison', 'Speed', 'Fast Cure',
    'Resist Disease', 'Relocate', 'Slow Enemies',
    'Anti-Cold', 'Go Away', 'Power Weapon I',
    'Protection', 'Anti-Fire', 'Pass Wall',
    'Resist Level Drain', 'Drain Monster', 'Fast Big Cure',
    'Hold Monster', 'Power Weapon II', 'Shock',
    'Major Protection', 'Explosion', 'Magic Zot',
    'Autokill', 'Power Weapon III', 'Strength and Speed',
    'Ultra Protection', 'Fast Heal', 'Major Shock',
  ],
};
