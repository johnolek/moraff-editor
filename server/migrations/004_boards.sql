-- What a board reads a run by, kept on the verdict.
--
-- A board is one game and one of faithful and speedrun, so every board query filters on both.
-- The game is on `characters` and the board a character is locked to is on `sessions`, a row per
-- sitting; reading a board off those would mean joining both and picking a sitting out of the
-- chain for every run. The verdict is written once when the run ends and is the row a board is
-- read from, so the two things a board is picked by are written here as well.
--
-- `leaderboard` is null for a character rolled for no board, and a run of one is on no board at
-- all.
ALTER TABLE verdicts ADD COLUMN game text NOT NULL DEFAULT '';
ALTER TABLE verdicts ADD COLUMN leaderboard text;

-- How far the run got and the highest level it reached. Both are read off the milestones when the
-- verdict is stored, so that ordering a board never means reading JSON: how they are read is
-- `server/boards.ts`, since a board is what they are for.
ALTER TABLE verdicts ADD COLUMN deepest integer NOT NULL DEFAULT 0;
ALTER TABLE verdicts ADD COLUMN level integer NOT NULL DEFAULT 0;

CREATE INDEX verdicts_board ON verdicts (game, leaderboard);
