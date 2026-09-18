const ScorecardService = require("../service/scorecard-service");
const PlatformDropdownConfigsService = require("../service/platform-dropdown-configs-service");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const CommonUtil = require("../../../common/utils/common-util");
const OpenAI = require("openai/index.js");
const RestUtil = require("../../../common/utils/rest-util");
class ScorecardController {
    constructor(config) {
        this.config = config;
        this.restUtil = new RestUtil(config);
        this.scorecardService = new ScorecardService(config);
        this.openaiClient = new OpenAI({
            apiKey: this.config.get("openai:api_key"),
            baseURL: this.config.get("openai:base_url"),
          });
        // Generic, module-agnostic service — same collection as review-queue's
        // dropdown configs, isolated by module_name ("qa_automation_v2" here).
        this.platformDropdownConfigsService = new PlatformDropdownConfigsService(config);
        this.createScorecard = this.createScorecard.bind(this);
        this.listScorecards = this.listScorecards.bind(this);
        this.getScorecardById = this.getScorecardById.bind(this);
        this.getScorecardVersions = this.getScorecardVersions.bind(this);
        this.updateScorecard = this.updateScorecard.bind(this);
        this.updateAiConfigForAll = this.updateAiConfigForAll.bind(this);
        this.createDropdownConfig = this.createDropdownConfig.bind(this);
        this.getAllDropdownConfigs = this.getAllDropdownConfigs.bind(this);
        this.updateDropdownConfigValue = this.updateDropdownConfigValue.bind(this);
        this.publishScorecard = this.publishScorecard.bind(this);
        this.createDraft = this.createDraft.bind(this);
        this.disableScorecard = this.disableScorecard.bind(this);
        this.enableScorecard  = this.enableScorecard.bind(this);
        this.archiveScorecard = this.archiveScorecard.bind(this);
        this.addSection = this.addSection.bind(this);
        this.updateSection = this.updateSection.bind(this);
        this.removeSection = this.removeSection.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.exportScorecard = this.exportScorecard.bind(this);
        this.importScorecard = this.importScorecard.bind(this);
        this.deleteScorecard = this.deleteScorecard.bind(this);
        this.createScorecardAuditLog = this.createScorecardAuditLog.bind(this);
        this.getScorecardAuditLogByScorecardId = this.getScorecardAuditLogByScorecardId.bind(this);
        this.validateScorecard = this.validateScorecard.bind(this);
        this.fetchOpenaiModels = this.fetchOpenaiModels.bind(this);
    }

    async createScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.createScorecard(req.body);
            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async listScorecards(req, res, next) {
        try {
            const result = await this.scorecardService.listScorecards(req.body);
            // result.result contains: { data, total, page, limit, totalPages, stats }
            res.success(result.result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async getScorecardById(req, res, next) {
        try {
            const result = await this.scorecardService.getScorecardById({
                scorecard_id: req.params.scorecard_id,
                version: req.query.version != null ? Number(req.query.version) : undefined,
            });
            if (!result.result) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async getScorecardVersions(req, res, next) {
        try {
            const result = await this.scorecardService.getScorecardVersions({
                lineage_id: req.params.lineage_id,
            });
            res.success({ data: result.result || [] }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async updateScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.updateScorecard(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async updateAiConfigForAll(req, res, next) {
        try {
            const result = await this.scorecardService.updateAiConfigForAll(req.body);
            res.success(
                { modified: result.result?.modifiedCount || 0 },
                MESSAGEUTIL.response().SUCCESSFULLY_UPDATED
            );
        } catch (error) {
            next(error);
        }
    }

    // ── Platform dropdown configs (Channel / State admin-editable lists) ──────
    // Same collection/service the review-queue module uses for its own
    // Failure/Topic/Not-bot-reason lists, isolated here by module_name
    // "qa_automation_v2". Exposed under /scorecard rather than /ava-qc so
    // scorecard users aren't gated behind the AVA QC RBAC permission.

    async createDropdownConfig(req, res, next) {
        try {
            const result = await this.platformDropdownConfigsService.createPlatformDropdownConfig(req.body);
            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async getAllDropdownConfigs(req, res, next) {
        try {
            const result = await this.platformDropdownConfigsService.getAllPlatformDropdownConfigs();
            res.success({ data: result.result || [] }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async updateDropdownConfigValue(req, res, next) {
        try {
            const { id } = req.params;
            const { action, dropdown_name, value } = req.body;

            await this.platformDropdownConfigsService.updatePlatformDropdownConfigValue(id, dropdown_name, action, value);

            const message = action === "add"
                ? MESSAGEUTIL.response().SUCCESSFULLY_UPDATED || "Value added successfully"
                : MESSAGEUTIL.response().SUCCESSFULLY_UPDATED || "Value removed successfully";

            res.success({}, message);
        } catch (error) {
            next(error);
        }
    }

    async publishScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.publishScorecard(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST || "Record not found");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async createDraft(req, res, next) {
        try {
            const result = await this.scorecardService.createDraft(req.body);
            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async disableScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.disableScorecard(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST || "Record not found");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async enableScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.enableScorecard(req.body);
            if (result.result && result.result.matchedCount === 0) {
                return res.notFound("Scorecard not found or is not in DISABLED status");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async archiveScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.archiveScorecard(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST || "Record not found");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async addSection(req, res, next) {
        try {
            const result = await this.scorecardService.addSection(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async updateSection(req, res, next) {
        try {
            const result = await this.scorecardService.updateSection(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async removeSection(req, res, next) {
        try {
            const result = await this.scorecardService.removeSection(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async addQuestion(req, res, next) {
        try {
            const result = await this.scorecardService.addQuestion(req.body);
            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async updateQuestion(req, res, next) {
        try {
            const result = await this.scorecardService.updateQuestion(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST || "Record not found");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async removeQuestion(req, res, next) {
        try {
            const result = await this.scorecardService.removeQuestion(req.body);
            if (result.result && result.result.modifiedCount === 0 && result.result.matchedCount === 0) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST || "Record not found");
            }
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } catch (error) {
            next(error);
        }
    }

    async exportScorecard(req, res, next) {
        try {
            const { scorecard_id } = req.params;
            if (!scorecard_id) {
                return res.badRequest("'scorecard_id' is required");
            }
            const version = req.query.version != null ? Number(req.query.version) : undefined;
            const result = await this.scorecardService.exportScorecard(scorecard_id, version);
            res.success(result.result ?? result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async importScorecard(req, res, next) {
        try {
            const result = await this.scorecardService.importScorecard(req.body);
            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async deleteScorecard(req, res, next) {
        try {
            const { scorecard_id } = req.params;
            if (!scorecard_id) {
                return res.badRequest("'scorecard_id' is required");
            }
            const version = req.query.version != null ? Number(req.query.version) : undefined;
            const result = await this.scorecardService.deleteScorecard({ scorecard_id, version });
            res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_DELETED || "Successfully deleted");
        } catch (error) {
            next(error);
        }
    }

    async createScorecardAuditLog(req, res, next) {
        try {
            const result = await this.scorecardService.createAuditLog({
                ...req.body,
                ip_address: req.body.ip_address || req.ip,
            });

            res.created(result, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } catch (error) {
            next(error);
        }
    }

    async getScorecardAuditLogByScorecardId(req, res, next) {
        try {
            const { scorecard_id } = req.params;
            if (!scorecard_id) {
                return res.badRequest("'id' is required");
            }
            const version = req.query.version != null ? Number(req.query.version) : undefined;
            const result = await this.scorecardService.getAuditLogByScorecardId({ scorecard_id, version });
            if (!result.result) {
                return res.notFound(MESSAGEUTIL.error().RECORD_NOT_EXIST);
            }
            res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }
    // GET /validate/:scorecard_id — returns { errors, warnings } without side effects.
    // errors block publish; warnings are informational.
    async validateScorecard(req, res, next) {
        try {
            const { scorecard_id } = req.params;
            if (!scorecard_id) {
                return res.badRequest("'scorecard_id' is required");
            }
            const version = req.query.version != null ? Number(req.query.version) : undefined;
            const result = await this.scorecardService.validateScorecard(scorecard_id, version);
            res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }

    async fetchOpenaiModels(req, res, next) {
        try {
            const apiKey = this.config.get("openai:api_key");
            const baseUrl = this.config.get("openai:base_url");
      
            if (!apiKey || !baseUrl) {
              console.error("fetchOpenaiModels: OpenAI api_key or base_url is not configured");
              return res.serverError("OpenAI configuration is not available");
            }
      
            const normalizedBaseUrl = String(baseUrl).endsWith("/") ? baseUrl : `${baseUrl}/`;
            const url = `${normalizedBaseUrl}models`;
      
            let responseBody;
            try {
              responseBody = await this.restUtil.getRequest(url, {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                timeout: 15000,
              });
            } catch (err) {
              const status = err?.response?.status;
              const upstreamMessage =
                err?.response?.data?.error?.message || err?.message || "Failed to fetch OpenAI models";
              console.error("fetchOpenaiModels: upstream OpenAI request failed", { status, upstreamMessage });
      
              if (status === 401 || status === 403) {
                return res.serverError("OpenAI authentication failed");
              }
              if (status === 429) {
                return res.serviceUnavailable("OpenAI rate limit exceeded, please try again later");
              }
              return res.serviceUnavailable("Unable to fetch OpenAI models at this time");
            }
      
            const rawModels = Array.isArray(responseBody?.data) ? responseBody.data : [];
            // Limit to chat-capable model families that make sense for an agent's LLM dropdown.
            const CHAT_MODEL_PREFIX_RE = /^(gpt-|chatgpt-|o1|o3|o4)/i;
            const models = rawModels
              .filter((m) => m && typeof m.id === "string" && CHAT_MODEL_PREFIX_RE.test(m.id))
              .map((m) => ({
                value: m.id,
                name: m.id,
                description: "",
              }))
              .sort((a, b) => a.name.localeCompare(b.name));
              
            // const result = await CommonUtil.fetchOpenaiModels(this.openaiClient);
            res.success({models}, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ScorecardController;
