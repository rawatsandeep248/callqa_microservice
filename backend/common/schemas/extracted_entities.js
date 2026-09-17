const MONGOOSE = require('mongoose');
class Extracted_Entities {
    static getSchema() {
        const EXTRACTED_ENTITIES_SCHEMA = new MONGOOSE.Schema({
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
            createdAt: {
                type: Date,
                required: true
            },
            entities: {
                type: Object
            },            
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            })
        return EXTRACTED_ENTITIES_SCHEMA;
    }
}


module.exports = Extracted_Entities;
