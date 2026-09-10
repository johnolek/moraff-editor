-- What the server said about a run once it had been checked: that the character won or died, and
-- every milestone of its whole run that had not been said before.
--
-- The row carries fields and no sentence. The words are the site's, in one place shared by the
-- feed and the page that reads the history back, so that changing how an announcement reads is a
-- change to the site and not to what is already stored here.
--
-- The player's name and the character's are copied on rather than joined: an announcement is what
-- was said at the moment a run ended, and a player who renames themselves afterwards does not
-- rewrite it.
--
-- `which` is which boss, which level, which module or dungeon, which floor, and 0 for a win or a
-- death, which have nothing to count. `floor`, `dungeon` and `level` are where the character stood
-- and what it had reached by then, which is what the sentence about a death is made of.
--
-- `play_ms` is the run's play time rather than the moment's: it is only there for the sentence
-- about a win, and a run is timed as a whole.
CREATE TABLE announcements (
  id INTEGER PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id),
  kind TEXT NOT NULL,
  which INTEGER NOT NULL,
  game TEXT NOT NULL,
  leaderboard TEXT,
  player TEXT NOT NULL,
  name TEXT NOT NULL,
  actions INTEGER NOT NULL,
  time REAL NOT NULL,
  floor INTEGER NOT NULL,
  dungeon INTEGER NOT NULL,
  level INTEGER NOT NULL,
  play_ms INTEGER NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now')),
  -- A run is replayed again whenever the batch that ended it arrives again, and a character's
  -- chain carries every milestone it has ever reached, so the same thing would otherwise be
  -- announced twice. Saying it once is this index.
  UNIQUE (character_id, kind, which)
);
