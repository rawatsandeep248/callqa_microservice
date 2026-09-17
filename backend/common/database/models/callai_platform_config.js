const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');
const { DataTypes } = require('sequelize');
class CallaiPlatformConfig {
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
        const PLATFORMCONFIG = this.sequelize.define('callai_platform_config', {
            config_key: {
                type: DataTypes.STRING(),
                allowNull: false,
                unique: true,          // UNIQUE index on config_key
            },
            config_value: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            value_type: {
                type: DataTypes.STRING(),
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,   // maps to TINYINT(1)
                allowNull: true,
                defaultValue: true,        // [1]
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        }, {
            tableName: table,
            timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, PLATFORMCONFIG: PLATFORMCONFIG };
    }

    async syncTables() {
        try {
            await this.sequelize.sync();
        } catch (error) {
        }
    }


};


module.exports = CallaiPlatformConfig;