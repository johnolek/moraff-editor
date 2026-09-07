import spellsHelp from '../mw-spells.hlp?raw';

// Moraff's World keeps 120 spells in four categories of ten levels of three. The names on the
// menu come from a table of near pointers in the data segment (exe DS:4493, 120 entries two
// bytes apart); the paragraph the game shows when a spell is asked about comes out of
// SPELLS.HLP. Both are indexed the same way, worked out below.

/** The four spell categories, in the order the game numbers them. */
export const MW_SPELL_CATEGORIES = ['permanent', 'preparation', 'wizard', 'priest'] as const;

export type MwSpellCategory = (typeof MW_SPELL_CATEGORIES)[number];

/**
 * The four lines the spell screen's first menu offers (exe DS:4583, the first four of its eight
 * near pointers). The other four are the same categories again as "5) HELP-PERMANENT SPELLS" and
 * so on, which show the SPELLS.HLP paragraph instead of casting anything.
 */
export const MW_SPELL_CATEGORY_LABELS = [
  '1) PERMANENT SPELLS',
  '2) PREPARATION SPELLS',
  '3) WIZARD BATTLE SPELLS',
  '4) PRIEST BATTLE SPELLS',
];

/** Levels in a category, which is how many lines of three the menu draws. */
export const MW_SPELL_LEVELS = 10;

/** Spells on one line of the menu. */
export const MW_SPELLS_PER_LEVEL = 3;

/** Named spells in one category: ten levels of three. */
export const MW_SPELLS_PER_CATEGORY = MW_SPELL_LEVELS * MW_SPELLS_PER_LEVEL;

/** Records in SPELLS.HLP, which is one for every spell in the game. */
export const MW_SPELL_RECORDS = MW_SPELL_CATEGORIES.length * MW_SPELLS_PER_CATEGORY;

/**
 * Bytes a category takes in the character record's spellbook, scroll, wand and paper arrays.
 * Only the first 30 of the 45 are a spell; the rest is padding.
 */
export const MW_BOOK_SLOTS_PER_CATEGORY = 45;

/**
 * Which record of SPELLS.HLP a spell's description is (WORLD.EXE 3000:b7fd, mw.c
 * "load_spell_lines"). That function is handed the category, the level and the slot exactly as the
 * menu holds them and asks for record `category * 30 + level * 3 + slot`, so the records run in
 * menu order: 0 to 29 permanent, 30 to 59 preparation, 60 to 89 wizard, 90 to 119 priestly.
 *
 * @param category 0 permanent, 1 preparation, 2 wizard, 3 priestly.
 * @param level 1 to 10, the line of the menu.
 * @param slot 0 to 2, the spell on that line.
 */
export function mwSpellRecord(category: number, level: number, slot: number): number {
  return category * MW_SPELLS_PER_CATEGORY + (level - 1) * MW_SPELLS_PER_LEVEL + slot;
}

/**
 * Which byte of the character record's spellbook a spell is (WORLD.EXE 2000:c546, mw.c
 * "cast_spell"), counted from the start of the array rather than from the start of the file.
 *
 * The stride is 45 rather than the 30 spells a category holds, so the arrays are 180 bytes with
 * fifteen unused bytes after every category. The same number indexes the scrolls, the wands and
 * the magic paper, which are three more arrays of the same shape (record offsets 0x0177, 0x022b,
 * 0x02df and 0x0393).
 */
export function mwSpellBookSlot(category: number, level: number, slot: number): number {
  return category * MW_BOOK_SLOTS_PER_CATEGORY + (level - 1) * MW_SPELLS_PER_LEVEL + slot;
}

/**
 * What a spell costs to cast out of the spellbook (WORLD.EXE 2000:ea27, mw.c "spell_screen"):
 * one spell point per level, which is what the heading over the menu says as well — "SELECT A
 * SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:" (exe DS:4201).
 *
 * The menu refuses the spell when current spell points are below the cost, and takes the cost
 * off them once the spell has done something. A spell cast off a scroll, a wand or a piece of
 * magic paper costs nothing: one charge comes off the item instead.
 */
export function mwSpellPointCost(level: number): number {
  return level;
}

/**
 * What a permanent spell costs on top of that (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the
 * same number again, off the maximum. Casting Youth out of the book therefore takes ten spell
 * points away from the character for good.
 *
 * The subtraction is only reached for category 0, and only when the spell was cast out of the
 * spellbook rather than off a scroll, a wand or a piece of magic paper.
 */
export function mwMaximumSpellPointCost(category: number, level: number): number {
  return category === 0 ? level : 0;
}

/**
 * The keys the menu answers to (WORLD.EXE 2000:ea27, mw.c "spell_screen"): A to Z and then 1 to
 * 4, three to a line and ten lines down, so the bottom line is keyed 2, 3 and 4.
 *
 * The game reads a key, upper-cases it, turns '1' to '4' into the four characters above 'Z' by
 * adding 0x2a, and subtracts 'A' to get a number 0 to 29; the line is that over three and the
 * slot is the remainder.
 */
export const MW_SPELL_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234';

/**
 * The key printed in front of one spell.
 *
 * @param level 1 to 10.
 * @param slot 0 to 2.
 */
export function mwSpellKey(level: number, slot: number): string {
  return MW_SPELL_KEYS[(level - 1) * MW_SPELLS_PER_LEVEL + slot];
}

/**
 * One record of SPELLS.HLP as the game holds it, split into the screen lines it draws.
 *
 * load_spell_text (WORLD.EXE 2000:5938, mw.c "load_spell_text") opens the file in text mode, reads
 * characters into a buffer until it meets a '~', and turns every newline on the way into a '@'.
 * It does that once per record, counting from 0, and stops at record 119. Text mode is what
 * drops the carriage returns of the file's DOS line endings, so the mirrored copy has newlines.
 *
 * load_spell_lines (WORLD.EXE 3000:b7fd) then copies the buffer into eight line buffers, starting
 * at the buffer's second character and breaking a line at every '@'. That second character is
 * why every record but the first begins with the newline that ended the record before, and why
 * record 0 begins with a space instead: the file is written so that the character being skipped
 * is never part of the text.
 *
 * @param record 0 to 119.
 */
export function mwSpellHelp(record: number, text: string = spellsHelp): string[] {
  const records = text.split('~');
  if (record < 0 || record >= MW_SPELL_RECORDS) throw new Error(`no spell record ${record}`);
  return records[record].slice(1).split('\n');
}

/** The first line of a record, which is the heading the game prints over the description. */
export function mwSpellHeading(record: number, text: string = spellsHelp): string {
  return mwSpellHelp(record, text)[0];
}

/**
 * The classes that may cast a category out of the spellbook (WORLD.EXE 2000:ea27, mw.c
 * "spell_screen", and the same two tests again in cast_spell at 2000:c546). Classes are the
 * numbers the character record holds at offset 0x2a: 0 fighter, 1 worshipper, 2 monk, 3 wizard,
 * 4 priest, 5 sage, 6 mage.
 *
 * A fighter is turned away from the whole screen — "FIGHTERS CAN ONLY CAST SPELLS BY USING MAGIC
 * PAPER. KEEP LOOKING." — and everyone else may cast the permanent and preparation categories.
 * Only the wizard and priestly categories are gated, and only when the spell is being cast out of
 * the spellbook: a scroll, a wand or a piece of magic paper is not checked against the class.
 */
export const MW_WIZARD_CLASSES = [2, 3, 5, 6];

/** The classes that may cast the priestly category (WORLD.EXE 2000:ea27, mw.c "spell_screen"). */
export const MW_PRIESTLY_CLASSES = [1, 2, 4, 5];

/**
 * Whether a class may cast a category out of its spellbook.
 *
 * @param classIndex 0 to 6, the character record's class byte.
 * @param category 0 permanent, 1 preparation, 2 wizard, 3 priestly.
 */
export function mwCanCast(classIndex: number, category: number): boolean {
  if (classIndex === 0) return false;
  if (category === 2) return MW_WIZARD_CLASSES.includes(classIndex);
  if (category === 3) return MW_PRIESTLY_CLASSES.includes(classIndex);
  return true;
}

/**
 * The names the spell menu prints, exactly as the executable holds them (exe DS:4493, 120 near
 * pointers two bytes apart). They are indexed the same way SPELLS.HLP is, which is what ties the
 * two together: `names[category * 30 + level * 3 + slot]`.
 *
 * The heading line of a spell's SPELLS.HLP record repeats the name and then runs on into the
 * description, so it is these strings rather than that line that the menu shows. Two of them
 * differ from the file: record 10 is ANTI-MAGIC RING LEVEL 1 here and ANTI MAGIC RING LEVEL 1
 * there, and record 11 is WRITE SCROLL - LEVEL 10 here and WRITE SCROLL TO LEVEL 10 there.
 */
export const MW_SPELL_NAMES = [
  'ENCHANT WEAPON LEVEL 1', 'EXTRA HEALTH POINT', 'WRITE SCROLL TO LEVEL 3',
  'ENCHANT ARMOR LEVEL 1', 'EXTRA 3 HEALTH POINTS', 'ENCHANT WAND LEVEL 3',
  'ENCHANT WEAPON LEVEL 2', 'EXTRA 5 HEALTH POINTS', 'ENCHANT RING LEVEL 1',
  'ENCHANT ARMOR LEVEL 2', 'ANTI-MAGIC RING LEVEL 1', 'WRITE SCROLL - LEVEL 10',
  'ENCHANT WEAPON LEVEL 3', 'ENCHANT RING LEVEL 2', 'BODY ARMOR LEVEL 1',
  'ENCHANT ARMOR LEVEL 3', 'ANTI-MAGIC RING LEVEL 2', 'ENCHANT WAND LEVEL 8',
  'ENCHANT RING LEVEL 3', 'ANTI-MAGIC RING LEVEL 3', 'BODY ARMOR LEVEL 2',
  'ENCHANT WEAPON LEVEL 4', 'ENCHANT ARMOR LEVEL 4', 'ENCHANT WAND ANY LEVEL',
  'PERMANENT FEATHER', 'ANTI-MAGIC RING LEVEL 5', 'EXTRA 25 HEALTH POINTS',
  'PERMANENT INVISIBILITY', 'YOUTH', 'BODY ARMOR LEVEL 4',

  'ENCHANT ARMOR LEVEL 1', 'ENCHANT WEAPON LEVEL 1', 'LITTLE CURE',
  'ENCHANT WEAPON LEVEL 2', 'RELOCATE', 'DETECT LEVEL',
  'CURE', 'ENCHANT ARMOR LEVEL 2', 'STRENGTH',
  'ENCHANT WEAPON LEVEL 3', 'AGILITY', 'DESCEND',
  'ASCEND', 'DETECT POSITION', 'FEATHER',
  'BIG CURE', 'DOUBLE ASCEND', 'ENCHANT WEAPON LEVEL 4',
  'INVISIBILITY', 'ENCHANT ARMOR LEVEL 3', 'FAST MOVE',
  'SUPER STRENGTH', 'ENCHANT WEAPON LEVEL 5', 'MAJOR DESCEND',
  'SUPER AGILITY', 'CURE POISON', 'HEAL ALL WOUNDS',
  'MAJOR ASCEND', 'CURE DISEASE', 'ENCHANT ARMOR LEVEL 4',

  'SLEEP', 'MAGIC ZAP', 'MINOR PROTECTION',
  'SLOW ENEMIES', 'STRENGTH', 'MINOR SHOCK',
  'LIGHTNING', 'MAGIC MISSLE', 'SPEED',
  'GO AWAY', 'RELOCATE', 'POWER WEAPON I',
  'MINOR EXPLOSION', 'PROTECTION', 'RESIST POISON',
  'MAGIC ZOT', 'SHOCK', 'ANTI-COLD',
  'EXPLOSION', 'PASS WALL', 'ANTI-FIRE',
  'MAGIC BOLT', 'MAJOR PROTECTION', 'POWER WEAPON II',
  'HOLD MONSTER', 'DRAIN MONSTER', 'MAJOR SHOCK',
  'MAJOR EXPLOSION', 'AUTOKILL', 'POWER WEAPON III',

  'SLEEP', 'MINOR PROTECTION', 'STRENGTH',
  'RESIST POISON', 'SPEED', 'FAST CURE',
  'RESIST DISEASE', 'RELOCATE', 'SLOW ENEMIES',
  'ANTI-COLD', 'GO AWAY', 'POWER WEAPON I',
  'PROTECTION', 'ANTI-FIRE', 'PASS WALL',
  'RESIST LEVEL DRAIN', 'DRAIN MONSTER', 'FAST BIG CURE',
  'HOLD MONSTER', 'POWER WEAPON II', 'SHOCK',
  'MAJOR PROTECTION', 'EXPLOSION', 'MAGIC ZOT',
  'AUTOKILL', 'POWER WEAPON III', 'STRENGTH AND SPEED',
  'ULTRA PROTECTION', 'FAST HEAL', 'MAJOR SHOCK',
];

/**
 * The rows of the weapon table (exe DS:01c0, seven bytes apiece) that a power weapon spell puts
 * you on. Power weapon level N sends strike (WORLD.EXE 2000:5bef) to row N + 8 for the damage
 * die it rolls, so the three spells give the dice below — the row labelled POWER WEAPON 1, whose
 * die is 69, is never reached.
 *
 * Only the die is taken from that row: the to-hit bonus strike adds comes from the weapon
 * actually in your hand, at the row the equipped-weapon byte names.
 */
export const MW_POWER_WEAPON_DICE = [129, 199, 399];
