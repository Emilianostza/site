/**
 * Analytics Dashboard Page
 *
 * Displays business metrics and KPIs for project managers, finance, and admins.
 * Shows real-time user engagement, project completion rates, financial metrics, and QA performance.
 *
 * Permission levels:
 * - Admin: See all org metrics
 * - Finance: See financial/payout metrics
 * - PM: See project/asset metrics
 */

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Zap, FileText, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import { MetricCard, MetricGrid, MetricCardSkeleton } from '@/components/analytics/MetricCard';
import { exportMetricsAsCSV, exportMetricsAsJSON } from '@/services/analytics/dashboard';

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { metrics, loading, error, isRefreshing, refresh, trends, clearError } = useAnalyticsDashboard({
    period,
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute
  });

  const handleExport = (format: 'csv' | 'json') => {
    if (!metrics) return;

    let content: string;
    let filename: string;

    if (format === 'csv') {
      content = exportMetricsAsCSV(metrics);
      filename = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      content = exportMetricsAsJSON(metrics);
      filename = `analytics-${period}-${new Date().toISOString().split('T')[0]}.json`;
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error && !metrics) {
    return (
      <div className="p-6 bg-white rounded-lg border border-red-200">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-semibold">Failed to load analytics</h3>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={refresh}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm text-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={32} className="text-brand-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time business metrics and KPIs
            {metrics && (
              <span className="text-sm text-gray-500 ml-2">
                Updated {new Date(metrics.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRefreshing && (
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Updating...
            </div>
          )}
          <button
            onClick={refresh}
            disabled={loading || isRefreshing}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Period:</span>
        {(['daily', 'weekly', 'monthly'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              period === p
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={!metrics}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-sm rounded-lg font-medium transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={!metrics}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-sm rounded-lg font-medium transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      {loading && !metrics ? (
        // Loading state
        <div className="space-y-4">
          <MetricGrid columns={3}>
            {[...Array(6)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </MetricGrid>
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          {/* User Engagement */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              User Engagement
            </h2>
            <MetricGrid columns={4}>
              <MetricCard
                title="Active Users"
                value={metrics.activeUsers}
                trend={trends.find(t => t.metric === 'Active Users')}
                icon={<Users size={20} />}
                color="blue"
              />
              <MetricCard
                title="New Users"
                value={metrics.newUsers}
                subtitle="This period"
                icon={<TrendingUp size={20} />}
                color="green"
              />
              <MetricCard
                title="Page Views"
                value={metrics.pageViewsTotal}
                trend={trends.find(t => t.metric === 'Page Views')}
                icon={<FileText size={20} />}
                color="purple"
              />
              <MetricCard
                title="Avg Session Duration"
                value={`${metrics.sessionDuration}m`}
                subtitle="Per user"
                icon={<Zap size={20} />}
                color="orange"
              />
            </MetricGrid>
          </section>

          {/* Project Workflow */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-brand-600" />
              Project Workflow
            </h2>
            <MetricGrid columns={3}>
              <MetricCard
                title="Projects Created"
                value={metrics.projectsCreated}
                trend={trends.find(t => t.metric === 'Projects Created')}
                icon={<FileText size={20} />}
                color="brand"
              />
              <MetricCard
                title="Approval Rate"
                value={`${metrics.approvalRate}%`}
                subtitle={`${metrics.projectsApproved} approved`}
                trend={trends.find(t => t.metric === 'Approval Rate')}
                icon={<CheckCircle2 size={20} />}
                color="green"
              />
              <MetricCard
                title="Delivery Rate"
                value={`${metrics.deliveryRate}%`}
                subtitle={`${metrics.projectsApproved} total approved`}
                trend={trends.find(t => t.metric === 'Delivery Rate')}
                icon={<TrendingUp size={20} />}
                color="green"
              />
            </MetricGrid>
          </section>

          {/* Asset Management */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-purple-600" />
              Asset Management
            </h2>
            <MetricGrid columns={3}>
              <MetricCard
                title="Assets Uploaded"
                value={metrics.assetsUploaded}
                subtitle="Successfully processed"
                icon={<Zap size={20} />}
                color="purple"
              />
              <MetricCard
                title="Upload Success Rate"
                value={`${metrics.uploadSuccessRate}%`}
                subtitle={`${metrics.failedUploads} failed`}
                trend={trends.find(t => t.metric === 'Upload Success Rate')}
                icon={<CheckCircle2 size={20} />}
                color="green"
              />
              <MetricCard
                title="Avg Processing Time"
                value={`${metrics.avgProcessingTime}m`}
                subtitle="Per asset"
                icon={<TrendingUp size={20} />}
                color="orange"
              />
            </MetricGrid>
          </section>

          {/* Financial Metrics */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Financial Metrics
            </h2>
            <MetricGrid columns={4}>
              <MetricCard
                title="Total Revenue"
                value={`$${(metrics.totalRevenue / 100).toFixed(2)}`}
                subtitle="Net of platform fees"
                icon={<DollarSign size={20} />}
                color="green"
              />
              <MetricCard
                title="Payouts Approved"
                value={metrics.payoutsApproved}
                trend={trends.find(t => t.metric === 'Payouts Approved')}
                icon={<CheckCircle2 size={20} />}
                color="green"
              />
              <MetricCard
                title="Payment Rate"
                value={`${metrics.paymentRate}%`}
                subtitle={`${metrics.payoutsPaid} paid`}
                trend={trends.find(t => t.metric === 'Payment Rate')}
                icon={<TrendingUp size={20} />}
                color="green"
              />
              <MetricCard
                title="Active Photographers"
                value={metrics.photographers}
                subtitle="With payouts"
                icon={<Users size={20} />}
                color="brand"
              />
            </MetricGrid>
          </section>

          {/* QA Performance */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600" />
              QA Performance
            </h2>
            <MetricGrid columns={3}>
              <MetricCard
                title="QA Submissions"
                value={metrics.qaSubmissions}
                subtitle="Under review"
                icon={<FileText size={20} />}
                color="blue"
              />
              <MetricCard
                title="QA Approval Rate"
                value={`${metrics.qaApprovalRate}%`}
                subtitle={`${metrics.qaApprovals} approved`}
                trend={trends.find(t => t.metric === 'QA Approval Rate')}
                icon={<CheckCircle2 size={20} />}
                color="green"
              />
              <MetricCard
                title="Rework Rate"
                value={`${metrics.reworkRate}%`}
                subtitle={`${metrics.qaRework} items`}
                icon={<AlertCircle size={20} />}
                color={metrics.reworkRate > 20 ? 'red' : 'orange'}
              />
            </MetricGrid>
          </section>

          {/* Data Summary */}
          <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Data Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Period:</span>
                <p className="text-gray-900 font-medium">{metrics.period}</p>
              </div>
              <div>
                <span className="text-gray-600">From:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(metrics.dateFrom).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">To:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(metrics.dateTo).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Generated:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(metrics.generatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
