const MONGOOSE = require("mongoose");

const QM_RECORD_SCHEMA = new MONGOOSE.Schema(
  {
    question_id: { type: String, required: true },
    question_lineage_id: { type: String, required: true },
    question_text: { type: String, required: true },
    question_type: { type: String, required: true },
    response_options: [
      {
        label: { type: String },
        value: { type: String },
        points: { type: Number },
        critical_fail: { type: Boolean, default: false },
        _id: false,
      },
    ],
    max_points: { type: Number },
    weight: { type: Number },
    section_id: { type: String },
    section_lineage_id: { type: String },
  },
  { _id: false }
);

const ERROR_LOG_ENTRY_SCHEMA = new MONGOOSE.Schema(
  {
    attempt: { type: Number, required: true },
    error_code: { type: String, default: null },
    error_message: { type: String, default: null },
    attempted_at: { type: Date, required: true },
  },
  { _id: false }
);

class DatasyncPublicationQueueSchema {
  static getSchema() {
    const DATASYNC_PUBLICATION_QUEUE = new MONGOOSE.Schema(
      {
        // Unique ID for this queue entry.
        job_id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
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
        // The full flattened QM payload sent to DataSync.
        // Stored here so retries replay the same payload without re-fetching.
        payload: {
          qm_records: [QM_RECORD_SCHEMA],
          state: { type: String },
          channel: { type: String },
          published_at: { type: Date },
        },
        status: {
          type: String,
          required: true,
          default: "PENDING",
          enum: ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED", "DEAD_LETTER"],
        },
        // Total attempts made including the initial attempt.
        attempt_count: {
          type: Number,
          default: 0,
        },
        max_attempts: {
          type: Number,
          default: 5,
        },
        // Timestamp when a worker last picked this job up.
        locked_at: {
          type: Date,
          default: null,
        },
        // Which worker instance holds the lock — prevents double-processing.
        locked_by: {
          type: String,
          default: null,
        },
        // Earliest time this job may be retried (exponential back-off).
        next_retry_at: {
          type: Date,
          default: null,
          index: true,
        },
        // Human-readable history of every attempt.
        error_log: [ERROR_LOG_ENTRY_SCHEMA],
        triggered_by: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    // Worker query: pick up PENDING jobs whose retry window has elapsed.
    DATASYNC_PUBLICATION_QUEUE.index({
      status: 1,
      next_retry_at: 1,
      attempt_count: 1,
    });

    // Admin view: all jobs for a scorecard version.
    DATASYNC_PUBLICATION_QUEUE.index({ scorecard_id: 1, created_at: -1 });

    return DATASYNC_PUBLICATION_QUEUE;
  }
}

module.exports = DatasyncPublicationQueueSchema;
