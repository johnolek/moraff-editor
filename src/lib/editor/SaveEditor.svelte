<script lang="ts">
  import './editor.css';
  import { app } from '../app-state.svelte';
  import { GAMES, pickGameByFileSize } from './games';
  import type { GameSchema } from './schema';
  import SectionView from './SectionView.svelte';

  interface Document {
    name: string;
    game: GameSchema;
    bytes: Uint8Array<ArrayBuffer>;
    view: DataView;
    /** Copy of the original file for "Discard changes". */
    pristine: Uint8Array<ArrayBuffer>;
  }

  let doc = $state.raw<Document | null>(null);
  /** File whose game could not be told from its size; waiting for the user to pick one. */
  let unrecognised = $state.raw<File | null>(null);
  /** Bumped to remount every field after the bytes are replaced. */
  let version = $state(0);
  let dragover = $state(false);
  let toast = $state<{ message: string; warn: boolean } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  let fileInput = $state<HTMLInputElement>();

  function showToast(message: string, warn = false) {
    toast = { message, warn };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast = null), 1800);
  }

  /** Hand the loaded bytes to the other tabs. The field components write into these same
   *  bytes, so a reader that looks again sees the edits. */
  function share() {
    app.save = doc && { game: doc.game.id, bytes: doc.bytes };
    app.saveVersion++;
  }

  async function load(file: File, game: GameSchema) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    doc = { name: file.name, game, bytes, view: new DataView(bytes.buffer), pristine: bytes.slice() };
    unrecognised = null;
    version++;
    share();
  }

  function receive(file: File) {
    const game = pickGameByFileSize(file.size);
    if (game) load(file, game);
    else unrecognised = file;
  }

  function onFileChosen() {
    const file = fileInput?.files?.[0];
    if (file) receive(file);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragover = false;
    const file = event.dataTransfer?.files[0];
    if (file) receive(file);
  }

  function download() {
    if (!doc) return;
    doc.game.onSave?.(doc.bytes);
    const url = URL.createObjectURL(new Blob([doc.bytes], { type: 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded ' + doc.name);
  }

  function discard() {
    if (!doc) return;
    const bytes = doc.pristine.slice();
    doc = { ...doc, bytes, view: new DataView(bytes.buffer) };
    version++;
    share();
    showToast('Changes discarded');
  }

  function unload() {
    doc = null;
    unrecognised = null;
    if (fileInput) fileInput.value = '';
    share();
  }
</script>

<div class="save-editor">
  <div class="page">
    <p class="lead">Edit Moraff's World and Dungeons of the Unforgiven character files in your browser. Nothing is uploaded — all editing happens locally.</p>

    {#if !doc}
      <div class="intro">
        <h2>How it works</h2>
        <ol>
          <li>
            <strong>Upload your save file.</strong> These are plain, numbered files in your game directory — named <code>1</code>, <code>2</code>,
            <code>3</code>, etc. in Moraff's World, and <code>21</code>, <code>22</code>, <code>23</code>, etc. in Dungeons of the Unforgiven (one
            file per character).
          </li>
          <li><strong>Make your changes</strong> using the editor that appears.</li>
          <li><strong>Download the new file</strong> and overwrite the original in your game directory.</li>
        </ol>
        <p class="warn-note">
          <strong>Back up your save files first.</strong> This tool is provided as-is and isn't guaranteed to work correctly for everything — keep a
          copy of the original so you can restore it if something goes wrong.
        </p>
      </div>
    {/if}

    {#if unrecognised}
      <div class="picker">
        <p>Couldn't identify this file by size. Pick a game:</p>
        <div class="game-picker">
          {#each GAMES as game}
            <button type="button" onclick={() => load(unrecognised!, game)}>{game.displayName} ({game.fileSize}b)</button>
          {/each}
        </div>
      </div>
    {:else if !doc}
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
        <div><strong>Click to choose</strong> or drag a save file here</div>
        <input type="file" bind:this={fileInput} onchange={onFileChosen} />
      </label>
    {/if}

    {#if doc}
      <div class="toolbar">
        <button type="button" onclick={download}>Download edited file</button>
        <button type="button" class="ghost" onclick={discard}>Discard changes</button>
        <button type="button" class="ghost" onclick={unload}>Load different file</button>
        <span class="game-badge">{doc.game.displayName}</span>
        <span class="filename">{doc.name}</span>
      </div>
      {#key version}
        {#each doc.game.sections as section}
          <SectionView view={doc.view} {section} />
        {/each}
      {/key}
    {/if}

    <footer>
      <p>Runs entirely in your browser. No data leaves your computer.</p>
      <p>
        The Dungeons of the Unforgiven character file format was reverse engineered and documented by <strong>Spectere</strong> and
        <strong>Bag of Magic Food</strong>. Credit and thanks to them, and to the
        <a href="https://moddingwiki.shikadi.net/wiki/Dungeons_of_the_Unforgiven_Player_Character" target="_blank" rel="noopener">DOS Game Modding Wiki</a>.
      </p>
      <p>
        Source on <a href="https://github.com/johnolek/moraffs-world-and-dungeons-of-the-unforgiven-save-editor" target="_blank" rel="noopener">GitHub</a>.
      </p>
    </footer>
  </div>

  {#if toast}
    <div class="toast" class:warn={toast.warn}>{toast.message}</div>
  {/if}
</div>

<style>
  .save-editor {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .page {
    max-width: 880px;
    margin: 0 auto;
    padding: 24px 32px 48px;
  }
  .lead {
    margin: 0 0 20px;
    color: var(--muted);
    font-size: 13px;
  }
  .intro {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 18px 22px;
    margin-bottom: 20px;
    color: var(--muted);
    font-size: 13px;
  }
  .intro h2 {
    margin: 0 0 10px;
    font-size: 13px;
    color: var(--accent);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .intro ol {
    margin: 0;
    padding-left: 20px;
  }
  .intro li {
    margin-bottom: 5px;
  }
  .intro li strong {
    color: var(--ink);
  }
  .intro code {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    background: var(--panel-2);
    color: var(--mw-cyan);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 12px;
  }
  .warn-note {
    margin: 12px 0 0;
    padding-top: 12px;
    border-top: 1px solid var(--line);
    color: var(--warn);
  }
  .warn-note strong {
    color: var(--warn);
  }
  .drop-zone {
    display: block;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 36px 24px;
    text-align: center;
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s ease;
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
  .picker p {
    margin: 0 0 8px;
  }
  .game-picker {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .game-picker button {
    background: var(--panel);
    color: var(--ink);
    border: 1px solid var(--line);
  }
  .game-picker button:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .filename {
    color: var(--muted);
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 13px;
  }
  .game-badge {
    background: var(--panel);
    color: var(--accent);
    border: 1px solid var(--accent-dim);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  footer {
    margin-top: 24px;
    padding-top: 24px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
    border-top: 1px solid var(--line);
  }
  footer p {
    margin: 0 0 8px;
  }
  footer a {
    color: var(--accent-dim);
  }
  footer a:hover {
    color: var(--accent);
  }
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--good);
    color: #102014;
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 600;
    pointer-events: none;
  }
  .toast.warn {
    background: var(--warn);
    color: #1a1822;
  }
</style>
