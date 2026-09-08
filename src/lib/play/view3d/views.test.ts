import { describe, expect, it } from 'vitest';
import { AHEAD_VIEW, BEHIND_VIEW, LEFT_VIEW, RIGHT_VIEW } from './geometry';
import { FOUR_VIEWS, LABEL_EXP_LIMIT, viewFacing, viewLabels } from './views';

describe('the four views', () => {
  it('draws the way ahead large and the other three small', () => {
    expect(FOUR_VIEWS.map((view) => view.name)).toEqual(['ahead', 'left', 'behind', 'right']);
    expect(FOUR_VIEWS.map((view) => view.rect)).toEqual([AHEAD_VIEW, LEFT_VIEW, BEHIND_VIEW, RIGHT_VIEW]);
  });

  it('gives the big view more than half the screen and the small ones a corner each', () => {
    const area = (rect: typeof AHEAD_VIEW) => (rect.right - rect.left) * (rect.bottom - rect.top);
    for (const view of FOUR_VIEWS.slice(1)) expect(area(view.rect) * 4).toBeLessThan(area(AHEAD_VIEW));
  });

  it('turns the other three views by the way the character faces', () => {
    // Facing north: west on the left, east on the right, south behind.
    expect(viewFacing('ahead', 0)).toBe(0);
    expect(viewFacing('left', 0)).toBe(2);
    expect(viewFacing('right', 0)).toBe(3);
    expect(viewFacing('behind', 0)).toBe(1);
    // Facing east: north on the left, south on the right, west behind.
    expect(viewFacing('left', 3)).toBe(0);
    expect(viewFacing('right', 3)).toBe(1);
    expect(viewFacing('behind', 3)).toBe(2);
  });

  it('never has a view look the same way as another', () => {
    for (let facing = 0; facing < 4; facing++) {
      const ways = FOUR_VIEWS.map((view) => viewFacing(view.name, facing));
      expect(new Set(ways).size).toBe(4);
    }
  });
});

describe('the labels over the views', () => {
  it('names the four arrow keys in yellow', () => {
    const labels = viewLabels(0, 21);
    expect(labels.map((line) => line.text)).toEqual(['UP ARROW', 'LEFT ARROW', 'DOWN ARROW', 'RIGHT ARROW']);
    expect(labels.every((line) => line.colour === 4)).toBe(true);
  });

  it('says what the arrows do instead when the other set is asked for', () => {
    expect(viewLabels(0, 21, 1).map((line) => line.text)).toEqual([
      'MOVE FORWARD',
      'TURN LEFT',
      'TURN AROUND',
      'TURN RIGHT',
    ]);
  });

  it('puts a tall character’s labels above the big view and below the small ones', () => {
    const [ahead, left, behind, right] = viewLabels(0, 21);
    expect(ahead.y).toBeLessThan(AHEAD_VIEW.top + 20);
    expect(left.y).toBeGreaterThan(LEFT_VIEW.top);
    expect(behind.y).toBeGreaterThan(BEHIND_VIEW.top);
    expect(right.y).toBeGreaterThan(RIGHT_VIEW.top);
  });

  it('puts a short character’s labels the other way up', () => {
    const [ahead, left] = viewLabels(0, 14);
    expect(ahead.y).toBeGreaterThan(AHEAD_VIEW.top + 20);
    expect(left.y).toBeLessThan(560);
  });

  it('stops drawing them once the character has earned anything', () => {
    expect(viewLabels(LABEL_EXP_LIMIT - 1, 21)).toHaveLength(4);
    expect(viewLabels(LABEL_EXP_LIMIT, 21)).toEqual([]);
  });
});
