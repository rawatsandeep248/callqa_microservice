const MONGOOSE = require("mongoose");
// MONGOOSE.pluralize(null);
class AvaAgents {
    static getSchema() {
        const AVA_AGENT = new MONGOOSE.Schema(
            {
                name: {
                    type: String
                },
                version: {
                    type: String,
                    default: "v1.0",
                },
                is_main: {
                    type: Boolean,
                    default: false,
                },
                model: {
                    type: String,
                },
                model_provider: {
                    type: String,
                    required: true,
                },
                prompt_name: {
                    type: String,
                    required: true,
                },
                prompt: {
                    type: String,
                    required: true,
                },
                agents: {
                    type: [String],
                    default:[]
                },
                tools: {
                    type: [String],
                    default:[]
                },
                api_mapping:{
                    type:[String],
                    default:[]
                },
                req_auth:{
                    type:Boolean,
                    default:false
                },
                tenant_id: {
                    type: String,
                    required: true,
                },
                description : {
                    type: String,
                    default : "Legacy Version",
                },
                migrated_from : {
                    type: String,
                    default : "Legacy Version",
                },
                active_version : {
                    type: Boolean,
                },
                is_deleted:{
                    type:Boolean,
                    default:false
                },
                deleted_at:{
                    type:String,
                    default:""
                },
                deleted_by:{
                    type:String,
                    default:""
                },
                created_by: {
                    type: String,
                    required: true,
                },
                updated_by: {
                    type: String,
                    required: true,
                }
            },
            {
                timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            }
        );
        return AVA_AGENT;
    }
}

module.exports = AvaAgents;