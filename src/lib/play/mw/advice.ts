import { canLevelUp } from '../../game/mw-port/levels';
import type { MwCharacter } from '../../game/mw-port/state';
import type { MwGameSession } from './engine';
import { mwClearMessageBox, MW_MESSAGE_BOX } from './screens';

/**
 * FUN_3000_9383 (WORLD.EXE 3000:9383, mw.c "FUN_3000_9383"): what a little mouse says about the
 * state the character is in, one step in five.
 *
 * A character below their third level gets one of fourteen lessons instead, one step in thirty:
 * FUN_3000_8b27 (exe 3000:8b27) has a case for the first eleven and nothing at all for the last
 * three, so three steps out of every fourteen that reach it say nothing, and two more of the
 * eleven are held back unless they apply to the character (see {@link lessonIsDrawn}).
 *
 * The original draws these four lines at a time on the bottom half of the message box, each in a
 * colour of its own rather than in the box's colour 5, and the flag at DS:4484 that would show
 * the first lesson outright is never written anywhere, so the lessons only ever arrive through
 * the roll.
 */

/**
 * Which row of the message box the mouse starts on. Both functions print at y 0xf0, 0x122, 0x154
 * and 0x186, which are the box's fifth to eighth rows, and wipe the whole box first.
 */
const ADVICE_FIRST_ROW = 4;

/** The colour every one of the fourteen lessons is printed in (exe 3000:8b27). */
const LESSON_COLOUR = 3;

/**
 * What the mouse says, on the rows and in the colour the game prints it in.
 *
 * These are print_text calls rather than a message box, so nothing waits for a key afterwards and
 * nothing is spread out to the box's right-hand edge. The fill_rect each of them starts with
 * covers the strip above the box as well as the box itself, so both go.
 */
function printAdvice(session: MwGameSession, colour: number, lines: string[]): void {
  const game = session.game;
  session.clearBox();
  mwClearMessageBox(game);
  for (const [index, text] of lines.entries()) {
    game.draw({
      text,
      x: 0,
      y: MW_MESSAGE_BOX.y + (ADVICE_FIRST_ROW + index) * MW_MESSAGE_BOX.step,
      font: 0,
      colour,
    });
  }
}

/** The eleven lessons FUN_3000_8b27 has a case for, and the three empty slots after them. */
const LESSONS: string[][] = [
  // DS:4a84 4aa1 4abe 4adc
  [
    'OBJECTIVE: USE ARROW KEYS TO',
    'EXPLORE THE DUNGEON. USE THE',
    'LADDERS TO DESCEND TO DEEPER,',
    'MORE DANGEROUS PLACES.',
  ],
  // DS:4af3 4b0d 4b27
  ['IF YOU HAVE A MOUSE, JUST', 'POINT TO THINGS AND PRESS', 'BUTTONS TO SEE WHAT HAPPENS.'],
  // DS:4b44 4b61 4b7e 4b9a
  [
    'ON THE LEFT IS A MAP SHOWING',
    'THE AREA AROUND YOU. SLANTED',
    'LINES SHOW LADDERS GOING UP',
    'AND DOWN.',
  ],
  // DS:4ba4 4bc1 4bdd 4bfa. The third line has east and west the wrong way round.
  [
    'USE THE CURSOR KEYS TO MOVE.',
    'UP IS NORTH, DOWN IS SOUTH,',
    'LEFT IS EAST, RIGHT IS WEST.',
    'HIT F1 FOR MORE INFORMATION.',
  ],
  // DS:4c17 4c32 4c4e 4c6b
  [
    'MONSTERS ARE ONLY FOUND IN',
    'THE DUNGEON. YOU ARE IN THE',
    'TOWN NOW, SO YOU MUST FIND A',
    'LADDER AND GO DOWN IT.',
  ],
  // DS:4c82 4c9f 4cb8 4cd2
  [
    'YOUR MISSION: FIND TREASURES',
    'AND MONEY, GAIN POWER BY',
    'DEFEATING MONSTERS, ENJOY',
    'THE FUN AND EXCITEMENT.',
  ],
  // DS:4cea 4d04 4d1f 4d3b
  [
    'YOU NEED HEALTH POINTS TO',
    'STAY ALIVE. IF YOUR HEALTH',
    'POINTS FALL BELOW ZERO, YOU',
    'WILL DIE.',
  ],
  // DS:4d45 4d60 4d7d 4d97
  [
    'IF YOU ARE DAMAGED, CAST A',
    "CURE BY HITTING 'C' FOR CAST",
    "SPELL, THEN '2' FOR PREP.",
    'SPELL.',
  ],
  // DS:4d9e 4db8 4dd4 4df0
  [
    'TO VISIT AN INN, LOOK FOR',
    'SPECIALLY MARKED SQUARES IN',
    'IN THE TOWN. THEY REPRESENT',
    'INNS, TEMPLES, BANKS, ETC.',
  ],
  // DS:4e0b 4e26 4e43 4e5d
  [
    'PIECE OF ADVICE: WATCH OUT',
    'FOR BLACK OR GREEN MONSTERS.',
    'HE WHO LEARNS TO RUN AWAY',
    'LIVES TO FIGHT ANOTHER DAY.',
  ],
  // DS:4e79 4e92 4ead 4eca
  [
    'WHEN YOU FIND WEAPONS OR',
    "ARMOR, REMEMBER TO HIT 'W'",
    "OR 'A' TO ACTUALLY USE THESE",
    'VERY IMPORTANT ITEMS.',
  ],
  [],
  [],
  [],
];

/**
 * Whether the lesson at this place in the list is drawn at all.
 *
 * Two of FUN_3000_8b27's cases test the character before they print. Case 4, the lesson that
 * says monsters live in the dungeon and you are in the town, tests DS:c8a2, the floor, so it is
 * only drawn on the surface. Case 7, the lesson about casting a cure, tests DS:c11c, the class,
 * and class 0 is the Fighter, who has no spells to cast.
 *
 * The counter at DS:4482 is stepped by the caller before the case is reached, so a lesson held
 * back costs the character its turn: that step says nothing rather than saying the next lesson.
 */
function lessonIsDrawn(index: number, pc: MwCharacter): boolean {
  if (index === 4) return pc.floor === 0;
  if (index === 7) return pc.cls !== 0;
  return true;
}

/** How far through the fourteen lessons the game has got, which it keeps at DS:4482. */
export interface MwLessons {
  next: number;
}

/**
 * The mouse's turn to speak, which movecontrol gives it after every step. A character below
 * their third level may get a lesson instead, and then nothing else is said.
 */
export function adviseTheWalker(session: MwGameSession): void {
  const game = session.game;
  const lessons = session.lessons;
  const pc = game.pc;
  if (game.rng.random(5) !== 0) return;
  if (pc.lev < 3 && game.rng.random(6) === 1) {
    const index = lessons.next % LESSONS.length;
    const lesson = LESSONS[index];
    lessons.next += 1;
    if (lesson.length > 0 && lessonIsDrawn(index, pc)) printAdvice(session, LESSON_COLOUR, lesson);
    return;
  }
  switch (game.rng.random(8)) {
    case 0:
      // DS:4ee0 4efb 4f15 4f31
      if (pc.hp < Math.trunc(pc.maxHp / 4)) {
        printAdvice(session, 3, [
          'YOU ARE BADLY DAMAGED. YOU',
          'SHOULD CURE YOURSELF WITH',
          'THE CURE SPELL OR GO SEARCH',
          'THE TOWN FOR A TEMPLE.',
        ]);
      }
      return;
    case 1:
      // DS:4f48 4f65 4f80 4e39
      if (pc.lev * 3 + 3 < pc.floor) {
        printAdvice(session, 4, [
          'I THINK YOU WILL NOT SURVIVE',
          'THIS DEEP - THE DEEPER YOU',
          'GO, THE MORE POWERFUL THE',
          'MONSTERS.',
        ]);
      }
      return;
    case 2:
      // DS:4f9a 4fb4 4fd1 4fee
      if (pc.weight * 2 < pc.loadedWeight) {
        printAdvice(session, 5, [
          'YOU ARE CARRYING A LOT OF',
          'WEIGHT. THIS ALLOWS MONSTERS',
          'TO TAKE MORE STRIKES AT YOU.',
          'YOU SHOULD GO FIND A BANK.',
        ]);
      }
      return;
    case 3:
      // DS:5009 5021 503c 5059
      if (canLevelUp(game)) {
        printAdvice(session, 6, [
          'YOU ARE READY TO GAIN A',
          'LEVEL, WHICH WILL MAKE YOU',
          'MORE POWERFUL. YOU MUST STAY',
          'AT AN INN TO GAIN A LEVEL.',
        ]);
      }
      return;
    case 4:
      // DS:5074 5091 50ad 50c8. The three is the float at DS:45f1, so the advice comes once
      // the spell points are below a third of the maximum.
      if (pc.sp * 3 < pc.maxSp) {
        printAdvice(session, 6, [
          'YOU ARE RUNNING LOW ON SPELL',
          'POINTS. YOU CAN REGAIN YOUR',
          'SPELL POINTS BY STAYING AT',
          'AN INN IN THE TOWN.',
        ]);
      }
      return;
    case 5:
      // DS:50dc 50f6 510f 4f40
      if (pc.diseaseTimer > 0) {
        printAdvice(session, 8, [
          "YOU DON'T FEEL VERY WELL.",
          'YOU SHOULD REALLY TRY TO',
          'GET A CURE DISEASE AT A',
          'TEMPLE.',
        ]);
      }
      return;
    case 6:
      // DS:5127 5142 515c 5179
      if (pc.returnX === -1) {
        printAdvice(session, 3, [
          "DON'T YOU THINK YOU SHOULD",
          'BUY A RAISE DEAD CONTRACT',
          'WITH THE TEMPLE IN THE TOWN?',
          'IT HELPS A LOT WHEN YOU DIE.',
        ]);
      }
      return;
    case 7:
      // DS:5196 51b2 51cd
      if (pc.poisonTimer > 0) {
        printAdvice(session, 7, [
          'YOU HAVE BEEN POISONED. FOR',
          'A FEW JEWELS YOU CAN GET A',
          'CURE POISON AT A TEMPLE.',
        ]);
      }
  }
}
