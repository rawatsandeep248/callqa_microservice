#!/usr/bin/env node
/**
 * Applies scorecard PostgreSQL schema.
 * Usage: NODE_ENV=development node scripts/run-postgres-migration.js
 */
const FS = require("fs");
const PATH = require("path");
const { getPool } = require("../common/database/database-postgres");

async function main() {
    const schemaPath = PATH.join(__dirname, "../common/database/sql/scorecard-schema.sql");
    const migratePath = PATH.join(__dirname, "../common/database/sql/migrate-to-two-table-schema.sql");
    const pool = getPool();
    try {
        await pool.query(FS.readFileSync(schemaPath, "utf8"));
        await pool.query(FS.readFileSync(migratePath, "utf8"));
        console.log("PostgreSQL schema applied (2-table scorecard + dropdown configs).");
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});
