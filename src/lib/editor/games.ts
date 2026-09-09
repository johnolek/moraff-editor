import type { GameId } from '../app-state.svelte';
import { fixSaveChecksum, SAVE_SIZE } from '../game/dotu-files.js';
import { REV_CLASS_NAMES, REV_RACE_NAMES } from '../game/rev-port/character';
import { formatRevRecord, parseRevRecord } from '../game/rev-port/record';
import type { GameSchema } from './schema';

const WEAPONS = ['Fists', 'Stick', 'Club', 'Mace', 'Knife', 'Short Sword', 'Long Sword', 'Great Sword'];
const ARMOR = ['Skin', 'Leather', 'Chain', 'Scale', 'Breast Plate', 'Field Plate', 'Titanium', 'Slot 8 (glitch)'];
const CLASSES = ['Fighter', 'Worshipper', 'Monk', 'Wizard', 'Priest', 'Sage', 'Mage'];
const FACINGS = ['North', 'South', 'West', 'East'];
const PERMANENCE = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Preparation (temporary)' },
  { value: 100, label: 'Permanent' },
];

// Race/class lists per the game's own ROLL.TXT. The classes match DotU's, but the races
// are MW's own. The byte layout is identical to DotU: race @0x28, gender @0x29, class @0x2a,
// confirmed by diffing real save files.
/** The six characteristics of Moraff's Revenge, in the order CHCHAR.EXE prints them. */
const REV_STAT_LABELS = ['Strength', 'Intelligence', 'Wisdom', 'Health', 'Agility', 'Laziness'];

const MORAFFS_WORLD_RACES = ['Human', 'Elf', 'Dwarf', 'Hobbit', 'Gnome', 'Ogre', 'Sprite', 'Imp'];
const MORAFFS_WORLD_STONES = ['Copper', 'Silver', 'Ivory', 'Gold', 'Platinum', 'Jewel'];

export const MORAFFS_WORLD: GameSchema = {
  id: 'moraffsWorld',
  displayName: "Moraff's World",
  fileSize: 2344,
  sections: [
    {
      title: 'Identity',
      fields: [
        { kind: 'string', offset: 0x0000, length: 32, label: 'Character Name' },
        { kind: 'enum_uint8', offset: 0x0028, label: 'Race', choices: MORAFFS_WORLD_RACES },
        { kind: 'enum_uint8', offset: 0x0029, label: 'Gender', choices: ['Male', 'Female'] },
        { kind: 'enum_uint8', offset: 0x002a, label: 'Class', choices: CLASSES },
      ],
    },
    {
      title: 'Level & Experience',
      fields: [
        { kind: 'int16', offset: 0x07a8, label: 'Player Level' },
        {
          kind: 'float64',
          offset: 0x0858,
          label: 'Experience Points',
          hint: 'Setting this to roughly 5.3 × 10¹⁵ and then resting at an inn levels the character to 100.',
        },
      ],
    },
    {
      title: 'Vitals',
      fields: [
        { kind: 'int16', offset: 0x0031, label: 'Current HP' },
        { kind: 'int16', offset: 0x0033, label: 'Maximum HP' },
        { kind: 'float32', offset: 0x0035, label: 'Current SP' },
        { kind: 'float32', offset: 0x0039, label: 'Maximum SP' },
        {
          kind: 'int16',
          offset: 0x003d,
          label: 'Height (inches)',
          hint: 'Stored as raw inches (a 93-inch character reads 93). Note this differs from DotU, which stores height ÷ 4.',
        },
        { kind: 'int16', offset: 0x003f, label: 'Naked Weight' },
        { kind: 'int16', offset: 0x0041, label: 'Loaded Weight', hint: 'Game recalculates this on play.' },
        {
          kind: 'int32',
          offset: 0x07d6,
          label: 'Age (minutes)',
          hint: 'Age in minutes, not years: 525,600 to the year, so a 65-year-old reads 34,164,000. The game ages the character as time passes, which is why a played character is rarely a whole number of years old.',
        },
      ],
    },
    {
      title: 'Stats',
      fields: [
        { kind: 'int16', offset: 0x0812, label: 'Strength' },
        { kind: 'int16', offset: 0x0814, label: 'Intelligence' },
        { kind: 'int16', offset: 0x0816, label: 'Wisdom' },
        { kind: 'int16', offset: 0x0818, label: 'Constitution' },
        { kind: 'int16', offset: 0x081a, label: 'Agility / Dexterity' },
        { kind: 'int16', offset: 0x081c, label: 'Luck' },
      ],
    },
    {
      title: 'Money',
      note: 'Jewels are the only money the game spends: the store, the inn, the temple and the boat all take jewels from the pocket, and the stats screen\u2019s TOTAL MONEY is pocket plus bank. Stones are not counted there and nothing takes them as payment.',
      fields: [
        { kind: 'int32', offset: 0x0454, label: 'Jewels in Pocket' },
        { kind: 'int32', offset: 0x0458, label: 'Jewels in Bank' },
      ],
    },
    {
      title: 'Stones',
      note: 'Only the bank turns stones into jewels, all at once and one way: 200 copper, 12 silver, 4 ivory or 2 gold stones make one jewel, a platinum stone makes five and a jewel stone makes one. Each kind is divided on its own, rounded down, and every counter is then set to zero, so the remainder is lost: 199 copper stones become nothing. Save up and convert once.',
      fields: [{ kind: 'counter_list', offset: 0x045c, stride: 4, itemKind: 'int32', names: MORAFFS_WORLD_STONES }],
    },
    {
      title: 'Position',
      note: 'Warp the character by changing Current Floor and the X/Y coordinates. A new character starts in dungeon 0.',
      fields: [
        { kind: 'enum_uint8', offset: 0x07aa, label: 'Facing Direction', choices: FACINGS },
        { kind: 'int16', offset: 0x07ac, label: 'Position X' },
        { kind: 'int16', offset: 0x07ae, label: 'Position Y' },
        { kind: 'int16', offset: 0x07b0, label: 'Current Floor' },
        {
          kind: 'int16',
          offset: 0x07b2,
          label: 'Dungeon',
          hint: 'Which dungeon the character is in. The number goes into the hash every floor is generated from, so another one is a whole different set of floors — and the maps the character has explored are for the old one. A new character starts in 0; the gate on floor 0 leads to the world map, and going in from a different square there gives a number between −3,204 and 3,528.',
        },
        {
          kind: 'uint8',
          offset: 0x07b4,
          label: 'Map Cursor X',
          hint: 'Where the character sits in the scrolling map view, not on the floor. The game recomputes both of these from the video mode whenever play starts.',
        },
        { kind: 'uint8', offset: 0x07b5, label: 'Map Cursor Y' },
        {
          kind: 'int16',
          offset: 0x07f8,
          label: 'Overworld X',
          hint: 'Position on the 64 × 64 world map, in sixty-fourths of a tile: a new character starts on 2146, which is tile 33.',
        },
        { kind: 'int16', offset: 0x07fa, label: 'Overworld Y' },
        {
          kind: 'int16',
          offset: 0x0804,
          label: 'Return Dungeon',
          hint: 'Half of the raise-dead contract the temple sells. Dying with one puts the character back in this dungeon, on floor 0, at Return X and Y, and spends it; −1 in Return X means there is no contract, and dying deletes the character.',
        },
        { kind: 'int16', offset: 0x0806, label: 'Return X' },
        { kind: 'int16', offset: 0x0808, label: 'Return Y' },
        {
          kind: 'int32',
          offset: 0x080a,
          label: 'Unused Counter',
          hint: 'A new character starts on 300, and the temple screen resets it to the player level times 500 plus a small roll, capped at 500,000. Nothing in the game ever reads it back.',
        },
      ],
    },
    {
      title: 'Weapons',
      fields: [
        { kind: 'owned_list', ownedOffset: 0x0081, levelOffset: 0x008e, count: 8, names: WEAPONS },
        { kind: 'enum_uint8', offset: 0x009b, label: 'Currently Equipped', choices: WEAPONS },
      ],
    },
    {
      title: 'Armor',
      fields: [
        { kind: 'owned_list', ownedOffset: 0x00b0, levelOffset: 0x00b8, count: 8, names: ARMOR },
        { kind: 'enum_uint8', offset: 0x00c0, label: 'Currently Equipped', choices: ARMOR },
      ],
    },
    {
      title: 'Vitamin Pills',
      note: 'Each pill raises one characteristic by 4 and lowers another by 2 when swallowed (take_pill, WORLD.EXE 3000:9ac0).',
      fields: [
        { kind: 'int8', offset: 0x015d, label: 'Orange  (+4 STR / −2 LCK)' },
        { kind: 'int8', offset: 0x015e, label: 'Green   (+4 INT / −2 AGI)' },
        { kind: 'int8', offset: 0x015f, label: 'Blue    (+4 WIS / −2 CON)' },
        { kind: 'int8', offset: 0x0160, label: 'Red     (+4 CON / −2 WIS)' },
        { kind: 'int8', offset: 0x0161, label: 'White   (+4 AGI / −2 INT)' },
        { kind: 'int8', offset: 0x0162, label: 'Yellow  (+4 LCK / −2 STR)' },
      ],
    },
    {
      title: 'Afflictions',
      note: 'Active disease or poison. The timer counts down each turn until it damages the affected stat. Set to 0 or −1 to clear the affliction entirely.',
      fields: [
        { kind: 'int16', offset: 0x07ca, label: 'Disease Timer', hint: 'Damages Constitution when it hits zero.' },
        { kind: 'int16', offset: 0x07cc, label: 'Poison Timer', hint: 'Damages Strength when it hits zero.' },
      ],
    },
    {
      title: 'Special Items',
      fields: [
        { kind: 'int16', offset: 0x080e, label: 'Potions of Healing' },
        {
          kind: 'int16',
          offset: 0x0810,
          label: 'Stones of Teleportation',
          hint: 'Signed 16-bit. The game can show negative values if the upstream byte at 0x0811 was non-zero — setting any value here cleans both bytes.',
        },
        { kind: 'uint8', offset: 0x07c8, label: 'Holy Hand Grenades' },
        { kind: 'uint8', offset: 0x07c9, label: 'Stones of Seeing' },
        { kind: 'int8', offset: 0x07fe, label: 'Floor Sloshers' },
        { kind: 'select_uint8', offset: 0x07d3, label: 'Feather', choices: PERMANENCE },
        { kind: 'select_uint8', offset: 0x07d5, label: 'Invisibility', choices: PERMANENCE },
        { kind: 'select_uint8', offset: 0x07d4, label: 'Fast Move', choices: PERMANENCE },
      ],
    },
    {
      title: 'Rings & Worn Items',
      note: "Body Armor stores a level (the in-game UI displays it as 'LEVEL N'). The rings and gauntlets store a bonus value (displayed as 'PLUS N').",
      fields: [
        { kind: 'uint8', offset: 0x07c6, label: 'Rings of Regeneration' },
        { kind: 'uint8', offset: 0x07d0, label: 'Body Armor Level' },
        { kind: 'uint8', offset: 0x07d1, label: 'Ring of Protection (+N)' },
        { kind: 'uint8', offset: 0x07d2, label: 'Anti-Magic Ring (+N)' },
        { kind: 'int8', offset: 0x0846, label: 'Gauntlets (+N)' },
      ],
    },
    {
      // The two enchant bonuses come from FUN_2000_c4be and FUN_2000_c49c (WORLD.EXE 2000:c4be
      // and 2000:c49c); the four stat markers are written in the spell dispatcher FUN_2000_d358
      // (2000:d358) and cleared by the inn's FUN_2000_2e6c (2000:2e6c), which subtracts the
      // bonus it handed out. FUN_2000_7421 (2000:7421) is the screen that lists all six.
      title: 'Preparation Spells in Effect',
      note: 'The preparation spells still running. A night at the inn clears every one of them, and for the four stat markers it also takes the bonus back off the stat — so zeroing one here by hand leaves those points on the stat for good.',
      fields: [
        {
          kind: 'uint8',
          offset: 0x07ce,
          label: 'Enchant Weapon Level',
          hint: 'A plus added to the attack roll, on top of whatever the weapon in hand is worth. The preparation Enchant Weapon spells set it to 1 through 5.',
        },
        {
          kind: 'uint8',
          offset: 0x07cf,
          label: 'Enchant Armor Level',
          hint: "A plus taken off a monster's attack roll, on top of whatever the armor worn is worth. The preparation Enchant Armor spells set it to 1 through 4.",
        },
        { kind: 'uint8', offset: 0x07da, label: 'Preparation Strength', hint: 'The Strength spell writes 5 here and adds 5 to Strength.' },
        { kind: 'uint8', offset: 0x07db, label: 'Preparation Agility', hint: 'The Agility spell writes 5 here and adds 5 to Agility / Dexterity.' },
        { kind: 'uint8', offset: 0x07dc, label: 'Super Strength', hint: 'The Super Strength spell writes 10 here and adds 10 to Strength.' },
        { kind: 'uint8', offset: 0x07dd, label: 'Super Agility', hint: 'The Super Agility spell writes 10 here and adds 10 to Agility / Dexterity.' },
      ],
    },
    {
      // Every one of these is ticked down by FUN_2000_7e4f (WORLD.EXE 2000:7e4f), which is what
      // settles the widths, and cleared wholesale by FUN_2000_86b9 (2000:86b9), the inn's. The
      // spells that set them are FUN_2000_cb43 and FUN_2000_cb6d (strength, speed), FUN_2000_cf08
      // (power weapon), FUN_2000_cf6c (protection), FUN_2000_cfd0, FUN_2000_d006, FUN_2000_d03c,
      // FUN_2000_d072 and FUN_2000_d0a8 (the five resists) and FUN_2000_caba (sleep); the
      // dispatcher FUN_2000_d358 (2000:d358) writes Slow Enemies and Hold Monster itself.
      // FUN_2000_7421 (2000:7421) is the screen that lists them, and supplied the labels.
      title: 'Battle Spell Timers',
      note: 'Moves left on each battle-spell effect; a spell cast again while it runs adds 60 more moves. Set a timer to 0 to clear it. Beware: Power Weapon and Protection each keep a level beside their timer, and the game only clears that level when the timer counts down from above zero — a level left standing over a zero timer stays until a night at the inn or a hole dug through the floor.',
      fields: [
        {
          kind: 'int16',
          offset: 0x07de,
          label: 'Strength Timer',
          hint: 'Strength is 7 higher while this runs, and the game takes the 7 back off when it reaches zero.',
        },
        {
          kind: 'int16',
          offset: 0x07e0,
          label: 'Speed Timer',
          hint: 'Agility / Dexterity is 7 higher while this runs, and the game takes the 7 back off when it reaches zero.',
        },
        { kind: 'int16', offset: 0x07e2, label: 'Slow Enemies Timer' },
        { kind: 'uint8', offset: 0x07e4, label: 'Power Weapon Level', hint: 'A level rather than a timer: 1, 2 or 3, one per Power Weapon spell.' },
        { kind: 'int16', offset: 0x07e5, label: 'Power Weapon Timer' },
        {
          kind: 'select_uint8',
          offset: 0x07e7,
          label: 'Protection Level',
          choices: [
            { value: 0, label: 'None' },
            { value: 1, label: 'Minor Protection' },
            { value: 2, label: 'Protection' },
            { value: 3, label: 'Major Protection' },
            { value: 4, label: 'Ultra Protection' },
          ],
          hint: "Takes 2 × level² off a monster's attack roll, so 2, 8, 18 or 32.",
        },
        { kind: 'int16', offset: 0x07e8, label: 'Protection Timer' },
        { kind: 'int16', offset: 0x07ea, label: 'Resist Poison Timer' },
        { kind: 'int16', offset: 0x07ec, label: 'Resist Disease Timer' },
        { kind: 'int16', offset: 0x07ee, label: 'Anti-Cold Timer', hint: 'Halves a cold attack rather than preventing it.' },
        { kind: 'int16', offset: 0x07f0, label: 'Anti-Fire Timer', hint: 'Halves a fire attack rather than preventing it.' },
        { kind: 'int16', offset: 0x07f2, label: 'Resist Level Drain Timer' },
        {
          kind: 'int16',
          offset: 0x07f4,
          label: 'Sleep Timer',
          hint: "Counts the engaged monster's own turns rather than moves; the spell sets 10 of them.",
        },
        {
          kind: 'int16',
          offset: 0x07f6,
          label: 'Hold Monster Timer',
          hint: "The same count of the monster's turns as Sleep; the spell sets 15 of them.",
        },
      ],
    },
    {
      title: 'Trapdoor Keys',
      note: 'One key per floor (10, 20, … 200). Each key allows use of trapdoors leading to that floor.',
      fields: [{ kind: 'checkbox_list', offset: 0x081f, names: Array.from({ length: 20 }, (_, i) => `Floor ${(i + 1) * 10}`) }],
    },
    {
      title: 'Spellbook',
      note: 'Spells the character has learned and can cast directly using spell points. Each entry is binary — check a box to grant the spell, uncheck to remove. Layout mirrors the in-game spell browser (3 columns × 10 rows per sub-category).',
      fields: [{ kind: 'spell_list', offset: 0x0177, binary: true }],
    },
    { title: 'Scrolls', fields: [{ kind: 'spell_list', offset: 0x022b }] },
    { title: 'Wands', fields: [{ kind: 'spell_list', offset: 0x02df }] },
    { title: 'Papers', fields: [{ kind: 'spell_list', offset: 0x0393 }] },
  ],
};

const UNFORGIVEN_RACES = ['Humanoid', 'Ape', 'Childman', 'Rodent', 'Hobo', 'Giant', 'Midget', 'Shrimp'];

export const UNFORGIVEN: GameSchema = {
  id: 'unforgiven',
  displayName: 'Dungeons of the Unforgiven',
  fileSize: SAVE_SIZE,
  // Without a valid checksum the game boots the player back to DOS with "corrupted character".
  onSave: fixSaveChecksum,
  sections: [
    {
      title: 'Identity',
      fields: [
        { kind: 'string', offset: 0x0000, length: 18, label: 'Character Name' },
        { kind: 'enum_uint8', offset: 0x0028, label: 'Race', choices: UNFORGIVEN_RACES },
        { kind: 'enum_uint8', offset: 0x0029, label: 'Gender', choices: ['Male', 'Female'] },
        { kind: 'enum_uint8', offset: 0x002a, label: 'Class', choices: CLASSES },
      ],
    },
    {
      title: 'Level & Experience',
      fields: [
        { kind: 'int16', offset: 0x07ac, label: 'Player Level' },
        { kind: 'float64', offset: 0x07a4, label: 'Experience Points' },
      ],
    },
    {
      title: 'Vitals',
      fields: [
        { kind: 'int16', offset: 0x0031, label: 'Current HP' },
        { kind: 'int16', offset: 0x0033, label: 'Maximum HP' },
        { kind: 'float32', offset: 0x0035, label: 'Current SP' },
        { kind: 'float32', offset: 0x0039, label: 'Maximum SP' },
        { kind: 'int16', offset: 0x003d, label: 'Height (÷ 4)', hint: 'Stored as inches/4. Set to 18 for a 72-inch character.' },
        { kind: 'int16', offset: 0x003f, label: 'Naked Weight' },
        { kind: 'int16', offset: 0x0041, label: 'Loaded Weight', hint: 'Game recalculates this on play.' },
        { kind: 'int32', offset: 0x07da, label: 'Age' },
      ],
    },
    {
      title: 'Stats',
      fields: [
        { kind: 'int16', offset: 0x0816, label: 'Strength' },
        { kind: 'int16', offset: 0x0818, label: 'Intelligence' },
        { kind: 'int16', offset: 0x081a, label: 'Wisdom' },
        { kind: 'int16', offset: 0x081c, label: 'Constitution' },
        { kind: 'int16', offset: 0x081e, label: 'Agility' },
        { kind: 'int16', offset: 0x0820, label: 'Luck' },
      ],
    },
    {
      title: 'Money & Resources',
      fields: [
        { kind: 'int32', offset: 0x0454, label: 'Rubles in Pocket' },
        { kind: 'int32', offset: 0x0458, label: 'Rubles in Bank' },
        { kind: 'int32', offset: 0x0464, label: 'Culture Stock' },
        { kind: 'int32', offset: 0x0468, label: 'Children Helped' },
        { kind: 'int32', offset: 0x046c, label: 'Magic Crystals' },
        { kind: 'int32', offset: 0x0470, label: 'American Dollars' },
      ],
    },
    {
      title: 'Position',
      note: 'Warp the character by changing Current Floor and the X/Y coordinates. Module = 0 for the main game.',
      fields: [
        { kind: 'enum_uint8', offset: 0x07ae, label: 'Facing Direction', choices: FACINGS },
        { kind: 'int16', offset: 0x07b0, label: 'Position X' },
        { kind: 'int16', offset: 0x07b2, label: 'Position Y' },
        { kind: 'int16', offset: 0x07b4, label: 'Current Floor' },
        { kind: 'int16', offset: 0x07b6, label: 'Module' },
      ],
    },
    {
      title: 'Weapons',
      fields: [
        { kind: 'owned_list', ownedOffset: 0x0081, levelOffset: 0x008e, count: 8, names: WEAPONS },
        { kind: 'enum_uint8', offset: 0x009b, label: 'Currently Equipped', choices: WEAPONS },
      ],
    },
    {
      title: 'Armor',
      fields: [
        { kind: 'owned_list', ownedOffset: 0x00b0, levelOffset: 0x00b8, count: 8, names: ARMOR },
        { kind: 'enum_uint8', offset: 0x00c0, label: 'Currently Equipped', choices: ARMOR },
      ],
    },
    {
      title: 'Potions',
      note: 'Each potion bumps one stat by +6 and another by −3 when consumed.',
      fields: [
        { kind: 'int8', offset: 0x015d, label: 'Orange  (+6 STR / −3 LCK)' },
        { kind: 'int8', offset: 0x015e, label: 'Green   (+6 INT / −3 AGI)' },
        { kind: 'int8', offset: 0x015f, label: 'Blue    (+6 WIS / −3 CON)' },
        { kind: 'int8', offset: 0x0160, label: 'Red     (+6 CON / −3 WIS)' },
        { kind: 'int8', offset: 0x0161, label: 'White   (+6 AGI / −3 INT)' },
        { kind: 'int8', offset: 0x0162, label: 'Yellow  (+6 LCK / −3 STR)' },
      ],
    },
    {
      title: 'Afflictions',
      note: 'Active disease or poison. The timer counts down each turn until it damages the affected stat. Set to 0 or −1 to clear the affliction entirely.',
      fields: [
        { kind: 'int16', offset: 0x07ce, label: 'Disease Timer', hint: 'Damages Constitution when it hits zero.' },
        { kind: 'int16', offset: 0x07d0, label: 'Poison Timer', hint: 'Damages Strength when it hits zero.' },
      ],
    },
    {
      title: 'Special Items',
      fields: [
        { kind: 'int16', offset: 0x0812, label: 'Potions of Healing' },
        { kind: 'int16', offset: 0x0814, label: 'Stones of Teleportation' },
        { kind: 'uint8', offset: 0x07cc, label: 'Nuclear Hand Grenades' },
        { kind: 'uint8', offset: 0x07cd, label: 'Stones of Seeing' },
        { kind: 'int8', offset: 0x0802, label: 'Floor Sloshers' },
      ],
    },
    {
      title: 'Rings & Worn Items',
      note: "Body Armor stores a level. The rings and gauntlets store a bonus value (the in-game UI shows it as 'PLUS N').",
      fields: [
        { kind: 'uint8', offset: 0x07ca, label: 'Rings of Regeneration' },
        { kind: 'uint8', offset: 0x07d4, label: 'Body Armor' },
        { kind: 'uint8', offset: 0x07d5, label: 'Ring of Protection' },
        { kind: 'uint8', offset: 0x07d6, label: 'Anti-Magic Ring' },
        { kind: 'int8', offset: 0x0853, label: 'Gauntlets' },
      ],
    },
    {
      title: 'Preparation Spells in Effect',
      fields: [
        { kind: 'uint8', offset: 0x07d2, label: 'Enchant Weapon Level' },
        { kind: 'uint8', offset: 0x07d3, label: 'Enchant Armor Level' },
        { kind: 'select_uint8', offset: 0x07d7, label: 'Feather', choices: PERMANENCE },
        {
          kind: 'select_uint8',
          offset: 0x07d8,
          label: 'Fast Move',
          choices: [
            { value: 0, label: 'None' },
            { value: 1, label: 'Preparation (temporary)' },
            { value: 2, label: 'Permanent (any value > 1)' },
          ],
          hint: 'Any value > 1 makes it stick around like a permanent.',
        },
        { kind: 'select_uint8', offset: 0x07d9, label: 'Invisibility', choices: PERMANENCE },
        { kind: 'uint8', offset: 0x07de, label: 'Preparation Strength' },
        { kind: 'uint8', offset: 0x07df, label: 'Preparation Agility' },
        { kind: 'uint8', offset: 0x07e0, label: 'Super Strength' },
        { kind: 'uint8', offset: 0x07e1, label: 'Super Agility' },
      ],
    },
    {
      title: 'Battle Spell Timers',
      note: 'Turns remaining on each battle-spell effect. Set to 0 to clear. Beware: Power Weapon and Protection share a level/timer pair — if the level is non-zero while the timer is ≤ 0, that spell never wears off until an inn stay.',
      fields: [
        { kind: 'int16', offset: 0x07e2, label: 'Strength Timer' },
        { kind: 'int16', offset: 0x07e4, label: 'Speed Timer' },
        { kind: 'int16', offset: 0x07e6, label: 'Slow Enemies Timer' },
        { kind: 'uint8', offset: 0x07e8, label: 'Power Weapon Level' },
        { kind: 'int16', offset: 0x07e9, label: 'Power Weapon Timer' },
        {
          kind: 'select_uint8',
          offset: 0x07eb,
          label: 'Protection Level',
          choices: [
            { value: 0, label: 'None' },
            { value: 1, label: 'Minor Protection' },
            { value: 2, label: 'Protection' },
            { value: 3, label: 'Major Protection' },
            { value: 4, label: 'Ultra Protection' },
          ],
        },
        { kind: 'int16', offset: 0x07ec, label: 'Protection Timer' },
        { kind: 'int16', offset: 0x07ee, label: 'Resist Poison Timer' },
        { kind: 'int16', offset: 0x07f0, label: 'Resist Disease Timer' },
        { kind: 'int16', offset: 0x07f2, label: 'Anti-Cold Timer' },
        { kind: 'int16', offset: 0x07f4, label: 'Anti-Fire Timer' },
        { kind: 'int16', offset: 0x07f6, label: 'Resist Level Drain Timer' },
        { kind: 'int16', offset: 0x07f8, label: 'Sleep Timer' },
        { kind: 'int16', offset: 0x07fa, label: 'Hold Monster Timer' },
      ],
    },
    {
      title: 'Trapdoor Keys',
      note: 'One key per floor (0, 5, 10, … 100). Each key allows use of trapdoors leading to that floor.',
      fields: [{ kind: 'checkbox_list', offset: 0x0822, names: Array.from({ length: 21 }, (_, i) => `Floor ${i * 5}`) }],
    },
    {
      title: 'Spellbook',
      note: 'Spells the character has learned and can cast directly using spell points. Each entry is binary — check a box to grant the spell.',
      fields: [{ kind: 'spell_list', offset: 0x0177, binary: true }],
    },
    { title: 'Scrolls', fields: [{ kind: 'spell_list', offset: 0x022b }] },
    { title: 'Wands', fields: [{ kind: 'spell_list', offset: 0x02df }] },
    { title: 'Papers', fields: [{ kind: 'spell_list', offset: 0x0393 }] },
    {
      title: 'Misc',
      fields: [
        { kind: 'enum_uint8', offset: 0x08f6, label: 'Difficulty', choices: ['Normal', 'I can handle anything!'] },
        {
          kind: 'uint8',
          offset: 0x0854,
          label: 'Fill HP/SP on Load',
          hint: 'Non-zero refills HP and SP to maximum on load (then resets to 0). Docs claim this is a 16-bit field, but the next byte appears to belong to a different field, so the editor treats it as a single byte.',
        },
      ],
    },
  ],
};


/**
 * Moraff's Revenge keeps a character in a text file, `<n>.EXE`, which BASIC's `WRITE #` wrote:
 * 311 lines holding 340 numbers, and nine of the fields shifted by a fixed amount so that nothing
 * a player would want to raise appears in the file as itself. Every offset quoted here is in
 * DUNSMALL.EXE's code segment, the way `rev-tools/docs/SURVEY.md` quotes them, except CHCHAR's,
 * which are offsets in CHCHAR.EXE.
 */
export const MORAFFS_REVENGE: GameSchema = {
  id: 'revenge',
  displayName: "Moraff's Revenge",
  record: 'text',
  readRecord: parseRevRecord,
  writeRecord: formatRevRecord,
  sections: [
    {
      title: 'Identity',
      note: "The name is not in this file at all. It lives in F5.COM, one quoted name to a line with END on the last, and a character's number is its line.",
      fields: [
        {
          kind: 'text_enum',
          value: 161,
          label: 'Race',
          choices: REV_RACE_NAMES.map((name, index) => ({ value: index + 1, label: name })),
          hint: 'CHCHAR.EXE writes the race into the last array and nothing reads it back that has been found. All it decides is the six numbers a roll starts from, and every race adds up to the same 24.',
        },
        {
          kind: 'text_enum',
          value: 10,
          label: 'Class',
          choices: REV_CLASS_NAMES.map((name, index) => ({ value: index + 1, label: name })),
          hint: 'The statistics screen (1000:1A65) prints FIGHTER for 1 and WIZARD for anything else.',
        },
      ],
    },
    {
      title: 'Characteristics',
      note: 'Each one is stored as three times the number plus 237 (1000:B6BF), which is what stops anybody raising a characteristic in a text editor. A roll puts them between 6 and 22, and 22 is the top of the scale CHCHAR.EXE means when it tells the player to hold out for a high strength.',
      fields: REV_STAT_LABELS.map((label, index) => ({
        kind: 'text_number' as const,
        value: index + 1,
        label,
        shift: 237,
        scale: 3,
      })),
    },
    {
      title: 'Level & Experience',
      fields: [
        {
          kind: 'text_number',
          value: 13,
          label: 'Player Level',
          shift: 476,
          hint: 'Counted from zero: a new character is level 0 (1000:3E39), the temple adds one for 500,000 jewel pieces (1000:2044), and reincarnation puts it back to 0 (1000:A172).',
        },
        { kind: 'text_number', value: 12, label: 'Experience', shift: 12316 },
      ],
    },
    {
      title: 'Vitals',
      fields: [
        { kind: 'text_number', value: 15, label: 'Current Health Points', shift: 176 },
        { kind: 'text_number', value: 14, label: 'Maximum Health Points', shift: 376 },
        {
          kind: 'text_number',
          value: 22,
          label: 'Spell Points',
          hint: 'A new character gets intelligence halved plus two fifths of wisdom, less 10.8 and rounded down, with two more for a wizard and four off for a fighter (CHCHAR 10E2). Fighters rarely have any.',
        },
        {
          kind: 'text_number',
          value: 17,
          label: 'Player Weight',
          shift: 71,
          hint: 'Everybody starts at 150 pounds (CHCHAR 11CA).',
        },
      ],
    },
    {
      title: 'Money',
      fields: [
        {
          kind: 'text_number',
          value: 19,
          label: 'Pocket Money',
          shift: 223,
          hint: 'A new character is given a roll of 11 to 20 (CHCHAR 0D72).',
        },
        { kind: 'text_number', value: 20, label: 'Money in Bank' },
      ],
    },
    {
      title: 'Worked Out From the Characteristics',
      note: 'CHCHAR.EXE sets these three from strength, health and agility when it makes the character, and the game rewrites them somewhere during play: the three characters on the shipped disk that have never been played hold exactly what the formulas give them and the two that have do not. What they are for is not settled, but a to-hit or a damage modifier is what would behave this way.',
      fields: [
        {
          kind: 'text_number',
          value: 7,
          label: 'From Strength',
          hint: 'Strength less 11, and half of that truncated when it comes out below one (CHCHAR 0D0F).',
        },
        {
          kind: 'text_number',
          value: 8,
          label: 'From Health',
          hint: 'Three times health less 39, and a third of that when it comes out below one (CHCHAR 0CCE).',
        },
        {
          kind: 'text_number',
          value: 9,
          label: 'From Agility',
          hint: 'Agility less 12, and nothing at all when that is below one (CHCHAR 0D48).',
        },
      ],
    },
    {
      title: 'Not Identified',
      note: 'The rest of the numbers the record has room for, with what a freshly rolled character holds in each. Changing one of these is a good way to find out what it does; back the file up first.',
      fields: [
        { kind: 'text_number', value: 11, label: 'Not Identified', hint: 'Zero on the four characters that have never been played and 3 on the one that has.' },
        { kind: 'text_number', value: 16, label: 'Not Identified', hint: 'Zero on all five characters of the shipped disk.' },
        { kind: 'text_number', value: 18, label: 'Not Identified', shift: 4434, hint: 'Zero on all five, played or not, so nothing in the game writes it.' },
        { kind: 'text_number', value: 21, label: 'Not Identified', hint: 'Zero on all five characters of the shipped disk.' },
        { kind: 'text_number', value: 23, label: 'Not Identified', hint: 'CHCHAR.EXE starts it at 10 (its offset 0363); the character who has played holds 11.' },
        { kind: 'text_number', value: 24, label: 'Not Identified', hint: 'CHCHAR.EXE starts it at 10 (its offset 036C); the two characters that have been out of the town hold 9 and 3.' },
        { kind: 'text_number', value: 25, label: 'Not Identified', hint: 'CHCHAR.EXE starts it at zero (its offset 0606) and all five characters still hold zero.' },
        { kind: 'text_number', value: 26, label: 'Not Identified', hint: 'CHCHAR.EXE sets it to 1 on every roll (its offset 0D8F) and all five characters hold 1.' },
        { kind: 'text_number', value: 141, label: 'Not Identified', hint: 'Set to 1 just after CHCHAR.EXE prints "Your weapon is a knife." (its offset 0EC4).' },
        { kind: 'text_number', value: 150, label: 'Not Identified', hint: 'A roll of 2 to 16 a new character is given (CHCHAR 0DBA).' },
        { kind: 'text_number', value: 151, label: 'Not Identified', hint: 'The second of the pair, rolled the same way (CHCHAR 0DDD).' },
      ],
    },
  ],
};

export const GAMES: GameSchema[] = [MORAFFS_WORLD, UNFORGIVEN, MORAFFS_REVENGE];

/** The schema of each game that has a save editor. */
export const GAME_SCHEMAS: Partial<Record<GameId, GameSchema>> = {
  unforgiven: UNFORGIVEN,
  moraffsWorld: MORAFFS_WORLD,
  revenge: MORAFFS_REVENGE,
};

export function pickGameByFileSize(size: number): GameSchema | null {
  return GAMES.find((game) => game.fileSize === size) ?? null;
}

/**
 * Which game a file that has just been read belongs to, or null when it is none of theirs.
 *
 * The two C games write a record of a fixed size, so the size names the game. Moraff's Revenge
 * writes text whose length depends on the numbers in it, so its own reader is asked instead.
 */
export function pickGameForFile(bytes: Uint8Array): GameSchema | null {
  return pickGameByFileSize(bytes.length) ?? GAMES.find((game) => game.readRecord?.(bytes) != null) ?? null;
}
