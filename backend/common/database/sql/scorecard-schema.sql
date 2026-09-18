-- Scorecard PostgreSQL schema (2-table design, stable IDs across versions)
-- scorecards: header + embedded sections JSONB (question_id references)
-- scorecard_questions: full question documents per (scorecard_id, scorecard_version)

CREATE TABLE IF NOT EXISTS scorecards (
    scorecard_id        VARCHAR(64)  NOT NULL,
    lineage_id          VARCHAR(64)  NOT NULL,
    version             INTEGER      NOT NULL,
    name                VARCHAR(500) NOT NULL,
    description         TEXT,
    channels            TEXT[]       NOT NULL,
    status              VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    state               VARCHAR(100),
    scorecard_type      VARCHAR(100),
    fail_scorecard      BOOLEAN      NOT NULL DEFAULT FALSE,
    scoring             JSONB,
    sections            JSONB        NOT NULL DEFAULT '[]',
    total_sections      INTEGER      NOT NULL DEFAULT 0,
    total_questions     INTEGER      NOT NULL DEFAULT 0,
    content_updated_at  TIMESTAMPTZ,
    model_provider      VARCHAR(200),
    ai_model            VARCHAR(200),
    origin              VARCHAR(20)  NOT NULL DEFAULT 'CREATED',
    source_scorecard_id VARCHAR(64),
    source_lineage_id   VARCHAR(64),
    published_at        TIMESTAMPTZ,
    published_by        VARCHAR(255),
    disabled_at         TIMESTAMPTZ,
    disabled_by         VARCHAR(255),
    enabled_at          TIMESTAMPTZ,
    enabled_by          VARCHAR(255),
    archived_at         TIMESTAMPTZ,
    archived_by         VARCHAR(255),
    created_by          VARCHAR(255) NOT NULL,
    updated_by          VARCHAR(255) NOT NULL,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (scorecard_id, version)
);

CREATE INDEX IF NOT EXISTS idx_scorecards_id_version_desc ON scorecards (scorecard_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_scorecards_status ON scorecards (status);
CREATE INDEX IF NOT EXISTS idx_scorecards_channels ON scorecards USING GIN (channels);
CREATE UNIQUE INDEX IF NOT EXISTS idx_scorecards_one_draft_per_id
    ON scorecards (scorecard_id) WHERE status = 'DRAFT';

CREATE TABLE IF NOT EXISTS scorecard_questions (
    question_id           VARCHAR(64)  NOT NULL,
    question_lineage_id   VARCHAR(64)  NOT NULL,
    scorecard_id          VARCHAR(64)  NOT NULL,
    scorecard_version     INTEGER      NOT NULL,
    scorecard_lineage_id  VARCHAR(64)  NOT NULL,
    section_id            VARCHAR(64)  NOT NULL,
    section_lineage_id    VARCHAR(64)  NOT NULL,
    sequence              INTEGER      NOT NULL,
    version               INTEGER      NOT NULL DEFAULT 1,
    question_text         TEXT         NOT NULL,
    question_type         VARCHAR(50)  NOT NULL,
    response_options      JSONB        NOT NULL DEFAULT '[]',
    fail_section          BOOLEAN      NOT NULL DEFAULT FALSE,
    critical              BOOLEAN      NOT NULL DEFAULT FALSE,
    scorable              BOOLEAN      NOT NULL DEFAULT TRUE,
    enabled               BOOLEAN      NOT NULL DEFAULT TRUE,
    evidence_source       VARCHAR(100),
    max_score             NUMERIC,
    weight                NUMERIC(6,2) NOT NULL,
    ai_instructions       TEXT,
    created_by            VARCHAR(255) NOT NULL,
    updated_by            VARCHAR(255) NOT NULL,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (scorecard_id, scorecard_version, question_id),
    FOREIGN KEY (scorecard_id, scorecard_version)
        REFERENCES scorecards (scorecard_id, version) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_questions_scorecard_version_seq
    ON scorecard_questions (scorecard_id, scorecard_version, sequence);
CREATE INDEX IF NOT EXISTS idx_questions_question_id ON scorecard_questions (question_id);
CREATE INDEX IF NOT EXISTS idx_questions_lineage ON scorecard_questions (question_lineage_id);

CREATE TABLE IF NOT EXISTS scorecard_audit_logs (
    id                   SERIAL       PRIMARY KEY,
    scorecard_id         VARCHAR(64)  NOT NULL,
    scorecard_lineage_id VARCHAR(64)  NOT NULL,
    scorecard_version    INTEGER      NOT NULL,
    entity_type          VARCHAR(20)  NOT NULL,
    entity_id            VARCHAR(64),
    entity_lineage_id    VARCHAR(64),
    action               VARCHAR(50)  NOT NULL,
    before               JSONB,
    after                JSONB,
    actor_id             VARCHAR(255) NOT NULL,
    actor_email          VARCHAR(255) NOT NULL,
    ip_address           VARCHAR(45),
    metadata             JSONB,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_scorecard ON scorecard_audit_logs (scorecard_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_lineage ON scorecard_audit_logs (scorecard_lineage_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_scorecard_version
    ON scorecard_audit_logs (scorecard_id, scorecard_version, created_at DESC);

CREATE TABLE IF NOT EXISTS platform_dropdown_configs (
    id           VARCHAR(64)  PRIMARY KEY,
    module_name  VARCHAR(255) NOT NULL UNIQUE,
    dropdowns    JSONB        NOT NULL DEFAULT '[]',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dropdown_configs_module ON platform_dropdown_configs (module_name);
