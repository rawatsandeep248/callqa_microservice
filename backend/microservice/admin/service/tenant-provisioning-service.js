const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { getAdminPool } = require("../../../common/database/postgres-admin-pool");
const { getBaseConfig } = require("../../../common/database/common-pool");
const { toDbName, evictPool } = require("../../../common/database/tenant-connection-manager");
const TenantRepository = require("../repository/tenant-repository");

class TenantProvisioningService {
    constructor() {
        this.tenantRepository = new TenantRepository();
    }

    async applyScorecardSchema(dbName) {
        const schemaPath = path.join(__dirname, "../../../common/database/sql/scorecard-schema.sql");
        const migratePath = path.join(__dirname, "../../../common/database/sql/migrate-to-two-table-schema.sql");
        const pool = new Pool(getBaseConfig(dbName));
        try {
            await pool.query(fs.readFileSync(schemaPath, "utf8"));
            await pool.query(fs.readFileSync(migratePath, "utf8"));
        } finally {
            await pool.end();
        }
    }

    async createDatabase(dbName) {
        const adminPool = getAdminPool();
        const { rows } = await adminPool.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );
        if (rows.length) {
            return;
        }
        await adminPool.query(`CREATE DATABASE "${dbName}"`);
    }

    async provisionTenant({ tenantId, displayName, createdBy }) {
        const dbName = toDbName(tenantId);
        const existing = await this.tenantRepository.findById(tenantId);
        if (existing) {
            throw new Error(`Tenant already exists: ${tenantId}`);
        }

        const tenant = await this.tenantRepository.create({
            tenantId,
            displayName,
            dbName,
            createdBy,
            status: "PENDING",
        });
        const job = await this.tenantRepository.createProvisioningJob(tenantId);

        setImmediate(() => {
            this._runProvisioning(job.job_id, tenantId, dbName).catch((err) => {
                console.error(`[provisionTenant] failed for ${tenantId}:`, err);
            });
        });

        return { tenant, job };
    }

    async _runProvisioning(jobId, tenantId, dbName) {
        try {
            await this.tenantRepository.updateProvisioningJob(jobId, {
                status: "RUNNING",
                step: "CREATE_DATABASE",
            });
            await this.createDatabase(dbName);

            await this.tenantRepository.updateProvisioningJob(jobId, {
                status: "RUNNING",
                step: "RUN_SCHEMA",
            });
            await this.applyScorecardSchema(dbName);

            await this.tenantRepository.updateStatus(tenantId, "ACTIVE");
            await this.tenantRepository.updateProvisioningJob(jobId, {
                status: "COMPLETED",
                step: "DONE",
            });
        } catch (err) {
            await this.tenantRepository.updateStatus(tenantId, "FAILED");
            await this.tenantRepository.updateProvisioningJob(jobId, {
                status: "FAILED",
                step: "ERROR",
                error: err.message,
            });
            throw err;
        }
    }

    async suspendTenant(tenantId) {
        const tenant = await this.tenantRepository.updateStatus(tenantId, "SUSPENDED");
        await evictPool(tenantId);
        return tenant;
    }

    async activateTenant(tenantId) {
        return this.tenantRepository.updateStatus(tenantId, "ACTIVE");
    }
}

module.exports = TenantProvisioningService;
