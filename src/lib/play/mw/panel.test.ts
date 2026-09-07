import { describe, expect, it } from 'vitest';
import { newMwGame } from '../../game/mw-port/state';
import { mwSpellBookSlot } from '../../game/mw-port/spells';
import { MONSTER_SLOTS } from '../../game/mw-port/stocking';
import { mwSetOccupant } from '../../game/mw-port/state';
import { MORAFFS_WORLD_MAP } from '../../map/game';
import { mwAilments, mwCharges, mwEngagedMonster, mwSpellsInForce, mwSquareFacts } from './panel';

describe('the spells in force', () => {
  it('names only the ones that are up, and says which are cleared by a night at the inn', () => {
    const game = newMwGame({
      pc: { feather: 100, protectionLevel: 2, protectionTimer: 45, sleepTimer: 3, poisonTimer: 9 },
    });
    expect(mwSpellsInForce(game)).toEqual([
      { label: 'FEATHER', value: 'until you sleep' },
      { label: 'PROTECT, LEVEL', value: '45 moves' },
      { label: 'STOP MONSTER', value: '3 monster turns' },
    ]);
  });

  it('keeps the poison and disease clocks to their own section', () => {
    const game = newMwGame({ pc: { poisonTimer: 9, diseaseTimer: 1 } });
    expect(mwSpellsInForce(game)).toEqual([]);
    expect(mwAilments(game.pc)).toEqual([
      { label: 'Poison bites in', value: '8 moves', note: 'A point of strength, and then it starts again.' },
      { label: 'Disease bites in', value: '0 moves', note: 'A point of constitution, and then it starts again.' },
    ]);
  });
});

describe('the charges', () => {
  it('counts only the scrolls, wands and paper the character carries', () => {
    const wands = Array.from({ length: 180 }, () => 0);
    wands[mwSpellBookSlot(2, 1, 0)] = 5;
    const game = newMwGame({ pc: { wands } });
    expect(mwCharges(game).map((group) => [group.title, group.lines])).toEqual([
      ['Scrolls', []],
      ['Wands', [{ label: 'SLEEP', value: '5' }]],
      ['Magic paper', []],
    ]);
  });
});

describe('the monster being fought', () => {
  it('is nothing at all with nothing engaged', () => {
    expect(mwEngagedMonster(newMwGame())).toBeNull();
  });

  it('gives its depth, its hit points and the chance a swing lands', () => {
    const monsters = Array.from({ length: MONSTER_SLOTS }, () => ({ x: 0, y: 0, hp: 0, type: 0, depth: 0 }));
    monsters[0] = { x: 4, y: 5, hp: 12, type: 1, depth: 3 };
    const game = newMwGame({ monsters, engaged: 0, pc: { lev: 4, str: 20, luck: 20, weapon: 6 } });
    mwSetOccupant(game, 4, 5, 0);
    const engaged = mwEngagedMonster(game);
    expect(engaged).toMatchObject({ name: 'WEREWOLF', depth: 3, hp: 12 });
    expect(engaged!.hitChance).toBeGreaterThan(0);
    expect(engaged!.hitChance).toBeLessThanOrEqual(1);
    expect(engaged!.mostHp).toBeGreaterThanOrEqual(12);
  });
});

describe('the square underfoot', () => {
  it('says which floor a trap door leads to and whether the key is in hand', () => {
    const rows = MORAFFS_WORLD_MAP.floor(12, 0);
    let found: { x: number; y: number } | null = null;
    for (let y = 1; y < 109 && !found; y++) {
      for (let x = 1; x < 79; x++) {
        if (rows[y][x].trapdoor !== -1) {
          found = { x, y };
          break;
        }
      }
    }
    expect(found).not.toBeNull();
    const square = rows[found!.y][found!.x];
    const game = newMwGame({ pc: { floor: 12 } });
    expect(mwSquareFacts(game, square)).toEqual([
      {
        label: 'Trap door to floor',
        value: String(square.trapdoor),
        note: 'A level drainer near that floor carries the key.',
      },
    ]);
  });
});
