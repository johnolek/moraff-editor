import { describe, expect, it } from 'vitest';
import { MORAFFS_WORLD_MAP } from '../../map/game';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_KEY } from './keys';

/** A square of the town with a ladder that goes down. */
const ladderDown = () => findMwSquare(0, (square) => square.ladder > 0);

/** Every monster on the floor, as the map draws them, sorted so two rolls can be compared. */
const drawn = (monsters: { slot: number; x: number; y: number; hp: number }[]) =>
  monsters.map((monster) => `${monster.slot}:${monster.x},${monster.y},${monster.hp}`).sort();

describe('the ladders', () => {
  it('takes the character down and stocks the floor they arrive on', async () => {
    const start = ladderDown();
    const session = playingMw(mwCharacterFile({ floor: 0, ...start }));
    expect(session.view().monsters).toEqual([]);
    await pressMw(session, MW_KEY.down);
    const place = session.view().place;
    expect(place.floor).toBeGreaterThan(0);
    expect(place).toMatchObject({ x: start.x, y: start.y });
    expect(session.view().monsters.length).toBeGreaterThan(0);
    expect(session.rows).toEqual(MORAFFS_WORLD_MAP.floor(place.floor, 0));
  });

  it('says nothing at all for a D on a square with no ladder', async () => {
    const start = findMwSquare(0, (square) => square.ladder === 0 && square.surface === 0);
    const session = playingMw(mwCharacterFile({ floor: 0, ...start }));
    await pressMw(session, MW_KEY.down);
    // Floor 0 has no ladder here, so D digs a hole instead and asks whether to.
    expect(session.box).toContain('1) DIG A HOLE IN THE FLOOR');
  });
});

describe('the three floors the game remembers', () => {
  it('finds the monsters where they were left on going back to a floor', async () => {
    const start = ladderDown();
    const session = playingMw(mwCharacterFile({ floor: 0, ...start }));
    await pressMw(session, MW_KEY.down);
    const below = session.view().place.floor;
    const first = drawn(session.view().monsters);
    await pressMw(session, MW_KEY.up);
    expect(session.view().place.floor).toBe(0);
    expect(session.floors.remembered).toEqual([0, below, null]);
    await pressMw(session, MW_KEY.down);
    expect(drawn(session.view().monsters)).toEqual(first);
    expect(session.floors.remembered).toEqual([below, 0, null]);
  });
});
