// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');


class CallaiSMS {
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
    const CALLAISMS = this.sequelize.define('callai_sms', {
      id: { type: Sequelize.STRING, primaryKey: true },
      uid: { type: Sequelize.STRING },
      sent_to: { type: Sequelize.STRING },
      sent_on: { type: Sequelize.TIME },
      link_opened: { type: Sequelize.BOOLEAN },
      open_count: { type: Sequelize.INTEGER },
    }, {
      tableName: table,
      timestamps: false,
    })
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAISMS: CALLAISMS };
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

module.exports = CallaiSMS