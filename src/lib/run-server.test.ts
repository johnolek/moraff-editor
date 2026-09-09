import { afterEach, describe, expect, it, vi } from 'vitest';
import { runServerUrl } from './run-server';

describe('runServerUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is nothing when the build was given no address', () => {
    vi.stubEnv('VITE_RUN_SERVER', undefined);

    expect(runServerUrl()).toBeNull();
  });

  it('is nothing when the address is blank', () => {
    vi.stubEnv('VITE_RUN_SERVER', '   ');

    expect(runServerUrl()).toBeNull();
  });

  it('is the address the build was given, without its trailing slash', () => {
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com/');

    expect(runServerUrl()).toBe('https://runs.example.com');
  });
});
