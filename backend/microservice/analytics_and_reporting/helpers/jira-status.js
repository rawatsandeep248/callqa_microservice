/**
 * Jira ticket workflow helpers for AVA QC Review Queue.
 * Mirrors ava_platform review-queue.constants.ts (JIRA_TICKET_STATUSES / resolved set).
 *
 * Live map: callai_ava_qc_dev_attention.jira_status (while tickets are linked).
 * History: archived into callai_ava_qc_review_details.notes as type=jira_status_archive.
 *
 * When all linked tickets are Closed / Deployed to Production → Done:
 * append an archive note (merged cumulative map), then clear jira + jira_status on
 * dev_attention. Same clear+archive on reopen. Display + Done/In Jira rules
 * use only tickets currently listed in `jira`.
 */

const JIRA_TICKET_STATUSES = [
    'Not Ready',
    'Committed',
    'Ready for QA',
    'Ready for Production',
    'QA in Progress',
    'Open',
    'In Progress',
    'Reopened',
    'Closed',
    'Deployed to Production',
];

const DEFAULT_JIRA_TICKET_STATUS = 'Open';

const JIRA_RESOLVED_STATUSES = ['Closed', 'Deployed to Production'];

const JIRA_STATUS_ARCHIVE_TYPE = 'jira_status_archive';

/** Extract PROJECT-#### key (uppercased), or '' if none. */
function ticketKey(value) {
    const match = String(value || '').match(/[A-Z]+-\d+/i);
    return match ? match[0].toUpperCase() : '';
}

/** Split stored (possibly comma-separated) jira value into individual entries. */
function parseJiraList(jira) {
    return String(jira || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

/** Ticket keys currently linked on the interaction (from `jira` column). */
function activeTicketKeys(jira) {
    const seen = new Set();
    const keys = [];
    for (const part of parseJiraList(jira)) {
        const key = ticketKey(part);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        keys.push(key);
    }
    return keys;
}

function normalizeStatusMap(raw) {
    if (!raw) return {};
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }
    return typeof raw === 'object' && !Array.isArray(raw) ? { ...raw } : {};
}

/**
 * Seed Open for any active ticket missing from the live map.
 * Does not restore from notes archives — re-link starts fresh Open keys.
 */
function seedStatuses(jira, existingMap) {
    const map = normalizeStatusMap(existingMap);
    for (const key of activeTicketKeys(jira)) {
        if (!map[key]) {
            map[key] = DEFAULT_JIRA_TICKET_STATUS;
        }
    }
    return map;
}

/**
 * Merge live jira_status into durable history. Never deletes existing history keys;
 * live values overwrite same keys.
 */
function mergeStatusHistory(existingHistory, liveMap) {
    return {
        ...normalizeStatusMap(existingHistory),
        ...normalizeStatusMap(liveMap),
    };
}

/** Reduce prior jira_status_archive notes into one cumulative map. */
function extractStatusHistoryFromNotes(notes) {
    const list = Array.isArray(notes) ? notes : [];
    let map = {};
    for (const entry of list) {
        if (!entry || entry.type !== JIRA_STATUS_ARCHIVE_TYPE) continue;
        map = mergeStatusHistory(map, entry.jira_status);
    }
    return map;
}

function formatStatusMapNote(map) {
    const parts = Object.keys(map)
        .sort()
        .map((k) => `${k}: ${map[k]}`);
    return parts.length
        ? `Jira status archive — ${parts.join('; ')}`
        : 'Jira status archive';
}

/**
 * Build a notes entry that archives the live map (merged with prior archives).
 * Returns null when liveMap is empty (nothing to archive).
 */
function buildJiraStatusArchiveNote({ liveMap, existingNotes, actor, createdAt }) {
    const live = normalizeStatusMap(liveMap);
    if (!Object.keys(live).length) return null;

    const merged = mergeStatusHistory(
        extractStatusHistoryFromNotes(existingNotes),
        live
    );
    const who = String(actor || 'system').trim() || 'system';
    const when = String(createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '));

    return {
        type: JIRA_STATUS_ARCHIVE_TYPE,
        note: formatStatusMapNote(merged),
        jira_status: merged,
        email: who,
        created_by: who,
        created_at: when,
    };
}

function isAllowedStatus(status) {
    return JIRA_TICKET_STATUSES.includes(String(status || '').trim());
}

function isJiraStatusResolved(status) {
    return JIRA_RESOLVED_STATUSES.includes(String(status || '').trim());
}

/**
 * True when every ticket currently listed in `jira` is Closed or Deployed.
 * Empty jira list → not resolved (nothing to close against).
 */
function allActiveResolved(jira, map) {
    const keys = activeTicketKeys(jira);
    if (!keys.length) return false;
    const statusMap = normalizeStatusMap(map);
    return keys.every((key) => isJiraStatusResolved(statusMap[key]));
}

/** Interaction status from current jira list + map. */
function interactionStatusFromTickets(jira, map) {
    return allActiveResolved(jira, map) ? 'Done' : 'In Jira';
}

module.exports = {
    JIRA_TICKET_STATUSES,
    DEFAULT_JIRA_TICKET_STATUS,
    JIRA_RESOLVED_STATUSES,
    JIRA_STATUS_ARCHIVE_TYPE,
    ticketKey,
    parseJiraList,
    activeTicketKeys,
    normalizeStatusMap,
    seedStatuses,
    mergeStatusHistory,
    extractStatusHistoryFromNotes,
    buildJiraStatusArchiveNote,
    isAllowedStatus,
    isJiraStatusResolved,
    allActiveResolved,
    interactionStatusFromTickets,
};
