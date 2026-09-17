const MONGOOSE = require("mongoose");

class CampaignGroup {
  static getSchema() {
    const CAMPAIGNGROUP = new MONGOOSE.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          default: "ACTIVE",
          enum: ["INACTIVE", "ACTIVE"],
        },
        campaign_id: [
          {
            id: {
              type: String,
            },
          },
        ],
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

    return CAMPAIGNGROUP;
  }
}
module.exports = CampaignGroup;
