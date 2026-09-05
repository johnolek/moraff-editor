import data from '../game/dotu-data.json';
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
