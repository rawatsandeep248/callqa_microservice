const MONGOOSE = require('mongoose');
class LLM {
    static getSchema() {
        const LLM_SCHEMA = new MONGOOSE.Schema({
            llm_utterances: [
                {
                    name: {
                        type: String,
                    },
                    skills: {
                        type: Object,
                    }
                }
            ],
            updated_by: {
                type: String
            },
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            })
        return LLM_SCHEMA;
    }
}


module.exports = LLM;
