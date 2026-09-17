/**
 * Shaping + classification helpers for the Review Queue export workbook.
 *
 * The export produces three sheets — Dev Attention, Audit Details and
 * Notes & Activity — all keyed on the queue row `id` + `interaction_id` so
 * they can be joined/pivoted back together. These helpers turn the raw
 * `callai_ava_qc_audit_detail` rows and the `callai_ava_qc_review_details`
 * JSON (notes[] + defect_action) into the flat, curated rows each sheet needs.
 */
const moment = require('moment-timezone');

// Human-readable label for a stored defect_action.defect_type.
function decisionLabel(defectType) {
    switch (defectType) {
        case 'real_defect':      return 'Real defect';
        case 'not_a_defect':     return 'Not a defect';
        case 'not_a_bot_defect': return 'Not a bot defect';
        default:                 return '';
    }
}

// Pull the closure decision + reason out of review_details.defect_action.
// defect_action may arrive as a parsed object or a JSON string depending on
// the driver, so normalize both.
function extractDecision(defectAction) {
    let da = defectAction;
    if (typeof da === 'string') {
        try { da = JSON.parse(da); } catch (_) { da = null; }
    }
    if (!da || typeof da !== 'object') return { decision: '', decisionReason: '' };
    return {
        decision: decisionLabel(da.defect_type),
        // not_a_bot_defect stores the sub-category on not_bot_reason; the other
        // decisions keep any free-text reviewer note on defect_note.
        decisionReason: da.not_bot_reason || da.defect_note || '',
    };
}

// notes may arrive as a JSON string or an array; always return an array.
function normalizeNotes(notes) {
    let arr = notes;
    if (typeof arr === 'string') {
        try { arr = JSON.parse(arr); } catch (_) { return []; }
    }
    return Array.isArray(arr) ? arr : [];
}

function countNotes(notes) {
    return normalizeNotes(notes).length;
}

/**
 * Best-effort classification of a free-text activity note into a type. Activity
 * is stored only as note text today, so we infer the type from known phrasings
 * (see the decision/assignment/jira writers in ava-qc-service). Order matters —
 * the most specific phrasings are checked first.
 */
function classifyActivityType(text) {
    const t = String(text || '').toLowerCase().trim();
    if (!t) return 'note';
    if (/\b(assigned to|unassigned|reassigned)\b/.test(t)) return 'assignment';
    if (/closed interaction as|confirmed real defect/.test(t)) return 'decision/closure';
    if (/moved to pending|reopened interaction|sent back to inbox|all tickets resolved|\bticket\b.*(→|->)/.test(t)) return 'status change';
    if (/updated ticket|linked .*(ava-\d+|https?:\/\/)/.test(t)) return 'jira link';
    return 'note';
}

// Match the existing activity-note timestamp format: YYYY-MM-DD HH:mm:ss.
function formatTimestamp(raw) {
    if (!raw) return '';
    const m = moment(raw);
    return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : String(raw);
}

/**
 * Audit Details sheet — one row per audit question, per interaction.
 * Sourced from callai_ava_qc_audit_detail (the uploaded audit-form responses),
 * not Sisense. N/A and unanswered rows are preserved (no filtering here).
 * `id` is the queue row id resolved via interaction_id so the sheet joins back
 * to Dev Attention.
 */
function shapeAuditDetail(auditRows, devIdByInteraction) {
    return (auditRows || []).map((row) => ({
        id: devIdByInteraction[row.interaction_id] ?? '',
        interaction_id: row.interaction_id,
        form_name: row.form_name || '',
        section: row.section_title || '',
        question_number: row.question_hash || '',
        question: row.question || '',
        answer: row.answer || '',
        score: row.actual_score,
        max_score: row.max_score,
        question_comment: row.comments || '',
    }));
}

/**
 * Notes & Activity sheet — one row per activity entry, per interaction,
 * sorted oldest -> newest. Includes auto-generated entries (assignments, Jira
 * status changes, closures) since they are all stored as notes. The closure
 * decision + reason from defect_action are attached to the decision/closure
 * entries.
 */
function shapeNotesActivity(reviewRows, devIdByInteraction) {
    const out = [];
    for (const review of reviewRows || []) {
        const interactionId = review.interaction_id;
        const { decision, decisionReason } = extractDecision(review.defect_action);

        const notes = normalizeNotes(review.notes)
            .map((n) => (n && typeof n === 'object' ? n : { note: String(n || '') }))
            .sort((a, b) => (moment(a.created_at).valueOf() || 0) - (moment(b.created_at).valueOf() || 0));

        for (const n of notes) {
            const activityType = classifyActivityType(n.note);
            const isClosure = activityType === 'decision/closure';
            out.push({
                id: devIdByInteraction[interactionId] ?? '',
                interaction_id: interactionId,
                activity_type: activityType,
                author: n.created_by || n.email || '',
                timestamp: formatTimestamp(n.created_at),
                text: n.note || '',
                decision: isClosure ? decision : '',
                decision_reason: isClosure ? decisionReason : '',
            });
        }
    }
    return out;
}

module.exports = {
    decisionLabel,
    extractDecision,
    normalizeNotes,
    countNotes,
    classifyActivityType,
    formatTimestamp,
    shapeAuditDetail,
    shapeNotesActivity,
};
