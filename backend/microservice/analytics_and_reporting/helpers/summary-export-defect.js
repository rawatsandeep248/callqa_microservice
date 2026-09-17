/**
 * Port of ava_platform review-queue-defect.util.ts helpers used by summary-export.
 */

function parseAnswer(answer) {
    if (!answer) return '';
    return String(answer).replace(/^\[|\]$/g, '');
}

function findRowByQuestionHash(auditData, questionHash) {
    return (auditData || []).find((row) => String(row.question_hash) === String(questionHash));
}

function extractQuestionHashes(comments) {
    if (!comments) return [];
    return String(comments)
        .split(',')
        .map((item) => item.trim().replace(/^[A-Za-z]+/, ''))
        .filter(Boolean);
}

function extractIntent(auditDetailRawData) {
    const row = findRowByQuestionHash(auditDetailRawData, '7.5');
    return row ? parseAnswer(row.answer) : '';
}

function extractReasonForFailure(auditDetailRawData) {
    const row = findRowByQuestionHash(auditDetailRawData, '7.2');
    if (!row) return '';

    const answer = parseAnswer(row.answer);
    const hasOtherComment = row.answer && String(row.answer).includes('Other (comment)') && row.comments;
    return hasOtherComment ? `${answer} - ${row.comments}` : answer;
}

/**
 * Build defect items by matching hashes in dev_attention.comments to audit_detail rows.
 */
function buildDefectItems(devAttentionRow, auditDetailRawData) {
    const auditByHash = new Map();
    for (const auditRow of auditDetailRawData || []) {
        auditByHash.set(String(auditRow.question_hash), auditRow);
    }

    const defects = [];
    const seenHashes = new Set();
    const questionHashes = extractQuestionHashes(devAttentionRow?.comments);

    for (const hash of questionHashes) {
        const normalizedHash = String(hash);
        if (seenHashes.has(normalizedHash)) continue;

        const auditRow = auditByHash.get(normalizedHash);
        if (!auditRow) continue;

        seenHashes.add(normalizedHash);
        defects.push({
            defect: auditRow.comments || '',
            failedSection: auditRow.section_title || '',
            questionHash: auditRow.question_hash
        });
    }

    return defects;
}

function serializeNotes(notes) {
    if (!notes) return '';
    let parsed = notes;
    if (typeof notes === 'string') {
        try {
            parsed = JSON.parse(notes);
        } catch (_) {
            return notes;
        }
    }
    if (!Array.isArray(parsed)) return '';
    return parsed
        .map((n) => (n && typeof n === 'object' ? (n.note || '') : String(n || '')))
        .filter(Boolean)
        .join('; ');
}

module.exports = {
    extractIntent,
    extractReasonForFailure,
    buildDefectItems,
    serializeNotes
};
