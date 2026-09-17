const MONGOOSE = require("mongoose");

const SECTION_SCORE_SCHEMA = new MONGOOSE.Schema(
  {
    section_id: { type: String, required: true },
    section_lineage_id: { type: String, required: true },
    section_name: { type: String, required: true },
    // Weighted score for this section only.
    section_score: { type: Number, default: null },
    max_section_score: { type: Number, default: null },
    // Per-question scored detail — stored for drill-down reporting.
    question_scores: [
      {
        question_id: { type: String, required: true },
        question_lineage_id: { type: String, required: true },
        selected_value: { type: MONGOOSE.Schema.Types.Mixed, default: null },
        points_awarded: { type: Number, default: 0 },
        max_points: { type: Number, default: 0 },
        is_na: { type: Boolean, default: false },
        critical_fail_triggered: { type: Boolean, default: false },
        confidence: { type: Number, default: null },
        _id: false,
      },
    ],
  },
  { _id: false }
);

class ScoredInteractionSchema {
  static getSchema() {
    const SCORED_INTERACTION = new MONGOOSE.Schema(
      {
        // Unique record ID — one doc per interaction per scorecard version.
        scored_interaction_id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        // The specific interaction this score belongs to.
        interaction_id: {
          type: String,
          required: true,
          index: true,
        },
        // Which scorecard version produced this score.
        scorecard_id: {
          type: String,
          required: true,
          index: true,
        },
        scorecard_lineage_id: {
          type: String,
          required: true,
        },
        scorecard_version: {
          type: Number,
          required: true,
        },
        // Routing context copied from the interaction at scoring time.
        // Allows filtering without joining interaction records.
        state: {
          type: String,
          default: null,
        },
        channel: {
          type: String,
          default: null,
        },
        // Agent / queue identifiers — non-PHI metadata.
        agent_id: {
          type: String,
          default: null,
        },
        queue_id: {
          type: String,
          default: null,
        },
        // Final rolled-up score as a percentage (0–100).
        total_score: {
          type: Number,
          default: null,
        },
        max_possible_score: {
          type: Number,
          default: null,
        },
        // True if any critical-fail question was answered with a fail response.
        critical_fail: {
          type: Boolean,
          default: false,
        },
        // Whether the overall score meets the pass threshold defined on the scorecard.
        passed: {
          type: Boolean,
          default: null,
        },
        section_scores: [SECTION_SCORE_SCHEMA],
        // Who or what produced this score.
        scored_by: {
          type: String,
          required: true,
          enum: ["AI", "HUMAN", "HYBRID"],
        },
        // UTC timestamp when the scoring engine finished processing.
        scored_at: {
          type: Date,
          required: true,
        },
        // Human reviewer who validated / overrode the AI score.
        reviewed_by: {
          type: String,
          default: null,
        },
        reviewed_at: {
          type: Date,
          default: null,
        },
        // Status of the record — PENDING until a human reviews AI scores.
        review_status: {
          type: String,
          required: true,
          default: "PENDING",
          enum: ["PENDING", "REVIEWED", "DISPUTED", "ACCEPTED"],
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    // Interaction-level detail view: all scores for one interaction.
    SCORED_INTERACTION.index({ interaction_id: 1, scorecard_id: 1 });

    // Agent performance dashboard: all scored interactions for an agent.
    SCORED_INTERACTION.index({ agent_id: 1, scored_at: -1 });

    // State + channel analytics: trend queries across a time window.
    SCORED_INTERACTION.index({ state: 1, channel: 1, scored_at: -1 });

    // Queue-level analytics.
    SCORED_INTERACTION.index({ queue_id: 1, scored_at: -1 });

    // Review workflow: find all PENDING records that need human review.
    SCORED_INTERACTION.index({ review_status: 1, scored_at: 1 });

    return SCORED_INTERACTION;
  }
}

module.exports = ScoredInteractionSchema;
