<!--
  The Boards tab: one game's runs, on whichever of the six boards is picked, with the
  announcements beside them. Clicking a run opens its own page here in place of the board.

  Which boards there are and what each one holds is the server's, in `server/boards.ts`, so that
  the two halves never disagree about a board. Nothing of the server's code comes with it: the
  list is a table of names and words.
-->
<script lang="ts">
  import { app, type Leaderboard } from '../app-state.svelte';
  import { leaderboardLabel } from '../character/leaderboard';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import Announcements from './Announcements.svelte';
  import RunPage from './RunPage.svelte';
  import { loadBoard, loadMore, NO_BOARD, type BoardAsked, type LoadedBoard } from './server';
  import { BOARDS_PAGE, clockHeading, NOTHING_TO_SHOW, playTimeWords, reachWords, whenWords } from './words';
  import { BOARDS, BOARD_LEADERBOARDS, type BoardName } from '../../../server/boards';

  let leaderboard = $state<Leaderboard>('faithful');
  let board = $state<BoardName>('actions');
  let showing = $state<LoadedBoard>(NO_BOARD);
  let reading = $state(false);
  let openRun = $state<string | null>(null);

  const asked = $derived<BoardAsked>({ game: app.game, leaderboard, board });

  /**
   * Which read the rows on screen came from. A reader who picks two boards quickly has two reads
   * in the air at once, and the answer to the first must not land on top of the second.
   */
  let latest = 0;

  $effect(() => {
    const now = asked;
    const mine = ++latest;
    showing = NO_BOARD;
    openRun = null;
    void loadBoard(now).then((read) => {
      if (mine === latest) showing = read;
    });
  });

  /**
   * The number the board is in order of, where the table has no column of its own for it. The
   * boards of wins are ordered by numbers every row already shows.
   */
  const sortedOn = $derived(BOARDS.find((each) => each.name === board)?.sortedOn ?? null);
  const extra = $derived(sortedOn === 'deepest' || sortedOn === 'level' ? sortedOn : null);

  async function more(): Promise<void> {
    reading = true;
    const mine = latest;
    const read = await loadMore(showing, asked);
    reading = false;
    if (mine === latest) showing = read;
  }
</script>

<div class="boards">
  <div class="board">
    {#if openRun !== null}
      <RunPage characterId={openRun} onback={() => (openRun = null)} />
    {:else}
      <SectionHeading title={BOARDS_PAGE.heading} />
      <div class="picks">
        <div class="pick" role="group" aria-label={BOARDS_PAGE.leaderboard}>
          <span class="label">{BOARDS_PAGE.leaderboard}</span>
          {#each BOARD_LEADERBOARDS as choice}
            <label>
              <input type="radio" value={choice} bind:group={leaderboard} />
              <span>{leaderboardLabel(choice)}</span>
            </label>
          {/each}
        </div>
        <div class="pick" role="group" aria-label={BOARDS_PAGE.board}>
          <span class="label">{BOARDS_PAGE.board}</span>
          {#each BOARDS as choice}
            <label>
              <input type="radio" value={choice.name} bind:group={board} />
              <span>{choice.sorts}</span>
            </label>
          {/each}
        </div>
      </div>
      {#if showing.rows.length === 0}
        <p class="empty">{showing.failed ? BOARDS_PAGE.unreachable : BOARDS_PAGE.empty}</p>
      {:else}
        <table>
          <thead>
            <tr>
              <th>{BOARDS_PAGE.rank}</th>
              <th>{BOARDS_PAGE.player}</th>
              <th>{BOARDS_PAGE.character}</th>
              {#if extra !== null}
                <th>{extra === 'deepest' ? BOARDS_PAGE.reach : BOARDS_PAGE.level}</th>
              {/if}
              <th>{BOARDS_PAGE.actions}</th>
              <th>{clockHeading(asked.game)}</th>
              <th>{BOARDS_PAGE.playTime}</th>
              <th>{BOARDS_PAGE.finished}</th>
            </tr>
          </thead>
          <tbody>
            {#each showing.rows as row, at (row.characterId)}
              <tr>
                <td>{at + 1}</td>
                <td>{row.player}</td>
                <td>
                  <button type="button" class="link" onclick={() => (openRun = row.characterId)}>{row.name}</button>
                </td>
                {#if extra !== null}
                  <td>{extra === 'deepest' ? reachWords(asked.game, row.deepest) : row.level}</td>
                {/if}
                <td>{row.actions}</td>
                <td>{row.clock}</td>
                <td>{playTimeWords(row.playMs, row.timed)}</td>
                <td>{row.at === null ? NOTHING_TO_SHOW : whenWords(row.at)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if showing.more}
          <button type="button" class="more" onclick={more} disabled={reading}>{BOARDS_PAGE.more}</button>
        {/if}
        {#if showing.failed}
          <p class="empty">{BOARDS_PAGE.unreachable}</p>
        {/if}
      {/if}
    {/if}
  </div>
  <Announcements />
</div>

<style>
  .boards {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .board {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    padding: 16px 24px;
    overflow: auto;
  }
  .picks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 28px;
  }
  .pick {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
  }
  .label {
    color: var(--muted);
    font-size: 12px;
  }
  .pick label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    cursor: pointer;
  }
  table {
    border-collapse: collapse;
    font-size: 13px;
    color: var(--muted);
  }
  th {
    text-align: left;
    font-weight: 600;
    padding: 3px 16px 3px 0;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  td {
    padding: 4px 16px 4px 0;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  .link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--accent-dim);
    cursor: pointer;
  }
  .link:hover {
    color: var(--accent);
  }
  .more {
    padding: 6px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--panel-2);
    color: var(--ink);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .more:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .empty {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }
</style>
