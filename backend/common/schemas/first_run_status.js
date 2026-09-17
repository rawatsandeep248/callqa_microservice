const MONGOOSE = require("mongoose");
const { required } = require("nconf");

class FirstRunStatus {
  static getSchema() {
    const FIRSTRUNSTATUS_SCHEMA = new MONGOOSE.Schema(
      {
        dbIntialization: {
          type: Boolean,
          required: false,
        },
        stepper: {
          type: String,
          required: false,
        },
        mysqldb: {
          type: Boolean,
          required: false,
        },
        mongodb: {
          type: Boolean,
          required: false,
        },
        redis: {
          type: Boolean,
          required: false,
        },
        domain: {
          type: String,
          required: false,
        },
        builderdb_restore: {
          type: Boolean,
          required: false,
        },
        builderdb_config: {
          inserted_collection: {
            type: [String],
            required: false,
          },
        },
        mysqldb_restore: {
          type: Boolean,
          required: false,
        },
        mysqldb_config: {
          inserted_tables: {
            type: [String],
            required: false,
          },
        },
        sign_up: {
          type: Boolean,
          required: false,
        },
        user_config: {
          username: {
            type: String,
            required: false,
          },
          password: {
            type: String,
            required: false,
          },
          email: {
            type: String,
            required: false,
          },
        },
        tenant_id: {
          type: String,
          required: false,

        },
        created_by: {
          type: String,
          required: true,
        },
        modified_by: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    return FIRSTRUNSTATUS_SCHEMA;
  }
}
module.exports = FirstRunStatus;
