#!/usr/bin/env node
/**
 * One-time ETL: copy platform_dropdown_configs from MongoDB to PostgreSQL.
 *
 * Usage:
 *   NODE_ENV=development node scripts/run-postgres-migration.js
 *   NODE_ENV=development DRY_RUN=true node scripts/migrate-dropdown-configs-mongo-to-postgres.js
 */
const MONGOOSE = require("mongoose");
const CONFIG = require("../common/utils/config-util");
const MESSAGEUTIL = require("../common/utils/message-util");
const PlatformDropdownConfigsSchema = require("../common/schemas/platform-dropdown-configs");
const PlatformDropdownConfigsRepository = require("../microservice/analytics_and_reporting/repository/platform-dropdown-configs-repository");

const DRY_RUN = process.env.DRY_RUN === "true";
const COLLECTION = MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs;

function getMongoUrl() {
    const database = CONFIG.get("database");
    let url = database.host;
    url = url.replace("$username", database.user);
    url = url.replace("$password", database.password);
    url = url.replace("$database", database.name);
    return url;
}

async function main() {
    const url = getMongoUrl();
    const conn = await MONGOOSE.createConnection(url).asPromise();
    const Model = conn.model(COLLECTION, PlatformDropdownConfigsSchema.getSchema());
    const repo = new PlatformDropdownConfigsRepository();

    const docs = await Model.find({}).lean();
    console.log(`Found ${docs.length} dropdown config(s) in MongoDB`);

    let migrated = 0;
    for (const doc of docs) {
        const id = String(doc._id);
        const payload = {
            id,
            module_name: doc.module_name,
            dropdowns: (doc.dropdowns || []).map((d) => ({
                dropdown_name: d.dropdown_name,
                dropdown_values: d.dropdown_values || [],
            })),
        };

        console.log(`  ${DRY_RUN ? "[DRY RUN] " : ""}${doc.module_name} (${id})`);

        if (!DRY_RUN) {
            try {
                await repo.create(payload);
            } catch (err) {
                if (repo.isUniqueViolation(err)) {
                    await repo.mergeIntoExistingByModuleName(doc.module_name, payload.dropdowns);
                } else {
                    throw err;
                }
            }
        }
        migrated++;
    }

    await conn.close();
    console.log(`Done. ${migrated} config(s) ${DRY_RUN ? "would be" : ""} migrated.`);
}

main().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
