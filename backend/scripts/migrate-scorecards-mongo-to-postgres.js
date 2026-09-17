#!/usr/bin/env node
/**
 * One-time ETL: copy scorecards + questions from MongoDB to PostgreSQL.
 *
 * Usage:
 *   NODE_ENV=development node scripts/run-postgres-migration.js
 *   NODE_ENV=development DRY_RUN=true node scripts/migrate-scorecards-mongo-to-postgres.js
 */
const MONGOOSE = require("mongoose");
const CONFIG = require("../common/utils/config-util");
const COMMONUTIL = require("../common/utils/common-util");
const MESSAGEUTIL = require("../common/utils/message-util");
const ScorecardSchema = require("../common/schemas/scorecard");
const ScorecardQuestionSchema = require("../common/schemas/scorecard-question");
const ScorecardRepository = require("../microservice/analytics_and_reporting/repository/scorecard-repository");

const DRY_RUN = process.env.DRY_RUN === "true";
const DB = MESSAGEUTIL.info().database_collections.customer_db;

function getMongoUrl() {
    const database = CONFIG.get("database");
    let url = database.host;
    url = url.replace("$username", database.user);
    url = url.replace("$password", database.password);
    url = url.replace("$database", database.name);
    return url;
}

function normalizeChannels(doc) {
    if (Array.isArray(doc.channels) && doc.channels.length) return doc.channels;
    if (doc.channel) return [doc.channel];
    return [];
}

function normalizeSectionQuestions(section, questionMap) {
    return (section.questions || []).map((ref) => {
        if (questionMap[ref]) return ref;
        for (const [qid, q] of Object.entries(questionMap)) {
            if (q.question_lineage_id === ref) return qid;
        }
        return ref;
    }).filter((ref) => questionMap[ref]);
}

async function main() {
    const url = getMongoUrl();
    const conn = await MONGOOSE.createConnection(url).asPromise();
    const Scorecard = conn.model(DB.scorecards, ScorecardSchema.getSchema());
    const Question = conn.model(DB.scorecard_questions, ScorecardQuestionSchema.getSchema());
    const repo = new ScorecardRepository();

    const scorecards = await Scorecard.find({}).lean();
    console.log(`Found ${scorecards.length} scorecards in MongoDB`);

    let migrated = 0;
    for (const sc of scorecards) {
        const questions = await Question.find({ scorecard_id: sc.scorecard_id }).lean();
        const questionMap = {};
        for (const q of questions) questionMap[q.question_id] = q;

        const sections = (sc.sections || []).map((s) => ({
            section_id: s.section_id,
            section_lineage_id: s.section_lineage_id,
            name: s.name,
            sequence: s.sequence,
            weighting: s.weighting,
            fail_section: s.fail_section || false,
            questions: normalizeSectionQuestions(s, questionMap),
        }));

        const questionDocs = questions.map((q) => ({
            question_id: q.question_id,
            question_lineage_id: q.question_lineage_id,
            scorecard_id: q.scorecard_id,
            scorecard_lineage_id: q.scorecard_lineage_id,
            section_id: q.section_id,
            section_lineage_id: q.section_lineage_id,
            sequence: q.sequence,
            version: q.version || 1,
            question_text: q.question_text,
            question_type: q.question_type,
            response_options: q.response_options || [],
            fail_section: q.fail_section || false,
            critical: q.critical || false,
            scorable: q.scorable !== false,
            enabled: q.enabled !== false,
            evidence_source: q.evidence_source || null,
            max_score: q.max_score,
            weight: q.weight,
            ai_instructions: q.ai_instructions || null,
            created_by: q.created_by,
            updated_by: q.updated_by,
        }));

        const pgScorecard = {
            scorecard_id: sc.scorecard_id,
            lineage_id: sc.lineage_id,
            version: sc.version,
            name: sc.name,
            description: sc.description || null,
            channels: normalizeChannels(sc),
            status: sc.status,
            state: sc.state || null,
            scorecard_type: sc.scorecard_type || null,
            fail_scorecard: sc.fail_scorecard || false,
            scoring: sc.scoring || null,
            total_sections: sc.total_sections || sections.length,
            total_questions: sc.total_questions || questionDocs.length,
            content_updated_at: sc.content_updated_at || null,
            model_provider: sc.model_provider || null,
            ai_model: sc.ai_model || null,
            origin: sc.origin || "CREATED",
            source_scorecard_id: sc.source_scorecard_id || null,
            source_lineage_id: sc.source_lineage_id || null,
            published_at: sc.published_at || null,
            published_by: sc.published_by || null,
            disabled_at: sc.disabled_at || null,
            disabled_by: sc.disabled_by || null,
            enabled_at: sc.enabled_at || null,
            enabled_by: sc.enabled_by || null,
            archived_at: sc.archived_at || null,
            archived_by: sc.archived_by || null,
            created_by: sc.created_by,
            updated_by: sc.updated_by,
        };

        console.log(`  ${DRY_RUN ? "[DRY RUN] " : ""}${sc.scorecard_id} v${sc.version} — ${sections.length} sections, ${questionDocs.length} questions`);

        if (!DRY_RUN) {
            await repo.importScorecard(pgScorecard, sections, questionDocs);
        }
        migrated++;
    }

    await conn.close();
    console.log(`Done. ${migrated} scorecard(s) ${DRY_RUN ? "would be" : ""} migrated.`);
}

main().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
