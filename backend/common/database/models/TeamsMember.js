const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class TemasMember {
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
        let TEAMSMEMBER = this.sequelize.define('queue_members', {
            queue_name: { type: Sequelize.STRING, primaryKey: true },
            interface: { type: Sequelize.STRING },
            membername: { type: Sequelize.STRING },
            state_interface: { type: Sequelize.STRING },
            penalty: { type: Sequelize.STRING },
            paused: { type: Sequelize.STRING },
            uniqueid: { type: Sequelize.STRING },
            wrapuptime: { type: Sequelize.STRING },
            ringinuse: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },

        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, TEAMSMEMBER: TEAMSMEMBER };
    }
    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }
};

module.exports = TemasMember;
  
