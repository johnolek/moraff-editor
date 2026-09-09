-- Nobody signs up. A player is a secret their device made and a name they picked, and only the
-- SHA-256 of the secret is here: the server can recognise a secret it is handed and cannot hand
-- one out, so a copy of this file is not a set of keys to anybody's runs.
--
-- NOCASE makes the unique index fold case, so one player's name cannot be taken by another
-- spelling it differently. It folds A-Z and nothing else, which is why a name is held to those
-- letters (server/players.ts).
CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  secret_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
