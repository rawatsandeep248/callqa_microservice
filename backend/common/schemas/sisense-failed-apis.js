const MONGOOSE = require("mongoose");
class SisenseFailedAPI {
  static getSchema() {
    const SisenseFailedAPISchema = new MONGOOSE.Schema(
      {
        session_id: {
          type: String,
          required: true,
        },
        tenant_id: {
          type: String,
          required: true,
        },
        timestamp: {
          type: String,
          required: true,
        },
        time_elapsed: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        request_type: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        response_code: {
          type: String,
          required: true,
        },
        // removed required true as 3rd party data are logged
        request_body: {
          type: MONGOOSE.Schema.Types.Mixed,
        },
        // removed required true as 3rd party data are logged
        response_body: {
          type: MONGOOSE.Schema.Types.Mixed,
        },

        request_id: {
          type: String,
          required: true,
        },
        timezone: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
    );
    return SisenseFailedAPISchema;
  }
}

module.exports = SisenseFailedAPI;
