const { DataTypes } = require("sequelize");
const MessageUtil = require("../../utils/message-util");
class CallAIASROptions {
  constructor(operation, table) {
    return this.getConnection(operation, table);
  }
  async getConnection(operation, table) {
    if (operation === MessageUtil.info().database.operation.read) {
      this.sequelize = require("../database-mysql-read");
    } else {
      this.sequelize = require("../database-mysql-write");
    }
    return await this.defineModel(table);
  }

  async defineModel(table) {
    const CALLAIASROPTIONS = this.sequelize.define(
      "callai_asr_options",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        region: { type: DataTypes.STRING },
        language_code: { type: DataTypes.STRING },
        model: { type: DataTypes.JSON },
        displayed_model: { type: DataTypes.JSON },
      },
      {
        tableName: table,
        timestamps: false,
      }
    );
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, CALLAIASROPTIONS: CALLAIASROPTIONS };
  }

  async syncTables() {
    try {
      // await this.sequelize.sync({force: true});
      await this.sequelize.sync();
    } catch (error) {}
  }
}

module.exports = CallAIASROptions;
