// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class CallaiCallAnalytics {

    constructor(operation, table) {
        return this.getConnection(operation, table)
    }

    async getConnection(operation, table) {
        if (operation === MessageUtil.info().database.operation.read) {
            this.sequelize = require('../database-mysql-read');
        } else {
            this.sequelize = require('../database-mysql-write');
        }
        return await this.defineModel(table);
    }

    async defineModel(table) {
        const CallaiCallAnalytics = this.sequelize.define('callai_call_analytics', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            uid: { type: Sequelize.STRING, allowNull: false },
            customer_sentiment: { type: Sequelize.STRING },
            survey_average_score: { type: Sequelize.INTEGER },
            agent_likeability: { type: Sequelize.STRING },
            turns_to_resolution: { type: Sequelize.INTEGER, defaultValue: 0 },
            repetition_count: { type: Sequelize.INTEGER, defaultValue: 0 },
            misunderstanding_count: { type: Sequelize.INTEGER, defaultValue: 0 },
            frustration_signals: { type: Sequelize.BOOLEAN, defaultValue: false },
            self_service_success: { type: Sequelize.BOOLEAN, defaultValue: false },
            disallowed_content_detected: { type: Sequelize.BOOLEAN, defaultValue: false },
            customer_satisfaction_score: { type: Sequelize.INTEGER, defaultValue: 0 },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            e2e_completed: { type: Sequelize.BOOLEAN, defaultValue: false },
            survey_offered: { type: Sequelize.BOOLEAN, defaultValue: false },
            survey_status: { type: Sequelize.STRING },
            is_completed: { type: Sequelize.BOOLEAN, defaultValue: false },
            no_response: { type: Sequelize.BOOLEAN, defaultValue: false },
            csr_escalate: { type: Sequelize.STRING },
            ext_transfer: { type: Sequelize.STRING },
            call_bucket: { type: Sequelize.STRING },
            partially_contained: { type: Sequelize.BOOLEAN },
            auth_identity_failure: { type: Sequelize.BOOLEAN, defaultValue: false },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAICALLANALYTICS: CallaiCallAnalytics };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
            console.log("Unable to sync database: ", error);
        }
    }

}

module.exports = CallaiCallAnalytics