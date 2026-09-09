import { newFrame, type Frame } from '../../view3d/frame';
import { TEXT } from './colours';
import { drawText } from './font';
import { drawRevDebug } from './debug';
import type { RevKeptScreen } from './kept';
import { drawMap, drawMapMonsters } from './map';
import { drawMiddleBox, drawMonstersInPanel, type RevOccupancy } from './monsters';
import { blit, SCREEN_HEIGHT, SCREEN_WIDTH } from './paint';
import { drawExperience, drawHelp, drawMessages, drawPrompt, drawSpells, type RevWords } from './text';
import {
  drawPanel,
  EAST,
  newPanel,
  NORTH,
  panelFor,
  scanDirection,
  SOUTH,
  WEST,
  type RevViewPlace,
} from './views';

/**
 * The whole of Moraff's Revenge's screen, drawn the way the game draws it.
 *
 * `rev-tools/docs/SCREEN.md` describes it from two screenshots and this is the code behind it:
 * the message lines top left, the spells top right, the map down the left, the five boxes of the
 * view cross right of centre, and what a kill is worth at the bottom. Nothing here touches the
 * DOM, so the same code runs under vitest, in a browser and in `rev-tools/reference/render_screen.mjs`.
 */

/** The four directions in the order the game walks them (1000:6B6E increments and wraps). */
const COMPASS = [NORTH, EAST, SOUTH, WEST];

/** The labels over and under the four boxes, at the `LOCATE` each is printed at (1000:4BC6). */
const PANEL_LABELS: { text: string; row: number; column: number }[] = [
  { text: 'FRONT', row: 7, column: 28 },
  { text: 'LEFT', row: 20, column: 22 },
  { text: 'RIGHT', row: 20, column: 36 },
  { text: 'BACK', row: 25, column: 29 },
];

/** An empty floor, for a screen drawn with nobody standing anywhere. */
const NOBODY: RevOccupancy = { slotOn: () => 0, strengthOf: () => 0 };

/** Everything on the screen that the drawing cannot work out for itself. */
export interface RevScreenState {
  place: RevViewPlace;
  /** Whether the character has stood on a square, which is the whole of the map's memory. */
  known?: (column: number, row: number) => boolean;
  /** Where the monsters are standing, which only the views and the middle box read. */
  occupancy?: RevOccupancy;
  /** The monsters marked on the map, which is every one on the level in debug mode and none at
   *  all in the modes that show only what the game showed. */
  mapMonsters?: { column: number; row: number }[];
  /** The lines debug mode adds under the game's own messages. */
  debugLines?: string[];
  /** The words on the screen; with none of it given the screen comes out wordless. */
  words?: Partial<RevWords>;
  /** What the game has printed and not painted over, drawn last and over everything else the
   *  way the original's `PRINT` goes over whatever was on those cells (`kept.ts`). */
  kept?: RevKeptScreen;
}

/** The five boxes: the four views and the character's own square between them. */
export function drawViewCross(
  screen: Frame,
  place: RevViewPlace,
  occupancy: RevOccupancy,
  kept: RevKeptScreen | null = null,
): void {
  for (const direction of COMPASS) {
    const box = panelFor(place.facing, direction);
    const depths = scanDirection(place, direction);
    const panel = newPanel();
    drawPanel(panel, depths, place.level);
    drawMonstersInPanel(panel, place, direction, depths.reached, occupancy);
    blit(screen, panel, box.left, box.top);
  }
  drawMiddleBox(screen, place, occupancy, kept?.picture ?? null);
  for (const label of PANEL_LABELS) drawText(screen, label.text, label.row, label.column, TEXT);
}

/** The screen as the game would have it at this moment. */
export function drawRevScreen(state: RevScreenState): Frame {
  const screen = newFrame(SCREEN_WIDTH, SCREEN_HEIGHT);
  const occupancy = state.occupancy ?? NOBODY;
  const words = state.words ?? {};

  if (state.known) {
    drawMap(screen, { ...state.place, known: state.known });
    drawMapMonsters(screen, state.place, state.mapMonsters ?? []);
  }
  drawViewCross(screen, state.place, occupancy, state.kept ?? null);

  // The help is offered only where the box between the views is empty: the branch that finds a
  // monster on the square goes to the encounter instead of printing it (1000:49B4).
  if (occupancy.slotOn(state.place.column, state.place.row) === 0) drawHelp(screen, words.characterLevel ?? 1);

  drawMessages(screen, {
    messages: words.messages ?? [],
    inTown: words.inTown ?? state.place.level === 0,
    prompt: words.prompt ?? null,
    fight: words.fight ?? null,
    spells: words.spells ?? [],
    characterLevel: words.characterLevel ?? 1,
  });
  drawSpells(screen, words.spells ?? []);
  drawRevDebug(screen, state.debugLines ?? []);
  if (words.fight) drawExperience(screen, words.fight.experience);
  if (words.prompt) drawPrompt(screen, words.prompt);
  for (const run of state.kept?.runs() ?? []) drawText(screen, run.text, run.row, run.column, TEXT);
  return screen;
}
