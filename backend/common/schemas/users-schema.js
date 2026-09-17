const MONGOOSE = require("mongoose");
const MessageUtil = require("../utils/message-util");

class UsersSchema {
  static getSchema() {
    const USERS = new MONGOOSE.Schema(
      {
        name: {
          type: String,
        },
        preferred_language: {
          type: String,
          required: true,
        },
        phone_number: {
          type: String,
          required: true,
        },
        email_address: {
          type: String,
          default: "",
        },
        intents: {
          type: String,
          default: "",
        },
        send_sms: {
          type: Boolean,
          default: true,
        },
        send_email: {
          type: Boolean,
          default: true,
        },
        communication_message: {
          type: String,
          default: "",
        },
        status: {
          type: String,
          default: "ACTIVE",
          enum: ["ACTIVE", "INACTIVE"],
        },
        user_id: {
          type: String,
          required: true,
        },
        group_id: {
          type: String,
          required: true,
        },
        created_by: {
          type: String,
          required: true,
        },
        updated_by: {
          type: String,
          required: true,
        },
      },
      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
    );

    return USERS;
  }
}
module.exports = UsersSchema;
