const { Pool } = require("pg");
const CONFIG = require("../utils/config-util");

let pool = null;

function getBaseConfig(database) {
    return {
        host: CONFIG.get("postgres:host") || "localhost",
        port: parseInt(CONFIG.get("postgres:port") || "5432", 10),
        database,
        user: CONFIG.get("postgres:user") || process.env.USER,
        password: CONFIG.get("postgres:password") || undefined,
        max: parseInt(CONFIG.get("postgres:common_max_connections") || "10", 10),
        idleTimeoutMillis: 30000,
    };
}

function getCommonPool() {
    if (!pool) {
        const dbName = CONFIG.get("postgres:common_database") || "callqa_common";
        pool = new Pool(getBaseConfig(dbName));
        pool.on("error", (err) => {
            console.error("[common-pool] idle client error", err);
        });
    }
    return pool;
}

async function query(text, params) {
    return getCommonPool().query(text, params);
}

async function withTransaction(fn) {
    const client = await getCommonPool().connect();
    try {
        await client.query("BEGIN");
        const result = await fn(client);
        await client.query("COMMIT");
        return result;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { getCommonPool, query, withTransaction, getBaseConfig };
