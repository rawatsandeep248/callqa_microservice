const MONGOOSE = require("mongoose");

class FhirSchema {
  static getSchema() {
    const FHIR = new MONGOOSE.Schema(
      {
        fhir_specs: {
          fhir_resource_name: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            default: "",
          },
          kind: {
            type: String,
            default: "",
          },
          fhir_data: {
            type: MONGOOSE.Schema.Types.Mixed,
            default: {},
          },
          fhir_service_name: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["PENDING", "ACTIVE", "INACTIVE"],
            default: "PENDING",
            required:true
          },
        },
        tenant_id: {
          type: String,
          required: true,
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
    return FHIR;
  }
}
module.exports = FhirSchema;
