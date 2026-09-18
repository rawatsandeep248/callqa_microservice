const COMMONUTIL = require("../../../common/utils/common-util");
const ScorecardRepository = require("../repository/scorecard-repository");

class ScorecardService {
    constructor(config) {
        this.config = config;
        this.repo = new ScorecardRepository();
    }

    async createScorecard(data) {
        try {
            data.scorecard_id = COMMONUTIL.generateUniqueId();
            data.lineage_id = data.scorecard_id;
            data.version = 1;
            data.status = "DRAFT";
            data.origin = "CREATED";
            data.sections = data.sections || [];
            data.total_sections = data.total_sections || 0;
            data.total_questions = data.total_questions || 0;
            return await this.repo.createScorecard(data);
        } catch (error) {
            throw error;
        }
    }

    async listScorecards(data) {
        try {
            return await this.repo.listScorecards(data);
        } catch (error) {
            throw error;
        }
    }

    async getScorecardById(data) {
        try {
            const result = await this.repo.getScorecardById(data.scorecard_id, data.version);
            if (!result.result) return result;

            const questions = await this.repo.getQuestionsByScorecardId(
                data.scorecard_id,
                result.result.version,
                "created_at"
            );
            const questionMap = {};
            for (const q of questions) {
                questionMap[q.question_id] = q;
            }

            const scorecard = { ...result.result };
            scorecard.sections = scorecard.sections
                .map((section) => ({
                    ...section,
                    questions: (section.questions || [])
                        .map((ref) => {
                            const qid = typeof ref === "string" ? ref : ref?.question_id;
                            if (!qid) return null;
                            return questionMap[qid] || null;
                        })
                        .filter(Boolean)
                        .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
                }))
                .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
            result.result = scorecard;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getScorecardVersions(data) {
        try {
            return await this.repo.getScorecardVersions(data.lineage_id);
        } catch (error) {
            throw error;
        }
    }

    async updateScorecard(data) {
        try {
            const {
                scorecard_id, lineage_id, version, status,
                sections, total_sections, total_questions,
                published_at, published_by, disabled_at, disabled_by,
                archived_at, archived_by, source_scorecard_id,
                source_lineage_id, created_by,
                created_at, updated_at,
                ...updatableFields
            } = data;
            return await this.repo.updateScorecard(scorecard_id, version, updatableFields);
        } catch (error) {
            throw error;
        }
    }

    async updateAiConfigForAll(data) {
        try {
            return await this.repo.updateAiConfigForAll(data.model_provider, data.ai_model);
        } catch (error) {
            throw error;
        }
    }

    async publishScorecard(data) {
        try {
            const ver = await this.repo.resolveEditableDraftVersion(
                data.scorecard_id,
                data.version
            );
            if (ver == null) throw new Error("No draft scorecard found to publish");

            const scResult = await this.getScorecardById({
                scorecard_id: data.scorecard_id,
                version: ver,
            });
            if (!scResult.result) throw new Error("Scorecard not found");
            const questions = await this.repo.getQuestionsByScorecardId(
                data.scorecard_id,
                ver,
                "sequence"
            );
            const { errors } = this._validateForPublish(scResult.result, questions);
            if (errors.length > 0) throw new Error("Publish blocked: " + errors.join("; "));

            return await this.repo.publishScorecard(
                data.scorecard_id,
                ver,
                data.published_by,
                data.updated_by ?? data.published_by
            );
        } catch (error) {
            throw error;
        }
    }

    async createDraft(data) {
        try {
            const draftResult = await this.repo.createDraft(
                data.scorecard_id,
                data.source_version ?? data.version,
                data.created_by,
                data.updated_by,
                () => COMMONUTIL.generateUniqueId()
            );
            return { result: draftResult };
        } catch (error) {
            throw error;
        }
    }

    async disableScorecard(data) {
        try {
            if (data.version != null) {
                return await this.repo.updateStatus(data.scorecard_id, data.version, "PUBLISHED", {
                    status: "DISABLED",
                    disabled_at: new Date(),
                    disabled_by: data.disabled_by,
                    updated_by: data.updated_by,
                });
            }
            return await this.repo.updateStatusForLatest(data.scorecard_id, "PUBLISHED", {
                status: "DISABLED",
                disabled_at: new Date(),
                disabled_by: data.disabled_by,
                updated_by: data.updated_by,
            });
        } catch (error) {
            throw error;
        }
    }

    async enableScorecard(data) {
        try {
            if (data.version != null) {
                return await this.repo.updateStatus(data.scorecard_id, data.version, "DISABLED", {
                    status: "PUBLISHED",
                    enabled_at: new Date(),
                    enabled_by: data.enabled_by,
                    updated_by: data.enabled_by,
                });
            }
            return await this.repo.updateStatusForLatest(data.scorecard_id, "DISABLED", {
                status: "PUBLISHED",
                enabled_at: new Date(),
                enabled_by: data.enabled_by,
                updated_by: data.enabled_by,
            });
        } catch (error) {
            throw error;
        }
    }

    async archiveScorecard(data) {
        try {
            return await this.repo.updateStatusAny(data.scorecard_id, data.version, {
                status: "ARCHIVED",
                archived_at: new Date(),
                archived_by: data.archived_by,
                updated_by: data.updated_by,
            });
        } catch (error) {
            throw error;
        }
    }

    async addSection(data) {
        try {
            const sectionId = COMMONUTIL.generateUniqueId();
            return await this.repo.addSection(data, sectionId, sectionId);
        } catch (error) {
            throw error;
        }
    }

    async updateSection(data) {
        try {
            return await this.repo.updateSection(data);
        } catch (error) {
            throw error;
        }
    }

    async removeSection(data) {
        try {
            return await this.repo.removeSection(data);
        } catch (error) {
            throw error;
        }
    }

    async addQuestion(data) {
        try {
            const questionId = COMMONUTIL.generateUniqueId();
            const questionDoc = {
                question_id: questionId,
                question_lineage_id: questionId,
                scorecard_id: data.scorecard_id,
                scorecard_lineage_id: data.scorecard_lineage_id || data.scorecard_id,
                section_id: data.section_id,
                section_lineage_id: data.section_lineage_id || data.section_id,
                version: 1,
                sequence: data.sequence,
                question_text: data.question_text,
                question_type: data.question_type,
                response_options: data.response_options || [],
                fail_section: data.fail_section || false,
                critical: data.critical || false,
                scorable: data.scorable !== false,
                enabled: data.enabled !== false,
                evidence_source: data.evidence_source || null,
                max_score: data.max_score,
                weight: data.weight,
                ai_instructions: data.ai_instructions || null,
                created_by: data.created_by,
                updated_by: data.updated_by,
            };

            const scorecardVersion = await this.repo.addQuestion(data, questionDoc);
            return {
                result: {
                    question_id: questionDoc.question_id,
                    question_lineage_id: questionDoc.question_lineage_id,
                    scorecard_version: scorecardVersion,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async updateQuestion(data) {
        try {
            let scorecardId = data.scorecard_id;
            let scorecardVersion = data.version ?? data.scorecard_version;

            if (!scorecardId || scorecardVersion == null) {
                const existing = await this.repo.getQuestionById(data.question_id);
                if (!existing) {
                    throw new Error(`Question not found: ${data.question_id}`);
                }
                scorecardId = scorecardId || existing.scorecard_id;
                scorecardVersion = scorecardVersion ?? existing.scorecard_version;
            }

            scorecardVersion = await this.repo.resolveEditableDraftVersion(
                scorecardId,
                scorecardVersion
            );
            if (!scorecardId || scorecardVersion == null) {
                throw new Error("scorecard_id and version are required to update a question");
            }

            const parent = await this.repo.getScorecardById(scorecardId, scorecardVersion);
            if (!parent.result) throw new Error("Scorecard not found");
            if (parent.result.status === "PUBLISHED") {
                throw new Error("Cannot edit a question on a published scorecard. Create a draft first.");
            }

            const {
                question_id, question_lineage_id, version,
                scorecard_id, scorecard_lineage_id, scorecard_version,
                section_id, section_lineage_id,
                created_by, created_at, updated_at,
                ...updatableFields
            } = data;

            const result = await this.repo.updateQuestion(
                scorecardId,
                scorecardVersion,
                data.question_id,
                updatableFields
            );
            if (result?.result?.matchedCount === 0) {
                throw new Error(`Question not found: ${data.question_id}`);
            }

            await this.repo.touchContentUpdatedAt(scorecardId, scorecardVersion);
            if (result?.result) result.result.scorecard_version = scorecardVersion;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeQuestion(data) {
        try {
            return await this.repo.removeQuestion(data);
        } catch (error) {
            throw error;
        }
    }

    async deleteScorecard(data) {
        try {
            return await this.repo.deleteScorecard(data.scorecard_id, data.version);
        } catch (error) {
            throw error;
        }
    }

    _validateImportPayload(data) {
        const VALID_CHANNELS = ["INBOUND_CALL", "OUTBOUND_CALL", "CHAT", "TICKET", "AGENT_ASSIST"];
        const VALID_QUESTION_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO", "NUMERIC", "TEXT"];
        const SELECT_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO"];

        if (!data.scorecard)                         throw new Error("Missing 'scorecard' in payload");
        if (!data.questions)                         throw new Error("Missing 'questions' in payload");
        if (!Array.isArray(data.scorecard.sections)) throw new Error("'scorecard.sections' must be an array");
        if (!Array.isArray(data.questions))          throw new Error("'questions' must be an array");
        if (!data.created_by)                        throw new Error("'created_by' is required");
        if (!data.updated_by)                        throw new Error("'updated_by' is required");

        if (!data.scorecard.name?.trim())   throw new Error("Scorecard 'name' is required");
        if (!Array.isArray(data.scorecard.channels) || data.scorecard.channels.length === 0)
            throw new Error("Scorecard 'channels' must be a non-empty array");
        const invalidChannels = data.scorecard.channels.filter(c => !VALID_CHANNELS.includes(c));
        if (invalidChannels.length)
            throw new Error(`Invalid channels: ${invalidChannels.join(", ")}. Must be one of: ${VALID_CHANNELS.join(", ")}`);

        const sectionSequences   = new Set();
        const sectionLineageIds  = new Set();

        data.scorecard.sections.forEach((section, i) => {
            if (!section.name?.trim())
                throw new Error(`Section[${i}]: 'name' is required`);
            if (section.sequence == null)
                throw new Error(`Section[${i}]: 'sequence' is required`);
            if (section.weighting == null)
                throw new Error(`Section[${i}]: 'weighting' is required`);
            if (section.weighting < 0 || section.weighting > 100)
                throw new Error(`Section[${i}]: 'weighting' must be between 0 and 100`);
            if (!section.section_lineage_id)
                throw new Error(`Section[${i}]: 'section_lineage_id' is required`);
            if (!Array.isArray(section.questions))
                throw new Error(`Section[${i}]: 'questions' must be an array`);
            if (sectionSequences.has(section.sequence))
                throw new Error(`Duplicate section sequence: ${section.sequence}`);
            if (sectionLineageIds.has(section.section_lineage_id))
                throw new Error(`Duplicate section_lineage_id: ${section.section_lineage_id}`);

            sectionSequences.add(section.sequence);
            sectionLineageIds.add(section.section_lineage_id);
        });

        const questionLineageIds = new Set();

        data.questions.forEach((q, i) => {
            if (!q.question_lineage_id)
                throw new Error(`Question[${i}]: 'question_lineage_id' is required`);
            if (!q.section_lineage_id)
                throw new Error(`Question[${i}]: 'section_lineage_id' is required`);
            if (!q.question_text?.trim())
                throw new Error(`Question[${i}]: 'question_text' is required`);
            if (!q.question_type)
                throw new Error(`Question[${i}]: 'question_type' is required`);
            if (!VALID_QUESTION_TYPES.includes(q.question_type))
                throw new Error(`Question[${i}]: invalid 'question_type'. Must be one of: ${VALID_QUESTION_TYPES.join(", ")}`);
            if (q.sequence == null)
                throw new Error(`Question[${i}]: 'sequence' is required`);
            if (q.weight == null)
                throw new Error(`Question[${i}]: 'weight' is required`);
            if (q.weight < 0 || q.weight > 100)
                throw new Error(`Question[${i}]: 'weight' must be between 0 and 100`);
            if (questionLineageIds.has(q.question_lineage_id))
                throw new Error(`Duplicate question_lineage_id: ${q.question_lineage_id}`);

            questionLineageIds.add(q.question_lineage_id);

            if (SELECT_TYPES.includes(q.question_type)) {
                if (!Array.isArray(q.response_options) || q.response_options.length === 0)
                    throw new Error(`Question[${i}]: 'response_options' is required for type '${q.question_type}'`);
                q.response_options.forEach((opt, j) => {
                    if (!opt.label?.trim())
                        throw new Error(`Question[${i}].response_options[${j}]: 'label' is required`);
                    if (!opt.value?.trim())
                        throw new Error(`Question[${i}].response_options[${j}]: 'value' is required`);
                    if (opt.points === undefined)
                        throw new Error(`Question[${i}].response_options[${j}]: 'points' is required (use null for unscored options)`);
                });
            }
        });

        data.questions.forEach((q, i) => {
            if (!sectionLineageIds.has(q.section_lineage_id))
                throw new Error(`Question[${i}]: 'section_lineage_id' "${q.section_lineage_id}" does not match any section`);
        });

        data.scorecard.sections.forEach((section, i) => {
            section.questions.forEach((qLineageId, j) => {
                if (!questionLineageIds.has(qLineageId))
                    throw new Error(`Section[${i}].questions[${j}]: question_lineage_id "${qLineageId}" not found in questions array`);
            });
        });

        const totalQuestionsInSections = data.scorecard.sections.reduce((sum, s) => sum + s.questions.length, 0);
        if (totalQuestionsInSections !== data.questions.length)
            throw new Error(`Question count mismatch: sections reference ${totalQuestionsInSections} questions but ${data.questions.length} were provided`);
    }

    _collectQuestionsFromScorecard(scorecard) {
        const byId = new Map();
        for (const section of scorecard.sections || []) {
            for (const ref of section.questions || []) {
                if (ref && typeof ref === "object" && ref.question_id) {
                    byId.set(ref.question_id, ref);
                }
            }
        }
        return [...byId.values()].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    }

    async exportScorecard(scorecard_id, version) {
        try {
            const full = await this.getScorecardById({ scorecard_id, version });
            if (!full.result) throw new Error("Scorecard not found");

            const scorecard = full.result;
            let questions = this._collectQuestionsFromScorecard(scorecard);
            if (questions.length === 0) {
                questions = await this.repo.getQuestionsByScorecardId(
                    scorecard_id,
                    scorecard.version,
                    "sequence"
                );
            }

            const qIdToLineageId = {};
            for (const q of questions) {
                qIdToLineageId[q.question_id] = q.question_lineage_id || q.question_id;
            }

            const exportedScorecard = {
                name:            scorecard.name,
                description:     scorecard.description,
                channels:        scorecard.channels || [],
                state:           scorecard.state || null,
                scorecard_type:  scorecard.scorecard_type || null,
                fail_scorecard:  scorecard.fail_scorecard || false,
                scoring:         scorecard.scoring || null,
                model_provider:  scorecard.model_provider || null,
                ai_model:        scorecard.ai_model || null,
                total_sections:  scorecard.total_sections,
                total_questions: scorecard.total_questions,
                sections: (scorecard.sections || []).map((s) => ({
                    section_lineage_id: s.section_lineage_id || s.section_id,
                    name:         s.name,
                    sequence:     s.sequence,
                    weighting:    s.weighting,
                    fail_section: s.fail_section,
                    questions:    (s.questions || []).map((ref) => {
                        if (ref && typeof ref === "object") {
                            return ref.question_lineage_id || ref.question_id;
                        }
                        const qid = typeof ref === "string" ? ref : ref?.question_id;
                        return qIdToLineageId[qid] || qid;
                    }).filter(Boolean),
                })),
            };

            const exportedQuestions = questions.map((q) => ({
                question_lineage_id: q.question_lineage_id || q.question_id,
                section_lineage_id:  q.section_lineage_id || q.section_id,
                sequence:            q.sequence,
                question_text:       q.question_text,
                question_type:       q.question_type,
                response_options:    q.response_options,
                fail_section:        q.fail_section,
                critical:            q.critical || false,
                scorable:            q.scorable !== false,
                enabled:             q.enabled !== false,
                evidence_source:     q.evidence_source || null,
                max_score:           q.max_score,
                weight:              q.weight,
                ai_instructions:     q.ai_instructions,
            }));

            return {
                result: {
                    export_version: "1.0",
                    exported_at:    new Date().toISOString(),
                    source_info: {
                        scorecard_id: scorecard.scorecard_id,
                        lineage_id:   scorecard.lineage_id,
                        version:      scorecard.version,
                        name:         scorecard.name,
                    },
                    scorecard:      exportedScorecard,
                    questions:      exportedQuestions,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async importScorecard(data) {
        try {
            this._validateImportPayload(data);

            const newScorecardId = COMMONUTIL.generateUniqueId();

            const sectionLineageMap = {};
            data.scorecard.sections.forEach((section) => {
                const sectionId = COMMONUTIL.generateUniqueId();
                sectionLineageMap[section.section_lineage_id] = {
                    section_id:         sectionId,
                    section_lineage_id: sectionId,
                };
            });

            const questionLineageToNewId = {};
            data.questions.forEach((q) => {
                const qid = COMMONUTIL.generateUniqueId();
                questionLineageToNewId[q.question_lineage_id] = qid;
            });

            const newSections = data.scorecard.sections.map((section) => {
                const mapped = sectionLineageMap[section.section_lineage_id];
                return {
                    section_id:         mapped.section_id,
                    section_lineage_id: mapped.section_lineage_id,
                    name:               section.name,
                    sequence:           section.sequence,
                    weighting:          section.weighting,
                    fail_section:       section.fail_section || false,
                    questions:          section.questions.map((oldQLineageId) => questionLineageToNewId[oldQLineageId]).filter(Boolean),
                };
            });

            const newQuestionDocs = data.questions.map((q) => {
                const owningSection = sectionLineageMap[q.section_lineage_id];
                return {
                    question_id:          questionLineageToNewId[q.question_lineage_id],
                    question_lineage_id:  questionLineageToNewId[q.question_lineage_id],
                    scorecard_id:         newScorecardId,
                    scorecard_version:    1,
                    scorecard_lineage_id: newScorecardId,
                    section_id:           owningSection.section_id,
                    section_lineage_id:   owningSection.section_lineage_id,
                    version:              1,
                    sequence:             q.sequence,
                    question_text:        q.question_text,
                    question_type:        q.question_type,
                    response_options:     q.response_options || [],
                    fail_section:         q.fail_section || false,
                    critical:             q.critical || false,
                    scorable:             q.scorable !== false,
                    enabled:              q.enabled !== false,
                    evidence_source:      q.evidence_source || null,
                    max_score:            q.max_score,
                    weight:               q.weight,
                    ai_instructions:      q.ai_instructions || null,
                    created_by:           data.created_by,
                    updated_by:           data.updated_by,
                };
            });

            const newScorecard = {
                scorecard_id:        newScorecardId,
                lineage_id:          newScorecardId,
                version:             1,
                status:              "DRAFT",
                origin:              "IMPORTED",
                name:                data.scorecard.name,
                description:         data.scorecard.description || null,
                channels:            data.scorecard.channels || [],
                state:               data.scorecard.state || null,
                scorecard_type:      data.scorecard.scorecard_type || null,
                scoring:             data.scorecard.scoring || null,
                fail_scorecard:      data.scorecard.fail_scorecard || false,
                model_provider:      data.scorecard.model_provider || null,
                ai_model:            data.scorecard.ai_model || null,
                total_sections:      newSections.length,
                total_questions:     newQuestionDocs.length,
                source_scorecard_id: data.source_info?.scorecard_id || null,
                source_lineage_id:   data.source_info?.lineage_id   || null,
                created_by:          data.created_by,
                updated_by:          data.updated_by,
            };

            const importResult = await this.repo.importScorecard(
                newScorecard, newSections, newQuestionDocs
            );

            return { result: importResult };
        } catch (error) {
            throw error;
        }
    }

    async createAuditLog(data) {
        try {
            return await this.repo.createAuditLog(data);
        } catch (error) {
            throw error;
        }
    }

    async getAuditLogByScorecardId(data) {
        try {
            return await this.repo.getAuditLogByScorecardId(data.scorecard_id, data.version);
        } catch (error) {
            throw error;
        }
    }

    async validateScorecard(scorecard_id, version) {
        try {
            const ver = await this.repo.resolveEditableDraftVersion(scorecard_id, version);
            const loadVersion = ver ?? version;
            const scResult = await this.getScorecardById({
                scorecard_id,
                version: loadVersion,
            });
            if (!scResult.result) throw new Error("Scorecard not found");
            const qVersion = ver ?? scResult.result.version;
            const questions = await this.repo.getQuestionsByScorecardId(
                scorecard_id,
                qVersion,
                "sequence"
            );
            return { result: this._validateForPublish(scResult.result, questions) };
        } catch (error) {
            throw error;
        }
    }

    _validateForPublish(scorecard, questions) {
        const errors = [];
        const warnings = [];
        const SELECT_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO"];

        for (const q of questions) {
            if (!q.enabled) continue;

            if (q.scorable !== false) {
                if (!q.evidence_source)
                    errors.push(`Question "${q.question_text}": 'evidence_source' is required`);
                if (q.max_score == null || q.max_score === 0)
                    errors.push(`Question "${q.question_text}": 'max_score' is required for scorable questions`);
                if (!q.ai_instructions)
                    warnings.push(`Question "${q.question_text}": no AI instructions provided`);
            }

            if (SELECT_TYPES.includes(q.question_type)) {
                const opts = (q.response_options || []).filter(o => o.value !== "CANNOT_DETERMINE");
                if (opts.length === 0)
                    errors.push(`Question "${q.question_text}": must have at least one selectable option`);

                if (q.fail_section && !opts.some(o => o.is_fail))
                    errors.push(`Question "${q.question_text}": 'fail_section' is true but no option has 'is_fail' set`);

                if (q.critical && !opts.some(o => o.is_fail))
                    errors.push(`Question "${q.question_text}": 'critical' is true but no option has 'is_fail' set`);

                if (q.max_score != null) {
                    for (const opt of opts) {
                        if (opt.points != null && opt.points > q.max_score)
                            errors.push(`Question "${q.question_text}", option "${opt.value}": points (${opt.points}) exceeds max_score (${q.max_score})`);
                    }
                }

                const seen = new Set();
                for (const opt of q.response_options || []) {
                    if (seen.has(opt.value))
                        errors.push(`Question "${q.question_text}": duplicate option value "${opt.value}"`);
                    seen.add(opt.value);
                }
            }
        }

        return { errors, warnings };
    }
}

module.exports = ScorecardService;
