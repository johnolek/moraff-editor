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
  /** Element 5 of the ten-value array (DGROUP 6034), the invisibility spell's counter. The
   *  notice roll at 1000:7342 tests it against 1 exactly, so any larger number is no help. */
  invisible: number;
  /** DGROUP B50E: 1 while a fight is up and 0 the rest of the time. */
  fighting: number;
  /** DGROUP B69C: the slot the last fight was against. Only 1000:8068, where a monster is met,
   *  ever writes it, so it still names that monster long after the fight is over. */
  fought: number;
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
  /**
   * DGROUP B6A4: the monster taking a turn has noticed the character.
   *
   * It is a variable of the program rather than an answer worked out afresh, and that shows: two
   * of the ways out of the noticing code leave it alone — a monster that is not lined up with
   * the character at all (1000:72B8) and one that invisibility hid the character from
   * (1000:7371) — so those inherit whether the monster that moved before them was awake. Meeting
   * a monster (1000:803D) and killing one (1000:A36F) put it back to 0.
   */
  awake = 0;
  /** DGROUP B6A8: the monster taking a turn shares a row or a column with the character. Every
   *  path through the noticing code writes it before anything reads it. */
  lined = 0;
  /** DGROUP B6B0: the direction the monster taking a turn is stepping in, 1 north to 4 west. */
  heading = 0;
  /** How many steps the monsters have taken between them. Nothing in the game counts this; the
   *  Play tab reads it to tell a clock tick that moved somebody from one that moved nobody. */
  moves = 0;
  /**
   * 1000:7932: the grid is cleared and the level's forty slots are cast into it, each rerolled
   * while another monster stands on its square. Level 0 is left empty — nothing walks in the
   * town.
   */
  stock(level: number, rng: Rng): void {
    this.grid.fill(0);
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
   * `INT(RND * 700) - 400` comes out above the weight. That roll is one term of an expression
   * rather than the far side of a branch, so it comes off the generator on every turn, the
   * fought monster's included.
   */
  act(slot: number, walker: RevWalker, rng: Rng): void {
    const unnoticed = rng.random(700) - 400 > walker.weight;
    // 1000:70A1 asks for "no fight on" and "not the slot the fight was against" separately
    // rather than for "not the monster being fought", and B69C is never cleared, so the monster
    // of the last fight goes on acting every turn once that fight is over.
    if (walker.fighting !== 1 && slot !== walker.fought && unnoticed) return;
    const at = this.squareOf(slot);
    if (at.column === walker.column && at.row === walker.row) return;
    if (walker.fighting === 1 && slot === walker.fought) {
      // 1000:7166: the monster being fought is marked awake and lined up whatever it was before,
      // and steps straight onto the character's square.
      this.awake = 1;
      this.lined = 1;
      this.heading = 0;
      this.commit(slot, at, walker.column, walker.row);
      return;
    }
    this.notice(slot, at, walker, rng);
    this.chooseDirection(at, walker, rng);
    this.step(slot, at, walker);
  }

  /**
   * 1000:7196 to 1000:738D: whether the monster is awake and whether it is lined up with the
   * character on one axis, which between them decide how it moves.
   *
   * A monster four squares away that is already the first awake one stays awake, and five away
   * for the second; otherwise it is forgotten. One that is lined up and close enough rolls to
   * notice the character, and an invisibility counter standing at exactly 1 is a second chance
   * to be missed.
   */
  private notice(slot: number, at: RevStanding, walker: RevWalker, rng: Rng): void {
    this.lined = at.column === walker.column || at.row === walker.row ? 1 : 0;
    const away = Math.abs(walker.column - at.column) + Math.abs(walker.row - at.row);
    if (away < 4 && slot === this.awake1) {
      this.awake = 1;
      return;
    }
    if (away < 5 && slot === this.awake2) {
      this.awake = 1;
      return;
    }
    if (slot === this.awake1) this.awake1 = 0;
    if (slot === this.awake2) this.awake2 = 0;
    // 1000:72B8: a monster on neither the character's row nor their column stops here without
    // touching the awake flag, so it keeps whatever the monster that moved before it left there.
    if (this.lined === 0) return;
    // 1000:72C3: "close enough" is written as two tests and only the first of them says
    // anything. The second loads DGROUP B60A, the row the redraw last put the *character* on,
    // where it means the monster's (1000:72E1), and takes it off the character's row, so it is
    // always 0 and always under 6. What is left is the columns, whichever axis the two share —
    // which is why a monster standing on the character's own column notices them from any
    // distance up it, and one on their row has to be within five columns.
    if (Math.abs(walker.column - at.column) >= 6) {
      this.lined = 0;
      this.awake = 0;
      return;
    }
    this.lined = 1;
    // 1000:7325: a heavier character is heard.
    if (rng.random(600) >= walker.weight) {
      // 1000:734E: the second chance to be missed is rolled whether or not the character is
      // invisible, and only then is it ANDed with the counter standing at exactly 1.
      const missed = rng.random(10) < 5;
      if (walker.invisible === 1 && missed) return;
    }
    this.awake = 1;
    if (this.awake1 === 0) this.awake1 = slot;
  }

  /**
   * 1000:73AA: the direction the monster picks. One that is not awake wanders, and so does an
   * awake one some of the time — `INT(RND * (L + 35)) < 15`.
   *
   * `L` is DGROUP B6B4, the level of the last monster the character met, which 1000:73BC loads
   * straight into the roll. It is not the level of the monster taking the turn, and it is zero
   * until the character has met anybody, so until then every awake monster chases the same
   * fraction of the time whatever its own level is. The clock's own odds read the same variable,
   * and the slip is the original's both times. The two are ORed into one expression, so the
   * wander roll is made even for a monster that is asleep and was going to wander anyway.
   *
   * An awake one that is lined up with the character closes along the axis they share; one that
   * is not moves across the way the character is facing.
   */
  private chooseDirection(at: RevStanding, walker: RevWalker, rng: Rng): void {
    const wanders = rng.random(walker.lastMonsterLevel + 35) < 15;
    if (this.awake === 0 || wanders) {
      this.heading = rng.random(4) + 1;
      return;
    }
    if (this.lined !== 1) {
      if (walker.facing === NORTH || walker.facing === SOUTH) {
        this.heading = at.column > walker.column ? WEST : EAST;
        return;
      }
      this.heading = at.row > walker.row ? NORTH : SOUTH;
      return;
    }
    // 1000:74A6: neither test is an else, and neither writes the heading when the monster shares
    // neither coordinate — which cannot happen, since sharing neither is not being lined up.
    if (at.column === walker.column) this.heading = at.row > walker.row ? NORTH : SOUTH;
    if (at.row === walker.row) this.heading = at.column > walker.column ? WEST : EAST;
  }

  /**
   * 1000:7514: the direction as a square one step away, refused when a wall is in the way.
   *
   * The wall asked for is the one the player's own move test asks for (1000:548B): north and
   * south are the wall across the top of the square being entered, east and west the wall down
   * its left-hand side, and anything over 7 refuses the step.
   */
  private step(slot: number, at: RevStanding, walker: RevWalker): void {
    const direction = this.heading;
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
    this.moves += 1;
  }
}
