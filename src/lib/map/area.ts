import { DUNGEON_XMAX, DUNGEON_YMAX } from '../game/unfmap.js';

/**
 * How much of a floor the game itself shows and lets you walk on. The game keeps the size in
 * two globals, DS:2328 = 79 columns and DS:232a = 104 rows, and checks a destination square
 * against them in relocate (exe 3000:da2c), pass_wall (exe 3000:e003) and go_away. The
 * generator fills the whole 80 x 110 grid, so column 79 and rows 104 to 109 exist and can
 * hold open squares, but nothing in the game ever draws or reaches them.
 */
export const MAP_COLUMNS = DUNGEON_XMAX;
export const MAP_ROWS = DUNGEON_YMAX;
