const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class DialerBase {
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
        const DIALERBASE = this.sequelize.define('dialer_base', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            contact_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            source: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer_base.enum.source.phonebook, MessageUtil.sql().dialer_base.enum.source.xls),
                allowNull: false
            },
            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false    
            },
            retry_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING
            },
            dial_out_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            call_status: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer_base.enum.call_status.completed, MessageUtil.sql().dialer_base.enum.call_status.dialing, MessageUtil.sql().dialer_base.enum.call_status.in_progress, MessageUtil.sql().dialer_base.enum.call_status.pending),
                defaultValue: MessageUtil.sql().dialer_base.enum.call_status.pending
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
                type: DataTypes.DATE
            },
            modified_by: {
                type: DataTypes.STRING
            },
            meta_data:{
                type: DataTypes.JSON
            },
            uid: {
                type: DataTypes.STRING
            },
        }, {
          tableName: table,
          timestamps: false,
        })
        
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, DIALERBASELIST: DIALERBASE };
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

module.exports = DialerBase;