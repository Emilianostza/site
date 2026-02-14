# Auth Fix: Mock → Real Supabase Auth

## What's in this package

```
fixes/
├── APPLY_FIXES.sh                                          # Auto-apply script
├── README_FIXES.md                                         # This file
├── src/services/api/auth.ts                                # Fixed auth service
└── supabase/migrations/002_user_profiles_and_memberships.sql  # New migration
```

## Fix 1: Migration — `002_user_profiles_and_memberships.sql`

**Problem:** `realLogin()` and `realGetCurrentUser()` query `supabase.from('user_profiles')`, but migration 001 only created a `users` table. The `user_org_memberships` table also didn't exist.

**What this creates:**

- `user_profiles` table — linked 1:1 to Supabase's `auth.users` via foreign key
- `user_org_memberships` table — maps users to orgs with roles (multi-org ready)
- `handle_new_user()` trigger — auto-creates a profile row when someone signs up
- RLS policies — users can only read/update their own profile
- Indexes for performance

**Where it goes:** `supabase/migrations/002_user_profiles_and_memberships.sql`

---

## Fix 2: Auth service — `auth.ts`

**Problem:** `realLogin()` and `realGetCurrentUser()` hardcoded every user's role as `customer_owner`:

```ts
// BEFORE (broken)
role: {
  type: 'customer_owner' as const,
  orgId: profileData.org_id || '',
  customerId: profileData.org_id || '',
},
```

**Fix:** New `buildRoleFromProfile()` helper reads the actual role from the database and constructs the correct typed role object:

```ts
// AFTER (fixed)
role: buildRoleFromProfile(profileData),
```

This correctly maps all 7 role types (admin, approver, technician, sales_lead, customer_owner, customer_viewer, public_visitor) with their specific fields.

**Where it goes:** `src/services/api/auth.ts` (replaces existing file)

---

## How to apply

### Option A: Run the script

```bash
# From your repo root:
bash /path/to/fixes/APPLY_FIXES.sh
```

### Option B: Manual copy-paste

```bash
cd site
git checkout main && git pull
git checkout -b fix/real-supabase-auth

# Copy the two files:
cp fixes/supabase/migrations/002_user_profiles_and_memberships.sql supabase/migrations/
cp fixes/src/services/api/auth.ts src/services/api/auth.ts

# Commit and push:
git add -A
git commit -m "fix: transition to real Supabase auth"
git push origin fix/real-supabase-auth
```

Then merge the PR on GitHub.

---

## Post-code setup (Supabase Dashboard)

### 1. Run the migration

- Go to **Supabase Dashboard → SQL Editor**
- Paste and run `002_user_profiles_and_memberships.sql`

### 2. Create auth users

- Go to **Authentication → Users → Add User**
- Create users with email/password:

| Email                    | Role (update in user_profiles after) |
| ------------------------ | ------------------------------------ |
| `admin@company.com`      | admin                                |
| `tech@company.com`       | technician                           |
| `client@bistro.com`      | customer_owner                       |
| `emilianostza@gmail.com` | admin                                |

### 3. Update profiles with correct roles

After creating users, their UUIDs will be visible in the Auth dashboard. Run this SQL for each user:

```sql
-- Example: set admin role for admin@company.com
UPDATE user_profiles
SET role = 'admin',
    org_id = '00000000-0000-0000-0000-000000000001',  -- your org UUID
    name = 'Admin User',
    status = 'active'
WHERE id = '<paste-auth-user-uuid-here>';
```

### 4. Set Netlify env vars

In **Netlify → Site Settings → Build & Deploy → Environment Variables**:

| Variable                 | Value                                     |
| ------------------------ | ----------------------------------------- |
| `VITE_USE_MOCK_DATA`     | `false`                                   |
| `VITE_SUPABASE_URL`      | `https://your-project.supabase.co`        |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (from Supabase → Settings → API) |

### 5. Redeploy

Push any change or trigger a manual deploy in Netlify. The app will now use real Supabase auth.

---

## Testing

1. Go to your deployed site
2. Try logging in with one of the users you created in Supabase
3. Verify the dashboard shows the correct role (admin sees admin tools, customer sees customer portal)
4. Test logout and session restoration (refresh the page while logged in)
