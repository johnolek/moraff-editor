import { sectionOf } from './dotu-files.js';
import data from './dotu-data.json';

export interface SectionInfo {
  /** 1..20 across all modules. */
  section: number;
  /** 1..4 within the module. */
  part: number;
  bossFloor: number;
  /** The Shadow boss that guards the section. */
  bossName: string;
}

/** The section a floor belongs to, or null when there is none. The map can be pointed at any
 *  floor the game's 16-bit floor variable can hold, and floors below the town fall outside the
 *  twenty sections the game knows about. */
export function sectionInfo(moduleIndex: number, floor: number): SectionInfo | null {
  const section = sectionOf(moduleIndex, floor);
  const entry = data.sections[section - 1];
  if (!entry) return null;
  return { section, part: entry.part, bossFloor: entry.bossFloor, bossName: entry.monsters[0].name };
}
