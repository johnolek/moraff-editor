<!--
  The announcements beside the boards: everything the server has said, newest first, with each new
  one arriving as it is made.

  The feed goes up before the history is asked for, so that a run announced while the history is on
  its way is not missed. The two overlap for that moment and an announcement is shown once.
-->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { runServerUrl } from '../run-server';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import { announcementWords } from './announce';
  import { browserFeed, followFeed, merged, prepended, type FollowedFeed } from './feed';
  import { loadAnnouncements, loadOlderAnnouncements, NO_ANNOUNCEMENTS, type LoadedAnnouncements } from './server';
  import { BOARDS_PAGE, whenWords } from './words';

  let showing = $state<LoadedAnnouncements>(NO_ANNOUNCEMENTS);
  let reading = $state(false);

  const server = runServerUrl();
  let feed: FollowedFeed | null = null;

  if (server !== null) {
    feed = followFeed(browserFeed(server), (announcement) => {
      showing = { ...showing, announcements: prepended(showing.announcements, announcement) };
    });
    void loadAnnouncements().then((history) => {
      showing = { ...history, announcements: merged(showing.announcements, history.announcements) };
    });
  }

  onDestroy(() => feed?.stop());

  async function older(): Promise<void> {
    reading = true;
    showing = await loadOlderAnnouncements(showing);
    reading = false;
  }
</script>

<aside class="announcements">
  <SectionHeading title={BOARDS_PAGE.announcements} />
  {#if showing.announcements.length === 0}
    <p class="empty">{showing.failed ? BOARDS_PAGE.announcementsUnreachable : BOARDS_PAGE.nothingAnnounced}</p>
  {:else}
    <ul>
      {#each showing.announcements as announcement (announcement.id)}
        <li>
          <span class="said">{announcementWords(announcement)}</span>
          <span class="when">{whenWords(announcement.at)}</span>
        </li>
      {/each}
    </ul>
    {#if showing.more}
      <button type="button" onclick={older} disabled={reading}>{BOARDS_PAGE.more}</button>
    {/if}
    {#if showing.failed}
      <p class="empty">{BOARDS_PAGE.announcementsUnreachable}</p>
    {/if}
  {/if}
</aside>

<style>
  .announcements {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 320px;
    flex-shrink: 0;
    padding: 16px;
    border-left: 1px solid var(--line);
    background: var(--panel);
    overflow-y: auto;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 6px 0;
    border-bottom: 1px solid var(--line);
  }
  .said {
    display: block;
    font-size: 13px;
    line-height: 1.4;
  }
  .when {
    display: block;
    margin-top: 2px;
    color: var(--muted);
    font-size: 11px;
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
  .empty {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }
</style>
