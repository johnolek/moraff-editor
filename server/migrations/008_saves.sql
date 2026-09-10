-- The character itself, kept beside the run it is playing, so that a player who signs in on
-- another device finds their characters where the last sitting left them.
--
-- `record` is the character as it stands now, which is not the same thing as the record on any
-- sitting of the chain: those are what a replay of that sitting starts from and never move again.
-- This one is rewritten by every batch, so the newest is what a second device picks the character
-- up from.
--
-- `maps` is the squares the character has discovered, as the device keeps them beside the record:
-- JSON of a bitmap per floor in the two games that map that way, and the base64 of one array in
-- Moraff's Revenge. Nothing here reads it -- it is the device's blob, handed back the way it
-- arrived -- so it is text rather than a shape this server would have to agree about.
--
-- `slot`, `dead`, `edited_at` and `leaderboard` are the rest of what the roster shows about a
-- character. The board is the character's own rather than any sitting's: `sessions.leaderboard`
-- is what the character was locked to when that sitting began, and a record written from outside
-- the game ends the lock without touching the sittings already played.
ALTER TABLE characters ADD COLUMN record bytea;
ALTER TABLE characters ADD COLUMN maps text;
ALTER TABLE characters ADD COLUMN saved_at timestamptz;
ALTER TABLE characters ADD COLUMN slot integer;
ALTER TABLE characters ADD COLUMN dead boolean NOT NULL DEFAULT false;
ALTER TABLE characters ADD COLUMN edited_at text;
ALTER TABLE characters ADD COLUMN leaderboard text;

-- Which device is playing the character, and until when.
--
-- One character can be played from one device at a time, or two devices would write two runs over
-- each other and neither would be the character's. A batch leases the character to the device that
-- sent it for half a minute past its arrival, and a batch from another device inside that lease is
-- refused; once it has lapsed the next device to send takes it over.
--
-- `leased_to` is the SHA-256 of that device's secret, the same hash `player_secrets` recognises a
-- device by, so nothing here is a secret anybody could play with.
ALTER TABLE characters ADD COLUMN leased_to text;
ALTER TABLE characters ADD COLUMN leased_until timestamptz;

-- The roster listing is every character of one player, so that is what it is indexed by.
CREATE INDEX characters_player ON characters (player_id);
