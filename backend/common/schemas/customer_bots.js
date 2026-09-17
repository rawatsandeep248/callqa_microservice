const MONGOOSE = require("mongoose");

class CustomerBot {
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
          unique: true,
        },
        number_attached: {
          type: Array,
        },
        tenant_id: {
          type: String,
        },
        fhir_specs: {
          url: {
            type: String,
          },
          client_id: {
            type: String,
          },
          secret_key: {
            type: String,
          },
          redox_url: {
            type: String,
          },
          redox_id: {
            type: Boolean,
          },
        },
        slots: [
          {
            seq_no: {
              type: Number,
            },
            slot_name: {
              type: String,
            },
            display_name: {
              type: String,
            },
            slot_utterance: {
              type: String,
            },
            is_mandatory: {
              type: Boolean,
            },
            is_enabled: {
              type: String,
            },
            utterance_updatable: {
              type: Boolean,
            },
          },
        ],
        end_webhook: {
          is_enabled: {
            type: Boolean,
          },
          url: {
            type: String,
          },
        },
        created_by: {
          type: String,
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    return BOT;
  }
}

module.exports = CustomerBot;
