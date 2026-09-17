const { DataTypes } = require('sequelize');

class callaiInterimMessageConfig {
  constructor(operation) {
    return this.getConnection(operation);
  }

  async getConnection(operation) {
    const MessageUtil = require('../../utils/message-util');
    if (operation === MessageUtil.info().database.operation.read) {
      this.sequelize = require('../database-mysql-read');
    } else {
      this.sequelize = require('../database-mysql-write');
    }
    return await this.defineModel();
  }

  async defineModel() {
    const CALLAI_INTERIM_MESSAGE_CONFIG = this.sequelize.define('callai_interim_message_configs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        default : ""
      },
      value_es: {
        type: DataTypes.STRING(100),
      },
      value_en: {
        type: DataTypes.STRING(100),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      last_synced_status: {
        type: DataTypes.DATE,
      },
    }, {
      tableName: 'callai_interim_message_configs',
      timestamps: false,
    });

    return {
      SEQUELIZE: this.sequelize,
      CALLAI_INTERIM_MESSAGE_CONFIG: CALLAI_INTERIM_MESSAGE_CONFIG
    };
  }
}

module.exports = callaiInterimMessageConfig;
