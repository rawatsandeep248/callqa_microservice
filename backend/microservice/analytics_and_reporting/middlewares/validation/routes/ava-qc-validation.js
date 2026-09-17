const { check, param } = require('express-validator');
const CommonUtil = require('../../../../../common/utils/common-util');

class AvaQcValidation {
    constructor() {
        this.validateUpload = this.validateUpload.bind(this);
        this.validateGetDevAttention = this.validateGetDevAttention.bind(this);
        this.validateGetAuditDetail = this.validateGetAuditDetail.bind(this);
        this.validateCreatePlatformDropdownConfig = this.validateCreatePlatformDropdownConfig.bind(this);
        this.validatePlatformDropdownConfigId = this.validatePlatformDropdownConfigId.bind(this);
        this.validatePlatformDropdownConfigValueAction = this.validatePlatformDropdownConfigValueAction.bind(this);
        this.validateAddActivityNote = this.validateAddActivityNote.bind(this);
        this.validateGetActivityNotes = this.validateGetActivityNotes.bind(this);
        this.validateSubmitQcReview = this.validateSubmitQcReview.bind(this);
        this.validateUpdateJiraTicketStatus = this.validateUpdateJiraTicketStatus.bind(this);
        this.validateExportReviewQueue = this.validateExportReviewQueue.bind(this);
        this.validateSummaryDistribution = this.validateSummaryDistribution.bind(this);
        this.validateJiraTickets = this.validateJiraTickets.bind(this);
    }

    async validateUpload(req, res, next) {
        await check('uploadedBy')
            .notEmpty()
            .withMessage('uploadedBy is required')
            .isString()
            .withMessage('uploadedBy must be a string')
            .run(req);

        if (!req.files?.devAttentionFile?.[0]) {
            return res.badRequest("devAttentionFile is required");
        }
        if (!req.files?.auditDetailFile?.[0]) {
            return res.badRequest("auditDetailFile is required");
        }

        const allowedExtensions = [".xlsx", ".xls", ".csv"];
        const devAttentionExt = req.files.devAttentionFile[0].originalname
            .toLowerCase()
            .slice(req.files.devAttentionFile[0].originalname.lastIndexOf("."));
        const auditExt = req.files.auditDetailFile[0].originalname
            .toLowerCase()
            .slice(req.files.auditDetailFile[0].originalname.lastIndexOf("."));

        if (!allowedExtensions.includes(devAttentionExt)) {
            return res.badRequest("devAttentionFile must be .xlsx, .xls or .csv");
        }
        if (!allowedExtensions.includes(auditExt)) {
            return res.badRequest("auditDetailFile must be .xlsx, .xls or .csv");
        }

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST dev attention records request body
    async validateGetDevAttention(req, res, next) {
        await check('limit')
            .notEmpty()
            .withMessage('limit is required')
            .isInt({ min: 1 })
            .withMessage('limit must be a positive integer')
            .run(req);

        await check('offset')
            .notEmpty()
            .withMessage('offset is required')
            .isInt({ min: 0 })
            .withMessage('offset must be a non-negative integer')
            .run(req);

        await check('condition.timezone')
            .notEmpty()
            .withMessage('timezone is required')
            .isString()
            .withMessage('timezone must be a string')
            .run(req);

        await check('condition.call_date.start_date')
            .notEmpty()
            .withMessage('start_date is required')
            .isISO8601()
            .withMessage('start_date must be a valid date')
            .run(req);

        await check('condition.call_date.end_date')
            .notEmpty()
            .withMessage('end_date is required')
            .isISO8601()
            .withMessage('end_date must be a valid date')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate GET audit detail by interaction ID
    async validateGetAuditDetail(req, res, next) {
        await param('interactionId')
            .notEmpty()
            .withMessage('interactionId is required')
            .isString()
            .withMessage('interactionId must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async validateCreatePlatformDropdownConfig(req, res, next) {
        await check('module_name')
            .notEmpty()
            .withMessage('module_name is required')
            .isString()
            .withMessage('module_name must be a string')
            .run(req);

        await check('dropdowns')
            .notEmpty()
            .withMessage('dropdowns is required')
            .isArray({ min: 1 })
            .withMessage('dropdowns must be a non-empty array')
            .run(req);

        await check('dropdowns.*.dropdown_name')
            .notEmpty()
            .withMessage('dropdown_name is required in each dropdown')
            .isString()
            .withMessage('dropdown_name must be a string')
            .run(req);

        await check('dropdowns.*.dropdown_values')
            .notEmpty()
            .withMessage('dropdown_values is required in each dropdown')
            .isArray({ min: 1 })
            .withMessage('dropdown_values must be a non-empty array')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST add-activity-note body
    async validateAddActivityNote(req, res, next) {
        await check('interaction_id')
            .notEmpty()
            .withMessage('interaction_id is required')
            .isString()
            .withMessage('interaction_id must be a string')
            .run(req);

        await check('note')
            .notEmpty()
            .withMessage('note is required')
            .isString()
            .withMessage('note must be a string')
            .run(req);

        await check('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be a valid email address')
            .run(req);

        await check('created_at')
            .notEmpty()
            .withMessage('created_at is required')
            .isString()
            .withMessage('created_at must be a string')
            .run(req);

        await check('created_by')
            .notEmpty()
            .withMessage('created_by is required')
            .isString()
            .withMessage('created_by must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async validatePlatformDropdownConfigId(req, res, next) {
        await param('id')
            .notEmpty()
            .withMessage('id is required')
            .isMongoId()
            .withMessage('id must be a valid MongoDB ObjectId')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate GET activity-notes by interaction ID
    async validateGetActivityNotes(req, res, next) {
        await param('interactionId')
            .notEmpty()
            .withMessage('interactionId is required')
            .isString()
            .withMessage('interactionId must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async validatePlatformDropdownConfigValueAction(req, res, next) {
        await check('action')
            .notEmpty()
            .withMessage('action is required')
            .isIn(['add', 'remove'])
            .withMessage('action must be either "add" or "remove"')
            .run(req);

        await check('dropdown_name')
            .notEmpty()
            .withMessage('dropdown_name is required')
            .isString()
            .withMessage('dropdown_name must be a string')
            .run(req);

        await check('value')
            .notEmpty()
            .withMessage('value is required')
            .isString()
            .withMessage('value must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST submit-qc-review body
    // reopen:true  → clear decision → Inbox
    // pending:true → park (status-only move, decision/tickets unchanged)
    // Otherwise    → defect_action with real_defect / not_a_defect
    async validateSubmitQcReview(req, res, next) {
        await check('interaction_id')
            .notEmpty()
            .withMessage('interaction_id is required')
            .isString()
            .withMessage('interaction_id must be a string')
            .run(req);

        const isReopen  = req.body?.reopen  === true;
        const isPending = req.body?.pending === true;

        // Optional note fields (used for pending activity log)
        await check('note')
            .optional()
            .isString()
            .withMessage('note must be a string')
            .run(req);

        await check('email')
            .optional()
            .isString()
            .withMessage('email must be a string')
            .run(req);

        await check('created_at')
            .optional()
            .isString()
            .withMessage('created_at must be a string')
            .run(req);

        await check('created_by')
            .optional()
            .isString()
            .withMessage('created_by must be a string')
            .run(req);

        if (!isReopen && !isPending) {
            await check('defect_action')
                .notEmpty()
                .withMessage('defect_action is required')
                .isObject()
                .withMessage('defect_action must be an object')
                .run(req);

            await check('defect_action.defect_type')
                .notEmpty()
                .withMessage('defect_action.defect_type is required')
                .isIn(['real_defect', 'not_a_defect', 'not_a_bot_defect'])
                .withMessage('defect_action.defect_type must be "real_defect", "not_a_defect", or "not_a_bot_defect"')
                .run(req);

            await check('defect_action.created_by')
                .notEmpty()
                .withMessage('defect_action.created_by is required')
                .isString()
                .withMessage('defect_action.created_by must be a string')
                .run(req);

            await check('defect_action.created_at')
                .notEmpty()
                .withMessage('defect_action.created_at is required')
                .isString()
                .withMessage('defect_action.created_at must be a string')
                .run(req);
        }

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST /jira-ticket-status — one linked ticket's workflow status
    async validateUpdateJiraTicketStatus(req, res, next) {
        const { JIRA_TICKET_STATUSES } = require('../../../helpers/jira-status');

        await check('interaction_id')
            .notEmpty()
            .withMessage('interaction_id is required')
            .isString()
            .withMessage('interaction_id must be a string')
            .run(req);

        await check('ticket')
            .notEmpty()
            .withMessage('ticket is required')
            .isString()
            .withMessage('ticket must be a string')
            .custom((value) => {
                if (!/[A-Z]+-\d+/i.test(String(value || ''))) {
                    throw new Error('ticket must include a PROJECT-#### key');
                }
                return true;
            })
            .run(req);

        await check('status')
            .notEmpty()
            .withMessage('status is required')
            .isString()
            .withMessage('status must be a string')
            .isIn(JIRA_TICKET_STATUSES)
            .withMessage(`status must be one of: ${JIRA_TICKET_STATUSES.join(', ')}`)
            .run(req);

        await check('updated_by')
            .notEmpty()
            .withMessage('updated_by is required')
            .isString()
            .withMessage('updated_by must be a string')
            .run(req);

        await check('created_at')
            .notEmpty()
            .withMessage('created_at is required')
            .isString()
            .withMessage('created_at must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST export body (date range only; export returns all rows in range)
    async validateExportReviewQueue(req, res, next) {
        await check('condition.timezone')
            .notEmpty()
            .withMessage('timezone is required')
            .isString()
            .withMessage('timezone must be a string')
            .run(req);

        await check('condition.call_date.start_date')
            .notEmpty()
            .withMessage('start_date is required')
            .isISO8601()
            .withMessage('start_date must be a valid date')
            .run(req);

        await check('condition.call_date.end_date')
            .notEmpty()
            .withMessage('end_date is required')
            .isISO8601()
            .withMessage('end_date must be a valid date')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST summary-distribution body (date range only)
    async validateSummaryDistribution(req, res, next) {
        await check('condition.timezone')
            .notEmpty()
            .withMessage('timezone is required')
            .isString()
            .withMessage('timezone must be a string')
            .run(req);

        await check('condition.call_date.start_date')
            .notEmpty()
            .withMessage('start_date is required')
            .isISO8601()
            .withMessage('start_date must be a valid date')
            .run(req);

        await check('condition.call_date.end_date')
            .notEmpty()
            .withMessage('end_date is required')
            .isISO8601()
            .withMessage('end_date must be a valid date')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST /assign — assigned_to null/empty = unassign
    async validateAssign(req, res, next) {
        await check('interaction_id')
            .notEmpty()
            .withMessage('interaction_id is required')
            .isString()
            .withMessage('interaction_id must be a string')
            .run(req);

        await check('assigned_by')
            .notEmpty()
            .withMessage('assigned_by is required')
            .isString()
            .withMessage('assigned_by must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST review-outcome body (same date-range shape as summary-distribution)
    async validateReviewOutcome(req, res, next) {
        await check('condition.timezone')
            .notEmpty()
            .withMessage('timezone is required')
            .isString()
            .withMessage('timezone must be a string')
            .run(req);

        await check('condition.call_date.start_date')
            .notEmpty()
            .withMessage('start_date is required')
            .isISO8601()
            .withMessage('start_date must be a valid date')
            .run(req);

        await check('condition.call_date.end_date')
            .notEmpty()
            .withMessage('end_date is required')
            .isISO8601()
            .withMessage('end_date must be a valid date')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST /jira-tickets body (same date-range shape as summary-distribution)
    async validateJiraTickets(req, res, next) {
        await check('condition.timezone')
            .notEmpty()
            .withMessage('timezone is required')
            .isString()
            .withMessage('timezone must be a string')
            .run(req);

        await check('condition.call_date.start_date')
            .notEmpty()
            .withMessage('start_date is required')
            .isISO8601()
            .withMessage('start_date must be a valid date')
            .run(req);

        await check('condition.call_date.end_date')
            .notEmpty()
            .withMessage('end_date is required')
            .isISO8601()
            .withMessage('end_date must be a valid date')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    // Validate POST /bulk-assign
    async validateBulkAssign(req, res, next) {
        await check('assignments')
            .isArray({ min: 1 })
            .withMessage('assignments must be a non-empty array')
            .run(req);

        await check('assigned_by')
            .notEmpty()
            .withMessage('assigned_by is required')
            .isString()
            .withMessage('assigned_by must be a string')
            .run(req);

        CommonUtil.errorChecker(req, res, next);
    }
}

module.exports = AvaQcValidation;
