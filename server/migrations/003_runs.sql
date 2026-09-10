-- A run as it is played: the character, the sittings it has been played in, the stretches of keys
-- that arrived, and the verdict the replay gave at the end.
--
-- A character here is a roster entry in somebody's browser, and its id is that entry's, so the
-- first batch of a run is what makes it known and no registration step is needed. It belongs to
-- the player whose secret sent it and nobody else may send for it afterwards.
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id),
  game TEXT NOT NULL,
  mode TEXT,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- When the run ended and how, which is a death or a win and nothing else: leaving the game is
  -- not an ending, since the character is played again from where it stood.
  finished_at TEXT,
  outcome TEXT
);

-- One sitting at the game. The seed, the engine and the record are what a replay starts from, and
-- the rest is what the site claims that sitting came to, rewritten by every batch so the newest
-- stands. A replay checks the claims; nothing here is believed on its own.
CREATE TABLE sessions (
  character_id TEXT NOT NULL REFERENCES characters(id),
  session_index INTEGER NOT NULL,
  seed INTEGER NOT NULL,
  engine TEXT NOT NULL,
  game TEXT NOT NULL,
  leaderboard TEXT,
  sound INTEGER,
  name TEXT NOT NULL,
  started_at TEXT NOT NULL,
  record TEXT NOT NULL,
  mode TEXT,
  actions INTEGER NOT NULL,
  time REAL NOT NULL,
  edits INTEGER NOT NULL,
  milestones TEXT NOT NULL,
  PRIMARY KEY (character_id, session_index)
);

-- One stretch of a sitting, as it arrived. `arrived_at` is the server's own clock in
-- milliseconds, and the gaps between consecutive stamps within a sitting are the run's play time:
-- the site sends every few seconds while the character is being played and stops when the game is
-- left, so a long gap is time the player was away.
--
-- The sequence is the site's count of the batches of that sitting, and it is what makes a resend
-- harmless: a batch whose sequence is already here arrived before and is not appended again.
CREATE TABLE batches (
  id INTEGER PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id),
  session_index INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  inputs TEXT NOT NULL,
  pressed INTEGER NOT NULL,
  arrived_at INTEGER NOT NULL,
  ending INTEGER NOT NULL,
  UNIQUE (character_id, session_index, sequence)
);

-- What replaying the whole chain said, once the run has ended. `play_ms` and `timed` are read off
-- the batch stamps rather than out of the run, and `eligible` is whether the run may go on a
-- board at all.
CREATE TABLE verdicts (
  character_id TEXT PRIMARY KEY REFERENCES characters(id),
  status TEXT NOT NULL,
  reason TEXT,
  actions INTEGER NOT NULL,
  time REAL NOT NULL,
  milestones TEXT NOT NULL,
  play_ms INTEGER NOT NULL,
  timed INTEGER NOT NULL,
  eligible INTEGER NOT NULL,
  engine_commits TEXT NOT NULL,
  verified_at TEXT NOT NULL DEFAULT (datetime('now'))
);
