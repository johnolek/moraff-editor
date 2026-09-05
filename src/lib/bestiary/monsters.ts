import data from '../game/dotu-data.json';
import { MONSTER_TYPE_ODDS } from '../game/dotu-mech.js';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import { MODULE_NUMERALS } from '../map/labels';

type SectionData = (typeof data.sections)[number];

/** One row of the game's 16-entry monster type table. */
export interface MonsterType {
  type: number;
  hex: string;
  defense: number;
  damageDie: number;
  hpPerLevel: number;
  speed: number;
  /** The line the game prints when the monster turns up. */
  text: string;
}

export type MonsterOrigin =
  | { kind: 'builtin' }
  | {
      kind: 'section';
      /** 1..20 across all modules. */
      section: number;
      /** 0-based, as the map explorer counts modules. */
      module: number;
      /** 1..4 within the module. */
      part: number;
      /** Monster type index 22..26: 22 the Shadow boss, 23..25 the regulars, 26 the level drainer. */
      slot: number;
    };

export interface MonsterEntry {
  id: string;
  name: string;
  origin: MonsterOrigin;
  picnum: number;
  colorSet: number;
  color: number;
  type: MonsterType;
  expMult: number;
  levelDrain: number;
  statDrain: number;
  breath: number;
  special: number;
  /** Built-in monsters have no description in the game's data. */
  description: string | null;
  isBoss: boolean;
}

export interface MonsterGroup {
  label: string;
  monsters: MonsterEntry[];
}

/** A paragraph in MD.BIN starts with the monster's name in capitals followed by a colon. */
const DESCRIPTION_MARKER = /^[A-Z][A-Z .'-]+:/;

/**
 * The in-game description of each of a section's five monsters, in slot order.
 *
 * MD.BIN stores the five paragraphs as 20 forty-column lines with no separators, and a few
 * of them are headed by a name the monster table spells differently (FIRE ELEMENTAL for
 * Flame Elemental) or run in a different order than the monsters, so paragraphs are matched
 * to monsters by name where possible and handed out in order where not.
 */
export function monsterDescriptions(section: SectionData): string[] {
  const paragraphs = splitParagraphs(section.descriptions);
  const spare = paragraphs.filter((p) => !section.monsters.some((m) => m.name.toUpperCase() === p.name));
  return section.monsters.map((monster) => {
    const named = paragraphs.find((p) => p.name === monster.name.toUpperCase());
    return (named ?? spare.shift())?.text ?? '';
  });
}

function splitParagraphs(lines: string[]): { name: string; text: string }[] {
  const starts = lines.flatMap((line, i) => (DESCRIPTION_MARKER.test(line) ? [i] : []));
  return starts.map((start, i) => {
    const block = lines.slice(start, starts[i + 1] ?? lines.length);
    const name = DESCRIPTION_MARKER.exec(block[0])![0].slice(0, -1);
    block[0] = block[0].slice(name.length + 1).trim();
    return { name, text: joinLines(block) };
  });
}

/** A line broken mid-word ends in a hyphen; the rest of the word follows with no space. */
function joinLines(block: string[]): string {
  return block.reduce((text, line) => (text.endsWith('-') ? text + line : `${text} ${line}`)).trim();
}

/** special = 100 marks the Shadow boss of a section. */
const BOSS_SPECIAL = 100;

const builtins: MonsterEntry[] = data.builtinMonsters.map((monster) => ({
  id: `builtin-${monster.id}`,
  name: monster.name,
  origin: { kind: 'builtin' },
  picnum: monster.picnum,
  colorSet: monster.colorSet,
  color: monster.color,
  type: data.monsterTypes[monster.type],
  expMult: monster.expMult,
  levelDrain: monster.levelDrain,
  statDrain: monster.statDrain,
  breath: monster.breath,
  special: monster.special,
  description: null,
  isBoss: false,
}));

const sectionGroups: MonsterGroup[] = data.sections.map((section) => {
  const descriptions = monsterDescriptions(section);
  return {
    label: `Section ${section.section} · Module ${MODULE_NUMERALS[section.module - 1]} · ${section.monsters[0].name}`,
    monsters: section.monsters.map((monster, i) => ({
      id: `section-${section.section}-${monster.slot}`,
      name: monster.name,
      origin: {
        kind: 'section',
        section: section.section,
        module: section.module - 1,
        part: section.part,
        slot: monster.slot,
      },
      picnum: monster.picnum,
      colorSet: monster.colorSet,
      color: monster.color,
      type: data.monsterTypes[monster.type],
      expMult: monster.expMult,
      levelDrain: monster.levelDrain,
      statDrain: monster.statDrain,
      breath: monster.breath,
      special: monster.special,
      description: descriptions[i],
      isBoss: monster.special === BOSS_SPECIAL,
    })),
  };
});

const groups: MonsterGroup[] = [{ label: 'Built-in', monsters: builtins }, ...sectionGroups];

/** The 22 built-in monsters followed by the five monsters of each section, in slot order. */
export function allMonsters(): MonsterEntry[] {
  return groups.flatMap((group) => group.monsters);
}

/** The monster list as the database shows it: the built-ins, then one group per section. */
export function monsterGroups(): MonsterGroup[] {
  return groups;
}

/** An inclusive run of floors within one module; module is 0-based. */
export interface FloorRange {
  module: number;
  from: number;
  to: number;
}

export interface Appearance {
  kind: 'builtin' | 'section' | 'boss';
  ranges: FloorRange[];
}

/** One floor of one module, as the level control has it. */
export interface FloorChoice {
  module: number;
  floor: number;
}

/**
 * The floors of part 1..4 of a module. Each part is five floors per module number, except
 * the last, which runs on to the bottom of the module -- the same split as sectionOf().
 */
export function sectionFloors(module: number, part: number): FloorRange {
  const size = 5 * (module + 1);
  return { module, from: (part - 1) * size + 1, to: part === 4 ? BOTTOM_LEVEL[module] : part * size };
}

/** The modules the level control offers: any for a built-in, its own for a section monster. */
export function allowedModules(entry: MonsterEntry): number[] {
  return entry.origin.kind === 'builtin' ? [0, 1, 2, 3, 4] : [entry.origin.module];
}

/** The floors of the given module the monster can be stocked on. */
export function allowedFloors(entry: MonsterEntry, module: number): number[] {
  const ranges = whereItAppears(entry).ranges.filter((range) => range.module === module);
  return ranges.flatMap((range) => floorsOf(range));
}

/** Where the level control starts: the first floor the monster can appear on. */
export function homeFloor(entry: MonsterEntry): FloorChoice {
  const [first] = whereItAppears(entry).ranges;
  return { module: first.module, floor: first.from };
}

export function whereItAppears(entry: MonsterEntry): Appearance {
  if (entry.origin.kind === 'builtin') {
    return {
      kind: 'builtin',
      ranges: BOTTOM_LEVEL.map((bottom, module) => ({ module, from: 1, to: bottom })),
    };
  }
  const { module, part, section } = entry.origin;
  if (entry.isBoss) {
    const bossFloor = data.sections[section - 1].bossFloor;
    return { kind: 'boss', ranges: [{ module, from: bossFloor, to: bossFloor }] };
  }
  return { kind: 'section', ranges: [sectionFloors(module, part)] };
}

export function floorsOf(range: FloorRange): number[] {
  return Array.from({ length: range.to - range.from + 1 }, (_, i) => range.from + i);
}

/** statDrain 1..6 and -1..-6 name the stat the monster gives or takes (RE notes 4.3, 6.4). */
const DRAINED_STATS = ['Strength', 'Intelligence', 'Wisdom', 'Constitution', 'Agility', 'Luck'];

/** breath 1..5 (RE notes 6.4); only fire and ice are used by any monster. */
const BREATH_ELEMENTS = ['fire', 'ice', 'acid', 'disease', 'poison'];

const PUFFBALL_SPECIAL = 6;

/** What the monster does to you beyond its ordinary attack. */
export function describeEffects(entry: MonsterEntry): string[] {
  const lines: string[] = [];
  if (entry.levelDrain > 0) {
    lines.push(`Drains ${entry.levelDrain} level${entry.levelDrain === 1 ? '' : 's'} when it hits you`);
  }
  if (entry.levelDrain < 0) lines.push(`Drains ${-entry.levelDrain} experience when it hits you`);
  if (entry.statDrain !== 0) {
    const stat = DRAINED_STATS[Math.abs(entry.statDrain) - 1];
    lines.push(`${entry.statDrain > 0 ? '+1' : '-1'} ${stat} when it hits you`);
  }
  if (entry.breath > 0) {
    const element = BREATH_ELEMENTS[entry.breath - 1];
    const extra = entry.breath === 3 ? ', which destroys your armor' : '';
    lines.push(`Breathes ${element} instead of striking half the time${extra}`);
  }
  if (entry.special === 1) lines.push('Poisons you when it hits you');
  if (entry.special === 2) lines.push('Gives you a disease when it hits you');
  if (entry.special === PUFFBALL_SPECIAL) lines.push('Vanishes when it hits you, and is worth no experience');
  if (entry.isBoss) lines.push('Immune to Sleep, Go Away, Autokill, Drain Monster and grenades');
  return lines;
}

/**
 * The chance a monster slot on one of the monster's floors is stocked with it; null for a
 * Shadow boss, which takes the floor's first slot rather than being rolled for. The roll is
 * 1/20 a puffball (12 equally likely), else 1/7 a blocker (garbage can or ball), else 1/15
 * the section's level drainer, else 1/12 a poison or disease monster (8 equally likely),
 * else one of the section's three regulars (FAQ v2.2 [GTPS], RE notes 4.1).
 */
export function stockingOdds(entry: MonsterEntry): number | null {
  if (entry.origin.kind === 'builtin') {
    if (entry.special === PUFFBALL_SPECIAL) return MONSTER_TYPE_ODDS.puffball / 12;
    if (entry.special === 0) return MONSTER_TYPE_ODDS.blocker / 2;
    return MONSTER_TYPE_ODDS.poisonDisease / 8;
  }
  if (entry.isBoss) return null;
  return entry.origin.slot === 26 ? MONSTER_TYPE_ODDS.levelDrainer : MONSTER_TYPE_ODDS.sectionMonster / 3;
}
