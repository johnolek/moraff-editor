export type KeyAction =
  | { kind: 'walk'; dx: number; dy: number }
  | { kind: 'climb'; direction: 'up' | 'down' }
  | { kind: 'floor'; delta: number }
  | { kind: 'zoom'; direction: 1 | -1 };

/** What a key press does on the map; null for keys the map ignores. */
export function keyAction(key: string): KeyAction | null {
  switch (key) {
    case 'ArrowUp':
      return { kind: 'walk', dx: 0, dy: -1 };
    case 'ArrowDown':
      return { kind: 'walk', dx: 0, dy: 1 };
    case 'ArrowLeft':
      return { kind: 'walk', dx: -1, dy: 0 };
    case 'ArrowRight':
      return { kind: 'walk', dx: 1, dy: 0 };
    case 'u':
    case 'U':
      return { kind: 'climb', direction: 'up' };
    case 'd':
    case 'D':
      return { kind: 'climb', direction: 'down' };
    case 'PageUp':
      return { kind: 'floor', delta: -1 };
    case 'PageDown':
      return { kind: 'floor', delta: 1 };
    case '+':
    case '=':
      return { kind: 'zoom', direction: 1 };
    case '-':
    case '_':
      return { kind: 'zoom', direction: -1 };
    default:
      return null;
  }
}
