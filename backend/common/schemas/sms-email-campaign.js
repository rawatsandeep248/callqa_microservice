const MONGOOSE = require("mongoose");

class SMSEMAILCAMPAIGNSCHEMA {
  static getSchema() {
    const SMSEMAILCAMPAIGN = new MONGOOSE.Schema(
      {
        name: {
          type: String,
        },
        user_id: {
          type: String,
          required: true,
        },
        preferred_language: {
          type: String,
          required: true,
        },
        phone_number: {
          type: String,
          default: "",
        },
        email_address: {
          type: String,
          default: "",
        },
        send_sms: {
          type: Boolean,
          default: true,
        },
        send_email: {
          type: Boolean,
          default: true,
        },
        communication_message_sms: {
          type: String,
          default: "",
        },

        communication_message_email: {
          type: String,
          default: "",
        },
        intents: {
          type: String,
          default: "",
        },
        subject: {
          type: String,
          default: "",
        },
        status: {
          type: String,
          default: "ACTIVE",
          enum: ["ACTIVE", "INACTIVE"],
        },
        gateway_info: [
          {
            gateway_id: {
              type: String,
            },
            gateway_type: {
              type: String,
              enum: ["SMS", "EMAIL"],
            },
          },
        ],
        campaign_id: {
          type: String,
          required: true,
        },
        exchange_name: {
          type: String,
          required: true,
        },
        sent_status: {
          type: String,
          enum: ["PENDING", "SENT"],
          default: "PENDING",
        },
        delivery_status: {
          type: String,
          enum: [
            "PENDING",
            "QUEUED",
            "SENT",
            "DELIVERED",
            "UNDELIVERED",
            "FAILED",
            "ERRORED",
          ],
          default: "PENDING",
        },
        provider_response: {},
        interaction_id: {
          type: Array,
          default: [],
        },
        date_time_interaction: {
          type: Array,
          default: [],
        },
        delivery_time: {
          type: String,
          default: "N/A",
        },
        sent_time: {
          type: String,
          default: "N/A",
        },
        clicked_status: {
          type: Boolean,
          default: false,
        },
        master_id: {
          type: Array,
          default: [],
        },
        created_by: {
          type: String,
          required: true,
        },
        updated_by: {
          type: String,
          required: true,
        },
        timezone: {
          type: String,
          default: "",
        },
        queued_time: {
          type: String,
          default: "",
        },
        processing_status: {
          type: String,
          default: "PENDING",
          enum: ["PENDING", "PROCESSING", "PROCESSED"],
        },
      },
      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
    );

    return SMSEMAILCAMPAIGN;
  }
}
module.exports = SMSEMAILCAMPAIGNSCHEMA;
