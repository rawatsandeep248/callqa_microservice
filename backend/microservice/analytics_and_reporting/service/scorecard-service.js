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
            data.lineage_id = COMMONUTIL.generateUniqueId();
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
            const result = await this.repo.getScorecardById(data.scorecard_id);
            if (!result.result) return result;

            const questions = await this.repo.getQuestionsByScorecardId(data.scorecard_id, "created_at");
            const questionMap = {};
            for (const q of questions) {
                questionMap[q.question_id] = q;
            }

            const scorecard = { ...result.result };
            scorecard.sections = scorecard.sections
                .map((section) => ({
                    ...section,
                    questions: section.questions
                        .map((questionId) => questionMap[questionId] || null)
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
            return await this.repo.updateScorecard(scorecard_id, updatableFields);
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
            const scResult = await this.repo.getScorecardById(data.scorecard_id);
            const questions = await this.repo.getQuestionsByScorecardId(data.scorecard_id, "sequence");
            if (!scResult.result) throw new Error("Scorecard not found");
            const { errors } = this._validateForPublish(scResult.result, questions);
            if (errors.length > 0) throw new Error("Publish blocked: " + errors.join("; "));

            return await this.repo.publishScorecard(
                data.scorecard_id, data.published_by, data.updated_by
            );
        } catch (error) {
            throw error;
        }
    }

    async createDraft(data) {
        try {
            const draftResult = await this.repo.createDraft(
                data.scorecard_id,
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
            return await this.repo.updateStatus(data.scorecard_id, "PUBLISHED", {
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
            return await this.repo.updateStatus(data.scorecard_id, "DISABLED", {
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
            return await this.repo.updateStatusAny(data.scorecard_id, {
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
            const sectionLineageId = COMMONUTIL.generateUniqueId();
            return await this.repo.addSection(data, sectionId, sectionLineageId);
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
                question_lineage_id: COMMONUTIL.generateUniqueId(),
                scorecard_id: data.scorecard_id,
                scorecard_lineage_id: data.scorecard_lineage_id,
                section_id: data.section_id,
                section_lineage_id: data.section_lineage_id,
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

            await this.repo.addQuestion(data, questionDoc);
            return {
                result: {
                    question_id: questionDoc.question_id,
                    question_lineage_id: questionDoc.question_lineage_id,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async updateQuestion(data) {
        try {
            const existingQuestion = await this.repo.getQuestionById(data.question_id);
            if (!existingQuestion) {
                throw new Error(`Question not found: ${data.question_id}`);
            }

            const parentScorecardId = existingQuestion.scorecard_id;
            if (parentScorecardId) {
                const parent = await this.repo.getScorecardById(parentScorecardId);
                if (parent.result && parent.result.status === "PUBLISHED") {
                    throw new Error("Cannot edit a question on a published scorecard. Create a draft first.");
                }
            }

            const {
                question_id, question_lineage_id, version,
                scorecard_id, scorecard_lineage_id,
                section_id, section_lineage_id,
                created_by, created_at, updated_at,
                ...updatableFields
            } = data;

            const result = await this.repo.updateQuestion(data.question_id, updatableFields);
            if (result?.result?.matchedCount === 0) {
                throw new Error(`Question not found: ${data.question_id}`);
            }

            const touchId = data.scorecard_id || parentScorecardId;
            if (touchId) {
                await this.repo.touchContentUpdatedAt(touchId);
            }
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
            return await this.repo.deleteScorecard(data.scorecard_id);
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

    async exportScorecard(scorecard_id) {
        try {
            const scorecardResult = await this.repo.getScorecardById(scorecard_id);
            const questions = await this.repo.getQuestionsByScorecardId(scorecard_id, "sequence");

            const scorecard = scorecardResult.result;
            if (!scorecard) throw new Error("Scorecard not found");

            const qIdToLineageId = {};
            for (const q of questions) {
                qIdToLineageId[q.question_id] = q.question_lineage_id;
            }

            const exportedScorecard = {
                name:            scorecard.name,
                description:     scorecard.description,
                channels:        scorecard.channels || [],
                total_sections:  scorecard.total_sections,
                total_questions: scorecard.total_questions,
                sections: scorecard.sections.map((s) => ({
                    section_lineage_id: s.section_lineage_id,
                    name:       s.name,
                    sequence:   s.sequence,
                    weighting:  s.weighting,
                    fail_section: s.fail_section,
                    questions:  s.questions.map((ref) => qIdToLineageId[ref] || ref),
                })),
            };

            const exportedQuestions = questions.map((q) => ({
                question_lineage_id: q.question_lineage_id,
                section_lineage_id:  q.section_lineage_id,
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
            const newScorecardLineageId = COMMONUTIL.generateUniqueId();

            const sectionLineageMap = {};
            data.scorecard.sections.forEach((section) => {
                sectionLineageMap[section.section_lineage_id] = {
                    section_id:         COMMONUTIL.generateUniqueId(),
                    section_lineage_id: COMMONUTIL.generateUniqueId(),
                };
            });

            const questionLineageToNewId = {};
            data.questions.forEach((q) => {
                questionLineageToNewId[q.question_lineage_id] = COMMONUTIL.generateUniqueId();
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
                    question_lineage_id:  COMMONUTIL.generateUniqueId(),
                    scorecard_id:         newScorecardId,
                    scorecard_lineage_id: newScorecardLineageId,
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
                lineage_id:          newScorecardLineageId,
                version:             1,
                status:              "DRAFT",
                origin:              "IMPORTED",
                name:                data.scorecard.name,
                description:         data.scorecard.description || null,
                channels:            data.scorecard.channels || [],
                state:               data.scorecard.state || null,
                scoring:             data.scorecard.scoring || null,
                fail_scorecard:      data.scorecard.fail_scorecard || false,
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
            return await this.repo.getAuditLogByScorecardId(data.scorecard_id);
        } catch (error) {
            throw error;
        }
    }

    async validateScorecard(scorecard_id) {
        try {
            const scResult = await this.repo.getScorecardById(scorecard_id);
            const questions = await this.repo.getQuestionsByScorecardId(scorecard_id, "sequence");
            if (!scResult.result) throw new Error("Scorecard not found");
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
