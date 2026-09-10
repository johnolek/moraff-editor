-- Every build of the engine the server has ever deployed, one row per commit.
--
-- A run session names the commit of the engine it was played on, and replaying a session with
-- anything but its own engine shows nothing, so a build is kept for as long as there are runs
-- played on it -- which is forever. Nothing is ever taken out of this table: deleting a build
-- makes every run played on it unreplayable and there is no getting its verdict back.
--
-- The build is here rather than on a disk because the box the server runs on keeps nothing:
-- the container can be rebuilt or moved and the builds are still where they were.
CREATE TABLE engines (
  commit text PRIMARY KEY,
  built_at timestamptz NOT NULL DEFAULT now(),
  bundle bytea NOT NULL
);
