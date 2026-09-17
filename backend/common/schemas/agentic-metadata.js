const MONGOOSE = require("mongoose");
class AgenticMetaData {
  static getSchema() {
    const AgenticMetaDataSchema = new MONGOOSE.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        
        metadataType: {
          type: String,
          required: true,
          enum: ["LINK_TOOLS", "API_MAPPING"],
        },
        updatedBy: {
          type: String,
          required: true,
        },
        createdBy: {
          type: String,
          required: true,
        },
      },
      { timestamps: true },
    );
    // Enforce globally unique document names in this collection (Mongo unique index).
    AgenticMetaDataSchema.index(
      { name: 1 },
      { unique: true, name: "IDX_AGENTIC_METADATA_NAME" },
    );
    return AgenticMetaDataSchema;
  }
}

module.exports = AgenticMetaData;
