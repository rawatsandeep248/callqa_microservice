const Jwt = require("jsonwebtoken");

const SUPER_ADMIN_ROLES = new Set(["super_admin", "SUPER_ADMIN"]);

function superAdminAuthMiddleware(req, res, next) {
    const role = req.role || req.headers["rbac_role"];
    if (!role || !SUPER_ADMIN_ROLES.has(String(role))) {
        return res.status(403).json({
            response: "FAILED",
            error: {
                name: "FORBIDDEN",
                message: "Super admin access required",
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
                req.role = req.role || decoded.role;
            }
        }
    } catch (_) {
        // non-fatal
    }
    next();
}

module.exports = { superAdminAuthMiddleware, attachUserFromToken };
