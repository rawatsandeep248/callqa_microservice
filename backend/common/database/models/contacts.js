// Include Sequelize module.
const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class Contact {
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

 const CONTACT = this.sequelize.define('contact', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false               
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                
            },
            metadata: {
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
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CONTACTSLIST: CONTACT };
    }

    // async syncTables() {
    //     try {
    //         // await this.sequelize.sync({force: true});
    //         await this.sequelize.sync();
    //     } catch (error) {
    //         console.log("Unable to sync database: ", error);
    //     }
    // }

}

module.exports = Contact