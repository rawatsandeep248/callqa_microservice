-- Post-migration: one DRAFT per scorecard_id + optional data cleanup
-- Run after migrate-stable-scorecard-ids.sql (also invoked from npm script).

-- If multiple DRAFT rows exist for the same logical scorecard, archive older ones.
UPDATE scorecards sc
SET status = 'ARCHIVED',
    archived_at = COALESCE(sc.archived_at, NOW()),
    updated_at = NOW()
WHERE sc.status = 'DRAFT'
  AND sc.version < (
    SELECT MAX(s2.version)
    FROM scorecards s2
    WHERE s2.scorecard_id = sc.scorecard_id
      AND s2.status = 'DRAFT'
  );

DROP INDEX IF EXISTS idx_scorecards_one_draft_per_id;
CREATE UNIQUE INDEX idx_scorecards_one_draft_per_id
    ON scorecards (scorecard_id)
    WHERE status = 'DRAFT';
