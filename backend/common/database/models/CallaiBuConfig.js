const { DataTypes } = require('sequelize');

class CallaiBuConfig {
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
    const CONFIG_KEYS = this.sequelize.define('config_keys', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        // unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      data_type: {
        type: DataTypes.ENUM('string', 'boolean', 'dropdown', 'time', 'date', 'datetime', 'number'),
        allowNull: false,
      },
      is_multilingual: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      allowed_values: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      updated_by: {
        type: DataTypes.STRING,
      },
      created_by: {
        type: DataTypes.STRING(100),
      },
      last_synced_status : {
        type: DataTypes.DATE,
      },
    }, {
      tableName: 'callai_bu_config_keys',
      timestamps: false,
    });

    const CONFIG_VERSIONS = this.sequelize.define('config_versions', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      config_key_id: {
        type: DataTypes.INTEGER,
        references: {
          model: CONFIG_KEYS,
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      business_unit_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      language_code: {
        type: DataTypes.STRING(10),
        defaultValue: 'en',
      },
      value: {
        type: DataTypes.TEXT,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
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
      updated_by: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: 'callai_bu_config_versions',
      timestamps: false,
    });
    const AUDIT_LOGS = this.sequelize.define('audit_logs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      config_key_id: {
        type: DataTypes.INTEGER,
        references: {
          model: CONFIG_KEYS,
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      old_value: {
        type: DataTypes.TEXT,
      },
      new_value: {
        type: DataTypes.TEXT,
      },
      change_summary: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      language_code: {
        type: DataTypes.STRING(244)
      },
      created_by: {
        type: DataTypes.STRING(100),
      },
    }, {
      tableName: 'callai_bu_config_audit_logs',
      timestamps: false,
    });

    const [R1, R2, R3] = [...await Promise.allSettled([CONFIG_KEYS, CONFIG_VERSIONS, AUDIT_LOGS]).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          throw result.reason;
        }
      });
      return results;
    })];


    R1.value.hasMany(R2.value, {
      foreignKey: 'config_key_id',
      onDelete: 'CASCADE',

    });

    R2.value.belongsTo(R1.value, {
      foreignKey: 'config_key_id',
      onDelete: 'CASCADE',

    });
    R3.value.belongsTo(R1.value, {
      foreignKey: 'config_key_id',
      onDelete: 'CASCADE',
    });

    return {
      SEQUELIZE: this.sequelize,
      CONFIG_KEYS: R1.value,
      CONFIG_VERSIONS: R2.value,
      AUDIT_LOGS: R3.value
    };
  }
}

module.exports = CallaiBuConfig;
