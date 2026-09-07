<script lang="ts">
  import type { Game } from '../game/port/state';
  import { SCREEN_COLOURS } from '../roller/screen';
  import type { PlayView } from './engine';
  import {
    ailments,
    chaseDistance,
    engagedMonster,
    magicItems,
    monstersNearby,
    spellTimers,
    squareFacts,
    SQUARE_NOTE,
    untimedSpells,
    type PanelLine,
  } from './panel';

  interface Props {
    game: Game;
    /** What the tab is drawing. A fresh one arrives after every action, and reading it is what
     *  sends the panel back to the record for the numbers below. */
    view: PlayView;
  }

  let { game, view }: Props = $props();

  /** How many of the floor's monsters the panel names by distance. */
  const NEAREST_SHOWN = 5;

  const numbers = $derived.by(() => {
    const place = view.place;
    const pc = game.pc;
    return {
      timers: spellTimers(pc),
      untimed: untimedSpells(pc),
      ailing: ailments(pc),
      items: magicItems(pc).filter((group) => group.lines.length > 0),
      engaged: engagedMonster(game),
      square: squareFacts(game, view.rows[place.y][place.x]),
      nearby: monstersNearby(game, view.monsters, NEAREST_SHOWN),
      onTheFloor: view.monsters.length,
      chase: chaseDistance(place.floor),
      seconds: Math.round(view.seconds),
    };
  });

  const percent = (chance: number) => `${(chance * 100).toFixed(1)}%`;
</script>

<!-- The game's own colours: entry 7 of its palette for a number, entry 6 for one that is
     counting down to something unpleasant, and entry 15 for a monster's name. -->
<div
  class="panel"
  style:--number={SCREEN_COLOURS[7]}
  style:--number-bad={SCREEN_COLOURS[6]}
  style:--number-name={SCREEN_COLOURS[15]}>
  {#snippet rows(lines: PanelLine[], bad = false)}
    <dl>
      {#each lines as line}
        <div class="row">
          <dt>{line.label}</dt>
          <dd class:bad>{line.value}</dd>
          {#if line.note}<p class="note">{line.note}</p>{/if}
        </div>
      {/each}
    </dl>
  {/snippet}

  {#if numbers.engaged}
    {@const engaged = numbers.engaged}
    <section>
      <h3>What you are facing</h3>
      <p class="name">{engaged.name}</p>
      {@render rows([
        { label: 'Level', value: String(engaged.level) },
        { label: 'Hit points', value: `${engaged.hp} of at most ${engaged.mostHp}` },
        { label: 'Your next swing lands', value: percent(engaged.hitChance) },
      ])}
      <p class="note">
        The chance counts out the eighty rolls a swing makes, and calls a swing that gets past the
        monster but rolls no damage a miss, the way the game does.
      </p>
    </section>
  {/if}

  <section>
    <h3>This square</h3>
    {#if numbers.square.length > 0}
      {@render rows(numbers.square)}
    {:else}
      <p class="empty">Nothing but floor.</p>
    {/if}
    <p class="note">{SQUARE_NOTE}</p>
  </section>

  <section>
    <h3>This floor</h3>
    {@render rows([{ label: 'Monsters left alive', value: String(numbers.onTheFloor) }])}
    {#if numbers.nearby.length > 0}
      <ol class="nearby">
        {#each numbers.nearby as monster}
          <li>
            <span class="near-name">{monster.name}</span>
            <span class="near-level">level {monster.level}</span>
            <span class="near-away">{monster.distance} away</span>
          </li>
        {/each}
      </ol>
    {/if}
    <p class="note">
      A monster within {numbers.chase} squares walks towards you; further off it stays where it is.
    </p>
  </section>

  {#if numbers.ailing.length > 0}
    <section>
      <h3>Poison and disease</h3>
      {@render rows(numbers.ailing, true)}
    </section>
  {/if}

  <section>
    <h3>Spells with a timer</h3>
    {#if numbers.timers.length > 0}
      {@render rows(numbers.timers)}
    {:else}
      <p class="empty">None running.</p>
    {/if}
  </section>

  {#if numbers.untimed.length > 0}
    <section>
      <h3>Spells with no timer</h3>
      {@render rows(numbers.untimed)}
    </section>
  {/if}

  <section>
    <h3>Charges you carry</h3>
    {#if numbers.items.length > 0}
      {#each numbers.items as group}
        <h4>{group.title}</h4>
        {@render rows(group.lines)}
      {/each}
    {:else}
      <p class="empty">No wand, scroll or paper with a charge on it.</p>
    {/if}
  </section>

  <section>
    <h3>Game time</h3>
    {@render rows([
      { label: 'Spent down here', value: `${numbers.seconds} second${numbers.seconds === 1 ? '' : 's'}` },
    ])}
  </section>
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  h3 {
    margin: 0;
    color: var(--accent);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  h4 {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
  }
  .name {
    margin: 0;
    font-family: var(--font-dos);
    font-size: 24px;
    line-height: 1;
    color: var(--number-name);
  }
  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 10px;
    align-items: baseline;
  }
  dt {
    font-size: 12px;
    color: var(--ink);
  }
  dd {
    margin: 0;
    font-family: var(--font-dos);
    font-size: 19px;
    line-height: 1;
    color: var(--number);
    text-align: right;
    white-space: nowrap;
  }
  dd.bad {
    color: var(--number-bad);
  }
  .note {
    grid-column: 1 / -1;
    margin: 1px 0 0;
    font-size: 11px;
    line-height: 1.4;
    color: var(--muted);
  }
  .empty {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }
  .nearby {
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nearby li {
    display: grid;
    grid-template-columns: 1fr auto auto;
    column-gap: 8px;
    align-items: baseline;
    font-size: 12px;
  }
  .near-name {
    font-family: var(--font-dos);
    font-size: 17px;
    line-height: 1.2;
    color: var(--number-name);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .near-level {
    color: var(--muted);
    font-size: 11px;
  }
  .near-away {
    font-family: var(--font-dos);
    font-size: 17px;
    line-height: 1.2;
    color: var(--number);
  }
</style>
