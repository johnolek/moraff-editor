/**
 * What the game has printed on the screen and not painted over yet.
 *
 * The rest of `screen/` draws the whole screen again out of the game as it stands, because
 * everything it draws — the map, the views, the message rows, the spells — is worked out from
 * the character and the level. A `LOCATE` and a `PRINT` are not: DUNSMALL.EXE prints a line and
 * the line stays on the screen until something writes over that part of it. The lines a fight
 * puts on rows 10 and 11, MONSTER BLOCKS WAY over the FRONT box, the two lines a kill prints
 * across the dead monster's picture and the three potion banners are all like that, so this is
 * where they live between the moment the game prints them and the moment it takes them away.
 *
 * It is a character grid because that is what the screen is. `SCREEN 1` has no text plane: a
 * printed character paints its own eight-by-eight cell and paints the rest of the cell in
 * colour 0 (`font.ts`), which is how the game rubs a line out by printing spaces over it. So a
 * cell here is either a character the game printed — a space included — or nothing at all,
 * meaning the game has printed nothing there and the screen underneath shows through.
 *
 * Three things take what is kept away, and they are the game's own three:
 *
 * * a `PRINT SPACE$(n)` over it, which is {@link blank};
 * * a `CLS`, which is {@link clear};
 * * the redraw of the map and the views at 1000:4275, which every key falls into through the
 *   per-key routine at 1000:3FFC and which a fight never reaches — also {@link clear}, since
 *   the port draws everything that redraw draws from the game every time it draws at all.
 */

/** The screen `SCREEN 1` gives, in characters (1000:017D sets the mode). */
export const KEPT_ROWS = 25;
export const KEPT_COLUMNS = 40;

/**
 * A line as the rows it is printed on, for words the game hands the screen as one string.
 *
 * A line of exactly forty characters fills its row and no more; a longer one carries on down the
 * rows under it.
 */
export function revPrintedRows(text: string): string[] {
  if (text.length <= KEPT_COLUMNS) return [text];
  const rows: string[] = [];
  for (let at = 0; at < text.length; at += KEPT_COLUMNS) rows.push(text.slice(at, at + KEPT_COLUMNS));
  return rows;
}

/** A stretch of one row the game has printed on, ready for `drawText`. */
export interface RevKeptRun {
  row: number;
  column: number;
  text: string;
}

/** The close-up of a monster left in the box between the views, by name and by the dungeon
 *  level whose bestiary that name belongs to. */
export interface RevKeptPicture {
  name: number;
  level: number;
}

export class RevKeptScreen {
  /** One character per cell, or null where the game has printed nothing. */
  private cells: (string | null)[] = new Array(KEPT_ROWS * KEPT_COLUMNS).fill(null);
  private row = 1;
  private column = 1;

  /** The picture the game drew in the middle box and has not rubbed out (1000:6C80). */
  picture: RevKeptPicture | null = null;

  /** `LOCATE row, column`. */
  locate(row: number, column: number): void {
    this.row = row;
    this.column = column;
  }

  /**
   * `PRINT text`, at the cursor, ending the line.
   *
   * A statement that ends with no separator is what makes the run-time write the newline, and
   * that is what puts a swing's hit line on row 11: 1000:8D00 blanks row 11 and then row 10, and
   * the line at 1000:8D5D is printed with no `LOCATE` of its own.
   */
  print(text: string): void {
    this.write(text);
    this.row += 1;
    this.column = 1;
  }

  /**
   * `PRINT text;`, which leaves the cursor at the end of what it printed instead of starting a
   * new row, so that whatever is printed next carries on from there.
   *
   * The buildings' typed prompts end that way (1000:23FB, 2427 and 0F32), which is how the
   * number reader at 1000:21F3 comes to echo the digits on the same row as the question, and so
   * does the temple's second line (1000:253D), which the march is played in the middle of.
   */
  printKeepingTheCursor(text: string): void {
    this.write(text);
  }

  /**
   * The characters onto the grid, wrapped the way the run-time wraps them.
   *
   * A character that would land past the fortieth column goes to the first column of the next
   * row instead, and the wrap is only taken when there is another character to put there. So a
   * line of exactly forty characters and the newline after it take one row between them, where a
   * line of forty-one takes two rows and leaves the cursor on a third.
   */
  private write(text: string): void {
    for (const character of text) {
      if (this.column > KEPT_COLUMNS) {
        this.row += 1;
        this.column = 1;
      }
      if (this.row >= 1 && this.row <= KEPT_ROWS && this.column >= 1) {
        this.cells[(this.row - 1) * KEPT_COLUMNS + (this.column - 1)] = character;
      }
      this.column += 1;
    }
  }

  /** `CSRLIN` and `POS(0)`: where the next character printed would go (1000:2205 and 220F). */
  cursor(): { row: number; column: number } {
    return { row: this.row, column: this.column };
  }

  /** `LOCATE row, column: PRINT text`. */
  printAt(row: number, column: number, text: string): void {
    this.locate(row, column);
    this.print(text);
  }

  /** `LOCATE row, column: PRINT SPACE$(width)`, which is how the game rubs a line out. */
  blank(row: number, column: number, width: number): void {
    this.printAt(row, column, ' '.repeat(width));
  }

  /** Nothing the game printed is on the screen any more. */
  clear(): void {
    this.cells.fill(null);
    this.picture = null;
    this.row = 1;
    this.column = 1;
  }

  /** What is on the screen, as one run per stretch of a row the game has printed on. */
  runs(): RevKeptRun[] {
    const runs: RevKeptRun[] = [];
    for (let row = 1; row <= KEPT_ROWS; row++) {
      let text = '';
      let start = 1;
      for (let column = 1; column <= KEPT_COLUMNS + 1; column++) {
        const cell = column > KEPT_COLUMNS ? null : this.cells[(row - 1) * KEPT_COLUMNS + (column - 1)];
        if (cell === null) {
          if (text !== '') runs.push({ row, column: start, text });
          text = '';
          continue;
        }
        if (text === '') start = column;
        text += cell;
      }
    }
    return runs;
  }
}
