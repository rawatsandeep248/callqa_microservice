const KeycloakAdminUtil = require("../../../common/utils/keycloak-admin-util");
const UserRepository = require("../repository/user-repository");
const TenantRepository = require("../repository/tenant-repository");

const PLATFORM_ADMIN_ROLES = new Set(["ava_admin", "super_admin", "SUPER_ADMIN"]);

function normalizeRoles(roles) {
    if (Array.isArray(roles)) {
        return roles.map(String);
    }
    if (roles) {
        return [String(roles)];
    }
    return [];
}

function isPlatformAdminRole(roles) {
    return normalizeRoles(roles).some((role) => PLATFORM_ADMIN_ROLES.has(role));
}

/** Tenant-scoped app users must have a row in common_db.users (Keycloak does not store tenant_id). */
function requiresTenantDbRecord(roles) {
    const normalized = normalizeRoles(roles);
    if (!normalized.length) {
        return false;
    }
    return !isPlatformAdminRole(normalized);
}

class AdminUserService {
    constructor(config) {
        this.config = config;
        this.keycloakAdmin = new KeycloakAdminUtil(config);
        this.userRepository = new UserRepository();
        this.tenantRepository = new TenantRepository();
    }

    requiresTenantDbRecord(roles) {
        return requiresTenantDbRecord(roles);
    }

    isPlatformAdminRole(roles) {
        return isPlatformAdminRole(roles);
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
            tenantId: null,
        });

        const user = await this.userRepository.create({
            userId: keycloakUser.id,
            email,
            tenantId,
            role: role || "tenant_admin",
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
     * Resolves tenant context during keycloak-login and /auth/me.
     * common_db.users is the source of truth for tenant_id (not Keycloak attributes).
     */
    async resolveLoginContext(email, roles) {
        const keycloakRoles = normalizeRoles(roles);
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (isPlatformAdminRole(keycloakRoles)) {
            return {
                is_super_admin: true,
                role: Array.from(new Set([...keycloakRoles, "ava_admin"])),
            };
        }

        const context = await this.getUserContextByEmail(normalizedEmail);
        if (!context) {
            if (requiresTenantDbRecord(keycloakRoles)) {
                const err = new Error(
                    "User account is not linked to a tenant. Contact your administrator."
                );
                err.code = "TENANT_NOT_PROVISIONED";
                throw err;
            }
            return {
                is_super_admin: false,
                role: keycloakRoles,
            };
        }

        const mergedRoles = Array.from(
            new Set([...keycloakRoles, context.role].filter(Boolean))
        );

        if (context.tenant_status && context.tenant_status !== "ACTIVE") {
            const err = new Error(`Tenant is not active: ${context.tenant_status}`);
            err.code = "TENANT_INACTIVE";
            throw err;
        }

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

    async getTenantMappingByEmail(email) {
        return this.getUserContextByEmail(email);
    }

    async linkUserToTenant({ email, tenantId, role, keycloakUserId }) {
        if (!tenantId) {
            throw new Error("tenant_id is required");
        }
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new Error(`Tenant not found: ${tenantId}`);
        }
        if (tenant.status !== "ACTIVE") {
            throw new Error(`Tenant is not active: ${tenant.status}`);
        }

        let userId = keycloakUserId;
        if (!userId) {
            const users = await this.keycloakAdmin.findUserByEmail(email);
            userId = users[0]?.id;
        }
        if (!userId) {
            throw new Error("Keycloak user not found for tenant linking");
        }
        return this.userRepository.upsert({
            userId,
            email,
            tenantId,
            role: role || "tenant_admin",
        });
    }
}

module.exports = AdminUserService;
