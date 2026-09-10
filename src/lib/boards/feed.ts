import type { Announcement } from '../../../server/announcing';

/**
 * Following the run server's feed of announcements.
 *
 * The panel reads the history once and then listens: each announcement the server makes arrives
 * as a `data:` line and goes to the front of what is showing. What the browser does is behind
 * {@link FeedWiring} so that the reconnecting can be read and tested without one.
 */

/** How long to wait before opening the feed again after it has closed for good. */
export const REOPEN_AFTER_MS = 5000;

/** An announcement out of a `data:` line, or null when the line is not one. The feed is one
 *  server's and is not read for anything but shape. */
export function announcementIn(data: string): Announcement | null {
  try {
    const parsed: unknown = JSON.parse(data);
    if (parsed === null || typeof parsed !== 'object') return null;
    const announcement = parsed as Partial<Announcement>;
    if (typeof announcement.id !== 'number' || typeof announcement.kind !== 'string') return null;
    return announcement as Announcement;
  } catch {
    return null;
  }
}

/**
 * The announcements showing, with the one that has just arrived at the front.
 *
 * One already showing is left where it is: the history is asked for while the feed is already
 * open, so an announcement made in that moment arrives down the feed and comes back in the
 * history as well.
 */
export function prepended(showing: readonly Announcement[], arrived: Announcement): Announcement[] {
  if (showing.some((announcement) => announcement.id === arrived.id)) return [...showing];
  return [arrived, ...showing];
}

/**
 * The history just read, with whatever arrived down the feed while it was being read still in
 * front of it.
 *
 * The feed goes up before the history is asked for, so that nothing announced in between is
 * missed. That is also why the two overlap: an announcement made in that moment comes down the
 * feed and comes back in the history, and it is shown once.
 */
export function merged(arrived: readonly Announcement[], history: readonly Announcement[]): Announcement[] {
  return arrived.reduceRight<Announcement[]>((all, announcement) => prepended(all, announcement), [...history]);
}

/** One connection to the feed, however it was opened. */
export interface FeedConnection {
  close(): void;
}

/** A wait that has not happened yet. */
export interface FeedWait {
  cancel(): void;
}

/** What following the feed needs of the browser: a connection that says what arrives and when it
 *  has closed for good, and a wait. */
export interface FeedWiring {
  connect(arrived: (announcement: Announcement) => void, closed: () => void): FeedConnection;
  wait(ms: number, then: () => void): FeedWait;
}

/** A feed being followed, until the page showing it goes away. */
export interface FollowedFeed {
  stop(): void;
}

/**
 * Follow the feed, opening it again whenever it closes.
 *
 * A connection that has closed for good is one the browser has given up on, so this waits and
 * makes a new one. Everything announced while it was down is in the history, which the panel can
 * read again; nothing here tries to catch up on its own.
 */
export function followFeed(wiring: FeedWiring, arrived: (announcement: Announcement) => void): FollowedFeed {
  let connection: FeedConnection | null = null;
  let waiting: FeedWait | null = null;
  let stopped = false;

  function open(): void {
    if (stopped) return;
    connection = wiring.connect(arrived, () => {
      // The connection is gone either way, and a page that has been told twice must not end up
      // waiting twice or holding two feeds.
      if (connection === null) return;
      connection = null;
      waiting = wiring.wait(REOPEN_AFTER_MS, () => {
        waiting = null;
        open();
      });
    });
  }

  open();

  return {
    stop(): void {
      stopped = true;
      waiting?.cancel();
      waiting = null;
      connection?.close();
      connection = null;
    },
  };
}

/**
 * The feed as the browser gives it: `EventSource`, which asks for `/feed` and holds the answer
 * open.
 *
 * `EventSource` retries a connection that drops on its own, and only says a thing about it after
 * it has given up altogether, which is what `readyState` being closed means. So a page that has
 * lost its connection for a moment is left to the browser, and only one that has been abandoned
 * is opened again here.
 */
export function browserFeed(server: string): FeedWiring {
  return {
    connect(arrived, closed) {
      const source = new EventSource(`${server}/feed`);
      source.onmessage = (event: MessageEvent<string>) => {
        const announcement = announcementIn(event.data);
        if (announcement !== null) arrived(announcement);
      };
      source.onerror = () => {
        if (source.readyState !== EventSource.CLOSED) return;
        source.close();
        closed();
      };
      return { close: () => source.close() };
    },
    wait(ms, then) {
      const timer = setTimeout(then, ms);
      return { cancel: () => clearTimeout(timer) };
    },
  };
}
