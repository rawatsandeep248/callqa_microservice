const MONGOOSE = require("mongoose");
const MessageUtil = require('../utils/message-util');

class CustomerSchema {
    static getSchema() {
        const CUSTOMERS = new MONGOOSE.Schema({
            apiKey: {
                type: String,
                required: true
            },
            tenant_id: {
                type: String,
                required: true
            },
            database: {
                host: {
                    type: String,
                    required: true
                },
                user: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                }
            },
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE'],
                default: 'INACTIVE'
            },
            created_by: {
                type: String,
                required: true
            },
            modified_by: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            email_verified: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            role: [{
                type: String,
                enum: [MessageUtil.customerInfo().role.customerAdmin, MessageUtil.customerInfo().role.opsManager, MessageUtil.customerInfo().role.teamlead, MessageUtil.customerInfo().role.agent, MessageUtil.customerInfo().role.sales,MessageUtil.customerInfo().role.reporting]
            }],
          },
          { timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        });
        
        return CUSTOMERS;
    }
}
module.exports = CustomerSchema;
