import { afterEach, describe, expect, it, vi } from 'vitest';
import { openSignInAttempts } from './attempts';

const HERE = '203.0.113.7';
const ELSEWHERE = '203.0.113.8';

function failTimes(attempts: ReturnType<typeof openSignInAttempts>, times: number, name: string, from: string): void {
  for (let failure = 0; failure < times; failure += 1) attempts.failed(name, from);
}

describe('openSignInAttempts', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('turns a name away after five failures, however many machines they came from', () => {
    const attempts = openSignInAttempts();

    failTimes(attempts, 3, 'Wanderer', HERE);
    failTimes(attempts, 2, 'Wanderer', ELSEWHERE);

    expect(attempts.tooMany('wanderer', '203.0.113.9')).toBe(true);
  });

  it('turns an address away after five failures, however many names they were at', () => {
    const attempts = openSignInAttempts();

    for (const name of ['One', 'Two', 'Three', 'Four', 'Five']) attempts.failed(name, HERE);

    expect(attempts.tooMany('Six', HERE)).toBe(true);
    expect(attempts.tooMany('Six', ELSEWHERE)).toBe(false);
  });

  it('forgets a failure a quarter of an hour later', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-09T12:00:00Z'));
    const attempts = openSignInAttempts();
    failTimes(attempts, 5, 'Wanderer', HERE);

    vi.setSystemTime(new Date('2026-09-09T12:14:00Z'));
    expect(attempts.tooMany('Wanderer', HERE)).toBe(true);

    vi.setSystemTime(new Date('2026-09-09T12:16:00Z'));
    expect(attempts.tooMany('Wanderer', HERE)).toBe(false);
  });
});
