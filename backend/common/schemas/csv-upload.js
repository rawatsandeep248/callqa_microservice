const MONGOOSE = require("mongoose");
class CsvUploadSchema {
    static getSchema() {
        const CSVUPLOADS = new MONGOOSE.Schema(
            {
                headers : {
                    type : [String],
                    required : true
                },
                description: {
                    type: String,
                    required: true,
                },
                details: {
                    type: Object,
                    required: true,
                },
                tenant_id: {
                    type: String,
                    required: true,
                },
                collection_name: {
                    type: String,
                    required: true,
                },
                source_file: {
                    type: String,
                    required: true,
                },
                modified_by: {
                    type: String,
                },
                created_by: {
                    type: String,
                    required: true,
                },
            },
            {
                timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            }
        );
        return CSVUPLOADS;
    }
}
module.exports = CsvUploadSchema;