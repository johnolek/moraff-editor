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

export function sectionInfo(moduleIndex: number, floor: number): SectionInfo {
  const section = sectionOf(moduleIndex, floor);
  const entry = data.sections[section - 1];
  return { section, part: entry.part, bossFloor: entry.bossFloor, bossName: entry.monsters[0].name };
}
