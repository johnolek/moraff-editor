-- What a replay of a character's chain said about it while the character was still being played.
--
-- A board of the living cannot be read off `verdicts`: a verdict is written once, when a run
-- ends, and these runs have not ended. So the chain so far is replayed while it is being played
-- and what that replay reached is written down here, one row per character, rewritten by each
-- replay. The board is read from this row and from nothing the site said: the level and the depth
-- it shows are the engine's own answer.
--
-- `replayed_through` is the id of the last batch the replay took in. A chain is only worth
-- replaying again once a batch has arrived past that one, and this is what says whether one has.
--
-- `status` is the replay's verdict, in the same three words a run's verdict uses. Only a
-- `verified` snapshot stands on a board; one that failed or could not be checked keeps the
-- character off it, with `reason` for why.
--
-- `game` and `leaderboard` are copied here for the same reason they are on a verdict: a board is
-- one game and one of faithful and speedrun, so those two are what it is picked by, and reading
-- one is then this table and no JSON.
CREATE TABLE living (
  character_id text PRIMARY KEY REFERENCES characters(id),
  status text NOT NULL,
  reason text,
  level integer NOT NULL,
  deepest integer NOT NULL,
  actions integer NOT NULL,
  time double precision NOT NULL,
  game text NOT NULL,
  leaderboard text,
  replayed_through bigint NOT NULL,
  replayed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX living_board ON living (game, leaderboard);
