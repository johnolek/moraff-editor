-- The devices a player is played from, and the passphrase a new device is let in with.
--
-- A name used to be one device's: the secret that claimed it was a column of the player. A player
-- can now be played from several browsers, so each device's secret is a row here beside the
-- others. Only the SHA-256 of a secret is kept, as before: the server can recognise a secret it
-- is handed and cannot hand one out, so a copy of this table is not a set of keys to anybody's
-- runs.
CREATE TABLE player_secrets (
  secret_hash text PRIMARY KEY,
  player_id integer NOT NULL REFERENCES players(id),
  added_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO player_secrets (secret_hash, player_id, added_at)
SELECT secret_hash, id, created_at FROM players;

ALTER TABLE players DROP COLUMN secret_hash;

-- The passphrase of random words that lets a second device sign in as this player. Only its
-- scrypt hash is kept, with a salt of this player's own, so the server can recognise the words it
-- is handed and nobody reading the table can say them (server/passphrases.ts). All three are null
-- for a player who claimed their name before this ran, and stay null until they ask for one.
ALTER TABLE players
  ADD COLUMN passphrase_hash text,
  ADD COLUMN passphrase_salt bytea,
  ADD COLUMN passphrase_set_at timestamptz;
