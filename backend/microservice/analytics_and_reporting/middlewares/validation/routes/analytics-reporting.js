const { check, body } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');
class REPORTINGVALIDATION {
    constructor() {
        this.fetchTotalCallCount = this.fetchTotalCallCount.bind(this);
        this.calldatafromQueue = this.calldatafromQueue.bind(this);
        this.fetchchatTranscripts = this.fetchchatTranscripts.bind(this);
        this.filtercalldatafromCdrList = this.filtercalldatafromCdrList.bind(this);
        this.getAgentChatSessions = this.getAgentChatSessions.bind(this);
        this.fetchTotalDuration = this.fetchTotalDuration.bind(this);
        this.fetchAhtCountTotal = this.fetchAhtCountTotal.bind(this);
        this.fetchDurationByDirection = this.fetchDurationByDirection.bind(this);
        this.fetchInboundCount = this.fetchInboundCount.bind(this);
        this.fetchOutboundCount = this.fetchOutboundCount.bind(this);
        this.calldatafromAgent = this.calldatafromAgent.bind(this);
        this.fetchAhtCount = this.fetchAhtCount.bind(this);
        this.fetchCallSummary = this.fetchCallSummary.bind(this);
        this.fetchCallRecording = this.fetchCallRecording.bind(this);
        this.deleteCallRecording = this.deleteCallRecording.bind(this);
        this.deletechatTranscripts = this.deletechatTranscripts.bind(this);
        this.fetchCallSummaryAndKeyConcernsByUniqueId = this.fetchCallSummaryAndKeyConcernsByUniqueId.bind(this);
        this.getFailedQaRecords = this.getFailedQaRecords.bind(this);
        this.retryFailedQaRecord = this.retryFailedQaRecord.bind(this);
        this.retryFailedQaRecordsBulk = this.retryFailedQaRecordsBulk.bind(this);
        this.fetchAgentAssistTranscripts = this.fetchAgentAssistTranscripts.bind(this);
    }

    async fetchTotalCallCount(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);

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

        CommonUtil.errorChecker(req, res, next);

    }
    async fetchTotalDuration(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchAhtCountTotal(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchDurationByDirection(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('Date Filter is required')
            .isBoolean()
            .withMessage('Date Filter must be boolean').run(req);
        await check('range.start_date').optional()
            .notEmpty()
            .withMessage('Start Date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage("Invalid start date").run(req);
        await check('range.end_date').optional()
            .notEmpty()
            .withMessage('End Date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage("Invalid end date").run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchInboundCount(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchOutboundCount(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchAhtCount(req, res, next) {

await check('date_filter')
            .notEmpty()
            .withMessage('date filter is required')
            .isBoolean()
            .withMessage('date filter must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async fetchTotalCall(req, res, next) {

CommonUtil.errorChecker(req, res, next);

    }

    async calldatafromQueue(req, res, next) {

        await check('uid')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('Uid is numeric value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async calldatafromAgent(req, res, next) {

        await check('uid')
            .isString()
            .withMessage('Uid must be a String')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('uid is numeric value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async saveTranscriptCDR(req, res, next) {

await check('bot_id').isString()
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('Uid is numeric value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async fetchchatTranscripts(req, res, next) {

await check('bot_id').isString()
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async deletechatTranscripts(req, res, next) {

await check('bot_id').isString()
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('Uid is numeric value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async filtercalldatafromCdrList(req, res, next) {
        // console.log("req.headers && req.headers.hasOwnProperty('ocp-apim-subscription-key'", req.body && req.headers.hasOwnProperty('ocp-apim-subscription-key'))

await check('field')
            .isString()
            .withMessage('Field must be a String')
            .notEmpty()
            .withMessage('Field is required')
            .isIn(['ani', 'dnis', 'call_direction', 'call_date'])
            .withMessage('Field is required only ani AND dnis AND call_direction AND call_date').run(req);
        await check('order_by')
            .isString()
            .withMessage('Order By must be a String')
            .notEmpty()
            .withMessage('Order By is required')
            .isIn(['ASC', 'DESC'])
            .withMessage('Order By is required only ASC AND DESC').run(req);
        await check('limit')
            .notEmpty()
            .withMessage('Limit is required')
            .isNumeric()
            .withMessage('Limit must be a String').run(req);
        await check('offset')
            .notEmpty()
            .withMessage('Offset is required')
            .isNumeric()
            .withMessage('Offset must be a Integer value').run(req);

        await check('condition.call_direction')
            .isString()
            .withMessage('Condition Call Direction must be a String').run(req);

        await check('condition.ani')
            .isString()
            .withMessage('Condition ANI must be a String').run(req);
        await check('condition.dnis')
            .isString()
            .withMessage('Condition DNIS must be a String').run(req);

        await check('condition.call_date.start_date').optional()
            .isString()
            .withMessage('Start date must be a String')
            .notEmpty()
            .withMessage('Start date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage("Invalid start date").run(req);
        await check('condition.call_date.end_date').optional()
            .isString()
            .withMessage('End date must be a String')
            .notEmpty()
            .withMessage('End date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage("Invalid end date").run(req);

        await check('condition.date_filter_applied').optional()
            .isBoolean()
            .withMessage('Date filter applied must be boolean').run(req);
        await check('condition.global_id_search').optional()
            .isBoolean()
            .withMessage('Global id search must be boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async getAgentChatSessions(req, res, next) {
await check('field').optional()
            .isString()
            .withMessage('Field must be a String')
            .notEmpty()
            .withMessage('Field is required')
            .isIn(['ani', 'dnis', 'call_direction', 'call_date', ''])
            .withMessage('Field is required only ani AND dnis AND call_direction AND call_date').run(req);
        await check('order_by')
            .isString()
            .withMessage('Order By must be a String')
            .notEmpty()
            .withMessage('Order By is required')
            .isIn(['ASC', 'DESC'])
            .withMessage('Order By is required only ASC AND DESC').run(req);
        await check('limit')
            .notEmpty()
            .withMessage('Limit is required')
            .isNumeric()
            .withMessage('Limit must be a String').run(req);
        await check('offset')
            .notEmpty()
            .withMessage('Offset is required')
            .isNumeric()
            .withMessage('Offset must be a Integer value').run(req);
        await check('condition.call_direction')
            .isString()
            .withMessage('Condition Call Direction must be a String').run(req);
        await check('condition.ani')
            .isString()
            .withMessage('Condition ANI must be a String').run(req);
        await check('condition.dnis')
            .isString()
            .withMessage('Condition DNIS must be a String').run(req);
        await check('condition.bot_name')
            .isString()
            .withMessage('Condition Bot name must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);
    }

    async fetchCallSummary(req, res, next) {

        await check('direction')
            .isString()
            .withMessage("Direction must be string")
            .notEmpty()
            .withMessage("Direction cant be Empty").run(req);
        await check('time_slot')
            .isString()
            .withMessage("Time slot must be string")
            .notEmpty()
            .withMessage("Time Slot cant be Empty").run(req);
CommonUtil.errorChecker(req, res, next);
    }

    async fetchCallRecording(req, res, next) {

        await check('uid')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async deleteCallRecording(req, res, next) {

        await check('uid')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('Uid is numeric value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async fetchCallSummaryAndKeyConcernsByUniqueId(req, res, next) {

        await check('unique_id')
            .notEmpty()
            .withMessage('Unique ID is required')
            .isString()
            .withMessage('Unique ID must be a String value')
            .isLength({ max: 30 })
            .withMessage('Unique ID Maximum length should be 30').run(req);
CommonUtil.errorChecker(req, res, next);

    }

    async getFailedQaRecords(req, res, next) {
        await check('start_date')
            .isString()
            .withMessage('Start Date must be a String')
            .notEmpty()
            .withMessage('Start Date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage('Invalid start date').run(req);

        await check('end_date')
            .isString()
            .withMessage('End Date must be a String')
            .notEmpty()
            .withMessage('End Date is required')
            .isISO8601('yyyy-mm-dd')
            .withMessage('Invalid end date').run(req);

        await check('timezone')
            .optional()
            .isString()
            .withMessage('Timezone must be a String').run(req);

        await check('limit')
            .optional()
            .isNumeric()
            .withMessage('Limit must be a numeric value').run(req);

        await check('offset')
            .optional()
            .isNumeric()
            .withMessage('Offset must be a numeric value').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async retryFailedQaRecord(req, res, next) {
await check('uid')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);
        
        await check('bot_id')
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        
        await check('bot_name')
            .notEmpty()
            .withMessage('Bot Name is required')
            .isString()
            .withMessage('Bot Name must be a String').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async retryFailedQaRecordsBulk(req, res, next) {
await check('uids')
            .isArray({ min: 1, max: 30 })
            .withMessage('uids must be a non-empty array with maximum 30 uids').run(req);

        await check('uids.*')
            .isString()
            .withMessage('Each uid must be a String')
            .notEmpty()
            .withMessage('Uid cannot be empty').run(req);

        await check('bot_id')
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        
        await check('bot_name')
            .notEmpty()
            .withMessage('Bot Name is required')
            .isString()
            .withMessage('Bot Name must be a String').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async reprocessQaRecord(req, res, next) {
await check('uid')
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);
        
        await check('bot_id')
            .notEmpty()
            .withMessage('Bot ID is required')
            .isString()
            .withMessage('Bot ID must be a String').run(req);
        
        await check('bot_name')
            .notEmpty()
            .withMessage('Bot Name is required')
            .isString()
            .withMessage('Bot Name must be a String').run(req);
        
        CommonUtil.errorChecker(req, res, next);

    }

    async fetchAgentAssistTranscripts(req, res, next) {
        await check('bot_id')
            .isString()
            .notEmpty()
            .withMessage('Bot ID is required').run(req);
        await check('unique_id') //optional
            .optional()
            .isString()
            .withMessage('Session/unique id must be a String').run(req);
        await check('agent_id') //optional
            .optional()
            .isString()
            .withMessage('Agent ID must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
}
module.exports = REPORTINGVALIDATION;
