import { blocked } from '../../game/revmap.js';
import { REV_POSITIONS, REV_STRENGTHS, SLOTS_PER_LEVEL } from '../../rev-bestiary/monsters';
import type { Rng } from '../../game/port/rng';

/**
 * The monsters standing on a level, and the turn one of them takes.
 *
 * `1.NUM` says where every monster on all seventy levels is and `2.NUM` how strong it is; both
 * are shared by every character on the disk and are saved on the way out of the game
 * (1000:B5C8), so they are the state of the disk rather than a shipped table. This holds a copy
 * of each for the session, which is as long as the tab is open, and the occupancy grid at DGROUP
 * 4E90 that the level's forty slots are cast into.
 *
 * `rev-tools/docs/MONSTERS.md` part 1 is the write-up. One thing there is wrong and is corrected
 * here: the gate at 1000:758D is not a hash, it is the wall rule itself, with the same threshold
 * the player's own move test uses. **A monster is stopped by a wall and walks through a door,
 * exactly as the character is.**
 */

/** The grid's own subscript, `22 * row + column` (1000:56CC). */
export const GRID_STRIDE = 22;

/** How many squares of the grid there are: it is indexed up to `22 * 19 + 20`. */
const GRID_SIZE = GRID_STRIDE * 21;

/** A slot of `1.NUM` packs the square as `32 * row + column` (1000:76CE). */
const COLUMN_SCALE = 32;

/** The four directions a monster steps in, which are the facings the move code uses. */
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

/** One monster standing on the level. */
export interface RevStanding {
  /** Its slot number, which is the whole monster: the name, the level and the kind come out of
   *  it (`../../rev-bestiary/monsters.ts`). */
  slot: number;
  column: number;
  row: number;
}

/** What the monsters need to know about the character to take a turn. */
export interface RevWalker {
  column: number;
  row: number;
  /** 1 north to 4 west (DGROUP B47C). */
  facing: number;
  level: number;
  /** The generation the wall rule is drawn from, which is the character's own (DGROUP B488). */
  generation: number;
  /** The player's weight, which is what a monster notices them by (DGROUP B570). */
  weight: number;
  /** The moves left on the invisibility spell, which is element 5 of the ten-value array
   *  (DGROUP 6034). */
  invisible: number;
  /** The slot the character is fighting, or 0 for no fight (DGROUP B50E with B69C). */
  fighting: number;
  /** The level of the last monster the character met, or 0 until they have met one (DGROUP
   *  B6B4). The wander roll reads this rather than the level of the monster taking the turn. */
  lastMonsterLevel: number;
}

/** The monsters of one dungeon, as the session holds them. */
export class RevMonsters {
  /** `1.NUM`: the square each slot stands on, packed. */
  readonly positions: number[] = REV_POSITIONS.slice();
  /** `2.NUM`: how strong the monster in each slot is. */
  readonly strengths: number[] = REV_STRENGTHS.slice();
  /** The occupancy grid at DGROUP 4E90: the slot number standing on each square, or 0. */
  readonly grid: number[] = new Array<number>(GRID_SIZE).fill(0);
  /** DGROUP B4FE: the cursor that walks the level's forty slots. */
  cursor = 0;
  /** DGROUP B502 and B506: the two slots the "it has noticed you" code marks. */
  awake1 = 0;
  awake2 = 0;
  /** DGROUP B530: the slot whose turn it is. */
  moving = 0;
  /** The level the grid holds, so that nothing walks on a level nobody is standing on. */
  private level = -1;

  /**
   * 1000:7932: the grid is cleared and the level's forty slots are cast into it, each rerolled
   * while another monster stands on its square. Level 0 is left empty — nothing walks in the
   * town.
   */
  stock(level: number, rng: Rng): void {
    this.grid.fill(0);
    this.level = level;
    this.cursor = SLOTS_PER_LEVEL * level - (SLOTS_PER_LEVEL - 1);
    if (level === 0) return;
    for (let slot = this.cursor; slot <= SLOTS_PER_LEVEL * level; slot++) {
      for (;;) {
        const packed = this.positions[slot];
        const row = Math.trunc(packed / COLUMN_SCALE);
        const column = packed - row * COLUMN_SCALE;
        if (this.grid[GRID_STRIDE * row + column] <= 0) {
          this.grid[GRID_STRIDE * row + column] = slot;
          break;
        }
        // 1000:7A2E: 66 is 2 * 32 + 2, which keeps a rerolled monster off the outer ring.
        this.positions[slot] = rng.random(18) + rng.random(17) * COLUMN_SCALE + 66;
      }
    }
    this.awake1 = 0;
    this.awake2 = 0;
  }

  /** The slot standing on a square, or 0 (1000:56CC). */
  slotOn(column: number, row: number): number {
    return this.grid[GRID_STRIDE * row + column] ?? 0;
  }

  /** 1000:6FBD: the square a slot's packed number names. */
  squareOf(slot: number): RevStanding {
    const packed = this.positions[slot];
    const row = Math.trunc(packed / COLUMN_SCALE);
    return { slot, column: packed - row * COLUMN_SCALE, row };
  }

  /** Every monster standing on the level the grid holds, for the map to draw. */
  standing(): RevStanding[] {
    const monsters: RevStanding[] = [];
    for (let index = 0; index < GRID_SIZE; index++) {
      const slot = this.grid[index];
      if (slot > 0) monsters.push({ slot, column: index % GRID_STRIDE, row: Math.trunc(index / GRID_STRIDE) });
    }
    return monsters;
  }

  /**
   * 1000:7001: one monster takes a turn.
   *
   * The cursor walks the level's forty slots in order and wraps, skipping the slot after each of
   * the two awake ones, and **only the odd slots ever act** — the even ones fall out at
   * 1000:7085 and sit still.
   */
  takeATurn(walker: RevWalker, rng: Rng): void {
    if (walker.level === 0) return;
    this.cursor += 1;
    if (this.cursor + 1 === this.awake1 || this.cursor + 1 === this.awake2) this.cursor += 1;
    const last = SLOTS_PER_LEVEL * walker.level;
    if (last < this.cursor) this.cursor = last - (SLOTS_PER_LEVEL - 1);
    this.moving = this.cursor;
    if (this.moving / 2 === Math.trunc(this.moving / 2)) return;
    this.act(this.moving, walker, rng);
  }

  /**
   * 1000:70A1: the monster whose turn it is, acting.
   *
   * The monster the character is fighting always acts; any other one has to be noticed first,
   * and a heavier character is noticed more often — the roll at 1000:70C1 gives up when
   * `INT(RND * 700) - 400` comes out above the weight.
   */
  act(slot: number, walker: RevWalker, rng: Rng): void {
    const engaged = walker.fighting !== 0 && slot === walker.fighting;
    if (!engaged && rng.random(700) - 400 > walker.weight) return;
    const at = this.squareOf(slot);
    if (at.column === walker.column && at.row === walker.row) return;
    if (engaged) {
      // 1000:7166: the monster being fought steps straight onto the character's square, awake
      // and lined up whatever it was before.
      this.awake1 = this.awake1 === 0 ? slot : this.awake1;
      this.commit(slot, at, walker.column, walker.row);
      return;
    }
    const state = this.noticing(slot, at, walker, rng);
    const direction = this.chooseDirection(slot, at, walker, state, rng);
    this.step(slot, at, direction, walker);
  }

  /**
   * 1000:7196 to 1000:738D: whether the monster is awake and whether it is lined up with the
   * character on one axis, which between them decide how it moves.
   *
   * A monster four squares away that is already the first awake one stays awake, and five away
   * for the second; otherwise it is forgotten. One that is lined up and within five squares
   * rolls to notice the character, and the invisibility spell is what can stop it.
   */
  private noticing(slot: number, at: RevStanding, walker: RevWalker, rng: Rng): { awake: boolean; lined: boolean } {
    const away = Math.abs(walker.column - at.column) + Math.abs(walker.row - at.row);
    let lined = at.column === walker.column || at.row === walker.row;
    if (away < 4 && slot === this.awake1) return { awake: true, lined };
    if (away < 5 && slot === this.awake2) return { awake: true, lined };
    if (slot === this.awake1) this.awake1 = 0;
    if (slot === this.awake2) this.awake2 = 0;
    if (!lined) return { awake: false, lined };
    if (Math.abs(walker.column - at.column) >= 6 || Math.abs(walker.row - at.row) >= 6) {
      lined = false;
      return { awake: false, lined };
    }
    // 1000:7325: a heavier character is heard, and invisibility is a second chance to be missed.
    const unheard = rng.random(600) >= walker.weight;
    if (unheard && walker.invisible === 1 && rng.random(10) < 5) return { awake: false, lined };
    if (this.awake1 === 0) this.awake1 = slot;
    return { awake: true, lined };
  }

  /**
   * 1000:73AA: the direction the monster picks. One that is not awake wanders, and so does an
   * awake one some of the time — `INT(RND * (L + 35)) < 15`.
   *
   * `L` is DGROUP B6B4, the level of the last monster the character met, which 1000:73BC loads
   * straight into the roll. It is not the level of the monster taking the turn, and it is zero
   * until the character has met anybody, so until then every awake monster chases the same
   * fraction of the time whatever its own level is. The clock's own odds read the same variable,
   * and the slip is the original's both times.
   *
   * An awake one that is lined up with the character closes along the axis they share; one that
   * is not moves across the way the character is facing.
   */
  private chooseDirection(slot: number, at: RevStanding, walker: RevWalker, state: { awake: boolean; lined: boolean }, rng: Rng): number {
    if (!state.awake || rng.random(walker.lastMonsterLevel + 35) < 15) return rng.random(4) + 1;
    if (!state.lined) {
      if (walker.facing === NORTH || walker.facing === SOUTH) return at.column > walker.column ? WEST : EAST;
      return at.row > walker.row ? NORTH : SOUTH;
    }
    if (at.column === walker.column) return at.row > walker.row ? NORTH : SOUTH;
    if (at.row === walker.row) return at.column > walker.column ? WEST : EAST;
    return rng.random(4) + 1;
  }

  /**
   * 1000:7514: the direction as a square one step away, refused when a wall is in the way.
   *
   * The wall asked for is the one the player's own move test asks for (1000:548B): north and
   * south are the wall across the top of the square being entered, east and west the wall down
   * its left-hand side, and anything over 7 refuses the step.
   */
  private step(slot: number, at: RevStanding, direction: number, walker: RevWalker): void {
    let column = at.column;
    let row = at.row;
    let kind = 1;
    if (direction === EAST) {
      column += 1;
      kind = 2;
    } else if (direction === SOUTH) {
      row += 1;
    } else if (direction === WEST) {
      kind = 2;
    }
    if (blocked(kind, column, row, walker.level, walker.generation)) return;
    let toColumn = at.column;
    let toRow = at.row;
    if (direction === NORTH) toRow = Math.max(at.row - 1, 1);
    if (direction === EAST) toColumn = Math.min(at.column + 1, 20);
    if (direction === SOUTH) toRow = Math.min(at.row + 1, 19);
    if (direction === WEST) toColumn = Math.max(at.column - 1, 1);
    this.commit(slot, at, toColumn, toRow);
  }

  /**
   * 1000:7667: the step is taken. It is refused when another monster already stands there or
   * when the clamp left the monster where it was; otherwise the two grid cells are swapped and
   * the new square written back into `1.NUM`.
   */
  private commit(slot: number, at: RevStanding, column: number, row: number): void {
    if (this.slotOn(column, row) > 0) return;
    if (column === at.column && row === at.row) return;
    const to = GRID_STRIDE * row + column;
    const from = GRID_STRIDE * at.row + at.column;
    const held = this.grid[to];
    this.grid[to] = this.grid[from];
    this.grid[from] = held;
    this.positions[slot] = COLUMN_SCALE * row + column;
  }
}
