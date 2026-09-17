-- Migration: 4-table scorecard schema → 2-table (sections embedded as JSONB)
-- Safe to re-run: uses IF EXISTS / IF NOT EXISTS guards.
--
-- Run via: npm run postgres:migrate-two-table

-- Step 1: Add sections JSONB column to scorecards (if upgrading from old schema)
ALTER TABLE scorecards
    ADD COLUMN IF NOT EXISTS sections JSONB NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_scorecards_sections ON scorecards USING GIN (sections);

-- Step 2: Backfill sections JSONB from legacy sections + section_questions tables
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'sections'
    ) THEN
        UPDATE scorecards sc
        SET sections = COALESCE(sub.sections_json, '[]'::jsonb)
        FROM (
            SELECT
                s.scorecard_id,
                jsonb_agg(
                    jsonb_build_object(
                        'section_id',         s.section_id,
                        'section_lineage_id', s.section_lineage_id,
                        'name',               s.name,
                        'sequence',           s.sequence,
                        'weighting',          s.weighting,
                        'fail_section',       s.fail_section,
                        'questions',          COALESCE(sq.question_ids, '[]'::jsonb)
                    )
                    ORDER BY s.sequence ASC
                ) AS sections_json
            FROM sections s
            LEFT JOIN LATERAL (
                SELECT jsonb_agg(sq2.question_id ORDER BY sq2.position ASC) AS question_ids
                FROM section_questions sq2
                WHERE sq2.section_id = s.section_id
                  AND sq2.scorecard_id = s.scorecard_id
            ) sq ON TRUE
            GROUP BY s.scorecard_id
        ) sub
        WHERE sc.scorecard_id = sub.scorecard_id;

        RAISE NOTICE 'Backfilled sections JSONB from legacy tables.';
    END IF;
END $$;

-- Step 3: Drop legacy join + section tables
DROP TABLE IF EXISTS section_questions CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
