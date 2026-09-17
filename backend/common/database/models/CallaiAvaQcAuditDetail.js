const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class CallaiAvaQcAuditDetail {
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
    const CALLAI_AVA_QC_AUDIT_DETAIL = this.sequelize.define('callai_ava_qc_audit_detail', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      form_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      interaction_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      score_percent: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true
      },
      firstname_eva: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      lastname_eva: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      question_hash: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      fail_critical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      section_title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      actual_score: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
      },
      max_score: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      channel: {
        type: DataTypes.STRING(255),
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
      }
    }, {
      tableName: table,
      timestamps: false,
      indexes: [
        {
          name: 'idx_audit_batch_interaction',
          fields: ['interaction_id']
        }
      ]
    });

    return { SEQUELIZE: this.sequelize, CALLAI_AVA_QC_AUDIT_DETAIL };
  }
}

module.exports = CallaiAvaQcAuditDetail;
