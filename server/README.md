# Run server

One Node process that answers HTTP on a port, keeps everything in one SQLite
file, and allows the site's origin. So far it answers `GET /health` and the two
players endpoints below; the runs, the leaderboards and the feed are the rest
of [MORF-367](https://projects.johnoleksowicz.com/projects/MORF/items/MORF-367).

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
