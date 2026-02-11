/**
 * Analytics Dashboard Service
 *
 * Aggregates raw analytics events into business KPIs and metrics.
 * Supports time-based aggregation (daily, weekly, monthly) and filtering by org/project.
 *
 * Metrics calculated:
 * - User engagement (active users, session duration, page views)
 * - Project metrics (completion rate, avg delivery time, approval rate)
 * - Asset metrics (upload success rate, processing efficiency)
 * - Financial metrics (revenue, payout approvals, payment rate)
 * - QA metrics (submission rate, approval rate, rework rate)
 */

export interface DashboardMetrics {
  // User engagement
  activeUsers: number;
  newUsers: number;
  sessionDuration: number; // minutes
  pageViewsTotal: number;
  pageViewsAvgPerSession: number;

  // Project metrics
  projectsCreated: number;
  projectsApproved: number;
  approvalRate: number; // 0-100%
  avgProjectDuration: number; // days
  deliveryRate: number; // 0-100%
  rejectionRate: number; // 0-100%

  // Asset metrics
  assetsUploaded: number;
  uploadSuccessRate: number; // 0-100%
  avgUploadSize: number; // MB
  failedUploads: number;
  avgProcessingTime: number; // minutes

  // Financial metrics
  totalRevenue: number; // cents
  payoutsCreated: number;
  payoutsApproved: number;
  payoutApprovalRate: number; // 0-100%
  payoutsPaid: number;
  paymentRate: number; // 0-100%
  avgPayoutAmount: number; // cents
  photographers: number;

  // QA metrics
  qaSubmissions: number;
  qaApprovals: number;
  qaApprovalRate: number; // 0-100%
  qaRework: number;
  reworkRate: number; // 0-100%

  // Time period
  period: 'daily' | 'weekly' | 'monthly';
  dateFrom: string; // ISO timestamp
  dateTo: string; // ISO timestamp
  generatedAt: string; // ISO timestamp
}

export interface MetricsFilter {
  orgId?: string;
  projectId?: string;
  photographerId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  dateFrom?: string; // ISO timestamp
  dateTo?: string; // ISO timestamp
}

/**
 * Calculate engagement metrics
 */
export function calculateEngagementMetrics(events: any[], dateFrom: string, dateTo: string) {
  const userSignins = events.filter(e => e.eventType === 'user_signed_in').length;
  const userSignouts = events.filter(e => e.eventType === 'user_signed_out').length;
  const pageViews = events.filter(e => e.eventType === 'page_viewed').length;
  const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean)).size;

  // Estimate session duration (5 min per page view, simplified)
  const estimatedSessionDuration = pageViews > 0 ? Math.round((pageViews * 5) / Math.max(userSignins, 1)) : 0;

  return {
    activeUsers: uniqueUsers,
    newUsers: userSignins,
    sessionDuration: estimatedSessionDuration,
    pageViewsTotal: pageViews,
    pageViewsAvgPerSession: userSignins > 0 ? Math.round(pageViews / userSignins) : 0
  };
}

/**
 * Calculate project workflow metrics
 */
export function calculateProjectMetrics(events: any[]) {
  const projectCreated = events.filter(e => e.eventType === 'project_created').length;
  const projectApproved = events.filter(e => e.eventType === 'project_approved').length;
  const projectDelivered = events.filter(e => e.eventType === 'project_delivered').length;
  const projectRejected = events.filter(e => e.eventType === 'project_rejected').length;

  const approvalRate = projectCreated > 0 ? Math.round((projectApproved / projectCreated) * 100) : 0;
  const deliveryRate = projectApproved > 0 ? Math.round((projectDelivered / projectApproved) * 100) : 0;
  const rejectionRate = projectCreated > 0 ? Math.round((projectRejected / projectCreated) * 100) : 0;

  // Estimate avg duration (7 days default)
  const avgProjectDuration = 7;

  return {
    projectsCreated: projectCreated,
    projectsApproved: projectApproved,
    approvalRate,
    avgProjectDuration,
    deliveryRate,
    rejectionRate
  };
}

/**
 * Calculate asset upload metrics
 */
export function calculateAssetMetrics(events: any[]) {
  const uploadStarted = events.filter(e => e.eventType === 'asset_upload_started').length;
  const uploadCompleted = events.filter(e => e.eventType === 'asset_upload_completed').length;
  const uploadFailed = events.filter(e => e.eventType === 'asset_upload_failed').length;

  const uploadSuccessRate = uploadStarted > 0 ? Math.round((uploadCompleted / uploadStarted) * 100) : 0;

  // Calculate avg size from properties (estimate 2 MB per asset)
  const avgUploadSize = 2;

  // Processing time (estimate 30 minutes)
  const avgProcessingTime = 30;

  return {
    assetsUploaded: uploadCompleted,
    uploadSuccessRate,
    avgUploadSize,
    failedUploads: uploadFailed,
    avgProcessingTime
  };
}

/**
 * Calculate financial metrics
 */
export function calculateFinancialMetrics(events: any[]) {
  const payoutCreated = events.filter(e => e.eventType === 'payout_requested').length;
  const payoutApproved = events.filter(e => e.eventType === 'payout_approved').length;
  const payoutPaid = events.filter(e => e.eventType === 'payout_paid').length;

  const payoutApprovalRate = payoutCreated > 0 ? Math.round((payoutApproved / payoutCreated) * 100) : 0;
  const paymentRate = payoutApproved > 0 ? Math.round((payoutPaid / payoutApproved) * 100) : 0;

  // Estimate metrics (will be fetched from real data in Phase 3)
  const totalRevenue = payoutPaid * 50000; // $500 per payout (estimate)
  const avgPayoutAmount = payoutApproved > 0 ? Math.round(totalRevenue / payoutApproved) : 0;
  const uniquePhotographers = new Set(
    events
      .filter(e => ['payout_requested', 'payout_approved', 'payout_paid'].includes(e.eventType))
      .map(e => e.properties?.photographer_id)
      .filter(Boolean)
  ).size;

  return {
    totalRevenue,
    payoutsCreated: payoutCreated,
    payoutsApproved: payoutApproved,
    payoutApprovalRate,
    payoutsPaid: payoutPaid,
    paymentRate,
    avgPayoutAmount,
    photographers: uniquePhotographers
  };
}

/**
 * Calculate QA workflow metrics
 */
export function calculateQAMetrics(events: any[]) {
  const qaSubmitted = events.filter(e => e.eventType === 'qa_submitted').length;
  const qaApproved = events.filter(e => e.eventType === 'qa_approved').length;
  const qaChangesRequested = events.filter(e => e.eventType === 'qa_changes_requested').length;
  const qaRejected = events.filter(e => e.eventType === 'qa_rejected').length;

  const totalQAEvents = qaSubmitted + qaApproved + qaChangesRequested + qaRejected;
  const qaApprovalRate = qaSubmitted > 0 ? Math.round((qaApproved / qaSubmitted) * 100) : 0;
  const reworkRate = qaSubmitted > 0 ? Math.round(((qaChangesRequested + qaRejected) / qaSubmitted) * 100) : 0;

  return {
    qaSubmissions: qaSubmitted,
    qaApprovals: qaApproved,
    qaApprovalRate,
    qaRework: qaChangesRequested + qaRejected,
    reworkRate
  };
}

/**
 * Aggregate all metrics into dashboard summary
 */
export function aggregateDashboardMetrics(
  events: any[],
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  dateFrom: string = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  dateTo: string = new Date().toISOString()
): DashboardMetrics {
  const engagement = calculateEngagementMetrics(events, dateFrom, dateTo);
  const projects = calculateProjectMetrics(events);
  const assets = calculateAssetMetrics(events);
  const financial = calculateFinancialMetrics(events);
  const qa = calculateQAMetrics(events);

  return {
    ...engagement,
    ...projects,
    ...assets,
    ...financial,
    ...qa,
    period,
    dateFrom,
    dateTo,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Format metrics for display
 */
export function formatMetricsForDisplay(metrics: DashboardMetrics): Record<string, string | number> {
  return {
    'Active Users': metrics.activeUsers,
    'Page Views': metrics.pageViewsTotal,
    'Avg Session Duration': `${metrics.sessionDuration}m`,
    'Projects Created': metrics.projectsCreated,
    'Approval Rate': `${metrics.approvalRate}%`,
    'Delivery Rate': `${metrics.deliveryRate}%`,
    'Assets Uploaded': metrics.assetsUploaded,
    'Upload Success Rate': `${metrics.uploadSuccessRate}%`,
    'Total Revenue': `$${(metrics.totalRevenue / 100).toFixed(2)}`,
    'Payouts Approved': metrics.payoutsApproved,
    'Payment Rate': `${metrics.paymentRate}%`,
    'QA Approval Rate': `${metrics.qaApprovalRate}%`,
    'Rework Rate': `${metrics.reworkRate}%`,
    'Photographers': metrics.photographers
  };
}

/**
 * Trend calculation (compare periods)
 */
export interface MetricsTrend {
  metric: string;
  current: number;
  previous: number;
  change: number; // percentage
  isPositive: boolean;
}

export function calculateMetricsTrend(current: DashboardMetrics, previous: DashboardMetrics): MetricsTrend[] {
  const metrics = [
    { key: 'activeUsers', label: 'Active Users' },
    { key: 'pageViewsTotal', label: 'Page Views' },
    { key: 'projectsCreated', label: 'Projects Created' },
    { key: 'approvalRate', label: 'Approval Rate' },
    { key: 'deliveryRate', label: 'Delivery Rate' },
    { key: 'uploadSuccessRate', label: 'Upload Success Rate' },
    { key: 'payoutsApproved', label: 'Payouts Approved' },
    { key: 'paymentRate', label: 'Payment Rate' }
  ];

  return metrics.map(({ key, label }) => {
    const currentVal = current[key as keyof DashboardMetrics] as number;
    const previousVal = previous[key as keyof DashboardMetrics] as number;
    const change = previousVal > 0 ? Math.round(((currentVal - previousVal) / previousVal) * 100) : 0;

    return {
      metric: label,
      current: currentVal,
      previous: previousVal,
      change,
      isPositive: change >= 0
    };
  });
}

/**
 * Export metrics as JSON
 */
export function exportMetricsAsJSON(metrics: DashboardMetrics): string {
  return JSON.stringify(metrics, null, 2);
}

/**
 * Export metrics as CSV
 */
export function exportMetricsAsCSV(metrics: DashboardMetrics): string {
  const data = formatMetricsForDisplay(metrics);
  const headers = ['Metric', 'Value'];
  const rows = Object.entries(data).map(([metric, value]) => [metric, value]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  return csv;
}
