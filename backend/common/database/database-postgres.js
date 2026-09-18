const { Pool } = require("pg");
const CONFIG = require("../utils/config-util");
const { getTenantPoolFromContext } = require("./tenant-context");

let defaultPool = null;

function getDefaultPool() {
    if (!defaultPool) {
        defaultPool = new Pool({
            host: CONFIG.get("postgres:host") || "localhost",
            port: parseInt(CONFIG.get("postgres:port") || "5432", 10),
            database: CONFIG.get("postgres:database") || "callqa_dev",
            user: CONFIG.get("postgres:user") || process.env.USER,
            password: CONFIG.get("postgres:password") || undefined,
            max: 20,
            idleTimeoutMillis: 30000,
        });
    }
    return defaultPool;
}

function getPool() {
    const tenantPool = getTenantPoolFromContext();
    if (tenantPool) {
        return tenantPool;
    }
    return getDefaultPool();
}

async function query(text, params) {
    return getPool().query(text, params);
}

async function withTransaction(fn) {
    const client = await getPool().connect();
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

module.exports = { getPool, getDefaultPool, query, withTransaction };
