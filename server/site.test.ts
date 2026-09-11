import { describe, expect, it } from 'vitest';
import { pageOf } from './site';

describe('the built page', () => {
  it('is tagged as a quoted string, which is what an entity tag is', () => {
    expect(pageOf(Buffer.from('<!doctype html>')).tag).toMatch(/^"[0-9a-f]{64}"$/);
  });

  it('gives one page the same tag every time, so a browser holding it is told so', () => {
    const html = Buffer.from('<!doctype html>');

    expect(pageOf(html).tag).toBe(pageOf(Buffer.from(html)).tag);
  });

  it('gives two pages different tags, so a deploy is not mistaken for the page before it', () => {
    expect(pageOf(Buffer.from('one')).tag).not.toBe(pageOf(Buffer.from('two')).tag);
  });
});
