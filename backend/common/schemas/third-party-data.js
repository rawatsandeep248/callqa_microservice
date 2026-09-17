const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;

class ThirdPartyData {
  static getSchema() {
    const ExtraData = new MONGOOSE.Schema(
      {
        patient_id: {
          type: String,
        },
        practitioner_id: {
          type: String,
        },
        departmentId: {
          type: String,
        },
        providerId: {
          type: String,
        },
        data_type: {
          type: String,
          enum: ["ATHENA_APPOINTMENT"],
          default: ["ATHENA_APPOINTMENT"],
        },
        appointment_id: {
          type: String,
        },
        reason_id: {
          type: String,
        },
        athena_appointment_details: {
          patient_info: {
            type: Schema.Types.Mixed,
          },
          department_info: {
            type: Schema.Types.Mixed,
          },
          provider_info: {
            type: Schema.Types.Mixed,
          },
          reason_info: {
            type: Schema.Types.Mixed,
          },
          appointment_info: {
            type: Schema.Types.Mixed,
          },
          appointment_status: {
            type: String,
            enum: ["CONFIRMED", "CANCELLED", "RESCHEDULED"],
          },
          old_appointment_id: {
            type: String,
          },
          reschedule_reason: {
            type: String,
          },
          cancel_reason: {
            type: String,
          },
        },
        tenant_id: {
          type: String,
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
    return ExtraData;
  }
}
module.exports = ThirdPartyData;
