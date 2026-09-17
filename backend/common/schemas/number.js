const MONGOOSE = require("mongoose");

class NumberSchema {
  static getSchema() {
    const NUMBER = new MONGOOSE.Schema(
      {
        country: {
          type: String,
        },
        msisdn: {
          type: String,
        },
        cost: {
          type: String,
        },
        type: {
          type: String,
        },
        tenant_id: {
          type: String,
        },
        customer_email: {
          type: String,
        },
        voice_callback_type: {
          type: String,
        },
        voice_callback_value: {
          type: String,
        },
        features: [{ type: String }],
        bot_attached: {
          bot_name: {
            type: String,
          },
          bot_id: {
            type: String,
          },
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    return NUMBER;
  }
}

module.exports = NumberSchema;
