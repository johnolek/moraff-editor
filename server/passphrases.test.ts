import { describe, expect, it } from 'vitest';
import {
  newPassphrase,
  newPassphraseSalt,
  passphraseHash,
  PASSPHRASE_WORDLIST,
  PASSPHRASE_WORDS,
  samePassphraseHash,
  spokenPassphrase,
} from './passphrases';

describe('the wordlist', () => {
  it('is the 1,296 words of the published list, and each is a word', () => {
    expect(PASSPHRASE_WORDLIST.length).toBe(1296);
    expect(new Set(PASSPHRASE_WORDLIST).size).toBe(1296);
    for (const word of PASSPHRASE_WORDLIST) expect(word).toMatch(/^[a-z-]{3,9}$/);
  });
});

describe('newPassphrase', () => {
  it('is six words of the list', () => {
    const words = newPassphrase().split(' ');

    expect(words.length).toBe(PASSPHRASE_WORDS);
    for (const word of words) expect(PASSPHRASE_WORDLIST).toContain(word);
  });

  it('draws again every time', () => {
    const drawn = new Set(Array.from({ length: 20 }, () => newPassphrase()));

    expect(drawn.size).toBe(20);
  });
});

describe('spokenPassphrase', () => {
  it('is the same words however they were typed', () => {
    expect(spokenPassphrase('  Acid Acorn   ACRE ')).toBe('acid acorn acre');
  });
});

describe('passphraseHash', () => {
  it('matches the same words under the same salt', async () => {
    const salt = newPassphraseSalt();
    const kept = await passphraseHash('acid acorn acre afar affix aged', salt);

    const said = await passphraseHash('  ACID Acorn  acre afar affix aged ', salt);

    expect(samePassphraseHash(kept, said)).toBe(true);
  });

  it('does not match other words, or the same words under another salt', async () => {
    const salt = newPassphraseSalt();
    const kept = await passphraseHash('acid acorn acre afar affix aged', salt);

    expect(samePassphraseHash(kept, await passphraseHash('acid acorn acre afar affix agent', salt))).toBe(false);
    expect(samePassphraseHash(kept, await passphraseHash('acid acorn acre afar affix aged', newPassphraseSalt()))).toBe(
      false,
    );
  });
});
