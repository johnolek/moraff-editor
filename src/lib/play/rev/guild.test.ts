import { describe, expect, it } from 'vitest';
import { REV_MAGIC_ITEM_LIST_PRICE, revSpellLevelPrice, revVisitGuild, type RevTownDesk } from './town';
import { setRevValue } from './record';
import { revCharacter, revTestGame } from './spells.test-support';
import type { RevGame } from './state';

const KEY = (character: string) => character.charCodeAt(0);

/**
 * The keys the guild's own prompts are answered with, in order, and every line that was on the
 * screen while it waited for one of them.
 *
 * The guild clears the screen for each of its questions, so what it said is only on the screen
 * until the next one — which is where a test has to look for it.
 */
function townDesk(game: RevGame, keys: number[]): { desk: RevTownDesk; shown: string[] } {
  const shown: string[] = [];
  return {
    desk: {
      key: async () => {
        shown.push(...game.said);
        return keys.shift() ?? KEY('L');
      },
    },
    shown,
  };
}

describe("the wizard's guild", () => {
  it("reads out both of a level's prep spells and charges for them", async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk } = revTestGame(pc);
    const town = townDesk(game, [KEY('1'), KEY('1'), KEY('P'), KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    expect(town.shown).toContain('That will cost you 220 JP.');
    expect(town.shown).toContain('PREP SPELLS');
    expect(town.shown).toContain("`Cure' heals one point of damage per       point of wizdom.");
    expect(town.shown).toContain("`Sense Level' determines which level you   are on.");
    expect(pc.money).toBe(5000 - revSpellLevelPrice(1));
  });

  it("reads out a level's battle spells instead when asked for them", async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk } = revTestGame(pc);
    const town = townDesk(game, [KEY('1'), KEY('1'), KEY('B'), KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    expect(town.shown).toContain('BATTLE SPELLS');
    expect(town.shown).toContain(
      "`Magic Zot' does about 1 to 4 points of    damage per level of the caster to all   creatures.",
    );
  });

  it('floats a character who cannot pay back out of the guild', async () => {
    const pc = revCharacter({ money: 10 });
    const { game, desk } = revTestGame(pc);
    const town = townDesk(game, [KEY('1'), KEY('3')]);
    await revVisitGuild(game, town.desk, desk);
    expect(town.shown.concat(game.said)).toContain('You do not have enough money. You find');
    expect(pc.money).toBe(10);
  });

  it('reads out what a magic item the character owns does, for a flat eight hundred', async () => {
    const pc = revCharacter({ money: 5000 });
    setRevValue(pc, 48, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('2'));
    const town = townDesk(game, [KEY('2'), KEY('P'), KEY('9'), KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    expect(town.shown).toContain('This will cost you 800 JP.');
    expect(town.shown).toContain('Scroll of Seeing: Maps an entire level     of the dungeon.');
    expect(pc.money).toBe(5000 - REV_MAGIC_ITEM_LIST_PRICE);
  });

  it('charges nothing for a look at the item list that is left without picking one', async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('L'));
    await revVisitGuild(game, townDesk(game, [KEY('2'), KEY('B'), KEY('L')]).desk, desk);
    expect(pc.money).toBe(5000);
  });
});
