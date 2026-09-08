import { describe, expect, it } from 'vitest';
import { REV_MAGIC_ITEM_LIST_PRICE, revSpellLevelPrice, revVisitGuild, type RevTownDesk } from './town';
import { setRevValue } from './record';
import { revCharacter, revTestGame } from './spells.test-support';

const KEY = (character: string) => character.charCodeAt(0);

/** The keys the guild's own prompts are answered with, in order. */
function townDesk(keys: number[], numbers: (number | null)[]): RevTownDesk {
  return {
    key: async () => keys.shift() ?? KEY('L'),
    number: async () => numbers.shift() ?? null,
  };
}

describe("the wizard's guild", () => {
  it("reads out both of a level's prep spells and charges for them", async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk } = revTestGame(pc);
    await revVisitGuild(game, townDesk([KEY('1'), KEY('P'), KEY('L')], [1]), desk);
    expect(game.said).toContain('That will cost you 220 JP.');
    expect(game.said).toContain('PREP SPELLS');
    expect(game.said).toContain("`Cure' heals one point of damage per       point of wizdom.");
    expect(game.said).toContain("`Sense Level' determines which level you   are on.");
    expect(pc.money).toBe(5000 - revSpellLevelPrice(1));
  });

  it("reads out a level's battle spells instead when asked for them", async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk } = revTestGame(pc);
    await revVisitGuild(game, townDesk([KEY('1'), KEY('B'), KEY('L')], [1]), desk);
    expect(game.said).toContain('BATTLE SPELLS');
    expect(game.said).toContain(
      "`Magic Zot' does about 1 to 4 points of    damage per level of the caster to all   creatures.",
    );
  });

  it('floats a character who cannot pay back out of the guild', async () => {
    const pc = revCharacter({ money: 10 });
    const { game, desk } = revTestGame(pc);
    await revVisitGuild(game, townDesk([KEY('1')], [3]), desk);
    expect(game.said).toContain('You do not have enough money. You find');
    expect(pc.money).toBe(10);
  });

  it('reads out what a magic item the character owns does, for a flat eight hundred', async () => {
    const pc = revCharacter({ money: 5000 });
    setRevValue(pc, 48, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('2'));
    await revVisitGuild(game, townDesk([KEY('2'), KEY('P'), KEY('L')], []), desk);
    expect(game.said).toContain('This will cost you 800 JP.');
    expect(game.said).toContain('Scroll of Seeing: Maps an entire level     of the dungeon.');
    expect(pc.money).toBe(5000 - REV_MAGIC_ITEM_LIST_PRICE);
  });

  it('charges nothing for a look at the item list that is left without picking one', async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('L'));
    await revVisitGuild(game, townDesk([KEY('2'), KEY('B'), KEY('L')], []), desk);
    expect(pc.money).toBe(5000);
  });
});
