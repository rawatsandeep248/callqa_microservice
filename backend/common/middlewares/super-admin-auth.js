const Jwt = require("jsonwebtoken");

/** Platform-level tenant management (Keycloak role). Legacy super_admin accepted during migration. */
const PLATFORM_ADMIN_ROLES = new Set(["ava_admin", "super_admin", "SUPER_ADMIN"]);

function normalizeRoles(role) {
    if (Array.isArray(role)) {
        return role.map(String);
    }
    if (role != null && role !== "") {
        return [String(role)];
    }
    return [];
}

function collectRolesFromRequest(req) {
    const direct = normalizeRoles(req.role || req.headers["rbac_role"]);
    if (direct.length) {
        return direct;
    }
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        const decoded = Jwt.decode(req.tokenInfo) || Jwt.decode(token);
        if (!decoded) {
            return [];
        }
        if (decoded.attributes?.role) {
            return normalizeRoles(decoded.attributes.role);
        }
        if (decoded.role) {
            return normalizeRoles(decoded.role);
        }
    } catch (_) {
        // non-fatal
    }
    return [];
}

function hasPlatformAdminRole(req) {
    return collectRolesFromRequest(req).some((role) => PLATFORM_ADMIN_ROLES.has(role));
}

function superAdminAuthMiddleware(req, res, next) {
    if (!hasPlatformAdminRole(req)) {
        return res.status(403).json({
            response: "FAILED",
            error: {
                name: "FORBIDDEN",
                message: "AVA admin access required",
                code: 403,
            },
        });
    }
    next();
}

function attachUserFromToken(req, res, next) {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (token && req.tokenInfo) {
            const decoded = Jwt.decode(req.tokenInfo) || Jwt.decode(token);
            if (decoded) {
                req.userEmail = decoded.email || decoded.preferred_username;
                req.userId = decoded.sub;
                req.role = req.role || decoded.role || decoded.attributes?.role?.[0];
            }
        }
    } catch (_) {
        // non-fatal
    }
    next();
}

module.exports = { superAdminAuthMiddleware, attachUserFromToken, PLATFORM_ADMIN_ROLES };
