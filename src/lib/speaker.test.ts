import { describe, expect, it } from 'vitest';
import { armSpeaker, playTones, silence, speakerIsOpen } from './speaker';

describe('the PC speaker', () => {
  it('opens nothing where there is no audio to open, so a replay stays silent', () => {
    armSpeaker();
    expect(speakerIsOpen()).toBe(false);
  });

  it('plays and stops without a speaker, since the games call it either way', () => {
    expect(() => playTones([{ hz: 440, ms: 100 }])).not.toThrow();
    expect(() => silence()).not.toThrow();
  });
});
