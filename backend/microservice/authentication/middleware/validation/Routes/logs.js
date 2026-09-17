const { check } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');

class LOGSVALIDATION {
    constructor() {
        this.auditLog = this.auditLog.bind(this);
    }

    async auditLog(req, res, next) {

            await check('itemsPerPage')
                .notEmpty()
                .withMessage('items Per Page is required')
                .isInt()
                .withMessage('items Per Page must be a String').run(req);
            await check('pageIndex')
                .notEmpty()
                .withMessage('Page Index is required')
                .isInt()
                .withMessage('Page Index must be a Integer value').run(req);
            await check('email')
                .isString()
                .withMessage('email must be a String')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Please enter a valid email address').run(req);
await check('entity').isString()
                .withMessage('entity must be a String')
                .notEmpty()
                .withMessage('entity is required')
                .isIn(['All', 'created', 'edited','deleted'])
                .withMessage('entity is required Created , Edited , Deleted and All').run(req);
            await check('start_date').isString()
                .withMessage('start date must be a String')
                .notEmpty()
                .withMessage('start date is required')
                .isISO8601('yyyy-mm-dd')
                .withMessage("Invalid start date").run(req);
            await check('end_date').isString()
                .withMessage('end date must be a String')
                .notEmpty()
                .withMessage('end date is required')
                .isISO8601('yyyy-mm-dd')
                .withMessage("Invalid end date").run(req);
            CommonUtil.errorChecker(req, res, next);
        }
    }

module.exports = LOGSVALIDATION