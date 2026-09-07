/**
 * The app's own source, as text, so the Source tab can show what it runs.
 *
 * A production build minifies every name away, so a function cannot be read back with
 * toString(); each file is imported with Vite's ?raw suffix instead and scanned for its
 * declarations. The port's documentation comments cite the function they came from, as in
 * `(exe 3000:d904, unf.c "sleep_monster")`, and that citation is what ties a function here to a
 * function in `dotu-tools/decomp/unf.c`, in both directions.
 */
import toHitSource from '../bestiary/to-hit.ts?raw';
import rollSource from '../bestiary/roll.ts?raw';
import dropsSource from '../calculators/drops.ts?raw';
import filesSource from '../game/dotu-files.js?raw';
import characterSource from '../game/port/character.ts?raw';
import combatSource from '../game/port/combat.ts?raw';
import mechSource from '../game/dotu-mech.js?raw';
import magicSource from '../game/port/magic.ts?raw';
import rngSource from '../game/port/rng.ts?raw';
import spellIndexSource from '../game/port/spell-index.ts?raw';
import stateSource from '../game/port/state.ts?raw';
import unfmapSource from '../game/unfmap.js?raw';
import areaSource from '../map/area.ts?raw';
import pathSource from '../map/path.ts?raw';
import relocateSource from '../map/relocate.ts?raw';
import stockingSource from '../map/stocking.ts?raw';
import { snippet } from '../ui/source-snippet';

/** Every file the app shows the source of, keyed by the path it lives at in the repository. */
export const SOURCES = {
  'src/lib/game/port/magic.ts': magicSource,
  'src/lib/game/port/combat.ts': combatSource,
  'src/lib/game/port/character.ts': characterSource,
  'src/lib/game/port/state.ts': stateSource,
  'src/lib/game/port/rng.ts': rngSource,
  'src/lib/game/port/spell-index.ts': spellIndexSource,
  'src/lib/game/unfmap.js': unfmapSource,
  'src/lib/game/dotu-mech.js': mechSource,
  'src/lib/game/dotu-files.js': filesSource,
  'src/lib/bestiary/to-hit.ts': toHitSource,
  'src/lib/bestiary/roll.ts': rollSource,
  'src/lib/map/stocking.ts': stockingSource,
  'src/lib/map/path.ts': pathSource,
  'src/lib/map/area.ts': areaSource,
  'src/lib/map/relocate.ts': relocateSource,
  'src/lib/calculators/drops.ts': dropsSource,
};

export type SourceFile = keyof typeof SOURCES;

/** The files in the order the Source tab lists them: the port first, then what reads it. */
export const SOURCE_FILES = Object.keys(SOURCES) as SourceFile[];

/** Where in the executable, and under what name, a decompiled function sits. */
export interface Citation {
  name: string;
  /** Segment and offset, as `3000:d904`. */
  address: string;
}

/** One declaration of one file, with the decompiled function its comment cites. */
export interface PortFunction {
  file: SourceFile;
  name: string;
  /** Null where the comment above the declaration cites nothing. */
  c: Citation | null;
}

const CITATION = /\(exe ([0-9a-f]{4}:[0-9a-f]+), unf\.c "([^"]+)"\)/;
const EXPORTED_FUNCTION = /^export (?:async )?function (\w+)\s*\(/;
const EXPORTED_VALUE = /^export const (\w+)\s*=/;
const CLASS_START = /^(?:export )?class \w/;
/** A method of a class: two spaces of indentation, an argument list, and an opening brace. */
const METHOD = /^ {2}(\w+)\s*\([^;]*\)\s*(?::[^{]+)?\{\s*$/;
/** Words that start a block inside a method, which is not a declaration of anything. */
const BLOCK_WORDS = ['if', 'for', 'while', 'switch', 'do', 'try', 'catch', 'else', 'return'];

function isComment(line: string): boolean {
  const text = line.trim();
  return text.startsWith('//') || text.startsWith('/*') || text.startsWith('*');
}

/**
 * The declarations of one file, in the order it declares them: every exported function and
 * value, and every method of a class.
 *
 * A citation is carried down from the comment written directly on top of a declaration. Any
 * other line between the two, blank ones included, drops it, so a citation in a file's opening
 * comment is not handed to whatever happens to be declared first.
 */
export function declarations(file: SourceFile, source: string): PortFunction[] {
  const found: PortFunction[] = [];
  let pending: Citation | null = null;
  let inClass = false;
  for (const line of source.split('\n')) {
    if (line.trim() === '') {
      pending = null;
      continue;
    }
    if (isComment(line)) {
      const cited = CITATION.exec(line);
      if (cited) pending = { address: cited[1], name: cited[2] };
      continue;
    }
    if (CLASS_START.test(line)) inClass = true;
    else if (line === '}') inClass = false;
    const method = inClass ? METHOD.exec(line) : null;
    const name =
      EXPORTED_FUNCTION.exec(line)?.[1] ??
      EXPORTED_VALUE.exec(line)?.[1] ??
      (method && method[1] !== 'constructor' && !BLOCK_WORDS.includes(method[1]) ? method[1] : null);
    if (name) found.push({ file, name, c: pending });
    pending = null;
  }
  return found;
}

/** Every file with the declarations it holds, in the order the Source tab lists them. */
export const PORT_FILES: { file: SourceFile; functions: PortFunction[] }[] = SOURCE_FILES.map((file) => ({
  file,
  functions: declarations(file, SOURCES[file]),
}));

const ALL = PORT_FILES.flatMap((entry) => entry.functions);

const BY_C_NAME = new Map<string, PortFunction[]>();
for (const fn of ALL) {
  if (!fn.c) continue;
  const ported = BY_C_NAME.get(fn.c.name);
  if (ported) ported.push(fn);
  else BY_C_NAME.set(fn.c.name, [fn]);
}

/** Every declaration of every file, which is what the Source tab searches. */
export function allPortFunctions(): PortFunction[] {
  return ALL;
}

/** One declaration, or null where the file does not declare that name. */
export function portFunction(file: SourceFile, name: string): PortFunction | null {
  return ALL.find((fn) => fn.file === file && fn.name === name) ?? null;
}

/** The functions ported from one decompiled function, which is the citation read backwards. */
export function portsOfC(name: string): PortFunction[] {
  return BY_C_NAME.get(name) ?? [];
}

/** The source text of one declaration, documentation comment included. */
export function portCode(file: SourceFile, name: string): string {
  return snippet(SOURCES[file], name);
}
