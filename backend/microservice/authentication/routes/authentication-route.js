const express = require("express");
const router = express.Router();
const CONFIG = require("../../../common/utils/config-util");
const AUTHENTICATIONCONTROLLER = require("../controller/authentication-controller");
const AUTHENTICATIONCONTROLLERINST = new AUTHENTICATIONCONTROLLER(CONFIG);
const CONFIGHANDLER = require("../../../common/middlewares/config-handler");
const CONFIGHANDLERINST = new CONFIGHANDLER(CONFIG);
const JwtMiddleware = require("../../../common/utils/check-jwt");
const JWTMIDDLEWAREINST = new JwtMiddleware();
const AUTHENTICATIONVALIDATION = require("../middleware/validation/Routes/authentication");
const AUTHENTICATIONVALIDATIONINST = new AUTHENTICATIONVALIDATION(CONFIG);
const uploadLogoFile = require("../middleware/multer-middleware-logo");
const RBACMIDDLEWAREINST = require("../../../common/middlewares/rbac-handler");


// Create user by the customers
router.post(
  "/",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement"]),
  AUTHENTICATIONVALIDATIONINST.createUser,
  AUTHENTICATIONCONTROLLERINST.createUser
);

// we have created this route for the basic user creation, which is used in the signup of the application
router.post(
  "/create-basic-user",
  AUTHENTICATIONVALIDATIONINST.createUser,
  AUTHENTICATIONCONTROLLERINST.createUser
);


router.patch(
  "/",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement"]),
  AUTHENTICATIONVALIDATIONINST.updateUser,
  AUTHENTICATIONCONTROLLERINST.updateUser
);


router.patch(
  "/reset-password",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Worker Assist/WA Users","Agent Assist/Users Management","Password-update"]),
  CONFIGHANDLERINST.fetchCustomerConfig,
  AUTHENTICATIONCONTROLLERINST.updatePassword
);

router.patch(
  "/keycloak/password",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Password-update"]),
  AUTHENTICATIONVALIDATIONINST.updateKeycloakUserPassword,
  AUTHENTICATIONCONTROLLERINST.updateKeycloakUserPassword
);


router.get(
  "/get-user/:id",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Worker Assist/WA Users","Agent Assist/Users Management"]),
  AUTHENTICATIONCONTROLLERINST.getUserByID
);

router.get(
  "/user-tenant/:email",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement"]),
  AUTHENTICATIONCONTROLLERINST.getUserTenantMapping
);
//here
router.delete(
  "/",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Worker Assist/WA Users","Agent Assist/Users Management"]),
  AUTHENTICATIONVALIDATIONINST.deleteUser,
  AUTHENTICATIONCONTROLLERINST.deleteUser
);

router.post(
  "/users/filter",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Worker Assist/WA Users","Agent Assist/Users Management","Usermanagement-readonly"]),
  AUTHENTICATIONVALIDATIONINST.filterUserList,
  AUTHENTICATIONCONTROLLERINST.filterUserList
);



router.patch(
  "/statusUpdate",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Usermanagement","Worker Assist/WA Users","Agent Assist/Users Management"]),
  AUTHENTICATIONVALIDATIONINST.statusUpdate,
  AUTHENTICATIONCONTROLLERINST.statusUpdate
);


router.post(
  "/upload-logo",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Common/Authenticated"]),
  uploadLogoFile,
  CONFIGHANDLERINST.fetchCustomerConfig,
  AUTHENTICATIONCONTROLLERINST.uploadLogo
);

router.get(
  "/fetch-logo/:tenant_id",
  CONFIGHANDLERINST.fetchCustomerConfig,
  AUTHENTICATIONCONTROLLERINST.fetchLogo
);

// first run process
router.get(
  "/test-mysql-connection",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.testMysqlConnection
);
router.get(
  "/test-mongo-connection",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.testMongoConnection
);
router.get(
  "/test-redis-connection",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.testRedisConnection
);

// first run db restoration
router.get(
  "/restore-mysql-db",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.restoreMysqlDbTable
);
// new first run status API's for Mysql and used in AVA
router.get(
  "/get-first-run-status-mysql/:domain",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.getFirstRunStatusInMysql
);
router.patch(
  "/update-first-run-status-mysql",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Setup Environment"]),
  AUTHENTICATIONCONTROLLERINST.updateFirstRunStatusInMysql
);

router.post("/keycloak-login", AUTHENTICATIONVALIDATIONINST.keycloakLogin, AUTHENTICATIONCONTROLLERINST.keycloakLogin);


router.get("/platform-config/:config_key_name",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Common/Authenticated"]),
  AUTHENTICATIONCONTROLLERINST.getConfigValueThoughKeyName
);

router.post("/create-platform-config",
  JWTMIDDLEWAREINST.checkJwt,
  RBACMIDDLEWAREINST(["Common/Authenticated"]),
  AUTHENTICATIONCONTROLLERINST.createconfigValue
);

router.post("/keycloak-reset-password", AUTHENTICATIONVALIDATIONINST.keycloakForgotPassword, AUTHENTICATIONCONTROLLERINST.forgotPasswordController);

router.get("/execute-iva-to-ava",JWTMIDDLEWAREINST.checkJwt, RBACMIDDLEWAREINST(["Usermanagement"]), AUTHENTICATIONCONTROLLERINST.executeIvaToAvaSqlFile);

module.exports = router;