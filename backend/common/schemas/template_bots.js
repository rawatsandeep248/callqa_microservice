const MONGOOSE = require('mongoose');

class TemplateBotSchema {
    static getSchema() {
        const TEMPLATE_BOT = new MONGOOSE.Schema({
            template_id: {
                type: String,
            },
            bot_name: {
                type: String,
            },
            webhook: {
                type: String,
            },
            customer_name: {
                type: String
            },
            bot_id: {
                type: String,
            },
            number_attached: {
                type: String,
            },
            tenant_id:{
                type:String
            },
            request_type:{
                type:String
            }
            },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            })
        return TEMPLATE_BOT;
    }
}

module.exports = TemplateBotSchema;