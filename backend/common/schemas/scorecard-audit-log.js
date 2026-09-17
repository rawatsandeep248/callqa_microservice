const MONGOOSE = require("mongoose");

class ScorecardAuditLogSchema {
  static getSchema() {
    const SCORECARD_AUDIT_LOG = new MONGOOSE.Schema(
      {
        // The scorecard version this event occurred on.
        scorecard_id: {
          type: String,
          required: true,
          index: true,
        },
        // Stable identifier — history view shows all events across every version
        // of the same scorecard by querying on lineage_id.
        scorecard_lineage_id: {
          type: String,
          required: true,
          index: true,
        },
        scorecard_version: {
          type: Number,
          required: true,
        },
        // Entity that was acted on. Allows targeted history views
        // (e.g. "changes to this section" or "changes to this question").
        entity_type: {
          type: String,
          required: true,
          enum: ["SCORECARD", "SECTION", "QUESTION"],
        },
        entity_id: {
          type: String,
          default: null,
        },
        entity_lineage_id: {
          type: String,
          default: null,
        },
        action: {
          type: String,
          required: true,
          enum: [
            "CREATED",
            "UPDATED",
            "PUBLISHED",
            "DRAFT_CREATED",
            "DISABLED",
            "ARCHIVED",
            "SECTION_ADDED",
            "SECTION_UPDATED",
            "SECTION_REMOVED",
            "SECTION_REORDERED",
            "QUESTION_ADDED",
            "QUESTION_UPDATED",
            "QUESTION_REMOVED",
            "QUESTION_REORDERED",
            "IMPORTED",
            "EXPORTED",
          ],
        },
        // Structured before/after payload — only changed fields are stored.
        before: {
          type: MONGOOSE.Schema.Types.Mixed,
          default: null,
        },
        after: {
          type: MONGOOSE.Schema.Types.Mixed,
          default: null,
        },
        // Who triggered the event.
        actor_id: {
          type: String,
          required: true,
        },
        actor_email: {
          type: String,
          required: true,
        },
        // Optional IP for security / compliance trail.
        ip_address: {
          type: String,
          default: null,
        },
        metadata: {
          type: MONGOOSE.Schema.Types.Mixed,
          default: null,
        },
      },
      {
        // Audit records are append-only — updatedAt is intentionally omitted
        // to prevent accidental updates from surfacing as meaningful timestamps.
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );

    // Audit trail for a specific scorecard version.
    SCORECARD_AUDIT_LOG.index({ scorecard_id: 1, created_at: -1 });

    // Full history across all versions of a scorecard lineage.
    SCORECARD_AUDIT_LOG.index({ scorecard_lineage_id: 1, created_at: -1 });

    // History scoped to a single question lineage.
    SCORECARD_AUDIT_LOG.index({ entity_lineage_id: 1, created_at: -1 });

    return SCORECARD_AUDIT_LOG;
  }
}

module.exports = ScorecardAuditLogSchema;
