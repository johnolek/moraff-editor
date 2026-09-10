import { afterEach, describe, expect, it, vi } from 'vitest';
import { engineCommit } from './vite.config.ts';

/** A PATH with no git on it, which is what an image build looks like from here. */
const NO_GIT = '/nonexistent';

describe('engineCommit', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is the commit git names', () => {
    expect(engineCommit()).toMatch(/^[0-9a-f]{40}(-dirty)?$/);
  });

  it('falls back to SOURCE_COMMIT when git cannot be run', () => {
    vi.stubEnv('PATH', NO_GIT);
    vi.stubEnv('SOURCE_COMMIT', '0123456789abcdef0123456789abcdef01234567');

    expect(engineCommit()).toBe('0123456789abcdef0123456789abcdef01234567');
  });

  it('is unknown when there is neither git nor SOURCE_COMMIT', () => {
    vi.stubEnv('PATH', NO_GIT);
    vi.stubEnv('SOURCE_COMMIT', undefined);

    expect(engineCommit()).toBe('unknown');
  });

  it('is unknown when SOURCE_COMMIT is blank', () => {
    vi.stubEnv('PATH', NO_GIT);
    vi.stubEnv('SOURCE_COMMIT', '   ');

    expect(engineCommit()).toBe('unknown');
  });
});
