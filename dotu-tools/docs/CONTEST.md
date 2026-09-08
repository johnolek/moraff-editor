# The hundred-dollar contest — Dungeons of the Unforgiven

MoraffWare ran a contest: beat Module I without ever saving, kill the Shadow Demon
Queen, and the game would hand you a code; the first person to phone MoraffWare with
it won a hundred dollars.  This note is the search for that code.

**The answer: the game never prints one.**  Every piece of contest machinery the rules
imply is in the executable and works — the difficulty, the flag, the ban on saving, the
line on the character sheet that calls you a contestant — except the one thing the
rules actually promise.  Killing the Shadow Demon Queen with the contest flag set does
exactly what killing her without it does.  The evidence is in section 5.

Everything here was read out of `../decomp/unf.c` and out of the unpacked `unf.exe`
(the registered all-modules build dated 24 December 1996, the only build in
`~/games`; all seven copies there are byte-identical).  Addresses are the re-laid
segments the decompilation uses, `unf.c:N` is the line to look at, and data-segment
offsets are given as `DS:c647` — image offset `0x30a00` plus the offset.

## 1. The rules, as the game states them

`UROLL.TXT` is the character roller's script.  Its first 13 lines are the difficulty
menu; lines 14–16 are a third menu entry, and lines 17–28 a full-screen page behind it.
Byte for byte (the file is CRLF, and the lines carry no leading space):

Lines 14–16, the menu entry:

```
3) CONTEST DIFFICULTY (WIN 100 DOLLARS!)
THE FIRST PERSON IN THE WORLD TO DEFEAT
MODULE I WITHOUT SAVING WINS 100 DOLLARS!
```

Lines 17–28, the page:

```
MORAFFWARE IS RUNNING A CONTEST TO SEE WHO
CAN BE THE FIRST TO DEFEAT THE SHAREWARE
VERSION OF DUNGEONS OF THE UNFORGIVEN!
THE WINNER WILL RECEIVE A PRIZE OF 100
DOLLARS! TO SUCCEED, YOU WILL HAVE TO PLAY
THE CHARACTER FROM BEGINNING TO END WITHOUT
SAVING. THIS IS TO ASSURE NO ONE CHEATS!
IF YOU SUCCEED IN DEFEATING THE SHADOW
DEMON QUEEN, YOU WILL BE GIVEN A SPECIAL
CODE. THE FIRST ONE TO CALL US WITH THE
CORRECT CODE WINS!
HIT ANY KEY TO CREATE YOUR CHARACTER...
```

Two other files mention the contest.  `UH.BIN` hint 111 is the disqualification
warning (quoted in section 3.3).  `UH2.BIN`, the snake's file, ends its opening
description with a sentence that states a *different* rule:

```
If you die, buy this game and your
death will be forgiven! Saving is
allowed, but quitting disqualifies
adventurers from the contest.
```

That is the rule the code actually implements for a *non*-contestant, and it
contradicts `UROLL.TXT`.  Which of the two the contest really ran under is not
something the binary can settle.

## 2. Nobody can enter through the menu

`roll_char` (3000:4c77, `unf.c:19927`) prints the 13-line difficulty menu, then reads
lines 14–16 and throws them away without printing them, so the menu on screen simply
stops after option 2 (`unf.c:20005-20007`).  Its input loop maps the keys `1`, `2` and `3` to
0, 1 and 2, and then repeats while the answer is outside 0..1 (`unf.c:20020-20024`):

```c
      if ((0x30 < local_6) && (local_6 < 0x34)) {
        local_6 = local_6 + -0x31;
      }
  } while ((local_6 < 0) || (1 < local_6));
```

So `3` is translated into the contest answer and then rejected for being out of range.
The twelve-line page behind the menu is read and dropped the same way, by the `else`
arm at `unf.c:20068`.

## 3. The flag

The contest flag is the byte at `DS:c647`.  The character record starts at `DS:b880`
and is `0xa87` bytes long, so the flag sits at record offset `0xdc7`, well past the end
of what `save_player` writes.  It is never saved, and it is zero on every launch.

`unf.c` references it in exactly eight places, and that is the whole of the contest
logic in the game.

### 3.1 What sets it

Two things write 1 to it.

The difficulty menu, at `unf.c:20035` — dead, per section 2.

The play loop, at `unf.c:16379`.  `movecontrol` (2000:c308) compares the key it read
against a list, and one branch is a key that appears nowhere in the game's help:

```c
    else if (iVar16 == 0xfb) {
      DAT_6000_c647 = 1;
      DAT_6000_c307 = uVar4;
    }
    else {
      DAT_6000_c307 = uVar4;
      if (iVar16 == 0xfe) {
        DAT_6000_b8b1 = DAT_6000_b8b1 + 10;
      }
    }
```

`uVar4` was loaded from `DAT_6000_c307` earlier in the loop (`unf.c:15764`), and the
fall-through branch restores it identically, so setting the flag is this key's only
effect.  Its neighbour `0xfe` adds 10 to maximum hit points.

The key survives the input path.  `movecontrol` reads a key through the `getch`
wrapper at 4000:417b and passes it through `FUN_1000_1d5f` (`unf.c:2531`), Borland's
`tolower` over the ctype table at `DS:77b3`, which adds 0x20 only when the table byte
has bit 2 set.  Read out of the unpacked exe, `ctype[0xfb]` is `0x00` — as is every
entry from `0x80` to `0xff` — so `0xfb` arrives at the comparison unchanged.  On a
BIOS keyboard, holding Alt and typing 251 on the numeric keypad produces byte 251.

### 3.2 What it stops

`save_player` (2000:79ad, `unf.c:12594`) returns before doing anything while the flag
is set:

```c
  if (DAT_6000_c647 == 1) {
    return;
  }
```

Its callers are `defend`, `pass_moment`, `chute`, `change_module`, `quit_game` and
`roll_char`, which is every path that writes the character to disk.  The no-saving rule
is enforced, not trusted.

That includes character creation: `roll_char` sets the flag near its start and calls
`save_player` at its end (`unf.c:20658`), so a contest character's file is never
written at all.  A contest run exists only in memory.  Die, and there is nothing to
load.

### 3.3 What clears it

Quitting, and only quitting.  In `movecontrol`'s menu handler at `unf.c:16193`:

```c
        case 8:
          if (DAT_6000_c647 != 0) {
            give_hint();
            local_e = get_choice(7);
            if (local_e != 0x31) break;
            DAT_6000_c647 = 0;
          }
          quit_game();
          break;
```

`give_hint(111)` prints `UH.BIN` hint 111, whose eight lines are:

```
CONTESTANTS ARE NOT ALLOWED
TO QUIT THIS MARATHON WITHOUT
BEING DISQUALIFIED. IF YOU
ELECT TO QUIT NOW, YOU WILL
BE SAVED, BUT YOU WILL NOT BE
ABLE TO WIN THE 100 DOLLARS.
1) QUIT, I DON'T NEED MONEY
2) KEEP RIGHT ON PLAYING!
```

Only `1` (0x31) goes on; anything else breaks out and play continues.  Choosing to quit
clears the flag first, which is what lets the `save_player` inside `quit_game`
(`unf.c:13837`) write the character out — the hint's "YOU WILL BE SAVED" is literally
true, and the disqualification is the flag being gone.

### 3.4 Where it shows

One line, on the V screen.  `view_stats` (3000:77e2) ends its right-hand column with a
three-way choice at `unf.c:21278`:

```c
  if (DAT_6000_c176 == '\0') {
    pfont(0x2d0,0x460,0,(char *)s_BY_THE_WAY__YOU_ARE_STILL_ALIVE__6000_2cb0,6);
  }
  else if (DAT_6000_c647 == 1) {
    pfont(0x2d0,0x460,0,(char *)s_YOU_ARE_A_CONTESTANT__6000_2cd1,6);
  }
```

`DS:c176` is record offset `0x8f6`, the "I can handle anything" difficulty flag.  So the
line `YOU ARE A CONTESTANT!` (`DS:2cd1`) needs *both* a character rolled on difficulty 2
*and* the flag set — the hidden key alone is not enough, because a difficulty-1
character takes the first branch and is told it is still alive.

## 4. What actually happens when the Shadow Demon Queen dies

She is the boss of section 4, on floor 20, the last section of Module I; her reward is
armour enhanced to +25 (`data/dotu-data.json`, `bossRewards`).

`kill_monster` (3000:b12d, `unf.c:23452`) handles boss rewards in one switch, entered
only when the dead monster's type is `0x16` and `section_number()` is under `0x14`.
Sections are numbered from zero there, so the Queen is `case 3` (`unf.c:23634`):

```c
    case 3:
      *(byte *)(DAT_6000_022d + -0x3f37) = *(byte *)(DAT_6000_022d + -0x3f37) | 8;
      give_hint();
      FUN_2000_4054();
      FUN_2000_2a83();
      ...
      *(undefined1 *)(iVar2 + -0x46f9) = 0x19;
```

It sets bit 3 of the module's boss-kill byte, prints a hint, lists your armour, and
writes 25 into the piece you pick.  The hint is `UH.BIN` 63:

```
  FINALLY! YOU NOW HAVE THE
WIMPY ORB OF ARMOR
ENHANCEMENT. IT WILL TURN
ANY ARMOR INTO PLUS 25 MAGIC
ARMOR.
  TO FIND THE GREAT AND MIGHTY
ORBS, EXPLORE THE OTHER VAST
DUNGEONS OF THE UNFORGIVEN!
```

An advertisement for the other modules, where the code should have been.

`kill_monster` never reads `DS:c647` — the flag is not among its 3,129 bytes at all —
so a contestant's kill and an ordinary kill are the same kill.  The only boss whose
death prints anything beyond a hint is the Shadow Ogeroth, `case 0x13`, the last boss
of Module V, and what it prints is the ending (`unf.c:23808`), which says nothing about
a code either.

## 5. The evidence that no code exists

Four independent checks, all negative.

1. **All eight uses of the flag are accounted for** — `unf.c:12594`, `16193`, `16197`,
   `16379`, `20032`, `20035`, `20038`, `21281`.  They are the six behaviours in
   section 3.  None prints or computes anything.
2. **The word `CODE` does not occur in the executable.**  Searching the whole unpacked
   245,304-byte image for `CODE`, `code`, `CONTEST` or `contest` returns exactly one
   hit, the string `YOU ARE A CONTESTANT!` at `DS:2cd1`.
3. **No string in the data segment looks like a code screen.**  All 1,080
   null-terminated strings were dumped and swept for `CODE`, `CONTEST`, `DOLLAR`,
   `WINNER`, `PRIZE`, `CALL US`, `PHONE`, `CONGRAT`, `QUEEN`, `WRITE DOWN`, `TELL US`,
   `VERIFY`, `PROOF`, `MARATHON`, `DISQUALIF`, `FIRST PERSON` and more.  Nothing
   survives that is not the Shadow Ogeroth ending, the mail-order pitch, or the two
   strings already quoted here.
4. **No data file carries one.**  `UROLL.TXT`, `UH.BIN`'s 138 hints, `UH2.BIN`, the 29
   `.UHP` help pages, `USPELLS.HLP`, `V`, `UNFINFO.TXT`, `PLAYNOTE.TXT`, `UPLOAD.TXT`,
   `INTRO.TXT` and `FILE_ID.DIZ` were all read or swept.  The only contest text is what
   section 1 quotes.  `ENDGAME.EXE` and `UNFORGIV.EXE`, both PKLITE-packed, were
   unpacked and read: the first is the mail-order catalogue and order form, the second
   the video-mode picker.  Neither mentions the contest.

Point 2 is the strong one, and it is worth saying why.  This build keeps dead code
rather than deleting it: the shareware nag screens are still present as whole functions
with no callers (`FUN_4000_5cb9`, `FUN_4000_5e4a`, `FUN_4000_5fd4`, `FUN_4000_6144` at
`unf.c:29841` onward — "IF YOU REGISTER DUNGEONS OF THE UNFORGIVEN, WE WILL BRING YOU
BACK TO LIFE!"), and the contest's own text is still in `UROLL.TXT` and `UH.BIN` even
though nothing reaches it.  Moraff removed nothing.  A code screen, had one ever been
written, would be sitting there with the rest.

## 6. What the code most plausibly was

Everything in this section is inference, and it is separated from section 5 for that
reason.  Nothing below is in the binary.

The most likely reading is that **the code never existed as software**.  The contest
was a shareware-era promotion, the promise was written into `UROLL.TXT`, and the screen
that was to redeem it was never built — the Queen's death got the upsell hint instead.
That fits the shape of what is there: an author who wrote the rules, wired up the flag,
the save ban, the quit gate and the sheet line, and then stopped one screen short.

If a claimant had somehow reached MoraffWare, what they had to offer was the run
itself: a character that had never been written to disk, sitting on screen at floor 20
of Module I with `YOU ARE A CONTESTANT!` on its V screen, +25 armour and the Queen
dead.  Read aloud over the phone, that is a name, six characteristics, a level, and a
number of hit points — unverifiable, but also unfakeable in the sense Moraff cared
about, since the person had to still be sitting in front of it.

Two possibilities cannot be ruled out from here, and both are guesses:

* **A different build.**  The contest names the *shareware* Module I release of 1993.
  What we have is the registered all-modules build of December 1996.  If the 1993
  shareware `UNF.EXE` printed a code, it would have to have been removed later — which
  runs against this build's habit of keeping dead code and dead text, but is not
  impossible.  No shareware build is on this machine to check.
* **Something outside the program.**  A number read off a printed card, or a phrase in
  a `README` that the 1993 upload carried and this folder does not.

## 7. What this note does not establish

* Whether the 1993 shareware build behaved differently.  Only the 1996 registered build
  was available.
* Which set of rules the contest actually ran under: `UROLL.TXT` says saving
  disqualifies you, `UH2.BIN` says saving is fine and quitting disqualifies you, and the
  code implements a mixture — saving is blocked outright, and quitting is the thing that
  ends your candidacy.
* Whether anyone ever won.
