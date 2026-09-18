const { query } = require("../../../common/database/common-pool");

class UserRepository {
    async create({ userId, email, tenantId, role }) {
        const { rows } = await query(
            `INSERT INTO users (user_id, email, tenant_id, role)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, email.toLowerCase(), tenantId, role]
        );
        return rows[0];
    }

    async findByEmail(email) {
        const { rows } = await query(
            `SELECT u.*, t.display_name AS tenant_display_name, t.db_name, t.status AS tenant_status
             FROM users u
             JOIN tenants t ON t.tenant_id = u.tenant_id
             WHERE u.email = $1 AND u.is_active = TRUE`,
            [email.toLowerCase()]
        );
        return rows[0] || null;
    }

    async findByTenantId(tenantId) {
        const { rows } = await query(
            `SELECT * FROM users WHERE tenant_id = $1 ORDER BY created_at DESC`,
            [tenantId]
        );
        return rows;
    }

    async upsert({ userId, email, tenantId, role }) {
        const normalizedEmail = email.trim().toLowerCase();
        const { rows: existing } = await query(
            `SELECT user_id FROM users WHERE email = $1`,
            [normalizedEmail]
        );
        if (existing[0]) {
            const { rows } = await query(
                `UPDATE users
                 SET tenant_id = $2, role = $3, user_id = COALESCE($4, user_id), is_active = TRUE
                 WHERE email = $1
                 RETURNING *`,
                [normalizedEmail, tenantId, role, userId || null]
            );
            return rows[0];
        }
        const { rows } = await query(
            `INSERT INTO users (user_id, email, tenant_id, role)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, normalizedEmail, tenantId, role]
        );
        return rows[0];
    }
}

module.exports = UserRepository;
