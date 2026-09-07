/**
 * The text of one declaration, lifted out of a source file.
 *
 * The Formulas tab shows the code the app really runs, and a production build minifies every
 * name away, so reading a function back with toString() is useless there. The sources are
 * imported as text with Vite's ?raw suffix and the declaration is found by scanning that text.
 * The scanner knows only as much JavaScript as this codebase's own style needs: a top level
 * function, a const holding a value, or a method inside a class, with the documentation comment
 * written directly above it.
 */

/** A line of dashes separates the sections of a file; it documents nothing. */
const DIVIDER = /^\/\/\s*-{4,}/;

/** True for every character that is real code. Characters inside a string, a template literal or
 *  a comment are false, so counting brackets can skip whatever they hold. */
function codeMask(source: string): boolean[] {
  const mask = new Array<boolean>(source.length).fill(true);
  let mode: 'code' | 'line' | 'block' | "'" | '"' | '`' = 'code';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (mode === 'code') {
      if (ch === '/' && next === '/') mode = 'line';
      else if (ch === '/' && next === '*') mode = 'block';
      else if (ch === "'" || ch === '"' || ch === '`') mode = ch;
      if (mode !== 'code') mask[i] = false;
      continue;
    }
    mask[i] = false;
    if (mode === 'line') {
      if (ch === '\n') {
        mask[i] = true;
        mode = 'code';
      }
    } else if (mode === 'block') {
      if (ch === '*' && next === '/') {
        mask[i + 1] = false;
        i++;
        mode = 'code';
      }
    } else if (ch === '\\' && i + 1 < source.length) {
      mask[i + 1] = false;
      i++;
    } else if (ch === mode) {
      mode = 'code';
    }
  }
  return mask;
}

/** The first match of the pattern that is code rather than something inside a comment. */
function matchInCode(source: string, mask: boolean[], pattern: RegExp): RegExpExecArray | null {
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    if (mask[match.index]) return match;
  }
  return null;
}

/** The index of the bracket that closes the one already open, starting from just inside it. */
function closingBracket(source: string, mask: boolean[], from: number, open: string, close: string): number {
  let depth = 1;
  for (let i = from; i < source.length; i++) {
    if (!mask[i]) continue;
    if (source[i] === open) depth++;
    else if (source[i] === close && --depth === 0) return i;
  }
  throw new Error(`unbalanced ${open} in the source`);
}

/** The end of a function body, given the position just inside its argument list. */
function bodyEnd(source: string, mask: boolean[], afterOpenParen: number): number {
  let i = closingBracket(source, mask, afterOpenParen, '(', ')') + 1;
  while (i < source.length && !(mask[i] && source[i] === '{')) i++;
  return closingBracket(source, mask, i + 1, '{', '}') + 1;
}

/** The end of an assignment, which is the first semicolon outside any brackets. */
function valueEnd(source: string, mask: boolean[], from: number): number {
  let depth = 0;
  for (let i = from; i < source.length; i++) {
    if (!mask[i]) continue;
    const ch = source[i];
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth--;
    else if (ch === ';' && depth === 0) return i + 1;
  }
  throw new Error('unterminated declaration in the source');
}

function lineOf(lines: string[], offset: number): number {
  let seen = 0;
  for (let i = 0; i < lines.length; i++) {
    seen += lines[i].length + 1;
    if (seen > offset) return i;
  }
  return lines.length - 1;
}

/** The line the declaration's documentation starts on: one block comment, or the run of line
 *  comments above it, whichever sits directly on top. */
function commentLine(lines: string[], declaration: number): number {
  const above = declaration - 1;
  if (above < 0) return declaration;
  if (lines[above].trim().endsWith('*/')) {
    for (let i = above; i >= 0; i--) if (lines[i].trim().startsWith('/*')) return i;
    return declaration;
  }
  let first = declaration;
  for (let i = above; i >= 0; i--) {
    const text = lines[i].trim();
    if (!text.startsWith('//') || DIVIDER.test(text)) break;
    first = i;
  }
  return first;
}

/** Drops the indentation the whole block shares, so a class method reads flush left. */
function dedent(lines: string[]): string[] {
  const indents = lines.filter((line) => line.trim() !== '').map((line) => line.length - line.trimStart().length);
  const shared = Math.min(...indents);
  return lines.map((line) => line.slice(shared));
}

function cut(source: string, start: number, end: number): string {
  const lines = source.split('\n');
  const first = commentLine(lines, lineOf(lines, start));
  return dedent(lines.slice(first, lineOf(lines, end - 1) + 1)).join('\n');
}

/**
 * The source text of one declaration, documentation comment included.
 *
 * @param source the whole file, as imported with ?raw
 * @param name the declared name: a function, a const, or a method of a class
 */
export function snippet(source: string, name: string): string {
  const mask = codeMask(source);
  const fn = matchInCode(source, mask, new RegExp(`^[ \\t]*(?:export\\s+)?function\\s+${name}\\s*\\(`, 'gm'));
  if (fn) return cut(source, fn.index, bodyEnd(source, mask, fn.index + fn[0].length));

  // A const may carry a type before its `=`, as in `export const TWINS: Twin[][] = [`.
  const value = matchInCode(source, mask, new RegExp(`^[ \\t]*(?:export\\s+)?const\\s+${name}\\s*(?::[^=\\n]+)?=`, 'gm'));
  if (value) return cut(source, value.index, valueEnd(source, mask, value.index + value[0].length));

  const method = matchInCode(source, mask, new RegExp(`^[ \\t]*${name}\\s*\\(`, 'gm'));
  if (method) return cut(source, method.index, bodyEnd(source, mask, method.index + method[0].length));

  throw new Error(`no declaration of ${name} in the source`);
}
