const { check } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');

class DASHBOARDVALIDATION {
    constructor() {
        this.fetchUsersCount = this.fetchUsersCount.bind(this);
        this.fetchCountVoiceChannel = this.fetchCountVoiceChannel.bind(this);
        this.fetchBotsCount = this.fetchBotsCount.bind(this);
        this.fetchCampaignCount = this.fetchCampaignCount.bind(this);
    }

    async fetchCountVoiceChannel(req, res, next) {
       
CommonUtil.errorChecker(req, res, next);
        
    }

    async fetchUsersCount(req, res, next) {
       
await check('organization_id').isString()
                .withMessage('organization id must be a String')
                .notEmpty()
                .withMessage('organization id is required')
                .custom(value => !/\s/.test(value))
                .withMessage('No spaces are allowed in the organazation id').run(req);
            CommonUtil.errorChecker(req, res, next);
        
    }

    async fetchBotsCount(req, res, next) {
       
CommonUtil.errorChecker(req, res, next);
        
    }

    async fetchCampaignCount(req, res, next) {
       
CommonUtil.errorChecker(req, res, next);
        }
    

}

module.exports = DASHBOARDVALIDATION