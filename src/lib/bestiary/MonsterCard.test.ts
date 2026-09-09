import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import MonsterCard from './MonsterCard.svelte';

const nothing = createRawSnippet(() => ({ render: () => '<div></div>' }));

describe('MonsterCard', () => {
  it('draws a row of the numbers table for each pair it is given', () => {
    const { body } = render(MonsterCard, {
      props: {
        name: 'OGRE',
        groupLine: 'First seen on floors 1–9',
        numbersTitle: 'Numbers',
        numbers: [
          ['Defense', '12'],
          ['Damage die', '6'],
        ],
        effects: ['Drains 1 level when it hits you'],
        art: nothing,
        body: nothing,
      },
    });

    expect(body).toContain('<dt>Defense</dt>');
    expect(body).toContain('<dd>12</dd>');
    expect(body).toContain('<dt>Damage die</dt>');
    expect(body).toContain('<dd>6</dd>');
    expect(body).toContain('<li>Drains 1 level when it hits you</li>');
  });

  it('leaves the effects list out when there are none', () => {
    const { body } = render(MonsterCard, {
      props: {
        name: 'GARBAGE CAN',
        groupLine: 'Blockers',
        numbersTitle: 'Stats',
        numbers: [['Defense', '3']],
        art: nothing,
        body: nothing,
      },
    });

    expect(body).not.toContain('class="effects"');
  });
});
