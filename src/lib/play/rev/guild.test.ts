import { describe, expect, it } from 'vitest';
import { REV_MAGIC_ITEM_LIST_PRICE, revSpellLevelPrice, revVisitGuild, type RevTownDesk } from './town';
import { setRevValue } from './record';
import { revCharacter, revTestGame } from './spells.test-support';
import type { RevGame } from './state';

const KEY = (character: string) => character.charCodeAt(0);

/** 1000:2BC4: the first line of the guild, and how many rows the opening takes with the two
 *  blank ones in it. */
const GUILD_OPENS = "You are in the wizard's guild.";
const GUILD_OPENING_LINES = 8;

/**
 * The keys the guild's own prompts are answered with, in order, and every line that was on the
 * screen while it waited for one of them.
 *
 * The guild clears the screen for each of its questions, so what it said is only on the screen
 * until the next one — which is where a test has to look for it.
 */
function townDesk(game: RevGame, keys: number[]): { desk: RevTownDesk; shown: string[]; waits: number[] } {
  const shown: string[] = [];
  const waits: number[] = [];
  return {
    desk: {
      key: async () => {
        shown.push(...game.said);
        waits.push(game.said.length);
        return keys.shift() ?? KEY('L');
      },
    },
    shown,
    waits,
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

  it('blacks the screen out and prints its opening from the first row', async () => {
    const { game, desk } = revTestGame(revCharacter({ money: 5000 }));
    const town = townDesk(game, [KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    expect(game.cleared).toBe('bare');
    expect(game.kept.runs()).toEqual([
      { row: 1, column: 1, text: GUILD_OPENS },
      { row: 3, column: 1, text: 'You may find out what the various spells' },
      { row: 4, column: 1, text: '   and magic items do.' },
      { row: 6, column: 1, text: '1-SPELLS' },
      { row: 7, column: 1, text: '2-MAGIC ITEMS' },
      { row: 8, column: 1, text: "L-LEAVE WIZARD'S GUILD" },
    ]);
  });

  it('leaves the guild at an L wherever it is pressed, not just at the opening', async () => {
    for (const keys of [
      [KEY('1'), KEY('L')],
      [KEY('1'), KEY('2'), KEY('L')],
      [KEY('2'), KEY('L')],
    ]) {
      const pc = revCharacter({ money: 5000 });
      const { game, desk } = revTestGame(pc);
      const presses = keys.length;
      const town = townDesk(game, keys);
      await revVisitGuild(game, town.desk, desk);
      // No key was asked for after the L, so it left the building rather than going back a step.
      expect(town.waits).toHaveLength(presses);
      expect(pc.money).toBe(5000);
    }
  });

  it('prints the spell level where the prompt left the cursor', async () => {
    const { game, desk } = revTestGame(revCharacter({ money: 5000 }));
    const town = townDesk(game, [KEY('1'), KEY('2'), KEY('P'), KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    expect(town.shown).toContain('Type the spell level (1-6): ');
    expect(town.shown).toContain(' 2 ');
  });

  it('waits for another key at the opening rather than printing itself again', async () => {
    const { game, desk } = revTestGame(revCharacter({ money: 5000 }));
    const town = townDesk(game, [KEY('9'), KEY('L')]);
    await revVisitGuild(game, town.desk, desk);
    // The second key was pressed at the screen the first was: the guild printed nothing again.
    expect(town.waits).toEqual([GUILD_OPENING_LINES, GUILD_OPENING_LINES]);
    expect(town.shown.slice(0, GUILD_OPENING_LINES)).toEqual(town.shown.slice(GUILD_OPENING_LINES));
  });

  it('charges nothing for a look at the item list that is left without picking one', async () => {
    const pc = revCharacter({ money: 5000 });
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('L'));
    await revVisitGuild(game, townDesk(game, [KEY('2'), KEY('B'), KEY('L')]).desk, desk);
    expect(pc.money).toBe(5000);
  });
});
