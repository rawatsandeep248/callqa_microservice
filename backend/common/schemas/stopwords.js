const MONGOOSE = require('mongoose');
class Stopwords {
    static getSchema() {
        const STOPWORDS_SCHEMA = new MONGOOSE.Schema({
            tenant_id: {
                type: String,
                required: true
            },          
           wordname: {
                type: String,
                required: true
            },          
            updated_by:{
                type: String
            },
            // timestamp: {
            //     type: Date,
            //     required: true
            // },           
        },
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        });
        return STOPWORDS_SCHEMA;
    }
}

module.exports = Stopwords;