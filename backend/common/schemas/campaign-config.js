const MONGOOSE = require("mongoose");

class CampaignConfig {
  static getSchema() {
    const CAMPAIGNCONFIG = new MONGOOSE.Schema(
      {
        campaign_id: {
          type: String,
          required: true,
        },
        email_template: {
          type: String,
          default: "",
        },
        sms_template: {
          type: String,
          default: "",
        },
        exchange_name: {
          type: String,
          default: "",
        },
        subject: {
          type: String,
          default: "",
        },
        intent: {
          type: [String],
          default: [],
        },
        max_retry: {
          type: Number,
          default: 0,
        },

        gateways_provider: [
          {
            gateway_id: {
              type: String,
              required: true,
            },
            gateway_name: {
              type: String,
              required: true,
            },
            gateway_type: {
              type: String,
              enum: ["SMS", "EMAIL"],
            },
          },
        ],
        enable_throttling: {
          type: Boolean,
          default: false,
        },
        throttle_rate: {
          type: Number,
          default: 0,
        },
        created_by: {
          type: String,
          required: true,
        },
        updated_by: {
          type: String,
          required: true,
        },
      },
      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
    );

    return CAMPAIGNCONFIG;
  }
}
module.exports = CampaignConfig;
