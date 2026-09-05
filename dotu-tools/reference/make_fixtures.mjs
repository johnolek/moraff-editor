// Regenerates fixtures/: ASCII renders of sample floors and per-floor feature counts for every
// floor of every module.  node reference/make_fixtures.mjs  (run from the handoff directory)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Dungeon, render, BOTTOM_LEVEL } from './unfmap.js';
import { UNFDUNG_B64 } from '../data/unfdung.b64.js';
const D = new Dungeon(Uint8Array.from(atob(UNFDUNG_B64), c => c.charCodeAt(0)));
mkdirSync('fixtures', { recursive: true });
const samples = [[0, 0], [0, 1], [0, 5], [0, 20], [1, 0], [1, 40], [2, 65], [3, 1], [4, 0], [4, 100], [4, 105]];
let txt = '';
for (const [m, l] of samples) txt += `=== Module ${m + 1} floor ${l} ===\n` + render(D.floor(l, m)).join('\n') + '\n';
writeFileSync('fixtures/floors.txt', txt);
const summary = [];
for (let m = 0; m < 5; m++) for (let l = 0; l <= BOTTOM_LEVEL[m]; l++) {
  const rows = D.floor(l, m);
  const s = { module: m + 1, floor: l, open: 0, down: 0, up: 0, chutes: 0, trapdoors: 0, teleporterSquares: 0, doors: 0, secretDoors: 0, town: [0, 0, 0, 0] };
  const dests = {};
  for (const row of rows) for (const sq of row) {
    if (sq.solid) continue;
    s.open++;
    if (sq.ladder > 0) s.down++; else if (sq.ladder < 0) s.up++;
    if (sq.chute) s.chutes++;
    if (sq.trapdoor >= 0) { s.trapdoors++; dests[sq.trapdoor] = (dests[sq.trapdoor] || 0) + 1; }
    const v = [sq.n, sq.s, sq.w, sq.e];
    if (v.includes(4)) s.teleporterSquares++;
    s.doors += v.filter(x => x === 1).length; s.secretDoors += v.filter(x => x === 2).length;
    if (sq.town) s.town[sq.town - 1]++;
  }
  s.trapdoorDests = dests;
  if (l > 0) s.trapdoorLanding = D.trapdoorDest(l, m);
  summary.push(s);
}
writeFileSync('fixtures/floor-summary.json', JSON.stringify(summary, null, 1));
console.log('floors', summary.length, 'sample renders', samples.length);
