import type { Leaderboard, PortedGameId } from '../app-state.svelte';
import { runServerUrl } from '../run-server';
// The three shapes the server answers with, and nothing but the shapes: these are types, so none
// of the server's code comes along with them.
import type { Announcement } from '../../../server/announcing';
import type { BoardName, BoardPage, BoardRow } from '../../../server/boards';
import type { RunAnswer } from '../../../server/http';

/**
 * Reading the boards, the runs and the announcements off the run server.
 *
 * Everything here is one round trip and a shape the page can draw: a page of a board, the page
 * after it added to what is already shown, one run, and a page of the history. A call that could
 * not be made comes back as what the page already had with `failed` on it, so a board that is
 * showing stays on screen while the server is unreachable and the page says so.
 *
 * A build with no server address has no boards at all, and the tab is not offered
 * (`src/lib/tabs.ts`); nothing here is called in such a build.
 */

/** Which board is being read: the game, one of the two leaderboards, and one of the six. */
export interface BoardAsked {
  game: PortedGameId;
  leaderboard: Leaderboard;
  board: BoardName;
}

/** A board as the page holds it: every row read so far, the last page read, and whether the
 *  server had more behind it. */
export interface LoadedBoard {
  rows: BoardRow[];
  page: number;
  more: boolean;
  failed: boolean;
}

/** A board nothing has been read for yet, which is what a page starts from and goes back to when
 *  the board being shown changes. */
export const NO_BOARD: LoadedBoard = { rows: [], page: 0, more: false, failed: false };

/** The first page of a board, which throws away whatever was showing. */
export async function loadBoard(asked: BoardAsked): Promise<LoadedBoard> {
  const page = await readBoardPage(asked, 1);
  if (page === null) return { ...NO_BOARD, failed: true };
  return { rows: page.rows, page: page.page, more: page.more, failed: false };
}

/** The page after the one showing, added to the end of it. A page that could not be read leaves
 *  the rows exactly as they were. */
export async function loadMore(showing: LoadedBoard, asked: BoardAsked): Promise<LoadedBoard> {
  const page = await readBoardPage(asked, showing.page + 1);
  if (page === null) return { ...showing, failed: true };
  return { rows: [...showing.rows, ...page.rows], page: page.page, more: page.more, failed: false };
}

async function readBoardPage(asked: BoardAsked, page: number): Promise<BoardPage | null> {
  return await readJson<BoardPage>(`/boards/${asked.game}/${asked.leaderboard}/${asked.board}?page=${page}`);
}

/** One run and the verdict on it, or nothing when it could not be read. A run is only opened from
 *  a board, and everything on a board has been verified, so no player secret goes with this. */
export async function loadRun(characterId: string): Promise<RunAnswer | null> {
  return await readJson<RunAnswer>(`/runs/${encodeURIComponent(characterId)}`);
}

/** The announcements the page is showing: the history read so far, newest first. */
export interface LoadedAnnouncements {
  announcements: Announcement[];
  more: boolean;
  failed: boolean;
}

export const NO_ANNOUNCEMENTS: LoadedAnnouncements = { announcements: [], more: false, failed: false };

/** The newest announcements, which is what the panel opens with. */
export async function loadAnnouncements(): Promise<LoadedAnnouncements> {
  const page = await readAnnouncementPage(null);
  if (page === null) return { ...NO_ANNOUNCEMENTS, failed: true };
  return { announcements: page.announcements, more: page.more, failed: false };
}

/**
 * The announcements behind the oldest one showing, added to the end.
 *
 * The history is asked for by id rather than by a page number because announcements are made while
 * the panel is being read: a page number would show one twice or skip one as they arrive.
 */
export async function loadOlderAnnouncements(showing: LoadedAnnouncements): Promise<LoadedAnnouncements> {
  const oldest = showing.announcements[showing.announcements.length - 1];
  const page = await readAnnouncementPage(oldest?.id ?? null);
  if (page === null) return { ...showing, failed: true };
  return {
    announcements: [...showing.announcements, ...page.announcements],
    more: page.more,
    failed: false,
  };
}

async function readAnnouncementPage(before: number | null): Promise<AnnouncementsAnswer | null> {
  return await readJson<AnnouncementsAnswer>(`/announcements${before === null ? '' : `?before=${before}`}`);
}

/** What `GET /announcements` answers with. */
interface AnnouncementsAnswer {
  announcements: Announcement[];
  more: boolean;
}

/** One call, or null when this build has no server, the server could not be reached, or it
 *  refused. Every refusal here is the same to the reader: what they asked for is not on screen. */
async function readJson<Answer>(path: string): Promise<Answer | null> {
  const server = runServerUrl();
  if (server === null) return null;
  try {
    const response = await fetch(`${server}${path}`);
    if (!response.ok) return null;
    return (await response.json()) as Answer;
  } catch {
    return null;
  }
}
