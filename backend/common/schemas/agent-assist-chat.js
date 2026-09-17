const MONGOOSE = require("mongoose");

class AgentAssistChat {
  static getSchema() {
    const AGENT_ASSIST_CHAT_SCHEMA = new MONGOOSE.Schema(
      {
        unique_id: { type: String, required: true },
        turn_id: { type: String, required: false },
        interactionID: { type: String },
        bot_id: { type: String, required: true },
        bot_name: { type: String, required: true },
        tenant_id: { type: String, default: "" },
        agent_type: { type: String },
        agent_id: { type: String, default: null },
        user_query: { type: String },
        text: { type: String, default: null },
        answer: { type: MONGOOSE.Schema.Types.Mixed, default: () => ({}) },
        sources: { type: MONGOOSE.Schema.Types.Mixed, default: () => [] },
        event: { type: MONGOOSE.Schema.Types.Mixed, default: null },
        user_label: { type: MONGOOSE.Schema.Types.Mixed, default: null },
        metadata: { type: MONGOOSE.Schema.Types.Mixed, default: null },
        timestamp: { type: Date, required: true },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    AGENT_ASSIST_CHAT_SCHEMA.index({ unique_id: 1, timestamp: 1 });
    AGENT_ASSIST_CHAT_SCHEMA.index({ interactionID: 1 });

    return AGENT_ASSIST_CHAT_SCHEMA;
  }
}

module.exports = AgentAssistChat;

 
