// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

// const sequelize = require('../database-mysql-write')
class PsRegistrations {
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

        const PSREGISTRATIONS = this.sequelize.define('ps_registrations', {
            id: { type: Sequelize.STRING, primaryKey: true },
            auth_rejection_permanent: { type: Sequelize.STRING },
            client_uri: { type: Sequelize.STRING },
            contact_user: { type: Sequelize.STRING },
            expiration: { type: Sequelize.INTEGER },
            max_retries: { type: Sequelize.INTEGER },
            outbound_auth: { type: Sequelize.STRING },
            outbound_proxy: { type: Sequelize.STRING },
            retry_interval: { type: Sequelize.INTEGER },
            forbidden_retry_interval: { type: Sequelize.INTEGER },
            server_uri: { type: Sequelize.STRING },
            transport: { type: Sequelize.STRING },
            support_path: { type: Sequelize.STRING },
            fatal_retry_interval: { type: Sequelize.INTEGER },
            line: { type: Sequelize.STRING },
            endpoint: { type: Sequelize.STRING },
            support_outbound: { type: Sequelize.STRING },
            contact_header_params: { type: Sequelize.STRING },
            tenant_id: { type: Sequelize.STRING },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, PSREGISTRATIONS: PSREGISTRATIONS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
        }
    }

};

module.exports = PsRegistrations