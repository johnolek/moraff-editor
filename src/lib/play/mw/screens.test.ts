import { describe, expect, it } from 'vitest';
import {
  mwCorner,
  mwInMessageBox,
  mwMessageBoxLines,
  MW_MESSAGE_BOX,
  MW_TEXT_COLOUR,
} from './screens';

/** The little mouse's fifth row: y 0xf0, which is where FUN_3000_9383 prints its first line. */
const ADVICE_Y = MW_MESSAGE_BOX.y + 4 * MW_MESSAGE_BOX.step;

describe('mwCorner', () => {
  it('draws the message box where the game draws it when the strip is empty', () => {
    const box = mwMessageBoxLines(['HIT ANY KEY...']);
    const corner = mwCorner([], [], box);
    expect(corner.lines).toEqual(box);
  });

  it('puts the fight lines above the box, 0x28 apart and in colour 15', () => {
    const corner = mwCorner([], ['YOU ARE FIGHTING THE MONSTER', 'IN THE NORTH VIEW.'], []);
    expect(corner.lines).toEqual([
      { text: 'YOU ARE FIGHTING THE MONSTER', x: 0, y: 0, font: 0, colour: MW_TEXT_COLOUR },
      { text: 'IN THE NORTH VIEW.', x: 0, y: 0x28, font: 0, colour: MW_TEXT_COLOUR },
    ]);
  });

  it('moves the box down by as much of the strip as is in use', () => {
    const killed = { text: 'YOU KILLED IT!', x: 0, y: 0, font: 0, colour: 8 };
    const corner = mwCorner([killed], ['SOUTH DOES 9 POINTS'], mwMessageBoxLines(['NOTHING!']));
    expect(corner.lines.map((line) => line.y)).toEqual([0, 0x28, 0x50 + MW_MESSAGE_BOX.y]);
    expect(corner.lines[2].colour).toBe(MW_MESSAGE_BOX.colour);
  });

  it('leaves a line drawn on the box own rows where the game drew it', () => {
    const advice = { text: 'YOU ARE BADLY DAMAGED. YOU', x: 0, y: ADVICE_Y, font: 0, colour: 3 };
    const corner = mwCorner([advice], [], []);
    expect(corner.lines).toEqual([advice]);
    expect(corner.height).toBeGreaterThanOrEqual(ADVICE_Y + MW_MESSAGE_BOX.step);
  });

  it('is as tall as the strip and the box together', () => {
    const box = mwMessageBoxLines(['ONE', 'TWO']);
    expect(mwCorner([], [], box).height).toBe(MW_MESSAGE_BOX.y + 2 * MW_MESSAGE_BOX.step);
    expect(mwCorner([], ['A', 'B'], box).height).toBe(
      0x50 + MW_MESSAGE_BOX.y + 2 * MW_MESSAGE_BOX.step,
    );
  });
});

describe('mwInMessageBox', () => {
  it('takes the strip, the box and the advice under it', () => {
    expect(mwInMessageBox({ text: 'YOU KILLED IT!', x: 0, y: 0, font: 0, colour: 8 })).toBe(true);
    expect(mwInMessageBox({ text: 'HIT ANY KEY...', x: 0, y: 0x186, font: 0, colour: 5 })).toBe(true);
  });

  it('leaves a line the game drew anywhere else to take the display over', () => {
    expect(mwInMessageBox({ text: 'HELP', x: 0x2d0, y: 0, font: 0, colour: 8 })).toBe(false);
    expect(mwInMessageBox({ text: 'HELP', x: 0, y: 0x1ae, font: 0, colour: 8 })).toBe(false);
  });
});
