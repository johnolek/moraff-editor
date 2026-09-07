<script lang="ts">
  import SectionHeading from '../ui/SectionHeading.svelte';
  import type { ExploredFloors, ExploredMapFiles } from './explored';

  interface Props {
    /** What this game's explored maps are called and how they are read. */
    files: ExploredMapFiles;
    /** The explored floors of every file loaded so far. */
    floors: ExploredFloors;
    /** Why the files last given could not be read, one line each. */
    errors: string[];
    /** What is wrong with the floor being shown, when a file has seen squares it makes rock. */
    warning: string | null;
    onfiles: (files: File[]) => void;
    onclear: () => void;
  }

  let { files, floors, errors, warning, onfiles, onclear }: Props = $props();

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
  <p class="hint">{files.hint}</p>
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
    <strong>Click to choose</strong> or drop {files.extension} files
    <input type="file" accept={files.extension} multiple bind:this={fileInput} onchange={onFilesChosen} />
  </label>
  {#if floors.size}
    <p class="loaded">{files.summarize(floors)}</p>
  {/if}
  {#if warning}
    <p class="warning">{warning}</p>
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
  .warning {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--warn);
  }
  .error {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--mw-red);
  }
</style>
