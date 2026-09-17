const MONGOOSE = require("mongoose");

class ScorecardQuestionSchema {
  static getSchema() {
    const SCORECARD_QUESTION = new MONGOOSE.Schema(
      {
        // Globally unique per question record.
        // A new UUID is generated for every version clone or import.
        question_id: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        // Stable across all versions of the same logical question.
        // Embedded inside section.questions[] array in the scorecard doc.
        // This stable string is what gets stored, cloned, and imported —
        // no ObjectId remapping required.
        question_lineage_id: {
          type: String,
          required: true,
          index: true,
        },
        // Parent scorecard back-references — both IDs preserved so the question
        // record is independently addressable without joining the scorecard doc.
        scorecard_id: {
          type: String,
          required: true,
          index: true,
        },
        scorecard_lineage_id: {
          type: String,
          required: true,
        },
        // Parent section back-references.
        section_id: {
          type: String,
          required: true,
        },
        sequence: {
          type: Number,
          required: true,
        },
        section_lineage_id: {
          type: String,
          required: true,
        },
        // Question version counter within its own lineage. Starts at 1.
        version: {
          type: Number,
          default: 1,
          min: 1,
        },
        question_text: {
          type: String,
          required: true,
          trim: true,
        },
        question_type: {
          type: String,
          required: true,
          // enum: ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO", "NUMERIC", "TEXT"],
        },
        response_options: [
          {
            label:  { type: String, required: true },
            // UPPERCASE_SNAKE_CASE. Values "NA" and "CANNOT_DETERMINE" are reserved by the platform.
            value:  { type: String, required: true },
            // null means the option carries no score (e.g. NA, CANNOT_DETERMINE).
            points: { type: Number, default: null },
            // Selecting this option counts as a failing answer for this question.
            is_fail: { type: Boolean, default: false },
            // When true, the question is dropped from both numerator and denominator
            // so the scorecard percentage is unaffected.
            excluded_from_denominator: { type: Boolean, default: false },
            // When true, the evaluation is parked for human review instead of published.
            routes_to_human: { type: Boolean, default: false },
            _id: false,
          },
        ],
        // Selecting any is_fail option on this question fails the parent section.
        fail_section: { type: Boolean, default: false },
        // Selecting any is_fail option on this question fails the entire evaluation.
        critical: { type: Boolean, default: false },
        // False for questions that are on the form but carry no points (TEXT, NUMERIC).
        // Excluded from score and denominator entirely.
        scorable: { type: Boolean, default: true },
        // False means the question is skipped — not asked and not scored.
        enabled: { type: Boolean, default: true },
        // Where the AI should look for evidence to answer this question.
        // Required before a scorecard can be published.
        evidence_source: {
          type: String,
          // enum: ["TRANSCRIPT", "DESKTOP_ACTION", "CRM_RECORD", "AUDIO_ACOUSTIC", "EXTERNAL_SYSTEM"],
          default: null,
        },
        max_score: {
          type: Number,
          min: 0,
        },
        weight: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        // Instructions for the AI scorer — tells it what evidence to look for
        // in the transcript/interaction to evaluate this question.
        ai_instructions: {
          type: String,
          trim: true,
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
        optimisticConcurrency: true,
      }
    );

    // Primary bulk-read: "give me all questions for this scorecard_id".
    // Used after fetching scorecard to assemble full scorecard + questions.
    SCORECARD_QUESTION.index({ scorecard_id: 1, question_lineage_id: 1 });

    // "All versions of a question lineage" for audit / history view.
    SCORECARD_QUESTION.index({ question_lineage_id: 1, version: -1 });

    return SCORECARD_QUESTION;
  }
}

module.exports = ScorecardQuestionSchema;
