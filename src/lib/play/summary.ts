import type { JournalEvent, MonsterSeen, SpellAt } from '../game/journal-events';
import type { JournalEntry } from './journal';
import { spellMenuName } from './journal';

/**
 * What a run came to: everything that happened in it, totalled.
 *
 * It is folded from the run's journal and nothing else, so a run replayed from its log
 * summarises the same as the run itself — which is what lets the leaderboard and the
 * command-line verifier say what a run was without being handed anything but its keys.
 *
 * The words are {@link summaryLines}, in one place, so the Play tab, the verifier and the run
 * server all say the same thing about the same run.
 */

/** How a run's fighting went against one kind of monster. */
export interface MonsterAccount {
  /** The name every battle message calls it. */
  name: string;
  /** How many of them the character came face to face with. */
  fights: number;
  /** Swings taken at them, and how many of those landed. */
  swings: number;
  hits: number;
  /** Hit points taken off them, and off the character by them. */
  damageDealt: number;
  damageTaken: number;
  /** Blows they landed on the character. */
  blows: number;
  kills: number;
}

/** Wands and scrolls the run's spells wrote, by the spell each was written for. */
export interface MadeCount {
  what: 'wand' | 'scroll';
  spell: string;
  count: number;
}

/** What the run spent: a wand's charges and a scroll or a sheet of paper by the spell it cast,
 *  and one of the magic items or potions by its own name. */
export interface UsedCount {
  what: 'charge' | 'scroll' | 'paper' | 'item';
  name: string;
  count: number;
}

/** Money handed over in one of the town's buildings, by building. */
export interface SpentCount {
  where: string;
  amount: number;
}

/** Everything a run came to. */
export interface RunSummary {
  actions: number;
  /** The game's own clock, in whatever that game counts. */
  time: number;
  steps: number;
  /** Experience the kills were worth, and experience a life drainer took back. */
  experience: number;
  experienceLost: number;
  levelsGained: number;
  levelsLost: number;
  /** The deepest floor the run stood on, and the furthest module or dungeon it reached. */
  deepestFloor: number;
  furthestDungeon: number;
  /** The money found in the dungeon, which in Dungeons of the Unforgiven is dollars rather than
   *  the rubles the town is paid in. */
  moneyFound: number;
  spent: SpentCount[];
  made: MadeCount[];
  used: UsedCount[];
  monsters: MonsterAccount[];
  deaths: number;
}

/** How far a run had got, which is the pair of numbers a journal does not carry. */
export interface RunClockTotals {
  actions: number;
  time: number;
}

/**
 * Everything that happened in a run, totalled.
 *
 * `run` is the run's own count of actions and its clock, which the sessions carry: an entry says
 * how far the count stood when it was written rather than what the run came to.
 */
export function summarizeJournal(
  entries: readonly JournalEntry[],
  run: RunClockTotals,
): RunSummary {
  const summary: RunSummary = {
    actions: run.actions,
    time: run.time,
    steps: 0,
    experience: 0,
    experienceLost: 0,
    levelsGained: 0,
    levelsLost: 0,
    deepestFloor: 0,
    furthestDungeon: 0,
    moneyFound: 0,
    spent: [],
    made: [],
    used: [],
    monsters: [],
    deaths: 0,
  };
  // Which monster the character was last seen facing. Walking away from one and back to it is
  // the fight they were already in; turning to another and back is a fight of its own.
  const fight = { facing: -1 };
  for (const entry of entries) {
    summary.deepestFloor = Math.max(summary.deepestFloor, entry.floor);
    summary.furthestDungeon = Math.max(summary.furthestDungeon, entry.module);
    if (entry.event !== null) fold(summary, entry.event, fight);
  }
  return summary;
}

/** One event added to the totals. `fight` carries the monster the character was last facing. */
function fold(summary: RunSummary, event: JournalEvent, fight: { facing: number }): void {
  switch (event.kind) {
    case 'stepped':
      summary.steps += 1;
      return;
    case 'met': {
      const fresh = fight.facing !== event.slot;
      fight.facing = event.slot;
      if (fresh) account(summary, event.monster).fights += 1;
      return;
    }
    case 'swung': {
      const monster = account(summary, event.monster);
      monster.swings += 1;
      if (event.damage > 0) monster.hits += 1;
      monster.damageDealt += event.damage;
      return;
    }
    case 'hit': {
      const monster = account(summary, event.monster);
      if (event.damage > 0) monster.blows += 1;
      monster.damageTaken += event.damage;
      return;
    }
    case 'killed':
      account(summary, event.monster).kills += 1;
      summary.experience += event.experience;
      return;
    case 'experienceDrained':
      summary.experienceLost += event.experience;
      return;
    case 'levelGained':
      summary.levelsGained += event.level - event.from;
      return;
    case 'levelLost':
      summary.levelsLost += event.levels;
      return;
    case 'found':
      if (event.find.what === 'money') summary.moneyFound += event.find.amount;
      return;
    case 'coinsSpent': {
      const spent = summary.spent.find((row) => row.where === event.where);
      if (spent) spent.amount += event.amount;
      else summary.spent.push({ where: event.where, amount: event.amount });
      return;
    }
    case 'wandMade':
      made(summary, 'wand', event.spell).count += 1;
      return;
    case 'scrollWritten':
      made(summary, 'scroll', event.spell).count += 1;
      return;
    case 'cast': {
      // A spell cast out of the character's own head spends no item, so there is nothing to
      // count; the other three spend a charge, the scroll or the sheet.
      if (event.spell.game === 'revenge' || event.spell.source === 'spellPoints') return;
      const spent = event.spell.source === 'wand' ? 'charge' : event.spell.source;
      used(summary, spent, event.spell.name).count += 1;
      return;
    }
    case 'itemUsed':
      used(summary, 'item', event.item).count += 1;
      return;
    case 'died':
      summary.deaths += 1;
  }
}

/** The row for a kind of monster, made on the first sight of one. */
function account(summary: RunSummary, monster: MonsterSeen): MonsterAccount {
  const kept = summary.monsters.find((row) => row.name === monster.name);
  if (kept) return kept;
  const fresh: MonsterAccount = {
    name: monster.name,
    fights: 0,
    swings: 0,
    hits: 0,
    damageDealt: 0,
    damageTaken: 0,
    blows: 0,
    kills: 0,
  };
  summary.monsters.push(fresh);
  return fresh;
}

function made(summary: RunSummary, what: MadeCount['what'], spell: SpellAt): MadeCount {
  const name = spellMenuName(spell);
  const kept = summary.made.find((row) => row.what === what && row.spell === name);
  if (kept) return kept;
  const fresh: MadeCount = { what, spell: name, count: 0 };
  summary.made.push(fresh);
  return fresh;
}

function used(summary: RunSummary, what: UsedCount['what'], name: string): UsedCount {
  const kept = summary.used.find((row) => row.what === what && row.name === name);
  if (kept) return kept;
  const fresh: UsedCount = { what, name, count: 0 };
  summary.used.push(fresh);
  return fresh;
}

/** What a game has to lend the summary's words: its own clock, and its own name for a place. */
export interface SummaryNames {
  /** "12 seconds" in Dungeons of the Unforgiven, "12 moves" in Moraff's World. */
  clockWords(time: number): string;
  /** The game's own name for one of its modules or dungeons. */
  dungeonName(dungeon: number): string;
}

/** "1 step", "12 steps". */
function count(many: number, one: string, several = `${one}s`): string {
  return `${many} ${many === 1 ? one : several}`;
}

/**
 * A run's summary in words, a line at a time.
 *
 * Every line of it is here, so that changing what a run's summary says is changing this one
 * function.
 */
export function summaryLines(summary: RunSummary, names: SummaryNames): string[] {
  const lines = [
    `Spent ${count(summary.actions, 'action')} and ${names.clockWords(summary.time)}`,
    `Took ${count(summary.steps, 'step')}`,
  ];
  if (summary.experience > 0) lines.push(`Gained ${summary.experience} experience`);
  if (summary.experienceLost > 0) lines.push(`Lost ${summary.experienceLost} experience to drainers`);
  if (summary.levelsGained > 0 || summary.levelsLost > 0) {
    lines.push(`Gained ${count(summary.levelsGained, 'level')}, lost ${summary.levelsLost}`);
  }
  lines.push(`Reached floor ${summary.deepestFloor} of ${names.dungeonName(summary.furthestDungeon)}`);
  if (summary.moneyFound > 0) lines.push(`Found ${summary.moneyFound} Greater-American Dollars`);
  for (const spent of summary.spent) lines.push(`Spent ${spent.amount} rubles at the ${spent.where}`);
  for (const made of summary.made) {
    lines.push(
      made.what === 'wand'
        ? `Made ${count(made.count, 'wand')} of ${made.spell}`
        : `Wrote ${count(made.count, 'scroll')} of ${made.spell}`,
    );
  }
  for (const used of summary.used) lines.push(usedWords(used));
  for (const monster of summary.monsters) lines.push(monsterWords(monster));
  if (summary.deaths > 0) lines.push(`Died ${count(summary.deaths, 'time')}`);
  return lines;
}

function usedWords(used: UsedCount): string {
  if (used.what === 'charge') return `Used ${count(used.count, 'charge')} of ${used.name}`;
  if (used.what === 'scroll') return `Read ${count(used.count, 'scroll')} of ${used.name}`;
  if (used.what === 'paper') return `Used ${count(used.count, 'sheet')} of paper for ${used.name}`;
  return `Used the ${used.name} ${count(used.count, 'time')}`;
}

function monsterWords(monster: MonsterAccount): string {
  return (
    `Fought ${monster.fights} ${monster.name}: swung ${count(monster.swings, 'time')} and hit ` +
    `for ${monster.damageDealt}, took ${monster.damageTaken} from them, killed ${monster.kills}`
  );
}
