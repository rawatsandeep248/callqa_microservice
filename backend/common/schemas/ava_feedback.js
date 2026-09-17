const MONGOOSE = require("mongoose");

class AvaFeedback {
    static getSchema() {
        const AVA_FEEDBACK_SCHEMA = new MONGOOSE.Schema(
            {
                unique_id: {
                    type: String,
                    required: true, // User ID
                },
                tenant_id: {
                    type: String,
                    required: true,
                },
                bot_id: {
                    type: String,
                    required: true, // User ID
                },               
                user_query: {
                    type: String,
                    required: true,
                },
                agent_response: {
                    type: String,
                    required: true,
                },
                feedback: {
                    type: String,
                    enum: ["POSITIVE", "NEGATIVE"],
                    required: true,
                },
                comment: {
                    type: String,
                    default: "",
                },              
                created_by: {
                    type: String,
                    required: true, // Could be system or user
                },
            },
            { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
        );

        return AVA_FEEDBACK_SCHEMA;
    }
}

module.exports = AvaFeedback;
