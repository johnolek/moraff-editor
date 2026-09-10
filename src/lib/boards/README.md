# The Boards tab

The site's pages over the run server: one game's verified runs on whichever of
the six boards is picked, a page for any run on them, and the announcements the
server has made, with each new one arriving as it happens.

None of it exists without a server. The address is fixed when the page is built
(`VITE_RUN_SERVER`, `src/lib/run-server.ts`), and a build made without one is not
offered the tab at all — `tabsFor` in `src/lib/tabs.ts` is where that is decided.
Everything else about the tab follows the game switch the way the others do.

## The shape

- **`Boards.svelte`** — the tab. The leaderboard toggle, the board picker, the
  table, and the run's own page in place of the board once a row is clicked. It
  is not kept mounted the way the other tabs are: it is a page of what the server
  has now, so opening it reads the boards again.
- **`RunPage.svelte`** — one run: who played it, what it came to, the engine
  builds it was played on, its milestones and the verdict the replay gave. The
  journal the replay wrote goes under the milestones when MORF-361 lands.
- **`Announcements.svelte`** — the panel down the side. It opens the feed first
  and asks for the history second, so that a run announced while the history is
  on its way is not missed; the two overlap for that moment and an announcement
  is shown once.
- **`server.ts`** — every call to the run server, each one a shape a page can
  draw. A call that could not be made leaves what is on screen where it is and
  says so, so an unreachable server does not empty a board.
- **`feed.ts`** — following the feed. `EventSource` retries a connection that
  drops on its own and says nothing until it has given up altogether, so a
  moment's outage is left to the browser and only an abandoned feed is opened
  again here. What the browser does is behind `FeedWiring` so that the
  reconnecting can be read and tested without one.
- **`announce.ts`** — what an announcement says. The server sends fields and no
  sentence, so this is the one place a row becomes words. Every sentence names
  the character and the player, because an announcement is read on its own among
  other people's runs.
- **`words.ts`** — every fixed word the two pages show, and the few turns of
  phrase they put the server's numbers into: how long a run was played, what the
  game's clock counts in, when something happened.

## What comes from the server

The six boards are `BOARDS` in `server/boards.ts`, imported straight from there,
so that the two halves never disagree about what a board holds or what it is
called. The row shapes come the same way. None of the server's code comes with
them: the board list is a table of names and words, and everything else is a
type, which is gone by the time anything is built.

That is the rule to keep: `server/boards.ts` is the only server module anything
here may import a value from, and it is safe because it reaches nothing but its
own table. Every other module there opens the database, the filesystem or a
port, and importing a value from one would pull Node into the site's bundle.

The words a run's own milestones read as are not here either — `milestoneLine`
in `src/lib/play/verify.ts` is what the Play tab and `verify-run` already use for
them.

## Which endpoints

`server/README.md` is the whole list. These pages use four of them:
`GET /boards/:game/:leaderboard/:board`, `GET /runs/:id`, `GET /announcements`
and `GET /feed`. None of them carries the reader's secret: everything on a board
has been verified, and a verified run is anybody's to read.
