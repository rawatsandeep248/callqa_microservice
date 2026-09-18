const express = require("express");
const router = express.Router();
const CONFIG = require("../../../common/utils/config-util");
const ScorecardController = require("../controller/scorecard-controller");
const SCORECARDCONTROLLERINST = new ScorecardController(CONFIG);
const ScorecardValidation = require("../middlewares/validation/routes/scorecard-validation");
const SCORECARDVALIDATIONINST = new ScorecardValidation();
const JwtMiddleware = require("../../../common/utils/check-jwt");
const JWTMIDDLEWAREINST = new JwtMiddleware();
const RBACMIDDLEWAREINST = require("../../../common/middlewares/rbac-handler");
const tenantResolverMiddleware = require("../../../common/middlewares/tenant-resolver");

router.use(JWTMIDDLEWAREINST.checkJwt);
router.use(tenantResolverMiddleware);
// router.use(RBACMIDDLEWAREINST(["Scorecard/Management"]));

// Scorecard CRUD
router.post("/create", SCORECARDCONTROLLERINST.createScorecard);
router.post("/list", SCORECARDCONTROLLERINST.listScorecards);
router.get("/detail/:scorecard_id", SCORECARDCONTROLLERINST.getScorecardById);
router.get("/versions/:lineage_id", SCORECARDCONTROLLERINST.getScorecardVersions);
router.patch("/update", SCORECARDCONTROLLERINST.updateScorecard);
// Applies the org-wide AI provider/model to every scorecard
router.patch("/ai-config", SCORECARDCONTROLLERINST.updateAiConfigForAll);
router.delete("/delete/:scorecard_id", SCORECARDCONTROLLERINST.deleteScorecard);

// Platform dropdown configs — admin-editable Channel/State lists (module_name: qa_automation_v2)
router.post("/dropdown-config", SCORECARDVALIDATIONINST.validateCreatePlatformDropdownConfig, SCORECARDCONTROLLERINST.createDropdownConfig);
router.get("/dropdown-config", SCORECARDCONTROLLERINST.getAllDropdownConfigs);
router.patch("/dropdown-config/:id", SCORECARDVALIDATIONINST.validatePlatformDropdownConfigId, SCORECARDVALIDATIONINST.validatePlatformDropdownConfigValueAction, SCORECARDCONTROLLERINST.updateDropdownConfigValue);

// Lifecycle
router.patch("/publish", SCORECARDCONTROLLERINST.publishScorecard);
router.post("/draft", SCORECARDCONTROLLERINST.createDraft);
router.patch("/disable", SCORECARDCONTROLLERINST.disableScorecard);
router.patch("/enable",  SCORECARDCONTROLLERINST.enableScorecard);
router.patch("/archive", SCORECARDCONTROLLERINST.archiveScorecard);

// Section management
router.post("/section/add", SCORECARDCONTROLLERINST.addSection);
router.patch("/section/update", SCORECARDCONTROLLERINST.updateSection);
router.delete("/section/remove", SCORECARDCONTROLLERINST.removeSection);

// Question management
router.post("/question/add", SCORECARDCONTROLLERINST.addQuestion);
router.patch("/question/update", SCORECARDCONTROLLERINST.updateQuestion);
router.delete("/question/remove", SCORECARDCONTROLLERINST.removeQuestion);

// Publish validation (non-destructive — call before publish)
router.get("/validate/:scorecard_id", SCORECARDCONTROLLERINST.validateScorecard);

// Export / Import
router.get("/export/:scorecard_id", SCORECARDCONTROLLERINST.exportScorecard);
router.post("/import", SCORECARDCONTROLLERINST.importScorecard);

router.post("/audit", SCORECARDCONTROLLERINST.createScorecardAuditLog );
router.get("/audit/:scorecard_id", SCORECARDCONTROLLERINST.getScorecardAuditLogByScorecardId);

// OpenAI voices
router.get("/openai/models", SCORECARDCONTROLLERINST.fetchOpenaiModels);


module.exports = router;
