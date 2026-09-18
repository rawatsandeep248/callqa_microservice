const { Pool } = require("pg");
const { getBaseConfig } = require("./common-pool");
const { query: commonQuery } = require("./common-pool");

const poolCache = new Map();

class TenantNotFoundError extends Error {
    constructor(tenantId) {
        super(`Tenant not found: ${tenantId}`);
        this.name = "TenantNotFoundError";
        this.tenantId = tenantId;
    }
}

class TenantNotActiveError extends Error {
    constructor(tenantId, status) {
        super(`Tenant ${tenantId} is ${status}`);
        this.name = "TenantNotActiveError";
        this.tenantId = tenantId;
        this.status = status;
    }
}

function toDbName(tenantId) {
    const safe = String(tenantId)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
    return `callqa_${safe}`;
}

async function getPool(tenantId) {
    if (!tenantId) {
        throw new Error("tenant_id is required");
    }

    if (poolCache.has(tenantId)) {
        return poolCache.get(tenantId);
    }

    const { rows } = await commonQuery(
        `SELECT tenant_id, db_name, status FROM tenants WHERE tenant_id = $1`,
        [tenantId]
    );

    if (!rows.length) {
        throw new TenantNotFoundError(tenantId);
    }

    const tenant = rows[0];
    if (tenant.status !== "ACTIVE") {
        throw new TenantNotActiveError(tenantId, tenant.status);
    }

    const pool = new Pool({
        ...getBaseConfig(tenant.db_name),
        max: parseInt(process.env.TENANT_POOL_MAX || "10", 10),
    });

    pool.on("error", () => {
        poolCache.delete(tenantId);
    });

    poolCache.set(tenantId, pool);
    return pool;
}

async function evictPool(tenantId) {
    const pool = poolCache.get(tenantId);
    if (pool) {
        await pool.end().catch(() => {});
        poolCache.delete(tenantId);
    }
}

async function listActiveTenants() {
    const { rows } = await commonQuery(
        `SELECT tenant_id, db_name FROM tenants WHERE status = 'ACTIVE' ORDER BY created_at ASC`
    );
    return rows;
}

module.exports = {
    getPool,
    evictPool,
    listActiveTenants,
    toDbName,
    TenantNotFoundError,
    TenantNotActiveError,
};
