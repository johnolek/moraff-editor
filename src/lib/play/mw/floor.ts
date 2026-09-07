import type { MwGame } from '../../game/mw-port/state';
import { MW_SQUARE_EMPTY, MW_SQUARE_PLAYER, mwOccupantAt, mwSetOccupant } from '../../game/mw-port/state';
import type { MwFloorSquare, MwStockedMonster } from '../../game/mw-port/stocking';
import { MONSTER_SLOTS, stockFloor } from '../../game/mw-port/stocking';
import type { Rng } from '../../game/port/rng';
import type { StockedMonster } from '../../map/stocking';

/**
 * Arriving on a floor: the 145 monsters it is stocked with, and the memory of three floors that
 * decides whether they are rolled again.
 *
 * The roll itself is `src/lib/game/mw-port/stocking.ts`, which is already a port of
 * generate_section (WORLD.EXE 2000:46a4); what is here is the table-swapping the same function
 * does before it decides to roll at all.
 */

/** One of the 145 monster slots, as the memset in generate_section leaves it. */
function emptySlot(): MwStockedMonster {
  return { x: 0, y: 0, hp: 0, type: 0, depth: 0 };
}

/** A floor's monster table, and which floor it belongs to. */
interface MwFloorTable {
  /** The floor this table holds the monsters of, or null for a table nothing has been put in. */
  level: number | null;
  monsters: MwStockedMonster[];
}

function emptyTable(): MwFloorTable {
  return { level: null, monsters: Array.from({ length: MONSTER_SLOTS }, emptySlot) };
}

/**
 * generate_section (WORLD.EXE 2000:46a4, mw.c "generate_section"): the three monster tables the
 * game rotates between, and which of them gets a fresh roll.
 *
 * The game keeps three tables at DS:cbde, DS:cbe6 and DS:cbea and their floor numbers at
 * DS:1237, DS:1239 and DS:123b. Arriving on the floor the second table holds, it swaps that one
 * to the front and rebuilds the occupancy grid from it, so the monsters are exactly where they
 * were left, minus the ones that were killed; the third table is swapped to the front the same
 * way. Arriving anywhere else, all three rotate, the oldest is emptied and filled with a fresh
 * roll, and floor 0 — the surface — is emptied and never filled.
 *
 * The original starts with three tables it believes hold floor 0 and reads the real ones out of
 * the character's `<slot>MON.MAP` file. There is no such file in a browser, so this starts with
 * three tables holding no floor at all and rolls the floor a character starts on like any other.
 */
export class MwFloorMonsters {
  /** The three tables, the one in play first. */
  private tables: MwFloorTable[] = [emptyTable(), emptyTable(), emptyTable()];

  /** Which floors are remembered, the one in play first. */
  get remembered(): (number | null)[] {
    return this.tables.map((table) => table.level);
  }

  /**
   * Put a floor's monsters in play, rolling them unless one of the three tables already holds
   * that floor. `rows` is the floor they are rolled onto.
   */
  stock(game: MwGame, rows: readonly (readonly MwFloorSquare[])[], level: number, rng: Rng): void {
    const [current, previous, older] = this.tables;
    if (level === previous.level) this.tables = [previous, current, older];
    else if (level === older.level) this.tables = [older, previous, current];
    else this.tables = [older, current, previous];
    const table = this.tables[0];
    const rolled = table.level !== level;
    table.level = level;
    game.monsters = table.monsters;
    game.monsterMap.fill(MW_SQUARE_EMPTY);
    if (!rolled) {
      // The re-visit branches write every one of the 145 slots onto the grid whatever its hit
      // points, so the monsters killed on this floor — blanked to (0, 0) by monster_killed — all
      // land on the top-left corner, where the last of them wins the square.
      for (let slot = 0; slot < table.monsters.length; slot++) {
        const monster = table.monsters[slot];
        mwSetOccupant(game, monster.x, monster.y, slot);
      }
      return;
    }
    for (const slot of table.monsters) Object.assign(slot, emptySlot());
    if (level === 0) return;
    // The character is on the grid before the roll, so nothing is stocked on top of them.
    mwSetOccupant(game, game.pc.x, game.pc.y, MW_SQUARE_PLAYER);
    const stocked = stockFloor(rng, game.pc.dungeon, level, rows, game.pc.killedBosses);
    for (let slot = 0; slot < stocked.length; slot++) {
      Object.assign(table.monsters[slot], stocked[slot]);
      mwSetOccupant(game, stocked[slot].x, stocked[slot].y, slot);
    }
  }
}

/**
 * enter_level (WORLD.EXE 2000:55fc, mw.c "enter_level"): arrive on a floor.
 *
 * What the original does besides is about files and pictures: it sets the palette, reads the
 * floor's monsters back out of `<slot>MON.MAP` or stocks them afresh, writes the explored map of
 * the block being left out to its `.DUN` file and reads the new one in.
 *
 * It also walks the 145 slots and zeroes the type of any monster whose picture WORLD.PIC does
 * not hold. Every monster the roll can produce has one — pick_monster refuses the others — so
 * that loop never fires and is left out here.
 */
export function mwEnterLevel(
  game: MwGame,
  floors: MwFloorMonsters,
  rows: readonly (readonly MwFloorSquare[])[],
  level: number,
  rng: Rng,
): void {
  floors.stock(game, rows, level, rng);
}

/**
 * The monsters standing on the floor, as the map draws them: every slot the occupancy grid holds
 * at its own square, which is what the automap reads to draw one.
 *
 * A slot with no hit points left is skipped. The game leaves a killed monster's blanked slot on
 * the grid at (0, 0) when its floor is visited again, and that square is rock the character can
 * never stand on, so drawing it would put a monster in the corner of the map that nothing can
 * reach.
 */
export function mwDrawnMonsters(game: MwGame): StockedMonster[] {
  const drawn: StockedMonster[] = [];
  for (let slot = 0; slot < game.monsters.length; slot++) {
    const monster = game.monsters[slot];
    if (monster.hp <= 0) continue;
    if (mwOccupantAt(game, monster.x, monster.y) !== slot) continue;
    drawn.push({
      slot,
      x: monster.x,
      y: monster.y,
      monsterId: String(monster.type),
      level: monster.depth,
      hp: monster.hp,
    });
  }
  return drawn;
}
