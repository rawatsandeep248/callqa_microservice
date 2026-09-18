const { query, withTransaction } = require("../../../common/database/common-pool");

class TenantRepository {
    async create({ tenantId, displayName, dbName, createdBy, status = "PENDING" }) {
        const { rows } = await query(
            `INSERT INTO tenants (tenant_id, display_name, db_name, status, created_by)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [tenantId, displayName, dbName, status, createdBy]
        );
        return rows[0];
    }

    async findById(tenantId) {
        const { rows } = await query(`SELECT * FROM tenants WHERE tenant_id = $1`, [tenantId]);
        return rows[0] || null;
    }

    async findAll() {
        const { rows } = await query(`SELECT * FROM tenants ORDER BY created_at DESC`);
        return rows;
    }

    async updateStatus(tenantId, status) {
        const { rows } = await query(
            `UPDATE tenants SET status = $2, updated_at = NOW() WHERE tenant_id = $1 RETURNING *`,
            [tenantId, status]
        );
        return rows[0] || null;
    }

    async createProvisioningJob(tenantId) {
        const { rows } = await query(
            `INSERT INTO provisioning_jobs (tenant_id, status, step)
             VALUES ($1, 'PENDING', 'INIT')
             RETURNING *`,
            [tenantId]
        );
        return rows[0];
    }

    async updateProvisioningJob(jobId, { status, step, error = null }) {
        const completedAt = status === "COMPLETED" || status === "FAILED" ? new Date() : null;
        const { rows } = await query(
            `UPDATE provisioning_jobs
             SET status = $2, step = $3, error = $4, completed_at = COALESCE($5, completed_at)
             WHERE job_id = $1
             RETURNING *`,
            [jobId, status, step, error, completedAt]
        );
        return rows[0] || null;
    }

    async getLatestJob(tenantId) {
        const { rows } = await query(
            `SELECT * FROM provisioning_jobs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [tenantId]
        );
        return rows[0] || null;
    }
}

module.exports = TenantRepository;
