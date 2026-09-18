/**
 * Applies stable scorecard_id / question_id migration (composite PKs).
 * Run: npm run postgres:migrate-stable-ids
 */
const PATH = require("path");
const FS = require("fs");
const { query } = require("../common/database/database-postgres");

async function isCompositePkApplied() {
    const { rows } = await query(
        `SELECT 1
         FROM pg_constraint c
         JOIN pg_class t ON c.conrelid = t.oid
         JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY (c.conkey)
         WHERE t.relname = 'scorecards'
           AND c.contype = 'p'
           AND a.attname = 'version'
         LIMIT 1`
    );
    return rows.length > 0;
}

async function runSql(relativePath) {
    const schemaPath = PATH.join(__dirname, relativePath);
    const sql = FS.readFileSync(schemaPath, "utf8");
    await query(sql);
}

async function main() {
    const already = await isCompositePkApplied();
    if (!already) {
        await runSql("../common/database/sql/migrate-stable-scorecard-ids.sql");
        console.log("Stable scorecard ID migration (composite PKs) applied.");
    } else {
        console.log("Composite PK already present — running post steps only.");
    }

    await runSql("../common/database/sql/migrate-stable-scorecard-ids-post.sql");
    console.log("Post-migration cleanup and draft uniqueness index applied.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
