/**
 * Where two runs of pixels differ, as a line to fail a test with, or null when they do not.
 *
 * A screen is hundreds of thousands of pixels. Handing two of them to `toEqual` walks every pixel
 * building a structural diff of the whole buffer, which costs about a second a comparison; one
 * `expect` per pixel costs more again. This walks them once and says what is wrong in a line.
 *
 * The index it reports counts pixels from the top left, row by row.
 */
export function pixelDifference(left: ArrayLike<number>, right: ArrayLike<number>): string | null {
  if (left.length !== right.length) return `${left.length} pixels against ${right.length}`;
  let differing = 0;
  let first = -1;
  for (let at = 0; at < left.length; at++) {
    if (left[at] === right[at]) continue;
    differing += 1;
    if (first === -1) first = at;
  }
  if (differing === 0) return null;
  return `${differing} of ${left.length} pixels differ; the first is ${first}, ${left[first]} against ${right[first]}`;
}
