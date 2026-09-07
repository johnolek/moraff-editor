import { describe, expect, it } from 'vitest';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_KEY } from './keys';

/** A square of the town with nothing on it, so the key pressed is the only thing happening. */
const townSquare = () => findMwSquare(0, (square) => square.ladder === 0);

/** The first line of the box each of the seven keys puts up. */
const BOXES: [number, string][] = [
  [MW_KEY.brickSpeed, 'THE GAME WOULD STEP THROUGH THE'],
  [MW_KEY.sound, 'THE GAME WOULD TURN THE SOUND'],
  [MW_KEY.expandMap, 'THE GAME WOULD FILL THE SCREEN'],
  [MW_KEY.zoomView, 'THE GAME WOULD FILL THE SCREEN'],
  [MW_KEY.paletteGreen, 'THE GAME WOULD ADD SIXTEEN TO'],
  [MW_KEY.paletteBlue, 'THE GAME WOULD ADD SIXTEEN TO'],
  [MW_KEY.paletteRed, 'THE GAME WOULD ADD SIXTEEN TO'],
];

describe('the keys that are about the screen', () => {
  it('each say what the game would have done, in four lines or fewer', async () => {
    for (const [key, first] of BOXES) {
      const session = playingMw(mwCharacterFile({ floor: 0, ...townSquare() }));
      await pressMw(session, key);
      expect(session.box[0]).toBe(first);
      expect(session.box.length).toBeLessThanOrEqual(4);
    }
  });

  it('names the colour each of the three palette keys moves', async () => {
    const colours: [number, string][] = [
      [MW_KEY.paletteGreen, 'THE GREEN IN ITS BACKGROUND'],
      [MW_KEY.paletteBlue, 'THE BLUE IN ITS BACKGROUND'],
      [MW_KEY.paletteRed, 'THE RED IN ITS BACKGROUND'],
    ];
    for (const [key, line] of colours) {
      const session = playingMw(mwCharacterFile({ floor: 0, ...townSquare() }));
      await pressMw(session, key);
      expect(session.box).toContain(line);
    }
  });

  it('tells the map key and the 3-D view key apart', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, ...townSquare() }));
    await pressMw(session, MW_KEY.expandMap);
    expect(session.box).toContain('WITH THE FLOOR, A THIRD OF IT');
    await pressMw(session, MW_KEY.zoomView);
    expect(session.box).toContain('WITH THE VIEW ONE WAY AND NAME');
  });
});
