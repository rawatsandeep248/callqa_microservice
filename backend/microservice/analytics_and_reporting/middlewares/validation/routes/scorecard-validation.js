const { check, param } = require('express-validator');
const CommonUtil = require('../../../../../common/utils/common-util');

// Validators for the platform-dropdown-config endpoints exposed under
// /scorecard. These mirror ava-qc-validation.js's validators of the same
// name — the rules are generic (not review-queue-specific) — kept in their
// own file to follow this codebase's one-validation-file-per-route-file
// convention rather than importing across module boundaries.
class ScorecardValidation {
    constructor() {
        this.validateCreatePlatformDropdownConfig = this.validateCreatePlatformDropdownConfig.bind(this);
        this.validatePlatformDropdownConfigId = this.validatePlatformDropdownConfigId.bind(this);
        this.validatePlatformDropdownConfigValueAction = this.validatePlatformDropdownConfigValueAction.bind(this);
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

    async validatePlatformDropdownConfigId(req, res, next) {
        await param('id')
            .notEmpty()
            .withMessage('id is required')
            .isMongoId()
            .withMessage('id must be a valid MongoDB ObjectId')
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
}

module.exports = ScorecardValidation;
