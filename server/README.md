# Run server

One Node process that answers HTTP on a port, keeps everything in one SQLite
file, and allows the site's origin. Right now all it has is `GET /health`; the
runs, the leaderboards and the feed are the rest of
[MORF-367](https://projects.johnoleksowicz.com/projects/MORF/items/MORF-367).

It lives in this repository so one commit is one engine build: the code that
will replay a run to check it is the same code the site played it with.

## Build and run

Node 24 or later — the server uses `node:sqlite`, which Node ships. Node prints
an `ExperimentalWarning` about SQLite on every start; that is Node, not a
problem here.

```bash
pnpm build:server   # bundles server/ into dist-server/main.mjs
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

A page served from `http://localhost` on any port is allowed as well, so
`pnpm dev` can talk to a server running on the same machine.

Checking it is up:

```bash
curl http://127.0.0.1:3580/health
# {"ok":true,"engineCommit":"<the commit it was built from>"}
```

`engineCommit` is how you tell which build is deployed: a run can only be
replayed by the engine that played it, so the server has to be able to name
the one it is carrying. A commit ending in `-dirty` was built from a working
tree with changes in it and nobody can check that build out again.

## Deploying by hand

Build on your machine and copy the one file over. These are yours to run:

```bash
pnpm build:server
scp dist-server/main.mjs box:/srv/moraff-run-server/main.mjs
ssh box 'sudo systemctl restart moraff-run-server'
```

The first time, make somewhere for it to live and keep its data:

```bash
ssh box 'sudo mkdir -p /srv/moraff-run-server /var/lib/moraff-run-server'
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
server itself is a build of this repository.

Copying the file while the server is running can catch it mid-write, so either
stop it first, or let SQLite take the copy — `.backup` reads the file under the
same locks the server writes it with, so it always lands on a whole database:

```bash
sqlite3 /var/lib/moraff-run-server/runs.sqlite \
  ".backup '/var/backups/moraff-runs-$(date +%F).sqlite'"
```
