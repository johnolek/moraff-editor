import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * That the map under the heads-up display knows how much of its foot the bar of stone hides.
 *
 * Without it the map only moves once the character has stepped off the canvas, and they walk
 * behind the bar on the way there. The two tabs with such a display have no props to render them
 * with — each plays whichever character is on the roster — so what is checked here is the markup.
 */

const TABS = [
  { game: 'Dungeons of the Unforgiven', file: 'src/lib/play/Play.svelte' },
  { game: "Moraff's World", file: 'src/lib/play/mw/MwPlay.svelte' },
];

describe('the map under the bar the orbs stand in', () => {
  for (const tab of TABS) {
    it(`is told how deep the bar is on the ${tab.game} tab`, () => {
      const source = readFileSync(tab.file, 'utf8');

      expect(source).toContain('bind:barHeight={hudBarHeight}');
      expect(source).toContain('coveredBottom={hudBarHeight}');
    });
  }
});
