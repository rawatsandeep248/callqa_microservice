// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');


class CallaiQueueTxn {
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
    const CALLAIQUEUETXN = this.sequelize.define('callai_queue_txn', {

      uid: { type: Sequelize.STRING, primaryKey: true },
      q_name: { type: Sequelize.STRING },
      q_call_status: { type: Sequelize.STRING },
      q_id:{type: Sequelize.STRING},
      q_start_time: { type: Sequelize.STRING },
      q_end_time: { type: Sequelize.STRING },
      q_duration: { type: Sequelize.INTEGER },
      q_is_abandoned: { type: Sequelize.INTEGER },
    }, {
      tableName: table,
      timestamps: false,
    })
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAIQUEUETXN: CALLAIQUEUETXN };
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


module.exports = CallaiQueueTxn