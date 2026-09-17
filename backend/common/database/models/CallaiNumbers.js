// Include Sequelize module.
const Sequelize = require('sequelize')
// const sequelize = require('../database-mysql-write')
const MessageUtil = require('../../utils/message-util');

class CallaiNumbers {
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

        const CALLAINUMBERS = this.sequelize.define('callai_numbers', {
            id: { type: Sequelize.STRING, primaryKey: true },
            number: { type: Sequelize.STRING },
            country: { type: Sequelize.STRING },
            cost: { type: Sequelize.STRING },
            type: { type: Sequelize.STRING },
            tts_id: { type: Sequelize.STRING },
            asr_id: { type: Sequelize.STRING },
            customer_bot_id: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
            request_type: { type: Sequelize.STRING },
            barge_in: { type: Sequelize.BOOLEAN },
            bot_name: { type: Sequelize.STRING },
            name: { type: Sequelize.STRING },
            // call_qa: { type: Sequelize.BOOLEAN },
            // bot_attached: { type: Sequelize.JSON },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAINUMBERS: CALLAINUMBERS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }

}

module.exports = CallaiNumbers