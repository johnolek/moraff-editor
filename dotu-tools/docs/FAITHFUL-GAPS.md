# What faithful mode still does differently

Dungeons of the Unforgiven, read against `decomp/unf.c` in September 2026 (MORF-201). Every line
is one thing the game draws or does that the port does not, or does another way, ordered by how
often a player meets it. `mw-tools/docs/FAITHFUL-GAPS.md` and `rev-tools/docs/FAITHFUL-GAPS.md`
are the same list for the other two games.

What is **not** here: the departures the port makes on purpose and already writes down, which are
the last section of `src/lib/play/README.md` — one seeded generator instead of the clock reseeds,
no `?MON.MAP`, the roster entry standing in for the character file, the maps as a blob beside it,
the settings menus that answer with a box. Those are decisions, not gaps.

The `fixed` lines were fixed under MORF-201 itself; the rest name the item they were filed as.

## The list

| what the player sees or feels | where it comes from | state |
|---|---|---|
| **The game makes four noises and the port makes none.** Every one is in combat: a rising 120→210 Hz sweep when your blow lands, a falling 700→420 Hz sweep when a monster's lands on you, a 680/710 Hz chirp when a monster dies, and a 1.4-second 140/90 Hz dirge when you die. Nothing else in the game makes a sound at all. | `FUN_2000_7dec` (2000:7dec) from `strike`, `FUN_2000_826d` (2000:826d) from `defend`, `FUN_3000_b0ea` (3000:b0ea) first statement of `kill_monster`, `FUN_2000_907b` (2000:907b) from the death routine. All four gate on the sound switch DS:022b, which the O menu already toggles. | filed MORF-218 |
| **A skull and crossbones is painted over a monster the moment it dies**, and stands through every box the kill prints. | `movecontrol` 2000:dafb, `overlay.pic`'s second image into the rectangle `draw_3d_view` kept at DS:2318 / DS:c67a / DS:c682 / DS:c68a. | fixed |
| **The monster you are fighting faces one way or the other and changes as you act**: the picture is mirrored on a coin flip drawn fresh for every view of every pass. | `draw_3d_view` 3000:2323. | fixed — the port cannot spend the game's generator per redraw without breaking replays, so the flip comes from the pass count (`session.viewsDrawn`) instead |
| **A monster's swing is read out a piece at a time.** `defend` stops seven times over: 1260 ms on a puffball's stat message, 110 ms before the blow line is built, 500 ms before the life drainer's box and again before a stat is drained or raised, 250 ms before POISONED / DISEASE, and 100–150 ms at the tail of every swing. | `defend` 2000:82b7 (unf.c 13057, 13185, 13213, 13260, 13281, 13314, 13321). | fixed under MORF-219 — the blank before the blow and the beat at the tail are the two the game itself drops while the repeat-fight flag is up, the high speed option is on, or the character is in the town |
| **The HIT ANY KEY plaque flashes in a third of a second late.** Every eight-line box blanks the plaque's rectangle, waits 330 ms and only then scales a slab of the section's wall material in, prints the two words on it and lays a frame round it whose bands crawl while it waits. | `FUN_2000_3e73` 2000:3e73, reached from `FUN_2000_4054` and its 31 callers. | fixed under MORF-220 — the crawl is the palette rotation of `FUN_4000_3b44`, which the port runs over the whole screen while the plaque is up |
| **DIGGING... DIGGING... flashes.** Four times over, and four more on any floor above 16, the line is wiped, the screen is left blank for 300 ms and the line drawn again for a second and a half. | `dig_hole` 2000:bb92 and 2000:bbeb. | fixed |
| **The chute's first line stands on its own** for a second and a half before the two that say what happened join it. | `chute` 2000:b58a and the delay at 2000:b599. | fixed |
| **The arrow on the zoom map flashes white six times a second**, which is what draws the eye to where you are standing. The port draws it steadily. | `FUN_2000_9d17` 2000:9d17 and the flash `movecontrol` keeps around it; the port's note is at `src/lib/play/display.ts`. | filed MORF-221 |
| **The water sections draw an overlay over the bottom of a built-in monster**, which is drawn short for it. Not drawn at any distance. | `draw_3d_view` 3000:24c8 and `draw_map_square` 3000:307c, `overlay.pic`'s first image. | filed MORF-205 (the file it needs is bundled now) |
| **The stone of seeing fills the map in.** It marks every square of the floor that is not rock as discovered. | `use_magic_item` 2000:b202, the fourth choice: `FUN_2000_72de` over every square `solidcheck` calls open. | fixed under MORF-151 |
| **The town buildings fill the screen with a picture** behind their menus, and the boss's own picture stands beside its taunt. | `g_store` 2000:45ab, `temple` 2000:4d39, `bank` 2000:568b, `flea_inn` 2000:4fe7, `boss_office_message` 3000:6c9d. | filed MORF-213 |
| **The monster manual shows the section's five monsters** in panels of the section's wall material with the letters in their corners, and DEAD over a boss already beaten. | `monster_manual` 3000:c39d, `FUN_3000_9026` 3000:9026. | fixed under MORF-222 |
| **Screens fade in and out through the palette** rather than cutting: 64 steps up out of black and 60 down into it. | `FUN_4000_5b91` 4000:5b91 and `FUN_4000_5c25` 4000:5c25; `movecontrol` fades out on the H key (unf.c 15769). | filed MORF-223 |
| **THE DOOR IS JAMMED / THE SECRET DOOR IS JAMMED** are one timed line each that takes itself off, not a box that stands. | `movecontrol` unf.c 16531 and 16535. | filed MORF-224 |
| **The kill settles for a moment** between the last of its boxes and the level-0 hints about being hurt or having earned a level. | `kill_monster` unf.c 23861. | fixed under MORF-219 — 500 ms, taken whatever the character's level is, and skipped along with the hints in high speed mode |
| The battle banner is redrawn every pass where the game redraws it only when something changed. | `movecontrol` DS:c657 branch. | filed MORF-204 |
| The message box's text colour is unsettled: the code draws it in colour 6 in both branches, and the screenshot reads light blue. | 2000:2f5d. | filed MORF-174 |
| `FUN_4000_433e` is a second blitter with a colour rule of its own that nothing in the port goes through. | 4000:433e. | filed MORF-203 |
| A box shown with a negative period takes itself down after that period instead of waiting for a key. Nothing in ordinary play reaches it. | `mset_gmenu` 2000:2b08, unf.c 9359. | not worth it — no caller in the dungeon uses the timed form |
| The title screen's attract mode holds each auto-walked scene for a hundred ticks. | `title_screen` 3000:99bf. | not worth it — the port has no title screen |
| `FUN_3000_a0c1` is an interruptible wait helper with no callers. | 3000:a0c1. | not worth it — dead in the original too |

## Two things worth knowing

**The skull.** `overlay.pic` holds exactly two images (`load_overlay_pic`, exe 2000:3654, reads
two and stops). Image 0 is the water overlay. Image 1 is a skull and crossbones, and the only
thing that draws it is `movecontrol`, over a monster whose hit points have just run out.
`dotu-tools/docs/SCREEN.md` has the rectangle and the colour rule.

**The high speed option is a real setting.** DS:00c3 gates most of the delays above, and the port
keeps it, so anything reproduced from this list should gate on `game.highSpeed` the way the
original does — including the two places that shorten a wait rather than skipping it (`chute`,
and `kill_monster`'s own "YOU KILLED IT!").
