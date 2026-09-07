import { describe, expect, it } from 'vitest';
import { newGame } from './state';

describe('the screen', () => {
  it('keeps what has been drawn in the order it was drawn', () => {
    const game = newGame();
    game.draw({ text: 'ONE', x: 0, y: 0, font: 1, colour: 4 });
    game.draw({ text: 'TWO', x: 0, y: 100, font: 1, colour: 5 });
    expect(game.screen.map((line) => line.text)).toEqual(['ONE', 'TWO']);
  });

  it('puts every drawn line on the end of the message log as well', () => {
    const game = newGame();
    game.draw({ text: 'ONE', x: 0, y: 0, font: 1, colour: 4 });
    game.say('AND A SAID LINE');
    expect(game.messages).toEqual(['ONE', 'AND A SAID LINE']);
  });

  it('logs a line and the value beside it as one line', () => {
    const game = newGame();
    game.draw({ text: 'RACE: ', value: 'GIANT', x: 0, valueX: 0x14a, y: 0, font: 2, colour: 5 });
    expect(game.messages).toEqual(['RACE: GIANT']);
  });

  it('replaces a line drawn over one already at the same place', () => {
    const game = newGame();
    game.draw({ text: '24', x: 1000, y: 0x348, font: 1, colour: 6 });
    game.draw({ text: '23', x: 1000, y: 0x348, font: 1, colour: 6 });
    expect(game.screen.map((line) => line.text)).toEqual(['23']);
    // The log keeps both: the screen is what is showing, the log is what has been printed.
    expect(game.messages).toEqual(['24', '23']);
  });

  it('takes a line off the screen when it is drawn in the background colour', () => {
    const game = newGame();
    game.draw({ text: '24', x: 1000, y: 0x348, font: 1, colour: 6 });
    game.draw({ text: '24', x: 1000, y: 0x348, font: 1, colour: 0 });
    expect(game.screen).toEqual([]);
    expect(game.messages).toEqual(['24']);
  });

  it('clears the whole screen and the bottom of it', () => {
    const game = newGame();
    game.draw({ text: 'TOP', x: 0, y: 100, font: 1, colour: 4 });
    game.draw({ text: 'BOTTOM', x: 0, y: 700, font: 1, colour: 4 });
    game.eraseScreen(0x2b2);
    expect(game.screen.map((line) => line.text)).toEqual(['TOP']);
    game.eraseScreen();
    expect(game.screen).toEqual([]);
    expect(game.messages).toEqual(['TOP', 'BOTTOM']);
  });

  it('waits for no key of its own accord', () => {
    const game = newGame();
    expect(() => game.pressAnyKey()).not.toThrow();
  });
});
