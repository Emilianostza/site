/**
 * Supabase Connection Test Utility
 *
 * Use this to verify your Supabase configuration is working correctly.
 *
 * Run from browser console after app loads:
 * import { testSupabaseConnection } from '@/services/supabase/test-connection';
 * await testSupabaseConnection();
 */

import { supabase } from '@/services/supabase/client';

interface TestResult {
  name: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

/**
 * Run all connection tests
 */
export async function testSupabaseConnection() {
  console.log('%c🧪 Supabase Connection Test Suite', 'font-size: 16px; font-weight: bold;');
  console.log('================================\n');

  results.length = 0;

  // Test 1: Client initialization
  await testClientInitialization();

  // Test 2: Get session
  await testGetSession();

  // Test 3: Auth state
  await testAuthState();

  // Test 4: Database connectivity
  await testDatabaseConnectivity();

  // Test 5: User profiles table access
  await testUserProfilesAccess();

  // Test 6: Organizations table access
  await testOrgsAccess();

  // Test 7: Projects table access
  await testProjectsAccess();

  // Print summary
  printSummary();
}

/**
 * Test 1: Client initialization
 */
async function testClientInitialization() {
  const start = performance.now();

  try {
    const isInitialized = supabase !== undefined;

    if (!isInitialized) {
      throw new Error('Supabase client not initialized');
    }

    results.push({
      name: 'Client Initialization',
      status: 'success',
      message: 'Supabase client initialized successfully',
      duration: performance.now() - start,
    });
  } catch (error) {
    results.push({
      name: 'Client Initialization',
      status: 'failed',
      message: 'Failed to initialize Supabase client',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 2: Get session
 */
async function testGetSession() {
  const start = performance.now();

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(`Session error: ${error.message}`);
    }

    const hasSession = data?.session !== null;

    results.push({
      name: 'Get Session',
      status: hasSession ? 'success' : 'skipped',
      message: hasSession
        ? `Session found: ${data.session?.user?.email}`
        : 'No session (user not authenticated)',
      duration: performance.now() - start,
    });
  } catch (error) {
    results.push({
      name: 'Get Session',
      status: 'failed',
      message: 'Failed to get session',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 3: Auth state listener
 */
async function testAuthState() {
  const start = performance.now();

  try {
    let listenerCalled = false;

    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      listenerCalled = true;
      console.log(`  → Auth event: ${event}, session: ${session ? 'present' : 'none'}`);
    });

    // Give listener a moment to fire
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!subscription?.data) {
      throw new Error('Auth listener not created');
    }

    results.push({
      name: 'Auth State Listener',
      status: 'success',
      message: 'Auth state listener created successfully',
      duration: performance.now() - start,
    });

    // Cleanup
    if (subscription?.data && typeof (subscription.data as any)?.unsubscribe === 'function') {
      (subscription.data as any).unsubscribe();
    } else if ((subscription?.data as any)?.subscription?.unsubscribe) {
      (subscription.data as any).subscription.unsubscribe();
    }
  } catch (error) {
    results.push({
      name: 'Auth State Listener',
      status: 'failed',
      message: 'Failed to create auth listener',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 4: Database connectivity
 */
async function testDatabaseConnectivity() {
  const start = performance.now();

  try {
    // Try a simple query that doesn't depend on auth
    const { data, error } = await supabase
      .from('orgs')
      .select('count(*)', { count: 'exact' })
      .limit(0);

    if (error) {
      // 403 is expected if not authenticated, means DB is reachable
      if (error.code === '403') {
        results.push({
          name: 'Database Connectivity',
          status: 'success',
          message: 'Database reachable (RLS policies working)',
          duration: performance.now() - start,
        });
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } else {
      results.push({
        name: 'Database Connectivity',
        status: 'success',
        message: 'Database reachable and queryable',
        duration: performance.now() - start,
      });
    }
  } catch (error) {
    results.push({
      name: 'Database Connectivity',
      status: 'failed',
      message: 'Failed to connect to database',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 5: User profiles access
 */
async function testUserProfilesAccess() {
  const start = performance.now();

  try {
    const { data, error, count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error && error.code !== '403') {
      throw error;
    }

    results.push({
      name: 'User Profiles Table',
      status: error?.code === '403' ? 'skipped' : 'success',
      message:
        error?.code === '403'
          ? 'Table exists (RLS prevents access without auth)'
          : `Table accessible (${count || 0} records)`,
      duration: performance.now() - start,
    });
  } catch (error) {
    results.push({
      name: 'User Profiles Table',
      status: 'failed',
      message: 'Failed to query user_profiles',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 6: Organizations access
 */
async function testOrgsAccess() {
  const start = performance.now();

  try {
    const { data, error, count } = await supabase
      .from('orgs')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error && error.code !== '403') {
      throw error;
    }

    results.push({
      name: 'Organizations Table',
      status: error?.code === '403' ? 'skipped' : 'success',
      message:
        error?.code === '403'
          ? 'Table exists (RLS prevents access without auth)'
          : `Table accessible (${count || 0} records)`,
      duration: performance.now() - start,
    });
  } catch (error) {
    results.push({
      name: 'Organizations Table',
      status: 'failed',
      message: 'Failed to query orgs',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Test 7: Projects access
 */
async function testProjectsAccess() {
  const start = performance.now();

  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error && error.code !== '403') {
      throw error;
    }

    results.push({
      name: 'Projects Table',
      status: error?.code === '403' ? 'skipped' : 'success',
      message:
        error?.code === '403'
          ? 'Table exists (RLS prevents access without auth)'
          : `Table accessible (${count || 0} records)`,
      duration: performance.now() - start,
    });
  } catch (error) {
    results.push({
      name: 'Projects Table',
      status: 'failed',
      message: 'Failed to query projects',
      duration: performance.now() - start,
      error: String(error),
    });
  }
}

/**
 * Print test summary
 */
function printSummary() {
  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  console.log('\n📋 Test Results:');
  console.log('================\n');

  results.forEach((result) => {
    const icon = {
      success: '✅',
      failed: '❌',
      skipped: '⊘ ',
    }[result.status];

    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    console.log(`   ⏱️  ${result.duration.toFixed(2)}ms`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    console.log();
  });

  console.log('📊 Summary:');
  console.log(`  Successful: ${successful}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${results.length}`);

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check your Supabase configuration.');
  } else {
    console.log('\n✨ All tests passed! Supabase is ready to use.');
  }
}

/**
 * Export for use in development
 */
export const connectionTest = { run: testSupabaseConnection };
