# Run server

One Node process that answers HTTP on a port, keeps everything in Postgres, and
allows the site's origin. So far it answers `GET /health`, the two players
endpoints, the two runs endpoints, the boards and the announcements below; what
is left of
[MORF-367](https://projects.johnoleksowicz.com/projects/MORF/items/MORF-367)
is the boards of the living.

It lives in this repository so one commit is one engine build: the code that
will replay a run to check it is the same code the site played it with.

## The database

Everything is in Postgres: the players, the characters, the sittings and the
stretches of keys, the verdicts, the announcements and the engine builds
themselves. The box the server runs on keeps nothing, so the container can be
rebuilt or moved with no volume under it.

It wants a role and a database of its own, and makes everything else itself:

```sql
CREATE ROLE moraff LOGIN PASSWORD 'something';
CREATE DATABASE moraff_runs OWNER moraff;
```

The server makes a schema called `moraff` inside that database the first time it
starts and puts all its tables there, so the database may hold whatever else is
kept in it and nothing of this server's lands in `public`. Every connection is
opened with `search_path` set to that schema, which is why no query names it.

The schema is a directory of numbered files, `server/migrations/`. Each runs
once, inside a transaction, and its name goes in `schema_migrations`; a start
runs only the files the database has not seen, so a deploy needs no migration
step of its own. A file that has been applied is never edited afterwards —
a change to the schema is a new file with the next number.

## Build and run

Node 24 or later.

```bash
pnpm build:server     # bundles server/ into dist-server/main.mjs
pnpm build:engine     # bundles the engine into server/engines/<commit>/engine.mjs
pnpm publish:engine   # puts that build in the database
pnpm start:server     # runs dist-server/main.mjs
```

The build is one self-contained file: the migrations and the Postgres client are
read into it, and only Node's own modules are imported at run time. Nothing else
needs to be copied to the box.

## Configuration

| Variable            | Default                      | What it is                                      |
| ------------------- | ---------------------------- | ----------------------------------------------- |
| `DATABASE_URL`      | none, and it must be set     | The Postgres to keep everything in, e.g. `postgres://moraff:something@127.0.0.1:5432/moraff_runs` |
| `RUN_SERVER_PORT`   | `3580`                       | The port to answer on, behind the proxy          |
| `RUN_SERVER_ORIGIN` | `https://johnolek.github.io` | The site's origin, which browsers are told may read the answers |

There is no default for `DATABASE_URL`: a server with nowhere to keep anything
says so and stops, rather than starting and connecting to whatever is nearest.

A page served from `http://localhost` on any port is allowed as well, so
`pnpm dev` can talk to a server running on the same machine.

Checking it is up:

```bash
curl http://127.0.0.1:3580/health
# {"ok":true,"engineCommit":"<the commit it was built from>","engines":["<and the ones it keeps>"]}
```

`engineCommit` is how you tell which build is deployed, and `engines` is every
commit it can replay a run played on: a run can only be replayed by the engine
that played it, so the server has to be able to name what it is carrying. A
commit ending in `-dirty` was built from a working tree with changes in it and
nobody can check that build out again.

## Players

Nobody signs up. The site makes each browser a random 32-byte secret, written
base64url, and sends it as `Authorization: Bearer <secret>`; the server keeps
only its SHA-256, so it can recognise a secret it is handed and cannot hand one
out. Names go first come and are compared without regard to case.

| Endpoint          | What it does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `POST /players`   | `{ "name": "..." }` claims the name for that secret, or renames it. 200 with the name that stands, 409 when another player holds it, 400 when the name or the secret is not one. |
| `GET /players/me` | 200 with `{ "name": "..." }`, or 404 when that secret has claimed no name. |

A name is 2 to 24 characters of ASCII letters, digits, spaces and `. _ - '`,
trimmed, which rules out every control character and everything a page would
have to escape to show. Two names that differ only in case are one name: the
unique index is on `lower(name)` and every lookup folds the same way.

Losing the browser's storage loses the secret, and nothing here gets it back.

## Runs

A run arrives while it is being played rather than whole at the end. The site
sends what has been played every five seconds and when the game is left, and
the server stamps each stretch as it lands. That is the whole reason for the
shape: the page a run is played in is the player's own, so it cannot be asked
how long the run took, and the stamps are an answer the server owns.

| Endpoint                      | What it does                                                     |
| ----------------------------- | ---------------------------------------------------------------- |
| `POST /runs/:id/batches`      | Takes one stretch of a run. 200 with `{ "received": <sequence> }`, 403 when the device has claimed no name, 409 when the character belongs to another player or a sequence comes back holding another stretch, 400 when the body is not a batch or names a sitting the server was never told about. |
| `GET /runs/:id`               | The character, who played it, the sittings it was played in with the engine build each names, how it ended, and the verdict on it with the milestones the replay reached. A verified run is anybody's to read; one still being played, one that failed and one that could not be checked take the secret of the player whose run it is. 404 when nothing has been played under that id. |

`:id` is the id of a roster entry in somebody's browser. The character is made
known by its first batch and belongs to the player whose secret sent it, so
nothing is registered anywhere and no second player can send for it.

A batch is the keys played since the last one, how many of them the player
pressed, and what the sitting claims to have come to; the first batch of a
sitting carries the seed, the engine commit and the record a replay starts
from. The sequence is the site's count of the batches of that sitting, and the
server keeps one stretch under each sequence. A batch whose answer was lost is
sent again under the same number holding the same keys, and is recognised
rather than played twice; everything played while it was in the air goes in the
batch after it rather than being folded into it, since the server would take
the sequence it already holds and the difference would be gone. A sequence that
comes back holding another stretch is refused, and nothing about the run
changes.

### Play time

The run's wall clock is the sum of the gaps between the batches of one sitting,
counting a gap only when it is no longer than **three times the sending
interval**, which is 15 seconds. Anything longer is time the player had left the
game and counts for nothing, which is what makes a speedrun of a character that
takes twenty hours possible at all. The first batch of a sitting has no batch
before it, so the stretch of play in front of it — at most one interval, and
everything played before the server was ever told about the character — counts
for nothing either.

A stretch carrying more keys than anybody could have pressed in the time it
covers — more than **20 a second**, over its gap and a second's grace — takes
the run off the wall-clock board and leaves everything else about it alone: it
keeps its actions, its milestones and its verdict. The grace is there because
the last batch of a run goes the moment the character dies, right behind the one
before it.

Only presses are counted, not inputs: a held Ctrl-F swings on its own and
Moraff's Revenge's clock ticks are inputs of the log too, and nobody pressed
either of those.

### The verdict

The batch that ends a run — a death or a win — is answered at once and the run
goes in a line to be replayed behind it, because replaying a long run takes
seconds. The site asks `GET /runs/:id` until the verdict is there.

Each sitting is replayed by the engine build it names, and the server walks the
chain between them, carrying what the run had come to and the record the
sitting before it ended with from one build to the next. So a run played across
several commits is checked by the engines that really played it. A build
deployed before it could replay a single sitting can only be handed a whole
chain: where the chain names one of those, all of it goes through the build of
its newest sitting in one piece, and the verdict's notes say which of the two
happened. A run any sitting of which names an engine not kept
here is unverifiable rather than failed. `eligible` is whether the run may go on
a board at all: verified, and with no record ever written into the character
from outside the game.

## The boards

| Endpoint                               | What it does                                      |
| -------------------------------------- | ------------------------------------------------- |
| `GET /boards/:game/:leaderboard/:board` | One page of one board, fifty runs to a page. `?page=` for the ones after the first, counting from one. 404 when the three parts do not name a board there is, 400 when `page` is not a page number. |

`:game` is `unforgiven`, `moraffsWorld` or `revenge`; `:leaderboard` is
`faithful` or `speedrun`. A path that names anything else is a 404 rather than
an empty board, since a board with nothing on it means nobody has played it yet
and that is a different answer.

`:board` is one of six, and `server/boards.ts` is where the rules about them
live, so that the site can name them the same way when it draws them:

| Board     | What stands on it                                   |
| --------- | --------------------------------------------------- |
| `actions` | Wins, fewest actions first                          |
| `clock`   | Wins, least on the game's own clock first           |
| `wall`    | Wins, least time played first                       |
| `deepest` | Every run, furthest first, then fewest actions      |
| `level`   | Every run, highest level first, then fewest actions |
| `deaths`  | Deaths, newest first                                |

Faithful and speedrun are never mixed: they are different games to play, so
runs of one say nothing about runs of the other. A run's board is the one its
character was rolled for and locked to for life, and a character rolled for no
board is on none of them. Only a run that came out verified with no record
written into it from outside the game is on a board at all, which is what
`eligible` on its verdict says.

Every board's rows are the same shape — the player's name and the character's,
the actions, the game's clock, the play time and whether it may be believed,
how far the run got, the highest level it reached, how it ended and when — and
the board says which of those it was put in order of. Two runs with the same
number stand in the order they were played.

`wall` holds only a run the server watched: one played with the server
unreachable and sent afterwards comes to no play time at all, and would
otherwise top a board of the fastest wins with a run nobody timed.

How far a run got is not the same number in all three games. Moraff's Revenge
has one dungeon and seventy floors of it, so a run of it is measured by the
floor the character stood on; the other two are measured by the module or the
dungeon reached, and a run that never left the one it started in stands at 0,
which is Module I and the town. The highest level is the highest a run levelled
to, and a character that never gained a level stands at 0: what it was rolled
at is no part of the run.

## The announcements

When a run comes out verified and may go on a board, the server announces it:
one row for how it ended, and one for every milestone of the character's whole
run that has not been announced for it before — a boss beaten, a module or a
dungeon reached, a level, a floor of Moraff's Revenge. A chain carries every
milestone the character has ever reached, so a second run of the same character
repeats most of them and only what is new is said. Nothing is announced about a
run that could not be checked or that had a record written into it from outside
the game: that is the player's own business and not news.

| Endpoint                             | What it does                                      |
| ------------------------------------ | ------------------------------------------------- |
| `GET /feed`                          | Server-sent events. Nothing on connecting; one `data:` line per announcement from then on. |
| `GET /announcements?before=&limit=`  | The announcements already made, newest first. `before` is the oldest id the reader already has and `limit` is 1 to 50, fifty by default. 400 when either is not a number. |

The history is paged by id rather than by a page number, because announcements
are made while somebody is reading and a page number would show one twice or
skip one as they arrive. `more` says whether there is anything behind the page.

A row carries fields and no sentence: `kind` (`win`, `death`, `boss`,
`dungeon`, `level` or `floor`), `which` — which boss, level, module or floor —
the game and the board, the player's name and the character's, the actions, the
game's clock, where the character stood and what it had reached, and the run's
play time. How an announcement reads is the site's, in
`src/lib/boards/announce.ts`, so that changing the words is a change to the site
and not to what is already stored here.

A page is left open for hours, which is longer than anything in between will
hold a silent connection for, so a comment goes down every feed every 25
seconds. The answer also carries `X-Accel-Buffering: no`, which is nginx's word
for passing it straight on rather than holding each announcement until the next
one fills a buffer.

## Engine builds

A run says which commit of the engine it was played on, and a character's run
can cross several of them as the site is rebuilt. Replaying a session with
anything but its own engine shows nothing, so the server keeps a build of the
engine for every commit it has ever deployed, one row of the `engines` table per
commit: the commit, when it was built, and the bundle itself.

`pnpm build:engine` writes `server/engines/<commit>/engine.mjs` for the commit
the working tree is on, and `pnpm publish:engine` puts that file in the
database:

```bash
pnpm build:engine
DATABASE_URL=postgres://… pnpm publish:engine
```

The deployed server does that for its own commit every time it starts, so a
container carrying `server/engines/<its commit>/engine.mjs` needs no separate
step: it finds the file beside itself, `dist-server/main.mjs` and
`server/engines/` both being under the repository's root, and publishes it if
the table has not got it.

A build is loaded by importing it as a `data:` URL, which is how a module comes
out of the database and into the process without ever being written to the
container's disk. It is held in memory from then on, since every run of that
commit is replayed by it.

Nothing is ever taken out of the table. Deleting a build makes every run played
on it unreplayable and there is no getting its verdict back; publishing the same
commit's build twice does nothing at all, since it is the same build and the
row that is there stands.

A tree with changes in it builds into `<commit>-dirty`. Such a build is refused
by `publish:engine` and the server replays nothing with one: nobody can check
that tree out again to see what it was. So a dirty build is fine to make and try
on your own machine, and never reaches the database.

## Deploying by hand

Build on your machine and copy what it makes over. The box keeps the two
directories this repository has them in, because the server looks for an engine
build at `../server/engines/<commit>/engine.mjs` beside itself. These are yours
to run:

```bash
pnpm build:server
pnpm build:engine
scp dist-server/main.mjs box:/srv/moraff-run-server/dist-server/main.mjs
scp -r "server/engines/$(git rev-parse HEAD)" box:/srv/moraff-run-server/server/engines/
ssh box 'sudo systemctl restart moraff-run-server'
```

The second copy puts this commit's engine where the restarted server will find
it, and the server publishes it to the database as it starts. That is why the
checkout has to be clean: a dirty tree has no directory under a commit's name to
copy, and a dirty build would be refused anyway.

The first time, make somewhere for it to live:

```bash
ssh box 'sudo mkdir -p /srv/moraff-run-server/dist-server /srv/moraff-run-server/server/engines'
```

`/etc/systemd/system/moraff-run-server.service`:

```ini
[Unit]
Description=Moraff run server
After=network.target

[Service]
ExecStart=/usr/bin/node /srv/moraff-run-server/dist-server/main.mjs
Environment=RUN_SERVER_PORT=3580
Environment=DATABASE_URL=postgres://moraff:something@127.0.0.1:5432/moraff_runs
Environment=RUN_SERVER_ORIGIN=https://johnolek.github.io
User=moraff
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Then `sudo systemctl daemon-reload && sudo systemctl enable --now
moraff-run-server`, and `journalctl -u moraff-run-server -n 50` for what it
said. `systemctl stop` sends SIGTERM, which is what the server waits for to
finish the requests in hand and let go of the database.

The proxy terminates HTTPS and the server never sees a certificate. An nginx
server block:

```nginx
server {
    listen 443 ssl;
    server_name runs.example.com;

    ssl_certificate     /etc/letsencrypt/live/runs.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/runs.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3580;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Whatever address that ends up being is what the site's build is given:
`VITE_RUN_SERVER=https://runs.example.com pnpm build`. A build without it has
no server and the site behaves as it does today.

## Backups

The Postgres backup is the backup. Everything the server has ever been sent and
everything computed from it — including the engine builds runs are replayed
with — is in the `moraff` schema of `DATABASE_URL`, and nothing at all is
written to the box it runs on.

```bash
pg_dump --schema=moraff moraff_runs > "moraff-runs-$(date +%F).sql"
```

A lost engine build is the one thing that comes back without a backup: check its
commit out and run `pnpm build:engine` and `pnpm publish:engine`. Everything else
is gone if the database is.
