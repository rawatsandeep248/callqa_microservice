const AdminUserService = require("../service/admin-user-service");

class AuthContextController {
    constructor(config) {
        this.config = config;
        this.adminUserService = new AdminUserService(config);
        this.getMe = this.getMe.bind(this);
    }

    async getMe(req, res, next) {
        try {
            const email = req.userEmail || req.query.email;
            const role = req.role || req.headers["rbac_role"];

            if (!email && !role) {
                return res.status(400).json({
                    response: "FAILED",
                    error: { message: "Unable to resolve user from token", code: 400 },
                });
            }

            const context = await this.adminUserService.resolveLoginContext(
                email ? email.trim().toLowerCase() : "",
                role
            );

            if (!context.is_super_admin && !context.tenant_id) {
                return res.status(404).json({
                    response: "FAILED",
                    error: { message: "User not mapped to any tenant", code: 404 },
                });
            }

            res.status(200).json({
                response: "SUCCESS",
                data: {
                    user_id: req.userId || context.user_id,
                    email,
                    ...context,
                },
                error: null,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AuthContextController;
