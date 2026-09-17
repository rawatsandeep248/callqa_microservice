const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class Teams {
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
        const TEAMS = this.sequelize.define('queues', {
            name: { type: Sequelize.STRING, primaryKey: true },
            announce: { type: Sequelize.STRING },
            announce_position: { type: Sequelize.STRING },
            announce_position_limit: { type: Sequelize.STRING },
            periodic_announce_frequency: { type: Sequelize.STRING },
            relative_periodic_announce: { type: Sequelize.STRING },
            strategy: { type: Sequelize.STRING },
            lob: { type: Sequelize.STRING },
            weight: { type: Sequelize.STRING },
            announce_frequency: { type: Sequelize.STRING },
            min_announce_frequency: { type: Sequelize.STRING },
            announce_holdtime: { type: Sequelize.STRING },
            announce_round_seconds: { type: Sequelize.STRING },
            random_periodic_announce: { type: Sequelize.STRING },
            announce_to_first_user: { type: Sequelize.STRING },
            display_name: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
            total_members: { type: Sequelize.INTEGER, default: 0 },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, TEAMS: TEAMS };
    }
    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }



};
module.exports =
    // {
    // TeamsMember,
    Teams;
// }
