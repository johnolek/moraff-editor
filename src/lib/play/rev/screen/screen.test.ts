import { describe, expect, it } from 'vitest';
import { BLACK } from './colours';
import { MIDDLE_BOX } from './monsters';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './paint';
import { drawRevScreen } from './screen';
import { BACK_BOX, FRONT_BOX, LEFT_BOX, NORTH, RIGHT_BOX } from './views';

const place = { column: 10, row: 10, level: 3, generation: 1, facing: NORTH };

/** Whether anything at all was drawn inside a rectangle of the screen. */
function anythingIn(screen: { pixels: Uint8Array }, box: { left: number; top: number; right: number; bottom: number }): boolean {
  for (let y = box.top; y <= box.bottom; y++) {
    for (let x = box.left; x <= box.right; x++) {
      if (screen.pixels[y * SCREEN_WIDTH + x] !== BLACK) return true;
    }
  }
  return false;
}

describe('the whole screen', () => {
  it('is the size SCREEN 1 is', () => {
    const screen = drawRevScreen({ place });
    expect(screen.width).toBe(SCREEN_WIDTH);
    expect(screen.height).toBe(SCREEN_HEIGHT);
  });

  it('draws all five boxes of the cross', () => {
    const screen = drawRevScreen({ place });
    for (const box of [FRONT_BOX, RIGHT_BOX, BACK_BOX, LEFT_BOX]) expect(anythingIn(screen, box)).toBe(true);
  });

  it('leaves the map alone until it is told what has been walked on', () => {
    const map = { left: 0, top: 45, right: 160, bottom: 197 };
    expect(anythingIn(drawRevScreen({ place }), map)).toBe(false);
    expect(anythingIn(drawRevScreen({ place, known: () => true }), map)).toBe(true);
  });

  it('keeps the box between the views empty while nobody stands there', () => {
    const screen = drawRevScreen({ place });
    // H=HELP is printed on the row the box's last row sits on, so ask about the rows above it.
    expect(anythingIn(screen, { ...MIDDLE_BOX, bottom: MIDDLE_BOX.bottom - 1 })).toBe(false);
  });

  it('offers H=HELP under the views until the character has levelled up', () => {
    // Only the text's top row is clear of the BACK panel, which starts on the row under it.
    const help = { left: 216, top: 136, right: 263, bottom: 136 };
    expect(anythingIn(drawRevScreen({ place, words: { characterLevel: 1 } }), help)).toBe(true);
    expect(anythingIn(drawRevScreen({ place, words: { characterLevel: 2 } }), help)).toBe(false);
  });
});
