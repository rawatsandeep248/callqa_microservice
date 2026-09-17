const { check } = require('express-validator');
const CommonUtil = require('../../../../../common/utils/common-util');


class BOTAUDITVALIDATION {
    constructor() {

        this.deleteBuConfig = this.deleteBuConfig.bind(this);
        this.createBuConfig = this.createBuConfig.bind(this);
        this.updateBuConfig = this.updateBuConfig.bind(this);
        this.importBuConfig = this.importBuConfig.bind(this);

    }

    async deleteBuConfig(req, res, next) {
        await check('id')
            .notEmpty()
            .withMessage('ID is required')
            .isInt()
            .withMessage('ID must be an integer')
            .run(req);
        CommonUtil.errorChecker(req, res, next);
    }

    async updateBuConfig(req, res, next) {
        await check('id')
            .notEmpty()
            .withMessage('ID is required')
            .isInt()
            .withMessage('ID must be an integer').run(req);
        await check('key_name')
            .isString()
            .withMessage('key_name must be a String')
            .isLength({ min: 3 })
            .withMessage('key_name Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('key_name Maximum length should be 30').run(req);
        await check('description')
            .isString()
            .withMessage('description must be a String')
            .isLength({ min: 3 })
            .withMessage('description Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('description Maximum length should be 30').run(req);
        await check('datatype')
            .isString()
            .withMessage('datatype must be a String').run(req);
        await check('allowed_values')
            .isString()
            .withMessage('allowed_values must be a String').run(req);
        await check('language_code')
            .isString()
            .withMessage('language_code must be a String').run(req);
        await check('value')
            .isString()
            .withMessage('value must be a String').run(req);
        await check('is_active')
            .isBoolean()
            .withMessage('is_active must be a boolean').run(req);
        await check('version')
            .isInt()
            .withMessage('version must be an integer').run(req);
        await check('updated_by')
            .isString()
            .withMessage('Updated by must be a String')
            .notEmpty()
            .withMessage('Updated by is required')
            .isLength({ min: 3 })
            .withMessage('Updated by Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('Updated by Maximum length should be 30').run(req);
        CommonUtil.errorChecker(req, res, next);
    }

    async createBuConfig(req, res, next) {
        await check('id')
            .notEmpty()
            .withMessage('ID is required')
            .isInt()
            .withMessage('ID must be an integer').run(req);
        await check('key_name')
            .isString()
            .withMessage('key_name must be a String')
            .notEmpty()
            .withMessage('key_name is required')
            .isLength({ min: 3 })
            .withMessage('key_name Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('key_name Maximum length should be 30').run(req);
        await check('description')
            .isString()
            .withMessage('description must be a String')
            .notEmpty()
            .withMessage('description is required')
            .isLength({ min: 3 })
            .withMessage('description Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('description Maximum length should be 30').run(req);
        await check('datatype')
            .isString()
            .withMessage('datatype must be a String')
            .notEmpty()
            .withMessage('datatype is required').run(req);
        await check('allowed_values')
            .isString()
            .withMessage('allowed_values must be a String').run(req);
        await check('language_code')
            .notEmpty()
            .withMessage('language_code is required')
            .isString()
            .withMessage('language_code must be a String').run(req);
        await check('value')
            .notEmpty()
            .withMessage('language_code is required')
            .isString()
            .withMessage('value must be a String').run(req);
        await check('is_active')
            .notEmpty()
            .withMessage('language_code is required')
            .isBoolean()
            .withMessage('is_active must be a boolean').run(req);
        await check('version')
            .notEmpty()
            .withMessage('language_code is required')
            .isInt()
            .withMessage('version must be an integer').run(req);
        await check('created_by')
            .isString()
            .withMessage('Created by must be a String')
            .notEmpty()
            .withMessage('created_by is required')
            .withMessage('Created by is required')
            .isLength({ min: 3 })
            .withMessage('Created by Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('Created by Maximum length should be 30').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async importBuConfig(req, res, next) {
        await check('id')
            .notEmpty()
            .withMessage('ID is required')
            .isInt()
            .withMessage('ID must be an integer').run(req);
        await check('name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isLength({ min: 3 })
            .withMessage('name Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('name Maximum length should be 30').run(req);
        await check('description')
            .isString()
            .withMessage('description must be a String')
            .notEmpty()
            .withMessage('description is required')
            .isLength({ min: 3 })
            .withMessage('description Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('description Maximum length should be 30').run(req);
        await check('datatype')
            .isString()
            .withMessage('datatype must be a String')
            .notEmpty()
            .withMessage('datatype is required').run(req);
        await check('options_en')
            .notEmpty()
            .withMessage('options_en is required').run(req);
        await check('options_es')
            .notEmpty()
            .withMessage('options_es is required').run(req);
        await check('english')
            .notEmpty()
            .withMessage('english is required').run(req);
        await check('spanish')
            .notEmpty()
            .withMessage('spanish is required').run(req);
        await check('created_by')
            .isString()
            .withMessage('Created by must be a String')
            .notEmpty()
            .withMessage('created_by is required')
            .withMessage('Created by is required')
            .isLength({ min: 3 })
            .withMessage('Created by Minimum  length should be 3')
            .isLength({ max: 30 })
            .withMessage('Created by Maximum length should be 30').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

}
module.exports = BOTAUDITVALIDATION