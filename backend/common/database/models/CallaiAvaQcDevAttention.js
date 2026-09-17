const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class CallaiAvaQcDevAttention {
  constructor(operation, table) {
    return this.getConnection(operation, table);
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
    const CALLAI_AVA_QC_DEV_ATTENTION = this.sequelize.define('callai_ava_qc_dev_attention', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue: 'Inbox'
      },
      priority:{
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue: 'Low'
      },
      jira: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      // Cumulative per-ticket workflow map, e.g. { "AVA-1234": "In Progress" }.
      // Never cleared when the interaction is Done — durable history of ticket outcomes.
      jira_status: {
        type: DataTypes.JSON,
        allowNull: true
      },
      form_name: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      interaction_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      firstname_eva: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      lastname_eva: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      score_percent: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      uploaded_by: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      assigned_to: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      assigned_to_name: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      assigned_by: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: table,
      timestamps: false
    });

    return { SEQUELIZE: this.sequelize, CALLAI_AVA_QC_DEV_ATTENTION };
  }
}

module.exports = CallaiAvaQcDevAttention;
