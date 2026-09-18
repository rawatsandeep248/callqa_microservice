# Multi-Tenant Architecture Plan

**Service:** Call QA / QA Automation v2  
**Model:** Database-per-Tenant (shared RDS instance, same credentials, different DB names)  
**Last updated:** 2026-09-18

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     SAME RDS INSTANCE                         │
│                                                               │
│  ┌─────────────────┐   ┌──────────┐   ┌──────────┐          │
│  │   common_db      │   │tenant_abc│   │tenant_xyz│  ...     │
│  │                 │   │          │   │          │           │
│  │  tenants        │   │scorecards│   │scorecards│           │
│  │  users          │   │scorecard_│   │scorecard_│           │
│  │  provisioning_  │   │questions │   │questions │           │
│  │  jobs           │   │audit_logs│   │audit_logs│           │
│  └─────────────────┘   └──────────┘   └──────────┘          │
│         ↑                                                     │
│   Same creds for all DBs (only db_name differs)              │
└──────────────────────────────────────────────────────────────┘
                    ↑ connects via
┌──────────────────────────────────────────────────────────────┐
│                  callqa_microservice (Node.js)                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Tenant DB Pool Manager                             │    │
│  │  { tenant_abc → Pool(db: "callqa_tenant_abc") }     │    │
│  │  { tenant_xyz → Pool(db: "callqa_tenant_xyz") }     │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                    ↑ auth via
┌──────────────────────────────────────────────────────────────┐
│                     Keycloak                                  │
│  • super_admin realm / role                                   │
│  • tenant users with tenant_id custom attribute              │
└──────────────────────────────────────────────────────────────┘
```

---

## Common DB Schema

```sql
-- Tracks all tenants + their DB name on the shared RDS instance
CREATE TABLE tenants (
    tenant_id     VARCHAR(64)   PRIMARY KEY,       -- e.g. "tenant_orprd_cai"
    display_name  VARCHAR(255)  NOT NULL,
    db_name       VARCHAR(255)  UNIQUE NOT NULL,   -- e.g. "callqa_tenant_orprd_cai"
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
                  -- ACTIVE | SUSPENDED | DELETED
    created_by    VARCHAR(255)  NOT NULL,           -- super admin email
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Maps every user → their tenant
-- (source of truth for "which DB do I connect to?")
CREATE TABLE users (
    user_id       VARCHAR(255)  PRIMARY KEY,   -- Keycloak user ID
    email         VARCHAR(255)  UNIQUE NOT NULL,
    tenant_id     VARCHAR(64)   NOT NULL REFERENCES tenants(tenant_id),
    -- role          VARCHAR(50)   NOT NULL,      -- e.g. ADMIN, AGENT, QA_ANALYST
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Provisioning status tracking
CREATE TABLE provisioning_jobs (
    job_id        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     VARCHAR(64)   NOT NULL REFERENCES tenants(tenant_id),
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
                  -- PENDING | RUNNING | COMPLETED | FAILED
    step          VARCHAR(100),
    error         TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    completed_at  TIMESTAMPTZ
);
```

> No credential columns needed — same host/user/password for all DBs, only `db_name` differs.

---

## Full Flow

### 1. Super Admin Signup & Login

```
Super Admin Signup
      │
      ├─► Keycloak: create user with role = "super_admin"
      └─► common_db: record email (for audit)

Super Admin Login
      │
      ├─► Keycloak: authenticate → JWT with role = "super_admin"
      └─► Frontend: role = super_admin → redirect to Tenant Management screen
```

---

### 2. Tenant Creation (Super Admin action)

```
POST /admin/tenants  { tenant_id, display_name }
      │
      ├─► Step 1: INSERT INTO common_db.tenants (status = 'PENDING')
      │
      ├─► Step 2: CREATE DATABASE "callqa_<tenant_id>"
      │           (using same RDS creds, just new DB name)
      │
      ├─► Step 3: Connect to new DB → run scorecard-schema.sql
      │           (scorecards, scorecard_questions, audit_logs, dropdown_configs)
      │
      └─► Step 4: UPDATE common_db.tenants SET status = 'ACTIVE'
```

---

### 3. User Creation (Super Admin action)

```
POST /admin/tenants/:tenant_id/users  { email, role, name }
      │
      ├─► Keycloak API: create user
      │   + set custom attribute: tenant_id = "tenant_orprd_cai"
      │
      └─► common_db.users: INSERT { keycloak_user_id, email, tenant_id, role }
```

---

### 4. Normal User Login & API Calls

```
User Login
      │
      ├─► POST /authentication/keycloak-login
      │   Keycloak auth + common_db lookup in one response
      │   → user object includes tenant_id, is_super_admin, etc.
      │
      └─► Frontend stores in session:
              { token: "jwt...", tenant_id: "tenant_orprd_cai", role: "QA_ANALYST" }


Every subsequent API call
      │
      ├─► Headers: { Authorization: "Bearer <jwt>", X-Tenant-Id: "tenant_orprd_cai" }
      │
      ├─► Backend Middleware:
      │   1. Verify JWT (Keycloak public key)
      │   2. Read tenant_id from header
      │   3. Lookup/cache: Pool for db "callqa_tenant_orprd_cai"
      │   4. Attach pool to req.tenantDb
      │
      └─► Controller: uses req.tenantDb for all queries (scorecards, audit, etc.)
```

---

## Tenant DB Pool Manager

Since credentials are the same for all DBs, this is straightforward:

```js
// common/database/tenant-connection-manager.js

const { Pool } = require('pg');
const poolCache = new Map();  // tenant_id → Pool

const BASE_CONFIG = {
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  user:     process.env.DB_USER,      // same for all tenants
  password: process.env.DB_PASSWORD,  // same for all tenants
  ssl:      { rejectUnauthorized: true },
  max:      10,
  idleTimeoutMillis: 30000,
};

async function getPool(tenantId) {
  if (poolCache.has(tenantId)) {
    return poolCache.get(tenantId);
  }

  // Verify tenant is ACTIVE in common DB
  const { rows } = await commonPool.query(
    `SELECT db_name, status FROM tenants WHERE tenant_id = $1`,
    [tenantId]
  );

  if (!rows.length)                    throw new Error(`Tenant not found: ${tenantId}`);
  if (rows[0].status !== 'ACTIVE')     throw new Error(`Tenant is ${rows[0].status}`);

  // Create pool pointing to the tenant-specific DB name
  const pool = new Pool({ ...BASE_CONFIG, database: rows[0].db_name });

  pool.on('error', () => poolCache.delete(tenantId)); // auto-evict on error

  poolCache.set(tenantId, pool);
  return pool;
}
```

---

## Tenant Resolver Middleware

```js
// common/middlewares/tenant-resolver.js

async function tenantResolverMiddleware(req, res, next) {
  try {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
      return res.status(400).json({ error: 'X-Tenant-Id header is required' });
    }

    req.tenantDb = await getPool(tenantId);
    req.tenantId = tenantId;
    next();
  } catch (err) {
    next(err);
  }
}
```

### How repositories use it — no changes to queries needed:

```js
// scorecard-controller.js
async getScorecard(req, res) {
  const result = await scorecardRepo.getScorecard(req.tenantDb, req.params.id);
  res.json(result);
}

// scorecard-repository.js
async getScorecard(db, scorecardId) {
  const { rows } = await db.query(
    'SELECT * FROM scorecards WHERE scorecard_id = $1',
    [scorecardId]
  );
  return rows[0];
}
```

---

## Tenant Provisioning Service

```js
// microservice/admin/service/tenant-provisioning-service.js

async function provisionTenant({ tenantId, displayName, createdBy }) {
  const dbName = `callqa_${tenantId.replace(/-/g, '_')}`;

  // Step 1: Insert tenant record (PENDING)
  await commonPool.query(
    `INSERT INTO tenants (tenant_id, display_name, db_name, status, created_by)
     VALUES ($1, $2, $3, 'PENDING', $4)`,
    [tenantId, displayName, dbName, createdBy]
  );

  try {
    // Step 2: Create database
    await commonPool.query(`CREATE DATABASE "${dbName}"`);

    // Step 3: Connect to new DB and run schema
    const tenantPool = new Pool({ ...BASE_CONFIG, database: dbName });
    const schemaSql = fs.readFileSync('common/database/sql/scorecard-schema.sql', 'utf8');
    await tenantPool.query(schemaSql);
    await tenantPool.end();

    // Step 4: Mark ACTIVE
    await commonPool.query(
      `UPDATE tenants SET status = 'ACTIVE' WHERE tenant_id = $1`,
      [tenantId]
    );
  } catch (err) {
    await commonPool.query(
      `UPDATE tenants SET status = 'FAILED' WHERE tenant_id = $1`,
      [tenantId]
    );
    throw err;
  }
}
```

---

## Super Admin API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/tenants` | Create tenant (triggers DB creation + schema load) |
| GET | `/admin/tenants` | List all tenants + status |
| PATCH | `/admin/tenants/:id/suspend` | Suspend tenant |
| PATCH | `/admin/tenants/:id/activate` | Re-activate tenant |
| POST | `/admin/tenants/:id/users` | Create user (Keycloak + common_db) |
| GET | `/admin/tenants/:id/users` | List users for a tenant |

All super admin routes are protected by a separate JWT role check (`super_admin`).

---

## Folder Structure

```
callqa_microservice/backend/
│
├── common/
│   ├── database/
│   │   ├── common-pool.js                  ← Pool for common_db
│   │   ├── tenant-connection-manager.js    ← getPool(tenant_id) with Map cache
│   │   └── sql/
│   │       ├── common-schema.sql           ← tenants, users, provisioning_jobs
│   │       └── scorecard-schema.sql        ← loaded into each tenant DB on creation
│   │
│   └── middlewares/
│       ├── keycloak-auth.js                ← verify JWT (Keycloak public key)
│       └── tenant-resolver.js             ← tenant_id → req.tenantDb
│
├── microservice/
│   ├── admin/                              ← Super admin only
│   │   ├── routes/admin-route.js
│   │   ├── controller/
│   │   │   ├── tenant-controller.js        ← create/list/suspend tenants
│   │   │   └── user-controller.js          ← create users (Keycloak + common_db)
│   │   └── service/
│   │       └── tenant-provisioning-service.js  ← CREATE DB + run schema
│   │
│   └── analytics_and_reporting/            ← unchanged, just uses req.tenantDb
│       ├── routes/
│       ├── controller/
│       ├── service/
│       └── repository/
│
└── scripts/
    └── migrate-all-tenants.js              ← run on deploy to sync schema changes
```

---

## What Goes Where

| Data | Lives In |
|---|---|
| Tenant list + DB name | `common_db.tenants` |
| User → tenant mapping | `common_db.users` |
| Scorecards, questions | `callqa_<tenant_id>` DB |
| Audit logs | `callqa_<tenant_id>` DB |
| Dropdown configs | `callqa_<tenant_id>` DB |
| Auth / sessions | Keycloak |
| DB credentials | `.env` (same for all tenants) |

---

## Schema Migration on Deploy

When a new version adds DB changes, run this before the app starts:

```js
// scripts/migrate-all-tenants.js

async function migrateAllTenants() {
  const { rows } = await commonPool.query(
    `SELECT tenant_id FROM tenants WHERE status = 'ACTIVE'`
  );

  for (const { tenant_id } of rows) {
    const pool = await getPool(tenant_id);
    await runPendingMigrations(pool);
    console.log(`Migrated: ${tenant_id}`);
  }
}
```

> Add this as a pre-deploy step in your CI/CD pipeline.

---

## Environment Variables

```env
# Common for all DBs (same RDS instance)
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_USER=callqa_master
DB_PASSWORD=your_password
DB_SSL=true

# Control plane DB
COMMON_DB_NAME=callqa_common

# Keycloak
KEYCLOAK_URL=https://your-keycloak-domain
KEYCLOAK_REALM=callqa
KEYCLOAK_CLIENT_ID=callqa-backend
KEYCLOAK_CLIENT_SECRET=your_secret
```

---

## Setup Commands (implemented)

```bash
cd call_qa/callqa_microservice/backend

# 1. Create common_db + control-plane tables
npm run postgres:migrate-common

# 2. Create a tenant (via API after server start)
# POST /agentic/admin/api/v1/tenants

# 3. Apply schema updates to all active tenant DBs on deploy
npm run postgres:migrate-tenants
```

---

## Implemented API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/agentic/admin/api/v1/auth/me` | JWT | Returns tenant_id for normal users or super_admin flag |
| POST | `/agentic/admin/api/v1/tenants` | Super admin | Create tenant + provision DB |
| GET | `/agentic/admin/api/v1/tenants` | Super admin | List tenants |
| GET | `/agentic/admin/api/v1/tenants/:tenant_id` | Super admin | Tenant detail |
| PATCH | `/agentic/admin/api/v1/tenants/:tenant_id/suspend` | Super admin | Suspend tenant |
| PATCH | `/agentic/admin/api/v1/tenants/:tenant_id/activate` | Super admin | Activate tenant |
| GET | `/agentic/admin/api/v1/tenants/:tenant_id/provisioning` | Super admin | Provisioning job status |
| POST | `/agentic/admin/api/v1/tenants/:tenant_id/users` | Super admin | Create user (Keycloak + common_db) |
| GET | `/agentic/admin/api/v1/tenants/:tenant_id/users` | Super admin | List tenant users |

Scorecard APIs require `Authorization: Bearer <jwt>` and `X-Tenant-Id: <tenant_id>` header.
