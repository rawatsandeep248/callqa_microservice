// Include Sequelize module.
const Sequelize = require('sequelize')
const MessageUtil = require('../../utils/message-util');

class CallaiAgentTxn {

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
    const CALLAIAGENTTXN = this.sequelize.define('callai_agent_txn', {

      uid: { type: Sequelize.STRING, primaryKey: true },
      a_name: { type: Sequelize.STRING },
      a_id: { type: Sequelize.STRING },
      a_alert_time: { type: Sequelize.STRING },
      a_action: { type: Sequelize.STRING },
      a_start_time: { type: Sequelize.STRING },
      a_end_time: { type: Sequelize.STRING },
      a_duration: { type: Sequelize.INTEGER },
      tenant_id: { type: Sequelize.STRING },
      user_query: { type: Sequelize.STRING },
      org_level: { type: Sequelize.STRING }
    }, {
      tableName: table,
      timestamps: false,
    })
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAIAGENTTXN: CALLAIAGENTTXN };
  }

  async syncTables() {
    try {
      // await this.sequelize.sync({force: true});
      await this.sequelize.sync();
    } catch (error) {
      console.log("Unable to sync database: ", error);
    }
  }

}

module.exports = CallaiAgentTxn