/**
 * What Moraff's World's 120 spells do, read out of the dispatcher.
 *
 * Every spell in the game arrives at spell_effect (WORLD.EXE 2000:d358), a switch on the
 * category, the level and the slot that either does the work itself or calls one of two dozen
 * small helpers. Each entry below says what that code does; `from` names the function the
 * sentence was read out of, and `notRead` says where the reading stopped short.
 *
 * Three rules from the screen around the dispatcher (spell_screen, WORLD.EXE 2000:ea27) hold
 * for whole categories rather than single spells, so they are not repeated on every entry:
 * permanent spells are refused anywhere but the town, preparation spells are refused during a
 * battle, and a spell whose case returns 0 — a menu escaped, a "redundant", a target that was
 * not there — costs nothing.
 */

export interface MwSpellEffect {
  /** What the code does, in plain English. */
  effect: string;
  /** The decompiled function it was read out of, name and address. */
  from: string;
  /** What could not be settled from the decompilation, where anything was left open. */
  notRead?: string;
}

const REDUNDANT = 'Asking for a level it already has or better answers "CASTING THIS SPELL WOULD BE REDUNDANT" and costs nothing.';

/**
 * Keyed by the SPELLS.HLP record number, which is `category * 30 + (level - 1) * 3 + slot`:
 * 0 to 29 permanent, 30 to 59 preparation, 60 to 89 wizard, 90 to 119 priestly.
 */
export const MW_SPELL_EFFECTS: MwSpellEffect[] = [
  // ---- Permanent, records 0 to 29. Cast from the spellbook these cost their level in spell
  // points twice over: once from the current pool and once from the maximum, for good.
  {
    from: 'enchant_weapon (2000:c30e)',
    effect:
      'Lists your eight weapon slots and sets the plus of the one you pick to exactly 1, so it will take a plus 4 weapon down to 1 rather than add to it. A slot you do not own cannot be picked and the spell costs nothing.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Adds 1 to maximum health points. Current health is left where it was.',
  },
  {
    from: 'cast_spell (2000:c546)',
    effect:
      'Opens a second menu — preparation, wizard or priestly, then a level 1 to 3, then one of the three spells — and adds one scroll of it. The menu blanks out the categories your class cannot cast, but the key that picks them still works, so any class can write any scroll.',
  },
  {
    from: 'enchant_armour (2000:c3d5)',
    effect:
      'Lists your eight armour slots and sets the plus of the one you pick to exactly 1, up or down. A slot you do not own cannot be picked and the spell costs nothing.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Adds 3 to maximum health points.' },
  {
    from: 'cast_spell (2000:c546)',
    effect:
      'Picks a spell up to level 3 the same way the scroll spells do and adds five charges of it to a wand. The blanked-out categories are still selectable from the keyboard.',
  },
  {
    from: 'enchant_weapon (2000:c30e)',
    effect: 'Sets the plus of the one weapon you pick to exactly 2, up or down.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Adds 5 to maximum health points.' },
  {
    from: 'raise_ring_protection (2000:c502)',
    effect: `Sets the ring of protection to 1, whose number comes straight off a monster's attack roll. ${REDUNDANT}`,
  },
  { from: 'enchant_armour (2000:c3d5)', effect: 'Sets the plus of the one armour you pick to exactly 2, up or down.' },
  {
    from: 'raise_ring_antimagic (2000:c524)',
    effect: `Sets the anti-magic ring to 1. Nothing in the game ever reads that byte back except the inventory screen, so the ring does nothing at all — the spell points are simply gone. ${REDUNDANT}`,
  },
  {
    from: 'cast_spell (2000:c546)',
    effect: 'The same scroll menu, with the level allowed to run to 10 instead of 3.',
  },
  { from: 'enchant_weapon (2000:c30e)', effect: 'Sets the plus of the one weapon you pick to exactly 3, up or down.' },
  { from: 'raise_ring_protection (2000:c502)', effect: `Sets the ring of protection to 2. ${REDUNDANT}` },
  {
    from: 'raise_body_armour (2000:c4e0)',
    effect: `Sets the body armour to level 1, which also comes off a monster's attack roll. ${REDUNDANT}`,
  },
  { from: 'enchant_armour (2000:c3d5)', effect: 'Sets the plus of the one armour you pick to exactly 3, up or down.' },
  { from: 'raise_ring_antimagic (2000:c524)', effect: 'Sets the anti-magic ring to 2, which no formula in the game reads.' },
  { from: 'cast_spell (2000:c546)', effect: 'The wand menu, with the level allowed to run to 8.' },
  { from: 'raise_ring_protection (2000:c502)', effect: `Sets the ring of protection to 3. ${REDUNDANT}` },
  { from: 'raise_ring_antimagic (2000:c524)', effect: 'Sets the anti-magic ring to 3, which no formula in the game reads.' },
  { from: 'raise_body_armour (2000:c4e0)', effect: `Sets the body armour to level 2. ${REDUNDANT}` },
  { from: 'enchant_weapon (2000:c30e)', effect: 'Sets the plus of the one weapon you pick to exactly 4, up or down.' },
  { from: 'enchant_armour (2000:c3d5)', effect: 'Sets the plus of the one armour you pick to exactly 4, up or down.' },
  { from: 'cast_spell (2000:c546)', effect: 'The wand menu, with the level allowed to run all the way to 10.' },
  {
    from: 'spell_effect (2000:d358), recompute_weight (2000:2d8e)',
    effect:
      'Sets the feather marker to 100 and recomputes the weight you are carrying, which then leaves your own body weight out of the total. The inn only clears a feather marked 1, so this one survives a rest.',
  },
  {
    from: 'raise_ring_antimagic (2000:c524)',
    effect: 'Sets the anti-magic ring to 5, the strongest one, and just as unread by the game as the others.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Adds 25 to maximum health points.' },
  {
    from: 'spell_effect (2000:d358), monsters_move (2000:81cd)',
    effect:
      'Sets the invisibility marker to 100. That still saves you from a monster\'s free first strike when rand(floor + floor / 2) comes out above your level, but the 1-in-4 chance of the monsters not moving at all only applies to a marker of exactly 1, so the permanent version is the weaker of the two.',
  },
  {
    from: 'spell_effect (2000:d358), N_LXURSH (1000:1417)',
    effect:
      'Halves your age, and raises it back to 15,744 minutes if that came out lower. It does not give back the strength and constitution that ageing took. The help text promises ten years off, so a character old enough to be worried is getting a far better deal than the text says.',
  },
  { from: 'raise_body_armour (2000:c4e0)', effect: `Sets the body armour to level 4. ${REDUNDANT}` },

  // ---- Preparation, records 30 to 59. Refused during a battle.
  {
    from: 'raise_prep_armour (2000:c49c)',
    effect: `Sets the preparation armour bonus to 1, which comes off a monster's attack roll. A night at the inn clears it. ${REDUNDANT}`,
  },
  {
    from: 'raise_prep_weapon (2000:c4be)',
    effect: `Sets the preparation weapon bonus to 1, which is added to your attack roll. A night at the inn clears it. ${REDUNDANT}`,
  },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Heals half your wisdom, rounded down, and never past maximum health. There is no random part, whatever the 1 to 20 in the help text suggests.',
  },
  { from: 'raise_prep_weapon (2000:c4be)', effect: `Sets the preparation weapon bonus to 2. ${REDUNDANT}` },
  {
    from: 'teleport_player (2000:cbdf)',
    effect:
      'Rolls a square of the floor over and over until it finds one that is neither rock nor already holding a monster, and puts you there.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Prints "YOU ARE ON LEVEL n" and nothing else.' },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Heals rand(wisdom) + 10, capped at 40, and never past maximum health.',
  },
  { from: 'raise_prep_armour (2000:c49c)', effect: `Sets the preparation armour bonus to 2. ${REDUNDANT}` },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Adds 5 to strength and marks it. Casting it again answers "YOU HAVE ALREADY CAST THIS SPELL" and costs nothing; a night at the inn takes the 5 back off.',
  },
  { from: 'raise_prep_weapon (2000:c4be)', effect: `Sets the preparation weapon bonus to 3. ${REDUNDANT}` },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Adds 5 to agility and marks it. The same "already cast" rule, and the inn takes it back off.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'One floor down, onto a random square that is not rock rather than the open space directly below you the help text describes, and then the floor is generated afresh. Refused on floor 124 or deeper with "THAT SPELL DOES NOT WORK THIS DEEP".',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'One floor up, onto a random square that is not rock — not the open space directly above you the help text describes. Refused from floor 66 down, though the message says the 64th, and refused in the town.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Prints the floor you are on and your X and Y on it.' },
  {
    from: 'spell_effect (2000:d358), recompute_weight (2000:2d8e)',
    effect:
      'Sets the feather marker to 1 and recomputes the weight you are carrying without your own body weight in it. A night at the inn clears it.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Heals rand(wisdom × 4) + 20, capped at 90, and never past maximum health.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Two floors up, or one from floor 1, onto a random square that is not rock. Refused from floor 66 down and in the town.',
  },
  { from: 'raise_prep_weapon (2000:c4be)', effect: `Sets the preparation weapon bonus to 4. ${REDUNDANT}` },
  {
    from: 'spell_effect (2000:d358), monsters_move (2000:81cd)',
    effect:
      'Sets the invisibility marker to 1. The monsters then do not move at all one turn in four, and a newly met monster loses its free first strike when rand(floor + floor / 2) comes out above your level.',
  },
  { from: 'raise_prep_armour (2000:c49c)', effect: `Sets the preparation armour bonus to 3. ${REDUNDANT}` },
  {
    from: 'spell_effect (2000:d358), monsters_move (2000:81cd)',
    effect:
      'Sets the fast-move marker to 1, which makes the whole monster-movement pass be skipped one turn in four. A night at the inn clears it.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Adds 10 to strength and marks it, unless it is already cast. The inn takes the 10 back off.',
  },
  { from: 'raise_prep_weapon (2000:c4be)', effect: `Sets the preparation weapon bonus to 5. ${REDUNDANT}` },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Exactly twenty-five floors down, not the "at least 25" of the help text, and never past floor 75. Refused from floor 66 down, so it is only castable between floors 1 and 65 anyway.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Adds 10 to agility and marks it, unless it is already cast. The inn takes it back off.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Sets the poison timer to −1, which is what stops it counting down to your next point of strength.',
  },
  { from: 'spell_effect (2000:d358)', effect: 'Sets current health to maximum health.' },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Exactly twenty-five floors up, not the "at least 25" of the help text, and never below the town. Refused from floor 66 down.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: 'Sets the disease timer to −1, which stops it counting down to your next point of constitution.',
  },
  { from: 'raise_prep_armour (2000:c49c)', effect: `Sets the preparation armour bonus to 4. ${REDUNDANT}` },

  // ---- Wizard, records 60 to 89. Every one that touches a monster wants one engaged, and
  // answers "YOU ARE NOT CURRENTLY ENGAGING ANY MONSTER" and costs nothing when there is none.
  {
    from: 'sleep_monster (2000:caba)',
    effect:
      "Rolls rand(the monster's level) and puts it to sleep for 10 of its turns only on a 0, so the chance is one in its level; anything else prints \"THE SPELL FAILS.\" and the spell points are still spent. Each of its turns the sleep also ends outright when rand(500) comes out below the floor number.",
  },
  { from: 'spell_effect (2000:d358)', effect: "Takes your level × 2 + 2 off the monster's health, which is one level's worth more than the 2 points per level the help text promises." },
  {
    from: 'raise_protection (2000:cf6c)',
    effect:
      "Protection level 1 for 60 moves, which takes 2 × 1² = 2 off a monster's attack roll. Casting the same level again adds 60 more moves; a weaker one is refused as redundant.",
  },
  {
    from: 'spell_effect (2000:d358), monsters_move (2000:81cd)',
    effect:
      'Sets the slow timer to 60 moves. While it runs, each monster has its move counter pushed forward by your agility ÷ 3 one turn in four — a delay, not the half speed the message claims.',
  },
  {
    from: 'boost_strength (2000:cb43)',
    effect:
      'Adds 7 to strength for 60 moves, and takes the 7 off again when the timer runs out. Casting it while it is running answers "YOU HAVE ALREADY CAST THIS SPELL" and costs nothing.',
  },
  { from: 'spell_effect (2000:d358)', effect: "Takes 25 off the monster's health." },
  { from: 'spell_effect (2000:d358)', effect: "Takes your level × 4 + 4 off the monster's health." },
  { from: 'spell_effect (2000:d358)', effect: "Takes 50 off the monster's health." },
  {
    from: 'boost_agility (2000:cb6d)',
    effect: 'Adds 7 to agility for 60 moves and takes it off again at the end. The same "already cast" rule.',
  },
  {
    from: 'teleport_monster (2000:cccc), spell_proof (2000:cc66)',
    effect:
      'Teleports the monster to a random square that is not rock, every single time — there is no ratio between the player and monster levels anywhere in the code, whatever the help text says. A monster whose special-attack byte is 100 laughs it off and costs you nothing.',
  },
  {
    from: 'teleport_player (2000:cbdf)',
    effect: 'Rolls a square of the floor until it finds one that is neither rock nor holding a monster, and puts you there.',
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect:
      'Power weapon level 1 for 60 moves. While it runs your damage die becomes 129, the row of the weapon table after the one it labels POWER WEAPON 1, where the greatest sword in the game rolls 19. Only the die changes: the to-hit bonus still comes from the weapon in your hand, and the plus 3 the help text promises is used nowhere. Casting the same level again adds 60 moves; a weaker one is refused as redundant.',
  },
  { from: 'explosion (2000:c9d2)', effect: "Takes rand(101) + 75 — so 75 to 175 — off the monster's health." },
  {
    from: 'raise_protection (2000:cf6c)',
    effect: "Protection level 2 for 60 moves, which takes 2 × 2² = 8 off a monster's attack roll.",
  },
  {
    from: 'resist_poison (2000:cfd0), monster_turn (2000:615c)',
    effect:
      'Adds 60 moves to the resist-poison timer. While it runs a poison attack does half damage, you cannot be poisoned at all — 100 percent, not the 95 the help text claims — and a poison you already carry stops counting down.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: "Rolls rand(5) + 4 once for every level you have plus one, and takes the lot off the monster's health — 4 to 8 a level, plus one free level's worth.",
  },
  { from: 'spell_effect (2000:d358)', effect: "Takes 125 off the monster's health." },
  {
    from: 'anti_cold (2000:d03c), monster_turn (2000:615c)',
    effect: 'Adds 60 moves to the anti-cold timer, which halves a cold attack rather than preventing it.',
  },
  { from: 'explosion (2000:c9d2)', effect: "Takes rand(101) + 125 — so 125 to 225 — off the monster's health." },
  {
    from: 'teleport_direction (2000:d195)',
    effect:
      'Asks for a direction and moves you to the first square 2 to 19 away in it that is inside the map, not rock and has no monster on it, through whatever walls lie between. If nothing within 19 qualifies nothing happens and nothing is spent.',
  },
  {
    from: 'anti_fire (2000:d072), monster_turn (2000:615c)',
    effect: 'Adds 60 moves to the anti-fire timer, which halves a fire attack rather than preventing it.',
  },
  {
    from: 'spell_effect (2000:d358)',
    effect: "Rolls rand(5) + 7 once for every level you have plus one, and takes the lot off the monster's health — 7 to 11 a level, plus one free level's worth.",
  },
  {
    from: 'raise_protection (2000:cf6c)',
    effect: "Protection level 3 for 60 moves, which takes 2 × 3² = 18 off a monster's attack roll.",
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect: 'Power weapon level 2 for 60 moves: the damage die becomes 199, with the weapon in your hand still supplying the to-hit bonus.',
  },
  {
    from: 'spell_effect (2000:d358), spell_proof (2000:cc66)',
    effect:
      'Holds the monster for 15 of its turns, with no roll to make. Each of those turns the hold also ends outright when rand(500) comes out below the floor number, and a monster whose special-attack byte is 100 refuses the spell.',
  },
  {
    from: 'drain_monster (2000:d0de), spell_proof (2000:cc66)',
    effect:
      'Takes your wisdom off the monster\'s level. A monster whose level is below your wisdom has its level and its health set to zero outright, so the spell simply kills it; otherwise it also loses half of one of its own numbers times your wisdom in health. A monster whose special-attack byte is 100 refuses it.',
    notRead: "Which of the monster's numbers the health loss is built on — the byte at DS:0248 of its 35-byte row.",
  },
  { from: 'spell_effect (2000:d358)', effect: "Takes 300 off the monster's health." },
  { from: 'explosion (2000:c9d2)', effect: "Takes rand(301) + 200 — so 200 to 500 — off the monster's health." },
  {
    from: 'autokill (2000:cdc5), spell_proof (2000:cc66)',
    effect:
      "The monster rolls rand(rand(two of its own bytes added together) + its level) and you roll rand(level + rand(intelligence + wisdom)) + rand(floor); if yours is the bigger the monster's health is set to −100 and it dies. Losing prints \"THE SPELL FAILS... TOUGH LUCK CHARLIE\" and the spell points are still spent. A monster whose special-attack byte is 100 refuses it.",
    notRead: "Which two of the monster's bytes its roll is built on — DS:024a and DS:024b of its 35-byte row.",
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect: 'Power weapon level 3 for 60 moves: the damage die becomes 399, the biggest in the weapon table, with the weapon in your hand still supplying the to-hit bonus.',
  },

  // ---- Priestly, records 90 to 119. The same battle rules as the wizard list.
  {
    from: 'sleep_monster (2000:caba)',
    effect:
      "Rolls rand(the monster's level) and puts it to sleep for 10 of its turns only on a 0. The same spell as the wizard's.",
  },
  { from: 'raise_protection (2000:cf6c)', effect: "Protection level 1 for 60 moves: 2 off a monster's attack roll." },
  { from: 'boost_strength (2000:cb43)', effect: 'Adds 7 to strength for 60 moves and takes it off again at the end.' },
  {
    from: 'resist_poison (2000:cfd0), monster_turn (2000:615c)',
    effect:
      'Adds 60 moves to the resist-poison timer: a poison attack does half damage, no new poison can be caught at all — 100 percent, not the 95 the help text claims — and one already carried stops counting down.',
  },
  { from: 'boost_agility (2000:cb6d)', effect: 'Adds 7 to agility for 60 moves and takes it off again at the end.' },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Heals half your wisdom, rounded down, and never past maximum health — the preparation Little Cure exactly, but castable in battle.',
  },
  {
    from: 'resist_disease (2000:d006), monster_turn (2000:615c)',
    effect:
      'Adds 60 moves to the resist-disease timer: a disease attack does half damage, no new disease can be caught at all — 100 percent, not the 95 the help text claims — and one already carried stops counting down.',
  },
  {
    from: 'teleport_player (2000:cbdf)',
    effect: 'Rolls a square of the floor until it finds one that is neither rock nor holding a monster, and puts you there.',
  },
  {
    from: 'spell_effect (2000:d358), monsters_move (2000:81cd)',
    effect:
      'Sets the slow timer to 60 moves, which pushes each monster\'s move counter forward by your agility ÷ 3 one turn in four.',
  },
  {
    from: 'anti_cold (2000:d03c), monster_turn (2000:615c)',
    effect: 'Adds 60 moves to the anti-cold timer, which halves a cold attack rather than preventing it.',
  },
  {
    from: 'teleport_monster (2000:cccc), spell_proof (2000:cc66)',
    effect:
      'Teleports the monster to a random square that is not rock, every single time; only a monster whose special-attack byte is 100 is unmoved.',
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect: 'Power weapon level 1 for 60 moves: the damage die becomes 129, with the weapon in your hand still supplying the to-hit bonus and the help text\'s plus 3 used nowhere.',
  },
  {
    from: 'raise_protection (2000:cf6c)',
    effect:
      "Asks for protection level 1, not 2, so it takes only 2 off a monster's attack roll where the wizard's Protection takes 8. Cast after Minor Protection it merely adds 60 more moves, and a priest goes from 2 straight to Major Protection's 18.",
  },
  {
    from: 'anti_fire (2000:d072), monster_turn (2000:615c)',
    effect: 'Adds 60 moves to the anti-fire timer, which halves a fire attack rather than preventing it.',
  },
  {
    from: 'teleport_direction (2000:d195)',
    effect:
      'Asks for a direction and moves you to the first square 2 to 19 away in it that is inside the map, not rock and has no monster on it. Nothing within 19 means nothing happens and nothing is spent.',
  },
  {
    from: 'resist_drain (2000:d0a8), monster_turn (2000:615c)',
    effect: 'Adds 60 moves to the resist-drain timer. While it runs a level drain is blocked completely — 100 percent, not the 90 the help text claims.',
  },
  {
    from: 'drain_monster (2000:d0de), spell_proof (2000:cc66)',
    effect:
      "Takes your wisdom off the monster's level, and kills outright any monster whose level is below your wisdom. The same spell as the wizard's.",
    notRead: "Which of the monster's numbers the health loss is built on — the byte at DS:0248 of its 35-byte row.",
  },
  {
    from: 'spell_effect (2000:d358)',
    effect:
      'Heals rand(wisdom × 4) + 20, capped at 90 — the preparation Big Cure exactly, but castable in battle.',
  },
  {
    from: 'spell_effect (2000:d358), spell_proof (2000:cc66)',
    effect:
      'Holds the monster for 15 of its turns, with no roll to make, unless its special-attack byte is 100.',
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect: 'Power weapon level 2 for 60 moves: the damage die becomes 199, with the weapon in your hand still supplying the to-hit bonus.',
  },
  { from: 'spell_effect (2000:d358)', effect: "Takes 125 off the monster's health." },
  {
    from: 'raise_protection (2000:cf6c)',
    effect: "Protection level 3 for 60 moves: 18 off a monster's attack roll.",
  },
  { from: 'explosion (2000:c9d2)', effect: "Takes rand(101) + 125 — so 125 to 225 — off the monster's health." },
  {
    from: 'spell_effect (2000:d358)',
    effect: "Rolls rand(5) + 4 once for every level you have plus one, and takes the lot off the monster's health — 4 to 8 a level, plus one free level's worth.",
  },
  {
    from: 'autokill (2000:cdc5), spell_proof (2000:cc66)',
    effect:
      "Your roll of rand(level + rand(intelligence + wisdom)) + rand(floor) against the monster's of rand(rand(two of its own bytes) + its level); winning sets its health to −100 and kills it, losing spends the spell points anyway.",
    notRead: "Which two of the monster's bytes its roll is built on — DS:024a and DS:024b of its 35-byte row.",
  },
  {
    from: 'raise_power_weapon (2000:cf08)',
    effect: 'Power weapon level 3 for 60 moves: the damage die becomes 399, the biggest in the weapon table, with the weapon in your hand still supplying the to-hit bonus.',
  },
  {
    from: 'boost_strength_and_agility (2000:cb97)',
    effect:
      'Adds 60 moves to both the strength and the speed timers, and adds the +7 to a stat only where that timer was not already running. It is refused as already cast only when both are running, so it is the cheap way to top either one up.',
  },
  {
    from: 'raise_protection (2000:cf6c)',
    effect:
      "Protection level 4 for 60 moves, which takes 2 × 4² = 32 off a monster's attack roll. No other list has it.",
  },
  { from: 'spell_effect (2000:d358)', effect: 'Sets current health to maximum health, in the middle of a battle.' },
  { from: 'spell_effect (2000:d358)', effect: "Takes 300 off the monster's health." },
];
