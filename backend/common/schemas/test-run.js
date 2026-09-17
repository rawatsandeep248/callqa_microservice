const MONGOOSE = require("mongoose");

const QUESTION_RESULT_SCHEMA = new MONGOOSE.Schema(
  {
    question_id: { type: String, required: true },
    question_lineage_id: { type: String, required: true },
    question_text: { type: String, required: true },
    question_type: { type: String, required: true },
    // Response selected by the scorer / AI engine.
    selected_response: { type: MONGOOSE.Schema.Types.Mixed, default: null },
    // Points awarded for the selected response.
    points_awarded: { type: Number, default: 0 },
    max_points: { type: Number, required: true },
    // True if this question triggered a critical fail.
    critical_fail_triggered: { type: Boolean, default: false },
    is_na: { type: Boolean, default: false },
    // AI confidence score (0–1), null for manual runs.
    confidence: { type: Number, default: null },
    // Why the AI chose this response — used for QA of the AI scorer.
    reasoning: { type: String, default: null },
  },
  { _id: false }
);

const INTERACTION_RESULT_SCHEMA = new MONGOOSE.Schema(
  {
    interaction_id: { type: String, required: true },
    // Raw score as a percentage (0–100).
    total_score: { type: Number, default: null },
    max_possible_score: { type: Number, default: null },
    // Whether a critical-fail question was triggered.
    critical_fail: { type: Boolean, default: false },
    // Per-section breakdown.
    section_results: [
      {
        section_id: { type: String, required: true },
        section_lineage_id: { type: String, required: true },
        section_name: { type: String, required: true },
        section_score: { type: Number, default: null },
        max_section_score: { type: Number, default: null },
        question_results: [QUESTION_RESULT_SCHEMA],
        _id: false,
      },
    ],
    // Processing outcome for this single interaction.
    status: {
      type: String,
      enum: ["PASSED", "FAILED", "ERROR", "SKIPPED"],
      default: null,
    },
    error_message: { type: String, default: null },
  },
  { _id: false }
);

class TestRunSchema {
  static getSchema() {
    const TEST_RUN = new MONGOOSE.Schema(
      {
        // Unique ID for this test run.
        run_id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        // The scorecard under test.
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
        status: {
          type: String,
          required: true,
          default: "QUEUED",
          enum: [
            "QUEUED",
            "RUNNING",
            "COMPLETED",
            "FAILED",
            "CANCELLED",
            "PARTIAL",
          ],
        },
        // Sample of interaction IDs submitted for testing.
        interaction_ids: [{ type: String }],
        total_interactions: { type: Number, default: 0 },
        processed_interactions: { type: Number, default: 0 },
        failed_interactions: { type: Number, default: 0 },
        // Results for every sampled interaction.
        results: [INTERACTION_RESULT_SCHEMA],
        // Aggregate statistics across all sampled interactions.
        aggregate: {
          average_score: { type: Number, default: null },
          min_score: { type: Number, default: null },
          max_score: { type: Number, default: null },
          critical_fail_rate: { type: Number, default: null },
          pass_rate: { type: Number, default: null },
        },
        // Timestamps for run lifecycle.
        started_at: { type: Date, default: null },
        completed_at: { type: Date, default: null },
        // Initiator of the test run.
        triggered_by: { type: String, required: true },
        error_message: { type: String, default: null },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    // Fetch all runs for a scorecard — used by test history tab.
    TEST_RUN.index({ scorecard_id: 1, created_at: -1 });

    // Queue consumer: find QUEUED runs in submission order.
    TEST_RUN.index({ status: 1, created_at: 1 });

    return TEST_RUN;
  }
}

module.exports = TestRunSchema;
