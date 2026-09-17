const MONGOOSE = require("mongoose");

class BOT_SCHEMA {
  static getSchema() {
    const BOT = new MONGOOSE.Schema(
      {
        template_id: {
          type: String,
        },
        bot_name: {
          type: String,
        },
        webhook: {
          type: String,
        },
        customer_name: {
          type: String,
        },
        bot_id: {
          type: String,
        },
        created_by: {
          type: String,
        },
        updated_by: {
          type: String,
        },
        number_attached: { type: Array },
        tenant_id: {
          type: String,
        },
        request_type: {
          type: String
        }
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    return BOT;
  }
}

module.exports = BOT_SCHEMA;
