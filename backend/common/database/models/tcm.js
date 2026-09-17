const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class Tcm {
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
        const TCM = this.sequelize.define('tcm', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            contact_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false    
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(MessageUtil.sql().tcm.enum.status.completed, MessageUtil.sql().tcm.enum.status.dialing, MessageUtil.sql().tcm.enum.status.in_progress, MessageUtil.sql().tcm.enum.status.pending),
                allowNull: false
            }, 
            description: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE            
            },
        }, {
          tableName: table,
          timestamps: false,
        })
        
        // await this.syncTables();
        return TCM;
    }

    // async syncTables() {
    //     try {
    //         await this.sequelize.sync();
    //     } catch(error) {
    //         console.log("Unable to sync database: ", error);
    //     }
    // }
};

module.exports = Tcm;