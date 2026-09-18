const KeycloakAdminUtil = require("../../../common/utils/keycloak-admin-util");
const UserRepository = require("../repository/user-repository");
const TenantRepository = require("../repository/tenant-repository");

const SUPER_ADMIN_ROLES = new Set(["super_admin", "SUPER_ADMIN"]);

function normalizeRoles(roles) {
    if (Array.isArray(roles)) {
        return roles.map(String);
    }
    if (roles) {
        return [String(roles)];
    }
    return [];
}

function isSuperAdminRole(roles) {
    return normalizeRoles(roles).some((role) => SUPER_ADMIN_ROLES.has(role));
}

class AdminUserService {
    constructor(config) {
        this.config = config;
        this.keycloakAdmin = new KeycloakAdminUtil(config);
        this.userRepository = new UserRepository();
        this.tenantRepository = new TenantRepository();
    }

    async createTenantUser({ tenantId, email, name, password, role }) {
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new Error(`Tenant not found: ${tenantId}`);
        }
        if (tenant.status !== "ACTIVE") {
            throw new Error(`Tenant is not active: ${tenant.status}`);
        }

        const keycloakUser = await this.keycloakAdmin.createUser({
            email,
            name,
            password,
            role,
            tenantId,
        });

        const user = await this.userRepository.create({
            userId: keycloakUser.id,
            email,
            tenantId,
            role: role || "QA_ANALYST",
        });

        return { user, keycloakUserId: keycloakUser.id };
    }

    async getUserContextByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        return {
            user_id: user.user_id,
            email: user.email,
            tenant_id: user.tenant_id,
            tenant_display_name: user.tenant_display_name,
            db_name: user.db_name,
            tenant_status: user.tenant_status,
            role: user.role,
        };
    }

    /**
     * Resolves tenant / super-admin context during keycloak-login.
     */
    async resolveLoginContext(email, roles) {
        const keycloakRoles = normalizeRoles(roles);

        if (isSuperAdminRole(keycloakRoles)) {
            return {
                is_super_admin: true,
                role: Array.from(new Set([...keycloakRoles, "super_admin"])),
            };
        }

        const context = await this.getUserContextByEmail(email);
        if (!context) {
            return {
                is_super_admin: false,
                role: keycloakRoles,
            };
        }

        const mergedRoles = Array.from(
            new Set([...keycloakRoles, context.role].filter(Boolean))
        );

        return {
            user_id: context.user_id,
            tenant_id: context.tenant_id,
            tenant_display_name: context.tenant_display_name,
            db_name: context.db_name,
            tenant_status: context.tenant_status,
            is_super_admin: false,
            role: mergedRoles.length ? mergedRoles : keycloakRoles,
        };
    }

    async listUsersByTenant(tenantId) {
        return this.userRepository.findByTenantId(tenantId);
    }
}

module.exports = AdminUserService;
