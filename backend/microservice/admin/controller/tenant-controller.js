const TenantRepository = require("../repository/tenant-repository");
const TenantProvisioningService = require("../service/tenant-provisioning-service");
const AdminUserService = require("../service/admin-user-service");

class TenantController {
    constructor(config) {
        this.config = config;
        this.tenantRepository = new TenantRepository();
        this.provisioningService = new TenantProvisioningService();
        this.adminUserService = new AdminUserService(config);

        this.createTenant = this.createTenant.bind(this);
        this.listTenants = this.listTenants.bind(this);
        this.getTenant = this.getTenant.bind(this);
        this.suspendTenant = this.suspendTenant.bind(this);
        this.activateTenant = this.activateTenant.bind(this);
        this.getProvisioningStatus = this.getProvisioningStatus.bind(this);
        this.createTenantUser = this.createTenantUser.bind(this);
        this.listTenantUsers = this.listTenantUsers.bind(this);
    }

    async createTenant(req, res, next) {
        try {
            const { tenant_id, display_name } = req.body;
            if (!tenant_id || !display_name) {
                return res.status(400).json({
                    response: "FAILED",
                    error: { message: "tenant_id and display_name are required", code: 400 },
                });
            }

            const createdBy = req.userEmail || req.body.created_by || "ava_admin";
            const result = await this.provisioningService.provisionTenant({
                tenantId: tenant_id,
                displayName: display_name,
                createdBy,
            });

            res.status(202).json({
                response: "SUCCESS",
                data: result,
                error: null,
            });
        } catch (err) {
            next(err);
        }
    }

    async listTenants(req, res, next) {
        try {
            const tenants = await this.tenantRepository.findAll();
            res.status(200).json({ response: "SUCCESS", data: tenants, error: null });
        } catch (err) {
            next(err);
        }
    }

    async getTenant(req, res, next) {
        try {
            const tenant = await this.tenantRepository.findById(req.params.tenant_id);
            if (!tenant) {
                return res.status(404).json({
                    response: "FAILED",
                    error: { message: "Tenant not found", code: 404 },
                });
            }
            res.status(200).json({ response: "SUCCESS", data: tenant, error: null });
        } catch (err) {
            next(err);
        }
    }

    async suspendTenant(req, res, next) {
        try {
            const tenant = await this.provisioningService.suspendTenant(req.params.tenant_id);
            res.status(200).json({ response: "SUCCESS", data: tenant, error: null });
        } catch (err) {
            next(err);
        }
    }

    async activateTenant(req, res, next) {
        try {
            const tenant = await this.provisioningService.activateTenant(req.params.tenant_id);
            res.status(200).json({ response: "SUCCESS", data: tenant, error: null });
        } catch (err) {
            next(err);
        }
    }

    async getProvisioningStatus(req, res, next) {
        try {
            const job = await this.tenantRepository.getLatestJob(req.params.tenant_id);
            res.status(200).json({ response: "SUCCESS", data: job, error: null });
        } catch (err) {
            next(err);
        }
    }

    async createTenantUser(req, res, next) {
        try {
            const { email, name, password, role } = req.body;
            const tenantId = req.params.tenant_id;
            if (!email || !password) {
                return res.status(400).json({
                    response: "FAILED",
                    error: { message: "email and password are required", code: 400 },
                });
            }
            const result = await this.adminUserService.createTenantUser({
                tenantId,
                email,
                name,
                password,
                role,
            });
            res.status(201).json({ response: "SUCCESS", data: result, error: null });
        } catch (err) {
            next(err);
        }
    }

    async listTenantUsers(req, res, next) {
        try {
            const users = await this.adminUserService.listUsersByTenant(req.params.tenant_id);
            res.status(200).json({ response: "SUCCESS", data: users, error: null });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TenantController;
