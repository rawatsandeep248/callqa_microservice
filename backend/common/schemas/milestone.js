const MONGOOSE = require('mongoose');
class Milestone {
    static getSchema() {
        const MILESTONE_SCHEMA = new MONGOOSE.Schema({
            session_id: {
                type: String,
                required: true
            },
            tenant_id: {
                type: String,
                required: true
            },
            timestamp: {
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
            text: {
                type: String,
                required: true
            },            
        } )
        return MILESTONE_SCHEMA;
    }
}


module.exports = Milestone;
