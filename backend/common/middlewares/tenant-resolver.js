const tenantConnectionManager = require("../database/tenant-connection-manager");
const { runWithTenantPool } = require("../database/tenant-context");

function tenantResolverMiddleware(req, res, next) {
    const tenantId =
        req.headers["x-tenant-id"] ||
        req.body?.tenant_id ||
        req.query?.tenant_id;

    if (!tenantId) {
        return res.status(400).json({
            response: "FAILED",
            error: {
                name: "TENANT_REQUIRED",
                message: "X-Tenant-Id header (or tenant_id in body/query) is required",
                code: 400,
            },
        });
    }

    tenantConnectionManager
        .getPool(String(tenantId))
        .then((pool) => {
            req.tenantDb = pool;
            req.tenantId = String(tenantId);
            runWithTenantPool(pool, () => next());
        })
        .catch((err) => {
            if (err.name === "TenantNotFoundError") {
                return res.status(404).json({
                    response: "FAILED",
                    error: { name: "TENANT_NOT_FOUND", message: err.message, code: 404 },
                });
            }
            if (err.name === "TenantNotActiveError") {
                return res.status(403).json({
                    response: "FAILED",
                    error: { name: "TENANT_NOT_ACTIVE", message: err.message, code: 403 },
                });
            }
            next(err);
        });
}

module.exports = tenantResolverMiddleware;
