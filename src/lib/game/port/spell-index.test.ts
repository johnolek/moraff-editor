import { describe, expect, it } from 'vitest';
import { allSpells } from '../../spells/spells';
import { snippet } from '../../ui/source-snippet';
import * as magic from './magic';
import magicSource from './magic.ts?raw';
import { BorlandRng } from './rng';
import type { Game } from './state';
import { MAP_PLAYER, newGame, setMonsterMap } from './state';
import { portedSpell } from './spell-index';

const SPELLS = allSpells();

/** Monster kind 23 is one of section 1's ordinary monsters, not the Shadow boss spells refuse. */
const REGULAR = 23;

/** The functions of magic.ts, reached by the name the table records for a case. */
const PORTED = magic as unknown as Record<
  string,
  ((game: Game, ...args: number[]) => boolean) | undefined
>;

/**
 * A game every spell in the book can be cast in: a wounded level 10 character on floor 5 of
 * module I, an open floor with one ordinary monster engaged, and every menu answered rather than
 * escaped. All 120 spells run to the end in it and every one of them changes something, so a
 * case whose table entry drifted shows up as two games that differ rather than as two identical
 * refusals.
 */
function castingGame(): Game {
  const game = newGame({
    pc: { hp: 1 },
    rng: new BorlandRng(7),
    chooseDirection: () => 2,
    chooseWeapon: () => 1,
    chooseArmor: () => 1,
    chooseSpell: () => ({ type: 1, level: 0, slot: 0 }),
  });
  setMonsterMap(game, game.pc.x, game.pc.y, MAP_PLAYER);
  Object.assign(game.monsters[0], { x: 10, y: 10, hp: 5000, type: REGULAR, level: 40 });
  setMonsterMap(game, 10, 10, 0);
  game.engaged = 0;
  return game;
}

/** Everything about a game two casts can be compared on: every field but the menu answers. */
function stateOf(game: Game): Record<string, unknown> {
  const answers = ['solid', 'chooseDirection', 'chooseWeapon', 'chooseArmor', 'chooseSpell', 'say'];
  return Object.fromEntries(Object.entries(game).filter(([field]) => !answers.includes(field)));
}

/**
 * What the table says a case passes after `game`. Every case passes literal integers, except the
 * two Pass Walls, which pass what the direction menu answered.
 */
function argumentsFor(game: Game, args: string | undefined): number[] {
  if (args === undefined) return [];
  if (args === 'game.chooseDirection()') return [game.chooseDirection()];
  return args.split(',').map((argument) => {
    const value = Number(argument);
    if (!Number.isInteger(value)) throw new Error(`"${args}" is not a list of whole numbers`);
    return value;
  });
}

describe('portedSpell', () => {
  it('covers the whole spell book', () => {
    expect(SPELLS.length).toBe(120);
  });

  it('names a function magic.ts declares for every spell', () => {
    for (const spell of SPELLS) {
      const ported = portedSpell(spell.type, spell.level - 1, spell.slot - 1);
      expect(() => snippet(magicSource, ported.fn), `${spell.name}: ${ported.fn}`).not.toThrow();
    }
  });

  it('names functions magic.ts declares as the helpers', () => {
    for (const spell of SPELLS) {
      const ported = portedSpell(spell.type, spell.level - 1, spell.slot - 1);
      for (const helper of ported.helpers) {
        expect(() => snippet(magicSource, helper), `${spell.name}: ${helper}`).not.toThrow();
      }
    }
  });

  it('gives the arguments the switch case passes', () => {
    expect(portedSpell(2, 9, 0)).toEqual({ fn: 'explosion', args: '2', helpers: ['msgNoMonster'] });
    expect(portedSpell(0, 4, 0)).toEqual({ fn: 'enchantWeaponPerm', args: '3', helpers: [] });
  });

  it('leaves the arguments off a case that passes only the game', () => {
    expect(portedSpell(1, 0, 2)).toEqual({ fn: 'littleCure', helpers: ['msgYouFeelGood'] });
  });

  it('refuses a spell the book does not have', () => {
    expect(() => portedSpell(4, 0, 0)).toThrow();
    expect(() => portedSpell(0, 10, 0)).toThrow();
    expect(() => portedSpell(0, 0, 3)).toThrow();
  });
});

describe('portedSpell against spell_effect', () => {
  /**
   * The table is a hand transcription of the four switches in magic.ts, so it can drift from
   * them. This casts each spell twice on two games built the same way — once through
   * spellEffect, once by calling the function the table names with the arguments it records —
   * and asserts the two games come out the same. A case that calls something else, or passes a
   * different number, leaves a different game behind.
   *
   * Two spells the table sends to the same function with the same arguments cannot be told
   * apart this way, which is the one kind of drift it misses.
   */
  it('runs what every case of the four switches runs', () => {
    for (const spell of SPELLS) {
      const levelIndex = spell.level - 1;
      const slot = spell.slot - 1;
      const ported = portedSpell(spell.type, levelIndex, slot);
      const run = PORTED[ported.fn];
      if (!run) throw new Error(`${spell.name}: magic.ts exports no ${ported.fn}`);

      const throughTheSwitch = castingGame();
      const fromTheTable = castingGame();
      const cast = magic.spellEffect(throughTheSwitch, spell.type, levelIndex, slot);
      const indexed = run(fromTheTable, ...argumentsFor(fromTheTable, ported.args));

      const where = `${spell.name}: ${ported.fn}(game${ported.args ? `, ${ported.args}` : ''})`;
      expect(indexed, where).toBe(cast);
      expect(stateOf(fromTheTable), where).toEqual(stateOf(throughTheSwitch));
    }
  });

  it('casts every spell in that game rather than being refused by it', () => {
    for (const spell of SPELLS) {
      const game = castingGame();
      const cast = magic.spellEffect(game, spell.type, spell.level - 1, spell.slot - 1);
      expect(cast, `${spell.name} was refused, so the check above proves nothing`).toBe(true);
    }
  });
});
