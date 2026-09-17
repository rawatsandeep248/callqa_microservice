const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');
class CallaiAgentLogin {
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
        const CALLAIAGENTLOGIN = this.sequelize.define('callai_agent_logins', {
            id: { type: Sequelize.INTEGER, primaryKey: true,autoIncrement: true },
            name: { type: Sequelize.STRING },
            endpoint: { type: Sequelize.STRING },
            login_status: { type: Sequelize.BOOLEAN },
            aux_code: { type: Sequelize.STRING },
            asterisk_status: { type: Sequelize.BOOLEAN },
            tenant_id: { type: Sequelize.STRING },
            role: { type: Sequelize.STRING },
            is_active: { type: Sequelize.BOOLEAN },
            updated_at: { type: Sequelize.TIME , defaultValue: Sequelize.NOW()},
            created_at: { type: Sequelize.DATE , defaultValue: Sequelize.NOW()},
            call_status :{ type: Sequelize.STRING },
            is_connection_available: { type: Sequelize.BOOLEAN },
            last_login: { type: Sequelize.DATE , defaultValue: Sequelize.NOW()}
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAIAGENTLOGIN: CALLAIAGENTLOGIN };
    }

    async syncTables() {
        try {
            await this.sequelize.sync();
        } catch (error) {
        }
    }


};


module.exports = CallaiAgentLogin