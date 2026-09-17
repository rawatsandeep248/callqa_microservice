const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');


class Phonebook {
    constructor(operation,table,sync = false) {
        return this.getConnection(operation,table,sync)
    }
    
    async getConnection(operation, table,sync) {
        if(operation === MessageUtil.info().database.operation.read) {  
            this.sequelize = require('../database-mysql-read');          
        } else {
            this.sequelize = require('../database-mysql-write');           
        }
        return await this.defineModel(table,sync);
    }
    
    async defineModel(table,sync) {
        const GROUP = this.sequelize.define('group', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
            },
            modified_by: {
                type: DataTypes.STRING
            },
        }, {
          tableName: table,
          timestamps: false,
        })
        if(sync){
            await this.syncTables();
        }

       return { SEQUELIZE: this.sequelize, GROUPLIST: GROUP};
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync({alter : true});
        } catch(error) {
            console.log("Unable to sync database: ", error);
        }
    }
}

module.exports = Phonebook;
