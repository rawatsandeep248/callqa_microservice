const MONGOOSE = require('mongoose');

class Dispositions {

    static getSchema() {

        const DISPOSITIONS_SCHEMA = new MONGOOSE.Schema({

            uid: {
                type: String,
                required: true,
                index: true
            },

            name: {
                type: String,
                required: true
            },

            observations: {
                failure_reasons: [{
                    type: String,
                    required: true
                }],

                disposition: {
                    type: String,
                    required: true
                },

                additional_notes: {
                    type: String
                },

                caller_intent: {
                    type: String,
                    required: true
                },

                call_fail_stage: {
                    type: String,
                    required: true
                },

                label_correctness: {
                    type: Boolean,
                    required: true
                },
                Classifier: [{
                    type: String,
                   
                }]
            },

            created_by: {
                type: String
            },

            updated_by: {
                type: String
            }

        },
        {
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
        });

        return DISPOSITIONS_SCHEMA;
    }
}

module.exports = Dispositions;