// Include Sequelize module.
const Sequelize = require('sequelize')

// const sequelize = require('../database-mysql-write')
const MessageUtil = require('../../utils/message-util');

class CallaiWebhooks {
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
    const CALLAIBOTWEBHOOKS = this.sequelize.define('callai_webhooks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary Key'
      },
      environment: {
        type: Sequelize.STRING(255)
      },
      webhook: {
        type: Sequelize.STRING(255)
      },
      protocol: {
        type: Sequelize.STRING(255)
      },
      bot_type: {
        type: Sequelize.STRING(255)
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_by: {
        type: Sequelize.STRING(255),
        comment: 'Created By'
      }
    }, {
      tableName: table,
      timestamps: false,
    })
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAIBOTWEBHOOKS: CALLAIBOTWEBHOOKS };
  }

  async syncTables() {
    try {
      // await this.sequelize.sync({force: true});
      await this.sequelize.sync();
    } catch (error) {
    }
  }

};

module.exports = CallaiWebhooks
