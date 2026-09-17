/**
 * Calculates Dev Attention card priority based on audit detail rows.
 * Evaluates rules in fixed order - first matching rule wins.
 *
 * Priority Rules (in order):
 * HIGH:
 *   1. Caller stranded: question_hash = '7.3' AND answer = 'No'
 *   2. OOS mishandled: question_hash IN ('5.1', '5.2') AND actual_score = 0 AND answer != 'N/A'
 *   3. Broke in critical spot: question_hash = '7.5' AND answer/comments contains auth/otp/transfer
 *   4. Volume: similar_count >= 5 (TODO: stub)
 *   5. Regression: reoccurrence of fixed failure (TODO: stub)
 *   6. HIPAA/Auth: question_hash IN ('2.1', '2.2', '2.3', '2.4') AND actual_score < max_score
 *
 * MEDIUM:
 *   Section 3 or Section 4 control (question_hash LIKE '3.%' OR '4.%')
 *
 * LOW:
 *   Default for all other cases
 *
 * @param {Array} auditDetails - Array of audit detail rows for one interaction_id
 * @param {Object} options - Optional: { similar_count: number, isRegression: boolean }
 * @returns {'HIGH' | 'MEDIUM' | 'LOW'}
 */
function calculateDevAttentionPriority(auditDetails, options = {}) {
    if (!auditDetails || auditDetails.length === 0) {
        return 'LOW';
    }

    const { similar_count = 0, isRegression = false } = options;

    // ========== HIGH PRIORITY RULES (evaluated in order) ==========

    // Rule 1: Caller stranded - question_hash = '7.3' AND answer = 'No'
    const callerStranded = auditDetails.some(row =>
        row.question_hash === '7.3' &&
        (row.answer || '').toLowerCase().trim() === 'no'
    );
    if (callerStranded) return 'HIGH';

    // Rule 2: OOS mishandled - question_hash IN ('5.1', '5.2') AND actual_score = 0 AND answer != 'N/A'
    const oosMishandled = auditDetails.some(row =>
        ['5.1', '5.2'].includes(row.question_hash) &&
        parseFloat(row.actual_score) === 0 &&
        (row.answer || '').toUpperCase().trim() !== 'N/A'
    );
    if (oosMishandled) return 'HIGH';

    // Rule 3: Broke in critical spot - question_hash = '7.5' AND answer/comments contains auth/otp/transfer
    const criticalKeywords = ['auth', 'otp', 'transfer'];
    const brokeInCriticalSpot = auditDetails.some(row => {
        if (row.question_hash !== '7.5') return false;
        const answerLower = (row.answer || '').toLowerCase();
        const commentsLower = (row.comments || '').toLowerCase();
        return criticalKeywords.some(keyword =>
            answerLower.includes(keyword) || commentsLower.includes(keyword)
        );
    });
    if (brokeInCriticalSpot) return 'HIGH';

    // Rule 4: Volume - similar_count >= 5
    // TODO: Implement similar_count tracking when available
    if (similar_count >= 5) return 'HIGH';

    // Rule 5: Regression - reoccurrence of a fixed failure
    // TODO: Implement regression detection (Subtask 9) when available
    if (isRegression) return 'HIGH';

    // Rule 6: HIPAA/Auth Security critical - question_hash IN ('2.1', '2.2', '2.3', '2.4') AND actual_score < max_score
    const hipaaCritical = auditDetails.some(row => {
        if (!['2.1', '2.2', '2.3', '2.4'].includes(row.question_hash)) return false;
        const actualScore = parseFloat(row.actual_score) || 0;
        const maxScore = parseFloat(row.max_score) || 0;
        return actualScore < maxScore;
    });
    if (hipaaCritical) return 'HIGH';

    // ========== MEDIUM PRIORITY RULE ==========

    // Section 3 or Section 4 control - question_hash LIKE '3.%' OR '4.%'
    const hasSection3or4 = auditDetails.some(row => {
        const qh = row.question_hash || '';
        return qh.startsWith('3.') || qh.startsWith('4.');
    });
    if (hasSection3or4) return 'MEDIUM';

    // ========== LOW PRIORITY ==========
    return 'LOW';
}

module.exports = { calculateDevAttentionPriority };
