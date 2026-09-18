-- Migration: stable scorecard_id / question_id across versions

-- Step 1: scorecard_version on questions
ALTER TABLE scorecard_questions
    ADD COLUMN IF NOT EXISTS scorecard_version INTEGER;

UPDATE scorecard_questions q
SET scorecard_version = sc.version
FROM scorecards sc
WHERE q.scorecard_version IS NULL
  AND q.scorecard_id = sc.scorecard_id;

UPDATE scorecard_questions q
SET scorecard_version = sc.version
FROM scorecards sc
WHERE q.scorecard_version IS NULL
  AND q.scorecard_id = sc.lineage_id;

ALTER TABLE scorecard_questions
    ALTER COLUMN scorecard_version SET NOT NULL;

-- Step 2: Drop FKs and old PKs (required before scorecard_id can repeat per version)
ALTER TABLE scorecard_questions
    DROP CONSTRAINT IF EXISTS scorecard_questions_scorecard_id_fkey;
ALTER TABLE scorecard_questions
    DROP CONSTRAINT IF EXISTS scorecard_questions_scorecard_fkey;
ALTER TABLE scorecard_questions
    DROP CONSTRAINT IF EXISTS scorecard_questions_pkey;

ALTER TABLE scorecards DROP CONSTRAINT IF EXISTS scorecards_pkey;
ALTER TABLE scorecards DROP CONSTRAINT IF EXISTS scorecards_lineage_id_version_key;

-- Step 3: Point questions at stable id (lineage)
UPDATE scorecard_questions q
SET scorecard_id = sc.lineage_id,
    scorecard_version = sc.version
FROM scorecards sc
WHERE q.scorecard_id = sc.scorecard_id
   OR (q.scorecard_id = sc.lineage_id AND q.scorecard_version = sc.version);

-- Step 4: Collapse scorecard rows to stable scorecard_id (= lineage_id)
UPDATE scorecards
SET scorecard_id = lineage_id
WHERE scorecard_id IS DISTINCT FROM lineage_id;

-- Step 5: Composite PK on scorecards (skip if already applied)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY (c.conkey)
        WHERE t.relname = 'scorecards' AND c.contype = 'p' AND a.attname = 'version'
    ) THEN
        ALTER TABLE scorecards ADD CONSTRAINT scorecards_pkey PRIMARY KEY (scorecard_id, version);
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_scorecards_id_version
    ON scorecards (scorecard_id, version);

-- Step 6: Composite PK + FK on questions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'scorecard_questions' AND c.contype = 'p'
          AND c.conname = 'scorecard_questions_pkey'
    ) THEN
        ALTER TABLE scorecard_questions
            ADD CONSTRAINT scorecard_questions_pkey
            PRIMARY KEY (scorecard_id, scorecard_version, question_id);
    END IF;
END $$;

ALTER TABLE scorecard_questions
    DROP CONSTRAINT IF EXISTS scorecard_questions_scorecard_fkey;

ALTER TABLE scorecard_questions
    ADD CONSTRAINT scorecard_questions_scorecard_fkey
    FOREIGN KEY (scorecard_id, scorecard_version)
    REFERENCES scorecards (scorecard_id, version)
    ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_questions_scorecard;
CREATE INDEX IF NOT EXISTS idx_questions_scorecard_version_seq
    ON scorecard_questions (scorecard_id, scorecard_version, sequence);

CREATE INDEX IF NOT EXISTS idx_questions_question_id
    ON scorecard_questions (question_id);

DROP INDEX IF EXISTS idx_scorecards_lineage_version;
CREATE INDEX IF NOT EXISTS idx_scorecards_id_version_desc
    ON scorecards (scorecard_id, version DESC);
