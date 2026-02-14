-- ============================================================================
-- MIGRATION 002: Create user_profiles view and user_org_memberships table
-- 
-- The frontend auth code (realLogin, realGetCurrentUser) queries:
--   supabase.from('user_profiles').select('*, user_org_memberships(*)')
--
-- But migration 001 only created a "users" table. This migration bridges
-- the gap so Supabase Auth (auth.users) works with our custom user data.
--
-- Strategy:
--   1. Create user_profiles table linked to auth.users(id)
--   2. Create user_org_memberships table for org-scoped roles
--   3. Auto-create a profile when a new auth.users row is inserted
--   4. Enable RLS on both tables
-- ============================================================================

-- ============================================================================
-- TABLE: user_profiles
-- Linked to Supabase's auth.users by ID (1:1 relationship)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'public_visitor',
  status user_status NOT NULL DEFAULT 'invited',
  customer_id UUID,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  failed_login_attempts INTEGER DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: user_org_memberships
-- Maps users to organizations with role context
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_org_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'public_visitor',
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_org_id ON user_profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_user_org_memberships_user_id ON user_org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_memberships_org_id ON user_org_memberships(org_id);

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_org_memberships ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY user_profiles_select_own ON user_profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (name, etc.)
CREATE POLICY user_profiles_update_own ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Service role (backend) can do anything
CREATE POLICY user_profiles_service_all ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own memberships
CREATE POLICY user_org_memberships_select_own ON user_org_memberships
  FOR SELECT USING (user_id = auth.uid());

-- Service role can do anything on memberships
CREATE POLICY user_org_memberships_service_all ON user_org_memberships
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- TRIGGER: Auto-create profile when a new user signs up via Supabase Auth
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, org_id, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    (NEW.raw_user_meta_data->>'org_id')::uuid,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer_owner'::user_role),
    'active'::user_status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- AUTO-UPDATE updated_at
-- ============================================================================
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_org_memberships_updated_at
  BEFORE UPDATE ON user_org_memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE user_profiles IS 'User profile data linked 1:1 with auth.users. Created automatically on signup.';
COMMENT ON TABLE user_org_memberships IS 'Maps users to organizations with role context. Supports multi-org membership.';
