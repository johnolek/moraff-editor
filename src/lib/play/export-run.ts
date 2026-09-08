import type { RunLog } from './run';

/**
 * A run out of the browser and into a file, which is how one is handed to anybody who wants to
 * check it. `run.ts` itself never touches the page, so the download lives here.
 */

/** What a run downloads as: the character's name, and anything that is not a letter or a digit
 *  turned into a dash so that every browser will keep the name. */
export function runFileName(log: RunLog): string {
  const name = log.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${name || 'character'}-run.json`;
}

export function downloadRunLog(log: RunLog): void {
  const url = URL.createObjectURL(new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = runFileName(log);
  link.click();
  URL.revokeObjectURL(url);
}
