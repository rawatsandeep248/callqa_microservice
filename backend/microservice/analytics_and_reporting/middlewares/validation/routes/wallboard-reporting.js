const { check, body } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');
class WALLBOARDVALIDATION {
    constructor() {
        this.fetchTotalSessionsCountAVA = this.fetchTotalSessionsCountAVA.bind(this);
        this.fetchSelfHelpCountAVA = this.fetchSelfHelpCountAVA.bind(this);
        this.fetchAhtCountAVA = this.fetchAhtCountAVA.bind(this);
    }
    async fetchTotalSessionsCountAVA(req, res, next) {
        await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
    async fetchSelfHelpCountAVA(req, res, next) {
        await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
    async fetchAhtCountAVA(req, res, next) {
        await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
     async fetchTransferCountAVA(req, res, next) {
        await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
}
module.exports = WALLBOARDVALIDATION