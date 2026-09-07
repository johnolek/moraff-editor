<script lang="ts">
  import { app } from '../app-state.svelte';
  import { CLASS_NAMES, RACES } from '../game/port/character';
  import PixelText from '../ui/PixelText.svelte';
  import { newCharacterFile, slotFileName, SLOTS } from './save-file';
  import { RollerSession } from './session';

  const STATS = ['STRENGTH', 'INTELLIGENCE', 'WISDOM', 'CONSTITUTION', 'AGILITY', 'LUCK'];

  let slot = $state(20);
  let session = $state.raw<RollerSession | null>(null);
  let view = $state.raw(null as ReturnType<RollerSession['view']> | null);
  let typed = $state('');
  let note = $state('');

  function start() {
    const started = new RollerSession(slot);
    session = started;
    view = started.view();
    typed = '';
    note = '';
  }

  function answer(value: number | string) {
    if (!session) return;
    session.answer(value);
    view = session.view();
    typed = '';
  }

  function enterName() {
    if (typed.trim() !== '') answer(typed);
  }

  function restart() {
    if (!session) return;
    session.restart();
    view = session.view();
    typed = '';
    note = '';
  }

  function leave() {
    session = null;
    view = null;
    note = '';
  }

  function openInEditor() {
    if (!view) return;
    app.requestedSave = {
      name: slotFileName(slot),
      game: 'unforgiven',
      bytes: newCharacterFile(view.pc),
    };
    app.tab = 'editor';
  }

  function download() {
    if (!view) return;
    const name = slotFileName(slot);
    const url = URL.createObjectURL(new Blob([newCharacterFile(view.pc)], { type: 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    note = `Downloaded ${name}`;
  }
</script>

<div class="roller">
  <div class="page">
    {#if !session || !view}
      <h2><PixelText text="New Character" scale={2} /></h2>
      <p class="lead">
        Roll up a character the way the game does: the same questions, the same dice, the same starting kit. The finished
        character opens in the Save Editor and downloads as a character file you can drop into your game folder.
      </p>

      <section>
        <h3><PixelText text="Game" /></h3>
        <div class="row">
          <button type="button" class="picked">Dungeons of the Unforgiven</button>
          <button type="button" disabled>Moraff's World</button>
        </div>
        <p class="hint">Moraff's World is coming with MORF-71, once its roller has been decompiled.</p>
      </section>

      <section>
        <h3><PixelText text="Character Number" /></h3>
        <p class="hint">
          The game keeps ten characters, in files named 20 to 29. Pick the one you want to write over — the game picks it
          before it rolls, and so does this.
        </p>
        <div class="row">
          {#each SLOTS as number}
            <button type="button" class:picked={slot === number} onclick={() => (slot = number)}>{number}</button>
          {/each}
        </div>
      </section>

      <div class="row">
        <button type="button" class="go" onclick={start}>Roll a character</button>
      </div>
    {:else}
      <div class="toolbar">
        <span class="badge">Dungeons of the Unforgiven</span>
        <span class="badge">Character {slot}</span>
        <button type="button" class="ghost" onclick={restart}>Start again</button>
        <button type="button" class="ghost" onclick={leave}>Pick another number</button>
      </div>

      <div class="screen">
        {#each view.screen as line}
          <div class="line">{line || ' '}</div>
        {/each}
      </div>

      {#if view.question === 'difficulty'}
        <div class="choices">
          <button type="button" onclick={() => answer(0)}>1) NORMAL DIFFICULTY</button>
          <button type="button" onclick={() => answer(1)}>2) I CAN HANDLE ANYTHING DIFFICULTY</button>
        </div>
      {:else if view.question === 'race'}
        <div class="choices grid">
          {#each RACES as race, index}
            <button type="button" onclick={() => answer(index)}>{index + 1}) {race.name}</button>
          {/each}
        </div>
      {:else if view.question === 'keepRerollDesign'}
        <div class="choices">
          <button type="button" onclick={() => answer(0)}>Y) KEEP THIS CHARACTER</button>
          <button type="button" onclick={() => answer(1)}>N) ROLL A NEW CHARACTER</button>
          <button type="button" onclick={() => answer(2)}>D) DESIGN YOUR OWN CHARACTER</button>
        </div>
      {:else if view.question === 'designStat'}
        <p class="hint">CHARACTERISTIC POINTS LEFT: {view.pointsLeft}</p>
        <div class="choices grid">
          {#each STATS as stat, index}
            <button type="button" onclick={() => answer(index)}>{stat}</button>
          {/each}
        </div>
        <div class="choices">
          <button type="button" class="ghost" onclick={() => answer(6)}>ESC-CANCEL THIS CHARACTER</button>
        </div>
      {:else if view.question === 'name'}
        <div class="choices">
          <input
            type="text"
            maxlength="18"
            bind:value={typed}
            onkeydown={(event) => event.key === 'Enter' && enterName()}
            placeholder="Up to 18 letters, digits and spaces"
          />
          <button type="button" disabled={typed.trim() === ''} onclick={enterName}>Enter</button>
        </div>
      {:else if view.question === 'class'}
        <div class="choices grid">
          {#each CLASS_NAMES as name, index}
            <button type="button" onclick={() => answer(index)}>{index + 1}) {name}</button>
          {/each}
        </div>
      {/if}

      {#if view.question === null || view.question === 'keepRerollDesign' || view.question === 'designStat'}
        <section class="sheet">
          <h3><PixelText text={view.pc.name || 'The Character'} /></h3>
          <dl>
            <div><dt>RACE</dt><dd>{RACES[view.pc.race].name}</dd></div>
            <div><dt>SEX</dt><dd>{view.pc.sex === 0 ? 'MALE' : 'FEMALE'}</dd></div>
            {#each STATS as stat, index}
              <div>
                <dt>{stat}</dt>
                <dd>{[view.pc.str, view.pc.iq, view.pc.wis, view.pc.con, view.pc.dex, view.pc.luck][index]}</dd>
              </div>
            {/each}
            <div><dt>HEIGHT</dt><dd>{view.pc.height * 4} INCHES</dd></div>
            <div><dt>WEIGHT</dt><dd>{view.pc.weight} POUNDS</dd></div>
            <div><dt>AGE</dt><dd>{view.pc.age} YEARS</dd></div>
            {#if view.question === null}
              <div><dt>CLASS</dt><dd>{CLASS_NAMES[view.pc.cls]}</dd></div>
              <div><dt>HEALTH POINTS</dt><dd>{view.pc.maxHp}</dd></div>
              <div><dt>SPELL POINTS</dt><dd>{view.pc.maxSp}</dd></div>
              <div><dt>RUBLES</dt><dd>{view.pc.money}</dd></div>
              <div><dt>MAGIC CRYSTALS</dt><dd>{view.pc.crystals}</dd></div>
            {/if}
          </dl>
        </section>
      {/if}

      {#if view.question === null}
        <div class="choices">
          <button type="button" class="go" onclick={openInEditor}>Open in the Save Editor</button>
          <button type="button" onclick={download}>Download file {slotFileName(slot)}</button>
        </div>
        <p class="hint">
          Back up the file you are replacing first. Drop the download into your game folder next to UNF.EXE, keeping the
          name, and the character is waiting on the select screen.
        </p>
        {#if note}<p class="note">{note}</p>{/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  .roller {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .page {
    max-width: 880px;
    margin: 0 auto;
    padding: 24px 32px 48px;
  }
  h2 {
    margin: 0 0 12px;
    color: var(--accent);
    line-height: 0;
  }
  h3 {
    margin: 0 0 10px;
    color: var(--accent);
    line-height: 0;
  }
  .lead {
    margin: 0 0 20px;
    color: var(--muted);
    font-size: 13px;
  }
  section {
    margin-bottom: 20px;
  }
  .hint {
    margin: 8px 0;
    color: var(--muted);
    font-size: 13px;
  }
  .note {
    margin: 8px 0;
    color: var(--good);
    font-size: 13px;
  }
  .row,
  .choices {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .choices {
    margin: 14px 0;
  }
  .choices.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }
  button {
    background: var(--panel);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 8px 14px;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }
  button:disabled {
    color: var(--muted);
    cursor: not-allowed;
    opacity: 0.55;
  }
  button.picked {
    border-color: var(--accent);
    color: var(--accent);
  }
  button.go {
    background: var(--accent);
    border-color: var(--accent);
    color: #1a1822;
    font-weight: 600;
  }
  button.go:hover {
    color: #1a1822;
  }
  button.ghost {
    background: none;
  }
  input {
    background: var(--panel-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    padding: 8px 12px;
    min-width: 280px;
  }
  .toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .badge {
    background: var(--panel);
    color: var(--accent);
    border: 1px solid var(--accent-dim);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  /* The game's own screens, in the game's own typeface. */
  .screen {
    background: #000;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px 20px;
    font-family: var(--font-dos);
    font-size: 20px;
    line-height: 1.25;
    color: var(--mw-green);
    white-space: pre-wrap;
    overflow-x: auto;
  }
  .line {
    min-height: 1.25em;
  }
  .sheet {
    margin-top: 22px;
  }
  .sheet h3 {
    margin-bottom: 14px;
  }
  .sheet dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 4px 20px;
    margin: 0;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px 20px;
  }
  .sheet dl div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--line);
    padding: 4px 0;
  }
  .sheet dt {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.4px;
  }
  .sheet dd {
    margin: 0;
    color: var(--ink);
    font-family: var(--font-dos);
    font-size: 19px;
    line-height: 1;
  }
</style>
