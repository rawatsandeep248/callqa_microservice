const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class CallaiAvaQcReviewDetails {
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
    const CALLAI_AVA_QC_REVIEW_DETAILS = this.sequelize.define('callai_ava_qc_review_details', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      interaction_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      notes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      defect_action: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
      }
    }, {
      tableName: table,
      timestamps: false
    });

    return { SEQUELIZE: this.sequelize, CALLAI_AVA_QC_REVIEW_DETAILS };
  }
}

module.exports = CallaiAvaQcReviewDetails;
