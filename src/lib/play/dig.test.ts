import { describe, expect, it } from 'vitest';
import { BATTLE_TEXT_COLOUR, MENU_X, MESSAGE_LINE_Y } from '../game/port/screens';
import { newGame, type Game } from '../game/port/state';
import { digging } from './dig';

/** Every screen dig_hole asked to be left up, as the line standing on the message strip. */
function held(game: Game): { line: string | null; ms: number }[] {
  const frames: { line: string | null; ms: number }[] = [];
  game.delay = (ms: number) => {
    const drawn = game.screen.find((line) => line.y === MESSAGE_LINE_Y);
    frames.push({ line: drawn?.text ?? null, ms });
  };
  return frames;
}

const BLANK = { line: null, ms: 300 };
const DIGGING = (ms: number) => ({ line: 'DIGGING... DIGGING...', ms });

describe("the digging line's flashing", () => {
  it('wipes the line off and draws it again, four times over', () => {
    const game = newGame();
    const frames = held(game);
    digging(game, 1500);
    expect(frames).toEqual([
      BLANK, DIGGING(1500),
      BLANK, DIGGING(1500),
      BLANK, DIGGING(1500),
      BLANK, DIGGING(1500),
    ]);
  });

  it('holds the line longer on the second run of four', () => {
    const game = newGame();
    const frames = held(game);
    digging(game, 2000);
    expect(frames.map((frame) => frame.ms)).toEqual([300, 2000, 300, 2000, 300, 2000, 300, 2000]);
  });

  it('draws it where pfont puts it, in the colour every line of a fight is drawn in', () => {
    const game = newGame();
    digging(game, 1500);
    expect(game.screen).toEqual([
      { text: 'DIGGING... DIGGING...', x: MENU_X, y: MESSAGE_LINE_Y, font: 0, colour: BATTLE_TEXT_COLOUR },
    ]);
  });

  it('asks for no delay at all with the high speed option on', () => {
    const game = newGame();
    game.highSpeed = true;
    const frames = held(game);
    digging(game, 1500);
    expect(frames).toEqual([]);
    expect(game.screen.map((line) => line.text)).toEqual(['DIGGING... DIGGING...']);
  });
});
