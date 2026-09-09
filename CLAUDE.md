# Moraff Tools

Workflow: work-on-main

Tracker project: MORF (https://projects.johnoleksowicz.com/projects/MORF). Item
work is prefixed `MORF-n:` with the item URL at the bottom of the commit message;
the chunked feature loop applies: one approved chunk per commit series, then
present the next chunk's plan and wait.

## Deploy map

- Push to `main` → GitHub Actions runs the tests, builds `dist/`, and deploys it to
  GitHub Pages at
  https://johnolek.github.io/moraffs-world-and-dungeons-of-the-unforgiven-save-editor/
- No other branch deploys. Never push without being asked.

## Commands

```bash
pnpm test     # vitest
pnpm check    # svelte-check
pnpm build    # single-file dist/index.html
pnpm dev

pnpm build:server  # dist-server/main.mjs, the run server
pnpm start:server  # run it
```

## Layout and rules

- `dotu-tools/HANDOFF.md` is the spec. Port the reference code faithfully; never
  re-derive a formula.
- `src/lib/game/*.js` are verbatim copies of `dotu-tools/reference/`; a test diffs
  them. Edit the bundle first, then copy. Types live in the sibling `.d.ts` files.
- The map explorer, the Play tab, the save editor, the monsters and the character
  roller cover all three games; the spells cover DotU and Moraff's World; the fight simulator,
  the calculators, the formulas and the snake are DotU's alone.
- The Tidbits tab follows the game switch: a game has one when
  `src/lib/tidbits/files.ts` names a file for it and `src/lib/tabs.ts` lists the
  tab for it.
- `server/` is the run server, one Node process on `node:http` and `node:sqlite`
  built by `vite.server.config.ts`; its tests run under the same `pnpm test` and
  `server/README.md` is how it is deployed.
- Real game folders live in `~/games/4unf for claude/` (DotU), `~/games/mworld/`
  (Moraff's World) and `~/games/rev2/` (Moraff's Revenge); never modify them and
  never commit copies of saves or executables. Tests use synthetic buffers.
