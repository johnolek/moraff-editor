import data from '../game/dotu-data.json';

type SectionData = (typeof data.sections)[number];

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
