<!--
  The name this browser goes by on the run server's boards, claimed from the Play tab.

  Nobody signs up: the browser's secret is the player, and this is the one thing they say about
  themselves. A build given no server address has no boards to be on, so there is nothing here to
  show.
-->
<script lang="ts">
  import { claimName, myName } from '../player';
  import { runServerUrl } from '../run-server';

  const id = $props.id();
  const server = runServerUrl();

  let name = $state('');
  let said = $state('');
  let saving = $state(false);

  if (server !== null) {
    void myName().then((claimed) => {
      if (claimed !== null) name = claimed;
    });
  }

  async function save() {
    saving = true;
    const answer = await claimName(name);
    saving = false;
    if (answer.ok) name = answer.name;
    said = answer.ok ? 'Saved.' : answer.message;
  }
</script>

{#if server !== null}
  <div class="board-name">
    <label class="note" for={id}>Name on the boards:</label>
    <div class="row">
      <input {id} type="text" maxlength="24" bind:value={name} oninput={() => (said = '')} />
      <button type="button" onclick={save} disabled={saving || name.trim() === ''}>Save</button>
    </div>
    {#if said}
      <div class="said" role="status">{said}</div>
    {/if}
  </div>
{/if}

<style>
  .note {
    display: block;
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 12px;
  }
  .row {
    display: flex;
    gap: 4px;
  }
  input {
    flex: 1;
    min-width: 0;
    padding: 6px 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel-2);
    color: var(--ink);
    font: inherit;
    font-size: 13px;
  }
  button {
    padding: 6px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel-2);
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .said {
    margin-top: 4px;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.4;
  }
</style>
