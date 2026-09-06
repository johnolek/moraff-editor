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

export const TOPICS: Topic[] = [MAP, TELEPORTERS, TOWN];

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
