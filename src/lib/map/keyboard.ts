export type KeyAction =
  | { kind: 'move'; dx: number; dy: number }
  | { kind: 'floor'; delta: number }
  | { kind: 'follow' }
  | { kind: 'zoom'; direction: 1 | -1 };

/** What a key press does on the map; null for keys the map ignores. */
export function keyAction(key: string): KeyAction | null {
  switch (key) {
    case 'ArrowUp':
      return { kind: 'move', dx: 0, dy: -1 };
    case 'ArrowDown':
      return { kind: 'move', dx: 0, dy: 1 };
    case 'ArrowLeft':
      return { kind: 'move', dx: -1, dy: 0 };
    case 'ArrowRight':
      return { kind: 'move', dx: 1, dy: 0 };
    case 'PageUp':
      return { kind: 'floor', delta: -1 };
    case 'PageDown':
      return { kind: 'floor', delta: 1 };
    case 'Enter':
      return { kind: 'follow' };
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
