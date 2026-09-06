import type { Square } from '../game/unfmap.js';
import { isOnMap } from './area';
import { teleporterTargets, type Feature } from './floor-info';
import { GLYPH_LABELS, MODULE_NUMERALS, TOWN_BUILDINGS } from './labels';
import type { Note } from './notes';
import { hasTeleporterSide } from './path';
import { monsterById, type StockedMonster } from './stocking';

/** Where the teleporter on a square leads: "Teleporter to Module II or IV". */
export function describeTeleporter(moduleIndex: number): string {
  const targets = teleporterTargets(moduleIndex).map((index) => MODULE_NUMERALS[index]);
  return `Teleporter to Module ${targets.join(' or ')}`;
}

export function describeFeature(feature: Feature): string | null {
  if (!feature) return null;
  if (feature.kind === 'town') return TOWN_BUILDINGS[feature.building - 1];
  const { floor, x, y } = feature.destination;
  const landing = feature.kind === 'trapdoor' ? `, lands at ${x}, ${y}` : '';
  return `${GLYPH_LABELS[feature.kind]} to floor ${floor}${landing}`;
}

/** The monster standing on a square: "Gargalon · level 7 · 43 HP". */
export function describeMonster(monster: StockedMonster): string {
  return `${monsterById(monster.monsterId).name} · level ${monster.level} · ${monster.hp} HP`;
}

export interface SquareDescription {
  title: string;
  rock: boolean;
  feature: string | null;
  /** Whether the square is one of those the generator filled outside the area the game shows. */
  beyondMap: boolean;
}

/** What a square beyond the area the game shows is worth saying, whatever it holds. */
const BEYOND_MAP = "Beyond the game's map: nothing can reach this square.";

/** A teleporter is only mentioned on squares that hold nothing else, since a ladder, chute,
 *  trap door or building is the more useful thing to say about the square. */
export function describeSquare(square: Square, feature: Feature, x: number, y: number, moduleIndex: number): SquareDescription {
  const title = `Square ${x}, ${y}`;
  if (!isOnMap({ x, y })) return { title, rock: square.solid, feature: BEYOND_MAP, beyondMap: true };
  const named = describeFeature(feature);
  return {
    title,
    rock: square.solid,
    feature: named ?? (!square.solid && hasTeleporterSide(square) ? describeTeleporter(moduleIndex) : null),
    beyondMap: false,
  };
}

/** The one line the panel and the tooltip lead with. */
export function featureLine(description: SquareDescription): string | null {
  if (description.beyondMap) return description.feature;
  return description.rock ? 'Rock' : description.feature;
}

export function describeNote(note: Note): string {
  if (note.kind === 'oneWayUp') return `One way: no ladder back down from floor ${note.topFloor}.`;
  return `Lands on a chute to floor ${note.chuteFloor}.`;
}
