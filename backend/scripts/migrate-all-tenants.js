#!/usr/bin/env node
/**
 * Applies scorecard schema migrations to all ACTIVE tenant databases.
 * Usage: NODE_ENV=development node scripts/migrate-all-tenants.js
 */
const FS = require("fs");
const PATH = require("path");
const { Pool } = require("pg");
const { getBaseConfig } = require("../common/database/common-pool");
const { listActiveTenants } = require("../common/database/tenant-connection-manager");

async function applySchemaToDb(dbName) {
    const schemaPath = PATH.join(__dirname, "../common/database/sql/scorecard-schema.sql");
    const migratePath = PATH.join(__dirname, "../common/database/sql/migrate-to-two-table-schema.sql");
    const pool = new Pool(getBaseConfig(dbName));
    try {
        await pool.query(FS.readFileSync(schemaPath, "utf8"));
        await pool.query(FS.readFileSync(migratePath, "utf8"));
    } finally {
        await pool.end();
    }
}

async function main() {
    const tenants = await listActiveTenants();
    if (!tenants.length) {
        console.log("No active tenants found.");
        return;
    }

    for (const tenant of tenants) {
        console.log(`Migrating tenant ${tenant.tenant_id} (${tenant.db_name})...`);
        await applySchemaToDb(tenant.db_name);
        console.log(`Done: ${tenant.tenant_id}`);
    }
}

main().catch((err) => {
    console.error("Tenant migration failed:", err.message);
    process.exit(1);
});
