import React from 'react';
import { FileUp, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
    const activities = [
        { id: 1, type: 'upload', message: 'New assets uploaded for "Summer Collection"', time: '2 hours ago', icon: FileUp, color: 'text-blue-500 bg-blue-500/10' },
        { id: 2, type: 'status', message: 'Project "Summer Collection" moved to QA', time: '5 hours ago', icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
        { id: 3, type: 'comment', message: 'New comment on "Sneaker_001.glb"', time: '1 day ago', icon: MessageSquare, color: 'text-orange-500 bg-orange-500/10' },
        { id: 4, type: 'alert', message: 'Action required: Review "Vase_Ancient.glb"', time: '2 days ago', icon: AlertCircle, color: 'text-red-500 bg-red-500/10' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 items-start">
                        <div className={`p-2 rounded-full flex-shrink-0 ${activity.color}`}>
                            <activity.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-tight">
                                {activity.message}
                            </p>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
