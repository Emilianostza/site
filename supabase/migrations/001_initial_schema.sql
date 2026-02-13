-- ============================================================================
-- PHASE 2: Authentication & Role Enforcement - Database Schema
-- Multi-tenant, org-scoped, GDPR-compliant, auditable
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- ISO 3166-1 alpha-2 country codes (expand as needed)
CREATE TYPE country_code AS ENUM (
  'ee',  -- Estonia
  'gr',  -- Greece
  'fr',  -- France
  'us',  -- United States
  'gb'   -- United Kingdom
);

-- Geographic regions for GDPR compliance
CREATE TYPE region AS ENUM (
  'eu',    -- European Union
  'na',    -- North America
  'apac'   -- Asia-Pacific
);

-- User roles (simple enum, complex role structure in types.ts)
CREATE TYPE user_role AS ENUM (
  'admin',
  'approver',
  'technician',
  'sales_lead',
  'customer_owner',
  'customer_viewer',
  'public_visitor'
);

-- User status lifecycle state machine
CREATE TYPE user_status AS ENUM (
  'invited',      -- User invited, pending activation
  'active',       -- User active, can log in
  'suspended',    -- Temporarily disabled (can be reactivated)
  'deactivated'   -- Permanently disabled (terminal state)
);

-- Auth audit log actions
CREATE TYPE auth_action AS ENUM (
  'user_invited',
  'user_activated',
  'user_logged_in',
  'user_logged_out',
  'user_suspended',
  'user_deactivated',
  'password_changed',
  'token_refreshed',
  'login_failed',
  'password_reset_requested',
  'password_reset_completed',
  'mfa_enabled',
  'mfa_disabled'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations (multi-tenant root entity)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,  -- URL-safe identifier
  country_code country_code NOT NULL,
  region region NOT NULL,

  -- GDPR compliance
  gdpr_consent BOOLEAN DEFAULT FALSE,
  data_retention_days INTEGER DEFAULT 365,  -- Data retention policy

  -- Contact
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_retention CHECK (data_retention_days >= 30 AND data_retention_days <= 3650)
);

-- Users (org-scoped, state-machine managed)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Identity
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),  -- NULL if using SSO/OAuth

  -- Role & Status
  role user_role NOT NULL DEFAULT 'public_visitor',
  status user_status NOT NULL DEFAULT 'invited',

  -- Optional foreign keys
  customer_id UUID,  -- If role is customer_owner/customer_viewer

  -- Security
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,

  -- Invitation
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  UNIQUE (org_id, email),
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CHECK (failed_login_attempts >= 0)
);

-- Auth sessions (JWT refresh tokens)
CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Token
  refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
  access_token_jti VARCHAR(255),  -- JWT ID for revocation

  -- Session metadata
  ip_address INET,
  user_agent TEXT,
  device_name VARCHAR(255),

  -- Expiry
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),

  -- Revocation
  revoked_at TIMESTAMPTZ,
  revoked_reason VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CHECK (expires_at > created_at)
);

-- Auth audit log (immutable, append-only)
CREATE TABLE auth_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Event
  action auth_action NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Actor context
  actor_email VARCHAR(255),
  actor_role user_role,

  -- Request context
  ip_address INET,
  user_agent TEXT,

  -- Payload (flexible JSONB for action-specific data)
  metadata JSONB DEFAULT '{}',

  -- Result
  success BOOLEAN NOT NULL,
  error_message TEXT
);

-- ============================================================================
-- INDEXES (Performance for org-scoped queries)
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_country ON organizations(country_code);
CREATE INDEX idx_organizations_region ON organizations(region);

-- Users (critical for auth queries)
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_email ON users(org_id, email);  -- Composite for login
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_customer_id ON users(customer_id) WHERE customer_id IS NOT NULL;

-- Sessions (critical for token validation)
CREATE INDEX idx_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_sessions_org_id ON auth_sessions(org_id);
CREATE INDEX idx_sessions_refresh_token ON auth_sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires_at ON auth_sessions(expires_at);
CREATE INDEX idx_sessions_revoked ON auth_sessions(revoked_at) WHERE revoked_at IS NULL;

-- Audit log (critical for compliance queries)
CREATE INDEX idx_audit_org_id ON auth_audit_log(org_id);
CREATE INDEX idx_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON auth_audit_log(timestamp DESC);
CREATE INDEX idx_audit_action ON auth_audit_log(action);
CREATE INDEX idx_audit_org_timestamp ON auth_audit_log(org_id, timestamp DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Org-scoped access
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
-- Users can only see users in their org
CREATE POLICY users_org_scoped ON users
  FOR SELECT
  USING (org_id = current_setting('app.current_org_id')::uuid);

-- Admins can insert/update/delete users in their org
CREATE POLICY users_admin_write ON users
  FOR ALL
  USING (
    org_id = current_setting('app.current_org_id')::uuid
    AND current_setting('app.current_user_role') = 'admin'
  );

-- RLS Policies for Sessions
-- Users can only see their own sessions
CREATE POLICY sessions_own_access ON auth_sessions
  FOR SELECT
  USING (
    user_id = current_setting('app.current_user_id')::uuid
    AND org_id = current_setting('app.current_org_id')::uuid
  );

-- RLS Policies for Audit Log
-- Admins can see all org audit logs
CREATE POLICY audit_admin_read ON auth_audit_log
  FOR SELECT
  USING (
    org_id = current_setting('app.current_org_id')::uuid
    AND current_setting('app.current_user_role') = 'admin'
  );

-- Audit log is append-only (no updates/deletes)
CREATE POLICY audit_append_only ON auth_audit_log
  FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Validate user status transitions (state machine enforcement)
CREATE OR REPLACE FUNCTION validate_user_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Enforce state machine transitions
  IF OLD.status = 'invited' AND NEW.status NOT IN ('active', 'deactivated') THEN
    RAISE EXCEPTION 'Invalid status transition: invited → %', NEW.status;
  ELSIF OLD.status = 'active' AND NEW.status NOT IN ('suspended', 'deactivated') THEN
    RAISE EXCEPTION 'Invalid status transition: active → %', NEW.status;
  ELSIF OLD.status = 'suspended' AND NEW.status NOT IN ('active', 'deactivated') THEN
    RAISE EXCEPTION 'Invalid status transition: suspended → %', NEW.status;
  ELSIF OLD.status = 'deactivated' THEN
    RAISE EXCEPTION 'Cannot transition from deactivated (terminal state)';
  END IF;

  -- Set activated_at timestamp when transitioning to active
  IF NEW.status = 'active' AND OLD.status = 'invited' THEN
    NEW.activated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_status_transition
  BEFORE UPDATE OF status ON users
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_user_status_transition();

-- Audit trail trigger (auto-log user changes)
CREATE OR REPLACE FUNCTION log_user_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes to audit trail
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO auth_audit_log (org_id, user_id, action, success, metadata)
    VALUES (
      NEW.org_id,
      NEW.id,
      CASE NEW.status
        WHEN 'active' THEN 'user_activated'::auth_action
        WHEN 'suspended' THEN 'user_suspended'::auth_action
        WHEN 'deactivated' THEN 'user_deactivated'::auth_action
        ELSE 'user_activated'::auth_action
      END,
      TRUE,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_by', current_setting('app.current_user_id', TRUE)
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit_trail
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_user_change();

-- Cleanup expired sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM auth_sessions
  WHERE expires_at < NOW()
    AND revoked_at IS NULL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Development Only)
-- ============================================================================

-- Seed organization
INSERT INTO organizations (id, name, slug, country_code, region, gdpr_consent)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Managed Capture Demo',
  'managed-capture-demo',
  'ee'::country_code,
  'eu'::region,
  TRUE
) ON CONFLICT DO NOTHING;

-- Seed admin user (password: "admin123" - change in production!)
INSERT INTO users (id, org_id, email, name, role, status, password_hash)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@company.com',
  'Admin User',
  'admin'::user_role,
  'active'::user_status,
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE organizations IS 'Multi-tenant root entity. All data scoped by org_id.';
COMMENT ON TABLE users IS 'User accounts with org membership, role, and state machine status.';
COMMENT ON TABLE auth_sessions IS 'JWT refresh tokens with revocation support.';
COMMENT ON TABLE auth_audit_log IS 'Immutable audit trail for all auth events (GDPR compliance).';

COMMENT ON COLUMN users.status IS 'State machine: invited → active → suspended → deactivated';
COMMENT ON COLUMN users.failed_login_attempts IS 'Incremented on failed login, reset on success. Lock account after 5 failures.';
COMMENT ON COLUMN organizations.data_retention_days IS 'GDPR data retention policy (days). Audit logs deleted after this period.';
