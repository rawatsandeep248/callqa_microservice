const MONGOOSE = require("mongoose");

const SECTION_SCHEMA = new MONGOOSE.Schema(
  {
    // Globally unique per section record. New UUID generated on create and version clone.
    section_id: {
      type: String,
      required: true,
    },
    // Stable across all versions of the same logical section within a lineage.
    // Used by audit log to correlate the same section across v1, v2, v3.
    section_lineage_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    weighting: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    fail_section: {
      type: Boolean,
      default: false,
    },
    // Ordered array of stable question_lineage_ids.
    // Array position defines evaluation and display order.
    // Survives version clone and import unchanged — no remapping ever needed.
    questions: [{ type: String }],
  },
  { _id: false }
);

class ScorecardSchema {
  static getSchema() {
    const SCORECARD = new MONGOOSE.Schema(
      {
        // Globally unique per scorecard record (one per version).
        // New UUID generated for every version. All downstream systems
        // (DataSync payload, test_run, scored_interaction, audit_log)
        // reference this single field — version is already baked in.
        scorecard_id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        // Stable across all versions of the same scorecard.
        // Groups v1, v2, v3 together. Used by version history screen.
        lineage_id: {
          type: String,
          required: true,
          index: true,
        },
        // Human-readable version counter within this lineage. Starts at 1.
        version: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: false,
          trim: true,
        },
        channels: {
          type: [String],
          required: true,
          validate: {
            validator: function (v) {
              return Array.isArray(v) && v.length > 0;
            },
            message: "At least one channel is required",
          },
        },
        status: {
          type: String,
          required: true,
          default: "DRAFT",
          enum: ["DRAFT", "PUBLISHED", "DISABLED", "ARCHIVED"],
        },
        // Sections embedded — lightweight, always accessed with the scorecard,
        // never need independent addressing. Each section carries an ordered
        // question_lineage_id string array as the canonical question sequence.
        sections: {
          type: [SECTION_SCHEMA],
          default: [],
        },
        // Denormalized — list screen never loads question docs just to show counts.
        total_sections: {
          type: Number,
          default: 0,
        },
        total_questions: {
          type: Number,
          default: 0,
        },
        // Lifecycle timestamps — set explicitly by the service layer.
        published_at: {
          type: Date,
          default: null,
        },
        published_by: {
          type: String,
          default: null,
        },
        disabled_at: {
          type: Date,
          default: null,
        },
        disabled_by: {
          type: String,
          default: null,
        },
        archived_at: {
          type: Date,
          default: null,
        },
        archived_by: {
          type: String,
          default: null,
        },
        // State or line-of-business this scorecard belongs to.
        // Used to auto-select the right scorecard when the ingest payload does not name one.
        state: {
          type: String,
          trim: true,
          default: null,
        },
        // Classifies what this scorecard evaluates (e.g. general QM, compliance, campaign).
        scorecard_type: {
          type: String,
          trim: true,
          default: null,
        },
        // If true, a single failing answer causes the entire scorecard to fail.
        fail_scorecard: {
          type: Boolean,
          default: false,
        },
        // Scoring policy for this card.
        scoring: {
          scoring_mode: {
            type: String,
          },
          // If fewer than this many points apply to a call, the run is inconclusive.
          min_applicable_points: {
            type: Number,
            default: 10,
          },
          // When true, a critical question failure zeroes the numeric score.
          critical_zeroes_score: {
            type: Boolean,
            default: false,
          },
          _id: false,
        },
        // Updated whenever any question or section changes.
        // Use this (not updated_at) to detect stale cached scorecards.
        content_updated_at: {
          type: Date,
          default: null,
        },
        // AI configuration used when scoring interactions against this scorecard.
        model_provider: {
          type: String,
          trim: true,
          default: null,
        },
        ai_model: {
          type: String,
          trim: true,
          default: null,
        },
        // Tracks how this scorecard record came to exist.
        origin: {
          type: String,
          required: true,
          enum: ["CREATED", "CLONED", "IMPORTED"],
          default: "CREATED",
        },
        // Populated when this scorecard was copied from another state or imported.
        source_scorecard_id: {
          type: String,
          default: null,
        },
        source_lineage_id: {
          type: String,
          default: null,
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
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        // Prevents two simultaneous saves from silently overwriting each other.
        optimisticConcurrency: true,
      }
    );

    // One version per lineage — enforced unique.
    SCORECARD.index({ lineage_id: 1, version: 1 }, { unique: true });

    // Version history screen: all versions of a lineage newest first.
    SCORECARD.index({ lineage_id: 1, version: -1 });

    // Scoring engine: "get PUBLISHED scorecards for a channel" (multikey index on array field).
    SCORECARD.index({ channels: 1, status: 1 });

    // Authoring list screen filters.
    SCORECARD.index({ status: 1, channels: 1 });

    return SCORECARD;
  }
}

module.exports = ScorecardSchema;
