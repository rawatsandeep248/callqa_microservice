const { DataTypes } = require("sequelize");
const MessageUtil = require("../../utils/message-util");
class AzureTTS {
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
    const AZURETTS = this.sequelize.define(
      "azure_tts",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: DataTypes.STRING },
        language: { type: DataTypes.STRING },
        style: { type: DataTypes.JSON },
      },
      {
        tableName: table,
        timestamps: false,
      }
    );
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, AZURETTS: AZURETTS };
  }

  async syncTables() {
    try {
      // await this.sequelize.sync({force: true});
      await this.sequelize.sync();
    } catch (error) {}
  }
}

module.exports = AzureTTS;
