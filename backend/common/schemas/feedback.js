const MONGOOSE = require('mongoose');
class Feedback {
    static getSchema() {
        const FEEDBACK_SCHEMA = new MONGOOSE.Schema({
            tenant_id: {
                type: String,
                required: true
            },
            bot_id: {
                type: String,
                required: true
            },
            handled: {
                type: Boolean,
                default: false
            },
            skill_removed: {
                type: Boolean,
                default: false
            },
            session_id: {
                type: String,
                required: true
            },
            skill_name: {
                type: String,
                required: true
            },
            node_name: {
                type: String
            },
            user_query: {
                type: String,
                required: true
            },
            skill_mapped:{
                type: String
            },
            updated_by:{
                type: String
            },
            timestamp: {
                type: Date,
                required: true
            },
            channel:{
                type:String,
            }
        },
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        });
        return FEEDBACK_SCHEMA;
    }
}

module.exports = Feedback;
