import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';
import { ProjectStatus } from '@/types';

interface ProjectProgressProps {
    currentStatus: ProjectStatus;
    projectName: string;
}

const STEPS = [
    { id: 'Intake', label: 'Intake' },
    { id: 'Capture', label: 'Capture' },
    { id: 'Processing', label: 'Processing' },
    { id: 'QA', label: 'QA' },
    { id: 'Ready for Review', label: 'Review' },
    { id: 'Published', label: 'Done' }
];

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ currentStatus, projectName }) => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStatus);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Project Status: <span className="text-brand-600">{projectName}</span>
            </h3>

            <div className="relative flex items-center justify-between w-full mt-8">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-0" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 -z-0 transition-all duration-500"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted
                                        ? 'bg-brand-600 border-brand-600 text-white'
                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-300'
                                    }
                  ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/30 scale-110' : ''}
                `}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </div>
                            <span className={`absolute top-10 text-xs font-medium whitespace-nowrap transition-colors
                ${isCurrent ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'}
              `}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
