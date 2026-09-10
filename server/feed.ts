import type { ServerResponse } from 'node:http';
import type { Announcement } from './announcing';

/**
 * The feed: one request per page listening, held open, with every announcement written down it as
 * it is made.
 *
 * It is server-sent events, which is a plain HTTP answer that never ends. Nothing goes down it on
 * connecting — the history is `GET /announcements`, which a page asks for once — and from then on
 * each announcement is one `data:` line carrying the row as JSON. The words are the site's, so
 * what goes out is fields.
 *
 * A page is on the boards for as long as somebody leaves it open, which is longer than anything in
 * between will hold a silent connection for, so a comment goes down every feed every 25 seconds.
 * A comment is a line starting with a colon: the browser's `EventSource` ignores it, and the proxy
 * sees the connection being used.
 */

/** How often a comment goes down every open feed to keep it open. */
const HEARTBEAT_MS = 25_000;

export interface Feed {
  /** Hold this answer open and write every announcement made from now on down it. */
  listen(response: ServerResponse): void;
  /** Tell everybody listening. */
  announce(announcements: readonly Announcement[]): void;
  /** Let everybody listening go, which is what a stopping process does rather than wait for pages
   *  that are never going to hang up on their own. */
  close(): void;
}

export function openFeed(): Feed {
  const listening = new Set<ServerResponse>();
  /** Whether the feed is still one anybody may listen to. A closed one is a stopping process, and
   *  a page that asks for it again is answered and let go rather than held. */
  let open = true;
  const heartbeat = setInterval(() => {
    for (const response of listening) response.write(': still here\n\n');
  }, HEARTBEAT_MS);
  // Keeping feeds open is not a reason for the process to stay up: it stays up because it is
  // listening on a port.
  heartbeat.unref();

  return {
    listen(response: ServerResponse): void {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        // nginx holds an answer back until it has a bufferful, which for a feed means holding
        // every announcement until the next one. This is its word for passing it straight on.
        'X-Accel-Buffering': 'no',
      });
      // A stopping process has let everybody go, and a page that asks for the feed down the
      // connection it still has is answered and left to try again later rather than held.
      if (!open) {
        response.end();
        return;
      }
      // Something has to be written for the browser to call the connection open, and the first
      // thing a page hears about is whatever happens next rather than anything already said.
      response.write(': listening\n\n');
      listening.add(response);
      // A page that has been closed, reloaded or lost its connection leaves the answer here with
      // nowhere to go, and this is the only word of it the server gets.
      response.on('close', () => listening.delete(response));
    },

    announce(announcements: readonly Announcement[]): void {
      for (const announcement of announcements) {
        const line = `data: ${JSON.stringify(announcement)}\n\n`;
        for (const response of listening) response.write(line);
      }
    },

    close(): void {
      open = false;
      clearInterval(heartbeat);
      for (const response of listening) response.end();
      listening.clear();
    },
  };
}
