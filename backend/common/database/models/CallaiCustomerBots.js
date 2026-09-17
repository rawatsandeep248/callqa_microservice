// Include Sequelize module.
const Sequelize = require('sequelize')

// const sequelize = require('../database-mysql-write')
const MessageUtil = require('../../utils/message-util');

class CallaiCustomerBots {
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
        const CALLAICUSTOMERBOTS = this.sequelize.define('callai_customer_bots', {
            id: { type: Sequelize.STRING, primaryKey: true },
            number_id: { type: Sequelize.STRING },
            tts_id: { type: Sequelize.STRING },
            asr_id: { type: Sequelize.STRING },
            bot_name: { type: Sequelize.STRING },
            webhook: { type: Sequelize.STRING },
            protocol: { type: Sequelize.STRING },
            environment: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
            agents_linked: { type: Sequelize.INTEGER, defaultValue: 0 },
            bot_type: { type: Sequelize.STRING(255) },
            metadata: {
                type: Sequelize.JSON,
                allowNull: true
            },
            // number_attached: { type: Sequelize.JSON },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAICUSTOMERBOTS: CALLAICUSTOMERBOTS };
    }

    async syncTables() {
        try {
            await this.sequelize.sync({ alter: true });
            // await this.sequelize.sync();
        } catch (error) {
        }
    }

};

module.exports = CallaiCustomerBots