import React from 'react';
import { FileUp, MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'upload',
      actor: { name: 'Sarah Chen', initials: 'SC' },
      message: 'Uploaded 5 new assets for Summer Collection',
      detail: '2.4 MB in 3 files',
      time: '2 hours ago',
      icon: FileUp,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
      badge: 'Upload',
      actionable: false,
    },
    {
      id: 2,
      type: 'status',
      actor: { name: 'Alex Rodriguez', initials: 'AR' },
      message: 'Moved "Summer Collection" to QA Review',
      detail: 'Awaiting team approval',
      time: '5 hours ago',
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      accentColor: 'text-green-600 dark:text-green-400',
      badge: 'Status Update',
      actionable: false,
    },
    {
      id: 3,
      type: 'comment',
      actor: { name: 'Jordan Park', initials: 'JP' },
      message: 'Commented on Sneaker_001.glb: "Need better lighting angles"',
      detail: 'Requires revision',
      time: '1 day ago',
      icon: MessageSquare,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      accentColor: 'text-orange-600 dark:text-orange-400',
      badge: 'Comment',
      actionable: true,
    },
    {
      id: 4,
      type: 'alert',
      actor: { name: 'System', initials: '⚠️' },
      message: 'Action Required: Review Vase_Ancient.glb',
      detail: 'QA approval needed (48+ hours pending)',
      time: '2 days ago',
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      accentColor: 'text-red-600 dark:text-red-400',
      badge: 'Attention',
      actionable: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Team updates and project progress
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          {activities.length} updates
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 rounded-lg border transition-colors ${activity.bgColor} border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 ${
              activity.actionable ? 'ring-1 ring-yellow-400/50' : ''
            }`}
          >
            {/* Timeline connector */}
            {index < activities.length - 1 && (
              <div className="absolute left-[31px] top-full h-2 w-0.5 bg-zinc-200 dark:bg-zinc-700 -z-10" />
            )}

            {/* Actor Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${activity.accentColor} ${activity.bgColor} md:order-none order-2`}
            >
              {activity.actor.initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 md:order-none order-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-2 mb-1">
                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                  <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                    {activity.actor.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${activity.accentColor} ${activity.bgColor}`}
                  >
                    {activity.badge}
                  </span>
                </div>
                {activity.actionable && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                    <Clock className="w-3 h-3" /> Action needed
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-snug">
                {activity.message}
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-2 mt-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.detail}</p>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 md:whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            </div>

            {/* Action Icon */}
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${activity.accentColor} md:order-none order-3`}
            >
              <activity.icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-2 px-3 text-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800">
        View full activity log →
      </button>
    </div>
  );
};
