<!--
  The links that open a function in the Source tab, for use inline wherever a page names one:
  "code" for the TypeScript the app runs, "decompiled" for the C it was read out of.
-->
<script lang="ts">
  import { app } from '../app-state.svelte';
  import { goToTab } from '../history';
  import type { SourceFile } from './ports';

  interface Props {
    /** The declaration in the app's own source, when the page names one. */
    ts?: { file: SourceFile; name: string };
    /** The function in the decompilation of the game the page is about, when it names one. */
    c?: string;
  }

  let { ts, c }: Props = $props();

  function open(request: NonNullable<typeof app.requestedSource>): void {
    app.requestedSource = request;
    goToTab(app, 'source');
  }
</script>

<span class="links">
  {#if ts}
    <button type="button" onclick={() => open({ kind: 'ts', file: ts.file, name: ts.name })}>code</button>
  {/if}
  {#if c}
    <button type="button" onclick={() => open({ kind: 'c', name: c })}>decompiled</button>
  {/if}
</span>

<style>
  .links {
    display: inline-flex;
    gap: 8px;
    margin-left: 6px;
    white-space: nowrap;
  }
  button {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
  }
  button:hover {
    color: var(--ink);
    text-decoration: underline;
  }
</style>
