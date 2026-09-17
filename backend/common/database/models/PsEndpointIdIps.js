// Include Sequelize module.
const Sequelize = require('sequelize')

// const sequelize = require('../database-mysql-write')
const MessageUtil = require('../../utils/message-util');

class PSEndpointIdIps {
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

        const PSENDPOINTTDIPS = this.sequelize.define('ps_endpoint_id_ips', {
            id: { type: Sequelize.STRING, primaryKey: true },
            endpoint: { type: Sequelize.STRING },
            match: { type: Sequelize.STRING },
            srv_lookups: { type: Sequelize.STRING },
            match_header: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, PSENDPOINTTDIPS: PSENDPOINTTDIPS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }

};


module.exports = PSEndpointIdIps