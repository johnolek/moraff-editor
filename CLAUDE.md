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
```

## Layout and rules

- `dotu-tools/HANDOFF.md` is the spec. Port the reference code faithfully; never
  re-derive a formula.
- `src/lib/game/*.js` are verbatim copies of `dotu-tools/reference/`; a test diffs
  them. Edit the bundle first, then copy. Types live in the sibling `.d.ts` files.
- The map explorer, the Play tab, the save editor, the monsters, the spells and the
  character roller cover DotU and Moraff's World; Moraff's Revenge has the map
  explorer only; the calculators, the formulas, the tidbits and the snake are
  DotU's alone.
- Real game folders live in `~/games/4unf for claude/` (DotU), `~/games/mworld/`
  (Moraff's World) and `~/games/rev2/` (Moraff's Revenge); never modify them and
  never commit copies of saves or executables. Tests use synthetic buffers.
