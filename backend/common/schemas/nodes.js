const MONGOOSE = require('mongoose');
class Node {
    static getSchema() {
        const NODE_SCHEMA = new MONGOOSE.Schema({
            bot_id: {
                type: String,
                required: true
            },
            bot_name: {
                type: String,
                required: true
            },
            tenant_id: {
                type: String,
                required: true
            },
            unique_id: {
                type: String,
                required: true
            },
            caller_id: {
                type: String,
                required: true
            },
            called_no: {
                type: String,
                required: true
            },
            user_query: {
                type: String,
                required: true
            },
            created_at: {
                type: Date,
                required: true
            },
            skill: {
                type: String,
                required: true
            },
            node: {
                type: String,
                required: true
            },
            dva: {
                type: Boolean,
                required: true
            },
            escalated: {
                type: Boolean,
                required: true
            }
        }
        )
        return NODE_SCHEMA;
    }
}
 
module.exports = Node;