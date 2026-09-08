import { describe, expect, it } from 'vitest';
import { newMwGame, type MwGame } from '../../game/mw-port/state';
import { digging } from './dig';
import { MW_TEXT_COLOUR } from './screens';

/** Every screen dig_hole asked to be left up, as the line standing on the strip. */
function held(game: MwGame): { line: string | null; ms: number }[] {
  const frames: { line: string | null; ms: number }[] = [];
  game.delay = (ms: number) => {
    frames.push({ line: game.screen[0]?.text ?? null, ms });
  };
  return frames;
}

describe("Moraff's World's digging line", () => {
  it('wipes the strip and draws the line again, four times over', () => {
    const game = newMwGame();
    const frames = held(game);
    digging(game, 1500);
    expect(frames).toEqual([
      { line: null, ms: 300 },
      { line: 'DIGGING... DIGGING...', ms: 1500 },
      { line: null, ms: 300 },
      { line: 'DIGGING... DIGGING...', ms: 1500 },
      { line: null, ms: 300 },
      { line: 'DIGGING... DIGGING...', ms: 1500 },
      { line: null, ms: 300 },
      { line: 'DIGGING... DIGGING...', ms: 1500 },
    ]);
  });

  it('holds the line longer on the second run of four', () => {
    const game = newMwGame();
    const frames = held(game);
    digging(game, 2000);
    expect(frames.map((frame) => frame.ms)).toEqual([300, 2000, 300, 2000, 300, 2000, 300, 2000]);
  });

  it('draws it at the top left in the colour every line drawn on the screen comes out in', () => {
    const game = newMwGame();
    digging(game, 1500);
    expect(game.screen).toEqual([
      { text: 'DIGGING... DIGGING...', x: 0, y: 0, font: 0, colour: MW_TEXT_COLOUR },
    ]);
  });
});
