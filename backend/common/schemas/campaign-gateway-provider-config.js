const MONGOOSE = require("mongoose");

class campaignProviderConfig {
  static getSchema() {
    const CAMPAIGNPROVIDERCONFIG = new MONGOOSE.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          default: "INACTIVE",
          enum: ["INACTIVE", "ACTIVE"],
        },
        gateway_provider_name: {
          type: String,
          required: true,
        },
        configuration: {},
        verified: {
          type: String,
          default: "UnVerified",
          enum: ["UnVerified", "Verified"],
        },
        type: {
          type: String,
          required: true,
          enum: ["EMAIL", "SMS"],
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

    // Ensure the index is created in the MongoDB database
    CAMPAIGNPROVIDERCONFIG.index({ name: 1 }, { unique: true });

    return CAMPAIGNPROVIDERCONFIG;
  }
}
module.exports = campaignProviderConfig;
