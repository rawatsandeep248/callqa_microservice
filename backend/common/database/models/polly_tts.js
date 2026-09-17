const { DataTypes } = require("sequelize");
const MessageUtil = require("../../utils/message-util");
class PollyTTS {
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
    const POLLYTTS = this.sequelize.define(
      "polly_tts",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        language: { type: DataTypes.STRING },
        name_gender: { type: DataTypes.JSON },
        neural_voice: { type: DataTypes.JSON },
        standard_voice: { type: DataTypes.JSON },
      },
      {
        tableName: table,
        timestamps: false,
      }
    );
    // await this.syncTables();
    return { SEQUELIZE: this.sequelize, POLLYTTS: POLLYTTS };
  }

  async syncTables() {
    try {
      // await this.sequelize.sync({force: true});
      await this.sequelize.sync();
    } catch (error) {}
  }
}

module.exports = PollyTTS;
