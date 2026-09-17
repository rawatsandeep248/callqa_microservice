// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class CallaiCallTopics {

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
        const CallaiCallTopics = this.sequelize.define('callai_call_topics', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            uid: { type: Sequelize.STRING, allowNull: false },
            primary_topic: { type: Sequelize.STRING },
            subtopic: { type: Sequelize.STRING },
            status: { type: Sequelize.STRING },
            attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
            in_scope: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            incomplete_reason: { type: Sequelize.STRING },
            handled: { type: Sequelize.BOOLEAN},
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAICALLTOPICS: CallaiCallTopics };
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

module.exports = CallaiCallTopics