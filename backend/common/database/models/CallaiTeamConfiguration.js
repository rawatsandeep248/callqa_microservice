// Include Sequelize module.
const Sequelize = require('sequelize')
// const sequelize = require('../database-mysql-write')
const MessageUtil = require('../../utils/message-util');

class CallaiTeamConfiguration {
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
        const CALLAITEAMCONFIGURATION = this.sequelize.define('callai_team_configuration', {
            team_id: { type: Sequelize.STRING, primaryKey: true },
            name: { type: Sequelize.STRING },
            display_name: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
            number_attached: { type: Sequelize.INTEGER },
            default_team: { type: Sequelize.STRING },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        },
            { freezeTableName: true },
            {
                tableName: table,
                timestamps: false,
            })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAITEAMCONFIGURATION: CALLAITEAMCONFIGURATION };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }

};



module.exports = CallaiTeamConfiguration