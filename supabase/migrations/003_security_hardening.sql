-- ============================================================================
-- MIGRATION 003: Security Hardening
-- Fixes Supabase security linter warnings:
--   0011 function_search_path_mutable  (5 functions)
--   0024 rls_policy_always_true        (auth_audit_log INSERT policy)
-- NOTE: Leaked password protection (HaveIBeenPwned) must be enabled
--       in the Supabase Dashboard → Authentication → Password Security.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Pin search_path on all public functions to prevent search-path injection.
--    Setting search_path = '' forces fully-qualified name resolution; combined
--    with SECURITY DEFINER this prevents a malicious user from placing a shadow
--    object earlier in the path. We pin to 'pg_catalog, public' so existing
--    unqualified table/type references continue to resolve correctly.
-- ----------------------------------------------------------------------------

ALTER FUNCTION public.update_updated_at()
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.validate_user_status_transition()
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.log_user_change()
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.cleanup_expired_sessions()
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.handle_new_user()
  SET search_path = pg_catalog, public;

-- ----------------------------------------------------------------------------
-- 2. Restrict the audit_append_only INSERT policy so only authenticated users
--    (i.e. requests carrying a valid JWT) can write to auth_audit_log.
--    WITH CHECK (true) granted unrestricted insert access; requiring
--    auth.uid() IS NOT NULL closes anonymous/anon-key abuse while still
--    allowing any logged-in role (service_role, authenticated) to append rows.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS audit_append_only ON public.auth_audit_log;

CREATE POLICY audit_append_only ON public.auth_audit_log
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
