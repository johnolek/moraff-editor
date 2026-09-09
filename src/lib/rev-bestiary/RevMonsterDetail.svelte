<!-- One monster of Moraff's Revenge: its two pictures, and where on the disk it is standing. -->
<script lang="ts">
  import { untrack } from 'svelte';
  import MonsterCard from '../bestiary/MonsterCard.svelte';
  import { blockWheel } from '../editor/block-wheel';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import RevMonsterPicture from './RevMonsterPicture.svelte';
  import {
    HIT_POINTS_PER_LEVEL,
    chaseChance,
    describeKind,
    killExperience,
    monsterKind,
    monsterLevelOf,
    monsterTurnOdds,
    neverMet,
    respawnHitPoints,
    slotsOf,
    type RevDungeon,
    type RevMonster,
  } from './monsters';
  import { PALETTE_NAMES, closeUpOf, distantOf, drawnAlike } from './pictures';

  interface Props {
    entry: RevMonster;
    dungeon: RevDungeon;
    groupLabel: string;
  }

  let { entry, dungeon, groupLabel }: Props = $props();

  /** How many screen pixels a picture pixel is drawn as. */
  const CLOSE_UP_SCALE = 8;
  const DISTANT_SCALE = 8;
  /** A machine as fast as the one 1000:BF60's calibration was written for, at which the odds sit
   *  on their floor whatever the two levels are. */
  const FLOOR_ODDS = monsterTurnOdds(0, 0, 1);

  // The parent keys this card on the monster, so the controls start fresh for each one.
  let palette = $state(0);
  let level = $state(untrack(() => entry.levels[0] ?? dungeon.firstLevel));

  const closeUp = $derived(closeUpOf(dungeon, entry));
  const distant = $derived(distantOf(dungeon, entry));
  const alike = $derived(drawnAlike(dungeon, entry));
  const never = $derived(neverMet(entry));
  const here = $derived(slotsOf(entry, level));
  const deepest = $derived(here.length > 0 ? Math.max(...here.map((slot) => slot.monsterLevel)) : monsterLevelOf(level));
  const kind = $derived(monsterKind(entry.index, dungeon.number));
  const kindNotes = $derived(describeKind(kind));
  const respawn = $derived(respawnHitPoints(level));
  const slotsHere = $derived(dungeon.monsters.reduce((sum, monster) => sum + monster.count, 0));

  const percent = (value: number) => `${Math.round(value * 100)}%`;

  const numbers = $derived([
    ['Close-up picture', `${entry.closeUp} of ${dungeon.closeUps.length}`],
    ['Distant picture', `${entry.distant} of ${dungeon.distants.length}`],
    ['Slots on the disk', never ? 'none' : `${entry.count} of the ${slotsHere.toLocaleString()}`],
    ['Its own level', entry.monsterLevel ? `${entry.monsterLevel.min}–${entry.monsterLevel.max}` : '—'],
    ['Hit points', entry.hitPoints ? `${entry.hitPoints.min}–${entry.hitPoints.max}` : '—'],
    ['Kind', String(kind)],
  ]);

  const levelLine = $derived.by(() => {
    if (never) return 'Nowhere. Nothing on the disk ever comes out as this name.';
    const first = entry.levels[0];
    const last = entry.levels[entry.levels.length - 1];
    const every = entry.levels.length === last - first + 1;
    return every
      ? `Levels ${first} to ${last}, on every one of them.`
      : `Levels ${first} to ${last}, on ${entry.levels.length} of them.`;
  });
</script>

<MonsterCard
  name={entry.name}
  groupLine="{groupLabel} · name {entry.index} of {dungeon.monsters.length} in {dungeon.nameFile}"
  numbersTitle="Numbers"
  {numbers}
  effects={kindNotes}
  {art}
  {effectsNote}
  {body} />

{#snippet art()}
  <div class="pictures">
    {#if closeUp}
      <figure>
        <RevMonsterPicture picture={closeUp} {palette} label="{entry.name}, close up" scale={CLOSE_UP_SCALE} />
        <figcaption>Close up · {closeUp.width}×{closeUp.height}</figcaption>
      </figure>
    {/if}
    {#if distant}
      <figure>
        <RevMonsterPicture picture={distant} {palette} label="{entry.name}, far off" scale={DISTANT_SCALE} />
        <figcaption>Down the hall · {distant.width}×{distant.height}</figcaption>
      </figure>
    {/if}
  </div>
  <label class="palette">
    Colours
    <select value={palette} onchange={(event) => (palette = Number(event.currentTarget.value))}>
      {#each PALETTE_NAMES as name, index}
        <option value={index}>{name}</option>
      {/each}
    </select>
  </label>
{/snippet}

{#snippet effectsNote()}
  {#if alike.length > 0}
    <p class="note">Drawn with the same picture as {alike.map((other) => other.name).join(', ')}.</p>
  {/if}
{/snippet}

{#snippet body()}
  <section>
    <SectionHeading title="Where it is" />
    <p>{levelLine}</p>
    <p class="note">
      Moraff’s Revenge does not roll its monsters. <code>1.NUM</code> says where every monster on all seventy levels is
      and <code>2.NUM</code> what it has left, every character on the disk walks the same dungeon, and the game saves
      both files on the way out. So this is where they were standing on the disk the table was read from.
    </p>
  </section>

  {#if !never}
    <section>
      <SectionHeading title="On level {level}" />
      <div class="pickers">
        <label>
          Level
          <input
            type="number"
            min={entry.levels[0]}
            max={entry.levels[entry.levels.length - 1]}
            value={level}
            oninput={(event) => {
              const typed = Number(event.currentTarget.value);
              if (entry.levels.includes(typed)) level = typed;
            }}
            use:blockWheel />
        </label>
      </div>
      {#if here.length === 0}
        <p>None on this level.</p>
      {:else}
        <table>
          <thead>
            <tr><th>Slot</th><th>Row</th><th>Column</th><th>Its level</th><th>Hit points</th></tr>
          </thead>
          <tbody>
            {#each here as slot}
              <tr>
                <td>{slot.slot}</td>
                <td>{slot.row}</td>
                <td>{slot.column}</td>
                <td>{slot.monsterLevel}</td>
                <td>{slot.hitPoints}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
      <p class="note">
        A monster’s own level is the level it stands on plus one for each of 2, 4, 8 and 16 its slot number divides by,
        and meeting it cuts its hit points to {HIT_POINTS_PER_LEVEL} times that level if they are over it.
      </p>
    </section>

    <section>
      <SectionHeading title="Killing it" />
      <dl>
        <dt>Experience</dt>
        <dd>{killExperience(deepest, kind).toLocaleString()} for the deepest of these</dd>
        <dt>What comes back</dt>
        <dd>a fresh one with {respawn.min}–{respawn.max} hit points, somewhere else on the level</dd>
      </dl>
      <p class="note">
        Killing a monster never empties its slot: the slot is given new hit points for the level you are standing on
        and a new square, so a level always holds its forty and the ones you clear come back at the depth you cleared
        them at.
      </p>
    </section>

    <section>
      <SectionHeading title="How it moves" />
      <p>
        Monsters walk while you stand still: the dungeon polls the keyboard instead of waiting on it, and every pass
        rolls a one in <code>INT((165 - the last monster's level + your level) * speed / 20)</code> chance of moving
        one, never better than one in {FLOOR_ODDS}. The level in that is the last monster you met and nothing about
        this one, so every monster on the level moves as often as every other. On its turn it either comes straight at
        you or wanders off, on a roll that goes by that same level. Once it is beside you the game stops polling and
        waits for your key, so the fight is turn by turn.
      </p>
      <p class="note">
        That level is zero until you have met anybody, and killing one puts the level you are standing on there rather
        than the monster's. Speed is how many times faster your machine is than the one the game measures itself
        against at startup, so a faster machine polls proportionally more often and the monsters keep the same pace
        whatever it is running on. On that reference machine the floor is what decides it. The chase roll reads the
        same level: under 15 out of <code>INT(RND * (that level + 35))</code> wanders instead, which leaves
        {percent(chaseChance(0))} of the turns straight at you until you have met anybody.
      </p>
    </section>
  {/if}
{/snippet}

<style>
  .pictures {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  figcaption {
    font-size: 11px;
    color: var(--muted);
  }
  table {
    border-collapse: collapse;
    font-size: 13px;
    margin-top: 12px;
  }
  th,
  td {
    padding: 3px 14px 3px 0;
    text-align: right;
  }
  th {
    color: var(--muted);
    font-weight: 500;
  }
  .pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 12px 0;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--muted);
  }
  input,
  select {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
    width: 9ch;
  }
  select {
    width: auto;
  }
</style>
