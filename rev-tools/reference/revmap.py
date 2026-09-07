#!/usr/bin/env python3
"""Draw a floor of Moraff's Revenge: its walls, its doors and its ladders.

Nothing in the game folder holds the dungeon's walls.  Every wall is worked out
from the square's own coordinates when it is needed, by the routine at
1000:548B for the move test and 1000:4B5F for the map, both of which compute

    INT(ABS(SIN(kind * column * row * (level + 2) / generation + 10)) * 10)

with `kind` 1 for the wall along the top of a square and 2 for the wall down its
left-hand side.  8 and 9 are a wall, 6 and 7 a door, anything less an opening.
`../docs/DUNGEON.md` is the write-up, with the addresses and the evidence.

    python3 revmap.py --level 2
    python3 revmap.py --level 2 --explored ~/games/rev2/5.BIN
    python3 revmap.py --check ~/games/rev2/[1-5].BIN

`generation` is the character's own, value 26 of `<n>.EXE`: 1 until the
character drinks from the fountain of youth on level 70, and two more each time
it does, which gives that character a dungeon of its own.
"""
import argparse

import mbf
import read_bsave
import read_dungeon

COLUMNS = 20
ROWS = 19            # the move code stops the player at row 19 (1000:32E5)
LEVELS = 70

# 1000:548B, and the same expression at 1000:4B5F and twelve times in the 3-D
# view.  `kind` is the multiplier the caller passes in: the four move
# directions at 1000:30D9, 3192, 3254 and 3316 use 1 for north and south and 2
# for east and west.
ACROSS, DOWN = 1, 2

# 1000:3149 and its three twins: the move happens unless the value is over 7.
# The map draws a line when it is over 5 (1000:4407) and breaks that line in
# the middle when it is 7 or less (1000:4432), so 6 and 7 are a door.
WALL = 8
DOOR = 6


def wall(kind, column, row, level, generation=1):
    """The wall value of one side of a square, to the bit.

    The order of operations is 1000:548B's, which is the one the move test
    uses: the level term is divided by the generation first and the three
    coordinates are multiplied on afterwards.  The map at 1000:4B5F multiplies
    first and divides last; with a generation of 1 the two agree everywhere,
    and afterwards they disagree about a handful of squares in 60,480.
    """
    value = mbf.divide(mbf.from_int(level + 2), mbf.from_int(generation))
    for term in (kind, column, row):
        value = mbf.multiply(value, mbf.from_int(term))
    value = mbf.add(value, mbf.TEN)
    value = mbf.multiply(mbf.sin(value), mbf.TEN)
    return int(mbf.value(mbf.integer(mbf.absolute(value))))


def blocked(kind, column, row, level, generation=1):
    return wall(kind, column, row, level, generation) >= WALL


def fold(code):
    """1000:5649: take 3 off twice while the code is over 3."""
    for _ in range(2):
        if code > 3:
            code -= 3
    return code


def feature(column, row, level):
    """What 1000:552B finds on a square: a ladder, a chute, or nothing.

    The square's own code is a ladder going up when it is 1 to 9, folded down
    to 1, 2 or 3 by 1000:5649, which is how many levels the ladder spans.  A
    code of 0 is a chute -- the automap draws those as a circle (1000:52BB) and
    the help calls a circle a chute.  Otherwise each of the three levels below
    is asked in turn (1000:55A6), and a ladder goes down that far when that
    level's folded code equals the distance.  The town skips straight to that
    loop.
    """
    if level > 0:
        code = read_dungeon.feature_code(column, row, level)
        if code == 0:
            return None if level == LEVELS else ("chute", 0)
        if 1 <= code <= 9:
            return ("up", fold(code))
    for step in (1, 2, 3):
        if level + step > LEVELS:
            break
        code = read_dungeon.feature_code(column, row, level, step)
        if 1 <= code <= 9 and fold(code) == step:
            return ("down", step)
    return None


def explored_rows(path):
    """Rows 1..20 of every level of a character's `<n>.BIN`."""
    values = mbf.singles(read_bsave.read(path)[2])
    return {level: read_bsave.level_rows(values, level)
            for level in range(len(values) // read_bsave.LEVEL_STRIDE)}


def walked(rows, column, row):
    return read_bsave.is_set(rows[row - 1], column) if rows else False


GLYPH = {("up", 1): "U", ("up", 2): "u", ("up", 3): "^",
         ("down", 1): "D", ("down", 2): "d", ("down", 3): "v",
         ("chute", 0): "O"}


def side_glyph(value, vertical, solid=False):
    """A wall, a door or an opening, drawn across or down."""
    if solid or value >= WALL:
        return "|" if vertical else "---"
    if value >= DOOR:
        return ":" if vertical else "- -"
    return " " if vertical else "   "


def draw(level, generation=1, rows=None):
    """One floor as text: walls, doors, ladders and the squares walked.

    The four outer sides are drawn solid whatever the rule says, because the
    game does the same -- its map draws them as a line outright (1000:4DF3 for
    row 1, 4F52 for column 1, 50FA for column 20, 51F8 for row 19) and the move
    code will not step past them.
    """
    lines = ["level %d, generation %d" % (level, generation),
             "    " + "".join("%-4d" % column for column in range(1, COLUMNS + 1))]
    for row in range(1, ROWS + 1):
        above = "    "
        middle = "%3d " % row
        for column in range(1, COLUMNS + 1):
            above += "+" + side_glyph(wall(ACROSS, column, row, level, generation),
                                      False, row == 1)
            middle += side_glyph(wall(DOWN, column, row, level, generation),
                                 True, column == 1)
            fill = "." if walked(rows, column, row) else " "
            middle += fill + GLYPH.get(feature(column, row, level), fill) + fill
        lines.append(above + "+")
        lines.append(middle + "|")
    lines.append("    " + "+---" * COLUMNS + "+")
    return "\n".join(lines)


def check(path, generation=1):
    """Replay a character's explored squares against the rule.

    A square a character stood on was walked to from a square beside it, so the
    squares it has seen on one level cannot be cut into pieces by walls.  This
    counts the adjacent explored pairs a wall separates and how many pieces the
    explored squares fall into.
    """
    rows_by_level = explored_rows(path)
    pairs = separated = 0
    report = []
    for level, rows in sorted(rows_by_level.items()):
        seen = [(c, r) for r in range(1, ROWS + 1) for c in range(1, COLUMNS + 1)
                if read_bsave.is_set(rows[r - 1], c)]
        if not seen:
            continue
        parent = {square: square for square in seen}

        def root(square):
            while parent[square] != square:
                parent[square] = parent[parent[square]]
                square = parent[square]
            return square

        for column, row in seen:
            for kind, neighbour in ((ACROSS, (column, row - 1)),
                                    (DOWN, (column - 1, row))):
                if neighbour not in parent:
                    continue
                pairs += 1
                if blocked(kind, column, row, level, generation):
                    separated += 1
                    continue
                one, other = root((column, row)), root(neighbour)
                if one != other:
                    parent[one] = other
        report.append((level, len(seen), len({root(s) for s in seen})))
    return pairs, separated, report


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--level", type=int, default=1)
    parser.add_argument("--generation", type=int, default=1)
    parser.add_argument("--explored", help="a character's <n>.BIN")
    parser.add_argument("--check", nargs="+", metavar="BIN",
                        help="replay characters' explored squares against the rule")
    arguments = parser.parse_args()
    if arguments.check:
        for path in arguments.check:
            pairs, separated, report = check(path, arguments.generation)
            print("%s: %d adjacent explored pairs, %d with a wall between them"
                  % (path, pairs, separated))
            for level, squares, pieces in report:
                print("    level %-2d %4d squares walked, %d piece(s)"
                      % (level, squares, pieces))
        return
    rows = explored_rows(arguments.explored).get(arguments.level) \
        if arguments.explored else None
    print(draw(arguments.level, arguments.generation, rows))
    print("  wall  ---  |      door  - -  :      ladder up U u ^   down D d v"
          "   chute O   walked .")


if __name__ == "__main__":
    main()
