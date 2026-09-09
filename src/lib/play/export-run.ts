import { downloadJson } from '../download';
import { slugify } from '../ui/format';
import type { RunLog } from './run';

/**
 * A run out of the browser and into a file, which is how one is handed to anybody who wants to
 * check it. `run.ts` itself never touches the page, so the download lives here.
 */

/** What a run downloads as: the character's name as its newest session holds it, and anything
 *  that is not a letter or a digit turned into a dash so that every browser will keep the name. */
export function runFileName(log: RunLog): string {
  const name = log.sessions[log.sessions.length - 1]?.name ?? '';
  return `${slugify(name) || 'character'}-run.json`;
}

export function downloadRunLog(log: RunLog): void {
  downloadJson(log, runFileName(log));
}
