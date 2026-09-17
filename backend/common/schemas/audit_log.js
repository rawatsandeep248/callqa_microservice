const MONGOOSE = require("mongoose");

class AuditLogSchema {
  static getSchema() {
    const AUDITLOG = new MONGOOSE.Schema(
      {
        user_id: {
          type: String,
        },
        user_email: {
          type: String,
        },
        audit_log: [
          {
            activity: {
              type: String,
              require: true,
            },
            created_by: {
              type: String,
              require: true,
            },           
            created_on: {
              type: Date,
              require: true,
            },
          
            user_id: {
              type: String,
            },
            user_email: {
              type: String,
            },
            tenant_id: {
              type: String,
            },
            name:{
              type:String,
              require: true
            },
            action:{
              type:String,
              require: true
            },
            ip:{
              type:String,
                require: true
            }
          },
          
        ],
        status_logs: [
          {
            status: {
              type: String,
            },
            modified_on: {
              type: Date,
            },
          },
        ],
        
        
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    });

    return AUDITLOG;
  }
}
module.exports = AuditLogSchema;