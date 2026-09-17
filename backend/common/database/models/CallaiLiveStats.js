// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');
class CallailLiveStats {
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
        const CALLAILIVESTATS = this.sequelize.define('callai_wallboard', {
            tenant_id: { type: Sequelize.STRING, primaryKey: true },
            active_calls_in: { type: Sequelize.INTEGER },
            active_calls_out: { type: Sequelize.INTEGER },
            iva_calls: { type: Sequelize.INTEGER },
            ava_calls: { type: Sequelize.INTEGER },
            agent_calls: { type: Sequelize.INTEGER },
            average_waiting_time: { type: Sequelize.STRING },
            updated_at: { type: Sequelize.TIME, defaultValue: Sequelize.NOW() },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAILIVESTATS: CALLAILIVESTATS };
    }

    async syncTables() {
        try {
            await this.sequelize.sync();
        } catch (error) {
            console.log("Unable to sync database: ", error);
        }
    }


};


module.exports = CallailLiveStats