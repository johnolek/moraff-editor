# Run server

One Node process that answers HTTP on a port, keeps everything in one SQLite
file, and allows the site's origin. So far it answers `GET /health`, the two
players endpoints and the two runs endpoints below; the leaderboards and the
feed are the rest of
[MORF-367](https://projects.johnoleksowicz.com/projects/MORF/items/MORF-367).

It lives in this repository so one commit is one engine build: the code that
will replay a run to check it is the same code the site played it with.

## Build and run

Node 24 or later — the server uses `node:sqlite`, which Node ships. Node prints
an `ExperimentalWarning` about SQLite on every start; that is Node, not a
problem here.

```bash
pnpm build:server   # bundles server/ into dist-server/main.mjs
pnpm build:engine   # bundles the engine into server/engines/<commit>/engine.mjs
pnpm start:server   # runs dist-server/main.mjs
```

The build is one self-contained file: the migrations are read into it, and only
Node's own modules are imported at run time. Nothing else needs to be copied to
the box.

## Configuration

Environment variables, all optional:

| Variable              | Default                      | What it is                                      |
| --------------------- | ---------------------------- | ----------------------------------------------- |
| `RUN_SERVER_PORT`     | `3580`                       | The port to answer on, behind the proxy          |
| `RUN_SERVER_DATABASE` | `./server/data/runs.sqlite`  | The SQLite file, created with its directory      |
| `RUN_SERVER_ORIGIN`   | `https://johnolek.github.io` | The site's origin, which browsers are told may read the answers |
| `RUN_SERVER_ENGINES`  | `./server/engines`           | The directory of engine builds runs are replayed with |

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
trimmed. It is that narrow because SQLite's `NOCASE` folds `A-Z` and nothing
else: a rule any wider would let two players hold names the boards cannot tell
apart.

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
| `GET /runs/:id`               | The character, how it ended, and the verdict on it. A verified run is anybody's to read; one still being played, one that failed and one that could not be checked take the secret of the player whose run it is. 404 when nothing has been played under that id. |

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

## Engine builds

A run says which commit of the engine it was played on, and a character's run
can cross several of them as the site is rebuilt. Replaying a session with
anything but its own engine shows nothing, so the server keeps a build of the
engine for every commit it has ever deployed, in `RUN_SERVER_ENGINES`, one
directory per commit:

```
engines/
  0a1b2c…/engine.mjs
  3d4e5f…/engine.mjs
```

`pnpm build:engine` writes the directory for the commit the working tree is on,
so a deploy is both builds made on a clean checkout of the commit being
deployed:

```bash
pnpm build:server
pnpm build:engine
```

Nothing is ever taken out of that directory. Deleting a build makes every run
played on it unreplayable and there is no getting its verdict back; writing the
same commit's build twice costs nothing, since it is the same build.

A tree with changes in it builds into `<commit>-dirty`, and the server replays
nothing with such a build: nobody can check that tree out again to see what it
was. So a dirty build is fine to make and try on your own machine, and a deploy
carrying one is plain to see in `/health`.

## Deploying by hand

Build on your machine and copy what it makes over. These are yours to run:

```bash
pnpm build:server
pnpm build:engine
scp dist-server/main.mjs box:/srv/moraff-run-server/main.mjs
scp -r "server/engines/$(git rev-parse HEAD)" box:/srv/moraff-run-server/engines/
ssh box 'sudo systemctl restart moraff-run-server'
```

The second copy adds this commit's engine beside the ones earlier deploys left
there, which is why the checkout has to be clean: a dirty tree has no directory
under that name to copy.

The first time, make somewhere for it to live and keep its data:

```bash
ssh box 'sudo mkdir -p /srv/moraff-run-server/engines /var/lib/moraff-run-server'
```

`/etc/systemd/system/moraff-run-server.service`:

```ini
[Unit]
Description=Moraff run server
After=network.target

[Service]
ExecStart=/usr/bin/node /srv/moraff-run-server/main.mjs
Environment=RUN_SERVER_PORT=3580
Environment=RUN_SERVER_DATABASE=/var/lib/moraff-run-server/runs.sqlite
Environment=RUN_SERVER_ENGINES=/srv/moraff-run-server/engines
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
finish the requests in hand and close the database.

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

One file, `RUN_SERVER_DATABASE`, holds every run the server has been sent and
everything computed from them. Nothing else on the box is worth keeping: the
server itself is a build of this repository, and so is every engine under
`RUN_SERVER_ENGINES` — a lost one comes back by checking its commit out and
running `pnpm build:engine`.

Copying the file while the server is running can catch it mid-write, so either
stop it first, or let SQLite take the copy — `.backup` reads the file under the
same locks the server writes it with, so it always lands on a whole database:

```bash
sqlite3 /var/lib/moraff-run-server/runs.sqlite \
  ".backup '/var/backups/moraff-runs-$(date +%F).sqlite'"
```
