# Reading a run

A run written up in words, as a page shows it: what it came to at the top and the timeline of
everything that happened under it. Two pages show the same thing from two places — the Play tab
draws the journal the roster kept beside a character's sittings, and a run's page on the Boards
tab draws the one the run server's replay wrote — so the drawing of it lives here rather than in
either of them.

Nothing here writes a journal or folds one. The lines are the games' own words
(`src/lib/play/journal.ts`) and the totals are `summarizeJournal` and `summaryLines`
(`src/lib/play/summary.ts`); this is the page around them.

## The shape

- **`RunJournal.svelte`** — the whole block: the summary lines, and the timeline in a box of its
  own that scrolls. It is handed the entries, how far the run had got, and the game's own words
  for its clock, its dungeons and its money, and it knows nothing about where they came from.
- **`grouping.ts`** — the journal cut into stretches. A stretch runs until the floor or the module
  changes, so a floor come back to later is a stretch of its own rather than more of the one
  before. The newest stretch is open and the earlier ones are folded away, since a long run is
  thousands of lines; a stretch the reader folds open or shut stays that way as the run grows.
- **`lock.ts`** — whether a character's journal may be shown at all. A character rolled for one of
  the boards is held back until it is dead or has beaten the game, which is John's rule; a
  character rolled for no board and a run played in debug are open from the first key, because
  neither is ranked against anything. Those are the same two things `forTheBoards` in
  `server/verifying.ts` asks before it replays a run, so a run held back here is exactly a run the
  server ranks.
- **`words.ts`** — the headings, the note the locked state shows, and the words a stretch's
  heading is made of.

## Where each page gets its entries

- **The Play tab** — `RosterEntry.journal`, one list per sitting of the run, which the recorder
  writes as the game is played and the browser's database keeps
  (`src/lib/character/roster-db.ts`). The tab runs the sittings together, so a character played
  twice shows both of them in one timeline. It asks `lock.ts` first and shows the note instead
  where the answer is no.
- **A run's page** — `GET /runs/:id`, which carries the journal the server's replay wrote and how
  far the run had got by the end of it. Everything on that page has been through a replay that
  passed it, so nothing there is locked.
