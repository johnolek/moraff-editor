import { readFileSync } from 'node:fs';
import { reportOnRun } from './run-report';

/**
 * `pnpm verify-run <run.json>`: check a run somebody hands over, without a browser.
 *
 * A run downloaded from the Play tab is played through the engine again here, and the verdict is
 * printed. It exits 0 for a run that is what it claims to be, 1 for one that is not or cannot be
 * checked, and 2 when there is no file to read.
 *
 * `vite.verify.config.ts` is what builds this, and it defines `__ENGINE_COMMIT__` the way the
 * site's build does: the engine a run is checked by has to be able to name itself.
 */

const path = process.argv[2];
if (path === undefined) {
  console.error('Usage: pnpm verify-run <run.json>');
  process.exit(2);
}

let text: string;
try {
  text = readFileSync(path, 'utf8');
} catch (thrown) {
  console.error(`Could not read ${path}: ${thrown instanceof Error ? thrown.message : String(thrown)}`);
  process.exit(2);
}

const report = await reportOnRun(text);
console.log(report.lines.join('\n'));
process.exit(report.ok ? 0 : 1);
