/**
 * API Endpoint Integration Tests
 *
 * Test all Supabase REST API endpoints to verify backend integration.
 * Run after database migration is complete and test user exists.
 *
 * Prerequisites:
 * 1. Step 19 migration completed
 * 2. Test user created (test@example.com)
 * 3. Test org and membership created
 * 4. VITE_USE_MOCK_DATA=false in .env.local
 * 5. Dev server running: npm run dev
 *
 * Usage:
 * 1. Open browser console (F12)
 * 2. Paste and run: await testAPIEndpoints()
 * 3. Check results for any failures
 *
 * Expected: All tests pass or provide useful error messages
 */

import { supabase } from '@/services/supabase/client';
import { ProjectsProvider } from '@/services/dataProvider';
import { AssetsProvider } from '@/services/dataProvider';

interface APITestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration: number;
  data?: any;
  error?: string;
}

const results: APITestResult[] = [];
let testOrgId: string;
let testProjectId: string;
let testAssetId: string;

/**
 * Run complete API test suite
 */
export async function testAPIEndpoints() {
  console.clear();
  console.log('%c🧪 API ENDPOINT INTEGRATION TESTS', 'font-size: 18px; font-weight: bold; color: #3b82f6;');
  console.log('%c====================================', 'font-size: 14px; color: #6b7280;');
  console.log();

  results.length = 0;

  try {
    // Authentication
    console.log('%c🔑 Authentication Tests', 'font-size: 14px; font-weight: bold;');
    await testAuthentication();

    // Organizations
    console.log('\n%c🏢 Organization Tests', 'font-size: 14px; font-weight: bold;');
    await testOrganizationEndpoints();

    // Projects
    console.log('\n%c📋 Project Tests', 'font-size: 14px; font-weight: bold;');
    await testProjectEndpoints();

    // Assets
    console.log('\n%c📸 Asset Tests', 'font-size: 14px; font-weight: bold;');
    await testAssetEndpoints();

    // Workflows
    console.log('\n%c⚙️  Workflow Tests', 'font-size: 14px; font-weight: bold;');
    await testWorkflowEndpoints();

    // Pagination
    console.log('\n%c📄 Pagination Tests', 'font-size: 14px; font-weight: bold;');
    await testPaginationEndpoints();

    // Error Handling
    console.log('\n%c⚠️  Error Handling Tests', 'font-size: 14px; font-weight: bold;');
    await testErrorHandling();
  } catch (error) {
    console.error('Fatal error:', error);
  }

  // Print summary
  printAPITestSummary();
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthentication() {
  const start = performance.now();

  try {
    // Test sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });

    if (error) throw new Error(`Sign in failed: ${error.message}`);
    if (!data.session) throw new Error('No session returned');

    results.push({
      endpoint: '/auth/v1/token',
      method: 'POST',
      status: 'pass',
      message: `Authenticated as: ${data.user.email}`,
      duration: performance.now() - start,
      data: { userId: data.user.id }
    });
  } catch (error) {
    results.push({
      endpoint: '/auth/v1/token',
      method: 'POST',
      status: 'fail',
      message: 'Authentication failed',
      duration: performance.now() - start,
      error: String(error)
    });
  }
}

// ============================================================================
// ORGANIZATION TESTS
// ============================================================================

async function testOrganizationEndpoints() {
  const start = performance.now();

  try {
    // GET /orgs - List organizations
    const { data: orgs, error: listError } = await supabase
      .from('orgs')
      .select('*')
      .limit(1);

    if (listError && listError.code !== '403') throw listError;

    // Store org ID for later use
    if (orgs && orgs.length > 0) {
      testOrgId = orgs[0].id;

      results.push({
        endpoint: 'GET /orgs',
        method: 'SELECT',
        status: 'pass',
        message: `Retrieved ${orgs.length} organization(s)`,
        duration: performance.now() - start,
        data: { id: testOrgId, name: orgs[0].name }
      });
    } else {
      throw new Error('No organizations found - ensure test data is seeded');
    }
  } catch (error) {
    results.push({
      endpoint: 'GET /orgs',
      method: 'SELECT',
      status: 'fail',
      message: 'Failed to list organizations',
      duration: performance.now() - start,
      error: String(error)
    });
  }
}

// ============================================================================
// PROJECT TESTS
// ============================================================================

async function testProjectEndpoints() {
  // GET /projects - List projects
  const start1 = performance.now();
  try {
    const projects = await ProjectsProvider.list();

    results.push({
      endpoint: 'GET /projects',
      method: 'SELECT',
      status: 'pass',
      message: `Retrieved ${projects.length} project(s)`,
      duration: performance.now() - start1,
      data: projects.length > 0 ? { id: projects[0].id } : null
    });

    if (projects.length > 0) {
      testProjectId = projects[0].id;
    }
  } catch (error) {
    results.push({
      endpoint: 'GET /projects',
      method: 'SELECT',
      status: 'fail',
      message: 'Failed to list projects',
      duration: performance.now() - start1,
      error: String(error)
    });
  }

  // GET /projects/:id - Get single project
  if (testProjectId) {
    const start2 = performance.now();
    try {
      const project = await ProjectsProvider.get(testProjectId);

      results.push({
        endpoint: `GET /projects/${testProjectId}`,
        method: 'SELECT',
        status: 'pass',
        message: `Retrieved project: ${project.name}`,
        duration: performance.now() - start2,
        data: { id: project.id, status: project.status }
      });
    } catch (error) {
      results.push({
        endpoint: `GET /projects/${testProjectId}`,
        method: 'SELECT',
        status: 'fail',
        message: 'Failed to get project',
        duration: performance.now() - start2,
        error: String(error)
      });
    }
  }

  // POST /projects - Create project
  const start3 = performance.now();
  try {
    const newProject = await ProjectsProvider.create({
      name: `API Test Project ${Date.now()}`,
      industry: 'retail',
      tier: 'premium'
    });

    results.push({
      endpoint: 'POST /projects',
      method: 'INSERT',
      status: 'pass',
      message: `Created project: ${newProject.name}`,
      duration: performance.now() - start3,
      data: { id: newProject.id }
    });

    // Store for later tests
    testProjectId = newProject.id;
  } catch (error) {
    results.push({
      endpoint: 'POST /projects',
      method: 'INSERT',
      status: 'fail',
      message: 'Failed to create project',
      duration: performance.now() - start3,
      error: String(error)
    });
  }
}

// ============================================================================
// ASSET TESTS
// ============================================================================

async function testAssetEndpoints() {
  if (!testProjectId) {
    results.push({
      endpoint: 'GET /assets',
      method: 'SELECT',
      status: 'skip',
      message: 'Skipped - no test project available',
      duration: 0
    });
    return;
  }

  // GET /assets - List assets
  const start1 = performance.now();
  try {
    const assets = await AssetsProvider.list({ projectId: testProjectId });

    results.push({
      endpoint: 'GET /assets',
      method: 'SELECT',
      status: 'pass',
      message: `Retrieved ${assets.length} asset(s)`,
      duration: performance.now() - start1
    });
  } catch (error) {
    results.push({
      endpoint: 'GET /assets',
      method: 'SELECT',
      status: 'fail',
      message: 'Failed to list assets',
      duration: performance.now() - start1,
      error: String(error)
    });
  }

  // POST /assets - Create asset
  const start2 = performance.now();
  try {
    const newAsset = await AssetsProvider.create({
      projectId: testProjectId,
      name: `Test Photo ${Date.now()}`,
      type: 'photo',
      fileKey: `test/photo-${Date.now()}.jpg`,
      fileSize: 1024000,
      contentType: 'image/jpeg'
    });

    results.push({
      endpoint: 'POST /assets',
      method: 'INSERT',
      status: 'pass',
      message: `Created asset: ${newAsset.name}`,
      duration: performance.now() - start2,
      data: { id: newAsset.id }
    });

    testAssetId = newAsset.id;
  } catch (error) {
    results.push({
      endpoint: 'POST /assets',
      method: 'INSERT',
      status: 'fail',
      message: 'Failed to create asset',
      duration: performance.now() - start2,
      error: String(error)
    });
  }

  // GET /assets/:id - Get single asset
  if (testAssetId) {
    const start3 = performance.now();
    try {
      const asset = await AssetsProvider.get(testAssetId);

      results.push({
        endpoint: `GET /assets/${testAssetId}`,
        method: 'SELECT',
        status: 'pass',
        message: `Retrieved asset: ${asset.name}`,
        duration: performance.now() - start3
      });
    } catch (error) {
      results.push({
        endpoint: `GET /assets/${testAssetId}`,
        method: 'SELECT',
        status: 'fail',
        message: 'Failed to get asset',
        duration: performance.now() - start3,
        error: String(error)
      });
    }
  }
}

// ============================================================================
// WORKFLOW TESTS
// ============================================================================

async function testWorkflowEndpoints() {
  if (!testProjectId) {
    results.push({
      endpoint: 'PATCH /projects/:id/approve',
      method: 'UPDATE',
      status: 'skip',
      message: 'Skipped - no test project available',
      duration: 0
    });
    return;
  }

  // Approve project
  const start1 = performance.now();
  try {
    const approved = await ProjectsProvider.approve(testProjectId);

    results.push({
      endpoint: 'PATCH /projects/:id/approve',
      method: 'UPDATE',
      status: 'pass',
      message: `Project approved, status: ${approved.status}`,
      duration: performance.now() - start1,
      data: { status: approved.status }
    });
  } catch (error) {
    results.push({
      endpoint: 'PATCH /projects/:id/approve',
      method: 'UPDATE',
      status: 'fail',
      message: 'Failed to approve project',
      duration: performance.now() - start1,
      error: String(error)
    });
  }

  // Start project
  const start2 = performance.now();
  try {
    const started = await ProjectsProvider.start(testProjectId);

    results.push({
      endpoint: 'PATCH /projects/:id/start',
      method: 'UPDATE',
      status: 'pass',
      message: `Project started, status: ${started.status}`,
      duration: performance.now() - start2,
      data: { status: started.status }
    });
  } catch (error) {
    results.push({
      endpoint: 'PATCH /projects/:id/start',
      method: 'UPDATE',
      status: 'fail',
      message: 'Failed to start project',
      duration: performance.now() - start2,
      error: String(error)
    });
  }

  // Deliver project
  const start3 = performance.now();
  try {
    const delivered = await ProjectsProvider.deliver(testProjectId);

    results.push({
      endpoint: 'PATCH /projects/:id/deliver',
      method: 'UPDATE',
      status: 'pass',
      message: `Project delivered, status: ${delivered.status}`,
      duration: performance.now() - start3,
      data: { status: delivered.status }
    });
  } catch (error) {
    results.push({
      endpoint: 'PATCH /projects/:id/deliver',
      method: 'UPDATE',
      status: 'fail',
      message: 'Failed to deliver project',
      duration: performance.now() - start3,
      error: String(error)
    });
  }
}

// ============================================================================
// PAGINATION TESTS
// ============================================================================

async function testPaginationEndpoints() {
  const start = performance.now();

  try {
    // Test cursor-based pagination
    const { projects: firstPage, nextCursor: cursor1 } = await (
      await import('@/services/api/real/projects')
    ).fetchProjects({ limit: 1 });

    if (!cursor1) {
      throw new Error('No cursor returned for pagination');
    }

    // Fetch second page using cursor
    const { projects: secondPage } = await (
      await import('@/services/api/real/projects')
    ).fetchProjects({ limit: 1, cursor: cursor1 });

    results.push({
      endpoint: 'GET /projects?cursor=...',
      method: 'SELECT',
      status: 'pass',
      message: 'Cursor-based pagination working',
      duration: performance.now() - start,
      data: {
        firstPageSize: firstPage.length,
        secondPageSize: secondPage.length,
        cursorWorks: firstPage[0]?.id !== secondPage[0]?.id
      }
    });
  } catch (error) {
    results.push({
      endpoint: 'GET /projects?cursor=...',
      method: 'SELECT',
      status: 'fail',
      message: 'Pagination test failed',
      duration: performance.now() - start,
      error: String(error)
    });
  }
}

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

async function testErrorHandling() {
  // Test: Invalid table name
  const start1 = performance.now();
  try {
    const { data, error } = await supabase
      .from('invalid_table_name')
      .select('*')
      .limit(1);

    if (error) {
      results.push({
        endpoint: 'GET /invalid_table_name',
        method: 'SELECT',
        status: 'pass',
        message: 'Error handling works - invalid table rejected',
        duration: performance.now() - start1,
        data: { errorCode: error.code }
      });
    } else {
      throw new Error('Should have returned error for invalid table');
    }
  } catch (error) {
    results.push({
      endpoint: 'GET /invalid_table_name',
      method: 'SELECT',
      status: 'fail',
      message: 'Error handling test failed',
      duration: performance.now() - start1,
      error: String(error)
    });
  }

  // Test: Invalid UUID
  const start2 = performance.now();
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', 'not-a-uuid')
      .single();

    results.push({
      endpoint: 'GET /projects?id=not-a-uuid',
      method: 'SELECT',
      status: error ? 'pass' : 'fail',
      message: error ? 'Invalid UUID properly rejected' : 'Should reject invalid UUID',
      duration: performance.now() - start2
    });
  } catch (error) {
    results.push({
      endpoint: 'GET /projects?id=not-a-uuid',
      method: 'SELECT',
      status: 'pass',
      message: 'Invalid UUID properly rejected',
      duration: performance.now() - start2
    });
  }
}

// ============================================================================
// PRINT RESULTS
// ============================================================================

function printAPITestSummary() {
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;

  console.log('\n%c📊 TEST RESULTS', 'font-size: 14px; font-weight: bold;');
  console.log('====================================\n');

  results.forEach(result => {
    const icon = {
      pass: '✅',
      fail: '❌',
      skip: '⊘ '
    }[result.status];

    console.log(`${icon} ${result.endpoint} [${result.method}]`);
    console.log(`   ${result.message}`);
    console.log(`   ⏱️  ${result.duration.toFixed(2)}ms`);

    if (result.data) {
      console.log(`   📦 ${JSON.stringify(result.data)}`);
    }

    if (result.error) {
      console.log(`   ❌ ${result.error}`);
    }

    console.log();
  });

  console.log('%c📈 SUMMARY', 'font-size: 14px; font-weight: bold;');
  console.log(`✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`⊘  Skipped: ${skipped}`);
  console.log(`Total: ${results.length}`);

  if (failed > 0) {
    console.log(
      '\n%c⚠️  TESTS FAILED - Check errors above',
      'color: #dc2626; font-weight: bold;'
    );
  } else if (passed === results.length) {
    console.log(
      '\n%c✨ ALL TESTS PASSED - API endpoints working!',
      'color: #10b981; font-weight: bold;'
    );
  } else {
    console.log(
      '\n%c✅ TESTS PASSED WITH SKIPS - Check skipped items above',
      'color: #f59e0b; font-weight: bold;'
    );
  }
}

export default testAPIEndpoints;
