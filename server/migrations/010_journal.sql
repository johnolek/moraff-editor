-- The run written up in words by the replay that judged it: everything that happened, one line
-- at a time, with how far the run had got when each was written.
--
-- A run log carries no journal. The site keeps one beside each sitting so a player can read their
-- own timeline without a replay, and it is left out of the export because a replay of the log
-- writes the same lines again -- which is exactly what happens here, so the journal a run's page
-- shows is the engine's own account of the run rather than anything the site said about it.
--
-- There is no column for the summary. It is a fold of the journal and the two numbers the row
-- already carries, and folding it means the game's names for its monsters, its spells and its
-- money, which is the engine; this server keeps no engine of its own and loads one per commit.
-- So the site folds it, out of the journal here, the same way the `verify-run` command does.
ALTER TABLE verdicts ADD COLUMN journal jsonb;

-- The same for a character still being played, whose chain is replayed over and over: the journal
-- of the run so far, rewritten by each replay along with the rest of the snapshot.
ALTER TABLE living ADD COLUMN journal jsonb;
