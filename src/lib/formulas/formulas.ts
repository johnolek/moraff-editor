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

export const TOPICS: Topic[] = [];

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
