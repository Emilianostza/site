#!/bin/bash
# ============================================================================
# Fix: Transition from Mock Auth to Real Supabase Auth
# ============================================================================
#
# Run this script from your repo root: bash APPLY_FIXES.sh
#
# What it does:
#   1. Creates a new branch
#   2. Copies the migration file (user_profiles + user_org_memberships)
#   3. Replaces auth.ts (fixes hardcoded role bug)
#   4. Commits and pushes
#
# After running this script, you still need to:
#   - Run the migration SQL in Supabase Dashboard
#   - Create auth users in Supabase Dashboard
#   - Set env vars in Netlify
#   (See README_FIXES.md for details)
# ============================================================================

set -e  # Exit on any error

echo "🔧 Starting auth fix..."

# Check we're in the repo root
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this from the repo root (where package.json is)"
  exit 1
fi

# Step 1: Ensure we're on main and up to date
echo "📥 Pulling latest main..."
git checkout main
git pull origin main

# Step 2: Create fix branch
echo "🌿 Creating branch fix/real-supabase-auth..."
git checkout -b fix/real-supabase-auth

# Step 3: Copy migration file
echo "📄 Adding migration 002..."
cp "$(dirname "$0")/supabase/migrations/002_user_profiles_and_memberships.sql" \
   supabase/migrations/002_user_profiles_and_memberships.sql

# Step 4: Replace auth.ts
echo "📄 Replacing src/services/api/auth.ts..."
cp "$(dirname "$0")/src/services/api/auth.ts" \
   src/services/api/auth.ts

# Step 5: Commit
echo "📦 Committing changes..."
git add supabase/migrations/002_user_profiles_and_memberships.sql
git add src/services/api/auth.ts

git commit -m "fix: transition to real Supabase auth - create user_profiles table and fix hardcoded roles

- Add migration 002: creates user_profiles table linked to auth.users
- Add user_org_memberships table for multi-org support  
- Add auto-profile creation trigger on auth.users INSERT
- Enable RLS on both new tables
- Fix realLogin() and realGetCurrentUser() to read actual role from DB
- Extract buildRoleFromProfile() helper for role type mapping
- Remove hardcoded 'customer_owner' role assignment"

# Step 6: Push
echo "🚀 Pushing to origin..."
git push origin fix/real-supabase-auth

echo ""
echo "✅ Done! Code fixes pushed to branch: fix/real-supabase-auth"
echo ""
echo "Next steps:"
echo "  1. Go to GitHub and merge the PR (or: git checkout main && git merge fix/real-supabase-auth && git push)"
echo "  2. Run the migration SQL in Supabase Dashboard → SQL Editor"
echo "  3. Create auth users in Supabase Dashboard → Authentication → Users"
echo "  4. Set Netlify env vars: VITE_USE_MOCK_DATA=false, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"
echo ""
echo "See README_FIXES.md for full details."
