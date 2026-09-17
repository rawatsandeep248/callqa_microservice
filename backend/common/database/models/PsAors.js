const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');
class PsAors {
    constructor(operation,table) {
        return this.getConnection(operation,table)
    }
    async getConnection(operation,table) {
        if(operation === MessageUtil.info().database.operation.read) {  
            this.sequelize = require('../database-mysql-read');
        } else {
            this.sequelize = require('../database-mysql-write');
        }
        return await this.defineModel(table);
    }
    
    async defineModel(table) {
        const AORS = this.sequelize.define('ps_aors', {
            id: { type: DataTypes.STRING ,primaryKey:true},
            contact: { type: DataTypes.STRING },
            default_expiration: { type: DataTypes.INTEGER },
            mailboxes: { type: DataTypes.STRING },
            max_contacts: { type: DataTypes.INTEGER, defaultValue: 1 },
            minimum_expiration: { type: DataTypes.INTEGER },
            remove_existing: { type: DataTypes.STRING, defaultValue: 'yes' },
            qualify_frequency: { type: DataTypes.INTEGER },
            authenticate_qualify: { type: DataTypes.STRING },
            maximum_expiration: { type: DataTypes.INTEGER },
            outbound_proxy: { type: DataTypes.STRING },
            support_path: { type: DataTypes.STRING },
            qualify_timeout: { type: DataTypes.STRING },
            voicemail_extension: { type: DataTypes.STRING},
            tenant_id: { type: DataTypes.STRING }
        }, {
          tableName: table,
          timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, AORS: AORS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch(error) {
        }
    }
};

module.exports = PsAors;