// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util')

class CallaiDialerBase {
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
        const CALLAIDIALERBASE = this.sequelize.define('callai_dialer_base', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                allowNull: false
            },
            phonebook_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            source: {
                type: Sequelize.ENUM(MessageUtil.sql().dialer_base.enum.source.phonebook, MessageUtil.sql().dialer_base.enum.source.xls),
                allowNull: false
            },
            campaign_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            tenant_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            retry_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING
            },
            dial_out_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            call_status: {
                type: Sequelize.ENUM(MessageUtil.sql().dialer_base.enum.call_status.completed, MessageUtil.sql().dialer_base.enum.call_status.dialing, MessageUtil.sql().dialer_base.enum.call_status.in_progress, MessageUtil.sql().dialer_base.enum.call_status.pending),
                defaultValue: MessageUtil.sql().dialer_base.enum.call_status.pending
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW(),
                allowNull: false
            },
            created_by: {
                type: Sequelize.STRING,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE
            },
            modified_by: {
                type: Sequelize.STRING
            },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CALLAIDIALERBASE: CALLAIDIALERBASE };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch (error) {
            console.log("Unable to sync database: ", error);
        }
    }

};


module.exports = CallaiDialerBase
