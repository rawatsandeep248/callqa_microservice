const MONGOOSE = require('mongoose');
const MessageUtil = require('../utils/message-util');

class UserSchema {
    static getSchema() {
        const USERS = new MONGOOSE.Schema({
            modified_by: {
                type: String
            },
            created_by: {
                type: String,
                required: true
            },
            password: {
                type: String,
            },
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE'],
                default: 'INACTIVE'
            },
            type: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            email_verified: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String
            },
            tenant_id: {
                type: String,
            },
            asterisk_user_id: {
                type: String,
            },
            asterisk_user_password:{
                type:String,
                default:'qWeankit'
            },
            position: {
                type: String
            },
            last_login:{
                type: Date
            },
            role: [{
                type: String,
                enum: [MessageUtil.customerInfo().role.customerAdmin, MessageUtil.customerInfo().role.opsManager, MessageUtil.customerInfo().role.teamlead, MessageUtil.customerInfo().role.user, MessageUtil.customerInfo().role.sales,MessageUtil.customerInfo().role.reporting]
            }],
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            }
            )
        return USERS;
    }
}
module.exports = UserSchema;
