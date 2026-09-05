# Moraff Tools

Workflow: work-on-main

No tracker project: this repo is untracked "pure vibes" work, so commits carry no
item ID. The chunked feature loop still applies: one approved chunk per commit
series, then present the next chunk's plan and wait.

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
- The map explorer is DotU only. Moraff's World support exists only in the save
  editor.
- `public/editor.html` is the legacy editor until the port into the app lands.
- Real save files live in `~/games/4unf for claude/`; never modify them and never
  commit copies. Tests use synthetic buffers.
