const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');
class PsAuths {
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
        const AUTH = this.sequelize.define('ps_auths', {
            id: { type: DataTypes.STRING,primaryKey:true },
            auth_type: { type: DataTypes.STRING, defaultValue: 'userpass' },
            nonce_lifetime: { type: DataTypes.INTEGER },
            md5_cred: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING ,defaultValue:'qWeankit'},
            realm: { type: DataTypes.STRING },
            username: { type: DataTypes.STRING },
            refresh_token: { type: DataTypes.STRING },
            oauth_clientid: { type: DataTypes.STRING },
            oauth_secret: { type: DataTypes.STRING },
            tenant_id: { type: DataTypes.STRING },
        }, {
          tableName: table,
          timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, AUTHS: AUTH };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch(error) {
        }
    }
};

module.exports = PsAuths;