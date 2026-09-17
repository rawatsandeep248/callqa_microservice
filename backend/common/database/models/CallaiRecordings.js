// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');


class CallaiRecordings {
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
        const CALLAIRECORDINGS = this.sequelize.define('callai_recordings', {
            uid: { type: Sequelize.STRING, primaryKey: true },
            rec_time: { type: Sequelize.STRING },
            rec_url: { type: Sequelize.STRING },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAIRECORDINGS: CALLAIRECORDINGS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
            console.log("Unable to sync database: ", error);
        }
    }

};

module.exports = CallaiRecordings