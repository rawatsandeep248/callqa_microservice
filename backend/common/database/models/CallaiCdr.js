// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');


class CallaiCdr {
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
    const CALLAICDR = this.sequelize.define('callai_cdr', {

      uid: { type: Sequelize.STRING, primaryKey: true },
      ani: { type: Sequelize.STRING },
      dnis: { type: Sequelize.STRING },
      bot_id: { type: Sequelize.STRING },
      bot_name: { type: Sequelize.STRING },
      call_date: { type: Sequelize.STRING },
      call_start_time: { type: Sequelize.STRING },
      call_end_time: { type: Sequelize.STRING },
      call_duration: { type: Sequelize.INTEGER },
      call_status: { type: Sequelize.STRING },
      transfer_type: { type: Sequelize.STRING },
      transfer_status: { type: Sequelize.STRING },
      call_direction: { type: Sequelize.STRING },
      tenant_id: { type: Sequelize.STRING },
      call_language: { type: Sequelize.STRING },
      channel: { type: Sequelize.STRING },
      bot_duration: { type: Sequelize.STRING },
      contactId: { type: Sequelize.STRING },
      masterContactId: { type: Sequelize.STRING },
      bot_type: { type: Sequelize.STRING },
      transfer_reason: { type: Sequelize.STRING },
      transfer_name: { type: Sequelize.STRING },
      transfer_category: { type: Sequelize.STRING }
    }, {
      tableName: table,
      timestamps: false,
    })
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAICDR: CALLAICDR };
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



module.exports = CallaiCdr