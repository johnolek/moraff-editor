/** Turning numbers and words into the strings the page shows. */

/** A share of one as a percentage to one decimal place, the way every chance on the site reads:
 *  0.4235 is `42.4%`. */
export function percent(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}

/**
 * Words as a name that is safe in a URL and in a file name on every system: lower case, with
 * every run of anything else turned into a dash and the dashes trimmed off the ends.
 *
 * Words with nothing left in them come back empty, so a caller says what an empty one is called.
 */
export function slugify(words: string): string {
  return words.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
