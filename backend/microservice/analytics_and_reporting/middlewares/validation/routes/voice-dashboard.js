const { check } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');

class VOICEDASHBOARDVALIDATION {
    constructor() {
        this.fetchCountVoiceDateWise = this.fetchCountVoiceDateWise.bind(this);
    }

    async fetchCountVoiceDateWise(req, res, next) {
       
await check('call_direction')
                .isString()
                .withMessage("call Direction must be string")
                .notEmpty()
                .withMessage("call Direction can't be Empty")
                .isIn(['INBOUND', 'OUTBOUND','BOTH'])
                .withMessage('call Direction By is required only INBOUND AND OUTBOUND AND BOTH').run(req);
            CommonUtil.errorChecker(req, res, next);
        }
    

    async fetchVoiceData(req, res, next) {
       
await check('date_filter')
                .notEmpty()
                .withMessage('Date filter is required')
                .isBoolean()
                .withMessage('Date filter must be boolean').run(req);

            await check('range.start_date')
                .notEmpty()
                .withMessage('Start Date is required')
                .isISO8601('yyyy-mm-dd')
                .withMessage("Invalid Start date").run(req);

            await check('range.end_date')
                .notEmpty()
                .withMessage('End Date is required')
                .isISO8601('yyyy-mm-dd')
                .withMessage("Invalid end date").run(req);

                await check('call_direction')
                .isString()
                .withMessage("Call Direction must be string")
                .notEmpty()
                .withMessage("Call Direction can't be Empty")
                .isIn(['INBOUND', 'OUTBOUND','TOTAL'])
                .withMessage('Call Direction can be  INBOUND, OUTBOUND or TOTAL').run(req);

            CommonUtil.errorChecker(req, res, next);
        }
    }

module.exports = VOICEDASHBOARDVALIDATION