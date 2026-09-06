<script lang="ts">
  import PixelText from '../ui/PixelText.svelte';
  import { formulaCode, searchFormulas } from './formulas';

  let search = $state('');

  const topics = $derived(searchFormulas(search));

  const anchor = (id: string) => `formula-${id}`;

  function jumpTo(id: string): void {
    document.getElementById(anchor(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<div class="formulas">
  <div class="index">
    <input type="search" placeholder="Search formulas" bind:value={search} />
    <nav class="scroll">
      {#each topics as topic}
        <h3>{topic.title}</h3>
        <ul>
          {#each topic.formulas as formula}
            <li><button type="button" onclick={() => jumpTo(formula.id)}>{formula.title}</button></li>
          {/each}
        </ul>
      {/each}
      {#if topics.length === 0}
        <p class="empty">No formulas match.</p>
      {/if}
    </nav>
  </div>
  <div class="entries">
    {#each topics as topic}
      <section>
        <h2><PixelText text={topic.title} scale={2} /></h2>
        {#each topic.formulas as formula}
          {@const code = formulaCode(formula)}
          <article id={anchor(formula.id)}>
            <h3><PixelText text={formula.title} /></h3>
            <p class="explanation">{formula.explanation}</p>
            <dl>
              <dt>Inputs</dt>
              <dd>{formula.inputs}</dd>
              <dt>Where it comes from</dt>
              <dd>{formula.origin}</dd>
            </dl>
            {#if code}
              <pre>{code}</pre>
            {/if}
          </article>
        {/each}
      </section>
    {/each}
    {#if topics.length === 0}
      <p class="empty">No formulas match.</p>
    {/if}
  </div>
</div>

<style>
  .formulas {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .index {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-right: 1px solid var(--line);
    background: var(--panel);
  }
  input {
    background: var(--panel-2);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 9px;
    font: inherit;
    font-size: 13px;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  nav h3 {
    position: sticky;
    top: 0;
    margin: 12px 0 2px;
    padding: 4px 0;
    background: var(--panel);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }
  nav h3:first-child {
    margin-top: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li button {
    display: block;
    width: 100%;
    padding: 4px 6px;
    border: none;
    border-radius: 4px;
    background: none;
    font: inherit;
    font-size: 13px;
    text-align: left;
    color: var(--muted);
    cursor: pointer;
  }
  li button:hover {
    color: var(--ink);
    background: var(--panel-2);
  }
  .entries {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 24px 40px;
  }
  section {
    margin-bottom: 28px;
  }
  .entries h2 {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0 0 14px;
    padding: 8px 0;
    background: var(--bg);
    line-height: 0;
    color: var(--accent);
    border-bottom: 1px solid var(--line);
  }
  article h3 {
    margin: 0 0 8px;
    line-height: 0;
    color: var(--accent-dim);
  }
  article {
    max-width: 92ch;
    margin-bottom: 16px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 6px;
    scroll-margin-top: 44px;
  }
  .explanation {
    margin: 0 0 10px;
    font-size: 14px;
  }
  dl {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 4px 12px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  pre {
    margin: 12px 0 0;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 5px;
    background: var(--panel);
    overflow-x: auto;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.5;
    color: var(--mw-cyan);
  }
  .empty {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
