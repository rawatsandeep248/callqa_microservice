const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');
const { DataTypes } = require('sequelize');

/**
 * Model for pbx_global_config (singleton row, id = 1).
 * Six JSON groups: barge_in, denoise, dtmf, no_input, pbx_metrics, moh
 */
class PlatformPbxGlobalConfig {
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
        const PBXGLOBALCONFIG = this.sequelize.define('pbx_global_config', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            barge_in: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            denoise: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            dtmf: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            no_input: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            pbx_metrics: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            moh: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            tableName: table,
            timestamps: false,
        })
        return { SEQUELIZE: this.sequelize, PBXGLOBALCONFIG: PBXGLOBALCONFIG };
    }
}

module.exports = PlatformPbxGlobalConfig
