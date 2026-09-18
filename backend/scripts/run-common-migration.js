#!/usr/bin/env node
/**
 * Creates common_db (if missing) and applies control-plane schema.
 * Usage: NODE_ENV=development node scripts/run-common-migration.js
 */
const FS = require("fs");
const PATH = require("path");
const CONFIG = require("../common/utils/config-util");
const { getAdminPool } = require("../common/database/postgres-admin-pool");
const { getCommonPool } = require("../common/database/common-pool");

async function ensureCommonDatabase() {
    const dbName = CONFIG.get("postgres:common_database") || "callqa_common";
    const adminPool = getAdminPool();
    const { rows } = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
    );
    if (!rows.length) {
        await adminPool.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Created database: ${dbName}`);
    } else {
        console.log(`Database already exists: ${dbName}`);
    }
    return dbName;
}

async function main() {
    await ensureCommonDatabase();
    const schemaPath = PATH.join(__dirname, "../common/database/sql/common-schema.sql");
    const pool = getCommonPool();
    try {
        await pool.query(FS.readFileSync(schemaPath, "utf8"));
        console.log("Common DB schema applied (tenants, users, provisioning_jobs).");
    } finally {
        await pool.end();
        await getAdminPool().end();
    }
}

main().catch((err) => {
    console.error("Common migration failed:", err.message);
    process.exit(1);
});
