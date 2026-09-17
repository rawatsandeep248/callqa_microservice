// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class CallaiTts {
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
        const CALLAITTS = this.sequelize.define('callai_tts', {
            id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            number_id: { type: Sequelize.STRING(145) },
            provider: { type: Sequelize.STRING(145) },
            config: { type: Sequelize.JSON },
            cache: { type: Sequelize.STRING(145) },
            priority: {
                type: Sequelize.ENUM('P1', 'P2', 'P3'),
            }
        }, {
            tableName: table,
            timestamps: false,
        })
        return { SEQUELIZE: this.sequelize, CALLAITTS: CALLAITTS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
            
        }
    }

}

module.exports = CallaiTts