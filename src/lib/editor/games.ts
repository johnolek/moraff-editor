import type { GameId } from '../app-state.svelte';
import { fixSaveChecksum, SAVE_SIZE } from '../game/dotu-files.js';
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
      fields: [
        { kind: 'int32', offset: 0x0454, label: 'Jewels in Pocket' },
        { kind: 'int32', offset: 0x0458, label: 'Jewels in Bank' },
      ],
    },
    {
      title: 'Stones',
      note: 'Stone currencies — 4-byte counters starting at 0x045C.',
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
      note: 'Each pill bumps one stat by +2 and another by −2 when consumed.',
      fields: [
        { kind: 'int8', offset: 0x015d, label: 'Orange  (+2 STR / −2 LCK)' },
        { kind: 'int8', offset: 0x015e, label: 'Green   (+2 INT / −2 AGI)' },
        { kind: 'int8', offset: 0x015f, label: 'Blue    (+2 WIS / −2 CON)' },
        { kind: 'int8', offset: 0x0160, label: 'Red     (+2 CON / −2 WIS)' },
        { kind: 'int8', offset: 0x0161, label: 'White   (+2 AGI / −2 INT)' },
        { kind: 'int8', offset: 0x0162, label: 'Yellow  (+2 LCK / −2 STR)' },
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

export const GAMES: GameSchema[] = [MORAFFS_WORLD, UNFORGIVEN];

/** The schema of each game the site can be switched to. */
export const GAME_SCHEMAS: Record<GameId, GameSchema> = {
  unforgiven: UNFORGIVEN,
  moraffsWorld: MORAFFS_WORLD,
};

export function pickGameByFileSize(size: number): GameSchema | null {
  return GAMES.find((game) => game.fileSize === size) ?? null;
}
