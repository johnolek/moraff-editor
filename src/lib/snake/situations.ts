/**
 * When the game shows each of its messages, and who hears it.
 *
 * Every one of UH.BIN's 138 messages and UH2.BIN's 86 belongs to exactly one group here. The
 * groups were read out of the calls to give_hint (exe 2000:313a) and tablet_message (exe
 * 3000:931c): 125 and 32 call sites, each pushing the message number as a constant. Ghidra
 * drops those arguments, so they were read back out of the machine code of the unpacked
 * executable, where every one of them is a `mov ax, <number>` in front of the call.
 *
 * The snake speaks in the first eight groups. The rest are the same two message boxes used for
 * the game's own announcements, which are here because they come out of the same two files.
 */

/** One message, and who hears it within its group. */
export interface Placement {
  file: 'uh.bin' | 'uh2.bin';
  index: number;
  /** What picks this one out of the group: a module, a floor, a level, a class, an event. */
  who: string;
}

/** One situation: when it happens, what decides which message it shows, and the messages. */
export interface Situation {
  id: string;
  title: string;
  /** Plain English, from the decompiled code. */
  when: string;
  /** Whether it is the little snake talking. */
  snake: boolean;
  /** The function in dotu-tools/decomp/unf.c the rule was read from. */
  c: string;
  /** The function in src/lib/game/port/hints.ts that ports the rule, where one does. */
  ts?: string;
  entries: Placement[];
}

const uh = (index: number, who: string): Placement => ({ file: 'uh.bin', index, who });
const uh2 = (index: number, who: string): Placement => ({ file: 'uh2.bin', index, who });

const TOWN_FLOORS = [
  'before you have been below floor 4',
  'floors 4 to 7',
  'floors 8 to 11',
  'floors 12 to 15',
  'floors 16 to 19',
  'floors 20 to 29',
  'floors 30 to 39',
  'floors 40 to 59',
  'floors 60 to 79',
  'floors 80 to 99',
];

const INN_LEVELS = [
  'level 1',
  'levels 2 and 3',
  'levels 4 and 5',
  'levels 6 and 7',
  'levels 8 to 11',
  'levels 12 to 15',
  'levels 16 to 19',
  'levels 20 to 24',
  'levels 25 to 29',
  'levels 30 to 39',
  'levels 40 to 49',
  'levels 50 to 59',
  'levels 60 to 69',
  'levels 70 to 79',
];

/** The twenty sections, in the order their warnings are numbered. */
const SECTIONS = [
  'module I, floor 5',
  'module I, floor 10',
  'module I, floor 15',
  'module I, floor 20',
  'module II, floor 10',
  'module II, floor 20',
  'module II, floor 30',
  'module II, floor 40',
  'module III, floor 15',
  'module III, floor 30',
  'module III, floor 45',
  'module III, floor 60',
  'module IV, floor 20',
  'module IV, floor 40',
  'module IV, floor 60',
  'module IV, floor 80',
  'module V, floor 25',
  'module V, floor 50',
  'module V, floor 75',
  'module V, floor 100',
];

const CLASSES = ['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE'];

/** Hint 0 to 7 for the first eight sections and 126 to 137 for the last twelve. */
const warningHint = (section: number): number => (section < 8 ? section : section + 118);

export const SITUATIONS: Situation[] = [
  {
    id: 'town',
    title: 'Walking into town',
    when:
      'Coming up the last ladder into the town, the snake sizes you up by the deepest floor you have reached. That depth is a running maximum the game keeps while it is open and never loads from the save, so it starts at zero every time you start the game: a character who has been to floor 90 is greeted as a wimp until they go back down. From floor 100 on there is nothing left to say and the snake stays quiet.',
    snake: true,
    c: 'FUN_3000_9488',
    ts: 'townTablet',
    entries: [
      ...TOWN_FLOORS.map((who, index) => uh2(index, who)),
      uh(102, 'module I only, every time you reach the town'),
    ],
  },
  {
    id: 'inn',
    title: 'A night at the inn',
    when:
      'The inn shows its sign, warns you what the night will cost, ages you, refills your spell points out of your magic crystals, and if the night made you a level, the snake comes in to congratulate you by the level you have just reached. Every module has its own inn, from the Hell Hole to Moraff\'s own. From level 80 the snake has nothing left to say.',
    snake: true,
    c: 'flea_inn',
    ts: 'innTablet',
    entries: [
      uh(16, 'module I: the Hell Hole Inn'),
      uh(17, 'module II: the Slacker Hotel'),
      uh(18, 'module III: the Flea Bag Inn'),
      uh(19, 'module IV: the Motel 6.5'),
      uh(20, 'module V: the Moraff Inn'),
      uh(86, 'after the sign, every time'),
      uh(97, 'when you cannot pay for the room'),
      uh(21, 'when the night has cost you a point of constitution'),
      uh(98, 'when the night leaves you over sixty'),
      uh(99, 'when your magic crystals run out before your spell points are full'),
      uh(22, 'on gaining a level, below level 5'),
      ...INN_LEVELS.map((who, index) => uh2(10 + index, who)),
    ],
  },
  {
    id: 'boss-floor',
    title: 'Arriving on a floor a Shadow monster guards',
    when:
      'Every ladder and every trap door that changes the floor asks for a hint. Landing on the floor one of the twenty section bosses lives on gets that section\'s warning, but only while the boss is alive: the game keeps one byte per module with a bit for each of its four bosses. The warnings are not numbered in section order — the first eight sections take hints 0 to 7 and the last twelve take 126 to 137, which is the section number plus 118.',
    snake: true,
    c: 'FUN_2000_31bc',
    ts: 'bossWarningHint',
    entries: SECTIONS.map((who, section) => uh(warningHint(section), who)),
  },
  {
    id: 'advice',
    title: 'A word of advice on the way down',
    when:
      'On any floor change that has no boss to warn about, the snake speaks once in twelve arrivals, and picks one of these eight at random. They are the only hints in the game that repeat.',
    snake: true,
    c: 'FUN_2000_31bc',
    ts: 'hintOnArrival',
    entries: [
      uh(8, 'one of eight, at random'),
      uh(9, 'one of eight, at random'),
      uh(10, 'one of eight, at random'),
      uh(11, 'one of eight, at random'),
      uh(12, 'one of eight, at random'),
      uh(13, 'one of eight, at random'),
      uh(14, 'one of eight, at random'),
      uh(15, 'one of eight, at random'),
    ],
  },
  {
    id: 'boss-message',
    title: 'A message from the office of',
    when:
      'Every 250 turns spent looking at the section\'s boss, the snake offers to carry a message from it, and reading one puts the boss\'s picture beside its taunt. Module I\'s four bosses have three taunts each and the game counts how many of them you have read; every other section has one, shown once.',
    snake: true,
    c: 'boss_office_message',
    ts: 'bossTablet',
    entries: [
      uh(123, 'the snake offering to read it to you'),
      ...SECTIONS.slice(0, 4).flatMap((who, section) => [
        uh2(24 + section * 3, `${who}, the first message`),
        uh2(25 + section * 3, `${who}, the second`),
        uh2(26 + section * 3, `${who}, the third`),
      ]),
      ...SECTIONS.slice(4).map((who, index) => uh2(36 + index, who)),
    ],
  },
  {
    id: 'first-steps',
    title: 'The notes in the corner',
    when:
      'While a monster is in view the game drops a four-line note under it. A character below level 3 gets the eleven notes of the tour, one at a time, on a one in six chance a turn; after that it picks one of eight warnings at random each turn and shows it only if it applies to you. The tour skips the note about the town when you are not in it and the note about curing when you are a fighter, who cannot cast.',
    snake: false,
    c: 'draw_monster_view',
    entries: [
      uh(106, 'a character with no experience yet, as the game starts'),
      uh(105, 'a character with no experience yet, on its first move'),
      uh2(61, 'the tour, first'),
      uh2(62, 'the tour, second'),
      uh2(63, 'the tour, third'),
      uh2(64, 'the tour, fourth'),
      uh2(65, 'the tour, fifth — only in the town'),
      uh2(66, 'the tour, sixth'),
      uh2(67, 'the tour, seventh'),
      uh2(68, 'the tour, eighth — not for a fighter'),
      uh2(69, 'the tour, ninth'),
      uh2(70, 'the tour, tenth'),
      uh2(71, 'the tour, eleventh'),
      uh2(75, 'when your health is below a quarter of its maximum'),
      uh2(76, 'when the floor is deeper than three times your level plus three'),
      uh2(77, 'when what you carry weighs more than you do'),
      uh2(78, 'when you have the experience for another level'),
      uh2(79, 'when your spell points are low'),
      uh2(80, 'while you are diseased'),
      uh2(82, 'while you are poisoned'),
    ],
  },
  {
    id: 'new-character',
    title: 'A new character',
    when:
      'The title screen and the character roller use the same stone tablet. The welcome a new character gets is chosen by the class they were rolled as.',
    snake: false,
    c: 'roll_char',
    ts: 'classTablet',
    entries: [
      uh2(83, 'the title screen'),
      uh2(84, 'the title screen'),
      uh2(59, 'the title screen'),
      uh2(60, "when you pick I CAN HANDLE ANYTHING difficulty — and this one is the snake's"),
      uh2(85, 'while the character is being rolled'),
      ...CLASSES.map((name, index) => uh2(52 + index, `a new ${name}`)),
    ],
  },
  {
    id: 'finding',
    title: 'Finding something',
    when:
      'What a search turns up, and what falls out of a monster. The six coloured potions come from monsters and are described when you take them, not when you find them.',
    snake: false,
    c: 'find_item',
    entries: [
      uh(31, 'a nuclear hand grenade'),
      uh(32, 'a stone of teleportation'),
      uh(33, 'a stone of seeing'),
      uh(34, 'a second floor slosher, which is no use'),
      uh(35, 'a floor slosher'),
      uh(36, 'a potion of healing'),
      uh(37, 'a ring of regeneration'),
      uh(38, 'a book of strength'),
      uh(39, 'a book of intelligence'),
      uh(40, 'a book of wisdom'),
      uh(41, 'a book of constitution'),
      uh(43, 'a book of dexterity'),
      uh(44, 'a book of luck'),
      uh(45, 'a cup of health, after a kill'),
      uh(46, 'a ball of thought, after a kill'),
      uh(47, 'an orange potion, off a monster'),
      uh(48, 'a green potion, off a monster'),
      uh(49, 'a blue potion, off a monster'),
      uh(50, 'a red potion, off a monster'),
      uh(51, 'a white potion, off a monster'),
      uh(52, 'a yellow potion, off a monster'),
    ],
  },
  {
    id: 'potions',
    title: 'Drinking a potion',
    when: 'The potion menu and what each of the six does: six points on one characteristic for three off another.',
    snake: false,
    c: 'FUN_3000_7052',
    entries: [
      uh(53, 'the menu'),
      uh(54, 'the green potion'),
      uh(55, 'the orange potion'),
      uh(56, 'the yellow potion'),
      uh(57, 'the red potion'),
      uh(58, 'the blue potion'),
      uh(59, 'the white potion'),
      uh(90, 'picking a potion you do not have'),
    ],
  },
  {
    id: 'kills',
    title: 'Killing a monster',
    when:
      'The nineteen rewards are what the section bosses carry, and each one points you at the next boss. The twentieth boss, the Shadow Ogeroth on floor 100, hands over nothing and gets no message.',
    snake: false,
    c: 'kill_monster',
    entries: [
      ...SECTIONS.slice(0, 19).map((who, section) => uh(60 + section, `the boss of ${who}`)),
      uh(79, 'hurt after a kill, as a fighter'),
      uh(80, 'hurt after a kill, as anything that can cast'),
      uh(81, 'when the kill has earned you a level'),
    ],
  },
  {
    id: 'magic-items',
    title: 'Using a magic item',
    when: 'The six-item menu, and what happens when you pick one.',
    snake: false,
    c: 'use_magic_item',
    entries: [
      uh(23, 'the menu'),
      uh(24, 'picking BECOME GOD'),
      uh(25, 'a nuclear hand grenade with nothing in front of you'),
      uh(82, 'a stone of seeing'),
      uh(83, 'a stone of teleportation'),
      uh(84, 'a grenade thrown at a monster that is immune to it'),
      uh(85, 'an item you do not have'),
    ],
  },
  {
    id: 'buildings',
    title: 'The store, the temple and the bank',
    when: 'The three buildings you can climb a ladder into, and what they say when you cannot pay.',
    snake: false,
    c: 'g_store',
    entries: [
      uh(93, 'the store menu'),
      uh(94, 'not enough money in the store'),
      uh(92, 'no money at all in the store'),
      uh(116, 'typing a number of units instead of a number of rubles'),
      uh(95, 'the temple menu'),
      uh(96, 'paying to help a child'),
      uh(100, 'the bank menu'),
      uh(101, 'choosing to rob the bank'),
    ],
  },
  {
    id: 'health',
    title: 'Poison, disease and dying',
    when:
      'Poison takes a point of strength and disease a point of constitution every 450 moments. Death picks one of five parting words at random.',
    snake: false,
    c: 'pass_moment',
    entries: [
      uh(28, 'poison, every 450 moments'),
      uh(27, 'disease, every 450 moments'),
      uh(26, 'blacking out as you die'),
      uh(117, 'one of five, at random'),
      uh(118, 'one of five, at random'),
      uh(119, 'one of five, at random'),
      uh(120, 'one of five, at random'),
      uh(121, 'one of five, at random'),
    ],
  },
  {
    id: 'getting-about',
    title: 'Getting about',
    when: 'Ladders, holes and the monsters you are not close enough to hit.',
    snake: false,
    c: 'movecontrol',
    entries: [
      uh(103, 'climbing where there is no ladder'),
      uh(108, 'attacking with nothing next to you'),
      uh(89, 'the dig menu'),
      uh(29, 'digging where the floor is solid rock — and the snake suggests a ladder'),
      uh(115, 'a fighter too deep to dig, who gets moved somewhere else instead'),
    ],
  },
  {
    id: 'menus',
    title: 'The menus and the switches',
    when: 'The keys that open a menu or flip a setting.',
    snake: false,
    c: 'movecontrol',
    entries: [
      uh(42, 'the graphics menu'),
      uh(109, 'the options menu'),
      uh(110, 'turning the mouse on with no driver loaded'),
      uh(112, 'turning high speed mode on'),
      uh(113, 'turning it off again'),
      uh(114, 'the sound switch'),
      uh(111, 'quitting while in the contest'),
      uh(91, 'the pockets menu'),
      uh(87, 'throwing money away'),
      uh(88, 'choosing to stand on your head and sing a song'),
      uh(124, 'carrying more dollars than the game can hold'),
    ],
  },
  {
    id: 'modules',
    title: 'Between the modules',
    when: 'The teleporter that moves a character from one module to the next, and the spell that gives them a new body.',
    snake: false,
    c: 'change_module',
    entries: [
      uh(125, 'standing in the teleporter'),
      uh(104, 'a character rolled on the easy difficulty, who cannot reach module V'),
      uh(122, 'a module you have not bought'),
      uh(107, 'arriving in the new module, and again for the Youth spell'),
    ],
  },
  {
    id: 'never',
    title: 'Never shown',
    when:
      'Four messages nothing can reach. The new-universe text was replaced by the two the teleporter uses; three of the notes in the corner sit in switch cases with no body; and the test that would show "try not to die" compares a field that is 56 on every character with -1.',
    snake: false,
    c: 'FUN_3000_6b8a',
    entries: [
      uh(30, 'nothing calls give_hint with 30'),
      uh2(72, 'an empty case in the switch'),
      uh2(73, 'an empty case in the switch'),
      uh2(74, 'an empty case in the switch'),
      uh2(81, 'behind a test on DS:c08a, which is 56 on every character and compared with -1'),
    ],
  },
];
