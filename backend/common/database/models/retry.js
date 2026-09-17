const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class Retry {
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
        const RETRY= this.sequelize.define('retry', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            dialer_base_id: {
                type: DataTypes.INTEGER, //TODO: Implement sequelize reference
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            call_id: {
                type: DataTypes.STRING,
            },
            ani: {
                type: DataTypes.STRING,
                allowNull: false
            }, 
            dnis: {
                type: DataTypes.STRING,
                allowNull: false
            },
            retry_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            retry_status: {
                type: DataTypes.STRING,
            },  
            retry_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        }, {
          tableName: table,
          timestamps: false,
        })
        
        // await this.syncTables();
        return RETRY;
    }

    // async syncTables() {
    //     try {
    //         // await this.sequelize.sync({force: true});
    //         await this.sequelize.sync();
    //     } catch(error) {
    //         console.log("Unable to sync database: ", error);
    //     }
    // }
};

module.exports = Retry;