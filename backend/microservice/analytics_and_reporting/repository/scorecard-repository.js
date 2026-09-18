const { query, withTransaction } = require("../../../common/database/database-postgres");

function parseSections(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
        try { return JSON.parse(raw); } catch { return []; }
    }
    return [];
}

function formatSection(section) {
    return {
        section_id: section.section_id,
        section_lineage_id: section.section_lineage_id,
        name: section.name,
        sequence: section.sequence,
        weighting: Number(section.weighting),
        fail_section: section.fail_section || false,
        questions: Array.isArray(section.questions) ? [...section.questions] : [],
    };
}

function rowToScorecard(row) {
    if (!row) return null;
    const sections = parseSections(row.sections).map(formatSection);
    sections.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    return {
        scorecard_id: row.scorecard_id,
        lineage_id: row.lineage_id,
        version: row.version,
        name: row.name,
        description: row.description,
        channels: row.channels || [],
        status: row.status,
        state: row.state,
        scorecard_type: row.scorecard_type,
        fail_scorecard: row.fail_scorecard,
        scoring: row.scoring,
        total_sections: row.total_sections,
        total_questions: row.total_questions,
        content_updated_at: row.content_updated_at,
        model_provider: row.model_provider,
        ai_model: row.ai_model,
        origin: row.origin,
        source_scorecard_id: row.source_scorecard_id,
        source_lineage_id: row.source_lineage_id,
        published_at: row.published_at,
        published_by: row.published_by,
        disabled_at: row.disabled_at,
        disabled_by: row.disabled_by,
        enabled_at: row.enabled_at,
        enabled_by: row.enabled_by,
        archived_at: row.archived_at,
        archived_by: row.archived_by,
        created_by: row.created_by,
        updated_by: row.updated_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        sections,
    };
}

function rowToQuestion(row) {
    if (!row) return null;
    return {
        question_id: row.question_id,
        question_lineage_id: row.question_lineage_id,
        scorecard_id: row.scorecard_id,
        scorecard_version: row.scorecard_version,
        scorecard_lineage_id: row.scorecard_lineage_id,
        section_id: row.section_id,
        section_lineage_id: row.section_lineage_id,
        sequence: row.sequence,
        version: row.version,
        question_text: row.question_text,
        question_type: row.question_type,
        response_options: row.response_options || [],
        fail_section: row.fail_section,
        critical: row.critical,
        scorable: row.scorable,
        enabled: row.enabled,
        evidence_source: row.evidence_source,
        max_score: row.max_score != null ? Number(row.max_score) : null,
        weight: row.weight != null ? Number(row.weight) : null,
        ai_instructions: row.ai_instructions,
        created_by: row.created_by,
        updated_by: row.updated_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

async function getScorecardRowByKey(scorecardId, version, client = null) {
    const q = client ? client.query.bind(client) : query;
    const { rows } = await q(
        `SELECT * FROM scorecards WHERE scorecard_id = $1 AND version = $2`,
        [scorecardId, version]
    );
    return rows[0] || null;
}

/** Resolve a scorecard row: explicit version, or status, or DRAFT-first then latest version. */
async function resolveScorecardRow(scorecardId, opts = {}, client = null) {
    const { version, status } = opts;
    if (version != null && version !== "") {
        return getScorecardRowByKey(scorecardId, Number(version), client);
    }
    const q = client ? client.query.bind(client) : query;
    if (status) {
        const { rows } = await q(
            `SELECT * FROM scorecards WHERE scorecard_id = $1 AND status = $2
             ORDER BY version DESC LIMIT 1`,
            [scorecardId, String(status).toUpperCase()]
        );
        return rows[0] || null;
    }
    const { rows } = await q(
        `SELECT * FROM scorecards WHERE scorecard_id = $1
         ORDER BY CASE WHEN status = 'DRAFT' THEN 0 ELSE 1 END, version DESC
         LIMIT 1`,
        [scorecardId]
    );
    return rows[0] || null;
}

async function getScorecardDocument(scorecardId, version) {
    const row = await resolveScorecardRow(scorecardId, { version });
    return row ? rowToScorecard(row) : null;
}

async function insertScorecard(client, data) {
    const sections = (data.sections || []).map(formatSection);
    await client.query(
        `INSERT INTO scorecards (
            scorecard_id, lineage_id, version, name, description, channels, status,
            state, scorecard_type, fail_scorecard, scoring, sections,
            total_sections, total_questions, content_updated_at,
            model_provider, ai_model, origin,
            source_scorecard_id, source_lineage_id,
            published_at, published_by, disabled_at, disabled_by,
            enabled_at, enabled_by, archived_at, archived_by,
            created_by, updated_by, created_at, updated_at
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
            $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,NOW(),NOW()
        )`,
        [
            data.scorecard_id, data.lineage_id, data.version, data.name,
            data.description || null, data.channels, data.status,
            data.state || null, data.scorecard_type || null,
            data.fail_scorecard || false,
            data.scoring ? JSON.stringify(data.scoring) : null,
            JSON.stringify(sections),
            data.total_sections ?? sections.length,
            data.total_questions || 0,
            data.content_updated_at || null,
            data.model_provider || null, data.ai_model || null, data.origin,
            data.source_scorecard_id || null, data.source_lineage_id || null,
            data.published_at || null, data.published_by || null,
            data.disabled_at || null, data.disabled_by || null,
            data.enabled_at || null, data.enabled_by || null,
            data.archived_at || null, data.archived_by || null,
            data.created_by, data.updated_by,
        ]
    );
}

async function insertQuestions(client, questionDocs) {
    for (const q of questionDocs) {
        const scorecardVersion = q.scorecard_version ?? q.scorecardVersion;
        if (scorecardVersion == null) {
            throw new Error("scorecard_version is required for question insert");
        }
        await client.query(
            `INSERT INTO scorecard_questions (
                question_id, question_lineage_id, scorecard_id, scorecard_version,
                scorecard_lineage_id, section_id, section_lineage_id, sequence, version,
                question_text, question_type, response_options,
                fail_section, critical, scorable, enabled, evidence_source,
                max_score, weight, ai_instructions, created_by, updated_by
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
            [
                q.question_id, q.question_lineage_id, q.scorecard_id, scorecardVersion,
                q.scorecard_lineage_id, q.section_id, q.section_lineage_id, q.sequence, q.version || 1,
                q.question_text, q.question_type, JSON.stringify(q.response_options || []),
                q.fail_section || false, q.critical || false,
                q.scorable !== false, q.enabled !== false, q.evidence_source || null,
                q.max_score ?? null, q.weight, q.ai_instructions || null,
                q.created_by, q.updated_by,
            ]
        );
    }
}

function findSectionIndex(sections, sectionId) {
    return sections.findIndex(
        (s) => s.section_id === sectionId || s.section_lineage_id === sectionId
    );
}

async function resolveDraftVersion(scorecardId, versionHint, client = null) {
    const q = client ? client.query.bind(client) : query;
    if (versionHint != null && versionHint !== "") {
        const { rows } = await q(
            `SELECT version FROM scorecards
             WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
            [scorecardId, Number(versionHint)]
        );
        if (rows[0]) return rows[0].version;
    }
    const { rows } = await q(
        `SELECT version FROM scorecards
         WHERE scorecard_id = $1 AND status = 'DRAFT'
         ORDER BY version DESC LIMIT 1`,
        [scorecardId]
    );
    return rows[0]?.version ?? null;
}

/** Lock the editable DRAFT row; falls back to the latest DRAFT when version hint is stale or published. */
async function lockDraftScorecardRow(client, scorecardId, versionHint) {
    if (versionHint != null && versionHint !== "") {
        const { rows } = await client.query(
            `SELECT version, sections FROM scorecards
             WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'
             FOR UPDATE`,
            [scorecardId, Number(versionHint)]
        );
        if (rows[0]) return rows[0];
    }
    const { rows } = await client.query(
        `SELECT version, sections FROM scorecards
         WHERE scorecard_id = $1 AND status = 'DRAFT'
         ORDER BY version DESC LIMIT 1
         FOR UPDATE`,
        [scorecardId]
    );
    return rows[0] || null;
}

class ScorecardRepository {
    /** Latest DRAFT version for writes; honors version hint when it points at a draft row. */
    async resolveEditableDraftVersion(scorecardId, versionHint) {
        return resolveDraftVersion(scorecardId, versionHint);
    }

    async createScorecard(data) {
        await withTransaction(async (client) => {
            await insertScorecard(client, data);
        });
        return { result: await getScorecardDocument(data.scorecard_id, data.version) };
    }

    async listScorecards(data) {
        const conditions = [];
        const params = [];
        let paramIdx = 1;

        if (data.status) {
            conditions.push(`status = $${paramIdx++}`);
            params.push(data.status.trim().toUpperCase());
        }
        if (data.channel) {
            const ch = data.channel.trim().replace(/ /g, "_");
            conditions.push(`$${paramIdx++} = ANY(channels)`);
            params.push(ch);
        }
        if (data.state) {
            conditions.push(`state = $${paramIdx++}`);
            params.push(data.state.trim().toUpperCase());
        }
        if (data.search?.trim()) {
            conditions.push(`(name ILIKE $${paramIdx} OR description ILIKE $${paramIdx})`);
            params.push(`%${data.search.trim()}%`);
            paramIdx++;
        }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const page = Math.max(1, parseInt(data.page || "1", 10));
        const limit = Math.max(1, parseInt(data.limit || "10", 10));
        const offset = (page - 1) * limit;

        const [
            listRes, countRes, draftRes, publishedRes, disabledRes, archivedRes, needsRes,
        ] = await Promise.all([
            query(
                `SELECT * FROM scorecards ${where} ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
                [...params, limit, offset]
            ),
            query(`SELECT COUNT(*)::int AS count FROM scorecards ${where}`, params),
            query(`SELECT COUNT(*)::int AS count FROM scorecards WHERE status = 'DRAFT'`),
            query(`SELECT COUNT(*)::int AS count FROM scorecards WHERE status = 'PUBLISHED'`),
            query(`SELECT COUNT(*)::int AS count FROM scorecards WHERE status = 'DISABLED'`),
            query(`SELECT COUNT(*)::int AS count FROM scorecards WHERE status = 'ARCHIVED'`),
            query(
                `SELECT COUNT(*)::int AS count FROM scorecards sc
                 WHERE jsonb_array_length(sc.sections) > 0
                   AND (
                     SELECT COALESCE(SUM((elem->>'weighting')::numeric), 0)
                     FROM jsonb_array_elements(sc.sections) elem
                   ) <> 100`
            ),
        ]);

        const scorecards = listRes.rows.map(rowToScorecard);
        const total = countRes.rows[0]?.count || 0;
        const statsTotal =
            (draftRes.rows[0]?.count || 0) +
            (publishedRes.rows[0]?.count || 0) +
            (disabledRes.rows[0]?.count || 0) +
            (archivedRes.rows[0]?.count || 0);

        return {
            result: {
                data: scorecards,
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
                stats: {
                    total: statsTotal,
                    draft: draftRes.rows[0]?.count || 0,
                    published: publishedRes.rows[0]?.count || 0,
                    disabled: disabledRes.rows[0]?.count || 0,
                    archived: archivedRes.rows[0]?.count || 0,
                    needsAttention: needsRes.rows[0]?.count || 0,
                },
            },
        };
    }

    async getScorecardById(scorecardId, version) {
        return { result: await getScorecardDocument(scorecardId, version) };
    }

    async getQuestionsByScorecardId(scorecardId, scorecardVersion, orderBy = "created_at") {
        const orderCol = orderBy === "sequence" ? "sequence ASC" : "created_at ASC";
        const { rows } = await query(
            `SELECT * FROM scorecard_questions
             WHERE scorecard_id = $1 AND scorecard_version = $2
             ORDER BY ${orderCol}`,
            [scorecardId, scorecardVersion]
        );
        return rows.map(rowToQuestion);
    }

    async getScorecardVersions(lineageId) {
        const { rows } = await query(
            `SELECT * FROM scorecards
             WHERE scorecard_id = $1 OR lineage_id = $1
             ORDER BY version DESC`,
            [lineageId]
        );
        return { result: rows.map(rowToScorecard) };
    }

    async updateScorecard(scorecardId, scorecardVersion, updatableFields) {
        const keys = Object.keys(updatableFields);
        if (keys.length === 0) return { result: { matchedCount: 0, modifiedCount: 0 } };

        const ver = await resolveDraftVersion(scorecardId, scorecardVersion);
        if (ver == null) return { result: { matchedCount: 0, modifiedCount: 0 } };
        const baseIdx = 3;

        const setClauses = keys.map((k, i) => {
            const param = `$${baseIdx + i}`;
            if (k === "scoring") return `scoring = ${param}::jsonb`;
            if (k === "channels") return `channels = ${param}::text[]`;
            if (k === "sections") return `sections = ${param}::jsonb`;
            return `${k} = ${param}`;
        });
        const values = keys.map((k) => {
            const v = updatableFields[k];
            if (k === "scoring" || k === "sections") return JSON.stringify(v);
            return v;
        });

        const params = [scorecardId, ver, ...values];

        const { rowCount } = await query(
            `UPDATE scorecards SET ${setClauses.join(", ")}, updated_at = NOW()
             WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
            params
        );
        return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
    }

    async updateAiConfigForAll(modelProvider, aiModel) {
        const { rowCount } = await query(
            `UPDATE scorecards SET model_provider = $1, ai_model = $2
             WHERE status <> 'PUBLISHED'`,
            [modelProvider, aiModel]
        );
        return { result: { modifiedCount: rowCount } };
    }

    async publishScorecard(scorecardId, scorecardVersion, publishedBy, updatedBy) {
        return withTransaction(async (client) => {
            const draft = await getScorecardRowByKey(scorecardId, Number(scorecardVersion), client);
            if (!draft || draft.status !== "DRAFT") {
                return { result: { matchedCount: 0, modifiedCount: 0 } };
            }

            await client.query(
                `UPDATE scorecards SET status = 'ARCHIVED', archived_at = NOW(),
                 updated_at = NOW()
                 WHERE scorecard_id = $1 AND status = 'PUBLISHED' AND version < $2`,
                [scorecardId, draft.version]
            );
            await client.query(
                `UPDATE scorecards SET status = 'ARCHIVED', archived_at = NOW(),
                 updated_at = NOW()
                 WHERE scorecard_id = $1 AND status = 'DISABLED' AND version < $2`,
                [scorecardId, draft.version]
            );

            const { rowCount } = await client.query(
                `UPDATE scorecards SET status = 'PUBLISHED', published_at = NOW(),
                 published_by = $3, updated_by = $4, updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [scorecardId, draft.version, publishedBy, updatedBy]
            );
            return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
        });
    }

    async createDraft(sourceScorecardId, sourceVersion, createdBy, updatedBy, generateId) {
        return withTransaction(async (client) => {
            let source;
            if (sourceVersion != null && sourceVersion !== "") {
                source = await getScorecardRowByKey(sourceScorecardId, Number(sourceVersion), client);
            } else {
                source = await resolveScorecardRow(sourceScorecardId, {}, client);
            }
            if (!source) throw new Error("Source scorecard not found");

            const { rows: existingDraft } = await client.query(
                `SELECT version FROM scorecards WHERE scorecard_id = $1 AND status = 'DRAFT'`,
                [source.scorecard_id]
            );
            if (existingDraft.length > 0) {
                throw new Error(
                    "A draft already exists for this scorecard. Edit or delete it before creating another."
                );
            }

            const { rows: versionRows } = await client.query(
                `SELECT version FROM scorecards WHERE scorecard_id = $1 ORDER BY version DESC LIMIT 1`,
                [source.scorecard_id]
            );
            const latestVersion = versionRows[0]?.version || source.version;
            const newVersion = latestVersion + 1;
            const stableScorecardId = source.scorecard_id;

            const sourceSections = parseSections(source.sections);
            const { rows: sourceQuestions } = await client.query(
                `SELECT * FROM scorecard_questions
                 WHERE scorecard_id = $1 AND scorecard_version = $2
                 ORDER BY created_at`,
                [source.scorecard_id, source.version]
            );

            const newQuestionDocs = sourceQuestions.map((q) => ({
                question_id: q.question_id,
                question_lineage_id: q.question_lineage_id,
                scorecard_id: stableScorecardId,
                scorecard_version: newVersion,
                scorecard_lineage_id: source.lineage_id,
                section_id: q.section_id,
                section_lineage_id: q.section_lineage_id,
                sequence: q.sequence,
                version: q.version,
                question_text: q.question_text,
                question_type: q.question_type,
                response_options: q.response_options || [],
                fail_section: q.fail_section,
                critical: q.critical,
                scorable: q.scorable,
                enabled: q.enabled,
                evidence_source: q.evidence_source,
                max_score: q.max_score,
                weight: q.weight,
                ai_instructions: q.ai_instructions,
                created_by: createdBy,
                updated_by: updatedBy,
            }));

            const newSections = sourceSections.map((s) => ({
                section_id: s.section_id,
                section_lineage_id: s.section_lineage_id,
                name: s.name,
                sequence: s.sequence,
                weighting: Number(s.weighting),
                fail_section: s.fail_section || false,
                questions: [...(s.questions || [])],
            }));

            await insertScorecard(client, {
                scorecard_id: stableScorecardId,
                lineage_id: source.lineage_id,
                version: newVersion,
                name: source.name,
                description: source.description,
                channels: source.channels,
                state: source.state,
                scoring: source.scoring,
                status: "DRAFT",
                origin: "CLONED",
                fail_scorecard: source.fail_scorecard,
                sections: newSections,
                total_sections: source.total_sections,
                total_questions: source.total_questions,
                content_updated_at: source.content_updated_at,
                source_scorecard_id: source.scorecard_id,
                source_lineage_id: source.lineage_id,
                model_provider: source.model_provider,
                ai_model: source.ai_model,
                created_by: createdBy,
                updated_by: updatedBy,
            });
            await insertQuestions(client, newQuestionDocs);

            return { scorecard_id: stableScorecardId, version: newVersion };
        });
    }

    async updateStatus(scorecardId, scorecardVersion, fromStatus, setFields) {
        const entries = Object.entries(setFields);
        const setClauses = entries.map(([k], i) => `${k} = $${i + 4}`);
        const values = entries.map(([, v]) => v);
        const { rowCount } = await query(
            `UPDATE scorecards SET ${setClauses.join(", ")}, updated_at = NOW()
             WHERE scorecard_id = $1 AND version = $2 AND status = $3`,
            [scorecardId, Number(scorecardVersion), fromStatus, ...values]
        );
        return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
    }

    async updateStatusForLatest(scorecardId, fromStatus, setFields) {
        const entries = Object.entries(setFields);
        const setClauses = entries.map(([k], i) => `${k} = $${i + 3}`);
        const values = entries.map(([, v]) => v);
        const { rowCount } = await query(
            `UPDATE scorecards SET ${setClauses.join(", ")}, updated_at = NOW()
             WHERE scorecard_id = $1 AND status = $2
               AND version = (
                 SELECT MAX(version) FROM scorecards s2
                 WHERE s2.scorecard_id = $1 AND s2.status = $2
               )`,
            [scorecardId, fromStatus, ...values]
        );
        return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
    }

    async updateStatusAny(scorecardId, scorecardVersion, setFields) {
        const entries = Object.entries(setFields);
        const ver = scorecardVersion != null && scorecardVersion !== ""
            ? Number(scorecardVersion)
            : null;
        const baseIdx = ver != null ? 3 : 2;
        const setClauses = entries.map(([k], i) => `${k} = $${baseIdx + i}`);
        const values = entries.map(([, v]) => v);
        const where = ver != null
            ? `scorecard_id = $1 AND version = $2`
            : `scorecard_id = $1 AND version = (
                 SELECT MAX(version) FROM scorecards s2 WHERE s2.scorecard_id = $1
               )`;
        const params = ver != null ? [scorecardId, ver, ...values] : [scorecardId, ...values];
        const { rowCount } = await query(
            `UPDATE scorecards SET ${setClauses.join(", ")}, updated_at = NOW() WHERE ${where}`,
            params
        );
        return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
    }

    async addSection(data, sectionId, sectionLineageId) {
        return withTransaction(async (client) => {
            const draftRow = await lockDraftScorecardRow(client, data.scorecard_id, data.version);
            if (!draftRow) return { result: { matchedCount: 0 } };
            const scVersion = draftRow.version;

            const sections = parseSections(draftRow.sections);
            sections.push(formatSection({
                section_id: sectionId,
                section_lineage_id: sectionLineageId,
                name: data.name,
                sequence: data.sequence,
                weighting: data.weighting,
                fail_section: data.fail_section || false,
                questions: [],
            }));

            await client.query(
                `UPDATE scorecards SET sections = $3::jsonb, total_sections = total_sections + 1,
                 updated_by = $4, content_updated_at = NOW(), updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [data.scorecard_id, scVersion, JSON.stringify(sections), data.updated_by]
            );

            return {
                result: {
                    matchedCount: 1,
                    modifiedCount: 1,
                    section_id: sectionId,
                    section_lineage_id: sectionLineageId,
                    scorecard_version: scVersion,
                },
            };
        });
    }

    async updateSection(data) {
        return withTransaction(async (client) => {
            const draftRow = await lockDraftScorecardRow(client, data.scorecard_id, data.version);
            if (!draftRow) {
                throw new Error("Scorecard not found or not in DRAFT state");
            }

            const scVersion = draftRow.version;
            const sections = parseSections(draftRow.sections);
            const idx = findSectionIndex(sections, data.section_id);
            if (idx < 0) throw new Error(`Section not found: ${data.section_id}`);

            if (data.name !== undefined) sections[idx].name = data.name;
            if (data.sequence !== undefined) sections[idx].sequence = data.sequence;
            if (data.weighting !== undefined) sections[idx].weighting = data.weighting;
            if (data.fail_section !== undefined) sections[idx].fail_section = data.fail_section;

            await client.query(
                `UPDATE scorecards SET sections = $3::jsonb,
                 updated_by = $4, content_updated_at = NOW(), updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [data.scorecard_id, scVersion, JSON.stringify(sections.map(formatSection)), data.updated_by]
            );
            return {
                result: {
                    matchedCount: 1,
                    modifiedCount: 1,
                    scorecard_version: scVersion,
                },
            };
        });
    }

    async removeSection(data) {
        return withTransaction(async (client) => {
            const draftRow = await lockDraftScorecardRow(client, data.scorecard_id, data.version);
            if (!draftRow) throw new Error("Scorecard not found or not in DRAFT state");

            const scVersion = draftRow.version;
            const sections = parseSections(draftRow.sections);
            const section = sections.find(
                (s) => s.section_id === data.section_id || s.section_lineage_id === data.section_id
            );
            if (!section) throw new Error("Scorecard not found or not in DRAFT state");

            const questionCount = (section.questions || []).length;
            const newSections = sections.filter(
                (s) => s.section_id !== section.section_id
            );

            await client.query(
                `DELETE FROM scorecard_questions
                 WHERE scorecard_id = $1 AND scorecard_version = $2 AND section_id = $3`,
                [data.scorecard_id, scVersion, section.section_id]
            );
            await client.query(
                `UPDATE scorecards SET sections = $3::jsonb,
                 total_sections = total_sections - 1,
                 total_questions = total_questions - $4,
                 updated_by = $5, content_updated_at = NOW(), updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [data.scorecard_id, scVersion, JSON.stringify(newSections.map(formatSection)), questionCount, data.updated_by]
            );
            return { result: { matchedCount: 1 } };
        });
    }

    async addQuestion(data, questionDoc) {
        return withTransaction(async (client) => {
            const draftRow = await lockDraftScorecardRow(client, data.scorecard_id, data.version);
            if (!draftRow) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");

            const scVersion = draftRow.version;
            questionDoc.scorecard_version = scVersion;

            const sections = parseSections(draftRow.sections);
            const idx = findSectionIndex(sections, data.section_id);
            if (idx < 0) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");

            await insertQuestions(client, [questionDoc]);

            const questions = sections[idx].questions || [];
            if (!questions.includes(questionDoc.question_id)) {
                questions.push(questionDoc.question_id);
            }
            sections[idx].questions = questions;

            await client.query(
                `UPDATE scorecards SET sections = $3::jsonb, total_questions = total_questions + 1,
                 updated_by = $4, content_updated_at = NOW(), updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [data.scorecard_id, scVersion, JSON.stringify(sections.map(formatSection)), data.updated_by]
            );
            return scVersion;
        });
    }

    async getQuestionById(questionId, scorecardId, scorecardVersion) {
        if (scorecardId != null && scorecardVersion != null) {
            const { rows } = await query(
                `SELECT * FROM scorecard_questions
                 WHERE question_id = $1 AND scorecard_id = $2 AND scorecard_version = $3`,
                [questionId, scorecardId, Number(scorecardVersion)]
            );
            return rowToQuestion(rows[0]);
        }
        const { rows } = await query(
            `SELECT * FROM scorecard_questions q
             WHERE q.question_id = $1
             ORDER BY q.scorecard_version DESC
             LIMIT 1`,
            [questionId]
        );
        return rowToQuestion(rows[0]);
    }

    async updateQuestion(scorecardId, scorecardVersion, questionId, updatableFields) {
        const keys = Object.keys(updatableFields);
        if (keys.length === 0) return { result: { matchedCount: 0 } };

        const setClauses = keys.map((k, i) => {
            if (k === "response_options") return `response_options = $${i + 4}::jsonb`;
            return `${k} = $${i + 4}`;
        });
        const values = keys.map((k) => {
            const v = updatableFields[k];
            if (k === "response_options") return JSON.stringify(v);
            return v;
        });

        const { rowCount } = await query(
            `UPDATE scorecard_questions SET ${setClauses.join(", ")}, updated_at = NOW()
             WHERE scorecard_id = $1 AND scorecard_version = $2 AND question_id = $3`,
            [scorecardId, Number(scorecardVersion), questionId, ...values]
        );
        return { result: { matchedCount: rowCount, modifiedCount: rowCount } };
    }

    async touchContentUpdatedAt(scorecardId, scorecardVersion) {
        if (scorecardVersion != null) {
            await query(
                `UPDATE scorecards SET content_updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2`,
                [scorecardId, Number(scorecardVersion)]
            );
            return;
        }
        await query(
            `UPDATE scorecards SET content_updated_at = NOW()
             WHERE scorecard_id = $1 AND status = 'DRAFT'`,
            [scorecardId]
        );
    }

    async removeQuestion(data) {
        return withTransaction(async (client) => {
            const draftRow = await lockDraftScorecardRow(client, data.scorecard_id, data.version);
            if (!draftRow) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");

            const scVer = draftRow.version;

            const { rowCount: delCount } = await client.query(
                `DELETE FROM scorecard_questions
                 WHERE scorecard_id = $1 AND scorecard_version = $2 AND question_id = $3`,
                [data.scorecard_id, scVer, data.question_id]
            );
            if (delCount === 0) throw new Error(`Question not found: ${data.question_id}`);

            const sections = parseSections(draftRow.sections);
            const idx = findSectionIndex(sections, data.section_id);
            if (idx < 0) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");

            sections[idx].questions = (sections[idx].questions || [])
                .filter((qid) => qid !== data.question_id);

            await client.query(
                `UPDATE scorecards SET sections = $3::jsonb, total_questions = total_questions - 1,
                 updated_by = $4, content_updated_at = NOW(), updated_at = NOW()
                 WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
                [data.scorecard_id, scVer, JSON.stringify(sections.map(formatSection)), data.updated_by]
            );
            return { result: { matchedCount: 1 } };
        });
    }

    async deleteScorecard(scorecardId, scorecardVersion) {
        const draftVer = await resolveDraftVersion(scorecardId, scorecardVersion);
        if (draftVer == null) throw new Error("Scorecard not found");
        const existing = await getScorecardRowByKey(scorecardId, draftVer);
        if (!existing) throw new Error("Scorecard not found");
        if (existing.status !== "DRAFT") {
            throw new Error("Only DRAFT scorecards can be deleted. Use /archive to retire a published scorecard.");
        }
        await query(
            `DELETE FROM scorecards WHERE scorecard_id = $1 AND version = $2 AND status = 'DRAFT'`,
            [scorecardId, existing.version]
        );
        return { result: { scorecard_id: scorecardId, version: existing.version } };
    }

    async importScorecard(newScorecard, newSections, newQuestionDocs) {
        return withTransaction(async (client) => {
            await insertScorecard(client, { ...newScorecard, sections: newSections });
            await insertQuestions(client, newQuestionDocs);
            return {
                scorecard_id: newScorecard.scorecard_id,
                lineage_id: newScorecard.lineage_id,
                version: newScorecard.version,
            };
        });
    }

    async createAuditLog(data) {
        const { rows } = await query(
            `INSERT INTO scorecard_audit_logs (
                scorecard_id, scorecard_lineage_id, scorecard_version,
                entity_type, entity_id, entity_lineage_id, action,
                before, after, actor_id, actor_email, ip_address, metadata
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            RETURNING *`,
            [
                data.scorecard_id, data.scorecard_lineage_id, data.scorecard_version,
                data.entity_type, data.entity_id || null, data.entity_lineage_id || null,
                data.action,
                data.before ? JSON.stringify(data.before) : null,
                data.after ? JSON.stringify(data.after) : null,
                data.actor_id, data.actor_email, data.ip_address || null,
                data.metadata ? JSON.stringify(data.metadata) : null,
            ]
        );
        return { result: rows[0] };
    }

    async getAuditLogByScorecardId(scorecardId, scorecardVersion) {
        const params = [scorecardId];
        let sql = `SELECT * FROM scorecard_audit_logs WHERE scorecard_id = $1`;
        if (scorecardVersion != null && scorecardVersion !== "") {
            sql += ` AND scorecard_version = $2`;
            params.push(Number(scorecardVersion));
        }
        sql += ` ORDER BY created_at DESC`;
        const { rows } = await query(sql, params);
        return { result: rows };
    }
}

module.exports = ScorecardRepository;
