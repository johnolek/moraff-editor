import { showHint } from '../game/port/drops';
import type { Turn } from './engine';
import { KEY } from './keys';

/**
 * FUN_3000_7052 (exe 3000:7052, unf.c "FUN_3000_7052"), the fourth line of the I key's menu: the
 * six coloured potions, each of which raises one of the character's statistics and drops another.
 *
 * The three pairs are intelligence against agility, strength against luck, and constitution
 * against wisdom, and each pair has a potion either way round. Nothing here is capped: a
 * statistic can be drunk down past zero.
 */

/** UH.BIN 53, the menu the potions are picked off. */
const POTION_MENU = 53;

/** UH.BIN 90, which FUN_3000_703c (exe 3000:703c) gives for a colour the character has none of:
 *  a list of the ten monsters whose corpses leave one. */
const NONE_OF_THOSE = 90;

/** What a potion does to the two statistics it touches. */
const RAISED_BY = 6;
const DROPPED_BY = 3;

/** The statistics a potion moves, by the field the character record keeps each one in. */
type Stat = 'str' | 'iq' | 'wis' | 'con' | 'dex' | 'luck';

interface Potion {
  /** Which of the six counts at record offset 0x15d the colour is kept in. */
  slot: number;
  raise: Stat;
  drop: Stat;
  /** The UH.BIN message the drink prints. */
  hint: number;
}

/**
 * The six lines of the menu, in the order it prints them: green, orange, yellow, red, blue,
 * white. The counts are not in that order — the menu's first line drinks the second of them —
 * which is the order the pockets screen lists them in as well.
 */
const POTIONS: Potion[] = [
  { slot: 1, raise: 'iq', drop: 'dex', hint: 54 },
  { slot: 0, raise: 'str', drop: 'luck', hint: 55 },
  { slot: 5, raise: 'luck', drop: 'str', hint: 56 },
  { slot: 3, raise: 'con', drop: 'wis', hint: 57 },
  { slot: 2, raise: 'wis', drop: 'con', hint: 58 },
  { slot: 4, raise: 'dex', drop: 'iq', hint: 59 },
];

/** The digits get_choice (exe 2000:2d93) takes for the six lines. */
const POTION_KEYS = POTIONS.map((unused, index) => 0x31 + index);

/** Drink one, if the character has one of that colour. */
export async function drinkAPotion(turn: Turn): Promise<void> {
  const { game, session } = turn;
  const pc = game.pc;
  showHint(game, POTION_MENU);
  const chosen = await session.choice(POTION_KEYS);
  if (chosen === KEY.escape) return;
  const potion = POTIONS[chosen - 0x31];
  if (pc.potions[potion.slot] < 1) {
    showHint(game, NONE_OF_THOSE);
    game.pressAnyKey();
    return;
  }
  pc.potions[potion.slot] -= 1;
  pc[potion.raise] += RAISED_BY;
  pc[potion.drop] -= DROPPED_BY;
  showHint(game, potion.hint);
  game.pressAnyKey();
}
