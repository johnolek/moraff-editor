import areaSource from '../map/area.ts?raw';
import magicSource from '../game/port/magic.ts?raw';
import mechSource from '../game/dotu-mech.js?raw';
import relocateSource from '../map/relocate.ts?raw';
import rollSource from '../bestiary/roll.ts?raw';
import stockingSource from '../map/stocking.ts?raw';
import filesSource from '../game/dotu-files.js?raw';
import toHitSource from '../bestiary/to-hit.ts?raw';
import unfmapSource from '../game/unfmap.js?raw';
import { snippet } from '../ui/source-snippet';

/** The files a formula's code can come from, as text, so the page shows what the app runs. */
export const SOURCES = {
  'src/lib/bestiary/roll.ts': rollSource,
  'src/lib/bestiary/to-hit.ts': toHitSource,
  'src/lib/game/dotu-files.js': filesSource,
  'src/lib/game/dotu-mech.js': mechSource,
  'src/lib/game/port/magic.ts': magicSource,
  'src/lib/game/unfmap.js': unfmapSource,
  'src/lib/map/area.ts': areaSource,
  'src/lib/map/relocate.ts': relocateSource,
  'src/lib/map/stocking.ts': stockingSource,
};

export type SourceFile = keyof typeof SOURCES;

/** The declaration whose text an entry shows. */
export interface CodeReference {
  file: SourceFile;
  /** A function, a const or a method of a class, as it is named in that file. */
  name: string;
}

export interface Formula {
  /** Used as the element id the index scrolls to, so it has to be unique across topics. */
  id: string;
  title: string;
  /** What the formula decides, in plain English, for someone who plays the game. */
  explanation: string;
  /** What the answer depends on. */
  inputs: string;
  /** The function in the game and the notes it was recovered in. */
  origin: string;
  /** Null for the handful of rules the app itself never has to work out. */
  code: CodeReference | null;
}

export interface Topic {
  id: string;
  title: string;
  formulas: Formula[];
}

const MAP: Topic = {
  id: 'map',
  title: 'The map',
  formulas: [
    {
      id: 'map-hash',
      title: 'Why every dungeon is the same',
      explanation:
        'The game ships no maps and saves none. Every question about a square, from "is this a wall" to "is there a ladder here", is answered by pushing the square\'s column and row, the floor number and the module through one piece of arithmetic and taking a remainder, so the same question always gets the same answer. Floor 12 of Module I is laid out identically in your game, in a stranger\'s game and in the 1993 screenshots. The sums are done in 16-bit arithmetic that overflows constantly, and the port keeps every overflow, down to the quirk in the original C where the size of the most negative number stays negative and is then clamped to zero.',
      inputs: 'The square\'s column and row, the floor, the module, and how many different answers are wanted.',
      origin: 'exe 3000:81ba, myrand in dotu-tools/decomp/unf.c. Handoff section 5 and TIDBITS, "Numbers with a story".',
      code: { file: 'src/lib/game/unfmap.js', name: 'myrand' },
    },
    {
      id: 'map-sides',
      title: 'Walls, doors and secret doors',
      explanation:
        'A square does not own its walls: the sides between squares do, and each side is one of four things, a wall, a door, a secret door or open air. The floor is cut into blocks of sixteen squares by sixteen, the hash picks one of twenty-five stamped patterns for each block out of the 12,800 bytes of wall data that ship with the game, and two bits of that pattern answer for one side. That is why corridors feel repetitive: a floor is twenty-five patterns rearranged. Floor 1 of Module I ends up with 209 squares next to a door and 71 next to a secret door, and the sides at the very edge of the map are always walls.',
      inputs: 'The side wanted, the floor, the module, and the wall pattern file the game installs.',
      origin: 'exe retdwall 3000:8360, retdwall in dotu-tools/decomp/unf.c. Handoff section 5.',
      code: { file: 'src/lib/game/unfmap.js', name: 'side' },
    },
    {
      id: 'map-rock',
      title: 'Rock',
      explanation:
        'A square is rock, never enterable and drawn filled in, exactly when all four of its sides came out as walls. There is no list of solid squares anywhere; the question is asked again every time it matters. Roughly a third of a floor survives as open space: floor 1 of Module I has 2,862 open squares out of the 8,216 the game shows.',
      inputs: 'The four sides of the square, so the same things the sides themselves depend on.',
      origin: 'exe solidcheck 3000:86b5, solidcheck in dotu-tools/decomp/unf.c.',
      code: { file: 'src/lib/game/unfmap.js', name: 'solid' },
    },
    {
      id: 'map-area',
      title: 'The part of a floor you can reach',
      explanation:
        'The generator fills a grid 80 columns wide and 110 rows tall, but the game only ever draws and walks 79 by 104. The last column and the last six rows are generated like everything else and can hold perfectly good open squares that no spell, teleporter or footstep will ever reach, because every check the game makes on a destination square stops at those two numbers. The map explorer counts and draws the same area the game does, so its floor totals match what a player could actually explore.',
      inputs: 'Two sizes the game keeps for itself. Nothing about your character or the floor.',
      origin: 'the globals at DS:2328 and DS:232a, tested in relocate (exe 3000:da2c), pass_wall (exe 3000:e003) and go_away (exe 3000:db1e).',
      code: { file: 'src/lib/map/area.ts', name: 'MAP_COLUMNS' },
    },
  ],
};

const TELEPORTERS: Topic = {
  id: 'teleporters',
  title: 'Module teleporters',
  formulas: [
    {
      id: 'teleporter-sides',
      title: 'Where the teleporters are',
      explanation:
        'A module teleporter is not a square but a wall side that has quietly been turned into a way out of the module. The game multiplies the side\'s column by its row, adds the floor times the module number, and if the result is one more than a whole number of 128s, a side that would have been a plain wall becomes a teleporter instead. The rule is switched off from floor 15 downwards in every module but the first, so Module I has them all the way to the bottom while the others only carry them near the surface: floor 1 of Module I has seventeen teleporter squares, floor 30 of Module II has none. In Module I the module number is zero, which drops the floor out of the sum altogether, so the candidate spots are the same on every floor and only the ones that happen to be walls become teleporters.',
      inputs: 'The side\'s column and row, the floor, the module, and whether that side came out as a wall in the first place.',
      origin:
        'exe retdwall2 2000:c22d, retdwall2 in dotu-tools/decomp/unf.c. Handoff section 4. The rule is commented out in the recovered source but live in the executable, and the wall artwork still holds the sign that points at one (TIDBITS, "Colours and pictures").',
      code: { file: 'src/lib/game/unfmap.js', name: 'side2' },
    },
    {
      id: 'teleporter-landing',
      title: 'Where a teleporter drops you',
      explanation:
        'Walking into a teleporter moves you to the town of the module next door: up from Module I, down from Module V, and your choice of the two in between. Where in that town you appear is decided by drawing a column and a row at random over the area the game shows and drawing again until the square is not rock, so any of the three thousand or so open squares is as likely as any other. The same routine places you after Relocate, after Descend and Ascend, and after digging a hole, which is why none of those ever put you somewhere convenient.',
      inputs: 'Which squares of the destination floor are rock. Not the square you left, and nothing about your character.',
      origin: 'exe relocate 3000:da2c, relocate_spell in dotu-tools/decomp/unf.c. Handoff section 4.',
      code: { file: 'src/lib/map/relocate.ts', name: 'randomOpenSquare' },
    },
  ],
};

const TOWN: Topic = {
  id: 'town',
  title: 'The town',
  formulas: [
    {
      id: 'town-buildings',
      title: 'Where the buildings are',
      explanation:
        'Floor 0 of every module is a town, built by exactly the same machinery as a dungeon floor, with buildings dropped onto squares instead of ladders and chutes. For each square the hash draws a number below sixty: a one is a general store, a two the temple, a three the bank, a four the inn, and everything else is empty ground. Each building therefore has one square in sixty and about one square in fifteen is a doorway, which in the town of Module I works out as 60 stores, 50 temples, 42 banks and 51 inns among its 3,129 open squares. A square that has a ladder is never a building: the game asks about ladders first and only looks for a building when there is none.',
      inputs: 'The square\'s column and row and the module. The floor is always the town.',
      origin:
        'exe town_features 2000:9cba, town_features in dotu-tools/decomp/unf.c. Handoff section 4 and FAQ [LDRS]; the ladder-first order is in drawsquare (exe 3000:87de) and movecontrol (exe 2000:c308).',
      code: { file: 'src/lib/game/unfmap.js', name: 'townFeature' },
    },
  ],
};

const WAYS_DOWN: Topic = {
  id: 'ways-down',
  title: 'Ladders, chutes and trap doors',
  formulas: [
    {
      id: 'ladders',
      title: 'Ladders up and down',
      explanation:
        'One open square in twenty-seven draws the number that makes a down ladder, and the ladder reaches the first square that is not rock one or two floors below; if both of those are rock, or the module has no floor left below, nothing is built. Up ladders are never generated in their own right. A square carries one exactly when a down ladder on one of the three floors above it lands here, which is why the two directions never match up neatly: floor 1 of Module I has 78 ladders going down and 59 coming up from the town.',
      inputs: 'The square\'s column and row, the floor and the module, and whether the squares directly above and below are rock.',
      origin: 'exe check_for_ladder 3000:827f, check_for_ladder in dotu-tools/decomp/unf.c. Handoff section 5 and FAQ [LDRS].',
      code: { file: 'src/lib/game/unfmap.js', name: 'ladder' },
    },
    {
      id: 'chutes',
      title: 'Chutes',
      explanation:
        'A chute is a hole you fall through without being asked. About five squares in every two hundred and thirty have one, a rate that creeps up very slowly with depth, and falling drops you onto the first open square straight below: two floors at most down to floor 9, four floors below that. A square with a ladder is never a chute, and the whole feature is switched off past three quarters of the way to the bottom of the module, so floor 1 of Module I has 41 chutes while floor 100 of Module V has none at all.',
      inputs: 'The square\'s column and row, the floor and the module, and whether the squares below are rock.',
      origin: 'exe detect_chute 2000:b5ea, detect_chute in dotu-tools/decomp/unf.c. Handoff section 4 and FAQ [LDRS].',
      code: { file: 'src/lib/game/unfmap.js', name: 'chute' },
    },
    {
      id: 'trap-doors',
      title: 'Trap doors and the floors they reach',
      explanation:
        'A trap door is a locked shortcut that names the floor it goes to, always a multiple of five, and only opens for a character carrying that floor\'s key. The hash draws a number below twenty-four hundred and multiplies it by five; the answer counts only if it is floor 5 or deeper, above four fifths of the way to the bottom of the module, and in a different block of five floors from the one you are standing on. In Module I that leaves floors 5, 10 and 15 as the only destinations and roughly one square in eight hundred with a trap door on it, while Module V allows sixteen destinations and roughly one square in a hundred and fifty. Floor 12 of Module I, for instance, has five trap doors, and every one of them leads to floor 5 or floor 15.',
      inputs: 'The square\'s column and row, the floor, the module, and the module\'s bottom floor.',
      origin: 'exe trapdoor 2000:bd32, trapdoor in dotu-tools/decomp/unf.c. Handoff section 4 and FAQ [LDRS].',
      code: { file: 'src/lib/game/unfmap.js', name: 'trapdoor' },
    },
    {
      id: 'trap-door-landing',
      title: 'Where a trap door lands you',
      explanation:
        'Every trap door pointing at the same floor drops you on the same square. The game seeds its random number generator with the number ten, draws a column and a row out of it, and if that square is rock it starts again with eleven, then twelve, until it lands on open ground. Nothing about your character or the door you fell through comes into it, and because the seeds never change the answer is fixed for the life of the game: for most floors it is column 18, row 93.',
      inputs: 'The destination floor and the module, through which squares of that floor are rock.',
      origin:
        'exe trapdoor_dest 2000:bda6, trapdoor_dest in dotu-tools/decomp/unf.c. TIDBITS, "Numbers with a story".',
      code: { file: 'src/lib/game/unfmap.js', name: 'trapdoorDest' },
    },
  ],
};

const MONSTERS: Topic = {
  id: 'monsters',
  title: 'Sections and monsters',
  formulas: [
    {
      id: 'sections',
      title: 'Which section a floor belongs to',
      explanation:
        'The twenty sections of the game are four to a module, and a section is simply a band of floors: five floors thick in Module I, ten in Module II, and so on up to twenty-five in Module V, with the module\'s last section swallowing everything below its band. Floors 1 to 5 of Module I are section 1, floors 16 to 25 are all section 4; in Module V section 20 runs from floor 76 to the bottom at 105. The section decides which five monsters the game loads, which Shadow boss guards it and which reward beating that boss pays, and its boss waits on the last floor of its band.',
      inputs: 'The floor and the module.',
      origin: 'exe section_number3 2000:1ccc, section_number3 in dotu-tools/decomp/unf.c. Handoff section 4.',
      code: { file: 'src/lib/game/dotu-files.js', name: 'sectionOf' },
    },
    {
      id: 'monster-level-base',
      title: 'The level a floor stocks at',
      explanation:
        'Every monster on a floor starts from one number: the floor plus fifteen for each module below the one you are in. Floor 10 of Module I stocks level 10 monsters, floor 30 of Module II stocks level 45, and floor 1 of Module V stocks level 61, which is why the deeper modules are brutal from their first step. The one special case, a base of 221 or more falling back to level 1, cannot be reached by any module: Module V bottoms out at 165.',
      inputs: 'The floor and the module.',
      origin: 'exe stock_level 2000:671e, stock_level in dotu-tools/decomp/unf.c. RE notes 4.1 and FAQ [MGEN].',
      code: { file: 'src/lib/game/dotu-mech.js', name: 'monsterLevelBase' },
    },
    {
      id: 'monster-level-nudge',
      title: 'The nudge on a monster\'s level',
      explanation:
        'The floor\'s level is not what gets stored. For each monster the game keeps tossing a one-in-three chance, and every time it comes up the level shifts by minus one, nothing or plus one. Two thirds of monsters therefore stand exactly at the floor\'s level and the rest tail away either side, so a level 45 floor is mostly level 45 with a scattering from about 41 to 49. Whatever comes out is held between 1 and 210.',
      inputs: 'The floor\'s base level, and the rolls.',
      origin: 'exe stock_level 2000:671e, stock_level in dotu-tools/decomp/unf.c. RE notes 4.1 and FAQ [MGEN].',
      code: { file: 'src/lib/bestiary/roll.ts', name: 'nudgeLevel' },
    },
    {
      id: 'monster-hp',
      title: 'A monster\'s hit points',
      explanation:
        'Hit points are the average of two rolls, each between zero and the monster type\'s hit points per level times the monster\'s level. Averaging two rolls rather than taking one is why monsters cluster around the middle of their range instead of spreading evenly: an average joe, worth ten hit points a level, comes to about 226 at level 45, but can be anything from 1 to 451. The type\'s hit points per level is the whole difference between a fragile thing and a wall, running from 2 for a puffball to 50 for a Shadow boss.',
      inputs: 'The monster type\'s hit points per level, the level it was stocked at, and the two rolls.',
      origin: 'exe stock_level 2000:671e, stock_level in dotu-tools/decomp/unf.c. RE notes 4.1 and FAQ [MGEN].',
      code: { file: 'src/lib/bestiary/roll.ts', name: 'rollHp' },
    },
    {
      id: 'boss-hp',
      title: 'Why a Shadow boss takes so long',
      explanation:
        'A Shadow boss rolls its hit points like anything else and then adds twenty for each of its levels, and in the last three sections the whole total is doubled afterwards. The Shadow boss on floor 50 of Module V is stocked at level 110, which means it rolls about 2,750 hit points, takes 2,200 more for its levels, and then has the whole total doubled because its section is one of the last three: it arrives with close to 9,900 where the same rolls without the bonus would have given 2,750. Nothing in the game can hold more than 32,000.',
      inputs: 'The rolled hit points, the boss\'s level, and the section it guards.',
      origin: 'exe stock_level 2000:671e, stock_level in dotu-tools/decomp/unf.c. RE notes 4.1 and TIDBITS, "Monsters".',
      code: { file: 'src/lib/bestiary/roll.ts', name: 'stockedHp' },
    },
    {
      id: 'monster-kind',
      title: 'Which monster turns up',
      explanation:
        'Every slot on a floor gets its own creature by a chain of questions, each asked only if the last one said no. One in twenty is a puffball, of which there are twelve; failing that one in seven is a giant garbage can or a giant ball; failing that one in fifteen is the section\'s level drainer; failing that one in twelve is one of the eight poison or disease things; and everything left over is one of the section\'s three ordinary monsters. Only two of the five branches depend on which section you are in, which is why cans, balls and puffballs follow you all the way to Module V.',
      inputs: 'The section, and the rolls.',
      origin: 'exe get_mtype 2000:65f8, get_mtype in dotu-tools/decomp/unf.c. RE notes 4.1 and FAQ [MGEN].',
      code: { file: 'src/lib/map/stocking.ts', name: 'rollKind' },
    },
    {
      id: 'monster-kind-odds',
      title: 'How often each kind turns up',
      explanation:
        'Multiplying the chain of questions out gives what a floor actually holds: about seven in ten monsters are one of the section\'s three regulars, a touch under one in seven is a can or a ball, one in twenty is a puffball, one in sixteen is poison or disease, and one in eighteen is the section\'s level drainer. Spread over the twelve puffballs and eight poison and disease creatures, any single one of those is rare, which is why the Monsters tab shows the built-in creatures with much smaller shares than the section monsters.',
      inputs: 'Nothing. The chances are the same on every floor of the game.',
      origin: 'exe get_mtype 2000:65f8, get_mtype in dotu-tools/decomp/unf.c. FAQ [MGEN] and [GTPS].',
      code: { file: 'src/lib/game/dotu-mech.js', name: 'MONSTER_TYPE_ODDS' },
    },
    {
      id: 'stocking',
      title: 'The 145 monsters on a floor',
      explanation:
        'A floor is stocked with exactly 145 monsters, each dropped on a random open square that nothing else is standing on, each given its own kind, level and hit points. On the last floor of a section the very first slot is the Shadow boss instead, placed somewhere in the middle fifty squares of each direction, and once you have beaten it the game stops placing it. The game only remembers three floors of monsters at a time, so a floor you come back to later is stocked fresh; and because the original reseeds its generator for every square it draws, its monsters land in diagonal stripes, which this app does not imitate.',
      inputs: 'The floor\'s open squares, its section and its base level, and the rolls.',
      origin:
        'exe stock_level 2000:671e, stock_level in dotu-tools/decomp/unf.c. RE notes 4.1; the stripes are in TIDBITS, "Random numbers that are not random".',
      code: { file: 'src/lib/map/stocking.ts', name: 'stockFloor' },
    },
  ],
};

const EXPERIENCE: Topic = {
  id: 'experience',
  title: 'Experience',
  formulas: [
    {
      id: 'exp-needed',
      title: 'What the next level costs',
      explanation:
        'Each level needs forty per cent more experience than the one before it, starting from 250 and with a flat 80 knocked off the whole curve. Level 10 wants 3,609 experience, level 20 wants 106,640 and level 30 wants a little over three million. On "I can handle anything" the curve doubles instead of growing by two fifths and the 80 is gone, so the first few levels are barely harder and the later ones are ruinous: level 20 costs 65 million there against 106,640 on the normal setting.',
      inputs: 'The level you are aiming at and the difficulty the character was rolled on.',
      origin:
        'exe exp_needed 2000:7b48, exp_needed in dotu-tools/decomp/unf.c, from the constants at DS:0421, DS:0429, DS:12d6 and DS:12da. RE notes 1.1 and FAQ [EXPT].',
      code: { file: 'src/lib/game/dotu-mech.js', name: 'expNeeded' },
    },
    {
      id: 'exp-value',
      title: 'What a kill is worth',
      explanation:
        'A kill pays out on the monster\'s level, and the payout grows by twenty-three per cent for every level, which utterly swamps the rest of the sum. A level 30 monster is worth about 2,500 experience, a level 60 one about 1.2 million and a level 61 one about 1.5 million, so one floor deeper is worth more than a much longer stay where you are. The whole thing is then multiplied by the monster\'s own worth: one for an ordinary section monster, three for a garbage can or ball, five for a poison or disease creature, and sixteen for a Shadow boss. Levels above 130 pay no more than level 130 does.',
      inputs: 'The monster\'s level and the multiplier its kind carries.',
      origin:
        'exe exp_value 3000:a0fa, exp_value in dotu-tools/decomp/unf.c, from the constants at DS:2f60 and DS:2f68. RE notes 3 and FAQ [LOOT].',
      code: { file: 'src/lib/game/dotu-mech.js', name: 'expValue' },
    },
    {
      id: 'level-for-exp',
      title: 'When a level is actually granted',
      explanation:
        'Killing things never levels you up. Experience piles up while you are in the dungeon and the game only compares it against the table when you pay for a room at an inn, handing you every level you have earned since the last stay in one go. Losing experience, to a drainer or to the Youth spell, never takes a level back at the inn; only a level drainer\'s hit does that, and it sets your experience to the exact minimum for the level it leaves you on.',
      inputs: 'The experience you are carrying, the difficulty, and the level you are already on.',
      origin:
        'exe gain_level 2000:7d23 and check_gain_level 2000:7c71, called from flea_inn (exe 2000:4fe7); gain_level in dotu-tools/decomp/unf.c. RE notes 1.1 and 2.2.',
      code: { file: 'src/lib/game/dotu-mech.js', name: 'levelForExp' },
    },
  ],
};

export const TOPICS: Topic[] = [MAP, TELEPORTERS, TOWN, WAYS_DOWN, MONSTERS, EXPERIENCE];

/** The source text of the declaration an entry shows. */
export function formulaCode(formula: Formula): string | null {
  return formula.code ? snippet(SOURCES[formula.code.file], formula.code.name) : null;
}

/** Every entry, in the order the page lists them. */
export function allFormulas(): Formula[] {
  return TOPICS.flatMap((topic) => topic.formulas);
}

/** The topics holding an entry whose title matches, with the entries that do not left out. */
export function searchFormulas(query: string): Topic[] {
  const wanted = query.trim().toLowerCase();
  if (!wanted) return TOPICS;
  return TOPICS.map((topic) => ({
    ...topic,
    formulas: topic.formulas.filter((formula) => formula.title.toLowerCase().includes(wanted)),
  })).filter((topic) => topic.formulas.length > 0);
}
