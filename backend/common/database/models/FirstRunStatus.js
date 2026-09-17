const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class FirstRunStatus {
    constructor(operation, table, sync = false) {
        return this.getConnection(operation, table, sync);
    }

    async getConnection(operation, table, sync) {
        if (operation === MessageUtil.info().database.operation.read) {
            this.sequelize = require('../database-mysql-read');
        } else {
            this.sequelize = require('../database-mysql-write');
        }
        return await this.defineModel(table, sync);
    }

    async defineModel(table, sync) {
        const FIRSTRUNSTATUS = this.sequelize.define('first_run_status', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            dbIntialization: {
                type: DataTypes.BOOLEAN
            },
            stepper: {
                type: DataTypes.STRING(50)
            },
            mysqldb: {
                type: DataTypes.BOOLEAN
            },
            mongodb: {
                type: DataTypes.BOOLEAN
            },
            redis: {
                type: DataTypes.BOOLEAN
            },
            domain: {
                type: DataTypes.STRING(100)
            },
            builderdb_restore: {
                type: DataTypes.BOOLEAN
            },
            inserted_collection: {
                type: DataTypes.JSON
            },
            mysqldb_restore: {
                type: DataTypes.BOOLEAN
            },
            inserted_tables: {
                type: DataTypes.JSON
            },
            sign_up: {
                type: DataTypes.BOOLEAN
            },
            created_by: {
                type: DataTypes.STRING(100)
            },
            modified_by: {
                type: DataTypes.STRING(100)
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            },
            email: {
                type: DataTypes.STRING(100)
            },
            password: {
                type: DataTypes.STRING(100)
            },
            username: {
                type: DataTypes.STRING(100)
            }
        }, {
            tableName: `callai_${table}`,
            timestamps: false
        });

        //    if(sync){
        // await this.syncTables();
        // }
        return { SEQUELIZE: this.sequelize, FIRSTRUNSTATUS: FIRSTRUNSTATUS };
    }

    async syncTables() {
        try {
            await this.sequelize.sync(); // or force: true
        } catch (error) {
            console.error('Unable to sync FirstRunStatus table:', error);
        }
    }
}

module.exports = FirstRunStatus