import { MW_BREATH_NAMES } from '../../game/mw-port/combat';
import { mwSpellRecord, MW_SPELL_NAMES } from '../../game/mw-port/spells';
import type { MwEvent } from '../../game/mw-port/state';
import type { Find, SpellAt } from '../../game/journal-events';
import { MORAFFS_WORLD_MAP } from '../../map/game';
import { BOSSES } from '../../mw-bestiary/monsters';
import { CAST_SOURCES, DIRECTIONS, floorWords, monsterWords } from '../journal';

/**
 * Every line a Moraff's World run journal can say.
 *
 * `../journal.ts` is what this is for: the recorder turns each event the game pushed into one of
 * these lines and keeps it beside the run. Every word of them is John's, and every one is a case
 * of the one switch below, so changing what a run of this game says is changing this one
 * function.
 *
 * An event with no case here is one there is nothing to report about: the record being saved, the
 * weight being added up again, the floor the port records instead of loading, the character being
 * rolled.
 */

/** The name the spell grid prints for the spell at one place in one of the four lists. */
function mwSpellName(spell: SpellAt): string {
  return MW_SPELL_NAMES[mwSpellRecord(spell.type, spell.level + 1, spell.slot)];
}

/** "a green pill", "an orange pill". */
function pillWords(colour: string): string {
  const said = colour.toLowerCase();
  return `${said === 'orange' ? 'an' : 'a'} ${said} pill`;
}

/** The five pages the pockets are read a page at a time from. */
const POCKET_PAGES = ['spellbooks', 'scrolls', 'wands', 'spell papers', 'magic items'];

/** What was found, as the line names it. */
function findWords(find: Find): string {
  switch (find.what) {
    case 'spellbook':
      return `Found a spellbook: ${mwSpellName(find.spell)}`;
    case 'scroll':
      return `Found a scroll of ${mwSpellName(find.spell)}`;
    case 'paper':
      return `Found a sheet of spell paper for ${mwSpellName(find.spell)}`;
    case 'wand':
      return `Found a wand of ${mwSpellName(find.spell)} with ${find.charges} charges`;
    case 'armour':
      return `Found a suit of ${find.item} armor`;
    case 'weapon':
    case 'item':
    case 'potion':
      return `Found a ${find.item}`;
    case 'key':
      return `Found the trap door key labelled ${find.key}`;
    case 'money':
      return `Found a pile of stones worth ${find.amount} jewels`;
  }
}

/** What a quest boss's item put its plus on, as the line names it. */
function enhancedWords(what: string, item: string | null, plus: number): string {
  if (what === 'weapon') return `The orb turned the ${item} into a plus ${plus} weapon`;
  if (what === 'bodyArmor') return `Put on plus ${plus} body armor`;
  if (what === 'gauntlet') return `Put on the plus ${plus} gauntlet`;
  return `Put on the plus ${plus} ring of protection`;
}

export function moraffsWorldJournal(pushed: { kind: string }): string | null {
  // The recorder holds the events as a list of kinds; this is the game that pushed them.
  const event = pushed as MwEvent;
  switch (event.kind) {
    case 'stepped':
      return `Stepped ${DIRECTIONS[event.dir]}`;
    case 'waited':
      return 'Waited a moment';
    case 'dug':
      // A dig here either comes out on a floor or is stopped by a monster; nothing moves the
      // character without a hole.
      if (event.outcome === 'hole') return `Dug through the floor to floor ${event.to}`;
      return 'A monster interrupted the digging';
    case 'trapdoorTaken':
      return `Went down the trap door at ${event.from.x},${event.from.y} to floor ${event.to}`;
    case 'ladderTaken':
      return `Took the ladder to ${floorWords(event.to)}`;
    case 'buildingEntered':
      return `Went into the ${event.building}`;
    case 'floorReached':
      return `Reached ${floorWords(event.floor)}`;
    case 'dungeonReached':
      return `Walked into ${MORAFFS_WORLD_MAP.dungeonName(event.dungeon)}`;
    case 'met':
      return `Came face to face with ${monsterWords(event.monster)}`;
    case 'swung':
      return event.damage === 0
        ? `Swung the ${event.weapon} at ${monsterWords(event.monster)} and missed`
        : `Swung the ${event.weapon} at ${monsterWords(event.monster)} and hit for ${event.damage}`;
    case 'hit':
      if (event.breath !== null) {
        const breath = MW_BREATH_NAMES[event.breath] ?? '';
        return event.damage === 0
          ? `The ${event.monster.name} breathed ${breath} on you and it did nothing`
          : `The ${event.monster.name} breathed ${breath} on you for ${event.damage}`;
      }
      return event.damage === 0
        ? `The ${event.monster.name} missed`
        : `The ${event.monster.name} hit you for ${event.damage}`;
    case 'killed':
      return `Killed ${monsterWords(event.monster)} for ${event.experience} experience`;
    case 'spellDamaged':
      return `The spell hit ${monsterWords(event.monster)} for ${event.damage}`;
    case 'levelLost':
      return `The ${event.monster.name} drained ${event.levels === 1 ? 'a level' : `${event.levels} levels`}, down to level ${event.level}`;
    case 'statChanged':
      return event.by < 0
        ? `The ${event.monster.name} drained a point of ${event.stat.toLowerCase()}`
        : `The ${event.monster.name} raised a point of ${event.stat.toLowerCase()}`;
    case 'afflicted':
      return event.what === 'poison'
        ? `The ${event.monster.name} poisoned you`
        : `The ${event.monster.name} gave you a disease`;
    case 'levelGained':
      return `Gained ${event.level - event.from === 1 ? 'a level' : `${event.level - event.from} levels`} at the inn: now level ${event.level}`;
    case 'cast':
      // Every cast this game pushes is one of its own, which says what it was cast out of.
      if (event.spell.game !== 'moraffsWorld') return null;
      return `Cast ${event.spell.name} ${CAST_SOURCES[event.spell.source]}`;
    case 'wandMade':
      return `Wrote a wand of ${mwSpellName(event.spell)} with ${event.charges} charges`;
    case 'scrollWritten':
      return `Wrote a scroll of ${mwSpellName(event.spell)}`;
    case 'itemUsed':
      return `Used the ${event.item}`;
    case 'dropped':
      return event.what === 'money'
        ? `Threw away ${event.amount} stones`
        : `Dropped the ${event.item}`;
    case 'gearSwitched':
      return event.what === 'weapon' ? `Took up the ${event.item}` : `Put on ${event.item} armor`;
    case 'found':
      return findWords(event.find);
    case 'pillFound':
      return `Found ${pillWords(event.colour)}`;
    case 'cupOfHealth':
      return `Drank a cup of health and got ${event.healed} hit points back`;
    case 'ballOfThought':
      return 'Found a shimmering ball of thought, and a spell point back';
    case 'gearEnhanced':
      return enhancedWords(event.what, event.item, event.plus);
    case 'pocketsRead':
      return `Looked through the ${POCKET_PAGES[event.page - 1]} in the pockets`;
    case 'coinsSpent':
      return `Bought ${event.on} at the ${event.where} for ${event.amount} jewels`;
    case 'deposited':
      return `Put ${event.amount} jewels in the bank`;
    case 'withdrew':
      return `Took ${event.amount} jewels out of the bank`;
    case 'stonesConverted':
      return `Changed the stones into ${event.jewels} jewels at the bank`;
    case 'contractSigned':
      return `Signed a raise-dead contract for ${event.x},${event.y} in ${MORAFFS_WORLD_MAP.dungeonName(event.dungeon)}`;
    case 'raised':
      return `Raised from the dead in the town of ${MORAFFS_WORLD_MAP.dungeonName(event.dungeon)}`;
    case 'bossKilled':
      return `Beat the quest boss ${BOSSES[event.boss].name}`;
    case 'gameWon':
      return 'Beat the Red Dragon King and won the game';
    case 'died': {
      const dungeon = MORAFFS_WORLD_MAP.dungeonName(event.dungeon);
      const where =
        event.floor === 0 ? `in the town of ${dungeon}` : `on floor ${event.floor} of ${dungeon}`;
      return event.monster === null
        ? `Died ${where}`
        : `Died to ${monsterWords(event.monster)} ${where}`;
    }
    default:
      return null;
  }
}
