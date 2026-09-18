const express = require("express");
const router = express.Router();
const CONFIG = require("../../../common/utils/config-util");
const JwtMiddleware = require("../../../common/utils/check-jwt");
const {
    superAdminAuthMiddleware,
    attachUserFromToken,
} = require("../../../common/middlewares/super-admin-auth");
const TenantController = require("../controller/tenant-controller");
const AuthContextController = require("../controller/auth-context-controller");

const JWTMIDDLEWAREINST = new JwtMiddleware();
const TENANTCONTROLLER = new TenantController(CONFIG);
const AUTHCONTEXTCONTROLLER = new AuthContextController(CONFIG);

router.use(JWTMIDDLEWAREINST.checkJwt);
router.use(attachUserFromToken);

// Available to any authenticated user (returns tenant_id for normal users)
router.get("/auth/me", AUTHCONTEXTCONTROLLER.getMe);

// AVA admin (platform tenant management) only
router.use(superAdminAuthMiddleware);

router.post("/tenants", TENANTCONTROLLER.createTenant);
router.get("/tenants", TENANTCONTROLLER.listTenants);
router.get("/tenants/:tenant_id", TENANTCONTROLLER.getTenant);
router.patch("/tenants/:tenant_id/suspend", TENANTCONTROLLER.suspendTenant);
router.patch("/tenants/:tenant_id/activate", TENANTCONTROLLER.activateTenant);
router.get("/tenants/:tenant_id/provisioning", TENANTCONTROLLER.getProvisioningStatus);
router.post("/tenants/:tenant_id/users", TENANTCONTROLLER.createTenantUser);
router.get("/tenants/:tenant_id/users", TENANTCONTROLLER.listTenantUsers);

module.exports = router;
