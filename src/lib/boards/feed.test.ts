import { describe, expect, it } from 'vitest';
import type { Announcement } from '../../../server/announcing';
import { announcementIn, followFeed, merged, prepended, type FeedConnection, type FeedWait, type FeedWiring } from './feed';

function said(id: number): Announcement {
  return {
    id,
    characterId: 'grond',
    kind: 'level',
    which: id,
    game: 'unforgiven',
    leaderboard: 'speedrun',
    player: 'Moraff',
    name: 'Grond',
    actions: 10,
    time: 20,
    floor: 3,
    dungeon: 1,
    level: id,
    playMs: 1000,
    at: '2026-09-09 21:00:00',
  };
}

describe('an announcement off the feed', () => {
  it('is the row the line carries', () => {
    expect(announcementIn(JSON.stringify(said(4)))?.id).toBe(4);
  });

  it('is nothing for a line that is not one', () => {
    expect(announcementIn('still here')).toBeNull();
    expect(announcementIn('{"id":"four"}')).toBeNull();
    expect(announcementIn('null')).toBeNull();
  });
});

describe('putting an announcement that has arrived at the front', () => {
  it('goes in front of the ones showing', () => {
    expect(prepended([said(2), said(1)], said(3)).map((each) => each.id)).toEqual([3, 2, 1]);
  });

  it('leaves one already showing where it is, since the history and the feed overlap', () => {
    expect(prepended([said(2), said(1)], said(2)).map((each) => each.id)).toEqual([2, 1]);
  });
});

describe('the history under what arrived while it was being read', () => {
  it('keeps the ones that arrived in front, newest first', () => {
    expect(merged([said(5), said(4)], [said(3), said(2)]).map((each) => each.id)).toEqual([5, 4, 3, 2]);
  });

  it('shows one that arrived and came back in the history once', () => {
    expect(merged([said(4), said(3)], [said(3), said(2)]).map((each) => each.id)).toEqual([4, 3, 2]);
  });
});

/** The browser, as a test can drive it: the connections opened, what arrives down the newest of
 *  them, and a wait that ends only when the test says so. */
class FakeBrowser implements FeedWiring {
  connections = 0;
  closed = 0;
  waiting = false;
  private arrived: ((announcement: Announcement) => void) | null = null;
  private gaveUp: (() => void) | null = null;
  private after: (() => void) | null = null;

  connect(takes: (announcement: Announcement) => void, closed: () => void): FeedConnection {
    this.connections += 1;
    this.arrived = takes;
    this.gaveUp = closed;
    return {
      close: () => {
        this.closed += 1;
      },
    };
  }

  wait(_ms: number, then: () => void): FeedWait {
    this.waiting = true;
    this.after = then;
    return {
      cancel: () => {
        this.waiting = false;
      },
    };
  }

  /** The server has announced something down the connection that is open. */
  announce(announcement: Announcement): void {
    this.arrived?.(announcement);
  }

  /** The browser has given up on the connection. */
  giveUp(): void {
    this.gaveUp?.();
  }

  /** The wait before opening it again is over. */
  waitOut(): void {
    this.waiting = false;
    this.after?.();
  }
}

describe('following the feed', () => {
  it('opens it and hands on what arrives', () => {
    const browser = new FakeBrowser();
    const heard: number[] = [];

    const feed = followFeed(browser, (announcement) => heard.push(announcement.id));
    browser.announce(said(5));

    expect(browser.connections).toBe(1);
    expect(heard).toEqual([5]);
    feed.stop();
  });

  it('opens it again after waiting, when the browser has given up on it', () => {
    const browser = new FakeBrowser();
    const heard: number[] = [];
    const feed = followFeed(browser, (announcement) => heard.push(announcement.id));

    browser.giveUp();
    expect(browser.waiting).toBe(true);
    expect(browser.connections).toBe(1);

    browser.waitOut();
    expect(browser.connections).toBe(2);
    browser.announce(said(6));
    expect(heard).toEqual([6]);
    feed.stop();
  });

  it('waits once for a connection it is told about twice', () => {
    const browser = new FakeBrowser();
    const feed = followFeed(browser, () => {});

    browser.giveUp();
    browser.giveUp();
    browser.waitOut();

    expect(browser.connections).toBe(2);
    feed.stop();
  });

  it('does not open it again once the page has stopped following it', () => {
    const browser = new FakeBrowser();
    const feed = followFeed(browser, () => {});

    browser.giveUp();
    feed.stop();
    browser.waitOut();

    expect(browser.connections).toBe(1);
  });

  it('closes the connection it holds when the page stops following it', () => {
    const browser = new FakeBrowser();
    const feed = followFeed(browser, () => {});

    feed.stop();

    expect(browser.closed).toBe(1);
  });
});
