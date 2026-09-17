// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class CallaiAsr {
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
        const CALLAIASR = this.sequelize.define('callai_asr', {
            id: { type: Sequelize.BIGINT, primaryKey: true},
            number_id: { type: Sequelize.STRING },
            language: { type: Sequelize.STRING },
            config: { type: Sequelize.JSON },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();       
        return { SEQUELIZE: this.sequelize, CALLAIASR: CALLAIASR };
    }

    async syncTables() {
        try {
            await this.sequelize.sync();
        } catch (error) {
        }
    }


};


module.exports = CallaiAsr