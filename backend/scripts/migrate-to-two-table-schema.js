#!/usr/bin/env node
/**
 * Migrates scorecard storage from 4-table to 2-table design:
 *   - Embeds sections (with question_id refs) as JSONB on scorecards
 *   - Drops legacy sections + section_questions tables
 *
 * Usage:
 *   NODE_ENV=development node scripts/migrate-to-two-table-schema.js
 *
 * For a fresh DB, run postgres:migrate instead (applies full schema).
 * Run this when upgrading an existing DB that has the old 4-table layout.
 */
const FS = require("fs");
const PATH = require("path");
const { getPool } = require("../common/database/database-postgres");

async function main() {
    const baseSchema = PATH.join(__dirname, "../common/database/sql/scorecard-schema.sql");
    const migration = PATH.join(__dirname, "../common/database/sql/migrate-to-two-table-schema.sql");

    const pool = getPool();
    try {
        // Ensure base tables exist (idempotent CREATE IF NOT EXISTS)
        await pool.query(FS.readFileSync(baseSchema, "utf8"));
        // Apply 2-table migration (backfill + drop legacy tables)
        await pool.query(FS.readFileSync(migration, "utf8"));

        const { rows } = await pool.query(`
            SELECT
                (SELECT COUNT(*)::int FROM scorecards) AS scorecards,
                (SELECT COUNT(*)::int FROM scorecard_questions) AS questions,
                (SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables
                    WHERE table_name = 'sections'
                )) AS legacy_sections_remain
        `);
        const stats = rows[0];
        console.log("2-table migration complete.");
        console.log(`  scorecards:          ${stats.scorecards}`);
        console.log(`  scorecard_questions: ${stats.questions}`);
        console.log(`  legacy sections table removed: ${!stats.legacy_sections_remain}`);
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});
