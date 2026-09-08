import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { reportOnRun } from './run-report';

/** The runs kept for the tests, which are what the command is normally tried against. */
function fixture(file: string): string {
  return readFileSync(new URL(`../lib/play/fixtures/${file}`, import.meta.url), 'utf8');
}

describe('the verdict the verify-run command prints', () => {
  it('says a run of Dungeons of the Unforgiven is what it claims to be', async () => {
    const report = await reportOnRun(fixture('unforgiven-run.json'));

    expect(report.ok).toBe(true);
    expect(report.lines[0]).toBe('BRAWLER — Dungeons of the Unforgiven, faithful');
    expect(report.lines[1]).toBe('Verified: the replay reached everything the log claims.');
    expect(report.lines).toContain('  Actions     4 actions');
    expect(report.lines).toContain('  Clock       1 second');
    expect(report.lines).toContain('  Milestones  Module II in the town after 1 action and 0 seconds');
    expect(report.lines).toContain('  Place       the town of Module II, at 37,84');
    expect(report.lines).toContain('  Character   alive');
  });

  it("says the same of a run of Moraff's World", async () => {
    const report = await reportOnRun(fixture('moraffs-world-run.json'));

    expect(report.ok).toBe(true);
    expect(report.lines[0]).toBe("GRIMWALD — Moraff's World, faithful");
    expect(report.lines).toContain('  Clock       1 move');
    expect(report.lines).toContain('  Milestones  none');
  });

  it('says what a run that has been tampered with failed on', async () => {
    const log = JSON.parse(fixture('unforgiven-run.json'));
    const report = await reportOnRun(JSON.stringify({ ...log, actions: log.actions + 1 }));

    expect(report.ok).toBe(false);
    expect(report.lines[1]).toBe(
      `Failed: The replay spent ${log.actions} actions and the log claims ${log.actions + 1} actions.`,
    );
  });

  it('says a run the save editor wrote a record into cannot be checked', async () => {
    const log = JSON.parse(fixture('unforgiven-run.json'));
    const report = await reportOnRun(JSON.stringify({ ...log, edits: 1 }));

    expect(report.ok).toBe(false);
    expect(report.lines[1]).toContain('Unverifiable:');
  });

  it('says when the file is not a run log at all', async () => {
    const report = await reportOnRun('{ "hello": true }');

    expect(report.ok).toBe(false);
    expect(report.lines).toEqual(['This file is not a run log this build reads.']);
  });
});
