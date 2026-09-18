-- Control plane schema (common_db)
-- Tracks tenants, user-to-tenant mapping, and provisioning jobs

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tenants (
    tenant_id     VARCHAR(64)   PRIMARY KEY,
    display_name  VARCHAR(255)  NOT NULL,
    db_name       VARCHAR(255)  UNIQUE NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_by    VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants (status);

CREATE TABLE IF NOT EXISTS users (
    user_id       VARCHAR(255)  PRIMARY KEY,
    email         VARCHAR(255)  UNIQUE NOT NULL,
    tenant_id     VARCHAR(64)   NOT NULL REFERENCES tenants (tenant_id),
    role          VARCHAR(50)   NOT NULL DEFAULT 'tenant_admin',
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users (tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS provisioning_jobs (
    job_id        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     VARCHAR(64)   NOT NULL REFERENCES tenants (tenant_id),
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    step          VARCHAR(100),
    error         TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    completed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_provisioning_jobs_tenant ON provisioning_jobs (tenant_id);
