<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { loadedSummary, type ExploredFloors } from './explored';

  interface Props {
    /** The explored floors of every file loaded so far. */
    floors: ExploredFloors;
    /** Why the files last given could not be read, one line each. */
    errors: string[];
    onfiles: (files: File[]) => void;
    onclear: () => void;
  }

  let { floors, errors, onfiles, onclear }: Props = $props();

  let dragover = $state(false);
  let fileInput = $state<HTMLInputElement>();

  function take(files: FileList | null | undefined) {
    const chosen = [...(files ?? [])];
    if (chosen.length) onfiles(chosen);
  }

  /** Clearing the box lets the same file be chosen again after it has been cleared. */
  function onFilesChosen() {
    take(fileInput?.files);
    if (fileInput) fileInput.value = '';
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragover = false;
    take(event.dataTransfer?.files);
  }

  function clear() {
    if (fileInput) fileInput.value = '';
    onclear();
  }
</script>

<section>
  <SectionHeading title="Explored map">
    {#if floors.size}
      <button class="clear" onclick={clear}>Clear</button>
    {/if}
  </SectionHeading>
  <p class="hint">
    Moraff's World saves the squares your character has seen beside the save, in files named
    <code>&lt;slot&gt;&lt;block&gt;.DUN</code> — <code>30.DUN</code> is slot 3, floors 0 to 31.
  </p>
  <label
    class="drop-zone"
    class:dragover
    ondragenter={(event) => {
      event.preventDefault();
      dragover = true;
    }}
    ondragover={(event) => {
      event.preventDefault();
      dragover = true;
    }}
    ondragleave={(event) => {
      event.preventDefault();
      dragover = false;
    }}
    ondrop={onDrop}
  >
    <strong>Click to choose</strong> or drop .DUN files
    <input type="file" accept=".dun" multiple bind:this={fileInput} onchange={onFilesChosen} />
  </label>
  {#if floors.size}
    <p class="loaded">{loadedSummary(floors)}</p>
  {/if}
  {#each errors as error}
    <p class="error">{error}</p>
  {/each}
</section>

<style>
  .clear {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
  }
  .clear:hover {
    color: var(--ink);
  }
  .hint {
    margin: 0 0 8px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--muted);
  }
  code {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  }
  .drop-zone {
    display: block;
    background: var(--panel-2);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 14px 10px;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
  }
  .drop-zone:hover,
  .drop-zone.dragover {
    border-color: var(--accent);
    color: var(--ink);
  }
  .drop-zone strong {
    color: var(--accent);
  }
  .drop-zone input {
    display: none;
  }
  .loaded {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--ink);
  }
  .error {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--mw-red);
  }
</style>
