const MONGOOSE = require("mongoose");
class Chat {
  static getSchema() {
    // this.CHAT_SCHEMA =new MONGOOSEDB(url).connectToDB();

    // chat_id is removed on 17th Oct 2023 as it was not being used!!
    const CHAT_SCHEMA = new MONGOOSE.Schema(
      {
        // chat_id: {
        //     type: String,
        //     required: true
        // },
        bot_id: {
          type: String,
          required: true,
        },
        bot_name: {
          type: String,
          required: true,
        },
        tenant_id: {
          type: String,
          required: true,
        },
        unique_id: {
          type: String,
          required: true,
        },
        caller_id: {
          type: String,
        },
        called_no: {
          type: String,
        },
        agent_type: {
          type: String,
        },
        user_query: {
          type: String,
        },
        user_name: {
          type: String,
        },
        event: {
          type: String,
        },
        bot_response: [],
        voice: {
          type: Boolean,
        },
        language: {
          type: String,
        },
        timestamp: {
          type: Date,
          required: true,
        },
        template_data: {
          type: String,
        },
        processing_time: {
          type: String,
          default: "",
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    CHAT_SCHEMA.index({ unique_id: 1,timestamp: 1})
    // let collection=MESSAGEUTIL.info().database_collections.customer_db.chat+'_'+bot_id
    // const CHAT_SCHEMA = this.CONNECTION.model(collection, ChatSchema);
    return CHAT_SCHEMA;
  }
}

module.exports = Chat;
