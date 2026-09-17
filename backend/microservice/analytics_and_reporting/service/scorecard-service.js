const MONGOOSEDB = require("../../../common/database/mongoose-query");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const COMMONUTIL = require("../../../common/utils/common-util");

const DB = MESSAGEUTIL.info().database_collections.customer_db;
const REQ_TYPE = MESSAGEUTIL.info().database_req_type.customer;

class ScorecardService {
    constructor(config) {
        this.config = config;
        this.mongoose = new MONGOOSEDB();
    }

    getCustomerDbUrl() {
        const database = this.config.get("database");
        let url = database.host;
        url = url.replace("$username", database.user);
        url = url.replace("$password", database.password);
        url = url.replace("$database", database.name);
        return url;
    }

    async createScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            data.scorecard_id = COMMONUTIL.generateUniqueId();
            data.lineage_id = COMMONUTIL.generateUniqueId();
            data.version = 1;
            data.status = "DRAFT";
            data.origin = "CREATED";
            const result = await this.mongoose.create_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, data
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async listScorecards(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);

            // ── Build filter query ───────────────────────────────────────────────
            const query = {};
            if (data.status)  query.status  = data.status.trim().toUpperCase();   // e.g. "DRAFT"
            if (data.channel) {
                // Back-compat: old docs have `channel` (string), new docs have `channels` (array)
                const ch = data.channel.trim().replace(/ /g, '_');
                query.$or = [
                    { channels: { $in: [ch] } },
                    { channel: ch },
                ];
            }
            if (data.state) query.state = data.state.trim().toUpperCase();
            if (data.search && data.search.trim()) {
                const regex = new RegExp(data.search.trim(), 'i');
                query.$or = [{ name: regex }, { description: regex }];
            }

            // ── Pagination params ────────────────────────────────────────────────
            // mongoose-query's find_record_sorted uses: .skip(skip * limit)
            // so skip = page - 1 → skip * limit = (page-1) * limit = rows to skip
            const page  = Math.max(1, parseInt(data.page  || '1'));
            const limit = Math.max(1, parseInt(data.limit || '10'));
            const skip  = page - 1;

            // ── Run list + count + stats in parallel ─────────────────────────────
            const [listResult, countResult, draftCount, publishedCount, disabledCount, archivedCount, needsAttentionResult] =
                await Promise.all([
                    this.mongoose.find_record_sorted(
                        DB.scorecards, url, collectionModel, REQ_TYPE,
                        query, { created_at: -1 }, skip, limit, null
                    ),
                    this.mongoose.count_record(
                        DB.scorecards, url, collectionModel, REQ_TYPE, query
                    ),
                    // Stats are always unfiltered (whole org view)
                    this.mongoose.count_record(DB.scorecards, url, collectionModel, REQ_TYPE, { status: 'DRAFT' }),
                    this.mongoose.count_record(DB.scorecards, url, collectionModel, REQ_TYPE, { status: 'PUBLISHED' }),
                    this.mongoose.count_record(DB.scorecards, url, collectionModel, REQ_TYPE, { status: 'DISABLED' }),
                    this.mongoose.count_record(DB.scorecards, url, collectionModel, REQ_TYPE, { status: 'ARCHIVED' }),
                    // Sections whose weights don't sum to 100 — "needs attention"
                    this.mongoose.aggregate_record(DB.scorecards, url, collectionModel, REQ_TYPE, [
                        { $addFields: { totalWeight: { $sum: '$sections.weighting' } } },
                        { $match: { totalWeight: { $ne: 100 } } },
                        { $count: 'count' },
                    ]),
                ]);

            const total = countResult.result || 0;
            const statsTotal = (draftCount.result || 0) + (publishedCount.result || 0)
                             + (disabledCount.result || 0) + (archivedCount.result || 0);

            return {
                result: {
                    data:       listResult.result || [],
                    total,
                    page,
                    limit,
                    totalPages: Math.max(1, Math.ceil(total / limit)),
                    stats: {
                        total:          statsTotal,
                        draft:          draftCount.result     || 0,
                        published:      publishedCount.result || 0,
                        disabled:       disabledCount.result  || 0,
                        archived:       archivedCount.result  || 0,
                        needsAttention: needsAttentionResult.result?.[0]?.count || 0,
                    },
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async getScorecardById(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);
            const [result, questionsResult] = await Promise.all([
                this.mongoose.find_single_record(
                    DB.scorecards, url, collectionModel, REQ_TYPE,
                    { scorecard_id: data.scorecard_id }, null, null
                ),
                this.mongoose.find_sorted_record(
                    DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                    { scorecard_id: data.scorecard_id }, { created_at: 1 }
                ),
            ]);
            if (!result.result) return result;

            // Build question_id → question doc lookup (question_id is globally unique — no ambiguity)
            const questionMap = {};
            for (const q of questionsResult.result || []) {
                questionMap[q.question_id] = q;
            }

            // Replace question_id strings in each section with the full question objects
            const scorecard = result.result.toObject ? result.result.toObject() : { ...result.result };
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
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const result = await this.mongoose.find_sorted_record(
                DB.scorecards, url, collectionModel, REQ_TYPE,
                { lineage_id: data.lineage_id }, { version: -1 }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const query = { scorecard_id: data.scorecard_id, status: "DRAFT" };
            // Strip immutable identity and lifecycle fields — only allow metadata edits
            const {
                scorecard_id, lineage_id, version, status,
                sections, total_sections, total_questions,
                published_at, published_by, disabled_at, disabled_by,
                archived_at, archived_by, source_scorecard_id,
                source_lineage_id, created_by,
                created_at, updated_at,
                ...updatableFields
            } = data;
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, { $set: updatableFields }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Applies the org-wide AI provider/model to existing scorecards.
     * PUBLISHED scorecards are excluded: they are the live scoring definition,
     * so their model must not change retroactively. They pick up the new value
     * the next time a draft of them is published.
     */
    async updateAiConfigForAll(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const query = { status: { $ne: "PUBLISHED" } };
            // Only the two AI fields — deliberately NOT updated_by/updated_at, so
            // "Last Modified" keeps reflecting actual scorecard content edits
            // rather than showing every card as just-touched by the admin.
            const values = {
                $set: {
                    model_provider: data.model_provider,
                    ai_model: data.ai_model,
                },
            };
            const result = await this.mongoose.update_many_records(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, values
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async publishScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // Run publish validation before changing status
            const [scResult, qResult] = await Promise.all([
                this.mongoose.find_single_record(DB.scorecards, url, scorecardModel, REQ_TYPE, { scorecard_id: data.scorecard_id }, null, null),
                this.mongoose.find_sorted_record(DB.scorecard_questions, url, questionsModel, REQ_TYPE, { scorecard_id: data.scorecard_id }, { sequence: 1 }),
            ]);
            if (!scResult.result) throw new Error("Scorecard not found");
            const { errors } = this._validateForPublish(scResult.result, qResult.result || []);
            if (errors.length > 0) throw new Error("Publish blocked: " + errors.join("; "));

            const query = { scorecard_id: data.scorecard_id, status: "DRAFT" };
            const values = {
                $set: {
                    status: "PUBLISHED",
                    published_at: new Date(),
                    published_by: data.published_by,
                    updated_by: data.updated_by,
                },
            };
            const result = await this.mongoose.update_record(
                DB.scorecards, url, scorecardModel, REQ_TYPE, query, values
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async createDraft(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // Fetch source scorecard and source questions in parallel
            const [sourceResult, sourceQuestions] = await Promise.all([
                this.mongoose.find_single_record(
                    DB.scorecards, url, scorecardModel, REQ_TYPE,
                    { scorecard_id: data.scorecard_id }, null, null
                ),
                this.mongoose.find_sorted_record(
                    DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                    { scorecard_id: data.scorecard_id }, { created_at: 1 }
                ),
            ]);
            const source = sourceResult.result;
            if (!source) throw new Error("Source scorecard not found");

            // Fetch latest version number for this lineage
            const versionsResult = await this.mongoose.find_sorted_record(
                DB.scorecards, url, scorecardModel, REQ_TYPE,
                { lineage_id: source.lineage_id }, { version: -1 }
            );
            const latestVersion = versionsResult.result && versionsResult.result.length > 0
                ? versionsResult.result[0].version
                : source.version;

            // Build new scorecard — new scorecard_id, same lineage_id, incremented version
            const newScorecardId = COMMONUTIL.generateUniqueId();

            // Step 1: Build section ID map (old section_lineage_id → new section identifiers)
            const sectionIdMap = {};
            source.sections.forEach((section) => {
                sectionIdMap[section.section_lineage_id] = {
                    section_id: COMMONUTIL.generateUniqueId(),
                    section_lineage_id: section.section_lineage_id,
                };
            });

            // Step 2: Generate new question docs FIRST so we have new question_ids
            // Build map: old question_id → new question_id (used to populate section.questions[]).
            // section.questions stores question_id, NOT question_lineage_id — confirmed by
            // addQuestion() ($addToSet ... questionId) and removeQuestion() ($pull ...
            // data.question_id). question_lineage_id is a separate identifier that stays
            // stable across versions and is preserved unchanged on each cloned doc below,
            // but it is not what links a question into its section.
            const newQuestionDocs = [];
            const questionIdToNewId = {};
            if (sourceQuestions.result && sourceQuestions.result.length > 0) {
                sourceQuestions.result.forEach((q) => {
                    const newQuestionId = COMMONUTIL.generateUniqueId();
                    questionIdToNewId[q.question_id] = newQuestionId;
                    const owningSection = sectionIdMap[q.section_lineage_id];
                    newQuestionDocs.push({
                        question_id:          newQuestionId,
                        question_lineage_id:  q.question_lineage_id,
                        scorecard_id:         newScorecardId,
                        scorecard_lineage_id: source.lineage_id,
                        section_id:           owningSection ? owningSection.section_id : q.section_id,
                        section_lineage_id:   q.section_lineage_id,
                        sequence:             q.sequence,
                        version:              q.version,
                        question_text:        q.question_text,
                        question_type:        q.question_type,
                        response_options:     q.response_options,
                        fail_section:         q.fail_section || false,
                        critical:             q.critical || false,
                        scorable:             q.scorable !== false,
                        enabled:              q.enabled !== false,
                        evidence_source:      q.evidence_source || null,
                        max_score:            q.max_score,
                        weight:               q.weight,
                        ai_instructions:      q.ai_instructions,
                        created_by:           data.created_by,
                        updated_by:           data.updated_by,
                    });
                });
            }

            // Step 3: Build sections — questions[] now stores the NEW question_ids,
            // remapped from the source section's (old) question_ids via questionIdToNewId.
            const newSections = source.sections.map((section) => {
                const mapped = sectionIdMap[section.section_lineage_id];
                return {
                    section_id:         mapped.section_id,
                    section_lineage_id: mapped.section_lineage_id,
                    name:               section.name,
                    sequence:           section.sequence,
                    weighting:          section.weighting,
                    fail_section:       section.fail_section,
                    questions:          section.questions.map((qid) => questionIdToNewId[qid]).filter(Boolean),
                };
            });

            const newScorecard = {
                scorecard_id:        newScorecardId,
                lineage_id:          source.lineage_id,
                version:             latestVersion + 1,
                name:                source.name,
                description:         source.description,
                channels:            source.channels || [],
                state:               source.state || null,
                scoring:             source.scoring || null,
                status:              "DRAFT",
                origin:              "CLONED",
                fail_scorecard:      source.fail_scorecard || false,
                sections:            newSections,
                total_sections:      source.total_sections,
                total_questions:     source.total_questions,
                content_updated_at:  source.content_updated_at || null,
                source_scorecard_id: source.scorecard_id,
                source_lineage_id:   source.lineage_id,
                created_by:          data.created_by,
                updated_by:          data.updated_by,
            };

            // Atomically create the new scorecard and clone all question docs together
            const { connection, session } = await this.mongoose.create_record_ws(
                DB.scorecards, url, scorecardModel, REQ_TYPE, newScorecard
            );
            try {
                if (newQuestionDocs.length > 0) {
                    const questionModel = connection.models[DB.scorecard_questions] ||
                        connection.model(DB.scorecard_questions, questionsModel);
                    await questionModel.insertMany(newQuestionDocs, { session });
                }
                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }

            return { result: { scorecard_id: newScorecardId, version: latestVersion + 1 } };
        } catch (error) {
            throw error;
        }
    }

    async disableScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const query = { scorecard_id: data.scorecard_id, status: "PUBLISHED" };
            const values = {
                $set: {
                    status: "DISABLED",
                    disabled_at: new Date(),
                    disabled_by: data.disabled_by,
                    updated_by: data.updated_by,
                },
            };
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, values
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async enableScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            // Only a DISABLED scorecard can be re-enabled — it goes back to PUBLISHED
            const query = { scorecard_id: data.scorecard_id, status: "DISABLED" };
            const values = {
                $set: {
                    status: "PUBLISHED",
                    enabled_at: new Date(),
                    enabled_by: data.enabled_by,
                    updated_by: data.enabled_by,
                },
            };
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, values
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async archiveScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const query = { scorecard_id: data.scorecard_id };
            const values = {
                $set: {
                    status: "ARCHIVED",
                    archived_at: new Date(),
                    archived_by: data.archived_by,
                    updated_by: data.updated_by,
                },
            };
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, values
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async addSection(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const sectionId = COMMONUTIL.generateUniqueId();
            const sectionLineageId = COMMONUTIL.generateUniqueId();
            const newSection = {
                section_id: sectionId,
                section_lineage_id: sectionLineageId,
                name: data.name,
                sequence: data.sequence,
                weighting: data.weighting,
                fail_section: data.fail_section || false,
                questions: [],
            };
            const query = { scorecard_id: data.scorecard_id, status: "DRAFT" };
            const values = {
                $push: { sections: newSection },
                $inc: { total_sections: 1 },
                $set: { updated_by: data.updated_by, content_updated_at: new Date() },
            };
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, values
            );
            return { result: { ...result.result, section_id: sectionId, section_lineage_id: sectionLineageId } };
        } catch (error) {
            throw error;
        }
    }

    async updateSection(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const query = {
                scorecard_id: data.scorecard_id,
                status: "DRAFT",
                "sections.section_id": data.section_id,
            };
            const setFields = { updated_by: data.updated_by, content_updated_at: new Date() };
            if (data.name !== undefined) setFields["sections.$.name"] = data.name;
            if (data.sequence !== undefined) setFields["sections.$.sequence"] = data.sequence;
            if (data.weighting !== undefined) setFields["sections.$.weighting"] = data.weighting;
            if (data.fail_section !== undefined) setFields["sections.$.fail_section"] = data.fail_section;
            const result = await this.mongoose.update_record(
                DB.scorecards, url, collectionModel, REQ_TYPE, query, { $set: setFields }
            );
            if (result?.result?.matchedCount === 0) {
                throw new Error(`Section not found: ${data.section_id}`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeSection(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // Read section question count before starting the transaction
            const scorecardResult = await this.mongoose.find_single_record(
                DB.scorecards, url, scorecardModel, REQ_TYPE,
                { scorecard_id: data.scorecard_id, status: "DRAFT" }, null, null
            );
            const scorecard = scorecardResult.result;
            if (!scorecard) throw new Error("Scorecard not found or not in DRAFT state");

            const section = scorecard.sections.find((s) => s.section_id === data.section_id);
            const questionCount = section ? section.questions.length : 0;

            // Atomically delete questions and pull section from scorecard
            const { connection, session } = await this.mongoose.delete_many_record_ws(
                DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                { scorecard_id: data.scorecard_id, section_id: data.section_id }
            );
            let result;
            try {
                const scorecardModel2 = connection.models[DB.scorecards] ||
                    connection.model(DB.scorecards, scorecardModel);
                result = await scorecardModel2.updateOne(
                    { scorecard_id: data.scorecard_id, status: "DRAFT" },
                    {
                        $pull: { sections: { section_id: data.section_id } },
                        $inc: { total_sections: -1, total_questions: -questionCount },
                        $set: { updated_by: data.updated_by, content_updated_at: new Date() },
                    },
                    { session }
                );
                if (result.matchedCount === 0) throw new Error("Scorecard not found or not in DRAFT state");
                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }
            return { result };
        } catch (error) {
            throw error;
        }
    }

    async addQuestion(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

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

            // Atomically create the question doc and link it to the section
            const { connection, session } = await this.mongoose.create_record_ws(
                DB.scorecard_questions, url, questionsModel, REQ_TYPE, questionDoc
            );
            try {
                const scorecardModel2 = connection.models[DB.scorecards] ||
                    connection.model(DB.scorecards, scorecardModel);
                const addResult = await scorecardModel2.updateOne(
                    { scorecard_id: data.scorecard_id, status: "DRAFT", "sections.section_id": data.section_id },
                    // $addToSet prevents the same question_id being pushed twice (e.g. double-save race).
                    { $addToSet: { "sections.$.questions": questionId }, $inc: { total_questions: 1 }, $set: { updated_by: data.updated_by, content_updated_at: new Date() } },
                    { session }
                );
                if (addResult.matchedCount === 0) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");
                await session.commitTransaction();
            } catch (err) {
                console.log(err);
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }

            return { result: { question_id: questionDoc.question_id, question_lineage_id: questionDoc.question_lineage_id } };
        } catch (error) {
            throw error;
        }
    }

    async updateQuestion(data) {
        try {
            const url = this.getCustomerDbUrl();
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);

            // Unlike updateScorecard/updateSection/addSection/etc (which require the
            // parent scorecard to be status DRAFT), this only blocks PUBLISHED —
            // DISABLED/ARCHIVED scorecards' questions may still be edited directly.
            // Deliberate, narrower rule; not an oversight.
            //
            // data.scorecard_id is NOT reliably present (the question-reorder call
            // site sends only {question_id, sequence, updated_by}), so look up the
            // question's own scorecard_id from its existing document instead of
            // trusting an optional client-supplied field.
            const existingQuestion = await this.mongoose.find_single_record(
                DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                { question_id: data.question_id }, null, null
            );
            if (!existingQuestion.result) {
                throw new Error(`Question not found: ${data.question_id}`);
            }
            const parentScorecardId = existingQuestion.result.scorecard_id;
            if (parentScorecardId) {
                const parent = await this.mongoose.find_single_record(
                    DB.scorecards, url, scorecardModel, REQ_TYPE,
                    { scorecard_id: parentScorecardId }, null, null
                );
                if (parent.result && parent.result.status === "PUBLISHED") {
                    throw new Error("Cannot edit a question on a published scorecard. Create a draft first.");
                }
            }

            const query = { question_id: data.question_id };
            // Strip immutable identity fields — only allow content edits
            const {
                question_id, question_lineage_id, version,
                scorecard_id, scorecard_lineage_id,
                section_id, section_lineage_id,
                created_by, created_at, updated_at,
                ...updatableFields
            } = data;
            const result = await this.mongoose.update_record(
                DB.scorecard_questions, url, questionsModel, REQ_TYPE, query, { $set: updatableFields }
            );
            if (result?.result?.matchedCount === 0) {
                throw new Error(`Question not found: ${data.question_id}`);
            }
            // Touch scorecard content timestamp so caches know the card changed
            if (data.scorecard_id) {
                await this.mongoose.update_record(
                    DB.scorecards, url, scorecardModel, REQ_TYPE,
                    { scorecard_id: data.scorecard_id },
                    { $set: { content_updated_at: new Date() } }
                );
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeQuestion(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // Atomically delete the question doc and unlink it from the section
            const { connection, session } = await this.mongoose.delete_record_ws(
                DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                { question_id: data.question_id }
            );
            let result;
            try {
                const scorecardModel2 = connection.models[DB.scorecards] ||
                    connection.model(DB.scorecards, scorecardModel);
                result = await scorecardModel2.updateOne(
                    { scorecard_id: data.scorecard_id, status: "DRAFT", "sections.section_id": data.section_id },
                    { $pull: { "sections.$.questions": data.question_id }, $inc: { total_questions: -1 }, $set: { updated_by: data.updated_by, content_updated_at: new Date() } },
                    { session }
                );
                if (result.matchedCount === 0) throw new Error("Scorecard section not found or scorecard is not in DRAFT state");
                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }
            return { result };
        } catch (error) {
            throw error;
        }
    }
    async deleteScorecard(data) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // Only DRAFT scorecards can be hard-deleted
            const existing = await this.mongoose.find_single_record(
                DB.scorecards, url, scorecardModel, REQ_TYPE,
                { scorecard_id: data.scorecard_id }, null, null
            );
            if (!existing.result) throw new Error("Scorecard not found");
            if (existing.result.status !== "DRAFT")
                throw new Error("Only DRAFT scorecards can be deleted. Use /archive to retire a published scorecard.");

            // Atomically delete scorecard + all its question docs
            const { connection, session } = await this.mongoose.delete_record_ws(
                DB.scorecards, url, scorecardModel, REQ_TYPE,
                { scorecard_id: data.scorecard_id, status: "DRAFT" }
            );
            try {
                const questionsModel2 = connection.models[DB.scorecard_questions] ||
                    connection.model(DB.scorecard_questions, questionsModel);
                await questionsModel2.deleteMany({ scorecard_id: data.scorecard_id }, { session });
                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }

            return { result: { scorecard_id: data.scorecard_id } };
        } catch (error) {
            throw error;
        }
    }

    _validateImportPayload(data) {
        const VALID_CHANNELS = ["INBOUND_CALL", "OUTBOUND_CALL", "CHAT", "TICKET", "AGENT_ASSIST"];
        const VALID_QUESTION_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO", "NUMERIC", "TEXT"];
        const SELECT_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO"];

        // Stage 1 — Top-level structure
        if (!data.scorecard)                         throw new Error("Missing 'scorecard' in payload");
        if (!data.questions)                         throw new Error("Missing 'questions' in payload");
        if (!Array.isArray(data.scorecard.sections)) throw new Error("'scorecard.sections' must be an array");
        if (!Array.isArray(data.questions))          throw new Error("'questions' must be an array");
        if (!data.created_by)                        throw new Error("'created_by' is required");
        if (!data.updated_by)                        throw new Error("'updated_by' is required");

        // Stage 2 — Scorecard-level fields
        if (!data.scorecard.name?.trim())   throw new Error("Scorecard 'name' is required");
        if (!Array.isArray(data.scorecard.channels) || data.scorecard.channels.length === 0)
            throw new Error("Scorecard 'channels' must be a non-empty array");
        const invalidChannels = data.scorecard.channels.filter(c => !VALID_CHANNELS.includes(c));
        if (invalidChannels.length)
            throw new Error(`Invalid channels: ${invalidChannels.join(", ")}. Must be one of: ${VALID_CHANNELS.join(", ")}`);

        // Stage 3 — Sections
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

        // Stage 4 — Questions
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

            // Stage 6 — response_options for select-type questions
            if (SELECT_TYPES.includes(q.question_type)) {
                if (!Array.isArray(q.response_options) || q.response_options.length === 0)
                    throw new Error(`Question[${i}]: 'response_options' is required for type '${q.question_type}'`);
                q.response_options.forEach((opt, j) => {
                    if (!opt.label?.trim())
                        throw new Error(`Question[${i}].response_options[${j}]: 'label' is required`);
                    if (!opt.value?.trim())
                        throw new Error(`Question[${i}].response_options[${j}]: 'value' is required`);
                    // points can be null for unscored options (NA, CANNOT_DETERMINE) — only reject undefined
                    if (opt.points === undefined)
                        throw new Error(`Question[${i}].response_options[${j}]: 'points' is required (use null for unscored options)`);
                });
            }
        });

        // Stage 5 — Cross-reference integrity
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
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            const [scorecardResult, questionsResult] = await Promise.all([
                this.mongoose.find_single_record(
                    DB.scorecards, url, scorecardModel, REQ_TYPE,
                    { scorecard_id }, null, null
                ),
                this.mongoose.find_sorted_record(
                    DB.scorecard_questions, url, questionsModel, REQ_TYPE,
                    { scorecard_id }, { sequence: 1 }
                ),
            ]);

            const scorecard = scorecardResult.result;
            if (!scorecard) throw new Error("Scorecard not found");

            // Build question_id → question_lineage_id reverse map so that
            // section.questions[] (which now stores question_id) is exported
            // as question_lineage_id strings — keeping the export format portable.
            const qIdToLineageId = {};
            for (const q of questionsResult.result || []) {
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
                    // Translate question_ids back to question_lineage_ids for portability.
                    // For old (pre-migration) records that already store lineage_ids,
                    // qIdToLineageId[ref] will be undefined, so we fall back to ref itself.
                    questions:  s.questions.map((ref) => qIdToLineageId[ref] || ref),
                })),
            };

            const exportedQuestions = (questionsResult.result || []).map((q) => ({
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
            // Validate payload before any ID generation or DB calls
            this._validateImportPayload(data);

            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);

            // New top-level IDs — fully independent from source
            const newScorecardId      = COMMONUTIL.generateUniqueId();
            const newScorecardLineageId = COMMONUTIL.generateUniqueId();

            // Build section ID map: old section_lineage_id → new section_id + new section_lineage_id
            const sectionLineageMap = {};
            data.scorecard.sections.forEach((section) => {
                sectionLineageMap[section.section_lineage_id] = {
                    section_id:         COMMONUTIL.generateUniqueId(),
                    section_lineage_id: COMMONUTIL.generateUniqueId(),
                };
            });

            // Step 1: Generate new question_ids upfront — map old_lineage_id → new question_id
            // sections.questions[] will store these new question_ids (not lineage_ids)
            const questionLineageToNewId = {};
            data.questions.forEach((q) => {
                questionLineageToNewId[q.question_lineage_id] = COMMONUTIL.generateUniqueId();
            });

            // Step 2: Build new sections — questions[] uses new question_ids
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

            // Step 3: Build new question docs using the pre-generated question_ids
            const newQuestionDocs = data.questions.map((q) => {
                const owningSection = sectionLineageMap[q.section_lineage_id];
                return {
                    question_id:          questionLineageToNewId[q.question_lineage_id],
                    question_lineage_id:  COMMONUTIL.generateUniqueId(), // fresh lineage for this new import
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

            // Build new scorecard doc
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
                sections:            newSections,
                total_sections:      newSections.length,
                total_questions:     newQuestionDocs.length,
                source_scorecard_id: data.source_info?.scorecard_id || null,
                source_lineage_id:   data.source_info?.lineage_id   || null,
                created_by:          data.created_by,
                updated_by:          data.updated_by,
            };

            // Atomic transaction: create scorecard + insertMany questions
            const { connection, session } = await this.mongoose.create_record_ws(
                DB.scorecards, url, scorecardModel, REQ_TYPE, newScorecard
            );
            try {
                if (newQuestionDocs.length > 0) {
                    const questionsModel2 = connection.models[DB.scorecard_questions] ||
                        connection.model(DB.scorecard_questions, questionsModel);
                    await questionsModel2.insertMany(newQuestionDocs, { session });
                }
                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }

            return {
                result: {
                    scorecard_id: newScorecardId,
                    lineage_id:   newScorecardLineageId,
                },
            };

        } catch (error) {
            throw error;
        }
    }

    async createAuditLog(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_audit_logs);
            const result = await this.mongoose.create_record(
                DB.scorecard_audit_logs, url, collectionModel, REQ_TYPE, data
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getAuditLogByScorecardId(data) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_audit_logs);
            const result = await this.mongoose.find_sorted_record(
                DB.scorecard_audit_logs, url, collectionModel, REQ_TYPE,
                { scorecard_id: data.scorecard_id }, { created_at: -1 }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Public entry point for POST /validate — returns { errors, warnings } without side effects.
    async validateScorecard(scorecard_id) {
        try {
            const url = this.getCustomerDbUrl();
            const scorecardModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecards);
            const questionsModel = COMMONUTIL.getCustomerMongooseCollection(DB.scorecard_questions);
            const [scResult, qResult] = await Promise.all([
                this.mongoose.find_single_record(DB.scorecards, url, scorecardModel, REQ_TYPE, { scorecard_id }, null, null),
                this.mongoose.find_sorted_record(DB.scorecard_questions, url, questionsModel, REQ_TYPE, { scorecard_id }, { sequence: 1 }),
            ]);
            if (!scResult.result) throw new Error("Scorecard not found");
            return { result: this._validateForPublish(scResult.result, qResult.result || []) };
        } catch (error) {
            throw error;
        }
    }

    // Pure validation — no DB writes. Returns { errors: [], warnings: [] }.
    // errors block publish; warnings are shown to the author.
    _validateForPublish(scorecard, questions) {
        const errors = [];
        const warnings = [];
        const SELECT_TYPES = ["SINGLE_SELECT", "MULTI_SELECT", "YES_NO"];

        for (const q of questions) {
            if (!q.enabled) continue; // disabled questions are not scored

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

                // Check for duplicate option values within the question
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
