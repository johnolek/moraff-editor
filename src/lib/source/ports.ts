/**
 * The app's own source, as text, so the Source tab can show what it runs.
 *
 * A production build minifies every name away, so a function cannot be read back with
 * toString(); each file is imported with Vite's ?raw suffix instead and scanned for its
 * declarations. The port's documentation comments cite the function they came from, as in
 * `(exe 3000:d904, unf.c "sleep_monster")`, and that citation is what ties a function here to a
 * function in `dotu-tools/decomp/unf.c` or `mw-tools/decomp/mw.c`, in both directions.
 *
 * Each file belongs to the game it is a port of, which is the game whose decompilation its
 * citations name and the game whose Source tab lists it.
 */
import type { GameId } from '../app-state.svelte';
import toHitSource from '../bestiary/to-hit.ts?raw';
import rollSource from '../bestiary/roll.ts?raw';
import dropsSource from '../calculators/drops.ts?raw';
import filesSource from '../game/dotu-files.js?raw';
import characterSource from '../game/port/character.ts?raw';
import combatSource from '../game/port/combat.ts?raw';
import hintsSource from '../game/port/hints.ts?raw';
import momentSource from '../game/port/moment.ts?raw';
import recordSource from '../game/port/record.ts?raw';
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
import playArrivalSource from '../play/arrival.ts?raw';
import playChuteSource from '../play/chute.ts?raw';
import playDigSource from '../play/dig.ts?raw';
import playEngineSource from '../play/engine.ts?raw';
import playFloorSource from '../play/floor.ts?raw';
import playHelpSource from '../play/help.ts?raw';
import playKeysSource from '../play/keys.ts?raw';
import playLaddersSource from '../play/ladders.ts?raw';
import playModulesSource from '../play/modules.ts?raw';
import playMoveSource from '../play/move.ts?raw';
import playQuitSource from '../play/quit.ts?raw';
import playScreensSource from '../play/screens.ts?raw';
import playTrapdoorSource from '../play/trapdoor.ts?raw';
import twinsSource from '../map/twins.ts?raw';
import mwCharacterSource from '../game/mw-port/character.ts?raw';
import mwSpellsSource from '../game/mw-port/spells.ts?raw';
import mwStateSource from '../game/mw-port/state.ts?raw';
import mwStockingSource from '../game/mw-port/stocking.ts?raw';
import mwmapSource from '../game/mwmap.js?raw';
import mwDungeonSource from '../game/mw-dungeon.ts?raw';
import mwMonstersSource from '../mw-bestiary/monsters.ts?raw';
import mwToHitSource from '../mw-bestiary/to-hit.ts?raw';
import mwEffectsSource from '../mw-spells/effects.ts?raw';
import { snippet } from '../ui/source-snippet';

/** The Dungeons of the Unforgiven files, keyed by the path they live at in the repository. */
const UNFORGIVEN_SOURCES = {
  'src/lib/game/port/magic.ts': magicSource,
  'src/lib/game/port/combat.ts': combatSource,
  'src/lib/game/port/character.ts': characterSource,
  'src/lib/game/port/hints.ts': hintsSource,
  'src/lib/game/port/moment.ts': momentSource,
  'src/lib/game/port/record.ts': recordSource,
  'src/lib/game/port/state.ts': stateSource,
  'src/lib/game/port/rng.ts': rngSource,
  'src/lib/game/port/spell-index.ts': spellIndexSource,
  'src/lib/play/engine.ts': playEngineSource,
  'src/lib/play/move.ts': playMoveSource,
  'src/lib/play/ladders.ts': playLaddersSource,
  'src/lib/play/trapdoor.ts': playTrapdoorSource,
  'src/lib/play/chute.ts': playChuteSource,
  'src/lib/play/dig.ts': playDigSource,
  'src/lib/play/modules.ts': playModulesSource,
  'src/lib/play/quit.ts': playQuitSource,
  'src/lib/play/help.ts': playHelpSource,
  'src/lib/play/floor.ts': playFloorSource,
  'src/lib/play/arrival.ts': playArrivalSource,
  'src/lib/play/screens.ts': playScreensSource,
  'src/lib/play/keys.ts': playKeysSource,
  'src/lib/game/unfmap.js': unfmapSource,
  'src/lib/game/dotu-mech.js': mechSource,
  'src/lib/game/dotu-files.js': filesSource,
  'src/lib/bestiary/to-hit.ts': toHitSource,
  'src/lib/bestiary/roll.ts': rollSource,
  'src/lib/map/stocking.ts': stockingSource,
  'src/lib/map/path.ts': pathSource,
  'src/lib/map/area.ts': areaSource,
  'src/lib/map/relocate.ts': relocateSource,
  'src/lib/map/twins.ts': twinsSource,
  'src/lib/calculators/drops.ts': dropsSource,
};

/** The Moraff's World files, keyed the same way. */
const MORAFFS_WORLD_SOURCES = {
  'src/lib/game/mw-port/character.ts': mwCharacterSource,
  'src/lib/game/mw-port/spells.ts': mwSpellsSource,
  'src/lib/game/mw-port/state.ts': mwStateSource,
  'src/lib/game/mw-port/stocking.ts': mwStockingSource,
  'src/lib/game/mwmap.js': mwmapSource,
  'src/lib/game/mw-dungeon.ts': mwDungeonSource,
  'src/lib/mw-bestiary/monsters.ts': mwMonstersSource,
  'src/lib/mw-bestiary/to-hit.ts': mwToHitSource,
  'src/lib/mw-spells/effects.ts': mwEffectsSource,
};

/** Every file the app shows the source of, keyed by the path it lives at in the repository. */
export const SOURCES = { ...UNFORGIVEN_SOURCES, ...MORAFFS_WORLD_SOURCES };

export type SourceFile = keyof typeof SOURCES;

const FILES: Record<GameId, SourceFile[]> = {
  unforgiven: Object.keys(UNFORGIVEN_SOURCES) as SourceFile[],
  moraffsWorld: Object.keys(MORAFFS_WORLD_SOURCES) as SourceFile[],
};

/**
 * One game's files, in the order the Source tab lists them: the port first, then what reads it.
 *
 * A caller that names no game means Dungeons of the Unforgiven, which is the game most of the
 * site is about.
 */
export function sourceFiles(game: GameId = 'unforgiven'): SourceFile[] {
  return FILES[game];
}

/** Where in the executable, and under what name, a decompiled function sits. */
export interface Citation {
  name: string;
  /** Segment and offset, as `3000:d904`. */
  address: string;
  /** The game whose decompilation holds the function: `unf.c` names Dungeons of the
   *  Unforgiven's, `mw.c` names Moraff's World's. */
  game: GameId;
}

/** One declaration of one file, with the decompiled function its comment cites. */
export interface PortFunction {
  file: SourceFile;
  name: string;
  /** Null where the comment above the declaration cites nothing. */
  c: Citation | null;
}

/** One file with the declarations it holds. */
export interface PortFile {
  file: SourceFile;
  functions: PortFunction[];
}

/**
 * A citation: `(exe 3000:d904, unf.c "sleep_monster")`, or the Moraff's World port's
 * `(WORLD.EXE 3000:4477, mw.c "show_roll")` — that game ships two executables, so its port names
 * the one it means.
 */
const CITATION = /\((?:exe|WORLD\.EXE)\s+([0-9a-f]{4}:[0-9a-f]+),\s+(unf|mw)\.c\s+"([^"]+)"\)/;
const CITED_GAME: Record<string, GameId> = { unf: 'unforgiven', mw: 'moraffsWorld' };
const EXPORTED_FUNCTION = /^export (?:async )?function (\w+)\s*\(/;
/** An exported value, with or without a type written on it: `export const TWINS: Twin[] = [`. */
const EXPORTED_VALUE = /^export const (\w+)\s*(?::[^=\n]+)?=/;
const CLASS_START = /^(?:export )?class \w/;
/** A method of a class: two spaces of indentation, an argument list, and an opening brace. */
const METHOD = /^ {2}(\w+)\s*\([^;]*\)\s*(?::[^{]+)?\{\s*$/;
/** Words that start a block inside a method, which is not a declaration of anything. */
const BLOCK_WORDS = ['if', 'for', 'while', 'switch', 'do', 'try', 'catch', 'else', 'return'];

function isComment(line: string): boolean {
  const text = line.trim();
  return text.startsWith('//') || text.startsWith('/*') || text.startsWith('*');
}

/** One line of a comment with the `//`, `/**` or `*` that marks it as one taken off. */
function commentText(line: string): string {
  return line.trim().replace(/^(?:\/\/+|\/\*+|\*+)/, '').replace(/\*\/$/, '').trim();
}

/** The function a comment cites, read across the whole comment so that a citation the line
 *  wrapping happens to split in two is still found. */
function citation(comment: string[]): Citation | null {
  const cited = CITATION.exec(comment.map(commentText).join(' '));
  if (!cited) return null;
  return { address: cited[1], name: cited[3], game: CITED_GAME[cited[2]] };
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
  let comment: string[] = [];
  let inClass = false;
  for (const line of source.split('\n')) {
    if (line.trim() === '') {
      comment = [];
      continue;
    }
    if (isComment(line)) {
      comment.push(line);
      continue;
    }
    if (CLASS_START.test(line)) inClass = true;
    else if (line === '}') inClass = false;
    const method = inClass ? METHOD.exec(line) : null;
    const name =
      EXPORTED_FUNCTION.exec(line)?.[1] ??
      EXPORTED_VALUE.exec(line)?.[1] ??
      (method && method[1] !== 'constructor' && !BLOCK_WORDS.includes(method[1]) ? method[1] : null);
    if (name) found.push({ file, name, c: citation(comment) });
    comment = [];
  }
  return found;
}

const PORT_FILES: Record<GameId, PortFile[]> = {
  unforgiven: FILES.unforgiven.map((file) => ({ file, functions: declarations(file, SOURCES[file]) })),
  moraffsWorld: FILES.moraffsWorld.map((file) => ({ file, functions: declarations(file, SOURCES[file]) })),
};

/** One game's files with the declarations they hold, in the order the Source tab lists them. */
export function portFiles(game: GameId = 'unforgiven'): PortFile[] {
  return PORT_FILES[game];
}

const ALL = [...PORT_FILES.unforgiven, ...PORT_FILES.moraffsWorld].flatMap((entry) => entry.functions);

const BY_C_NAME: Record<GameId, Map<string, PortFunction[]>> = {
  unforgiven: new Map(),
  moraffsWorld: new Map(),
};
for (const fn of ALL) {
  if (!fn.c) continue;
  const byName = BY_C_NAME[fn.c.game];
  const ported = byName.get(fn.c.name);
  if (ported) ported.push(fn);
  else byName.set(fn.c.name, [fn]);
}

/** Every declaration of every file of both games, which is what the Source tab searches. */
export function allPortFunctions(): PortFunction[] {
  return ALL;
}

/** One declaration, or null where the file does not declare that name. */
export function portFunction(file: SourceFile, name: string): PortFunction | null {
  return ALL.find((fn) => fn.file === file && fn.name === name) ?? null;
}

/** The functions ported from one decompiled function, which is the citation read backwards. */
export function portsOfC(name: string, game: GameId = 'unforgiven'): PortFunction[] {
  return BY_C_NAME[game].get(name) ?? [];
}

/** The source text of one declaration, documentation comment included. */
export function portCode(file: SourceFile, name: string): string {
  return snippet(SOURCES[file], name);
}
