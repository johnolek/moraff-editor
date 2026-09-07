<script lang="ts">
  import { tick } from 'svelte';
  import { app } from '../app-state.svelte';
  import { decompSection, sectionsByName, type DecompSection } from './decomp';
  import { portCode, portFiles, portFunction, portsOfC, type PortFunction, type SourceFile } from './ports';

  /** What the main pane is showing: a declaration of the port, or a decompiled function. */
  type Selection = { kind: 'ts'; file: SourceFile; name: string } | { kind: 'c'; name: string };

  const DECOMPILED = sectionsByName();

  let search = $state('');
  let selected = $state<Selection>({ kind: 'ts', file: 'src/lib/game/port/magic.ts', name: 'spellEffect' });
  let expanded = $state<Record<string, boolean>>({ 'src/lib/game/port/magic.ts': true });
  let list: HTMLDivElement;

  const query = $derived(search.trim().toLowerCase());

  const files = $derived(
    portFiles().map((entry) => ({
      ...entry,
      functions: entry.functions.filter(
        (fn) => !query || fn.name.toLowerCase().includes(query) || entry.file.toLowerCase().includes(query),
      ),
    })).filter((entry) => entry.functions.length > 0),
  );

  const sections = $derived(
    DECOMPILED.filter(
      (section) =>
        !query || section.name.toLowerCase().includes(query) || (section.description ?? '').toLowerCase().includes(query),
    ),
  );

  /** The port function on show, with the decompiled function its comment cites. */
  const ported = $derived<PortFunction | null>(
    selected.kind === 'ts' ? portFunction(selected.file, selected.name) : null,
  );
  const portedCode = $derived(selected.kind === 'ts' ? portCode(selected.file, selected.name) : null);

  const section = $derived<DecompSection | null>(selected.kind === 'c' ? decompSection(selected.name) : null);

  // spell_effect alone is ported as forty-two functions, so the file is named once for all of
  // the functions that came out of it rather than after each one.
  const portedFrom = $derived.by(() => {
    const byFile = new Map<SourceFile, PortFunction[]>();
    for (const fn of section ? portsOfC(section.name) : []) {
      const already = byFile.get(fn.file);
      if (already) already.push(fn);
      else byFile.set(fn.file, [fn]);
    }
    return [...byFile].map(([file, functions]) => ({ file, functions }));
  });

  /** A search hides every file but the ones it matched, so those open whether or not they were. */
  const isOpen = (file: SourceFile) => query !== '' || expanded[file] === true;

  const isSelected = (candidate: Selection) =>
    selected.kind === candidate.kind &&
    selected.name === candidate.name &&
    (selected.kind !== 'ts' || candidate.kind !== 'ts' || selected.file === candidate.file);

  function toggle(file: SourceFile): void {
    expanded[file] = !isOpen(file);
  }

  function showPort(fn: PortFunction): void {
    selected = { kind: 'ts', file: fn.file, name: fn.name };
  }

  function showDecompiled(name: string): void {
    if (decompSection(name)) selected = { kind: 'c', name };
  }

  /** Brings whatever is selected into view, for a jump that came from another tab. */
  function revealSelected(): void {
    tick().then(() => list.querySelector('button.selected')?.scrollIntoView({ block: 'center' }));
  }

  // Another tab can ask for a function; the search box is cleared and the file opened so the
  // list is sure to show it.
  $effect(() => {
    const request = app.requestedSource;
    if (!request) return;
    app.requestedSource = null;
    search = '';
    if (request.kind === 'ts') {
      const fn = portFunction(request.file as SourceFile, request.name);
      if (!fn) return;
      selected = { kind: 'ts', file: fn.file, name: fn.name };
      expanded[fn.file] = true;
    } else {
      if (!decompSection(request.name)) return;
      selected = { kind: 'c', name: request.name };
    }
    revealSelected();
  });
</script>

<div class="viewer">
  <div class="index">
    <input type="search" placeholder="Search functions" bind:value={search} />
    <div class="scroll" bind:this={list}>
      <h3>TypeScript port</h3>
      {#each files as entry}
        <button type="button" class="file" aria-expanded={isOpen(entry.file)} onclick={() => toggle(entry.file)}>
          <span class="arrow">{isOpen(entry.file) ? '▾' : '▸'}</span>{entry.file}
        </button>
        {#if isOpen(entry.file)}
          <ul>
            {#each entry.functions as fn}
              <li>
                <button
                  type="button"
                  class="entry"
                  class:selected={isSelected({ kind: 'ts', file: fn.file, name: fn.name })}
                  onclick={() => showPort(fn)}>{fn.name}</button
                >
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
      {#if files.length === 0}
        <p class="empty">No functions match.</p>
      {/if}

      <h3>Decompiled C</h3>
      <ul>
        {#each sections as entry}
          <li>
            <button
              type="button"
              class="entry"
              class:selected={isSelected({ kind: 'c', name: entry.name })}
              onclick={() => showDecompiled(entry.name)}>{entry.name}</button
            >
          </li>
        {/each}
      </ul>
      {#if sections.length === 0}
        <p class="empty">No functions match.</p>
      {/if}
    </div>
  </div>

  <div class="pane">
    {#if selected.kind === 'ts'}
      <h2>{selected.name}</h2>
      <p class="where">{selected.file}</p>
      {#if ported?.c}
        <p class="where">
          Decompiled:
          <button type="button" class="link" onclick={() => showDecompiled(ported.c!.name)}
            >{ported.c.name} ({ported.c.address})</button
          >
        </p>
      {/if}
      <pre>{portedCode}</pre>
    {:else if section}
      <h2>{section.name}</h2>
      <dl>
        <dt>Address</dt>
        <dd>{section.address}</dd>
        <dt>Size</dt>
        <dd>{section.size.toLocaleString()} bytes of machine code</dd>
        {#if section.description}
          <dt>What it does</dt>
          <dd>{section.description}</dd>
        {/if}
        {#if portedFrom.length > 0}
          <dt>Ported as</dt>
          <dd>
            {#each portedFrom as group}
              <p class="ported">
                {#each group.functions as fn, index}{index > 0 ? ', ' : ''}<button
                    type="button"
                    class="link"
                    onclick={() => showPort(fn)}>{fn.name}</button
                  >{/each} in {group.file}
              </p>
            {/each}
          </dd>
        {/if}
        {#if section.callers.length > 0}
          <dt>Called by</dt>
          <dd>
            {#each section.callers as caller, index}{index > 0 ? ', ' : ''}{#if decompSection(caller)}<button
                  type="button"
                  class="link"
                  onclick={() => showDecompiled(caller)}>{caller}</button
                >{:else}{caller}{/if}{/each}
          </dd>
        {/if}
      </dl>
      <pre>{section.body}</pre>
    {/if}
  </div>
</div>

<style>
  .viewer {
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
  h3 {
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
  h3:first-child {
    margin-top: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .file,
  .entry {
    display: block;
    width: 100%;
    padding: 4px 6px;
    border: none;
    border-radius: 4px;
    background: none;
    font: inherit;
    font-size: 12px;
    text-align: left;
    overflow-wrap: anywhere;
    color: var(--muted);
    cursor: pointer;
  }
  .entry {
    padding-left: 20px;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  }
  .arrow {
    display: inline-block;
    width: 12px;
    color: var(--accent-dim);
  }
  .file:hover,
  .entry:hover {
    color: var(--ink);
    background: var(--panel-2);
  }
  .entry.selected {
    color: var(--ink);
    background: var(--panel-2);
  }
  .pane {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 24px 40px;
  }
  .pane h2 {
    margin: 0 0 6px;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 20px;
    color: var(--accent);
    overflow-wrap: anywhere;
  }
  .where {
    margin: 0 0 4px;
    font-size: 13px;
    color: var(--muted);
    overflow-wrap: anywhere;
  }
  dl {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 4px 12px;
    margin: 0 0 4px;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .ported {
    margin: 0 0 4px;
  }
  .link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--mw-cyan);
    cursor: pointer;
  }
  .link:hover {
    text-decoration: underline;
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
</style>
