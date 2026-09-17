const MONGOOSE = require("mongoose");

class VonageCountrySchema {
  static getSchema() {
    const COUNTRY = new MONGOOSE.Schema(
      {
        name: {
          type: String,
        },
        flag: {
          type: String,
        },
        dial_code: {
          type: String,
        },
        top:{
            type:Boolean
        }
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    return COUNTRY;
  }
}

module.exports = VonageCountrySchema;
